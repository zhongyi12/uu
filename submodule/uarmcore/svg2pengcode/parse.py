#!/usr/bin/env python

import sys
import six
if six.PY2:
    import lxml.etree as ET
else:
    import xml.etree.ElementTree as ET
if six.PY3:
    from io import StringIO
else:
    from StringIO import StringIO

from .gcode import GCodeBuilder
from .svg import SvgLayerChange, SvgParser, SvgPath

sys.path.append('..')
from log import logger

import datetime
import os
from os.path import expanduser

home_dir = os.path.join(expanduser("~"), "uarm", "")
if not os.path.exists(home_dir):
    os.mkdir(home_dir)
temp_dir = os.path.join(home_dir, "Temp")
if not os.path.exists(temp_dir):
    os.mkdir(temp_dir)

FILES_PATH = os.path.join(temp_dir, "files")
if not os.path.exists(FILES_PATH):
    os.mkdir(FILES_PATH)

SVG_PATH = os.path.join(FILES_PATH, "svg")
if not os.path.exists(SVG_PATH):
    os.mkdir(SVG_PATH)
GCODE_PATH = os.path.join(FILES_PATH, "gcode")
if not os.path.exists(GCODE_PATH):
    os.mkdir(GCODE_PATH)

class SVGParser:

    def __init__(self, *args, **kwargs):
        self.debug = kwargs.get('debug', False)
        self.__gcode = GCodeBuilder(kwargs)

    def convert(self, svg_content):
        """
        Setup GCode writer and SVG parser.
        """
        # self.__gcode.codes = []
        self.write_svg_to_file(svg_content)
        document = self.parse_xml(svg_content)
        parser = SvgParser(document)
        parser.parse()
        # map(self.process_svg_entity, parser.entities)
        for entity in parser.entities:
            self.process_svg_entity(entity)

        output = self.__gcode.build()
        self.write_gcode_to_file(output)
        return output
        # sys.stdout.write(output)

    def write_svg_to_file(self, data):
        if self.debug:
            filename = str(datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")) + '_pen.svg'
        else:
            filename = 'tmp_pen.svg'
        path = os.path.join(SVG_PATH, filename)
        if six.PY3:
            if not isinstance(data, bytes):
                data = bytes(data, encoding='utf-8')
        try:
            with open(path, 'wb') as f:
                f.write(data)
                return True
        except Exception as e:
            logger.error(e)
            return False

    def write_gcode_to_file(self, data):
        if self.debug:
            filename = str(datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")) + '_pen.gcode'
        else:
            filename = 'tmp_pen.gcode'
        path = os.path.join(GCODE_PATH, filename)
        if six.PY3:
            if not isinstance(data, bytes):
                data = bytes(data, encoding='utf-8')
        try:
            with open(path, 'wb') as f:
                f.write(data)
                return True
        except Exception as e:
            logger.error(e)
            return False

    def parse_xml(self, xml_content):
        """
        Parse the XML input.
        """
        # try:
        #     stream = open(path, 'r')
        # except:
        #     stream = sys.stdin
        utf8_parser = ET.XMLParser(encoding='utf-8')
        if six.PY3:
            if isinstance(xml_content, bytes):
                xml_content = str(xml_content, encoding='utf-8')
            tree = ET.parse(StringIO(xml_content), parser=utf8_parser)
        else:
            tree = ET.parse(StringIO(xml_content.encode('utf-8')), parser=utf8_parser)
        document = tree.getroot()

        # document = ET.parse(stream)

        # document.close()

        return document

    def process_svg_entity(self, svg_entity):
        """
        Generate GCode for a given SVG entity.
        """
        if isinstance(svg_entity, SvgPath):
            # len_segments = len(svg_entity.segments)

            for i, points in enumerate(svg_entity.segments):
                # self.gcode.label('Polyline segment %i/%i' % (i + 1, len_segments))
                self.__gcode.draw_polyline(points)
        elif isinstance(svg_entity, SvgLayerChange):
            pass
        # self.gcode.change_layer(svg_entity.layer_name)


    # class Svg2G(object):
#     def __init__(self, *args, **kwargs):
        # self.get_options()



    # def get_options(self):
    #     """
    #     Get options from the command line.
    #     """
    #     self.OptionParser = optparse.OptionParser(usage='usage: %prog [options] input.svg')
    #
    #     # self.OptionParser.add_option('--pen-up-angle',
    #     #     action='store',
    #     #     type='float',
    #     #     dest='pen_up_angle',
    #     #     default='50.0',
    #     #     help='Pen up angle')
    #     #
    #     # self.OptionParser.add_option('--pen-down-angle',
    #     #     action='store',
    #     #     type='float',
    #     #     dest='pen_down_angle',
    #     #     default='30.0',
    #     #     help='Pen down angle')
    #     #
    #     # self.OptionParser.add_option('--start-delay',
    #     #     action='store',
    #     #     type='float',
    #     #     dest='start_delay',
    #     #     default='150.0',
    #     #     help='Delay after pen down command before movement in milliseconds')
    #     #
    #     # self.OptionParser.add_option('--stop-delay',
    #     #     action='store',
    #     #     type='float',
    #     #     dest='stop_delay',
    #     #     default='150.0',
    #     #     help='Delay after pen up command before movement in milliseconds')
    #
    #     self.OptionParser.add_option('--xy-feedrate',
    #         action='store',
    #         type='float',
    #         dest='xy_feedrate',
    #         default='3500.0',
    #         help='XY axes feedrate in millimeters per minute')
    #
    #     self.OptionParser.add_option('--z-feedrate',
    #         action='store',
    #         type='float',
    #         dest='z_feedrate',
    #         default='150.0',
    #         help='Z axis feedrate in millimeters per minute')
    #
    #     self.OptionParser.add_option('--z-height',
    #         action='store',
    #         type='float',
    #         dest='z_height',
    #         default='0.0',
    #         help='Z axis print height in millimeters')
    #
    #     self.OptionParser.add_option('--finished-height',
    #         action='store',
    #         type='float',
    #         dest='finished_height',
    #         default='0.0',
    #         help='Z axis height after printing in millimeters')
    #
    #     # self.OptionParser.add_option('--register-pen',
    #     #     action='store',
    #     #     type='string',
    #     #     dest='register_pen',
    #     #     default='true',
    #     #     help='Add pen registration check(s)')
    #
    #     self.OptionParser.add_option('--x-home',
    #         action='store',
    #         type='float',
    #         dest='x_home',
    #         default='0.0',
    #         help='Starting X position')
    #
    #     self.OptionParser.add_option('--y-home',
    #         action='store',
    #         type='float',
    #         dest='y_home',
    #         default='0.0',
    #         help='Starting Y position')
    #
    #     self.OptionParser.add_option('--z-home',
    #         action='store',
    #         type='float',
    #         dest='z_home',
    #         default='0.0',
    #         help='Starting Z position')
    #
    #     # self.OptionParser.add_option('--num-copies',
    #     #     action='store',
    #     #     type='int',
    #     #     dest='num_copies',
    #     #     default='1',
    #     #     help='Number of times to repeat the GCode in the output.')
    #
    #     # self.OptionParser.add_option('--pause-on-layer-change',
    #     #     action='store',
    #     #     type='string',
    #     #     dest='pause_on_layer_change',
    #     #     default='false',
    #     #     help='Pause on layer changes')
    #
    #     # Option required for inkscape support
    #     # self.OptionParser.add_option('--tab',
    #     #     action='store',
    #     #     type='string',
    #     #     dest='tag',
    #     #     help='Ignored (required for Inkscape support)')
    #
    #     self.OptionParser.add_option('--x-offset',
    #         action='store',
    #         type='int',
    #         dest='x_offset',
    #         default='0',
    #         help='X offset')
    #
    #     self.OptionParser.add_option('--y-offset',
    #         action='store',
    #         type='int',
    #         dest='y_offset',
    #         default='0',
    #         help='Y offset')
    #
    #     self.options, self.args = self.OptionParser.parse_args(sys.argv[1:])
