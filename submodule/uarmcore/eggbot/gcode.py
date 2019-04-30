#!/usr/bin/env python

import sys
import six
import xml.etree.ElementTree as ET
from . import shapes as shapes_pkg
from .shapes import point_generator
from . import config
import numpy as np
if six.PY3:
    from io import StringIO
else:
    from StringIO import StringIO
import sys
sys.path.append('..')
from log import logger

class GcodeExport(object):
    def __init__(self, *args, **kwargs):
        self.config = kwargs
        self.codes = []

        if 'moving_feedrate' not in self.config:
            self.config.update({'moving_feedrate': config.moving_feedrate})
        if 'drawing_feedrate' not in self.config:
            self.config.update({'drawing_feedrate': config.drawing_feedrate})
        if 'x_home' not in self.config:
            self.config.update({'x_home': config.x_home})
        if 'y_home' not in self.config:
            self.config.update({'y_home': config.y_home})
        if 'z_home' not in self.config:
            self.config.update({'z_home': config.z_home})
        if 'x_offset' not in self.config:
            self.config.update({'x_offset': config.x_offset})
        if 'y_offset' not in self.config:
            self.config.update({'y_offset': config.y_offset})
        if 'z_offset' not in self.config:
            self.config.update({'z_offset': config.z_offset})

        if 'preamble' not in self.config:
            self.config.update({'preamble': config.preamble.format(self.config['x_home'],
                                                                   self.config['y_home'],
                                                                   self.config['z_home']+self.config['z_offset'],
                                                                   self.config['moving_feedrate'])})
        if 'postamble' not in self.config:
            self.config.update({'postamble': config.postamble.format(self.config['x_home'],
                                                                   self.config['y_home'],
                                                                   self.config['z_home']+self.config['z_offset'],
                                                                   self.config['moving_feedrate'])})
        if 'shape_preamble' not in self.config:
            self.config.update({'shape_preamble': config.shape_preamble})
        if 'shape_postamble' not in self.config:
            self.config.update({'shape_postamble': config.shape_postamble})
        if 'smoothness' not in self.config:
            self.config.update({'smoothness': config.smoothness})


    def add_offset_to_gcode(self):
        x_list = []
        y_list = []
        for i, line in enumerate(self.codes):
            if line.startswith(tuple(['G0', 'G1'])):
                List = line.strip().split(' ')
                for l in List:
                    if l.startswith('X'):
                        x = float(l[1:])
                        x_list.append(x)
                    elif l.startswith('Y'):
                        y = float(l[1:])
                        y_list.append(y)
        x_min, x_max = np.min(x_list), np.max(x_list)
        y_min, y_max = np.min(y_list), np.max(y_list)
        print(x_min, x_max, x_max - x_min)
        print(y_min, y_max, y_max - y_min)

        offset = (y_max - y_min) / 2 + min(abs(y_min), abs(y_max))

        for i, line in enumerate(self.codes):
            if line.startswith(tuple(['G0', 'G1'])):
                List = line.strip().split(' ')
                line = ""
                for l in List:
                    if l.startswith('X'):
                        x = float(l[1:])
                        # x -= vertical_offset / 2
                        x += self.config['x_offset']
                        x -= x_min
                        l = 'X{0:.2f}'.format(x)
                    elif l.startswith('Y'):
                        y = float(l[1:])
                        # y -= spacing_offset
                        y = y + offset
                        y += self.config['y_offset']
                        l = 'Y{0:.2f}'.format(y)
                    line += l + ' '
                line = line.strip()
                self.codes[i] = line

        x_list = []
        y_list = []
        for i, line in enumerate(self.codes):
            if line.startswith(tuple(['G0', 'G1'])):
                List = line.strip().split(' ')
                for l in List:
                    if l.startswith('X'):
                        x = float(l[1:])
                        x_list.append(x)
                    elif l.startswith('Y'):
                        y = float(l[1:])
                        y_list.append(y)

        if len(x_list) > 0:
            print('x_min: {}, x_max: {}, x_distance: {}'.format(np.min(x_list), np.max(x_list), np.max(x_list) - np.min(x_list)))
        if len(y_list) > 0:
            print('y_min: {}, y_max: {}, y_distance: {}'.format(np.min(y_list), np.max(y_list), np.max(y_list) - np.min(y_list)))


    def generate_gcode(self, svg_data):
        svg_shapes = set(['rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path'])
        utf8_parser = ET.XMLParser(encoding='utf-8')
        if six.PY3:
            if isinstance(svg_data, bytes):
                svg_data = str(svg_data, encoding='utf-8')
            tree = ET.parse(StringIO(svg_data), parser=utf8_parser)
        else:
            tree = ET.parse(StringIO(svg_data.encode('utf-8')), parser=utf8_parser)
        # tree = ET.parse(svg_data)
        root = tree.getroot()

        # width = root.get('width')
        # height = root.get('height')
        # if width == None or height == None:
        #     viewbox = root.get('viewBox')
        #     if viewbox:
        #         _, _, width, height = viewbox.split()
        #
        # if width == None or height == None:
        #     print("Unable to get width and height for the svg")
        #     sys.exit(1)
        #
        # width = float(width)
        # height = float(height)
        #
        # print(width, height)
        #
        # scale_x = config.bed_max_x / max(width, height)
        # scale_y = config.bed_max_y / max(width, height)

        scale_x = config.scale_x
        scale_y = config.scale_y

        for elem in root.iter():
            try:
                _, tag_suffix = elem.tag.split('}')
            except ValueError:
                continue
            if tag_suffix in svg_shapes:
                shape_class = getattr(shapes_pkg, tag_suffix)
                shape_obj = shape_class(elem)
                d = shape_obj.d_path()
                m = shape_obj.transformation_matrix()
                if d:
                    self.codes.append(self.config['shape_preamble'])
                    p = point_generator(d, m, self.config['smoothness'])
                    for flag, point in p:
                        if flag == 'G0':
                            pass
                            # print(point)
                            # f.write("%s X%0.1f Y%0.1f" % (flag, scale_x*point[1], scale_y*point[0])+'\n')
                        else:
                            start = point[0]
                            self.codes.append(
                                'G0 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(-scale_x * start[1], -scale_y * start[0],
                                                                       self.config['moving_feedrate']))
                            self.codes.append('G0 Z{}'.format(self.config['z_home']))
                            # f.write("G0 X%0.1f Y%0.1f" % (scale_x*start[1], scale_y*start[0])+'\n')
                            for p in point[1:]:
                                self.codes.append('G1 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(-scale_x * p[1], -scale_y * p[0],
                                                                                    self.config['drawing_feedrate']))
                                # f.write("G1 X%0.1f Y%0.1f" % (scale_x*p[1], scale_y*p[0])+'\n')
                            self.codes.append('G0 Z{}'.format(self.config['z_home'] + self.config['z_offset']))

                    self.codes.append(self.config['shape_postamble'])

        self.add_offset_to_gcode()

        gcode_data = self.config['preamble'] + '\n' + '\n'.join(self.codes) + self.config['postamble']

        return gcode_data


if __name__ == "__main__":
    g = GcodeExport()
    g.generate_gcode()



