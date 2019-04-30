from tornado import gen
from tornado.websocket import WebSocketHandler
from tornado.web import RequestHandler
import gl
from . import command
import datetime
from log import logger

class UArmWebSocket(WebSocketHandler):

    def __init__(self, *args, **kwargs):
        super(UArmWebSocket, self).__init__(*args, **kwargs)

    def check_origin(self, origin):
        return True

    def open(self):
        logger.debug("uArmWebSocket opened: {} {}".format(datetime.datetime.now(), self))
        gl.connected_clients.append(self)
        gl.send_greeting_msg(self)
        # gl.send_uarm_connection_msg(self)

    @gen.coroutine
    def on_message(self, message):
        if isinstance(message, bytes):
            return
        # print('message:', message)
        gl.push_request_queue(client=self, message=message)

    def on_close(self):
        logger.debug("uArmWebSocket closed: {} {}".format(datetime.datetime.now(), self))
        gl.connected_clients.remove(self)


class UArmReportHandler(RequestHandler):
    def get(self):
        self.render('report_position.html')

class UArmPythonHandler(RequestHandler):
    def get(self):
        self.render('python.html')