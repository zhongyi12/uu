# -*- coding: utf-8 -*-
from tornado.queues import Queue
from tornado import gen
from log import logger
import json
from pyuarm import UArm
logger.debug('Import pyuarm')
from pyuarm.tools.list_uarms import uarm_ports
logger.debug('Import uarm_ports')
from pyuarm.tools.teach import Teach
logger.debug('Import Teach')
from pyuarm import home_dir
logger.debug('Import home_dir')
from pyuarm.protocol import BUTTON_PLAY, BUTTON_MENU
logger.debug('Import protocol')
import os
import time
from printrun.uarm_printcore import UArmPrintCore
logger.debug('Import UArmPrintCore')
from log import logger
from version import __version__
import functools
logger.debug('Import functools')
from tornado import ioloop
from queue import LifoQueue

CORE_VERSION = __version__
# Global variables
# ########### Path #################
RESOURCE_PATH = os.path.join(os.path.dirname(__file__), "Resources")
AVRDUDE_PATH = os.path.join(os.path.dirname(RESOURCE_PATH), 'avrdude')
temp_dir = os.path.join(home_dir, "Temp")
if not os.path.exists(home_dir):
    os.mkdir(home_dir)
if not os.path.exists(temp_dir):
    os.mkdir(temp_dir)

temp_record_file = os.path.join(temp_dir, "temp.rec")
uarm = None
uarm_teach = None
uarm_report_position = False
uarm_report_pump_state = False
uarm_report_button = False
uarm_report_face_detected = False
uarm_power_connection_state = False
uarm_tip_sensor_state = False
face_detect = False
last_face_detect = False
camera_connected = False
video = None
cmd = None
uarm_connected = False
uarm_connecting = False
# firmware_upgrading = False
connected_clients = []
vision_clients = []
vision_ws = None

# grove sensor
grove_sensors = {}

# uarm_mode = 0
uarm_printing_state = False

uarm_printing = None

teach_status = {
    "play": False,
    "record": False,
    "standby": False
}

# Global Queue
request_message_queue = Queue()
response_message_queue = Queue()

# Debug Flag
UARMCORE_DEBUG = False

