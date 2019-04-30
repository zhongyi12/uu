from log import logger
from pyuarm import UArm, UArmConnectException
logger.debug('import pyuarm')
from pyuarm.tools.list_uarms import uarm_ports
from tornado import gen
import tornado
import sys
sys.path.append('..')
from svg2gcode import SVGParser
logger.debug('import SVGParser')
from raster2laser import GcodeExport
logger.debug('import GcodeExport')
from svg2pengcode import PenDraw
from eggbot import Hershey
logger.debug('import PenDraw')
import six
import os
import gl
logger.debug('import gl')
from threading import Thread
from printrun import gcoder
logger.debug('import printrun')
from .utils import replace_3d_gcode_file, add_zeropoint_height_to_gcode
logger.debug('import replace_3d_gcode_file')
import time
import threading

UARM_CONNECT_ERROR = 1


def get_response_msg(id, data=None):
    response = {
        "data": data,
        "status": True,
        "type": "response",
        "id": id
    }
    return response

def get_response_gcode(id, data=None, filename=None):
    response = {
        'gcode': data,
        'filename': filename,
        'status': True,
        'type': 'response',
        'id': id
    }
    return response


def get_error_msg(error_id, error_msg):
    error_msg = {
        "status": False,
        "error_id": error_id,
        "error_msg": error_msg
    }
    return error_msg


