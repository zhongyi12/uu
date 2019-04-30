#!/usr/bin/env python3
# coding: utf-8

import json
import copy
import time
import threading
import functools
from queue import Queue
import websocket

try:
    import gevent
    from gevent import monkey
    monkey.patch_all()
except:
    pass

message_queue = Queue()

class UArmWebSocketClient(threading.Thread):
    def __init__(self, parent=None):
        super(UArmWebSocketClient, self).__init__(parent)
        websocket.enableTrace(False)
        self._connected = False
        self.connect()

    @property
    def connected(self):
        return self._connected
    @connected.setter
    def connected(self, state):
        self._connected = state

    def connect(self):
        url = 'ws://localhost:18321/ws'
        self.ws = websocket.WebSocketApp(url,
            on_open=self.on_open,
            on_close=self.on_close,
            on_error=self.on_error,
            on_message=self.on_message)

    def on_open(self, ws):
        self._connected = True
        print("======open=========")

    def on_close(self, ws):
        self._connected = False

    def on_error(self, ws, error):
        print('======error: {}'.format(error))
        self._connected = False

    def on_message(self, ws, message):
        try:
            message = json.loads(message, encoding='utf-8')
            if isinstance(message, str):
                message = json.loads(message, encoding='utf-8')
            message_queue.put(message)
        except Exception as e:
            pass

    def send(self, message):
        if self.connected:
            try:
                self.ws.send(json.dumps(message))
            except Exception as e:
                # print(e)
                pass

    def run(self):
        self.ws.run_forever()
        self._connected = False

def auto_new_single_instance(func):
    @functools.wraps(func)
    def decorator(*args, **kwargs):
        cls = args[0]
        cls = cls.__new__(cls, *args[1:], **kwargs)
        return func(*args, **kwargs)
    return decorator

class UArmInfo(object):
    uarm_connected = False
    power_connection_state = False
    port_name = None
    port_serial_number = None
    firmware_version = None
    hardware_version = None
    speed = 1
    report_position = False
    current_x = 0
    current_y = 0
    current_z = 0
    current_r = 0
    pump_status = False
    gripper_status = False
    camera_connected = False

class CoreInfo(object):
    version = None

class DeviceInfo(object):
    usbConnection = False
    powerConnection = False
    portName = None
    portSerialNumber = None
    deviceSerialNumber = None
    hardwareVersion = None
    firmwareVersion = None
    productType = None


