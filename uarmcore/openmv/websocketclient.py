

from log import logger
import gl
import json
import threading
from tornado import websocket
from tornado import httpclient
from tornado import httputil
from tornado import gen
import datetime
import time
import numpy as np
from PIL import Image

DEFAULT_CONNECT_TIMEOUT = 30
DEFAULT_REQUEST_TIMEOUT = 30

class WebSocketClient(object):
    DISCONNECTED = 0
    CONNECTING = 1
    CONNECTED = 2
    def __init__(self, io_loop=None, connect_timeout=DEFAULT_CONNECT_TIMEOUT, request_timeout=DEFAULT_REQUEST_TIMEOUT):
        self.connect_timeout = connect_timeout
        self.request_timeout = request_timeout
        self._io_loop = io_loop or io_loop.IOLoop.current()
        self._ws_connection = None
        self._connect_status = self.DISCONNECTED

    def connect(self, url):
        self._connect_status = self.CONNECTING
        headers = httputil.HTTPHeaders({'Content-Type': 'application/json'})
        request = httpclient.HTTPRequest(url=url,
                                         connect_timeout=self.connect_timeout,
                                         request_timeout=self.request_timeout,
                                         headers=headers)
        ws_coon = websocket.WebSocketClientConnection(self._io_loop, request)
        ws_coon.connect_future.add_done_callback(self._connect_callback)

    def send(self, data):
        if self._ws_connection:
            try:
                self._ws_connection.write_message(json.dumps(data))
                return True
            except:
                return False
        else:
            return False

    def close(self, reason=''):
        if self._connect_status != self.DISCONNECTED:
            self._connect_status = self.DISCONNECTED
            self._ws_connection and self._ws_connection.close()
            self._ws_connection = None
            self.on_connection_close(reason)

    def _connect_callback(self, future):
        if future.exception() is None:
            self._connect_status = self.CONNECTED
            self._ws_connection = future.result()
            self.on_connection_success()
            self._read_messages()
        else:
            self.close(future.exception())

    def is_connected(self):
        return self._ws_connection is not None

    @gen.coroutine
    def _read_messages(self):
        while True:
            msg = yield self._ws_connection.read_message()
            if msg is None:
                self.close()
                break
            self.on_message(msg)

    def on_message(self, msg):
        pass

    def on_connection_success(self):
        pass

    def on_connection_close(self, reason):
        pass


