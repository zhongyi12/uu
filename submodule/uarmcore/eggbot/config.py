"""Print bed width in mm"""
bed_max_x = 800

"""Print bed height in mm"""
bed_max_y = 400

"""
Used to control the smoothness/sharpness of the curves.
Smaller the value greater the sharpness. Make sure the
value is greater than 0.1
"""
smoothness = 0.2
spacing_offset = 800
vertical_offset = 400

scale_x = 0.7
scale_y = 0.5

x_home = 190
y_home = 0
z_home = 50 # pen height
x_offset = 190
y_offset = 0
z_offset = 10 # pen up or pen down height


moving_feedrate = 2000
drawing_feedrate = 1000

"""G-code emitted at the start of processing the SVG file"""
preamble = "G0 X{} Y{} Z{} F{}"

"""G-code emitted at the end of processing the SVG file"""
postamble = "G0 X{} Y{} Z{} F{}"

"""G-code emitted before processing a SVG shape"""
shape_preamble = ""

"""G-code emitted after processing a SVG shape"""
shape_postamble = ""