class Command(object):
    def __init__(self):
        pass
        # gl.uarm = gl.uarm
        # gl.uarm_teach = gl.uarm_teach

    ###################### Command ############################


    def stop_core(self, client, id, data):
        gl.stop_core()

    def get_core_version(self, client, id, data):
        res = {
            "version": gl.CORE_VERSION,
        }
        gl.push_response_queue(client, get_response_msg(id, data=res))

    ###################### uArm Control ############################

    ############ Connect ####################

    def uarm_list_ports(self, client, id, data):
        # print ("uarm_list_ports")
        res = uarm_ports(True)
        gl.push_response_queue(client, get_response_msg(id, data=res))

    def uarm_connect(self, client, data):
        if gl.uarm is None:
            try:
                gl.uarm = UArm(data['port_name'], debug=data['debug'])

            except UArmConnectException as e:
                error = get_error_msg(error_id=UARM_CONNECT_ERROR, error_msg="uArm Connect error: {}".format(str(e)))
                return error
        else:
            if gl.uarm.connection_state:
                pass
            else:
                gl.uarm.connect()

        res = {
            "firmware_version": gl.uarm.firmware_version,
            "hardware_version": gl.uarm.hardware_version
        }
        gl.push_response_queue(get_response_msg(res))

    def uarm_disconnect(self, client, id, data):
        gl.uarm.disconnect()
        gl.push_response_queue(client, get_response_msg(id))

    def uarm_is_connected(self, client, id, data):
        is_connected = gl.uarm.connection_state
        res = is_connected
        gl.push_response_queue(client, get_response_msg(id, data=res))

    ################# Set #####################

    @tornado.gen.coroutine
    def uarm_set_mode(self, client, id, data):
        if gl.uarm_printing_state:
            logger.warning("uArm is printing, please waiting...")
            return
        elif gl.uarm_teach and (gl.uarm_teach.is_recording() or gl.uarm_teach.is_playing()):
            logger.warning('uArm is in teach, please waiting...')
            return
        if gl.uarm_connected:
            mode = int(data.get('mode', gl.uarm.mode))
            logger.debug("uArm set mode: %d" % mode)
            gl.uarm.mode = mode
            gl.push_response_queue(client, get_response_msg(id))

    @tornado.gen.coroutine
    def uarm_get_mode(self, client, id, data):
        if gl.uarm_connected:
            data = {
                'mode': gl.uarm.mode,
            }
            gl.push_response_queue(client, get_response_msg(id, data))

    @tornado.gen.coroutine
    def uarm_set_position(self, client, id, data):
        if gl.uarm_printing_state:
            logger.warning("uArm is printing, please waiting...")
            return
        elif gl.uarm_teach and (gl.uarm_teach.is_recording() or gl.uarm_teach.is_playing()):
            logger.warning('uArm is in teach, please waiting..')
            return
        elif not gl.uarm:
            logger.warning("uarm is not connect")
            return
        pos_array = data.get('position', [200, 0, 50])
        logger.debug('uarm_set_position: {}'.format(pos_array))
        relative = data.get('relative', False)
        speed = data.get('speed', 6000)
        wait = data.get('wait', True)
        gl.uarm.set_position(x=pos_array[0], y=pos_array[1], z=pos_array[2], feedrate=speed, relative=relative, wait=wait)
        gl.push_response_queue(client, get_response_msg(id))

    @tornado.gen.coroutine
    def uarm_set_polar(self, client, id, data):
        polar_array = data['position']
        speed = data['speed']
        relative = data['relative']
        wait = data['wait']
        gl.uarm.set_polar_coordinate(polar_array[0], polar_array[1], polar_array[2],relative=relative, feedrate=speed, wait=wait)
        gl.push_response_queue(client, get_response_msg(id))

    @tornado.gen.coroutine
    def uarm_set_pump(self, client, id, data):
        pump_status = data.get('on', False)
        wait = data.get('wait', True)
        gl.uarm.set_pump(pump_status, wait=wait)
        gl.push_response_queue(client, get_response_msg(id))

    def uarm_set_gripper(self, client, id, data):
        gripper_status = data.get('on', False)
        wait = data.get('wait', True)
        gl.uarm.set_gripper(gripper_status, wait=wait)
        gl.push_response_queue(client, get_response_msg(id))

    # def uarm_set_debug(self, data):
    #     gl.uarm.set_debug(data)
    #     return get_response_msg()

    # @tornado.gen.coroutine
    # def uarm_set_wrist(self, client, id, data):
    #     wrist_angle = data['angle']
    #     gl.uarm.set_wrist(wrist_angle)
    #     gl.push_response_queue(client, get_response_msg(id))

    @tornado.gen.coroutine
    def uarm_set_buzzer(self, client, id, data):
        wait = data.get('wait', False)
        frequency = data.get('frequency', 0)
        duration = data.get('duration', 0)
        gl.uarm.set_buzzer(frequency, duration)
        if wait:
            yield gen.sleep(duration)
        # print('sleep')
        gl.push_response_queue(client, get_response_msg(id))

    @tornado.gen.coroutine
    def uarm_set_servo_angle(self, client, id, data):
        angle = data.get('angle', 90)
        servo_num = data.get('servo_num', 0)
        wait = data.get('wait',True)
        speed = data.get('speed', 6000)
        run_status = gl.uarm.set_servo_angle(servo_number=servo_num, angle=angle, feedrate=speed, wait=wait)
        gl.push_response_queue(client, get_response_msg(id))

    @tornado.gen.coroutine
    def uarm_set_servo_detach(self, client, id, data):
        servo_num = data.get('servo_num', 0)
        detach_all = data.get('detach_all', True)
        if detach_all:
            gl.uarm.set_servo_detach(wait=True)
        else:
            gl.uarm.set_servo_detach(servo_number=servo_num, wait=True)
        gl.push_response_queue(client, get_response_msg(id))

    @tornado.gen.coroutine
    def uarm_set_servo_attach(self, client, id, data):
        servo_num = data.get('servo_num', 0)
        attach_all = data.get('attach_all', True)
        if attach_all:
            gl.uarm.set_servo_attach(wait=True)
        else:
            gl.uarm.set_servo_attach(servo_number=servo_num, wait=True, move=True)
        gl.push_response_queue(client, get_response_msg(id))

    @tornado.gen.coroutine
    def uarm_start_report_position(self, client, id, data):
        # print("get Report Position1")
        if gl.uarm_connected and not gl.uarm_report_position:
            if isinstance(data, dict):
                interval = data.get('interval', 0.5)
            else:
                interval = 0.5
            status = gl.uarm.set_report_position(interval, wait=True)
            gl.push_response_queue(client, get_response_msg(id))
            gl.uarm_report_position = True
            Thread(target=self.__get_report_position, args=(client,)).start()

    def __get_report_position(self, client):
        while gl.uarm_report_position:
            # print ("get Report Position2")
            pos = gl.uarm.get_report_position()
            msg = {
                "type": "broadcast",
                "cmd": "uarm_report_position",
                "data": {
                    "position": pos,
                }
            }
            if client not in gl.connected_clients:
                gl.uarm_report_position = False
                break
            gl.push_response_queue(client, msg)

    @tornado.gen.coroutine
    def uarm_stop_report_position(self, client, id, data):
        if gl.uarm_connected:
            status = gl.uarm.close_report_position(wait=True)
            gl.uarm_report_position = False
            gl.push_response_queue(client, get_response_msg(id))

    @tornado.gen.coroutine
    def uarm_start_report_pump_state(self, client, id, data):
        # print("get Report Position1")
        if gl.uarm_connected and not gl.uarm_report_pump_state:
            interval = data.get('interval', 0.5)
            # status = gl.uarm.set_report_position(interval, wait=True)
            # gl.push_response_queue(client, get_response_msg(id))
            gl.uarm_report_pump_state = True
            Thread(target=self.__get_report_pump_state, args=(client, interval)).start()

    def __get_report_pump_state(self, client, interval):
        while gl.uarm_report_pump_state:
            # print ("get Report Position2")
            status = gl.uarm.get_tip_sensor()
            if status is not None:
                msg = {
                    "type": "broadcast",
                    "cmd": "uarm_report_pump_state",
                    "data": {
                        "status": status,
                    }
                }
                gl.push_response_queue(client, msg)
            time.sleep(interval)

    @tornado.gen.coroutine
    def uarm_stop_report_pump_state(self, client, id, data):
        if gl.uarm_connected:
            # status = gl.uarm.close_report_position(wait=True)
            gl.uarm_report_pump_state = False
            gl.push_response_queue(client, get_response_msg(id))

    def uarm_start_report_button(self, client, id, data):
        wait = data.get('wait', True)
        if not gl.uarm_report_button:
            status = gl.uarm.set_report_button(wait=wait)
            gl.uarm_report_button = True
            if status:
                gl.push_response_queue(client, get_response_msg(id))
            else:
                gl.push_response_queue(client, get_error_msg(id, error_msg='Error'))

    def uarm_close_report_button(self, client, id, data):
        wait = data.get('wait', True)
        if gl.uarm_report_button:
            status = gl.uarm.close_report_button(wait=wait)
            gl.uarm_report_button = False
            if status:
                gl.push_response_queue(client, get_response_msg(id))
            else:
                gl.push_response_queue(client, get_error_msg(id, error_msg='Error'))

    ################# Get #####################

    @tornado.gen.coroutine
    def uarm_get_tip_sensor(self, client, id, data):
        is_press = gl.uarm.get_tip_sensor()
        gl.push_response_queue(client, get_response_msg(id, is_press))

    @tornado.gen.coroutine
    def uarm_get_position(self, client, id, data):
        pos = gl.uarm.get_position()
        gl.push_response_queue(client, get_response_msg(id, pos))

    @tornado.gen.coroutine
    def uarm_get_servo_angle(self, client, id, data):
        servo_num = data.get('servo_num', 0)
        angle = gl.uarm.get_servo_angle(servo_num)
        gl.push_response_queue(client, get_response_msg(id, {'angle': angle}))

    @tornado.gen.coroutine
    def uarm_get_version(self, client, id, data):
        gl.push_response_queue(client, get_response_msg(id, {'firmware_version': gl.uarm.firmware_version, 'hardware_version': gl.uarm.hardware_version}))

    def uarm_is_moving(self, client, id, data):
        is_moving = gl.uarm.is_moving()
        gl.push_response_queue(client, get_response_msg(id, is_moving))

    ################# Vision #####################
    def switch_camera(self, client, id, data):
        is_open = data['on']
        gl.open_camera(is_open)
        gl.push_response_queue(client, get_response_msg(id))

    @tornado.gen.coroutine
    def vision_start_report_face_detected(self, client, id, data):
        gl.uarm_report_face_detected = True
        gl.push_response_queue(client, get_response_msg(id))
        while gl.uarm_report_face_detected:
            if gl.face_detect != gl.last_face_detect:
                msg = {"type": "broadcast",
                       "cmd": "vision_report_face_detected",
                       "data": {
                           "face_detected": gl.face_detect,
                       }
                       }
                gl.last_face_detect = gl.face_detect
                gl.push_response_queue(client, msg)
            yield gen.sleep(0.1)

    def vision_stop_report_face_detected(self, client, id, data):
        gl.uarm_report_face_detected = False
        gl.push_response_queue(client, get_response_msg(id))

    ################# Teach & Play ################

    def uarm_set_play_speed(self, client, id, data):
        try:
            speed = int(data.get('speed', 1))
            gl.uarm_teach.set_speed(speed)
            gl.push_response_queue(client,  get_response_msg(id))
        except Exception:
            gl.push_response_queue(client, get_error_msg(id, "speed is invalid"))

    def uarm_start_teach_standby_mode(self, client, id, data):
        if not gl.uarm_teach.is_standby_mode():
            gl.uarm_teach.start_standby_mode()
        else:
            gl.push_response_queue(client, get_error_msg(id, "Already in Teach Standby Mode"))

    def uarm_stop_teach_standby_mode(self, client, id, data):
        if gl.uarm_teach.is_standby_mode():
            gl.uarm_teach.stop_standby_mode()
        else:
            gl.push_response_queue(client, get_error_msg(id, "Teach Standby Mode not start"))

    def uarm_start_recording(self, client, id, data):
        if not gl.uarm_teach.is_recording() and not gl.uarm_teach.is_playing():
            gl.uarm_teach.start_record()
            # Thread(target=self.__get_record_progress, args=(client,)).start()
            gl.push_response_queue(client, get_response_msg(id))
        else:
            gl.push_response_queue(client, get_error_msg(id,"Recording already started"))

    def uarm_stop_recording(self, client, id, data):
        if gl.uarm_teach.is_recording():
            gl.uarm_teach.stop_record()
            gl.push_response_queue(client, get_response_msg(id))
        else:
            gl.push_response_queue(client, get_error_msg(id, "Recording already stopped"))

    def uarm_start_playing(self, client, id, data):
        speed = data.get('speed', 1)
        times = data.get('times', 1)
        if not gl.uarm_teach.is_recording() and not gl.uarm_teach.is_playing():
            gl.uarm_teach.start_play(speed, times)
            Thread(target=self.__broadcast_play_progress, args=(client,)).start()
            gl.push_response_queue(client, get_response_msg(id))

    def uarm_stop_playing(self, client, id, data):
        if gl.uarm_teach.is_playing():
            gl.uarm_teach.stop_play()
            gl.push_response_queue(client, get_response_msg(id))

    def __broadcast_play_progress(self, client):
        while gl.uarm_teach.is_playing():
            progress = gl.uarm_teach.get_progress(wait=False)
            if progress is not None:
                progress_msg = {"type": "broadcast",
                                "cmd": "uarm_play_progress",
                                "data": {
                                    "times": progress[0],
                                    "progress": progress[1],
                                    }
                                }
                gl.push_response_queue(client, progress_msg)
                # uarm_teach.wait_queue()
            time.sleep(0.001)
        # print("Play Stop")
        msg = {"type": "broadcast",
               "cmd": "uarm_stop_playing",
               "data": ""
               }
        gl.push_response_queue(client, msg)