def catch_exception(func):
    @functools.wraps(func)
    def decorator(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error('{} - {} - {}'.format(type(e).__name__, func.__name__, e))
    return decorator

def init_command_process(cmd_type):
    global cmd
    cmd = cmd_type

@gen.coroutine
def push_request_queue(client, message):
    try:
        # print("message: {}".format(message))
        request = json.loads(message)
        queue_item = {"client": client,
                      "request": request}
        yield request_message_queue.put(queue_item)
    except Exception as e:
        try:
            if str(e) == 'queue non-empty, why are getters waiting?':
                request_message_queue._queue.clear()
                request_message_queue._getters.clear()
        except:
            pass
        logger.error("Error occur: {}".format(str(e)))

@gen.coroutine
def push_response_queue(client, message):
    try:
        response = message
        queue_item = {"client": client,
                      "response": response}
        yield response_message_queue.put(queue_item)
    except Exception as e:
        try:
            if str(e) == 'queue non-empty, why are getters waiting?':
                response_message_queue._queue.clear()
                response_message_queue._getters.clear()
        except:
            pass
        logger.error("Error occur: {}".format(str(e)))


@gen.coroutine
def process_request_loop():
    request = None
    while True:
        try:
            item = yield request_message_queue.get()
            request = item['request']
            if isinstance(request, str):
                request = json.loads(request)
            if isinstance(request, str):
                raise Exception('json parse error: {}'.format(request))
            client = item['client']
            cmd.process_message(client, request)
            request_message_queue.task_done()
            # print("Received :{}".format(request))
        except Exception as e:
            try:
                if str(e) == 'queue not full, why are putters waiting?':
                    request_message_queue._queue.clear()
                    request_message_queue._putters.clear()
            except:
                pass
            print("Exception: {}".format(e))
            # print("Request: {}, Exception: {}".format(request,e))


@gen.coroutine
def process_response_loop():
    while True:
        try:
            item = yield response_message_queue.get()
            response = item['response']
            # print("Send :{}".format(response))
            client = item['client']
            client.write_message(json.dumps(response, ensure_ascii=False))
            response_message_queue.task_done()
            # yield response_message_queue.join()
        except Exception as e:
            try:
                if str(e) == 'queue not full, why are putters waiting?':
                    response_message_queue._queue.clear()
                    response_message_queue._putters.clear()
            except:
                pass
            print("Exception: {}".format(e))

def send_uarm_printing_state(client, state, isPaused=False):
    msg = {
        'type': 'broadcast',
        'cmd': 'uarm_printing_state',
        'data': {
            'state': state,
            'isPaused': isPaused,
        }
    }
    client.write_message(json.dumps(msg, ensure_ascii=False))

def send_uarm_zeropoint_state(client, state):
    msg = {
        'type': 'broadcast',
        'cmd': 'uarm_zeropoint_state',
        'data': {
            'state': state
        }
    }
    client.write_message(json.dumps(msg, ensure_ascii=False))

def send_greeting_msg(client):
    msg = {
        "type": "broadcast",
        "cmd": "greeting",
        "data": {
            "core_version": CORE_VERSION,
        }
    }
    client.write_message(json.dumps(msg, ensure_ascii=False))
    send_uarm_connection_msg(client=client)

def send_uarm_connection_msg(client):
    # print(uarm.port.usb_info())
    if uarm_connected:
        msg = {
            "type": "broadcast",
            "cmd": "uarm_connection",
            "data": {
                "connection_state": uarm_connected,
                "port_name": uarm.port.device,
                "port_serial_number": uarm.serial_number,
                "firmware_version": uarm.firmware_version,
                "hardware_version": uarm.hardware_version,
                "printing_state": uarm_printing.printing or uarm_printing.paused,
                "isPaused": uarm_printing.paused,
                "zeropoint_state": False,
                "position": uarm.get_position(),
                "mode": uarm.mode
            }
        }
    else:
        msg = {
            "type": "broadcast",
            "cmd": "uarm_connection",
            "data": {
                "connection_state": uarm_connected,
                "printing_state": False,
                "zeropoint_state": False,
            }
        }
    client.write_message(json.dumps(msg, ensure_ascii=False))

def send_uarm_connecting_msg(client, port, status, remark=None):
    msg = {
        "type": "broadcast",
        "cmd": "uarm_connecting",
        "data": {
            "status": status, # connecting, fail, connected
            "port_name": port,
            "remark": remark,
        }
    }
    client.write_message(json.dumps(msg, ensure_ascii=False))

@gen.coroutine
def auto_connect_loop():
    # open_camera(True)
    global uarm_connected, uarm, uarm_teach, uarm_report_button, uarm_printing, uarm_printing_state, uarm_connecting, grove_sensors
    count = 0
    while True:
        # print("-------after While True")
        if not uarm_connected and uarm is None and not uarm_connecting:
            ports = uarm_ports()
            if len(ports) > 0:
                try:
                    # uarm = UArm(timeout=3, debug=False, log='INFO')
                    uarm = UArm(ports[0], timeout=5, debug=UARMCORE_DEBUG, log='INFO')
                    uarm_connecting = True
                    uarm.connect()
                    for client in connected_clients:
                        send_uarm_connecting_msg(client, ports[0], 'connecting')
                    start_time = time.time()
                    while not uarm.connection_state:
                        if time.time() - start_time > 3:
                            break
                        time.sleep(0.1)
                    if uarm.connection_state is False:
                        raise Exception
                    for client in connected_clients:
                        send_uarm_connecting_msg(client, ports[0], 'connected')
                    # Get value first time
                    print('firmware_version: ', uarm.firmware_version)
                    print('hardware_version: ', uarm.hardware_version)
                    print('serial_number: ', uarm.serial_number)
                    print('uarm_mode: ', uarm.mode)
                    uarm_report_button = uarm.set_report_button(wait=True)
                    uarm_connected = True
                    uarm_connecting = False
                    uarm_printing = UArmPrintCore()
                    uarm_printing_state = False
                    uarm_teach = Teach(temp_record_file, uarm)

                    # uarm.send_and_receive('M204 P500 R500 T500')

                    for client in connected_clients:
                        send_uarm_connection_msg(client)

                except Exception as e:
                    try:
                        for client in connected_clients:
                            send_uarm_connecting_msg(client, ports[0], 'fail')
                    except:
                        pass
                    print(e)
                    uarm_connecting = False
                    uarm_connected = False
                    uarm_printing = None
                    uarm = None
                    uarm_printing_state = False
        elif uarm is not None:
            try:
                temp_connected = uarm.connection_state
                if uarm_connected != temp_connected:
                    uarm.disconnect()
                    grove_sensors = {}
                    yield gen.sleep(1)
                    uarm = None
                    uarm_connected = temp_connected
                    uarm_printing = None
                    for client in connected_clients:
                        send_uarm_connection_msg(client)
            except Exception as e:
                print("Disconnect error {}".format(e))
                uarm_connecting = False
                uarm_connected = False
                uarm_printing = None
                uarm = None
                uarm_printing_state = False
        yield gen.sleep(0.1)


@gen.coroutine
def report_button_status_loop():
    while True:
        if uarm_connected and uarm_report_button and not uarm_teach.is_standby_mode():
            menu_item = uarm.get_report_button(BUTTON_MENU)
            if menu_item is None:
                pass
            else:
                # uarm.set_mode((uarm_mode+1) % 3)
                # uarm_mode = uarm.mode
                # mode_list = ['normal mode', 'laser mode', '3D mode']
                # print('uArm mode: ', mode_list[uarm_mode])
                # for i in range(uarm_mode+1):
                #     uarm.set_buzzer(1000, 0.1)
                #     time.sleep(0.5)
                for client in connected_clients:
                    send_uarm_button_msg(client, BUTTON_MENU, menu_item)
            play_item = uarm.get_report_button(BUTTON_PLAY)
            if play_item is None:
                pass
            else:
                for client in connected_clients:
                    send_uarm_button_msg(client, BUTTON_PLAY, play_item)
        yield gen.sleep(0.1)


def send_uarm_button_msg(client, button_id, button_value):
    _button_id = {"B0": "menu", "B1": "play"}
    if uarm_report_button:
        msg = {"type": "broadcast",
               "cmd": "uarm_button_report",
               "data": {
                   "button_id": _button_id[button_id],
                   "button_value": int(button_value)
               }
               }
        client.write_message(json.dumps(msg, ensure_ascii=False))


@gen.coroutine
def auto_check_teach_status():
    while True:
        if uarm_connected:
            play_status = uarm_teach.is_playing()
            record_status = uarm_teach.is_recording()
            standby_status = uarm_teach.is_standby_mode()
            if teach_status['play'] != play_status:
                teach_status['play'] = play_status
                if play_status:
                    send_uarm_teach_status("play", play_status, count=uarm_teach.get_total_points())
                    # broadcast_play_progress()
                    # Thread(target=broadcast_play_progress).start()
                else:
                    send_uarm_teach_status("play", play_status)
            if teach_status['record'] != record_status:
                teach_status['record'] = record_status
                send_uarm_teach_status("record", record_status)
            if teach_status['standby'] != standby_status:
                teach_status['standby'] = standby_status
                send_uarm_teach_status("standby", standby_status)
        yield gen.sleep(0.1)


@gen.coroutine
def auto_check_power_status():
    global uarm_power_connection_state
    while True:
        if uarm_connected:
            item = uarm.get_power_connection_report()
            if item is None:
                pass
            else:
                uarm_power_connection_state = item
                # print ("power connection: {}".format(uarm_power_connection_state))
                for client in connected_clients:
                    msg = {"type": "broadcast",
                           "cmd": "uarm_power_connection_report",
                           "data": {
                               "status": uarm_power_connection_state,
                           }
                           }
                    client.write_message(json.dumps(msg, ensure_ascii=False))
        yield gen.sleep(0.1)


@gen.coroutine
def auto_check_tip_sensor():
    global uarm_tip_sensor_state
    while True:
        if uarm_connected:
            item = uarm.get_tip_sensor_report()
            if item is None:
                pass
            else:
                uarm_tip_sensor_state = item
                # print ("tip sensor state: {}".format(uarm_tip_sensor_state))
                for client in connected_clients:
                    msg = {"type": "broadcast",
                           "cmd": "uarm_tip_sensor_state_report",
                           "data": {
                               "status": uarm_tip_sensor_state,
                           }
                           }
                    client.write_message(json.dumps(msg, ensure_ascii=False))
        yield gen.sleep(0.1)

def send_uarm_teach_status(status_type, status, count=None):
    msg = {"type": "broadcast",
           "cmd": "uarm_teach_status_report",
           "data": {
               "type": status_type,
               "status": status,
               "count": count
           }
           }
    for client in connected_clients:
        client.write_message(json.dumps(msg, ensure_ascii=False))


def broadcast_message(msg):
    for client in connected_clients:
        client.write_message(json.dumps(msg, ensure_ascii=False))

@gen.coroutine
def broadcast_record_progress():
    while uarm_teach.is_recording():
        progress = uarm_teach.get_progress()
        msg = {"type": "broadcast",
               "cmd": "uarm_record_progress",
               "data": {
                   "progress": progress,
               }
               }
        for client in connected_clients:
            client.write_message(json.dumps(msg, ensure_ascii=False))
        uarm_teach.wait_queue()


@gen.coroutine
def broadcast_printing_progress():
    if uarm_printing is not None:
        last_progress = 0.0
        while uarm_connected and uarm_printing.printing:
            progress = "{0:.2f}".format(100 * float(uarm_printing.queueindex) / len(uarm_printing.mainqueue))
            if last_progress != progress:
                logger.debug("Printing Progress: {}".format(progress))
                msg = {
                    "type": "broadcast",
                    "cmd": "uarm_printing_progress",
                    "data": {
                        "progress": progress,
                    }
                }
                uarm_printing.error = None
                for client in connected_clients:
                    client.write_message(json.dumps(msg, ensure_ascii=False))
                last_progress = progress
            yield gen.sleep(0.01)
    yield gen.sleep(0.1)
    if uarm_printing.paused:
        msg = {
            "type": "broadcast",
            "cmd": "uarm_pause_printing",
            "data": ""
        }
    else:
        msg = {
            "type": "broadcast",
            "cmd": "uarm_stop_printing",
            "data": ""
        }
    for client in connected_clients:
        client.write_message(json.dumps(msg, ensure_ascii=False))
        send_uarm_printing_state(client, False)


@gen.coroutine
def broadcast_uarm_temperature():
    if uarm_printing is not None:
        last_temperature = 0.0
        while uarm_connected and (uarm_printing.printing or uarm_printing.paused) and len(connected_clients) != 0:
            current_temperature = uarm_printing.current_temperature
            target_temperature = uarm_printing.target_temperature
            if last_temperature != current_temperature:
                msg = {
                    'type': 'broadcast',
                    'cmd': 'uarm_temperature_report',
                    'data': {
                        'current_temperature': str(current_temperature),
                        'target_temperature': str(target_temperature),
                    }
                }
                for client in connected_clients:
                    client.write_message(json.dumps(msg, ensure_ascii=False))
                last_temperature = current_temperature
            yield gen.sleep(2)
    yield gen.sleep(0.01)
    msg = {
        "type": "broadcast",
        "cmd": "uarm_stop_printing",
        "data": ""
    }
    for client in connected_clients:
        client.write_message(json.dumps(msg, ensure_ascii=False))
        send_uarm_printing_state(client, False)

@gen.coroutine
def boardcast_uarm_printing_error(error):
    if uarm_printing is not None and uarm_connected:
        msg = {
            "type": "broadcast",
            "cmd": "uarm_printing_error",
            "data": {
                "error": error,
            }
        }
        uarm_printing.error = None
        for client in connected_clients:
            client.write_message(json.dumps(msg, ensure_ascii=False))

def open_camera(open):
    global video, camera_connected
    if open and not camera_connected:
        # video = VideoCamera()
        if vision_ws is not None:
            try:
                vision_ws.send({'id': 1, 'cmd': 'switch_camera', 'data': {'on': True}})
            except Exception as e:
                logger.error(e)
        else:
            logger.info("Can not connect camera, please run the vision-server")
    elif not open and camera_connected:
        if vision_ws is not None:
            try:
                vision_ws.send({'id': 2, 'cmd': 'switch_camera', 'data': {'on': False}})
            except Exception as e:
                logger.error(e)
        else:
            logger.info("Can not connect camera, please run the vision-server")

frame = None
import threading
frame_lock = threading.RLock()

@gen.coroutine
def get_frame_loop():
    global frame
    while True:
        try:
            if camera_connected and video is not None:
                while len(vision_clients):
                    if frame_lock.acquire():
                        try:
                            frame = video.get_frame('face_detect')
                        except Exception as e:
                            print(e)
                        finally:
                            frame_lock.release()
                    # try:
                    #     frame = video.get_frame('face_detect')
                    # except Exception as e:
                    #     print(e)
                    yield gen.sleep(0.04)
        except Exception as e:
            print(e)
        yield gen.sleep(1)

import copy
def get_frame():
    # return frame
    if frame_lock.acquire():
        tmp = None
        try:
            tmp = copy.deepcopy(frame)
        except Exception as e:
            print(e)
        finally:
            frame_lock.release()
        return tmp


# 这个循环如果没有客户端连接下，过 60 秒就会自动关闭
@gen.coroutine
def check_idle_loop():
    yield gen.sleep(60)
    while True:
        if len(connected_clients) == 0:
            logger.warn('no connected clients, program will terminate after 10s')
            yield gen.sleep(10)
            if len(connected_clients) == 0:
                for i in reversed(range(1, 6)):
                    logger.warn('Program will be terminated in {}s'.format(i))
                    yield gen.sleep(1)
                stop_core()
            else:
                logger.warn('Termination stopped because new client connected')
        yield gen.sleep(1)


def stop_core():
    if uarm_connected:
        uarm.disconnect()
    print("Program Terminating...")
    ioloop.IOLoop.instance().stop()
    import signal
    os.kill(os.getpid(), signal.SIGTERM)
    print("stop core end")

# from vision.websocketclient import VisionWebSocket
# @gen.coroutine
# def auto_connect_vision_loop():
#     global vision_ws
#     while True:
#         if not vision_ws or not vision_ws.connection_state:
#             try:
#                 vision_ws = VisionWebSocket()
#                 vision_ws.setDaemon(True)
#                 vision_ws.start()
#             except Exception as e:
#                 logger.error(e)
#                 # vision_ws = None
#         yield gen.sleep(2)







###################################OpenMV################################
from openmv.uarmhandler import UArmHandler, OpenMVConfig
from openmv import define

openmv_ws = None

openmv = None
openmv_connected = False
openmv_running = False
openmv_enable_terminal_output = True
openmv_enable_fb_output = True
openmv_fb_width = 320
openmv_fb_height = 240
openmv_fb_data = None
openmv_output_queue = Queue()

uarm_openmv_state = define.UARM_OPENMV_DISABLE
openmv_feature = -1

start_detect = False
first_detect = True
first_detect_position = None
detect_position_queue = LifoQueue()
detect_line_queue = LifoQueue()
threshold = None
color_code = 0

previous_position = None
current_position = None
tip_sensor_state = False
check_tip_sensor_state = False

openmv_config = OpenMVConfig()

def init_openmv_state():
    global uarm_openmv_state, first_detect, first_detect_position, detect_position_queue, detect_line_queue, \
        start_detect, threshold, openmv_feature
    uarm_openmv_state = define.UARM_OPENMV_DISABLE

    threshold = None
    start_detect = False
    openmv_feature = -1
    first_detect = True
    first_detect_position = None
    detect_position_queue.queue.clear()
    detect_line_queue.queue.clear()

@gen.coroutine
def auto_get_openmv_output_data():
    global openmv, openmv_connected, openmv_running, first_detect_position, uarm_openmv_state, detect_position_queue, color_code
    while True:
        try:
            if openmv_connected and openmv_running and openmv_enable_terminal_output:
                output = openmv_output_queue.get_nowait()

                if 'centroid' in output:
                    centroid = output.get('centroid')

                    distance_x = centroid[0] - openmv_fb_width / 2
                    distance_y = centroid[1] - openmv_fb_height / 2

                    if uarm_openmv_state == define.UARM_OPENMV_DISABLE or not start_detect or abs(distance_x) > openmv_fb_width * 4 / 9 or abs(distance_y) > openmv_fb_height * 4 / 9:
                        continue

                    if first_detect and first_detect_position is None and current_position:
                        pos = current_position
                        if pos:
                            pos1 = uarm.get_report_position()
                            if not pos1:
                                continue
                            pos1.append(time.time())

                            t1 = pos[4]
                            t2 = pos1[4]
                            tm = centroid[3]
                            s = (tm - t1) / (t2 - t1)

                            p = [pos[0] + s * (pos1[0] - pos[0]), pos[1] + s * (pos1[1] - pos[1]), pos[2]]
                            first_detect_position = {}
                            first_detect_position.update({'position': p, 'centroid': centroid})
                            color_code = centroid[2]
                            # print('first:', first_detect_position)
                            # print('color_code:', color_code)

                            if uarm_openmv_state == define.UARM_OPENMV_PATROL:
                                uarm_openmv_state = define.UARM_OPENMV_LOCATE
                            # trackState = 2
                            # first_detect_position.update({'position': pos, 'centroid': centroid})
                    elif uarm_openmv_state != define.UARM_OPENMV_PATROL and uarm_openmv_state != define.UARM_OPENMV_CATCH:
                        pos = current_position
                        if pos:
                            # pos1 = uarm.get_report_position()
                            # if not pos1:
                            #     continue
                            # pos1.append(time.time())
                            #
                            # t1 = pos[4]
                            # t2 = pos1[4]
                            # tm = centroid[3]
                            # s = (tm - t1) / (t2 - t1)
                            #
                            # p = [pos[0] + s * (pos1[0] - pos[0]), pos[1] + s * (pos1[1] - pos[1]), pos[2]]
                            # detect_position_queue.put({'position': p, 'centroid': centroid})
                            detect_position_queue.put({'position': current_position, 'centroid': centroid})

                elif 'line' in output and uarm_openmv_state == define.UARM_OPENMV_TRACK_LINE:
                    line = output.get('line')
                    detect_line_queue.put({'position': current_position, 'line': line})
                # else:
                #     print(output)
                # buf = openmv_output_queue.get_nowait()
                # if buf:
                #     if isinstance(buf, bytes):
                #         buf = buf.decode('utf-8').strip().strip('\r\n')
                #     for data in buf.split('\r\n'):
                #         if len(data):
                #             # print(data)
                #
                #             if data.startswith('centroid'):
                #                 centroid = data.split('\n')[0].split('\r\n')[0].split(':')[1].split(',')
                #                 centroid = [float(p) for p in centroid]
                #                 centroid.append(time.time())
                #                 if first_detect and first_detect_position is None and trackState and current_position:
                #                     pos = current_position
                #                     if pos:
                #                         pos1 = uarm.get_report_position()
                #                         if not pos1:
                #                             continue
                #                         pos1.append(time.time())
                #
                #                         centroid_list = []
                #                         while True:
                #                             try:
                #                                 buf = openmv_output_queue.get_nowait()
                #                             except:
                #                                 pass
                #                         t1 = pos[4]
                #                         t2 = pos1[4]
                #                         tm = centroid[3]
                #                         s = (tm-t1) / (t2 - t1)
                #
                #                         p = [pos[0] + s * (pos1[0] - pos[0]), pos[1] + s * (pos1[1] - pos[1]), pos[2]]
                #                         print(p)
                #                         first_detect_position = {}
                #                         first_detect_position.update({'position': p, 'centroid': centroid})
                #                         trackState = 2
                #                         # first_detect_position.update({'position': pos, 'centroid': centroid})
                #                 elif trackState != 0 and trackState != 3:
                #                     pos = current_position
                #                     if pos:
                #                         trackState = 2
                #                         # pos1 = uarm.get_report_position()
                #                         # if not pos1:
                #                         #     continue
                #                         # pos1.append(time.time())
                #                         #
                #                         # t1 = pos[4]
                #                         # t2 = pos1[4]
                #                         # tm = centroid[3]
                #                         # s = (tm - t1) / (t2 - t1)
                #                         #
                #                         # p = [pos[0] + s * (pos1[0] - pos[0]), pos[1] + s * (pos1[1] - pos[1]), pos[2]]
                #                         # detect_position_queue.put({'position': p, 'centroid': centroid})
                #                         detect_position_queue.put({'position': current_position, 'centroid': centroid})
        except Exception as e:
            pass
        yield gen.sleep(0.05)

@gen.coroutine
def uarm_auto_patrol():
    uarm_handler = UArmHandler()
    while True:
        try:
            if not uarm_handler.running:
                uarm_handler = UArmHandler()
                yield uarm_handler.run()
        except Exception as e:
            pass
        yield gen.sleep(2)

@gen.coroutine
def auto_broadcast_state():
    last_connected_clients = []
    last_state = {}
    while True:
        if len(connected_clients) > 0:
            try:
                msg = {
                    'type': 'broadcast',
                    'cmd': 'device_status_report',
                    'data': {
                        'uarm_connected': uarm_connected,
                        'uarm_printed': uarm_printing.printing or uarm_printing.paused,
                        'uarm_paused': uarm_printing.paused,

                        'openmv_connected': openmv_connected,
                        'openmv_running': openmv_running,
                        'openmv_enable_terminal_output': openmv_enable_terminal_output,
                        'openmv_enable_fb_output': openmv_enable_fb_output,
                        'uarm_openmv_state': uarm_openmv_state,
                    }
                }
                if msg != last_state or connected_clients != last_connected_clients:
                    for client in connected_clients:
                        client.write_message(json.dumps(msg, ensure_ascii=False))
                    last_state = msg
                    last_connected_clients = connected_clients
            except:
                pass
        else:
            last_connected_clients = []
        yield gen.sleep(0.5)

def send_openmv_color_threshold_to_client(client):
    msg = {
        'type': 'broadcast',
        'cmd': 'openmv_color_threshold',
        'data': {
            'openmv_color_threshold': threshold,
        }
    }
    client.write_message(json.dumps(msg, ensure_ascii=False))

##########################################################################

