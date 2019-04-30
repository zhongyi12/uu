#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
inkex.py
A helper module for creating Inkscape extensions

Copyright (C) 2005,2010 Aaron Spike <aaron@ekips.org> and contributors

Contributors:
  Aurélio A. Heckert <aurium(a)gmail.com>
  Bulia Byak <buliabyak@users.sf.net>
  Nicolas Dufour, nicoduf@yahoo.fr
  Peter J. R. Moulder <pjrm@users.sourceforge.net>

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
"""
import six
import base64
import sys
sys.path.append("..")
from log import logger

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
PNG_PATH = os.path.join(FILES_PATH, "png")
if not os.path.exists(PNG_PATH):
    os.mkdir(PNG_PATH)
LASERGCODE_PATH = os.path.join(FILES_PATH, "lasergcode")
if not os.path.exists(LASERGCODE_PATH):
    os.mkdir(LASERGCODE_PATH)

class Effect:
    """A class for creating Inkscape SVG Effects"""

    def __init__(self, *args, **kwargs):
        self.document = None
        self.original_document = None
        self.ctx = None
        self.selected = {}
        self.doc_ids = {}
        self.options = None
        self.args = None

        self.ids = kwargs.get('ids', [])
        self.selected_nodes = kwargs.get('selected_nodes', [])

        # TODO write a parser for this

    def effect(self, svg_data=None, png_data=None):
        """Apply some effects on the document. Extensions subclassing Effect
        must override this function and define the transformations
        in it."""
        pass

    def write_svg_to_file(self, data, path=None):
        if path is None:
            path = os.path.join(SVG_PATH, "input.svg")
        with open(path, 'wb') as f:
            f.write(data)
        return path

    def write_png_to_file(self, data, path=None):
        if path is None:
            path = os.path.join(PNG_PATH, "input.png")
        with open(path, 'wb') as f:
            f.write(data)
        return path

    def affect(self, svg_data=None, base64_png_data=None):
        """Affect an base64 png data or svg_data with a callback effect"""
        if svg_data is None and base64_png_data is None:
            logger.error("args error")
            return False
        if svg_data is not None:
            if six.PY3:
                if isinstance(svg_data, str):
                    svg_data = bytes(svg_data, encoding='utf-8')
            else:
                svg_data = svg_data
            png_data = None
        elif base64_png_data is not None:
            if six.PY3:
                if isinstance(base64_png_data, str):
                    base64_png_data = bytes(base64_png_data, encoding='utf-8')
            else:
                base64_png_data = base64_png_data.encode('utf-8')
            try:
                tmp = base64_png_data.split(b',')
                if len(tmp) == 1:
                    base64_png_data = tmp[0]
                else:
                    base64_png_data = tmp[1]
                png_data = base64.decodebytes(base64_png_data)
            except:
                logger.error('base64 png data error')
                return False

        gcode_data = self.effect(svg_data, png_data)
        return gcode_data