##################################### Grove #######################################
    def uarm_init_grove(self, client, id, data):
        grove_id = data.get('grove_id')
        pin = data.get('pin')
        values = data.get('values', None)
        wait = data.get('wait', True)
        if grove_id is None or pin is None:
            pass
        if pin not in gl.grove_sensors.keys():
            gl.grove_sensors[pin] = {
                'init': False,
                'grove_id': grove_id,
                'values': values,
            }      
        if not gl.grove_sensors[pin]['init']:
            gl.uarm.init_grove_sensor(pin, grove_id, value=values, wait=True)
            gl.grove_sensors[pin]['init'] = True
        gl.push_response_queue(client, get_response_msg(id))

    def uarm_control_grove(self, client, id, data):
        pin = data.get('pin')
        value = data.get('value')
        wait = data.get('wait', True)
        if pin is None or value is None:
            pass
        elif gl.grove_sensors[pin]['init']:
            gl.uarm.control_grove_sensor(pin, value, wait=wait)
        gl.push_response_queue(client, get_response_msg(id))

    def uarm_report_grove(self, client, id, data):
        # grove_id = data.get('grove_id', 10)
        pin = data.get('pin')
        interval = data.get('interval', 0.1)
        if pin not in gl.grove_sensors.keys():
            pass
        elif gl.grove_sensors[pin]['init']:
            gl.uarm.set_report_grove_sensor(pin, interval)
            Thread(target=self.__get_report_grove_sensor, args=(client, pin,)).start()
        gl.push_response_queue(client, get_response_msg(id))

    def uarm_close_grove(self, client, id, data):
        pin = data.get('pin')
        if pin not in gl.grove_sensors.keys():
            pass
        else:
            gl.grove_sensors[pin]['init'] = False
            gl.grove_sensors[pin]['grove_id'] = None
            gl.uarm.close_grove_sensor(pin)
        gl.push_response_queue(client, get_response_msg(id))

    # def uarm_close_report_grove_sensor(self, client, id, data):
    #     grove_id = data.get('grove_id', 10)
    #     if grove_id not in gl.grove_sensors.keys():
    #         pass
    #     else:
    #         gl.grove_sensors[grove_id]['init'] = False
    #         gl.uarm.close_report_grove_sensor(grove_id)
    #     gl.push_response_queue(client, get_response_msg(id))

    def __get_report_grove_sensor(self, client, pin):
        while gl.grove_sensors[pin]['init']:
            if len(gl.connected_clients) <= 0:
                gl.uarm.release_grove_sensor(pin)
                break
            values = gl.uarm.get_grove_sensor_report(pin)
            if values is not None:
                grove_id = values[0]
                data = values[1]
                msg = {
                    "type": "broadcast",
                    "cmd": "uarm_report_grove_sensor",
                    "data": {
                        "pin": pin,
                        "grove_id": grove_id,
                        "data": data,
                    }
                }
                gl.push_response_queue(client, msg)
            time.sleep(0.001)
