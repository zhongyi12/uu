from log import logger
from .command import Command
logger.debug('import Command')
from .interface_iteration import interface_change_list
import tornado
import sys
sys.path.append('..')

INFO = "INFO"
DEBUG = "DEBUG"
ERROR = "ERROR"

STATUS_ERROR = 0
STATUS_STANDBY = 1


class MessageProcess:
    uarm = None
    status = None
    error_msg = ""

    def __init__(self):
        self.command = Command()

    @tornado.gen.coroutine
    def process_message(self, client, msg):
        try:
            cmd = msg['cmd']
            if cmd in interface_change_list:
                cmd = interface_change_list[cmd]
            func = getattr(self.command, cmd)
            data = msg.get('data', None)
            logger.debug("==========="+cmd+"=================")
            config = msg.get('config', None)
            if config is not None:
                response = func(client, msg['id'], data, config)
            else:
                response = func(client, msg['id'], data)
            return response
        except Exception as e:
            logger.error(e)
