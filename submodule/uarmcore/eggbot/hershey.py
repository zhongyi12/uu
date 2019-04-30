#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Hershey Text - renders a line of text using "Hershey" fonts for plotters

Copyright 2011-2017, Windell H. Oskay, www.evilmadscientist.com

Additional contributions by Sheldon B. Michaels
and by the contributors of the Inkscape project, http://inkscape.org


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
from . import hersheydata          #data file w/ Hershey font data
from . import inkex
from .svglib import simplestyle
from .svglib.simpletransform import computePointInNode

FONT_GROUP_V_SPACING = 45

def draw_svg_text(char, face, offset, vertoffset, parent):
    style = { 'stroke': '#000000', 'fill': 'none' }
    pathString = face[char]
    splitString = pathString.split()
    midpoint = offset - float(splitString[0])
    splitpoint = pathString.find("M")
    # Space glyphs have just widths with no moves, so their splitpoint is 0
    # We only want to generate paths for visible glyphs where splitpoint > 0
    if splitpoint > 0:
        pathString = pathString[splitpoint:] #portion after first move
        trans = 'translate(' + str(midpoint) + ',' + str(vertoffset) + ')'
        text_attribs = {'style':simplestyle.formatStyle(style), 'd':pathString, 'transform':trans}
        inkex.etree.SubElement(parent, inkex.addNS('path','svg'), text_attribs)
    return midpoint + float(splitString[1])   #new offset value

def svg_text_width(char, face, offset):
    pathString = face[char]
    splitString = pathString.split()
    midpoint = offset - float(splitString[0])
    return midpoint + float(splitString[1]) #new offset value

class Hershey( inkex.Effect ):
    def __init__(self, *args, **kwargs):
        inkex.Effect.__init__(self, *args, **kwargs)

        self.tab = kwargs.get('tab', 'splash')
        self.text = kwargs.get('text', 'Hello World\nuArm\nUFACTORY')
        self.action = kwargs.get('action', 'render')
        self.fontface = kwargs.get('fontface', 'EMSBird') # astrology
        self.spacing_offset = kwargs.get('spacing_offset', 800)
        self.vertical_offset = kwargs.get('vertical_offset', 400)
        self.debug = kwargs.get('debug', False)

        self.text_list = self.text.split('\n')

    def effect(self, data):
        text_list = data.split('\n')

        OutputGenerated = False

        # Embed text in group to make manipulation easier:
        g_attribs = {inkex.addNS('label','inkscape'):'Hershey Text' }
        g = inkex.etree.SubElement(self.current_layer, 'g', g_attribs)

        scale = self.unittouu('1px')    # convert to document units
        font = eval('hersheydata.' + str(self.fontface))
        clearfont = hersheydata.futural
        #Baseline: modernized roman simplex from JHF distribution.

        w = 0 # self.spacing_offset  #Initial spacing offset
        v = 300 # self.vertical_offset  #Initial vertical offset
        spacing = 3  # spacing between letters

        if self.action == "render":
            #evaluate text string
            for text in text_list:
                letterVals = [ord(q) - 32 for q in text]
                for q in letterVals:
                    if (q <= 0) or (q > 95):
                        w += 2*spacing
                    else:
                        w = draw_svg_text(q, font, w, v, g)
                        OutputGenerated = True
                w = 0 #self.spacing_offset
                v += FONT_GROUP_V_SPACING
        elif self.action == 'sample':
            w,v = self.render_table_of_all_fonts( 'group_allfonts', g, spacing, clearfont )
            OutputGenerated = True
            scale *= 0.4    #Typically scales to about A4/US Letter size
        else:
            #Generate glyph table
            wmax = 0
            for p in range(0,10):
                w = 0
                v = spacing * (15*p - 67 )
                for q in range(0,10):
                    r = p*10 + q
                    if (r <= 0) or (r > 95):
                        w += 5*spacing
                    else:
                        w = draw_svg_text(r, clearfont, w, v, g)
                        w = draw_svg_text(r, font, w, v, g)
                        w += 5*spacing
                if w > wmax:
                    wmax = w
            w = wmax
            OutputGenerated = True
        #  Translate group to center of view, approximately
        view_center = computePointInNode(list(self.view_center), self.current_layer)
        t = 'translate(' + str( view_center[0] - scale*w/2) + ',' + str( view_center[1] - scale*v/2 ) + ')'
        if scale != 1:
            t += ' scale(' + str(scale) + ')'
        g.set( 'transform',t)

        if not OutputGenerated:
            self.current_layer.remove(g)    #remove empty group, if no SVG was generated.

    def render_table_of_all_fonts(self, fontgroupname, parent, spacing, clearfont):
        v = 0
        wmax = 0
        wmin = 0
        fontgroup = eval('hersheydata.' + fontgroupname)

        # Render list of font names in a vertical column:
        nFontIndex = 0
        for f in fontgroup:
            w = 0
            letterVals = [ord(q) - 32 for q in (f[1] + ' -> ')]
            # we want to right-justify the clear text, so need to know its width
            for q in letterVals:
                w = svg_text_width(q, clearfont, w)

            w = -w  # move the name text left by its width
            if w < wmin:
                wmin = w
            # print the font name
            for q in letterVals:
                w = draw_svg_text(q, clearfont, w, v, parent)
            v += FONT_GROUP_V_SPACING
            if w > wmax:
                wmax = w

        # Next, we render a second column. The user's text, in each of the different fonts:
        v = 0                   # back to top line
        wmaxname = wmax + 8     # single space width
        for f in fontgroup:
            w = wmaxname
            font = eval('hersheydata.' + f[0])
            #evaluate text string
            letterVals = [ord(q) - 32 for q in self.text]
            for q in letterVals:
                if (q <= 0) or (q > 95):
                    w += 2*spacing
                else:
                    w = draw_svg_text(q, font, w, v, parent)
            v += FONT_GROUP_V_SPACING
            if w > wmax:
                wmax = w
        return wmax + wmin, v


if __name__ == '__main__':
    e = Hershey()
    e.affect()

# vim: expandtab shiftwidth=4 tabstop=8 softtabstop=4 fileencoding=utf-8 textwidth=99