class UArm(object):
    message_thread = None
    connect_thread = None
    callback_thread = None
    ws_thread = None

    is_stop = False

    uarm_connected = False
    power_connection_state = False
    port_name = None
    port_serial_number = None
    firmware_version = None
    hardware_version = None
    speed = 1
    report_position = False
    current_x = 0
    current_y = 0
    current_z = 0
    current_r = 0
    pump_status = False
    gripper_status = False
    camera_connected = False

    msg_id = 0
    msg_buffer = {}
    callbacks = []

    def __init__(self):
        super(UArm, self).__init__()

    def __new__(cls, *args, **kwargs):
        if not hasattr(cls, '_instance'):
            cls._instance = super(UArm, cls).__new__(cls)
            print("========new single instance========")
            cls.message_thread = threading.Thread(target=cls.process_message_thread, name='process-message-thread')
            cls.message_thread.setDaemon(True)
            cls.message_thread.start()

            cls.connect_thread = threading.Thread(target=cls.auto_connect_thread, name='auto-connect-thread')
            cls.connect_thread.setDaemon(True)
            cls.connect_thread.start()

            cls.callback_thread = threading.Thread(target=cls.process_callback_thread, name='process-callback-thread')
            cls.callback_thread.setDaemon(True)
            cls.callback_thread.start()

            time.sleep(1)
            start_time = time.time()
            while time.time() - start_time < 8:
                if cls.ws_thread and (not cls.ws_thread.is_alive() or cls.ws_thread.connected):
                    break
                time.sleep(0.2)
            if not cls.ws_thread.connected:
                raise Exception('Can not connect uarmcore')
        return cls._instance

    def init_uarm_info(cls):
        cls.uarm_connected = False
        cls.power_connection_state = False
        cls.port_name = None
        cls.port_serial_number = None
        cls.firmware_version = None
        cls.hardware_version = None
        cls.speed = 1
        cls.report_position = False
        cls.current_x = 0
        cls.current_y = 0
        cls.current_z = 0
        cls.current_r = 0
        cls.pump_status = False
        cls.gripper_status = False
        cls.camera_connected = False

    @classmethod
    @auto_new_single_instance
    def test(cls, *args, **kwargs):
        print(cls.uarm_connected)

    @classmethod
    def set_variable(cls, variable, value):
        exec('cls.' + variable + ' = ' + str(value))

    @classmethod
    def auto_connect_thread(cls):
        while not cls.is_stop:
            if cls.ws_thread is None or not cls.ws_thread.is_alive():
                print("==========start websocket thread============")
                cls.uarm_connected = False
                cls.camera_connected = False
                cls.ws_thread = UArmWebSocketClient()
                cls.ws_thread.setDaemon(True)
                cls.ws_thread.start()
            time.sleep(2)

    @classmethod
    @auto_new_single_instance
    def waiting_connect(cls, timeout=10):
        start_time = time.time()
        while time.time() - start_time < timeout and not cls.uarm_connected:
            time.sleep(0.01)
        if not cls.uarm_connected:
            raise Exception('Can not connect uArm')

    @classmethod
    def stop(cls):
        cls.is_stop = True
        if cls.ws_thread and (not cls.ws_thread.is_alive() or cls.ws_thread.connected):
            cls.ws_thread.ws.close()

    @classmethod
    def waiting_stop(cls, timeout=10):
        start_time = time.time()
        while len(cls.callbacks) and time.time() - start_time < timeout:
            time.sleep(0.01)
        cls.stop()


    @classmethod
    def process_message_thread(cls):
        print("==========start process message thread==========")
        while not cls.is_stop:
            try:
                message = message_queue.get(timeout=5)
                if message.get('type', '') == 'broadcast':
                    cls.broadcast_message_process(message)
                else:
                    # cls.msg_buffer[str(message['id'])] = message
                    for callback in cls.callbacks:
                        if message['id'] == callback['id']:
                            cls.msg_buffer[message['id']] = message

                cmd = message.get('cmd', None)
                if cmd:
                    data = message.get('data')
                    if cmd == 'uarm_connection':
                        if 'connection_state' in data:
                            cls.uarm_connected = data.get('connection_state')
            except TimeoutError:
                pass
            except Exception as e:
                # print(e)
                pass

    @classmethod
    def process_callback_thread(cls):
        print("==========start process callback thread==========")
        while not cls.is_stop:
            try:
                if len(cls.callbacks) > 0:
                    callbacks = copy.deepcopy(cls.callbacks)
                    for i, callback in enumerate(callbacks):
                        if callback['id'] in cls.msg_buffer.keys():
                            func = callback['callback']
                            try:
                                gevent.spawn(func, cls.msg_buffer[callback['id']])
                            except:
                                t = threading.Thread(target=func, args=(cls.msg_buffer[callback['id']],))
                                t.setDaemon(True)
                                t.start()
                                # func(cls.msg_buffer[callback['id']])

                            cls.callbacks.remove(callback)
                            cls.msg_buffer.pop(callback['id'])

                        elif time.time() - callback['time'] > 10:
                            cls.callbacks.remove(callback)
            except:
                pass
            time.sleep(0.01)

    @classmethod
    def broadcast_message_process(cls, message):
        cmd = message.get('cmd', '')

        if not cmd or not isinstance(message.get('data'), dict):
            return
        data = message.get('data')
        if cmd == 'greeting':
            pass
        elif cmd == 'uarm_connection':
            if 'connection_state' in data:
                cls.uarm_connected = data.get('connection_state')
            if cls.uarm_connected:
                if 'port_serial_number' in data:
                    cls.port_serial_number = data.get('port_serial_number')
                if 'port_name' in data:
                    cls.port_name = data.get('port_name')
                if 'firmware_version' in data:
                    cls.firmware_version = data.get('firmware_version')
                if 'hardware_version' in data:
                    cls.hardware_version = data.get('hardware_version')
        elif cmd == 'uarm_connecting':
            pass
        elif cmd == 'uarm_play_progress':
            pass
        elif cmd == 'uarm_record_progress':
            pass
        elif cmd == 'uarm_stop_playing':
            pass
        elif cmd == 'uarm_report_position':
            if 'position' in data and len(data.get('position')) >= 4:
                cls.current_x, cls.current_y, cls.current_z, cls.current_r = data.get('position')
                print('current position: {}'.format(data.get('position')))
        elif cmd == 'vision_report_face_detected':
            pass
        elif cmd == 'uarm_button_report':
            pass
        elif cmd == 'uarm_teach_status_report':
            pass
        elif cmd == 'uarm_power_connection_report':
            cls.power_connection_state = data.get('status')
        elif cmd == 'uarm_tip_sensor_state_report':
            pass
        elif cmd == 'uarm_stop_printing':
            pass
        elif cmd == 'uarm_printing_progress':
            print('progress: {}'.format(data.get('progress')))


    @classmethod
    def send_msg(cls, message):
        # if cls.ws_thread and cls.ws_thread.connected and cls.uarm_connected:
        if cls.ws_thread and cls.ws_thread.connected:
            if cls.msg_id > 100000:
                cls.msg_id = 0
            cls.msg_id += 1
            message.update({'id': cls.msg_id})
            # print(message)
            cls.ws_thread.send(message)
            return cls.msg_id
        else:
            print('uarm is disconnect')

    @classmethod
    def send_and_callback(cls, message, callback=None):
        id = cls.send_msg(message)
        if callback is not None and callable(callback):
            cls.callbacks.append({'id': id, 'callback': callback, 'time': time.time()})

    @classmethod
    @auto_new_single_instance
    def uarm_set_position(cls, *args, **kwargs):
        wait = kwargs.get('wait', True)
        msg = {
            'cmd': 'uarm_set_position',
            'data': {
                'position': [kwargs.get('x', 150), kwargs.get('y', 0), kwargs.get('z', 150)],
                'speed': kwargs.get('speed', 6000),
                'relative': kwargs.get('relative', False),
                'wait': wait
            }
        }
        if wait:
            callback = kwargs.get('callback', None)
            cls.send_and_callback(msg, callback)
        else:
            cls.send_msg(msg)

    @classmethod
    def test_callback(cls, message):
        cls.uarm_set_buzzer(frequency=1000, duration=2)

    @classmethod
    @auto_new_single_instance
    def uarm_set_buzzer(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_set_buzzer',
            'data': {
                'frequency': kwargs.get('frequency', 1000),
                'duration': kwargs.get('duration', 1)
            }
        }
        if kwargs.get('wait', True):
            callback = kwargs.get('callback', None)
            cls.send_and_callback(msg, callback)
        else:
            cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_set_servo_angle(cls, *args, **kwargs):
        angle = kwargs.get('angle', 90)
        angle = angle if angle >= 0 else 0
        angle = angle if angle <= 180 else 180
        wait = kwargs.get('wait', True)
        speed = kwargs.get('speed', cls.speed * 6000 if wait else 0)
        msg = {
            'cmd': 'uarm_set_servo_angle',
            'data': {
                'angle': angle,
                'servo_num': kwargs.get('servoNumber', 0),
                'speed': speed,
                'wait': wait
            }
        }
        callback = kwargs.get('callback', None)
        cls.send_and_callback(msg, callback)

    @classmethod
    @auto_new_single_instance
    def uarm_base_turn(cls, *args, **kwargs):
        angle = kwargs.get('angle', 90)
        wait = kwargs.get('wait', True)
        speed = kwargs.get('speed', cls.speed * 3000 if wait else cls.speed * 10)

        kwargs = {
            'angle': angle,
            'servoNumber': 0,
            'speed': speed,
            'relative': True,
            'wait': True
        }
        cls.uarm_set_servo_angle(**kwargs)

    @classmethod
    @auto_new_single_instance
    def uarm_set_pump(cls, *args, **kwargs):
        on = kwargs.get('ON', False)
        wait = kwargs.get('wait', True)
        msg = {
            'cmd': 'uarm_set_pump',
            'data': {
                'on': on,
                'wait': wait
            }
        }
        if wait:
            cls.send_and_callback(msg, lambda x: cls.set_variable('pump_status', on))
        else:
            cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_set_gripper(cls, *args, **kwargs):
        on = kwargs.get('ON', False)
        wait = kwargs.get('wait', True)
        msg = {
            'cmd': 'uarm_set_gripper',
            'data': {
                'on': on,
                'wait': wait
            }
        }
        if wait:
            cls.send_and_callback(msg, lambda x: cls.set_variable('gripper_status', on))
        else:
            cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_wrist_turn(cls, *args, **kwargs):
        angle = kwargs.get('angle', 90)
        wait = kwargs.get('wait', True)
        cls.current_r = angle

        kwargs = {
            'angle': 180 - angle,
            'servoNumber': 3,
            'wait': wait
        }
        cls.uarm_set_servo_angle(**kwargs)

    @classmethod
    @auto_new_single_instance
    def uarm_set_servo_detach(cls, *args, **kwargs):
        wait = kwargs.get('wait', True)
        msg = {
            'cmd': 'uarm_set_servo_detach',
            'data': {
                'servo_num': kwargs.get('servoNumber', 0),
                'detach_all': kwargs.get('detachAll', False),
                'wait': wait
            }
        }
        if wait:
            callback = kwargs.get('callback', None)
            cls.send_and_callback(msg, callback)
        else:
            cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_set_servo_attach(cls, *args, **kwargs):
        wait = kwargs.get('wait', True)
        msg = {
            'cmd': 'uarm_set_servo_attach',
            'data': {
                'servo_num': kwargs.get('servoNumber', 0),
                'attach_all': kwargs.get('attachAll', False),
                'wait': wait
            }
        }
        if wait:
            callback = kwargs.get('callback', None)
            cls.send_and_callback(msg, callback)
        else:
            cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_start_report_position(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_start_report_position',
            'data': {
                'interval': kwargs.get('interval', 0.5)
            }
        }
        cls.send_msg(msg)
        cls.report_position = True

    @classmethod
    @auto_new_single_instance
    def uarm_stop_report_position(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_stop_report_position',
            'data': ''
        }
        cls.send_msg(msg)
        cls.report_position = False

    @classmethod
    @auto_new_single_instance
    def vision_start_report_face_detected(cls, *args, **kwargs):
        msg = {
            'cmd': 'vision_start_report_face_detected',
            'data': ''
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def vision_stop_report_face_detected(cls, *args, **kwargs):
        msg = {
            'cmd': 'vision_stop_report_face_detected',
            'data': ''
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def switch_camera(cls, *args, **kwargs):
        is_on = kwargs.get('on', False)
        msg = {
            'cmd': 'switch_camera',
            'data': {
                'on': kwargs.get('on', is_on)
            }
        }
        cls.send_msg(msg)
        cls.camera_connected = is_on
        if is_on:
            cls.vision_start_report_face_detected()
        else:
            cls.vision_stop_report_face_detected()

    @classmethod
    def set_speed(cls, speed):
        cls.speed = speed if speed >= 0 else 1

    @classmethod
    @auto_new_single_instance
    def uarm_set_acceleration(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_set_acceleration',
            'data': {
                'printing_moves': kwargs.get('printingMoves', 200),
                'retract_moves': kwargs.get('retractMoves', 200),
                'travel_moves': kwargs.get('travelMoves', 200),
            }
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def server_exit(cls, *args, **kwargs):
        msg = {
            'cmd': 'stop_core',
            'data': ''
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_list_ports(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_list_ports',
            'data': ''
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_set_polar(cls, *args, **kwargs):
        wait = kwargs.get('wait', True)
        rotation = kwargs.get('rotation', 0.0)
        stretch = kwargs.get('stretch', 0.0)
        height = kwargs.get('height', 0.0)
        msg = {
            'cmd': 'uarm_set_polar',
            'data': {
                'position': [float(rotation), float(stretch), float(height)],
                'speed': int(kwargs.get('speed', cls.speed * 6000 if wait else cls.speed * 10)),
                'relative': kwargs.get('relative', False),
                'wait': wait
            }
        }
        if wait:
            callback = kwargs.get('callback', None)
            cls.send_and_callback(msg, callback)
        else:
            cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_get_position(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_get_position',
            'data': ''
        }
        callback = kwargs.get('callback', args[0] if len(args) else None)
        cls.send_and_callback(msg, callback)

    @classmethod
    @auto_new_single_instance
    def uarm_start_teach_standby_mode(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_start_teach_standby_mode',
            'data': ''
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_stop_teach_standby_mode(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_stop_teach_standby_mode',
            'data': ''
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_start_recording(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_start_recording',
            'data': ''
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_stop_recording(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_stop_recording',
            'data': ''
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_start_playing(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_start_playing',
            'data': {
                'speed': kwargs.get('speed', 1),
                'times': kwargs.get('times', 1)
            }
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_stop_playing(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_stop_playing',
            'data': ''
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_set_play_speed(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_set_play_speed',
            'data': {
                'speed': kwargs.get('speed')
            }
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_init_grove(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_start_report_grove_sensor',
            'data': {
                'grove_type': kwargs.get('grove_type', 10),
                'pin': kwargs.get('pin', 'I0'),
                'interval': kwargs.get('interval', 0.1),
            }
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_stop_grove(cls, *args, **kwargs):
        msg = {
            'cmd': 'uarm_close_report_grove_sensor',
            'data': {
                'grove_type': kwargs.get('grove_type'),
            }
        }
        cls.send_msg(msg)

    @classmethod
    @auto_new_single_instance
    def uarm_control_grove(cls, *args, **kwargs):
        wait = kwargs.get('wait', True)
        msg = {
            'cmd': 'uarm_control_grove_sensor',
            'data': {
                'grove_type': kwargs.get('grove_type'),
                'pin': kwargs.get('pin'),
                'value': kwargs.get('value'),
                'wait': wait
            }
        }
        if wait:
            callback = kwargs.get('callback', None)
            cls.send_and_callback(msg, callback)
        else:
            cls.send_msg(msg)




if __name__ == '__main__':
    # UArm.test()
    # UArm.test()
    # UArm.test()
    # uarm = UArm()
    # uarm.test()

    # UArm.waiting_connect()

    UArm.uarm_set_position(x=250, y=0, z=90, wait=False)
    # UArm.stop()
    # time.sleep(2)
    UArm.uarm_set_position(x=180, y=0, z=150, wait=True, callback=print)

    # UArm.uarm_set_buzzer(frequency=500, duration=2)

    # UArm.uarm_set_pump(ON=True, wait=True)
    # time.sleep(2)
    # print('>>>>>>>', UArm.pump_status)
    # UArm.uarm_set_pump(ON=False, wait=True)
    # time.sleep(1)
    # print('>>>>>>>', UArm.pump_status)

    # UArm.uarm_set_gripper(ON=True, wait=True)
    # time.sleep(2)
    # UArm.uarm_set_gripper(ON=False, wait=True)

    # UArm.uarm_set_servo_angle(angle=120, servoNumber=0, speed=6000, wait=True)
    # UArm.uarm_set_servo_angle(angle=90, servoNumber=0, speed=6000, wait=True)

    # UArm.uarm_base_turn(angle=120, speed=6000, wait=True)
    # UArm.uarm_base_turn(angle=90, speed=6000, wait=True)

    # UArm.uarm_wrist_turn(angle=120, wait=True)
    # UArm.uarm_wrist_turn(angle=90, wait=True)

    # UArm.uarm_set_servo_detach(servoNumber=0, detachAll=False, wait=True)
    # time.sleep(1)
    # UArm.uarm_set_servo_attach(servoNumber=0, attachAll=False, wait=True)
    #
    # print('start_report_position')
    # UArm.uarm_start_report_position()
    # time.sleep(10)
    # print('stop_report_position')
    # UArm.uarm_stop_report_position()

    # UArm.uarm_start_recording()
    # time.sleep(10)
    # UArm.uarm_stop_recording()
    # time.sleep(5)
    # UArm.uarm_start_playing()
    # time.sleep(15)
    # UArm.uarm_stop_playing()

    # UArm.uarm_get_position(print)

    # UArm.server_exit()

    UArm.waiting_stop()
    print("====over======")

    # time.sleep(10)

    # import time
    # while True:
    #     time.sleep(10)

