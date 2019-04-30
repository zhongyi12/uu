import os
import platform

block_cipher = None

# Set up some convenience variables to shorten up the path names
#project_dir  = "."
#vision_resource_dir = os.path.join(".", "vision", "Resources")
#target_avrdude_dir = os.path.join(".", "Resources", "avrdude")

#if platform.system() == 'Darwin':
#    avrdude_bin_dir = os.path.join(".", "Resources", "avrdude", "mac")
#elif platform.system() == 'Windows':
#    avrdude_bin_dir = os.path.join(".", "Resources", "avrdude", "win")
#elif platform.system() == 'Linux':
#    avrdude_bin_dir = os.path.join(".", "Resources", "avrdude", "linux")

#data_files = [(os.path.join(vision_resource_dir ,'*') , (os.path.join(vision_resource_dir))),
#                (os.path.join(avrdude_bin_dir, '*'), (os.path.join(target_avrdude_dir)))
#            ]
a = Analysis(['run.py'],
             pathex=['dist'],
             binaries=None,
             datas=[],
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)

#import os
#import platform
#system = platform.system().lower()
#current_dir = os.getcwd()

#if system == 'windows':
#    python_tar_bz2 = os.path.join(current_dir, 'python', 'win', 'python.tar.bz2')
#elif system == 'darwin':
#    python_tar_bz2 = os.path.join(current_dir, 'python', 'mac', 'python.tar.bz2')
#else:
#    python_tar_bz2 = os.path.join(current_dir, 'python', 'linux', 'python.tar.bz2')
#blockly = os.path.join(current_dir, 'blockly', 'blockly.py')
#python_html = os.path.join(current_dir, 'templates', 'python.html')

#a.datas.append(('/python.tar.bz2', python_tar_bz2, 'DATA'))
#a.datas.append(('/blockly.py', blockly, 'DATA'))
#a.datas.append(('/templates/python.html', python_html, 'DATA'))

pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          name='uarmcore',
          debug=True,
          strip=False,
          upx=True,
          )
