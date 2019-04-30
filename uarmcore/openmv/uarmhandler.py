#!/usr/bin/env python
# -*- coding: utf-8 -*-
# __author__ = 'vinman'

import time
import math
import threading
from queue import LifoQueue
from tornado import gen
from concurrent.futures import ThreadPoolExecutor
import gl
from openmv import define
from tornado.concurrent import run_on_executor
import tornado
import os
import json

openmv_config_dir = os.path.join(os.path.expanduser("~"), "uarm", "studio", "openmv")
openmv_scripts_dir = os.path.join(openmv_config_dir, "scripts")
if not os.path.exists(openmv_scripts_dir):
    os.makedirs(openmv_scripts_dir)
openmv_config_file = os.path.join(openmv_config_dir, 'openmv_config.json')

init_scripts_config = {
    '0': 'find_blobs.py',
    '1': 'find_edges.py',
    '2': 'find_line.py',
    '3': 'find_line_segments.py',
    '4': 'find_keypoints.py',
    '5': 'learn_color.py',
    '6': 'learn_keypoints.py',
    '7': 'find_rects.py',
    '8': 'find_circles.py',
}

init_color_thresholds = [
    define.RED_COLOR_THRESHOLD,
    define.GREEN_COLOR_THRESHOLD,
    define.BLUE_COLOR_THRESHOLD,
    define.YELLOW_COLOR_THRESHOLD,
    define.PINK_COLOR_THRESHOLD,
    define.PURPLE_COLOR_THRESHOLD
]


class OpenMVConfig(object):
    def __init__(self):
        super(OpenMVConfig, self).__init__()
        self.config = {}
        self.init_config()

    def init_config(self):
        self.read_config()
        if 'scripts' not in self.config or self.config['scripts'] != init_scripts_config:
            self.config.update({'scripts': init_scripts_config})
        if 'color_thresholds' not in self.config:
            self.config.update({'color_thresholds': init_color_thresholds})
        self.write_config()

    def clear_and_write_color_thresholds(self, thresholds):
        if len(thresholds) == 0:
            return
        self.config['color_thresholds'] = []
        for threshold in thresholds:
            if (isinstance(threshold, list) or isinstance(threshold, tuple)) and len(threshold) == 6:
                self.config['color_thresholds'].append(threshold)
        self.write_config()

    def append_color_threshold(self, threshold):
        if len(threshold) != 6:
            return
        if threshold not in self.config['color_thresholds']:
            self.config['color_thresholds'].append(threshold)
            if len(self.config['color_thresholds']) > 16:
                self.config['color_thresholds'].pop(0)
            self.write_config()

    def read_config(self):
        try:
            with open(openmv_config_file, 'r') as f:
                self.config = json.loads(f.read())
        except:
            pass

    def write_config(self):
        try:
            with open(openmv_config_file, 'w') as f:
                f.write(json.dumps(self.config, sort_keys=True, indent=4, skipkeys=True, separators=(',', ':'), ensure_ascii=False))
        except Exception as e:
            pass

    def get_script_data(self, num, thresholds=None, descriptor_filename=None):
        filename = self.config['scripts'].get(str(num), None)
        if filename:
            path = os.path.join(openmv_scripts_dir, filename)
            if os.path.exists(path):
                try:
                    with open(path, 'r') as f:
                        lines = f.readlines()
                    if num == 0 or num == 4 or num == 6:
                        for i, line in enumerate(lines):
                            if num == 0 and line.startswith('thresholds = []'):
                                if thresholds is None:
                                    thresholds = self.config.get('color_thresholds')
                                if thresholds is None or len(thresholds) == 0:
                                    thresholds = init_color_thresholds
                                lines[i] = "thresholds = %s" % thresholds
                            elif (num == 4 or num == 6) and line.startswith('descriptor_filename = "desc"'):
                                if descriptor_filename is None:
                                    descriptor_filename = 'desc'
                                lines[i] = 'descriptor_filename = "' + descriptor_filename + '"'

                    buf = '\n'.join(lines)
                    return buf
                except Exception as e:
                    print(e)
                    pass




