import sys
import six
sys.path.append('..')
stdin, stdout, stderr = sys.stdin, sys.stdout, sys.stderr
if six.PY3:
    from queue import Queue, Empty as QueueEmpty
    from functools import reduce
else:
    from Queue import Queue, Empty as QueueEmpty
    reload(sys).setdefaultencoding('utf8')
    sys.stdin, sys.stdout, sys.stderr = stdin, stdout, stderr
import threading
import time
import platform
import os
import traceback
import re

from functools import wraps
from log import logger
import gl
from . import gcoder
from serial import SerialException
from .utils import install_locale, decode_utf8
install_locale('pronterface')

def locked(func):
    @wraps(func)
    def inner(*args, **kwargs):
        with inner.lock:
            return func(*args, **kwargs)
    inner.lock = threading.Lock()
    return inner

def control_ttyhup(port, disable_hup):
    """Controls the HUPCL"""
    if platform.system() == "Linux":
        if disable_hup:
            os.system("stty -F %s -hup" % port)
        else:
            os.system("stty -F %s hup" % port)

def enable_hup(port):
    control_ttyhup(port, False)

def disable_hup(port):
    control_ttyhup(port, True)

class UArmPrintCore(object):
    def __init__(self):
        super(UArmPrintCore, self).__init__()
        self.analyzer = gcoder.GCode()
        self.errorcb = None
        self.printing = False
        self.paused = False
        self.online = False
        self.wait = False
        self.sent = []
        self.sentlines = {}
        self.priqueue = Queue(0)
        self.greetings = ['start', 'Grbl ']

        self.mainqueue = None
        self.queueindex = 0
        self.lineno = 0
        self.resendfrom = -1
        self.clear = False

        self.read_thread = None
        self.print_thread = None
        self.stop_read_thread = False
        self.send_thread = None
        self.stop_send_thread = False

        self.xy_feedrate = None
        self.z_feedrate = None

        self.writefailures = 0
        self.current_temperature = 0.0
        self.target_temperature = 0.0

        self.timeout = 5

        self.connect()

    def _checksum(self, command):
        return reduce(lambda x, y: x ^ y, map(ord, command))

    def process_host_command(self, command):
        """only ;@pause command is implemented as a host command in printcore, but hosts are free to reimplement this method"""
        command = command.lstrip()
        if command.startswith(";@pause"):
            self.pause()

    @locked
    def connect(self):
        self.stop_read_thread = False
        self.read_thread = threading.Thread(target=self._listen)
        self.read_thread.start()
        self._start_sender()

    def _listen_can_continue(self):
        return (not self.stop_read_thread and gl.uarm_connected)

    def _listen_until_online(self):
        while not self.online and self._listen_can_continue():
            # if gl.uarm.online:
            #     self.online = gl.uarm.online
            #     break
            # time.sleep(0.5)
            self._send('M105')
            time.sleep(1)
            if self.writefailures >= 5:
                logger.error("Aborting connection attempt after 5 writes.")
                return
            empty_lines = 0
            while self._listen_can_continue():
                line = gl.uarm.get_line()
                if line is None:
                    break
                if not line:
                    empty_lines += 1
                    if empty_lines == 15:
                        break
                else:
                    empty_lines = 0
                if line.startswith(tuple(self.greetings)) or line.startswith('ok') or 'T:' in line:
                    self.online = True
                    return

    def _listen(self):
        self.clear = True
        if not self.printing:
            self._listen_until_online()
        while self._listen_can_continue():
            line = gl.uarm.get_line()
            if line is None:
                continue
            if line.startswith('DEBUG_'):
                continue
            if line.startswith(tuple(self.greetings)) or line.startswith('ok'):
                self.clear = True
            if 'T:' in line:
                r = re.search(r"T:(\d+\S\d+\s/\d+\S\d+)?", line)
                if r:
                    tmp = r.group(1)
                    t1, t2 = tmp.split(' /')
                    self.current_temperature = float(t1)
                    self.target_temperature = float(t2)
            elif line.startswith('Error'):
                logger.error(line)
                if 'Error:MINTEMP triggered, sys' in line:
                    gl.boardcast_uarm_printing_error(line)
                # pass
            elif line.lower().startswith("resend") or line.startswith("rs"):
                for haystack in ["N:", "N", ":"]:
                    line = line.replace(haystack, " ")
                linewords = line.split()
                print('resend:', line)
                while len(linewords) != 0:
                    try:
                        toresend = int(linewords.pop(0))
                        self.resendfrom = toresend
                        break
                    except:
                        pass
                self.clear = True
        self.clear = True

    def _start_sender(self):
        self.stop_send_thread = False
        self.send_thread = threading.Thread(target=self._sender)
        self.send_thread.start()

    def _stop_sender(self):
        if self.send_thread:
            self.stop_send_thread = True
            self.send_thread.join()
            self.send_thread = None

    def _sender(self):
        while not self.stop_send_thread:
            try:
                command = self.priqueue.get(True, 0.1)
            except QueueEmpty:
                continue
            while gl.uarm_connected and self.printing and not self.clear:
                time.sleep(0.001)
            self._send(command)
            while gl.uarm_connected and self.printing and not self.clear:
                time.sleep(0.001)

    def pause(self):
        if not gl.uarm_connected or not self.printing:
            return False
        self.paused = True
        self.printing = False
        # gl.uarm.set_report_position(0)

        try:
            self.print_thread.join()
        except RuntimeError as e:
            if e.message == 'cnanot join current thread':
                pass
            else:
                logger.error(traceback.format_exc())
        except:
            logger.error(traceback.format_exc())

        self.print_thread = None

        # save the printing status
        self.pauseX = self.analyzer.abs_x
        self.pauseY = self.analyzer.abs_y
        self.pauseZ = self.analyzer.abs_z
        self.pauseE = self.analyzer.abs_e
        self.pauseF = self.analyzer.current_f
        self.pauseRelative = self.analyzer.relative
        return True

    def resume(self):
        if not self.paused:
            return False
        # self.send_now('G90')
        # xyFeedString = ''
        # zFeedString = ''
        # if self.xy_feedrate is not None:
        #     xyFeedString = ' F' + str(self.xy_feedrate)
        # if self.z_feedrate is not None:
        #     zFeedString = ' F' + str(self.z_feedrate)
        #
        # self.send_now('G1 X%s Y%s%s' % (self.pauseX, self.pauseY, xyFeedString))
        # self.send_now('G1 Z' + str(self.pauseZ) + zFeedString)
        # self.send_now('G92 E' + str(self.pauseE))
        #
        # # go back to relative if needed
        # if self.pauseRelative:
        #     self.send_now("G91")
        # # reset old feed rate
        # self.send_now("G1 F" + str(self.pauseF))

        self.printing = True
        gl.uarm_printing_state = True
        self.paused = False
        # gl.uarm.set_report_position(0.5)
        self.print_thread = threading.Thread(target=self._print, kwargs={"resuming": True})
        self.print_thread.start()
        return True

    def cancelprint(self):
        self.pause()
        self.paused = False
        self.printing = False
        gl.uarm_printing_state = False
        self.mainqueue = None
        self.clear = True
        # gl.uarm.set_report_position(0)
        gl.uarm.send('G0')
        gl.uarm.send('M107')
        gl.uarm.send('M104 S0')

    def startprint(self, gcode, startindex=0):
        if self.printing or not self.online or not gl.uarm_connected:
            return False
        # gl.uarm.set_report_position(0.5)
        self.queueindex = startindex
        self.mainqueue = gcode
        self.printing = True
        self.paused = False
        gl.uarm_printing_state = True
        self.lineno = 0
        self.resendfrom = -1
        self._send('M110', -1, True)
        if not gcode or not gcode.lines:
            return True
        self.clear = False
        resuming = (startindex != 0)
        self.print_thread = threading.Thread(target=self._print, kwargs={'resuming': resuming})
        self.print_thread.start()
        return True

    def _print(self, resuming=False):
        self._stop_sender()
        try:
            while self.printing and gl.uarm_connected and self.online:
                self._sendnext()
            self.sentlines = {}
            self.sent = []
        except:
            logger.error('Print thread died due to the following error:' + '\n' + traceback.format_exc())
            gl.uarm_printing_state = False
            gl.uarm.send('G0')
            gl.uarm.send('M107')
            gl.uarm.send('M104 S0')
        finally:
            self.print_thread = None
            self.printing = False
            if not self.paused:
                gl.uarm_printing_state = False
                gl.uarm.send('G0')
                gl.uarm.send('M107')
                gl.uarm.send('M104 S0')
            self._start_sender()

    def send(self, command, wait=0):
        """Adds a command to the checksummed main command queue if printing, or
        sends the command immediately if not printing"""

        if self.online:
            if self.printing:
                self.mainqueue.append(command)
            else:
                self.priqueue.put_nowait(command)
        else:
            logger.error("Not connected to printer.")

    def send_now(self, command, wait=0):
        """Sends a command to the printer ahead of the command queue, without a
        checksum"""
        if self.online:
            self.priqueue.put_nowait(command)
        else:
            logger.error("Not connected to printer.")

    def _sendnext(self):
        if not gl.uarm_connected:
            return
        start_time = time.time()
        last_pos = gl.uarm.get_report_position_no_wait()
        count = 0
        while gl.uarm_connected and self.printing and not self.clear:
            time.sleep(0.001)
            # if not self.wait:
            #     pos = gl.uarm.get_report_position_no_wait()
            #     if pos:
            #         if pos == last_pos:
            #             count += 1
            #         last_pos = pos
            #     if count >= 10:
            #         break
        self.clear = False
        if not (gl.uarm_connected and self.printing and self.online):
            self.clear = True
            return
        if -1 < self.resendfrom < self.lineno:
            self._send(self.sentlines[self.resendfrom], self.resendfrom, False)
            self.resendfrom += 1
            return
        self.resendfrom = -1
        if not self.priqueue.empty():
            self._send(self.priqueue.get_nowait())
            self.priqueue.task_done()
            return
        if self.printing and self.queueindex < len(self.mainqueue):
            (layer, line) = self.mainqueue.idxs(self.queueindex)
            gline = self.mainqueue.all_layers[layer][line]
            if gline is None:
                self.queueindex += 1
                self.clear = True
                return
            tline = gline.raw
            if tline.lstrip().startswith(';@'):
                self.process_host_command(tline)
                self.queueindex += 1
                self.clear = True
                return
            tline = gcoder.gcode_strip_comment_exp.sub("", tline).strip()
            if tline:
                self._send(tline, self.lineno, True)
                self.lineno += 1
            else:
                self.clear = True
            self.queueindex += 1
        else:
            self.printing = False
            gl.uarm_printing_state = False
            self.clear = True
            if not self.paused:
                self.queueindex = 0
                self.lineno = 0
                self._send('M110', -1, True)

    def _send(self, command, lineno=0, calcchecksum=False):
        if 'M109' in command:
            self.wait = True
        else:
            self.wait = False
        if calcchecksum:
            prefix = 'N' + str(lineno) + ' ' + command
            command = prefix + '*' + str(self._checksum(prefix))
            if 'M110' not in command:
                self.sentlines[lineno] = command
        if gl.uarm_connected:
            self.sent.append(command)
            gline = None
            try:
                gline = self.analyzer.append(command, store=False)
            except:
                logger.warning('Could not analyze command %s:' % command + '\n' + traceback.format_exc())
            try:
                gl.uarm.send(command)
                # print(">>>>>>", command)
                self.writefailures = 0
            except SerialException as e:
                logger.error("Can't write to printer (disconnected?) (SerialException): {0}".format(decode_utf8(str(e))))
                self.writefailures += 1
            except RuntimeError as e:
                logger.error("Socket connection broken, disconnected. ({0}): {1}".format(e.errno, decode_utf8(e.strerror)))
                self.writefailures += 1




