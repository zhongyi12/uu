#!/usr/bin/env python
# -*- coding: utf-8 -*-
# __author__ = 'vinman'

from __future__ import division
import re
from PIL import Image
import six
import numpy as np
import os

import sys
sys.path.append('..')
from log import logger

from . import inkex
from . import png

class GcodeExport(inkex.Effect):
    def __init__(self, *args, **kwargs):
        """init the effetc library and get options from gui"""
        inkex.Effect.__init__(self)

        self.directory = kwargs.get('directory', inkex.PNG_PATH)
        self.filename = kwargs.get('filename', '1.0')
        self.add_numeric_suffix_to_filename = kwargs.get('add_numeric_suffix_to_filename', True)
        self.bg_color = kwargs.get('bg_color', 'white')
        self.resolution = kwargs.get('resolution', 5)
        self.scale = kwargs.get('scale', 0.43)
        self.startpower = kwargs.get('startpower', 75)

        # grayscale_type=1: 0.21R + 0.71G + 0.07B
        # grayscale_type=2: (R+G+B)/3
        # grayscale_type=3: R
        # grayscale_type=4: G
        # grayscale_type=5: B
        # grayscale_type=6: max(R, G, B)
        # else: min(R, G, B)
        self.grayscale_type = kwargs.get('grayscale_type', 1)
        self.conversion_type = kwargs.get('conversion_type', 1)
        self.BW_threshold = kwargs.get('BW_threshold', 128)
        self.grayscale_resolution = kwargs.get('grayscale_resolution', 1)
        self.moving_feedrate = kwargs.get('moving_feedrate', 600)
        self.drawing_feedrate = kwargs.get('drawing_feedrate', 200)

        self.flip_y = kwargs.get('flip_y', False)
        self.homing = kwargs.get('homing', 1)
        self.laseron = kwargs.get('laseron', 'M03')
        self.laseroff = kwargs.get('laseroff', 'M05')
        self.preview_only = kwargs.get('preview_only', False)

        self.x_home = kwargs.get('x_home', 180)
        self.x_offset = kwargs.get('x_offset', 55)
        self.y_home = kwargs.get('y_home', 0)
        self.y_offset = kwargs.get('y_offset', 206.185)
        self.z_home = kwargs.get('z_home', 20)
        self.z_offset = kwargs.get('z_offset', 0)

        self.debug = kwargs.get('debug', False)
        self.pos_file_png_BW = None

    def effect(self, svg_data=None, png_data=None):
        if os.path.isdir(self.directory):
            if self.add_numeric_suffix_to_filename:
                if self.debug:
                    dir_list = os.listdir(self.directory)
                    temp_name = self.filename
                    max_n = 0
                    for s in dir_list:
                        r = re.match(r"^%s_0*(\d+)%s$" %
                                     (re.escape(temp_name), '.png'), s)
                        if r:
                            max_n = max(max_n, int(r.group(1)))
                    self.filename = temp_name + "_" + \
                        ("0" * (4 - len(str(max_n + 1))) + str(max_n + 1))

            if self.conversion_type == 1:
                suffix = "_BWfix_" + str(self.BW_threshold) + "_"
            elif self.conversion_type == 2:
                suffix = "_BWrnd_"
            elif self.conversion_type == 3:
                suffix = "_H_"
            elif self.conversion_type == 4:
                suffix = "_Hrow_"
            elif self.conversion_type == 5:
                suffix = "_Hcol_"
            else:
                if self.grayscale_resolution == 1:
                    suffix = "_Gray_256_"
                elif self.grayscale_resolution == 2:
                    suffix = "_Gray_128_"
                elif self.grayscale_resolution == 4:
                    suffix = "_Gray_64_"
                elif self.grayscale_resolution == 8:
                    suffix = "_Gray_32_"
                elif self.grayscale_resolution == 16:
                    suffix = "_Gray_16_"
                elif self.grayscale_resolution == 32:
                    suffix = "_Gray_8_"
                else:
                    suffix = "_Gray_"

            pos_file_png_exported = os.path.join(inkex.PNG_PATH, self.filename + "_pen.png")
            pos_file_png_BW = os.path.join(inkex.PNG_PATH, self.filename + suffix + "pen_preview.png")
            pos_file_gcode = os.path.join(inkex.LASERGCODE_PATH, self.filename + suffix + "pen_gcode.gcode")

            if svg_data is not None:
                pos_file_svg = os.path.join(inkex.SVG_PATH, self.filename + "_pen.svg")
                self.write_svg_to_file(svg_data, path=pos_file_svg)
                if not self.svg2png_with_cairosvg(pos_file_png_exported, svg_data):
                    return None
                # if not self.svg2png_pythonmagick(pos_file_png_exported, pos_file_svg):
                #     return None
            elif png_data is not None:
                self.write_png_to_file(png_data, path=pos_file_png_exported)
                if not self.resize_png(pos_file_png_exported):
                    return None

            gcode_data = self.png2gcode(pos_file_png_exported=pos_file_png_exported, pos_file_png_BW=pos_file_png_BW)
            with open(pos_file_gcode, 'wb') as f:
                if six.PY3:
                    if not isinstance(gcode_data, bytes):
                        f.write(bytes(gcode_data, encoding='utf-8'))
                    else:
                        f.write(gcode_data)
                else:
                    f.write(gcode_data)
            return gcode_data

        else:
            logger.error('Directory does not exist! Please specify existing directory!')
            return None

    def resize_png(self, pos_file_png_exported):
        """
        resize image and fill background color
        :param pos_file_png_exported: 
        :param bg_color: 
        :return: 
        """
        if self.resolution in range(1, 31):
            DPI = 25.4 * self.resolution
        else:
            self.resolution = 10
            DPI = 254

        if self.bg_color == 'white':
            bg_color = (255, 255, 255)
        elif self.bg_color == 'black':
            bg_color = (0, 0, 0)
        else:
            bg_color = (255, 255, 255)

        img = Image.open(pos_file_png_exported).convert("RGBA")
        x, y = int(img.size[0] * DPI / 96), int(img.size[1] * DPI / 96)
        img = img.resize((x, y), Image.ANTIALIAS)
        try:
            p = Image.new('RGBA', (x, y), bg_color)
            p.paste(img, (0, 0, x, y), img)
            p.save(pos_file_png_exported, format='png', dpi=(DPI, DPI))
            return True
        except Exception as e:
            logger.error(e)
            return False

    def svg2png_pythonmagick(self, pos_file_png_exported, pos_file_svg):
        """
        svg to png with PythonMagick
        :param pos_file_png_exported: export png file
        :param pos_file_svg: svg data
        :param bg_color: background color
        :return: True if succeed else False
        """
        import PythonMagick

        pos_file_png32_exported = os.path.join(inkex.PNG_PATH, self.filename + ".png64")
        if os.path.exists(pos_file_png32_exported):
            os.remove(pos_file_png32_exported)
        img = PythonMagick.Image(pos_file_svg)
        img.write(pos_file_png32_exported)
        if os.path.exists(pos_file_png_exported):
            os.remove(pos_file_png_exported)
        os.rename(pos_file_png32_exported, pos_file_png_exported)

        return self.resize_png(pos_file_png_exported)

    def svg2png_with_cairosvg(self, pos_file_png_exported, svg_data):
        """
        svg to gcode with cairosvg
        :param pos_file_png_exported: exported png file name
        :param svg_data: svg data
        :param bg_color: backgroud color
        :return: succeed return True, else return False
        """
        import cairosvg

        if self.resolution in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]:
            DPI = self.resolution * 25.4
        else:
            DPI = 254

        cairosvg.svg2png(bytestring=svg_data, write_to=pos_file_png_exported, dpi=DPI, scale=DPI/96)

        if self.bg_color == 'white':
            bg_color = (255, 255, 255)
        elif self.bg_color == 'black':
            bg_color = (0, 0, 0)
        else:
            bg_color = (255, 255, 255)

        img = Image.open(pos_file_png_exported).convert("RGBA")
        print(img.size)
        if six.PY2:
            x, y = int(img.size[0] * DPI / 96), int(img.size[1] * DPI / 96)
        else:
            x, y = img.size
        img = img.resize((x, y))
        print(img.size)
        try:
            p = Image.new('RGBA', (x, y), bg_color)
            p.paste(img, (0, 0, x, y), img)
            p.save(pos_file_png_exported, format='png', dpi=(DPI, DPI))
            return True
        except Exception as e:
            logger.error(e)
            return False

    def add_offset_to_gcode(self, data):
        lines = data.split('\n')
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
        x_average = np.min(x_list)
        y_average = np.average(y_list)

        for i, line in enumerate(lines):
            if line.startswith(tuple(['G0', 'G1'])):
                List = line.strip().split(' ')
                line = ""
                for l in List:
                    if l.startswith('X'):
                        x = float(l[1:])
                        x -= x_average
                        x += self.x_offset
                        l = 'X{0:.3f}'.format(x)
                    elif l.startswith('Y'):
                        y = float(l[1:])
                        y -= y_average
                        y += self.y_offset
                        l = 'Y{0:.3f}'.format(y)
                    line += l + ' '
                line = line.strip()
                lines[i] = line

        data = "\n".join(lines)
        return data

    def add_offset_to_gcode_new(self, data):
        if isinstance(data, list):
            lines = data
        elif isinstance(data, str):
            lines = data.split('\n')
        else:
            lines = []

        for i, line in enumerate(lines):
            if line.startswith(tuple(['G0', 'G1'])):
                List = line.strip().split(' ')
                line = ""
                for l in List:
                    if l.startswith('X'):
                        x = float(l[1:])
                        x += self.x_offset
                        l = 'X{0:.3f}'.format(x)
                    elif l.startswith('Y'):
                        y = float(l[1:])
                        y += self.y_offset
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

        # data = "\n".join(lines)
        return lines

    def png2gcode(self, pos_file_png_exported=None, pos_file_png_BW=None, bytes=None):
        if bytes is not None:

            reader = png.Reader(bytes=bytes)
        else:
            reader = png.Reader(pos_file_png_exported)
        w, h, pixels, metadata = reader.read_flat()

        # List al posto di un array
        matrice = [[255 for i in range(w)] for j in range(h)]

        # Scrivo una nuova immagine in Scala di grigio 8bit
        # copia pixel per pixel

        if self.grayscale_type == 1:
            # 0.21R + 0.71G + 0.07B
            for y in range(h):  # y varia da 0 a h-1
                for x in range(w):  # x varia da 0 a w-1
                    pixel_position = (x + y * w) * 4 if metadata['alpha'] else (x + y * w) * 3
                    matrice[y][x] = int(pixels[pixel_position] * 0.21 + pixels[pixel_position + 1] * 0.71 + pixels[pixel_position + 2] * 0.07)

        elif self.grayscale_type == 2:
            # (R+G+B)/3
            for y in range(h):  # y varia da 0 a h-1
                for x in range(w):  # x varia da 0 a w-1
                    pixel_position = (x + y * w) * 4 if metadata['alpha'] else (x + y * w) * 3
                    matrice[y][x] = int((pixels[pixel_position] + pixels[pixel_position + 1] + pixels[pixel_position + 2]) / 3)

        elif self.grayscale_type == 3:
            # R
            for y in range(h):  # y varia da 0 a h-1
                for x in range(w):  # x varia da 0 a w-1
                    pixel_position = (x + y * w) * 4 if metadata['alpha'] else (x + y * w) * 3
                    matrice[y][x] = int(pixels[pixel_position])

        elif self.grayscale_type == 4:
            # G
            for y in range(h):  # y varia da 0 a h-1
                for x in range(w):  # x varia da 0 a w-1
                    pixel_position = (x + y * w) * 4 if metadata['alpha'] else (x + y * w) * 3
                    matrice[y][x] = int(pixels[pixel_position + 1])

        elif self.grayscale_type == 5:
            # B
            for y in range(h):  # y varia da 0 a h-1
                for x in range(w):  # x varia da 0 a w-1
                    pixel_position = (x + y * w) * 4 if metadata['alpha'] else (x + y * w) * 3
                    matrice[y][x] = int(pixels[pixel_position + 2])

        elif self.grayscale_type == 6:
            # Max Color
            for y in range(h):  # y varia da 0 a h-1
                for x in range(w):  # x varia da 0 a w-1
                    pixel_position = (x + y * w) * 4 if metadata['alpha'] else (x + y * w) * 3
                    list_RGB = pixels[pixel_position], pixels[pixel_position + 1], pixels[pixel_position + 2]
                    matrice[y][x] = int(max(list_RGB))

        else:
            # Min Color
            for y in range(h):  # y varia da 0 a h-1
                for x in range(w):  # x varia da 0 a w-1
                    pixel_position = (x + y * w) * 4 if metadata['alpha'] else (x + y * w) * 3
                    list_RGB = pixels[pixel_position], pixels[pixel_position + 1], pixels[pixel_position + 2]
                    matrice[y][x] = int(min(list_RGB))

        B = 255
        N = 0

        matrice_BN = [[255 for i in range(w)] for j in range(h)]

        if self.conversion_type == 1:
            # B/W fixed threshold
            soglia = self.BW_threshold
            for y in range(h):
                for x in range(w):
                    if matrice[y][x] >= soglia:
                        matrice_BN[y][x] = B
                    else:
                        matrice_BN[y][x] = N

        elif self.conversion_type == 2:
            # B/W random threshold
            from random import randint
            for y in range(h):
                for x in range(w):
                    soglia = randint(20, 235)
                    if matrice[y][x] >= soglia:
                        matrice_BN[y][x] = B
                    else:
                        matrice_BN[y][x] = N

        elif self.conversion_type == 3:
            # Halftone
            Step1 = [[B, B, B, B, B], [B, B, B, B, B], [B, B, N, B, B], [B, B, B, B, B], [B, B, B, B, B]]
            Step2 = [[B, B, B, B, B], [B, B, N, B, B], [B, N, N, N, B], [B, B, N, B, B], [B, B, B, B, B]]
            Step3 = [[B, B, N, B, B], [B, N, N, N, B], [N, N, N, N, N], [B, N, N, N, B], [B, B, N, B, B]]
            Step4 = [[B, N, N, N, B], [N, N, N, N, N], [N, N, N, N, N], [N, N, N, N, N], [B, N, N, N, B]]

            for y in range(h // 5):
                for x in range(w // 5):
                    media = 0
                    for y2 in range(5):
                        for x2 in range(5):
                            media += matrice[y * 5 + y2][x * 5 + x2]
                    media = media // 25
                    for y3 in range(5):
                        for x3 in range(5):
                            if media >= 250 and media <= 255:
                                matrice_BN[y * 5 + y3][x * 5 + x3] = B
                            if media >= 190 and media < 250:
                                matrice_BN[y * 5 + y3][x * 5 + x3] = Step1[y3][x3]
                            if media >= 130 and media < 190:
                                matrice_BN[y * 5 + y3][x * 5 + x3] = Step2[y3][x3]
                            if media >= 70 and media < 130:
                                matrice_BN[y * 5 + y3][x * 5 + x3] = Step3[y3][x3]
                            if media >= 10 and media < 70:
                                matrice_BN[y * 5 + y3][x * 5 + x3] = Step4[y3][x3]
                            if media >= 0 and media < 10:
                                matrice_BN[y * 5 + y3][x * 5 + x3] = N

        elif self.conversion_type == 4:
            # Halftone row
            Step1r = [B, B, N, B, B]
            Step2r = [B, N, N, B, B]
            Step3r = [B, N, N, N, B]
            Step4r = [N, N, N, N, B]

            for y in range(h):
                for x in range(w // 5):
                    media = 0
                    for x2 in range(5):
                        media += matrice[y][x * 5 + x2]
                    media = media // 5
                    for x3 in range(5):
                        if media >= 250 and media <= 255:
                            matrice_BN[y][x * 5 + x3] = B
                        if media >= 190 and media < 250:
                            matrice_BN[y][x * 5 + x3] = Step1r[x3]
                        if media >= 130 and media < 190:
                            matrice_BN[y][x * 5 + x3] = Step2r[x3]
                        if media >= 70 and media < 130:
                            matrice_BN[y][x * 5 + x3] = Step3r[x3]
                        if media >= 10 and media < 70:
                            matrice_BN[y][x * 5 + x3] = Step4r[x3]
                        if media >= 0 and media < 10:
                            matrice_BN[y][x * 5 + x3] = N

        elif self.conversion_type == 5:
            # Halftone column
            Step1c = [B, B, N, B, B]
            Step2c = [B, N, N, B, B]
            Step3c = [B, N, N, N, B]
            Step4c = [N, N, N, N, B]

            for y in range(h // 5):
                for x in range(w):
                    media = 0
                    for y2 in range(5):
                        media += matrice[y * 5 + y2][x]
                    media = media // 5
                    for y3 in range(5):
                        if media >= 250 and media <= 255:
                            matrice_BN[y * 5 + y3][x] = B
                        if media >= 190 and media < 250:
                            matrice_BN[y * 5 + y3][x] = Step1c[y3]
                        if media >= 130 and media < 190:
                            matrice_BN[y * 5 + y3][x] = Step2c[y3]
                        if media >= 70 and media < 130:
                            matrice_BN[y * 5 + y3][x] = Step3c[y3]
                        if media >= 10 and media < 70:
                            matrice_BN[y * 5 + y3][x] = Step4c[y3]
                        if media >= 0 and media < 10:
                            matrice_BN[y * 5 + y3][x] = N

        else:
            # Grayscale
            if self.grayscale_resolution == 1:
                matrice_BN = matrice
            else:
                for y in range(h):
                    for x in range(w):
                        if matrice[y][x] <= 1:
                            matrice_BN[y][x] == 0

                        if matrice[y][x] >= 254:
                            matrice_BN[y][x] == 255

                        if matrice[y][x] > 1 and matrice[y][x] < 254:
                            matrice_BN[y][x] = (matrice[y][x] // self.grayscale_resolution) * self.grayscale_resolution

        # Ora matrice_BN contiene l'immagine in Bianco (255) e Nero (0)

        #### SALVO IMMAGINE IN BIANCO E NERO ####
        if pos_file_png_BW is not None:
            file_img_BN = open(pos_file_png_BW, 'wb')  # Creo il file
            Costruttore_img = png.Writer(w, h, greyscale=True, bitdepth=8) # Impostazione del file immagine
            Costruttore_img.write(file_img_BN, matrice_BN) # Costruttore del file immagine
            file_img_BN.close()  # Chiudo il file

        #### GENERO IL FILE GCODE ####
        if self.preview_only == False:  # Genero Gcode solo se devo

            if self.flip_y == False:  # Inverto asse Y solo se flip_y = False
                # -> coordinate Cartesiane (False) Coordinate "informatiche" (True)
                matrice_BN.reverse()

            Laser_ON = False
            F_G01 = self.drawing_feedrate
            F_G00 = self.moving_feedrate
            Scala = self.resolution * self.scale # 0.51555
            # Scala = self.resolution

            # Configurazioni iniziali standard Gcode
            # gcode_data = 'M2400 S01; set laser mode\n\n'

            gcode_data_list = []

            # Creazione del Gcode

            # allargo la matrice per lavorare su tutta l'immagine
            for y in range(h):
                matrice_BN[y].append(B)
            w = w + 1

            if self.conversion_type != 6:
                for y in range(h):
                    if y % 2 == 0:
                        for x in range(w):
                            if matrice_BN[y][x] == N:
                                if Laser_ON == False:
                                    gcode_data_list.append('G00 Z{0:.2f} F{1:.2f}'.format(self.z_home + self.z_offset, self.moving_feedrate))
                                    gcode_data_list.append('G00 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                            float(y) / Scala,
                                            -(float(x) / Scala),
                                            F_G00))
                                    # gcode_data = '\n'.join([gcode_data,
                                    #     'G00 Z{0:.2f} F{1:.2f}'.format(self.z_home + self.z_offset, self.moving_feedrate),
                                    #     'G00 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                    #         float(y) / Scala,
                                    #         -(float(x) / Scala),
                                    #         F_G00)])
                                    Laser_ON = True
                                if Laser_ON == True:  # DEVO evitare di uscire dalla matrice
                                    if x == w - 1:
                                        gcode_data_list.append('G00 Z{0:.2f} F{1:.2f}'.format(self.z_offset, self.moving_feedrate))
                                        gcode_data_list.append('G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                                float(y) / Scala,
                                                -(float(x) / Scala),
                                                F_G01))
                                        # gcode_data = '\n'.join([gcode_data,
                                        #     'G00 Z{0:.2f} F{1:.2f}'.format(self.z_offset, self.moving_feedrate),
                                        #     'G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                        #         float(y) / Scala,
                                        #         -(float(x) / Scala),
                                        #         F_G01)])
                                        Laser_ON = False
                                    else:
                                        if matrice_BN[y][x + 1] != N:
                                            gcode_data_list.append('G00 Z{0:.2f} F{1:.2f}'.format(self.z_offset, self.moving_feedrate))
                                            gcode_data_list.append('G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                                    float(y) / Scala,
                                                    -(float(x) / Scala),
                                                    F_G01))
                                            # gcode_data = '\n'.join([gcode_data,
                                            #     'G00 Z{0:.2f} F{1:.2f}'.format(self.z_offset, self.moving_feedrate),
                                            #     'G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                            #         float(y) / Scala,
                                            #         -(float(x) / Scala),
                                            #         F_G01)])
                                            Laser_ON = False
                    else:
                        for x in reversed(range(w)):
                            if matrice_BN[y][x] == N:
                                if Laser_ON == False:
                                    gcode_data_list.append('G00 Z{0:.2f} F{1:.2f}'.format(self.z_home + self.z_offset, self.moving_feedrate))
                                    gcode_data_list.append('G00 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                            float(y) / Scala,
                                            -(float(x) / Scala),
                                            F_G00))
                                    # gcode_data = '\n'.join([gcode_data,
                                    #     'G00 Z{0:.2f} F{1:.2f}'.format(self.z_home + self.z_offset, self.moving_feedrate),
                                    #     'G00 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                    #         float(y) / Scala,
                                    #         -(float(x) / Scala),
                                    #         F_G00)])
                                    Laser_ON = True
                                if Laser_ON == True:  # DEVO evitare di uscire dalla matrice
                                    if x == 0:
                                        gcode_data_list.append('G00 Z{0:.2f} F{1:.2f}'.format(self.z_offset, self.moving_feedrate))
                                        gcode_data_list.append('G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                                float(y) / Scala,
                                                -(float(x) / Scala),
                                                F_G01))
                                        # gcode_data = '\n'.join([gcode_data,
                                        #     'G00 Z{0:.2f} F{1:.2f}'.format(self.z_offset, self.moving_feedrate),
                                        #     'G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                        #         float(y) / Scala,
                                        #         -(float(x) / Scala),
                                        #         F_G01)])
                                        Laser_ON = False
                                    else:
                                        if matrice_BN[y][x - 1] != N:
                                            gcode_data_list.append('G00 Z{0:.2f} F{1:.2f}'.format(self.z_offset, self.moving_feedrate))
                                            gcode_data_list.append('G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                                    float(y) / Scala,
                                                    -(float(x) / Scala),
                                                    F_G01))
                                            # gcode_data = '\n'.join([gcode_data,
                                            #     'G00 Z{0:.2f} F{1:.2f}'.format(self.z_offset, self.moving_feedrate),
                                            #     'G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                            #         float(y) / Scala,
                                            #         -(float(x) / Scala),
                                            #         F_G01)])
                                            Laser_ON = False

            else:  # SCALA DI GRIGI
                for y in range(h):
                    if y % 2 == 0:
                        for x in range(w):
                            if matrice_BN[y][x] != B:
                                if Laser_ON == False:
                                    gcode_data_list.append('G00 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                            float(y) / Scala,
                                            -(float(x) / Scala),
                                            F_G00))
                                    gcode_data_list.append('{0}  S{1}'.format(self.laseron,
                                            255 - matrice_BN[y][x]))
                                    # gcode_data = '\n'.join([gcode_data,
                                    #     'G00 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                    #         float(y) / Scala,
                                    #         -(float(x) / Scala),
                                    #         F_G00),
                                    #     '{0}  S{1}'.format(self.laseron,
                                    #         255 - matrice_BN[y][x])])
                                    Laser_ON = True

                                if Laser_ON == True:  # DEVO evitare di uscire dalla matrice
                                    if x == w - 1:  # controllo fine riga
                                        gcode_data_list.append('G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                                float(y) / Scala,
                                                -(float(x) / Scala),
                                                F_G01))
                                        gcode_data_list.append(self.laseroff)
                                        # gcode_data = '\n'.join([gcode_data,
                                        #     'G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                        #         float(y) / Scala,
                                        #         -(float(x) / Scala),
                                        #         F_G01),
                                        #     self.laseroff])
                                        Laser_ON = False

                                    else:
                                        if matrice_BN[y][x + 1] == B:
                                            gcode_data_list.append('G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                                    float(y) / Scala,
                                                    -(float(x + 1) / Scala),
                                                    F_G01))
                                            gcode_data_list.append(self.laseroff)
                                            # gcode_data = '\n'.join([gcode_data,
                                            #     'G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                            #         float(y) / Scala,
                                            #         -(float(x + 1) / Scala),
                                            #         F_G01),
                                            #     self.laseroff])
                                            Laser_ON = False

                                        elif matrice_BN[y][x] != matrice_BN[y][x + 1]:
                                            gcode_data_list.append('G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                                    float(y) / Scala,
                                                    -(float(x + 1) / Scala),
                                                    F_G01))
                                            gcode_data_list.append('{0}  S{1}'.format(self.laseron,
                                                    255 - matrice_BN[y][x + 1]))
                                            # gcode_data = '\n'.join([gcode_data,
                                            #     'G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                            #         float(y) / Scala,
                                            #         -(float(x + 1) / Scala),
                                            #         F_G01),
                                            #     '{0}  S{1}'.format(self.laseron,
                                            #         255 - matrice_BN[y][x + 1])])
                    else:
                        for x in reversed(range(w)):
                            if matrice_BN[y][x] != B:
                                if Laser_ON == False:
                                    gcode_data_list.append('G00 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                            float(y) / Scala,
                                            -(float(x + 1) / Scala),
                                            F_G00))
                                    gcode_data_list.append('{0}  S{1}'.format(self.laseron,
                                            255 - matrice_BN[y][x]))
                                    # gcode_data = '\n'.join([gcode_data,
                                    #     'G00 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                    #         float(y) / Scala,
                                    #         -(float(x + 1) / Scala),
                                    #         F_G00),
                                    #     '{0}  S{1}'.format(self.laseron,
                                    #         255 - matrice_BN[y][x])])
                                    Laser_ON = True

                                if Laser_ON == True:  # DEVO evitare di uscire dalla matrice
                                    if x == 0:  # controllo fine riga ritorno
                                        gcode_data_list.append('G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                                float(y) / Scala,
                                                -(float(x) / Scala),
                                                F_G01))
                                        gcode_data_list.append(self.laseroff)
                                        # gcode_data = '\n'.join([gcode_data,
                                        #     'G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                        #         float(y) / Scala,
                                        #         -(float(x) / Scala),
                                        #         F_G01),
                                        #     self.laseroff])
                                        Laser_ON = False

                                    else:
                                        if matrice_BN[y][x - 1] == B:
                                            gcode_data_list.append('G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                                    float(y) / Scala,
                                                    -(float(x) / Scala),
                                                    F_G01))
                                            gcode_data_list.append(self.laseroff)
                                            # gcode_data = '\n'.join([gcode_data,
                                            #     'G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                            #         float(y) / Scala,
                                            #         -(float(x) / Scala),
                                            #         F_G01),
                                            #     self.laseroff])
                                            Laser_ON = False

                                        elif matrice_BN[y][x] != matrice_BN[y][x - 1]:
                                            gcode_data_list.append('G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                                    float(y) / Scala,
                                                    -(float(x) / Scala),
                                                    F_G01))
                                            gcode_data_list.append('{0}  S{1}'.format(self.laseron,
                                                    255 - matrice_BN[y][x - 1]))
                                            # gcode_data = '\n'.join([gcode_data,
                                            #     'G01 X{0:.2f} Y{1:.2f} F{2:.2f}'.format(
                                            #         float(y) / Scala,
                                            #         -(float(x) / Scala),
                                            #         F_G01),
                                            #     '{0}  S{1}'.format(self.laseron,
                                            #         255 - matrice_BN[y][x - 1])])

            gcode_data_list = self.add_offset_to_gcode_new(gcode_data_list)
            gcode_data_list.insert(0, 'G00 Z{0:.2f} F{1:.2f}'.format(self.z_home + self.z_offset, self.moving_feedrate))
            gcode_data_list.insert(1, 'G00 X{0:.2f} Y{1:.2f} Z{2:.2f} F{3:.2f}\n'.format(self.x_home, self.y_home, self.z_home + self.z_offset, self.moving_feedrate))
            gcode_data_list.append('G00 Z{0:.2f} F{1:.2f}'.format(self.z_home + self.z_offset, self.moving_feedrate))
            gcode_data_list.append('G00 X{0:.2f} Y{1:.2f} Z{2:.2f} F{3:.2f}'.format(self.x_home, self.y_home, self.z_home + self.z_offset, self.moving_feedrate))
            gcode_data = '\n'.join(gcode_data_list)

            # gcode_data = self.add_offset_to_gcode_new(gcode_data)
            # gcode_data = '\n'.join([
            #     'G00 Z{0:.2f} F{1:.2f}'.format(self.z_home + self.z_offset, self.moving_feedrate),
            #     'G00 X{0:.2f} Y{1:.2f} Z{2:.2f} F{3:.2f}\n'.format(self.x_home, self.y_home, self.z_home + self.z_offset, self.moving_feedrate),
            #     gcode_data,
            #     'G00 Z{0:.2f} F{1:.2f}'.format(self.z_home + self.z_offset, self.moving_feedrate),
            #     'G00 X{0:.2f} Y{1:.2f} Z{2:.2f} F{3:.2f}'.format(self.x_home, self.y_home, self.z_home + self.z_offset, self.moving_feedrate)
            # ])

            return gcode_data.strip('\n')
