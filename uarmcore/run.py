#-*- coding: UTF-8 -*-
#!/usr/local/bin/python3
import sys

from version import __version__
from version import update_time
sys.stdout.write('uArmCore Version: {}\n'.format(__version__))
sys.stdout.write('uArmCore Updated: {}\n'.format(update_time))
try:
    from pyuarm import __version__ as pyuarm_version
    from pyuarm import update_time as pyuarm_update_time
    sys.stdout.write('pyuarm Version: {}\n'.format(pyuarm_version))
    sys.stdout.write('pyuarm Updated: {}\n'.format(pyuarm_update_time))
except:
    pass

from log import logger
from tornado import ioloop
from tornado.web import Application
import argparse
import os
from webserver.message_process import MessageProcess
from webserver.uarmsocket import UArmWebSocket, UArmReportHandler, UArmPythonHandler
from vision.stream import StreamHandler
import gl
from vision.websocketclient import VisionWebSocketClient
from openmv.websocketclient import OpenMVWebSocketClient

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "--idle", help="long term mode", action="store_true")
    parser.add_argument("-v", "--verbose", help="Print more log", action="store_true")
    args = parser.parse_args()

    message_processer = MessageProcess()
    # print("uArm Server Version: " + __version__)
    gl.init_command_process(message_processer)
    logger.debug('Init message_processer')

    # settings = {
    #     'template_path': os.path.join(os.path.dirname(__file__), 'templates'),
    #     'static_path': os.path.join(os.path.dirname(__file__), 'static'),
    # }
    settings = {
        'template_path': os.path.join(os.path.split(sys.path[0])[0], 'templates'),
        'static_path': os.path.join(os.path.split(sys.path[0])[0], 'static'),
    }

    app = Application([
        (r'/ws', UArmWebSocket),
        (r"/video", StreamHandler),
        (r"/report", UArmReportHandler),
    ], **settings)

    app.listen(18321, address="0.0.0.0")
    logger.debug('App Listen')
    # app.listen(18321)
    main_loop = ioloop.IOLoop.instance()
    main_loop.add_timeout(1, gl.auto_connect_loop)
    main_loop.add_timeout(2, gl.report_button_status_loop)
    main_loop.add_timeout(2, gl.auto_check_teach_status)
    main_loop.add_timeout(2, gl.auto_check_power_status)
    main_loop.add_timeout(2, gl.auto_check_tip_sensor)
    main_loop.add_timeout(5, gl.process_request_loop)
    main_loop.add_timeout(5, gl.process_response_loop)


    # main_loop.add_timeout(6, gl.uarm_auto_patrol)
    main_loop.add_timeout(7, gl.auto_broadcast_state)
    # main_loop.add_timeout(8, gl.auto_get_openmv_output_data)

    gl.vision_ws = VisionWebSocketClient(main_loop)
    ws_url = 'ws://localhost:18322/ws'
    gl.vision_ws.connect(ws_url, auto_reconnect=True, reconnect_interval=5)

    # gl.openmv_ws = OpenMVWebSocketClient(main_loop)
    # ws_url = 'ws://localhost:18323/ws'
    # gl.openmv_ws.connect(ws_url, auto_reconnect=True, reconnect_interval=5)

    # main_loop.add_timeout(8, gl.auto_connect_vision_loop)
    # main_loop.add_timeout(5, gl.get_frame_loop)

    # print('pid:', os.getpid())

    if args.idle:
        logger.debug('Idle Mode')
    else:
        main_loop.add_timeout(10, gl.check_idle_loop)
    if args.verbose:
        gl.UARMCORE_DEBUG = True
    logger.debug('main start')
    try:
        main_loop.start()
    except:
        pass
    finally:
        gl.vision_ws.close()
