import numpy as np
import json


def replace_3d_gcode_file(file, x_offset=200, y_offset=0):
    with open(file, 'r') as f:
        lines = f.readlines()
    x_list = []
    y_list = []
    lineno = 0
    for i, line in enumerate(lines):
        if line.startswith('M109') and line.endswith('\n'):
            temperature = float(line.strip().split(' ')[1][1:])
            if temperature > 245:
                temperature = 245
            elif temperature < 205:
                temperature = 205
            line = 'M109 S{}\n'.format(temperature - 5)
            lines[i] = line
        elif line.startswith('M104') and line.endswith('\n'):
            # line = 'M104 S205\n'
            temperature = float(line.strip().split(' ')[1][1:])
            if temperature > 245:
                temperature = 245
            # elif temperature < 200:
            #     temperature = 200
            line = 'M104 S{}\n'.format(temperature)
            lines[i] = line
        elif line.startswith('M107'):
            line = '\n'
            lines[i] = line
        elif line.startswith(tuple(['M18', 'M84'])):
            lines[i] = ';' + line
            lineno = i
        elif line.startswith(tuple(['G0', 'G1'])):
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
    last_z = 0
    for i, line in enumerate(lines):
        if line.startswith(tuple(['G0', 'G1'])):
            List = line.strip().split(' ')
            line = ""
            for l in List:
                if l.startswith('X'):
                    x = float(l[1:])
                    x -= x_average
                    x += x_offset
                    l = 'X{0:.3f}'.format(x)
                elif l.startswith('Y'):
                    y = float(l[1:])
                    y -= y_average
                    y += y_offset
                    l = 'Y{0:.3f}'.format(y)
                elif l.startswith('Z'):
                    last_z = float(l[1:])
                line += l + ' '
            line = line.strip()
            lines[i] = line + '\n'
    last_z += 20
    lines.insert(lineno, 'G0 Z{0:.3f}\n'.format(last_z))
    lines.insert(0, 'M106\n')
    # lines.insert(0, 'M2400 S2; set 3D Printing mode\n\n')

    lines.append('M107\n')
    data = "".join(lines)
    return data

def add_zeropoint_height_to_gcode(gcode, zeropoint_height):
    if isinstance(zeropoint_height, str):
        try:
            zeropoint_height = float(zeropoint_height)
        except Exception as e:
            print(e)
            return gcode
    lines = gcode.split('\n')
    for i, line in enumerate(lines):
        if line.startswith(tuple(['G0', 'G1'])):
            List = line.strip().split(' ')
            line = ""
            for l in List:
                if l.startswith('Z'):
                    z = float(l[1:])
                    z += zeropoint_height
                    l = 'Z{0:.2f}'.format(z)
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

    # if len(x_list) > 0:
    #     print('x_min: {}, x_max: {}, x_distance: {}'.format(np.min(x_list), np.max(x_list), np.max(x_list) - np.min(x_list)))
    # if len(y_list) > 0:
    #     print('y_min: {}, y_max: {}, y_distance: {}'.format(np.min(y_list), np.max(y_list), np.max(y_list) - np.min(y_list)))

    data = "\n".join(lines)
    return data


if __name__ == '__main__':
    data = replace_3d_gcode_file('temp.ngc')
    with open('new.ngc', 'w') as f:
        f.write(data)