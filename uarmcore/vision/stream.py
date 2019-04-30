#!/usr/local/bin/python3
import sys
sys.path.append("../")
import tornado.ioloop
import tornado.web
import tornado
import gl
import tornado.gen
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
import time
import datetime
from log import logger

class StreamHandler(tornado.web.RequestHandler):
    executor = ThreadPoolExecutor(10)
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        self.connected = True
        gl.vision_clients.append(self)
        logger.debug('vision client open: {} {}'.format(datetime.datetime.now(), self))
        stream_frame = self.get_argument("frame", None)
        if stream_frame is not None:
            if gl.vision_ws is None or not gl.vision_ws.connected:
                self.write('can not connect to camera module, please connect camera via usb and start vision-server')
            else:
                gl.open_camera(True)
                count = 5
                while not gl.camera_connected and count:
                    count -= 1
                    yield tornado.gen.sleep(1)
                if not gl.camera_connected:
                    self.write('camera is not open')
                else:
                    self.set_header('Content-Type', 'multipart/x-mixed-replace; boundary=frame')
                    yield self.get_frame()
                    self.finish('close')
                    gl.open_camera(False)
            # oc = gl.camera_connected
            # if not oc:
            #     self.write("Camera Not Open")
            # else:
            #     self.set_header('Content-Type', 'multipart/x-mixed-replace; boundary=frame')
            #     # if gl.video is not None:
            #     #     rect = (153, 163, 340, 335)
            #     #     gl.video.select_rect(rect)
            #
            #     yield self.get_frame()
            #     self.finish('close')

    def on_connection_close(self):
        logger.debug('vision client close: {} {}'.format(datetime.datetime.now(), self))
        self.connected = False
        try:
            gl.vision_clients.remove(self)
        except:
            pass
        # print(gl.vision_clients)

    def on_finish(self):
        logger.debug('vision client finish: {} {}'.format(datetime.datetime.now(), self))
        self.connected = False
        try:
            gl.vision_clients.remove(self)
        except:
            pass
        # print(gl.vision_clients)

    @run_on_executor
    def get_frame(self):
        # try:
        #     with closing(requests.get('http://localhost:18322/video?frame', stream=True, timeout=(5, 5))) as r:
        #         frame = b''
        #         lines = r.iter_lines(delimiter=b'\r\n\r\n')
        #         # next(lines)
        #         for line in lines:
        #             if not self.connected or not gl.camera_connected:
        #                 print("========================")
        #                 r.close()
        #                 break
        #             if b'--frame\r\n' in line:
        #                 try:
        #                     tracked = line.split(b'\r\n')[1].split(b':')[1]
        #                     if tracked == b'True':
        #                         gl.face_detect = True
        #                     elif tracked == b'False':
        #                         gl.face_detect = False
        #                 except:
        #                     pass
        #                 self.write(frame)
        #                 frame = b''
        #                 try:
        #                     self.flush()
        #                 except:
        #                     pass
        #             frame += line + b'\r\n\r\n'
        # except Exception as e:
        #     print(e)

        while self.connected:
            frame = gl.get_frame()
            if frame is not None:
                # gl.face_detect = gl.video.tracked
                self.write(b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
                try:
                    self.flush()
                except:
                    pass
            time.sleep(0.04)


        # while gl.camera_connected and self.connected:
        #     frame = gl.get_frame()
        #     if frame is not None:
        #         # gl.face_detect = gl.video.tracked
        #         self.write(b'--frame\r\n'
        #                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        #         try:
        #             self.flush()
        #         except:
        #             pass
        #     time.sleep(0.04)

if __name__ == '__main__':

    application = tornado.web.Application([
        (r"/video", StreamHandler),
    ])


    if __name__ == "__main__":
        application.listen(8888)
        tornado.ioloop.IOLoop.instance().start()