##################################### Grove #######################################
    @tornado.gen.coroutine
    def svg_to_pen_gcode(self, client, id, data, config={}):  # svg_to_pen_gcode
        logger.debug("Receive SVG data: %d" % len(data))
        if six.PY2:
            svg_data = data.decode('utf-8')
        else:
            svg_data = data

        if 'moving_feedrate' not in config:
            config.update({'moving_feedrate': 300})
        if 'drawing_feedrate' not in config:
            config.update({'drawing_feedrate': 100})
        if 'z_feedrate' not in config:
            config.update({'z_feedrate': 50})
        if 'x_home' not in config:
            config.update({'x_home': 150})
        if 'y_home' not in config:
            config.update({'y_home': 0})
        if 'z_home' not in config:
            config.update({'z_home': 10})
        if 'x_offset' not in config:
            config.update({'x_offset': 156})
        if 'y_offset' not in config:
            config.update({'y_offset': 0})
        if 'z_offset' not in config:
            if gl.uarm_connected:
                x, y, z = gl.uarm.get_position()
                config.update({'z_offset': z})
            else:
                logger.error("Please connect to uarm at first")
                return
        if 'debug' not in config:
            config.update({'debug': True})

        parser = PenDraw(**config)
        output = parser.convert(svg_data)
        if six.PY2:
            g_code_data = output.decode('utf-8').split("\n")
        else:
            g_code_data = output.split("\n")
        logger.debug("Generate Gcode data: len=%d, lines=%d" % (len(output), len(g_code_data)))
        gl.push_response_queue(client, get_response_gcode(id, output))
        # gcode = gcoder.LightGCode(g_code_data)
        # if gl.uarm_connected:
        #     gl.uarm_printing.startprint(gcode)
        #     gl.broadcast_printing_progress()
        # else:
        #     logger.error("Please connect to uarm at first")

    @tornado.gen.coroutine
    def svg_to_gcode(self, client, id, data, config={}): # svg_to_gcode
        logger.debug("Receive SVG data: %d" % len(data))
        if six.PY2:
            svg_data = data.decode('utf-8')
        else:
            svg_data = data

        if 'moving_feedrate' not in config:
            config.update({'moving_feedrate': 300})
        if 'drawing_feedrate' not in config:
            config.update({'drawing_feedrate': 50})
        if 'z_feedrate' not in config:
            config.update({'z_feedrate': 0})
        if 'x_home' not in config:
            config.update({'x_home': 150})
        if 'y_home' not in config:
            config.update({'y_home': 0})
        if 'z_home' not in config:
            config.update({'z_home': 90})
        if 'x_offset' not in config:
            config.update({'x_offset': 180})
        if 'y_offset' not in config:
            config.update({'y_offset': 0})
        if 'debug' not in config:
            config.update({'debug': True})

        parser = SVGParser(**config)
        output = parser.convert(svg_data)
        if six.PY2:
            g_code_data = output.decode('utf-8').split("\n")
        else:
            g_code_data = output.split("\n")
        logger.debug("Generate Gcode data: len=%d, lines=%d" % (len(output), len(g_code_data)))
        gl.push_response_queue(client, get_response_gcode(id, output))
        # gcode = gcoder.LightGCode(g_code_data)
        # if gl.uarm_connected:
        #     gl.uarm_printing.startprint(gcode)
        #     gl.broadcast_printing_progress()
        # else:
        #     logger.error("Please connect to uarm at first")

    @tornado.gen.coroutine
    def raster_to_laser(self, client, id, data, config={}): # raster_to_laser
        logger.debug("Receive SVG data: %d" % len(data))
        if six.PY2:
            svg_data = data.decode('utf-8')
        else:
            svg_data = data
        config.update({'resolution': 8})
        config.update({'x_offset': 90})
        config.update({'y_offset': 206.185})
        config.update({'debug': True})
        export = GcodeExport(**config)
        output = export.affect(svg_data=svg_data)
        if six.PY2:
            g_code_data = output.decode('utf-8').split("\n")
        else:
            g_code_data = output.split("\n")
        logger.debug("Generate Gcode data: len=%d, lines=%d" % (len(output), len(g_code_data)))
        gl.push_response_queue(client, get_response_gcode(id, output))

    @tornado.gen.coroutine
    def start_printing(self, client, id, data, config={}):
        if gl.uarm_printing_state:
            logger.warning("uArm is printing, please waiting...")
            return
        if 'zeropoint_height' in config:
            zeropoint_height = config.get('zeropoint_height', 0)
            print('zeropoint_height:{}'.format(zeropoint_height))
            data = add_zeropoint_height_to_gcode(data, zeropoint_height)
        if six.PY2:
            g_code_data = data.decode('utf-8').split("\n")
        else:
            g_code_data = data.split("\n")
        logger.debug("Receive Gcode data: len=%d, lines=%d" % (len(data), len(g_code_data)))
        gcode = gcoder.LightGCode(g_code_data)
        if gl.uarm_connected and not gl.uarm_printing_state:
            gl.uarm_printing.startprint(gcode)
            gl.send_uarm_printing_state(client, True)
            gl.broadcast_printing_progress()
        else:
            logger.error("Please connect to uarm at first")

    @tornado.gen.coroutine
    def pause_printing(self, client, id, data):
        if gl.uarm_connected and gl.uarm_printing and gl.uarm_printing.printing:
            gl.uarm_printing.pause()
            gl.send_uarm_printing_state(client, True, True)
            gl.uarm.send_and_receive('G0')

    @tornado.gen.coroutine
    def resume_printing(self, client, id, data):
        if gl.uarm_connected and gl.uarm_printing and gl.uarm_printing.paused:
            gl.uarm.send_and_receive('G1')
            gl.uarm_printing.resume()
            gl.send_uarm_printing_state(client, True, False)
            gl.broadcast_printing_progress()

    @tornado.gen.coroutine
    def stop_printing(self, client, id, data):
        if gl.uarm_connected and gl.uarm_printing and gl.uarm_printing_state:
            gl.uarm_printing.cancelprint()
            gl.send_uarm_printing_state(client, False)
            # gl.uarm_printing.send_now('G0 Z90 F800\n')
            coor = gl.uarm.get_position()
            if coor is not None:
                gl.uarm_printing.send_now('G0 Z{0:.2f} F6000\n'.format(coor[2] + 10))
                gl.uarm_printing.send_now('G0 X180 Y0.00 Z{0:.2f} F6000\n'.format(coor[2] + 10))
            else:
                gl.uarm_printing.send_now('G0 Z100 F6000\n')
                gl.uarm_printing.send_now('G0 X180 Y0.00 F6000\n')
        gl.uarm_printing_state = False

    # ###############3D Printing######################
    @tornado.gen.coroutine
    def start_3d_printing(self, client, id, data):
        if gl.uarm_printing_state:
            logger.warning("uArm is printing, please waiting...")
            return
        if data is None:
            path = os.path.join(os.path.expanduser("~"), "uarm", "temp")
            filename = os.path.join(path, "temp.gcode")
            data = replace_3d_gcode_file(filename)
            filename = os.path.join(path, "temp_convert.gcode")

            try:
                with open(filename, 'w') as f:
                    f.write(data)
            except Exception as e:
                logger.error(e)

            # with open(filename, 'r') as f:
            #     data = f.read()
        if six.PY2:
            g_code_data = data.decode('utf-8').split("\n")
        else:
            g_code_data = data.split("\n")
        logger.debug("Receive Gcode data: len=%d, lines=%d" % (len(data), len(g_code_data)))
        gcode = gcoder.LightGCode(g_code_data)
        if gl.uarm_connected and not gl.uarm_printing_state:
            gl.uarm_printing.startprint(gcode)
            gl.send_uarm_printing_state(client, True)
            gl.broadcast_printing_progress()
            gl.broadcast_uarm_temperature()
        else:
            logger.error("Please connect to uarm at first")

    @tornado.gen.coroutine
    def stop_3d_printing(self, client, id, data):
        if gl.uarm_connected:
            gl.uarm_printing.cancelprint()
            gl.send_uarm_printing_state(client, False)
            gl.send_uarm_zeropoint_state(client, False)
            coor = gl.uarm.get_position()
            if coor is not None:
                gl.uarm_printing.send_now('G0 Z{0:.2f} F6000\n'.format(coor[2] + 10))
                gl.uarm_printing.send_now('G0 X150 Y0.00 Z{0:.2f} F6000\n'.format(coor[2] + 10))
            else:
                gl.uarm_printing.send_now('G0 Z100 F6000\n')
                gl.uarm_printing.send_now('G0 X150 Y0.00 Z100 F6000\n')

    # @tornado.gen.coroutine
    # def start_set_zeropoint(self, client, id, data):
    #     if gl.uarm_connected:
    #         if data == "normal":
    #             gl.uarm.set_mode(0)
    #         elif data == "laserprinting":
    #             gl.uarm.set_mode(1)
    #         elif data == "3dprinting":
    #             gl.uarm.set_mode(2)
    #         self.uarm_start_report_position(client, id, data)
    #         gl.uarm.set_motors_disable()
    #         gl.send_uarm_zeropoint_state(client, True)
    #
    # @tornado.gen.coroutine
    # def finish_set_zeropoint(self, client, id, data):
    #     if gl.uarm_connected:
    #         gl.uarm.set_height_offset()
    #         gl.uarm.set_motors_enable()
    #         gl.send_uarm_zeropoint_state(client, False)
    #         self.uarm_stop_report_position(client, id, data)
    #
    # @tornado.gen.coroutine
    # def ignore_set_zeropoint(self, client, id, data):
    #     if gl.uarm_connected:
    #         gl.send_uarm_zeropoint_state(client, 2)
    #
    # @tornado.gen.coroutine
    # def test_zeropoint(self, client, id, data, only_set_height=False):
    #     if gl.uarm_connected:
    #         gl.uarm.send_msg('G0 X180 Y0 Z{0:.2f} F10000\n'.format(float(data)))
    #         pos = gl.uarm.get_position()
    #         print("current position:", pos)

    @tornado.gen.coroutine
    def set_zeropoint(self, client, id, data):
        if gl.uarm_connected:
            gl.uarm.set_height_offset()
            gl.send_uarm_zeropoint_state(client, False)
            pos = gl.uarm.get_position()
            print("current position:", pos)

    # #####################3D Printing###############

    @tornado.gen.coroutine
    def uarm_set_zeropoint(self, client, id, data):
        if gl.uarm_connected:
            if isinstance(data, dict) and 'offset' in data:
                offset = data.get('offset')
            else:
                offset = ''
            gl.uarm.set_height_offset(offset)
            pos = gl.uarm.get_position()
            print("current position:", pos)

    # @tornado.gen.coroutine
    # def unlock_motor(self, client, id, data):
    #     if gl.uarm_connected:
    #         gl.uarm.set_motors_disable()
    #         self.uarm_start_report_position(client, id, data)
    #
    # @tornado.gen.coroutine
    # def lock_motor(self, client, id, data):
    #     if gl.uarm_connected:
    #         gl.uarm.set_motors_enable()
    #         print(gl.uarm.get_position())
    #         self.uarm_stop_report_position(client, id, data)

    @tornado.gen.coroutine
    def start_contour_printing(self, client, id, data, config={}):
        logger.debug("Receive SVG data: %d" % len(data))
        if six.PY2:
            svg_data = data.decode('utf-8')
        else:
            svg_data = data

        if 'drawing_feedrate' not in config:
            config.update({'drawing_feedrate': 50})
        if 'moving_feedrate' not in config:
            config.update({'moving_feedrate': config.get('drawing_feedrate') * 10})
        if 'z_feedrate' not in config:
            config.update({'z_feedrate': 0})
        if 'x_home' not in config:
            config.update({'x_home': 150})
        if 'y_home' not in config:
            config.update({'y_home': 0})
        if 'z_home' not in config:
            config.update({'z_home': 90})
        if 'x_offset' not in config:
            config.update({'x_offset': 136}) # 156 180
        if 'y_offset' not in config:
            config.update({'y_offset': 2})

        drawing_feedrate = config.get('drawing_feedrate', 50)
        if drawing_feedrate < 50:
            drawing_feedrate = 50
        elif drawing_feedrate > 250:
            drawing_feedrate = 250

        # drawing_feedrate = config.get('drawing_feedrate', 50) - 50
        # drawing_feedrate = drawing_feedrate * 2.5
        # if drawing_feedrate < 50:
        #     drawing_feedrate += 50

        config.update({'drawing_feedrate': drawing_feedrate})
        config.update({'moving_feedrate': drawing_feedrate * 10})

        logger.debug('contour-printing: drawing_feedrate: {}'.format(config.get('drawing_feedrate')))

        command1 = "M204 P60 T60 R60"
        command2 = "M205 X30 Z30 E30"

        parser = SVGParser(**config)
        output = parser.convert(svg_data)

        zeropoint_height = config.get('zeropoint_height', 0)
        if zeropoint_height != 0:
            print('zeropoint_height:{} {}'.format(zeropoint_height, type(zeropoint_height)))
            if isinstance(zeropoint_height, str):
                zeropoint_height = int(zeropoint_height)
            output = add_zeropoint_height_to_gcode(output, zeropoint_height)

        if six.PY2:
            g_code_data = output.decode('utf-8').split("\n")
        else:
            g_code_data = output.split("\n")
        logger.debug("Generate Gcode data: len=%d, lines=%d" % (len(output), len(g_code_data)))
        gcode = gcoder.LightGCode(g_code_data)
        gl.push_response_queue(client, get_response_gcode(id, output))
        if gl.uarm_connected and not gl.uarm_printing_state:
            gl.uarm.mode = 1
            gl.uarm.send_and_receive(command1)
            gl.uarm.send_and_receive(command2)
            gl.uarm_printing.cancelprint()
            gl.uarm_printing.startprint(gcode)
            gl.broadcast_printing_progress()
        else:
            logger.error("Please connect to uarm at first")

    @tornado.gen.coroutine
    def start_pen_printing(self, client, id, data, config={}):
        logger.debug("Receive SVG data: %d" % len(data))
        if six.PY2:
            svg_data = data.decode('utf-8')
        else:
            svg_data = data

        if 'drawing_feedrate' not in config:
            config.update({'drawing_feedrate': 200})
        if 'moving_feedrate' not in config:
            config.update({'moving_feedrate': config.get('drawing_feedrate') * 10})
        if 'z_feedrate' not in config:
            config.update({'z_feedrate': 50})
        if 'x_home' not in config:
            config.update({'x_home': 150})
        if 'y_home' not in config:
            config.update({'y_home': 0})
        if 'z_home' not in config:
            config.update({'z_home': 20})
        if 'x_offset' not in config:
            config.update({'x_offset': 136}) # 156
        if 'y_offset' not in config:
            config.update({'y_offset': 2})
        config.update({'z_offset': 0})
        # if 'z_offset' not in config:
        #     if gl.uarm_connected:
        #         x, y, z = gl.uarm.get_position()
        #         config.update({'z_offset': z})
        #     else:
        #         logger.error("Please connect to uarm at first")
        #         return

        drawing_feedrate = config.get('drawing_feedrate', 500)
        if drawing_feedrate < 50:
            drawing_feedrate = 50
        elif drawing_feedrate > 1000:
            drawing_feedrate = 1000

        # drawing_feedrate = config.get('drawing_feedrate', 200) - 50
        # drawing_feedrate = drawing_feedrate * 10
        # if drawing_feedrate < 500:
        #     drawing_feedrate += 500

        config.update({'drawing_feedrate': drawing_feedrate})
        config.update({'moving_feedrate': drawing_feedrate * 10})

        logger.debug('contour-pen-printing: drawing_feedrate: {}'.format(config.get('drawing_feedrate')))

        command1 = "M204 P50 T50 R50"
        command2 = "M205 X15 Z15 E15"

        parser = PenDraw(**config)
        output = parser.convert(svg_data)

        zeropoint_height = config.get('zeropoint_height', 0)
        if zeropoint_height != 0:
            print('zeropoint_height:{}'.format(zeropoint_height))
            output = add_zeropoint_height_to_gcode(output, zeropoint_height)

        if six.PY2:
            g_code_data = output.decode('utf-8').split("\n")
        else:
            g_code_data = output.split("\n")
        logger.debug("Generate Gcode data: len=%d, lines=%d" % (len(output), len(g_code_data)))
        gl.push_response_queue(client, get_response_gcode(id, output))
        gcode = gcoder.LightGCode(g_code_data)
        if gl.uarm_connected and not gl.uarm_printing_state:
            gl.uarm.mode = 3
            gl.uarm.send_and_receive(command1)
            gl.uarm.send_and_receive(command2)
            gl.uarm_printing.cancelprint()
            gl.uarm_printing.startprint(gcode)
            gl.broadcast_printing_progress()
        else:
            logger.error("Please connect to uarm at first")

    @tornado.gen.coroutine
    def start_engraving_printing(self, client, id, data, config={}): # start_engraving_printing
        logger.debug("Receive base64 png data data: %d" % len(data))
        if six.PY2:
            base64_png_data = data.decode('utf-8')
        else:
            base64_png_data = data
        config.update({'resolution': 10})
        config.update({'x_offset': 15}) # 55 90
        config.update({'y_offset': 248.5}) # 206.185

        drawing_feedrate = config.get('drawing_feedrate', 50)
        if drawing_feedrate < 50:
            drawing_feedrate = 50
        elif drawing_feedrate > 500:
            drawing_feedrate = 500

        # drawing_feedrate = config.get('drawing_feedrate', 50) - 50
        # drawing_feedrate = drawing_feedrate * 5
        # if drawing_feedrate < 200:
        #     drawing_feedrate += 200

        config.update({'drawing_feedrate': drawing_feedrate})
        config.update({'moving_feedrate': drawing_feedrate * 10})

        # config.update({'drawing_feedrate': 300})
        # config.update({'moving_feedrate': 600})

        # config.update({'resolution': 15 + config.get('drawing_feedrate') // 100})

        logger.debug('engraving-printing: drawing_feedrate: {}'.format(config.get('drawing_feedrate')))

        command1 = "M204 P60 T60 R60"
        command2 = "M205 X30 Z30 E30"

        export = GcodeExport(**config)
        output = export.affect(base64_png_data=base64_png_data)

        zeropoint_height = config.get('zeropoint_height', 0)
        if zeropoint_height != 0:
            print('zeropoint_height:{}'.format(zeropoint_height))
            output = add_zeropoint_height_to_gcode(output, zeropoint_height)

        if six.PY2:
            g_code_data = output.decode('utf-8').split("\n")
        else:
            g_code_data = output.split("\n")
        logger.debug("Generate Gcode data: len=%d, lines=%d" % (len(output), len(g_code_data)))
        gl.push_response_queue(client, get_response_gcode(id, output))
        gcode = gcoder.LightGCode(g_code_data)
        if gl.uarm_connected and not gl.uarm_printing_state:
            gl.uarm.mode = 1
            gl.uarm.send_and_receive(command1)
            gl.uarm.send_and_receive(command2)
            gl.uarm_printing.cancelprint()
            gl.uarm_printing.startprint(gcode)
            gl.broadcast_printing_progress()
        else:
            logger.error("Please connect to uarm at first")

    @tornado.gen.coroutine
    def start_pen_engraving_printing(self, client, id, data, config={}):  # start_engraving_printing
        logger.debug("Receive SVG data: %d" % len(data))
        if six.PY2:
            base64_png_data = data.decode('utf-8')
        else:
            base64_png_data = data
        config.update({'resolution': 5})
        config.update({'x_offset': 15})  # 55 90
        config.update({'y_offset': 248.5}) # 206.185
        config.update({'z_offset': 0})
        # if 'z_offset' not in config:
        #     if gl.uarm_connected:
        #         x, y, z = gl.uarm.get_position()
        #         config.update({'z_offset': z})
        #     else:
        #         logger.error("Please connect to uarm at first")
        #         return

        drawing_feedrate = config.get('drawing_feedrate', 500)
        if drawing_feedrate < 50:
            drawing_feedrate = 50
        elif drawing_feedrate > 800:
            drawing_feedrate = 800

        # drawing_feedrate = config.get('drawing_feedrate', 50) - 50
        # drawing_feedrate = drawing_feedrate * 8
        # if drawing_feedrate < 400:
        #     drawing_feedrate += 400

        config.update({'drawing_feedrate': drawing_feedrate})
        config.update({'moving_feedrate': drawing_feedrate * 10})

        logger.debug('engraving-pen-printing: drawing_feedrate: {}'.format(config.get('drawing_feedrate')))

        command1 = "M204 P50 T50 R50"
        command2 = "M205 X15 Z15 E15"

        from raster2penlaser import GcodeExport as PenGcodeExport
        export = PenGcodeExport(**config)
        output = export.affect(base64_png_data=base64_png_data)

        zeropoint_height = config.get('zeropoint_height', 0)
        if zeropoint_height != 0:
            print('zeropoint_height:{}'.format(zeropoint_height))
            output = add_zeropoint_height_to_gcode(output, zeropoint_height)

        if six.PY2:
            g_code_data = output.decode('utf-8').split("\n")
        else:
            g_code_data = output.split("\n")
        logger.debug("Generate Gcode data: len=%d, lines=%d" % (len(output), len(g_code_data)))
        gl.push_response_queue(client, get_response_gcode(id, output))
        gcode = gcoder.LightGCode(g_code_data)
        if gl.uarm_connected and not gl.uarm_printing_state:
            gl.uarm.mode = 3
            gl.uarm.send_and_receive(command1)
            gl.uarm.send_and_receive(command2)
            gl.uarm_printing.cancelprint()
            gl.uarm_printing.startprint(gcode)
            gl.broadcast_printing_progress()
        else:
            logger.error("Please connect to uarm at first")

    @tornado.gen.coroutine
    def start_eggbot_printing(self, client, id, data, config={}):
        # print(config)
        # config.update({'x_offset': 190})
        # config.update({'x_home': 190})
        # config.update({'drawing_feedrate': 300})
        # config.update({'moving_feedrate': 300})
        # print(config)

        logger.debug("Receive Text: %s" % data)
        if six.PY2:
            data = data.decode('utf-8')
        else:
            data = data
        hershey = Hershey(**config)
        output = hershey.affect(data)
        if six.PY2:
            g_code_data = output.decode('utf-8').split("\n")
        else:
            g_code_data = output.split("\n")
        logger.debug("Generate Gcode data: len=%d, lines=%d" % (len(output), len(g_code_data)))
        gl.push_response_queue(client, get_response_gcode(id, output))

        command1 = "M204 P100 T100 R100"
        command2 = "M205 X15 Z15 E15"

        gcode = gcoder.LightGCode(g_code_data)
        if gl.uarm_connected and not gl.uarm_printing_state:
            gl.uarm.send_and_receive(command1)
            gl.uarm.send_and_receive(command2)
            gl.uarm_printing.cancelprint()
            gl.uarm_printing.startprint(gcode)
            gl.broadcast_printing_progress()
        else:
            logger.error("Please connect to uarm at first")

    @tornado.gen.coroutine
    def gengerate_grayscale_gcode(self, client, id, data, config={}):
        logger.debug("Receive base64 png data data: %d" % len(data))
        if six.PY2:
            base64_png_data = data.decode('utf-8')
        else:
            base64_png_data = data
        # config.update({'startpower': 55})
        export = GcodeExport(**config)
        output = export.affect(base64_png_data=base64_png_data)
        gl.push_response_queue(client, get_response_gcode(id, output, filename=export.pos_file_png_BW))

    @tornado.gen.coroutine
    def start_outline_printing(self, client, id, data, config={}):
        end_type = config.get('end_type', None)
        if not end_type:
            logger.error('params errror: no end_type!!')
            return
        if end_type == 'laser':
            return self.start_contour_printing(client, id, data, config)
        elif end_type == 'pen':
            return self.start_pen_printing(client, id, data, config)

    @tornado.gen.coroutine
    def start_grayscale_printing(self, client, id, data, config={}):
        end_type = config.get('end_type', None)
        if not end_type:
            logger.error('params errror: no end_type!!')
            return
        if end_type == 'laser':
            return self.start_engraving_printing(client, id, data, config)
        elif end_type == 'pen':
            return self.start_pen_engraving_printing(client, id, data, config)

    # @tornado.gen.coroutine
    # def uarm_firmware_upgrade(self, client, id, data):
    #     if gl.uarm_connected and not gl.firmware_upgrading:
    #         port_name = gl.uarm.port_name
    #         gl.uarm.disconnect()
    #         Thread(target=self.__firmware_upgrade_thread, args=(client, port_name, )).start()
    #         gl.push_response_queue(client, get_response_msg(id))
    #     elif not gl.uarm_connected and not gl.firmware_upgrading and gl.uarm is not None:
    #         port_name = gl.uarm.port_name
    #         Thread(target=self.__firmware_upgrade_thread, args=(client, port_name, )).start()
    #         gl.push_response_queue(client, get_response_msg(id))
    #
    # @staticmethod
    # def __firmware_upgrade_thread(client, port_name):
    #     def broadcast_progress(progress):
    #         msg = {"type": "broadcast",
    #                "cmd": "uarm_firmware_upgrade_progress",
    #                "data": {
    #                    "progress": progress,
    #                }
    #                }
    #         client.write_message(json.dumps(msg, ensure_ascii=False))
    #         if progress == 100:
    #             gl.firmware_upgrading = False
    #     gl.firmware_upgrading = True
    #     firmware.run(verb=False, uarm_type=gl.uarm.uarm_type, avrdude_path=gl.AVRDUDE_PATH,
    #                  port=port_name, path=None, download=False, progress_callback=broadcast_progress)



    @gen.coroutine
    def uarm_send_command(self, client, id, data):
        """
        2017/08/09 10:52
        Send command to uArm
        :param client: 
        :param id: 
        :param data: {
            'command': command,
            'wait': True/False,
        }
        :return: 
        """
        command = data.get('command', None)
        if command:
            wait = data.get('wait', True)
            if wait:
                gl.uarm.send_and_receive(command)
            else:
                gl.uarm.send_msg(command)
            gl.push_response_queue(client, get_response_msg(id))

    @gen.coroutine
    def uarm_set_acceleration(self, client, id, data):
        """
        2017/08/09 10:52
        Set uArm Acceleration
        :param client: 
        :param id: 
        :param data: {
            'printing_move': 0, # Printing moves
            'retract_moves': 0, # Retract only (no X, Y, Z) moves
            'travel_moves': 0, # Travel (non printing) moves
            'min_feedrate': 0, # Min Feed Rate (units/s)
            'min_travel_feedrate': 0, # Min Travel Feed Rate (units/s)
            'min_segment_time': 0, # Min Segment Time (us)
            'max_xy_jerk': 0, # Max XY Jerk (units/sec^2)
            'max_z_jerk': 0, # Max Z Jerk (units/sec^2)
            'max_e_jerk': 0, # Max E Jerk (unit/sec^2)
        }
        :return: 
        """

        ######### M204 Set Default Acceleration ################
        flag1 = False
        printing_moves = data.get('printing_move', None)
        retract_moves = data.get('retract_moves', None)
        travel_moves = data.get('travel_moves', None)
        command = "M204"
        if printing_moves:
            command += " P{}".format(printing_moves)
            flag1 = True
        if retract_moves:
            command += " R{}".format(retract_moves)
            flag1 = True
        if travel_moves:
            command += " T{}".format(travel_moves)
            flag1 = True
        if flag1:
            gl.uarm.send_and_receive(command)

        ######### M205 Advanced Settings #############
        flag2 = False
        min_feedrate = data.get('min_feedrate', None)
        min_travel_feedrate = data.get('min_travel_feedrate', None)
        min_segment_time = data.get('min_segment_time', None)
        max_xy_jerk = data.get('max_xy_jerk', None)
        max_z_jerk = data.get('max_z_jerk', None)
        max_e_jerk = data.get('max_e_jerk', None)
        command = "M205"
        if min_feedrate:
            command += " S{}".format(min_feedrate)
            flag2 = True
        if min_feedrate:
            command += " T{}".format(min_travel_feedrate)
            flag2 = True
        if min_feedrate:
            command += " B{}".format(min_segment_time)
            flag2 = True
        if min_feedrate:
            command += " X{}".format(max_xy_jerk)
            flag2 = True
        if min_feedrate:
            command += " Z{}".format(max_z_jerk)
            flag2 = True
        if min_feedrate:
            command += " E{}".format(max_e_jerk)
            flag2 = True
        if flag2:
            gl.uarm.send_and_receive(command)
        if flag1 or flag2:
            gl.push_response_queue(client, get_response_msg(id))