class OpenMVWebSocketClient(WebSocketClient):
    msg = {
        'type': 'msg',
        'from': 'uArmCore',
        'to': 'OpenMV-Server',
        'body': 'Connect'
    }
    hb_msg = {'type': 'hb'}
    heartbeat_interval_in_secs = 3
    connected = False
    def __init__(self, io_loop=None, connect_timeout=DEFAULT_CONNECT_TIMEOUT, request_timeout=DEFAULT_REQUEST_TIMEOUT):
        self.connect_timeout = connect_timeout
        self.request_timeout = request_timeout
        self._io_loop = io_loop or io_loop.IOLoop.current()
        self.ws_url = None
        self.auto_reconnect = False
        super(OpenMVWebSocketClient, self).__init__(self._io_loop, self.connect_timeout, self.request_timeout)

    def connect(self, url, auto_reconnect=True, reconnect_interval=10):
        self.ws_url = url
        self.auto_reconnect = auto_reconnect
        self.reconnect_interval = reconnect_interval
        super(OpenMVWebSocketClient, self).connect(self.ws_url)

    @gen.coroutine
    def on_message(self, message):
        if isinstance(message, bytes):
            gl.openmv_fb_data = message
        else:
            try:
                json_data = json.loads(message, encoding='utf-8')
                if 'cmd' in json_data:
                    cmd = json_data.get('cmd')
                    data = json_data.get('data')
                    if cmd == 'openmv_connection':
                        print(message)
                        gl.openmv_connected = data.get('connection_state')
                        gl.openmv_running = data.get('running_state')
                        gl.openmv_enable_terminal_output = data.get('openmv_enable_terminal_output')
                        gl.openmv_enable_fb_output = data.get('openmv_enable_fb_output')
                    elif cmd == 'openmv_terminal_output':
                        gl.openmv_fb_width = data.get('width')
                        gl.openmv_fb_height = data.get('height')
                        buf = data.get('output')
                        if buf:
                            if isinstance(buf, bytes):
                                buf = buf.decode('utf-8').strip().strip('\r\n')
                            for data in buf.split('\r\n'):
                                if not data:
                                    return
                                if data.startswith('centroid'):
                                    centroid = data.split('\n')[0].split('\r\n')[0].split(':')[1].split(',')
                                    centroid = [float(p) for p in centroid]
                                    centroid.append(time.time())
                                    # print("centroid: {}".format(centroid))
                                    gl.openmv_output_queue.put_nowait({'centroid': centroid})
                                elif data.startswith('threshold'):
                                    threshold = eval(data.split('\n')[0].split('\r\n')[0].split(':')[1])
                                    if len(threshold) == 6 and gl.uarm_openmv_state == gl.define.UARM_OPENMV_LEARN_COLOR:
                                        gl.threshold = threshold
                                    # gl.openmv_output_queue.put_nowait({'threshold': threshold})
                                elif data.startswith('line'):
                                    line = eval(data.split('\n')[0].split('\r\n')[0].split(':')[1])
                                    gl.openmv_output_queue.put_nowait({'line': line})
                                else:
                                    gl.openmv_output_queue.put_nowait(data)
            except Exception as e:
                pass

    def on_connection_success(self):
        logger.debug("open openmv websocket: {} {}".format(datetime.datetime.now(), self))
        self.connected = True
        gl.openmv_connected = True
        # self.send(self.msg)

    def on_connection_close(self, reason):
        if self.connected:
            logger.debug('close openmv websocket: {} {}'.format(datetime.datetime.now(), self))
            self.connected = False
            gl.openmv_connected = False
            gl.openmv_running = False
        self.reconnect()

    def reconnect(self):
        if not self.connected and self.auto_reconnect:
            self._io_loop.call_later(self.reconnect_interval, super(OpenMVWebSocketClient, self).connect, self.ws_url)


# import websocket
# class VisionWebSocket(threading.Thread):
#     def __init__(self):
#         super(VisionWebSocket, self).__init__()
#         websocket.enableTrace(True)
#
#         self.__connection_state = False
#         self.connect()
#
#     def connect(self):
#         if not self.__connection_state:
#             self.ws = websocket.WebSocketApp("ws://localhost:18322/ws",
#                 on_open=self.on_open,
#                 on_close=self.on_close,
#                 on_message=self.on_message,
#                 on_error=self.on_error)
#
#     def run(self):
#         self.ws.run_forever()
#
#     def on_open(self, ws):
#         self.__connection_state = True
#         logger.debug("open vision websocket")
#
#     def on_close(self, ws):
#         self.__connection_state = False
#         logger.debug("close vision websocket")
#
#     def on_message(self, ws, message):
#         if isinstance(message, bytes):
#             gl.frame = message
#         else:
#             json_data = json.loads(message, encoding='utf-8')
#             if 'mcd' in json_data:
#                 if json_data['cmd'] == 'camera_state':
#                     gl.camera_connected = json_data['data']['camera_connected']
#                 elif json_data['cmd'] == 'face_detect':
#                     gl.face_detect = json_data['data']['tracked']
#                     print(json_data)
#     def on_error(self, error):
#         self.__connection_state = False
#         logger.debug("error on vision websocket")
#
#     def send(self, msg):
#         if self.__connection_state:
#             try:
#                 self.ws.send(json.dumps(msg, ensure_ascii=False))
#             except:
#                 pass
#
#     @property
#     def connection_state(self):
#         return self.__connection_state

