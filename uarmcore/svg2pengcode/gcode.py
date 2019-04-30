#!/usr/bin/env python

import sys
import numpy as np

class GCodeBuilder:
    """
    Build a GCode instruction set.
    """
    def __init__(self, options):
        self.codes = []
        self.config = options
        self.drawing = False
        self.last = None

        self.preamble = [
            # '(preamble)'
            # '(Scribbled @ %(xy_feedrate).2f)' % self.config,
            # '( %s )' % ' '.join(sys.argv),
            # 'G21 (metric ftw)',
            # 'G90 (absolute mode)',
            'G0 Z{0:.2f} F{1:.2f}\n'.format(self.config['z_home'] + self.config['z_offset'], self.config['moving_feedrate']),
            'G0 X{0:.2f} Y{1:.2f} Z{2:.2f} F{3:.2f}\n'.format(
                self.config['x_home'], self.config['y_home'], self.config['z_home']+self.config['z_offset'], self.config['moving_feedrate']
            ),
            # 'G0 F{0:.2f}\n'.format(
            #     self.config['drawing_feedrate']
            # ),
            # 'G92 X%(x_home).2f Y%(y_home).2f Z%(z_height).2f (you are here)' % self.config,
            # '(/preamble)'
        ]

        self.postscript = [
            # '(postscript)',
            # 'M300 S%(pen_up_angle)0.2F (pen up)' % self.config,
            # 'G4 P%(stop_delay)d (wait %(stop_delay)dms)' % self.config,
            # 'M300 S255 (turn off servo)',
            # 'G1 X0 Y0 F%(xy_feedrate)0.2F' % self.config,
            # 'G1 Z%(finished_height)0.2F F%(z_feedrate)0.2F (go up to finished level)' % self.config,
            # 'G1 X%(x_home)0.2F Y%(y_home)0.2F F%(xy_feedrate)0.2F (go home)' % (self.config),
            # 'M18 (drives off)',
            # '(/postscript)'
        ]

        self.registration = [
            # '(registration)',
            # 'M300 S%(pen_down_angle)d (pen down)' % self.config,
            # 'G4 P%(start_delay)d (wait %(start_delay)dms)' % self.config,
            # 'M300 S%(pen_up_angle)d (pen up)' % self.config,
            # 'G4 P%(stop_delay)d (wait %(stop_delay)dms)' % self.config,
            # 'M18 (disengage drives)',
            # 'M01 (Was registration test successful?)',
            # 'M17 (engage drives if YES, and continue)',
            # '(/registration)'
        ]

        self.sheet_header = [
            '(sheet header)',
            # 'G92 X%(x_home).2f Y%(y_home).2f Z%(z_height).2f (you are here)' % self.config,
        ]

        self.sheet_header.append('(/sheet header)')

        self.sheet_footer = [
            'G0 Z{0:.2f} F{1:.2f}'.format(self.config['z_home']+self.config['z_offset'], self.config['moving_feedrate']),
            'G0 X{0:.2f} Y{1:.2f} Z{2:.2f} F{3:.2f}\n'.format(
                self.config['x_home'], self.config['y_home'], self.config['z_home']+self.config['z_offset'], self.config['moving_feedrate']
            )
            # '(sheet footer)',
            # 'M300 S%(pen_up_angle)d (pen up)' % self.config,
            # 'G4 P%(stop_delay)d (wait %(stop_delay)dms)' % self.config,
            # 'G91 (relative mode)',
            # 'G0 Z15 F%(z_feedrate)0.2f' % self.config,
            # 'G90 (absolute mode)',
            # 'G0 X%(x_home)0.2f Y%(y_home)0.2f Z%(z_home)0.2f F%(xy_feedrate)0.2f' % self.config,
            # 'M01 (Have you retrieved the print?)',
            # '(machine halts until "okay")',
            # 'G4 P%(start_delay)d (wait %(start_delay)dms)' % self.config,
            # 'G91 (relative mode)',
            # 'G0 Z-15 F%(z_feedrate)0.2f (return to start position of current sheet)' % self.config,
            # 'G0 Z-0.01 F%(z_feedrate)0.2f (move down one sheet)' % self.config,
            # 'G90 (absolute mode)',
            # 'M18 (disengage drives)',
            # '(/sheet footer)',
        ]

        self.loop_forever = [
            # 'M30 (Plot again?)'
        ]

    def start(self):
        """
        Start drawing.
        """
        # self.codes.append('G0 Z{0:.2f} '.format(80))
        # self.codes.append('M300 S%(pen_down_angle)0.2F (pen down)' % self.config)
        # self.codes.append('G4 P%(start_delay)d (wait %(start_delay)dms)' % self.config)
        self.drawing = True

    def stop(self):
        """
        Stop drawing.
        """
        # self.codes.append('G0 Z{0:.2f} '.format(85))
        # self.codes.append('M300 S%(pen_up_angle)0.2F (pen up)' % self.config)
        # self.codes.append('G4 P%(stop_delay)d (wait %(stop_delay)dms)' % self.config)
        self.drawing = False

    def go_to_point(self, x, y, stop=False):
        """
        Move the print head to a certain point.
        """
        if self.last == (x,y):
            return

        if stop:
            return
        else:
            if self.drawing: 
                self.stop()
            # self.codes.append('G0 X%.2f Y%.2f F%.2f' % (x, y+self.config['y_offset'], self.config['xy_feedrate']))
            # self.codes.append('G0 X%.2f Y%.2f' % (x, y + self.config['y_offset']))

            # self.codes.append('G0 X{0:.2f} Y{1:.2f} F{2:.2f}'
            #                   .format(x, y + self.config['y_offset'], self.config['moving_feedrate']))
            self.codes.append('G0 Z{0:.2f} F{1:.2f}'.format(self.config['z_home'] + self.config['z_offset'], self.config['moving_feedrate']))
            self.codes.append('G0 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(y, -x, self.config['moving_feedrate']))

        self.last = (x, y)

    def draw_to_point(self, x, y):
        """
        Draw to a certain point.
        """
        if self.last == (x, y):
            return

        if self.drawing == False:
            self.start()

        # self.codes.append('G1 X%0.2f Y%0.2f F%0.2f' % (x, y+self.config['y_offset'], self.config['xy_feedrate']))

        # self.codes.append('G1 X{0:.2f} Y{1:.2f} F{2:.2f}'
        #                   .format(x, y + self.config['y_offset'], self.config['drawing_feedrate']))
        self.codes.append('G0 Z{0:.2f}'.format(self.config['z_offset']))
        self.codes.append('G1 X{0:.2f} Y{1:.2f} F{2:.2f}'
                          .format(y, -x, self.config['drawing_feedrate']))

        self.last = (x, y)

    def label(self, text):
        """
        Write a text label/comment into the output.
        """
        self.codes.append('(' + text + ')')

    def draw_polyline(self, points):
        """
        Draw a polyline (series of points).
        """
        start = points[0]

        self.go_to_point(start[0],start[1])
        self.start()

        for point in points[1:]:
            self.draw_to_point(point[0],point[1])
            self.last = point

        self.draw_to_point(start[0], start[1])
        self.stop()

    def change_layer(self, name):
        """
        Change layer being drawn.
        """
        if self.config['pause_on_layer_change']:
            pass
            # self.codes.append('M01 (Plotting layer "%s")' % name)

    def add_offset_to_gcode(self):
        lines = self.codes
        x_list = []
        y_list = []
        for i, line in enumerate(lines):
            if line.startswith(tuple(['G0', 'G1'])):
                List = line.strip().split(' ')
                for l in List:
                    if l.startswith('X'):
                        x = float(l[1:])
                        x_list.append(x)
                    elif l.startswith('Y'):
                        y = float(l[1:])
                        y_list.append(y)
        x_average = np.average(x_list)
        y_average = np.average(y_list)

        for i, line in enumerate(lines):
            if line.startswith(tuple(['G0', 'G1'])):
                List = line.strip().split(' ')
                line = ""
                for l in List:
                    if l.startswith('X'):
                        x = float(l[1:])
                        x -= x_average
                        x += self.config['x_offset']
                        l = 'X{0:.3f}'.format(x)
                    elif l.startswith('Y'):
                        y = float(l[1:])
                        y -= y_average
                        y += self.config['y_offset']
                        l = 'Y{0:.3f}'.format(y)
                    line += l + ' '
                line = line.strip()
                lines[i] = line

    def add_offset_to_gcode_new(self):
        lines = self.codes
        for i, line in enumerate(lines):
            if line.startswith(tuple(['G0', 'G1'])):
                List = line.strip().split(' ')
                line = ""
                for l in List:
                    if l.startswith('X'):
                        x = float(l[1:])
                        x += self.config['x_offset']
                        l = 'X{0:.3f}'.format(x)
                    elif l.startswith('Y'):
                        y = float(l[1:])
                        y += self.config['y_offset']
                        l = 'Y{0:.3f}'.format(y)
                    line += l + ' '
                line = line.strip()
                lines[i] = line
        x_list = []
        y_list = []
        for i, line in enumerate(lines):
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


    def build(self):
        """
        Build complete GCode and return as string. 
        """
        commands = []

        # commands.extend(['M2400 S01; set laser mode\n\n'])

        commands.extend(self.preamble)

        # if (self.config['num_copies'] > 1):
        #     commands.extend(self.sheet_header)
        #
        # if self.config['register_pen'] == 'true':
        #     commands.extend(self.registration)

        self.add_offset_to_gcode_new()
        commands.extend(self.codes)

        commands.extend(self.sheet_footer)
        
        # if (self.config['num_copies'] > 1):
        #     commands.extend(self.sheet_footer)
        #     commands.extend(self.postscript)
        #     commands = commands * self.config['num_copies']
        # else:
        #     commands.extend(self.postscript)

        return '\n'.join(commands)