class UArmHandler(object):
    executor = ThreadPoolExecutor(10)

    def __init__(self):
        super(UArmHandler, self).__init__()
        self.init()

    def init(self):
        self.trackCode = 0
        self.timeout = 20
        self.config = {}
        self.error = None

        self.patrol_x = [150, 250]
        self.patrol_y = [-100, 100]
        self.patrol_z = 150

        self.start_x = 180
        self.start_y = 0
        self.start_z = 150

        self.target_x = 150
        self.target_y = 120

        self.running = False

        self.set_config({})

    @gen.coroutine
    def run(self):
        if not gl.uarm_connected:
            return

        tornado.ioloop.IOLoop.instance().add_callback(self.auto_get_report_position_and_tip_sensor_state)

        # self.uarm_set_position(x=180, y=0, z=150, speed=self.speed_move, wait=False)
        gl.detect_position_queue.queue.clear()

        tornado.ioloop.IOLoop.instance().add_callback(self.uarm_controller)

        self.running = True

        while True:
            yield gen.sleep(2)

        # gl.first_detect = True
        # gl.first_detect_position = None
        # gl.check_tip_sensor_state = False
        # gl.tip_sensor_state = False
        # gl.trackState = 0
        # gl.detect_position_queue.queue.clear()
        # self.uarm_set_pump(False)
        # self.uarm_set_position(x=180, y=0, z=150, speed=self.speed_move, wait=False)
        # self.running = False

    def set_config(self, config):
        self.config = config
        self.speed_pump = self.config.get('speed_pump', 1000)
        self.speed_detect = self.config.get('speed_detect', 2000)
        self.speed_patrol = self.config.get('speed_patrol', 4000)
        self.speed_move = self.config.get('speed_move', 6000)

    @run_on_executor
    def auto_get_report_position_and_tip_sensor_state(self):
        while True:
            if gl.uarm_connected and gl.uarm is not None and gl.uarm_openmv_state != define.UARM_OPENMV_DISABLE:
                try:
                    gl.uarm.set_report_position(0.2, wait=True)
                    while gl.uarm_connected and gl.uarm is not None and gl.uarm_openmv_state != define.UARM_OPENMV_DISABLE:
                        try:
                            gl.previous_position = gl.current_position
                            gl.current_position = gl.uarm.get_report_position()
                            if gl.current_position:
                                gl.current_position.append(time.time())
                            # print('previous:',gl.previous_position)
                            # print('current:',gl.current_position)

                            if gl.check_tip_sensor_state:
                                # pump = gl.uarm.send_and_receive("P2233")
                                # if pump and len(pump) >= 0:
                                #     if pump[1] and len(pump[1]) >= 2:
                                #         if pump[1][1] == 'V0':
                                #             gl.tip_sensor_state = False
                                #         elif pump[1][1] == 'V1':
                                #             gl.tip_sensor_state = True
                                state = gl.uarm.get_tip_sensor()
                                if state is not None and gl.tip_sensor_state != state:
                                    gl.tip_sensor_state = state
                        except Exception as e:
                            pass
                        time.sleep(0.2)
                except:
                    pass
                finally:
                    try:
                        gl.uarm.set_pump(False)
                        gl.uarm.close_report_position()
                        gl.first_detect = True
                        gl.first_detect_position = None
                        gl.check_tip_sensor_state = False
                        gl.tip_sensor_state = False
                        gl.detect_position_queue.queue.clear()
                        self.uarm_set_pump(False)
                        self.uarm_set_position(x=180, y=0, z=150, speed=self.speed_move, wait=False)
                    except:
                        pass
            time.sleep(1)

    def uarm_set_pump(self, state):
        if gl.uarm_connected and gl.uarm is not None:
            gl.uarm.set_pump(state, wait=True)

    def uarm_set_position(self, x=None, y=None, z=None, speed=None, wait=False, timeout=20, reset=True):
        if gl.uarm_connected and gl.uarm is not None:
            command = "G0"
            flag = False
            x_flag = False
            y_flag = False
            z_flag = False
            if x is not None:
                if x > 300 or x < 140:
                    flag = True
                x_flag = True
                command += " X{0:.2f}".format(x)
            if y is not None:
                if abs(y) > 130:
                    flag = True
                y_flag = True
                command += " Y{0:.2f}".format(y)
            if z is not None:
                z_flag = True
                command += " Z{0:.2f}".format(z)
            if speed is not None:
                command += " F{}".format(speed)
            if flag:
                if reset:
                    command = "G0 X180 Y0 Z150 F{}".format(self.speed_move * 2)
                    x_flag = y_flag = z_flag = True
                    wait = False
                else:
                    command = "G0"
            # gl.uarm.send_msg(command)
            gl.uarm.send_and_receive(command)
            # if flag:
            #     gl.trackState = 1

            if wait:
                timeout = self.timeout if timeout is None else timeout
                start_time = time.time()
                while True:
                    pos = gl.current_position
                    if pos:
                        if x_flag and abs(pos[0] - x) < 3:
                            x_flag = False
                        if y_flag and abs(pos[1] - y) < 3:
                            y_flag = False
                        if z_flag and abs(pos[2] - z) < 3:
                            z_flag = False
                        if not x_flag and not y_flag and not z_flag:
                            break
                        else:
                            if int(time.time() - start_time) > timeout:
                                break
                    time.sleep(0.2)
                if flag or x_flag or y_flag or z_flag:
                    print(command, gl.current_position)
                    gl.trackState = 1
                    gl.first_detect = True
                    gl.check_tip_sensor_state = False
                    gl.tip_sensor_state = False
                    gl.first_detect_position = None
                    self.uarm_set_pump(False)
                    gl.detect_position_queue.queue.clear()
                    return False
                else:
                    return True
            else:
                return True
        # else:
        #     gl.trackState = 0
        #     return False

    @run_on_executor
    def uarm_controller(self):
        while True:
            try:
                if gl.uarm_openmv_state == define.UARM_OPENMV_DISABLE:
                    if gl.openmv_running:
                        if gl.openmv_ws and gl.openmv_ws.is_connected:
                            msg = {
                                'id': 0,
                                'cmd': 'openmv_stop_script',
                                'data': ''
                            }
                            gl.openmv_ws.send(msg)
                    time.sleep(0.5)
                    continue
                if gl.uarm_openmv_state == define.UARM_OPENMV_PATROL:
                    print("******uarm-openmv-patrol******")
                    self.uarm_automatic_patrol()
                elif gl.uarm_openmv_state == define.UARM_OPENMV_LOCATE:
                    print("******uarm-openmv-locate******")
                    self.uarm_automatic_locate()
                elif gl.uarm_openmv_state == define.UARM_OPENMV_CATCH:
                    print("******uarm-openmv-catch******")
                    self.uarm_automatic_catch()
                elif gl.uarm_openmv_state == define.UARM_OPENMV_TRACK:
                    print("******uarm-openmv-track******")
                    self.uarm_automatic_track()
                elif gl.uarm_openmv_state == define.UARM_OPENMV_TRACK_LINE:
                    print("******uarm-openmv-track-line******")
                    self.uarm_automatic_track_line()
                elif gl.uarm_openmv_state == define.UARM_OPENMV_LEARN_COLOR:
                    print("******uarm-openmv-learn-color******")
                    self.uarm_reset_position()
                elif gl.uarm_openmv_state == define.UARM_OPENMV_LEARN_KEYPOINTS:
                    print("******uarm-openmv-learn-keypoints******")
                    self.uarm_reset_position()
            except Exception as e:
                print(e)
            time.sleep(0.5)

    def uarm_automatic_patrol(self):
        min_x, max_x = self.patrol_x
        mid_x = (min_x + max_x) / 2
        min_y, max_y = self.patrol_y
        mid_y = (min_y + max_y) / 2
        second_min_y = (min_y * 3 + max_y) / 4
        second_max_y = (max_y * 3 + min_y) / 4
        z_height = self.patrol_z
        while gl.uarm_openmv_state == define.UARM_OPENMV_PATROL:
            self.uarm_set_position(x=min_x, y=min_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            gl.start_detect = True
            # time.sleep(0.2)
            self.uarm_set_position(x=min_x, y=max_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=mid_x, y=max_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=mid_x, y=min_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=max_x, y=min_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=max_x, y=max_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=mid_x, y=max_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=min_x, y=second_max_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=max_x, y=second_min_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=min_x, y=second_min_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=max_x, y=second_max_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=min_x, y=second_max_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=max_x, y=mid_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=min_x, y=mid_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=max_x, y=min_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=min_x, y=min_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=max_x, y=mid_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=max_x, y=second_min_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)
            self.uarm_set_position(x=min_x, y=min_y, z=z_height, speed=self.speed_patrol)
            if gl.uarm_openmv_state != define.UARM_OPENMV_PATROL:
                break
            # time.sleep(0.2)

    def uarm_automatic_locate(self):
        start_time = time.time()
        print('openmv_feature:', gl.openmv_feature)
        if gl.openmv_feature == define.OPENMV_FIND_RECTS \
            or gl.openmv_feature == define.OPENMV_FIND_CIRCLES \
            or gl.openmv_feature == define.OPENMV_FIND_EDGES:
            distance = 3
            height = 90
        else:
            distance = 5
            height = 150

        while gl.uarm_openmv_state == define.UARM_OPENMV_LOCATE:
            try:
                if gl.detect_position_queue.qsize() == 0 and not gl.first_detect:
                    time.sleep(0.5)
                    if gl.detect_position_queue.qsize() != 0 or gl.uarm_openmv_state != define.UARM_OPENMV_LOCATE:
                        continue

                    pos = gl.uarm.get_report_position()
                    if not pos:
                        continue
                    offset = 10
                    print("===============")
                    self.uarm_set_position(x=pos[0] + offset, y=pos[1] + offset, speed=self.speed_detect // 2)
                    if gl.detect_position_queue.qsize() != 0 or gl.uarm_openmv_state != define.UARM_OPENMV_LOCATE:
                        continue
                    time.sleep(0.5)
                    self.uarm_set_position(x=pos[0] + offset, y=pos[1] - offset, speed=self.speed_detect // 2)
                    if gl.detect_position_queue.qsize() != 0 or gl.uarm_openmv_state != define.UARM_OPENMV_LOCATE:
                        continue
                    time.sleep(0.5)
                    self.uarm_set_position(x=pos[0] - offset, y=pos[1] + offset, speed=self.speed_detect // 2)
                    if gl.detect_position_queue.qsize() != 0 or gl.uarm_openmv_state != define.UARM_OPENMV_LOCATE:
                        continue
                    time.sleep(0.5)
                    self.uarm_set_position(x=pos[0] - offset, y=pos[1] - offset, speed=self.speed_detect // 2)
                    if gl.detect_position_queue.qsize() != 0 or gl.uarm_openmv_state != define.UARM_OPENMV_LOCATE:
                        continue
                    time.sleep(0.5)
                    self.uarm_set_position(x=pos[0], y=pos[1], speed=self.speed_detect // 2)
                    if gl.detect_position_queue.qsize() != 0 or gl.uarm_openmv_state != define.UARM_OPENMV_LOCATE:
                        continue

                    if time.time() - start_time < 10:
                        time.sleep(0.2)
                        continue

                    gl.first_detect = True
                    gl.first_detect_position = None
                    gl.uarm_openmv_state = define.UARM_OPENMV_PATROL
                    gl.start_detect = False
                    gl.detect_position_queue.queue.clear()
                    gl.first_detect = True
                    gl.first_detect_position = None
                    # self.uarm_set_position(x=180, y=0, z=150, speed=self.speed_move * 2)
                    continue

                if gl.first_detect:
                    # if len(gl.first_detect_position) == 0:
                    #     continue
                    #
                    # detect_position = gl.first_detect_position[0]
                    # centroid = detect_position.get('centroid')
                    # distance_x = centroid[0] - gl.openmv_fb_width / 2
                    # distance_y = centroid[1] - gl.openmv_fb_height / 2
                    # _distance = pow(distance_x, 2) + pow(distance_y, 2)
                    # for detect in gl.first_detect_position:
                    #     c = detect.get('centroid')
                    #     if pow(c[0] - gl.openmv_fb_width / 2, 2) + pow(c[1] - gl.openmv_fb_height / 2, 2) < _distance:
                    #         detect_position = detect
                    #
                    # pos = detect_position.get('position')
                    # centroid = detect_position.get('centroid')
                    #
                    # print('first:', detect_position)
                    # print('color_code:', gl.color_code)

                    pos = gl.first_detect_position.get('position')
                    centroid = gl.first_detect_position.get('centroid')

                    # gl.first_detect = False
                    # gl.first_detect_position = None
                else:
                    detect_pos_list = []
                    size = gl.detect_position_queue.qsize()
                    for i in range(size):
                        try:
                            detect_pos_list.append(gl.detect_position_queue.get_nowait())
                        except:
                            break
                    if len(detect_pos_list) == 0:
                        continue
                    detect_position = detect_pos_list[0]
                    centroid = detect_position.get('centroid')
                    distance_x = centroid[0] - gl.openmv_fb_width / 2
                    distance_y = centroid[1] - gl.openmv_fb_height / 2
                    _distance = pow(distance_x, 2) + pow(distance_y, 2)
                    for detect in detect_pos_list:
                        c = detect.get('centroid')
                        if pow(c[0] - gl.openmv_fb_width / 2, 2) + pow(c[1] - gl.openmv_fb_height / 2, 2) < _distance:
                            detect_position = detect

                    # detect_position = detect_pos_list[0]
                    # detect_position = gl.detect_position_queue.get_nowait()
                    pos = detect_position.get('position')
                    centroid = detect_position.get('centroid')

                gl.detect_position_queue.queue.clear()
                distance_x = centroid[0] - gl.openmv_fb_width / 2
                distance_y = centroid[1] - gl.openmv_fb_height / 2

                # if gl.first_detect:
                #     if not self.uarm_set_position(x=pos[0], y=pos[1], speed=self.speed_move):
                #         continue


                if abs(distance_x) < distance and abs(distance_y) < distance:
                    pos = gl.uarm.get_report_position()
                    if not pos:
                        continue
                    if distance_x < -3:
                        pos[1] -= 2
                    elif distance_x > 3:
                        pos[1] += 2
                    if distance_y < -3:
                        pos[0] -= 2
                    elif distance_y > 3:
                        pos[0] += 2

                    x0 = 45 * pos[0] / math.sqrt(pow(pos[0], 2) + pow(pos[1], 2))
                    y0 = pos[1] / pos[0] * x0
                    tmp_pos = [pos[0] + x0, pos[1] + y0]
                    if not self.uarm_set_position(x=tmp_pos[0], y=tmp_pos[1], speed=self.speed_move):
                        continue

                    gl.uarm_openmv_state = define.UARM_OPENMV_DETECT
                    print("============detect==============")
                    self.trackCode = centroid[2]
                    gl.start_detect = False
                    gl.detect_position_queue.queue.clear()
                    break

                if gl.first_detect:
                    # pos = gl.uarm.get_report_position()
                    # if not pos:
                    #     continue
                    # x = pos[0] + distance_y * 0.68
                    # y = pos[1] + distance_x * 0.6
                    # print(x, y)
                    x = pos[0] + distance_y / gl.openmv_fb_height * 145
                    y = pos[1] + distance_x / gl.openmv_fb_width * 190
                    print(pos, centroid)
                    print('x={}, y={}, z={}'.format(x, y, height))
                    if not self.uarm_set_position(x=x, y=y, z=height, speed=self.speed_move):
                        continue
                    time.sleep(1)
                    gl.detect_position_queue.queue.clear()
                    gl.first_detect = False
                    gl.first_detect_position = []
                    continue

                # if distance_x > gl.openmv_fb_width / 4 or distance_y > gl.openmv_fb_height / 4:
                #     gl.detect_position_queue.queue.clear()
                #     if time.time() - start_time > 10:
                #         break
                #     continue

                start_time = time.time()

                # pos = gl.uarm.get_report_position()
                # if not pos:
                #     continue
                # print(pos)
                if distance_x <= 0:
                    # pos[1] -= 2
                    if abs(distance_x) > 60:
                        pos[1] -= 10
                    elif abs(distance_x) > 30:
                        pos[1] -= 5
                    else:
                        pos[1] -= 2
                else:
                    # pos[1] += 2
                    if abs(distance_x) > 60:
                        pos[1] += 10
                    elif abs(distance_x) > 30:
                        pos[1] += 5
                    else:
                        pos[1] += 2
                if distance_y <= 0:
                    # pos[0] -= 2
                    if abs(distance_y) > 60:
                        pos[0] -= 10
                    elif abs(distance_y) > 30:
                        pos[0] -= 5
                    else:
                        pos[0] -= 2
                else:
                    # pos[0] += 2
                    if abs(distance_y) > 60:
                        pos[0] += 10
                    elif abs(distance_y) > 30:
                        pos[0] += 5
                    else:
                        pos[0] += 2
                if not self.uarm_set_position(x=pos[0], y=pos[1], speed=self.speed_detect):
                    continue
                gl.detect_position_queue.queue.clear()

            except Exception as e:
                pass

    def uarm_automatic_catch(self):
        while gl.uarm_openmv_state == define.UARM_OPENMV_CATCH:
            # pos = gl.uarm.get_report_position()
            # if not pos:
            #     continue
            # x0 = 45 * pos[0] / math.sqrt(pow(pos[0], 2) + pow(pos[1], 2))
            # y0 = pos[1] / pos[0] * x0
            # tmp_pos = [pos[0] + x0, pos[1] + y0]
            # if not self.uarm_set_position(x=tmp_pos[0], y=tmp_pos[1], speed=self.speed_move):
            #     continue

            if not self.uarm_set_position(z=60, speed=self.speed_detect):
                continue

            gl.check_tip_sensor_state = True
            while not gl.tip_sensor_state:
                pos = gl.uarm.get_position()
                if pos:
                    if pos[2] <= 0:
                        break
                    z = pos[2] - 2
                    if not self.uarm_set_position(z=z, speed=self.speed_pump, timeout=10):
                        break

            gl.check_tip_sensor_state = False
            gl.tip_sensor_state = False
            if gl.uarm_openmv_state != define.UARM_OPENMV_CATCH:
                continue
            self.uarm_set_pump(True)
            time.sleep(1)
            self.uarm_set_position(z=90, speed=self.speed_detect, timeout=15)

            x, y = [150, 129]
            self.uarm_set_position(x=x, y=y, z=90, speed=self.speed_detect)
            self.uarm_set_position(z=80, speed=self.speed_detect)

            gl.check_tip_sensor_state = True
            while not gl.tip_sensor_state:
                pos = gl.uarm.get_position()
                if pos:
                    if pos[2] <= 0:
                        break
                    z = pos[2] - 2
                    if not self.uarm_set_position(z=z, speed=self.speed_pump, timeout=10):
                        break
            gl.check_tip_sensor_state = False
            gl.tip_sensor_state = False
            self.uarm_set_pump(False)
            if gl.uarm_openmv_state != define.UARM_OPENMV_CATCH:
                continue
            time.sleep(1)
            self.uarm_set_position(z=90, speed=self.speed_move)
            self.uarm_set_position(x=180, y=0, z=150, speed=self.speed_move)

            gl.detect_position_queue.queue.clear()
            gl.first_detect = False
            gl.first_detect_position = None
            gl.uarm_openmv_state = define.UARM_OPENMV_DISABLE

    def uarm_automatic_track(self):
        start_time = time.time()
        gl.start_detect = True
        while gl.uarm_openmv_state == define.UARM_OPENMV_TRACK:
            try:
                if gl.first_detect:
                    if gl.first_detect_position is None:
                        continue
                    pos = gl.first_detect_position.get('position')
                    centroid = gl.first_detect_position.get('centroid')
                    gl.first_detect = False
                    gl.first_detect_position = None
                else:
                    detect_pos_list = []
                    size = gl.detect_position_queue.qsize()
                    for i in range(size):
                        try:
                            detect_pos_list.append(gl.detect_position_queue.get_nowait())
                        except:
                            break
                    if len(detect_pos_list) == 0:
                        continue
                    detect_position = detect_pos_list[0]
                    centroid = detect_position.get('centroid')
                    distance_x = centroid[0] - gl.openmv_fb_width / 2
                    distance_y = centroid[1] - gl.openmv_fb_height / 2
                    distance = pow(distance_x, 2) + pow(distance_y, 2)
                    for detect in detect_pos_list:
                        c = detect.get('centroid')
                        if pow(c[0] - gl.openmv_fb_width / 2, 2) + pow(c[1] - gl.openmv_fb_height / 2,
                                                                       2) < distance:
                            detect_position = detect

                    detect_position = detect_pos_list[0]
                    # detect_position = gl.detect_position_queue.get_nowait()
                    pos = detect_position.get('position')
                    centroid = detect_position.get('centroid')

                start_time = time.time()
                gl.detect_position_queue.queue.clear()
                distance_x = centroid[0] - gl.openmv_fb_width / 2
                distance_y = centroid[1] - gl.openmv_fb_height / 2

                # if gl.first_detect:
                #     if not self.uarm_set_position(x=pos[0], y=pos[1], speed=self.speed_move):
                #         continue

                x = pos[0] + distance_y / gl.openmv_fb_height * 145
                y = pos[1] + distance_x / gl.openmv_fb_width * 190
                print(x, y)
                if not self.uarm_set_position(x=x, y=y, z=150, speed=self.speed_move, reset=False):
                    continue
                time.sleep(0.5)
                gl.detect_position_queue.queue.clear()

                # if abs(distance_x) < 5 and abs(distance_y) < 5:
                #     gl.trackState = 3
                #     print("track")
                #     self.trackCode = centroid[2]
                #     gl.detect_position_queue.queue.clear()
                #     break
                #
                # if gl.first_detect:
                #     # pos = gl.uarm.get_report_position()
                #     # if not pos:
                #     #     continue
                #     # x = pos[0] + distance_y * 0.68
                #     # y = pos[1] + distance_x * 0.6
                #     # print(x, y)
                #     x = pos[0] + distance_y / gl.openmv_fb_height * 145
                #     y = pos[1] + distance_x / gl.openmv_fb_width * 190
                #     # print(x, y)
                #     if not self.uarm_set_position(x=x, y=y, z=150, speed=self.speed_move):
                #         continue
                #     gl.detect_position_queue.queue.clear()
                #     gl.first_detect = False
                #     continue
                #
                # # pos = gl.uarm.get_report_position()
                # # if not pos:
                # #     continue
                # # print(pos)
                # if distance_x <= 0:
                #     if abs(distance_x) > 60:
                #         pos[1] -= 10
                #     elif abs(distance_x) > 30:
                #         pos[1] -= 5
                #     else:
                #         pos[1] -= 2
                # else:
                #     if abs(distance_x) > 60:
                #         pos[1] += 10
                #     elif abs(distance_x) > 30:
                #         pos[1] += 5
                #     else:
                #         pos[1] += 2
                # if distance_y <= 0:
                #     if abs(distance_y) > 60:
                #         pos[0] -= 10
                #     elif abs(distance_y) > 30:
                #         pos[0] -= 5
                #     else:
                #         pos[0] -= 2
                # else:
                #     if abs(distance_y) > 60:
                #         pos[0] += 10
                #     elif abs(distance_y) > 30:
                #         pos[0] += 5
                #     else:
                #         pos[0] += 2
                # if not self.uarm_set_position(x=pos[0], y=pos[1], speed=self.speed_detect):
                #     continue
                # gl.detect_position_queue.queue.clear()

            except Exception as e:
                print(e)
                pass

        gl.start_detect = False

    def openmv_automatic_learn_color(self):
        self.uarm_set_position(x=180, y=0, z=150, speed=self.speed_move, wait=False)
        while gl.uarm_openmv_state == define.UARM_OPENMV_LEARN_COLOR:
            time.sleep(0.5)

    def openmv_automatic_learn_keypoints(self):
        self.uarm_set_position(x=180, y=0, z=150, speed=self.speed_move)
        time.sleep(5)
        gl.uarm_openmv_state = define.UARM_OPENMV_PATROL

    def uarm_automatic_track_line(self):
        gl.start_detect = True
        self.uarm_set_position(x=180, y=0, z=150, speed=self.speed_move, reset=False)
        while gl.uarm_openmv_state == define.UARM_OPENMV_TRACK_LINE:
            try:
                pos_line_list = []
                size = gl.detect_line_queue.qsize()
                for i in range(size):
                    try:
                        pos_line_list.append(gl.detect_line_queue.get_nowait())
                    except:
                        break
                if len(pos_line_list) == 0:
                    continue
                pos_line = pos_line_list[0]
                line = pos_line.get('line')
                x2 = line[1][0]

                distance_x = x2 - gl.openmv_fb_width / 2
                for detect in pos_line_list:
                    l = detect.get('line')
                    if l[1][0] < distance_x:
                        pos_line = detect

                line = pos_line.get('line')
                x1, y1 = line[0]
                x2, y2 = line[1]
                pos = pos_line.get('position')
                gl.detect_line_queue.queue.clear()
                distance_x = x2 - gl.openmv_fb_width / 2

                y = pos[1] + distance_x / gl.openmv_fb_width * 190
                if not self.uarm_set_position(x=180, y=y, z=150, speed=self.speed_move, reset=False):
                    continue
                time.sleep(0.5)
                gl.detect_line_queue.queue.clear()
            except:
                pass

        gl.start_detect = False

    def uarm_reset_position(self):
        tmp = gl.uarm_openmv_state
        self.uarm_set_position(x=180, y=0, z=150)
        while gl.uarm_openmv_state == tmp:
            time.sleep(0.5)

    def test(self):
        pass

    # def uarm_automatic_patrol(self):
    #     while gl.trackState != 0:
    #         try:
    #             if gl.trackState == 1:
    #                 if gl.trackState == 1:
    #                     self.uarm_set_position(x=150, y=-100, z=150, speed=self.speed_patrol)
    #                 if gl.trackState == 1:
    #                     self.uarm_set_position(x=150, y=100, z=150, speed=self.speed_patrol)
    #                 if gl.trackState == 1:
    #                     self.uarm_set_position(x=200, y=100, z=150, speed=self.speed_patrol)
    #                 if gl.trackState == 1:
    #                     self.uarm_set_position(x=200, y=-100, z=150, speed=self.speed_patrol)
    #                 if gl.trackState == 1:
    #                     self.uarm_set_position(x=250, y=-100, z=150, speed=self.speed_patrol)
    #                 if gl.trackState == 1:
    #                     self.uarm_set_position(x=250, y=100, z=150, speed=self.speed_patrol)
    #                 if gl.trackState == 1:
    #                     self.uarm_set_position(x=150, y=-100, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=180, y=0, z=150, speed=self.speed_patrol)
    # 
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=150, y=-100, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=175, y=-75, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=150, y=-50, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=175, y=-25, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=150, y=-0, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=175, y=25, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=150, y=50, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=175, y=75, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=150, y=100, z=150, speed=self.speed_patrol)
    #                 #
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=175, y=100, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=200, y=100, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=225, y=100, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=250, y=100, z=150, speed=self.speed_patrol)
    #                 #
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=250, y=75, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=225, y=50, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=250, y=25, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=225, y=0, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=250, y=-25, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=225, y=-50, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=250, y=-75, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=225, y=-100, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=250, y=-100, z=150, speed=self.speed_patrol)
    #                 #
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=225, y=-100, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=200, y=-100, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=175, y=-100, z=150, speed=self.speed_patrol)
    #                 # if gl.trackState == 1:
    #                 #     self.uarm_set_position(x=150, y=-100, z=150, speed=self.speed_patrol)
    # 
    #             elif gl.trackState == 2:
    #                 start_time = time.time()
    #                 while gl.trackState == 2:
    #                     try:
    #                         # if gl.detect_position_queue.qsize() == 0 and not gl.first_detect:
    #                         #     yield gen.sleep(0.2)
    #                         #     if gl.detect_position_queue.qsize() != 0:
    #                         #         continue
    #                         #     pos = gl.current_position
    #                         #     if not pos:
    #                         #         continue
    #                         #     self.uarm_set_position(x=pos[0]+15, y=pos[1]+15, speed=self.speed_detect // 2)
    #                         #     if gl.detect_position_queue.qsize() != 0:
    #                         #         continue
    #                         #     self.uarm_set_position(x=pos[0]+15, y=pos[1]-15, speed=self.speed_detect // 2)
    #                         #     if gl.detect_position_queue.qsize() != 0:
    #                         #         continue
    #                         #     self.uarm_set_position(x=pos[0]-15, y=pos[1]+15, speed=self.speed_detect // 2)
    #                         #     if gl.detect_position_queue.qsize() != 0:
    #                         #         continue
    #                         #     self.uarm_set_position(x=pos[0]-15, y=pos[1]-15, speed=self.speed_detect // 2)
    #                         #     if gl.detect_position_queue.qsize() != 0:
    #                         #         continue
    #                         #     self.uarm_set_position(x=pos[0], y=pos[1], speed=self.speed_detect // 2)
    #                         #
    #                         #     if gl.detect_position_queue.qsize() != 0:
    #                         #         continue
    #                         #     self.uarm_set_position(x=pos[0] + 15, y=pos[1] + 15, z=150, speed=self.speed_detect // 2)
    #                         #     if gl.detect_position_queue.qsize() != 0:
    #                         #         continue
    #                         #     self.uarm_set_position(x=pos[0] + 15, y=pos[1] - 15, speed=self.speed_detect // 2)
    #                         #     if gl.detect_position_queue.qsize() != 0:
    #                         #         continue
    #                         #     self.uarm_set_position(x=pos[0] - 15, y=pos[1] + 20, speed=self.speed_detect // 2)
    #                         #     if gl.detect_position_queue.qsize() != 0:
    #                         #         continue
    #                         #     self.uarm_set_position(x=pos[0] - 15, y=pos[1] - 15, speed=self.speed_detect // 2)
    #                         #     if gl.detect_position_queue.qsize() != 0:
    #                         #         continue
    #                         #     self.uarm_set_position(x=pos[0], y=pos[1], speed=self.speed_detect // 2)
    #                         #     if gl.detect_position_queue.qsize() != 0:
    #                         #         continue
    #                         #
    #                         #     # if time.time() - start_time > 10:
    #                         #     gl.first_detect = True
    #                         #     gl.first_detect_position = None
    #                         #     gl.trackState = 1
    #                         #     gl.detect_position_queue.queue.clear()
    #                         #     gl.first_detect = True
    #                         #     gl.first_detect_position = None
    #                         #     self.uarm_set_position(x=180, y=0, z=150, speed=self.speed_move * 2)
    #                         #     continue
    # 
    #                         if gl.first_detect:
    #                             pos = gl.first_detect_position.get('position')
    #                             centroid = gl.first_detect_position.get('centroid')
    #                         else:
    #                             detect_position = gl.detect_position_queue.get_nowait()
    #                             pos = detect_position.get('position')
    #                             centroid = detect_position.get('centroid')
    # 
    #                         print('position:{}'.format(pos))
    #                         print('centroid:{}'.format(centroid))
    # 
    #                         start_time = time.time()
    #                         gl.detect_position_queue.queue.clear()
    # 
    #                         distance_x = centroid[0] - gl.openmv_fb_width / 2
    #                         distance_y = centroid[1] - gl.openmv_fb_height / 2
    #                         if gl.first_detect:
    #                             if not self.uarm_set_position(x=pos[0], y=pos[1], speed=self.speed_move):
    #                                 continue
    #                         if abs(distance_x) < 3 and abs(distance_y) < 3:
    #                             gl.trackState = 3
    #                             self.trackCode = centroid[2]
    #                             continue
    #                         if gl.first_detect:
    #                             pos = gl.current_position
    #                             if not pos:
    #                                 continue
    #                             x = pos[0] + distance_y * 0.68
    #                             y = pos[1] + distance_x * 0.52
    # 
    #                             if not self.uarm_set_position(x=x, y=y, z=90, speed=self.speed_move):
    #                                 continue
    #                             gl.detect_position_queue.queue.clear()
    #                             gl.first_detect = False
    #                             continue
    #                         pos = gl.current_position
    #                         if not pos:
    #                             continue
    #                         if distance_x <= 0:
    #                             if abs(distance_x) > 60:
    #                                 pos[1] -= 10
    #                             elif abs(distance_x) > 30:
    #                                 pos[1] -= 5
    #                             else:
    #                                 pos[1] -= 2
    #                         else:
    #                             if abs(distance_x) > 60:
    #                                 pos[1] += 10
    #                             elif abs(distance_x) > 30:
    #                                 pos[1] += 5
    #                             else:
    #                                 pos[1] += 2
    #                         if distance_y <= 0:
    #                             if abs(distance_y) > 60:
    #                                 pos[0] -= 10
    #                             elif abs(distance_y) > 30:
    #                                 pos[0] -= 5
    #                             else:
    #                                 pos[0] -= 2
    #                         else:
    #                             if abs(distance_y) > 60:
    #                                 pos[0] += 10
    #                             elif abs(distance_y) > 30:
    #                                 pos[0] += 5
    #                             else:
    #                                 pos[0] += 2
    #                         if not self.uarm_set_position(x=pos[0], y=pos[1], speed=self.speed_detect):
    #                             continue
    #                         gl.detect_position_queue.queue.clear()
    #                     except:
    #                         pass
    # 
    #             elif gl.trackState == 3:
    #                 pos = gl.current_position
    #                 if not pos:
    #                     continue
    #                 x0 = 45 * pos[0] / math.sqrt(pow(pos[0], 2) + pow(pos[1], 2))
    #                 y0 = pos[1] / pos[0] * x0
    #                 tmp_pos = [pos[0] + x0, pos[1] + y0]
    #                 if not self.uarm_set_position(x=tmp_pos[0], y=tmp_pos[1], speed=self.speed_move):
    #                     continue
    # 
    #                 if not self.uarm_set_position(z=60, speed=self.speed_detect):
    #                     continue
    # 
    #                 gl.check_tip_sensor_state = True
    #                 while not gl.tip_sensor_state:
    #                     pos = gl.current_position
    #                     if pos:
    #                         if pos[2] <= 0:
    #                             break
    #                         z = pos[2] - 2
    #                         if not self.uarm_set_position(z=z, speed=self.speed_pump, timeout=10):
    #                             break
    #                 gl.check_tip_sensor_state = False
    #                 gl.tip_sensor_state = False
    #                 if gl.trackState != 3:
    #                     continue
    #                 self.uarm_set_pump(True)
    #                 yield gen.sleep(1)
    #                 self.uarm_set_position(z=90, speed=self.speed_detect, timeout=15)
    # 
    #                 x, y = [150, 130]
    #                 self.uarm_set_position(x=x, y=y, z=90, speed=self.speed_detect)
    #                 self.uarm_set_position(z=80, speed=self.speed_detect)
    # 
    #                 gl.check_tip_sensor_state = True
    #                 while not gl.tip_sensor_state:
    #                     pos = gl.current_position
    #                     if pos:
    #                         if pos[2] <= 0:
    #                             break
    #                         z = pos[2] - 2
    #                         if not self.uarm_set_position(z=z, speed=self.speed_pump, timeout=10):
    #                             break
    #                 gl.check_tip_sensor_state = False
    #                 gl.tip_sensor_state = False
    #                 self.uarm_set_pump(False)
    #                 if gl.trackState != 3:
    #                     continue
    #                 yield gen.sleep(1)
    #                 self.uarm_set_position(z=90, speed=self.speed_move)
    #                 self.uarm_set_position(x=180, y=0, z=150, speed=self.speed_move)
    # 
    #                 gl.detect_position_queue.queue.clear()
    #                 gl.first_detect = True
    #                 gl.first_detect_position = None
    #                 gl.trackState = 1
    #             else:
    #                 yield gen.sleep(0.5)
    #         except:
    #             pass
    # 
    # def get_openmv_output_data(self):
    #     threading.Thread(target=self._get_openmv_output_data_thread).start()
    # 
    # # @gen.coroutine
    # def _get_openmv_output_data_thread(self):
    #     while True:
    #         try:
    #             if gl.openmv_connected and gl.openmv_running and gl.openmv is not None and gl.openmv_output_state:
    #                 buf_len = gl.openmv.tx_buf_len()
    #                 if buf_len:
    #                     buf = gl.openmv.tx_buf(buf_len)
    #                     if buf:
    #                         print(buf)
    #                         if b'Type "help()" for more information.' in buf:
    #                             gl.openmv_running = False
    #                         # buf = buf.decode('utf-8').strip().strip('\r\n')
    #                         # for data in buf.split('\r\n'):
    #                         #     if len(data):
    #                         #         print(data)
    #         except:
    #             pass
    #         time.sleep(0.05)
    # 
    # def get_openmv_fb_data(self):
    #     threading.Thread(target=self._get_openmv_fb_data_thread).start()
    # 
    # # @gen.coroutine
    # def _get_openmv_fb_data_thread(self):
    #     while True:
    #         try:
    #             if gl.openmv_connected and gl.openmv_running and gl.openmv is not None and gl.openmv_fb_state:
    #                 fb_data = gl.openmv.get_fb_data()
    #                 if fb_data:
    #                     gl.openmv_fb_width, gl.openmv_fb_height = fb_data[:2]
    #                     frame = Image.fromarray(fb_data[2])
    #                     frame.save("tmp.jpeg")
    #                     try:
    #                         with open('tmp.jpeg', 'rb') as f:
    #                             gl.openmv_fb_data = f.read()
    #                     except:
    #                         pass
    #         except:
    #             pass
    #         time.sleep(0.05)
    # 
