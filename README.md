# uArmStudio 开发指南

## uArmStudio 架构说明

![structure](/docs/structure.png)

1. uArm Studio 由两大块组成
  - 客户端部分使用 [Electron](https://electron.atom.io/) 框架 
  - 与机械臂连接的部分 uarmcore 则使用 python tornado 代理一个 WebSocket服务

2. Studio 与 uarmcore 之间的通信
  - uarmcore 与 Studio 之间使用 WebSocket 通信
  - uarmcore 作为 WebSocket 服务器，Studio (uarmapi) 作为 Websocket 客户端 (还有 Cura 的插件)
  - uarmcore 默认会使用 18321 作为代理端口

3. Electron 框架说明
  - uArm Studio Electron 框架分成 Main 和 Render ，Main 是由 Node.js 写成， Render 则使用了 [Vue.js](https://cn.vuejs.org/index.html)，Main 和 Render 两个具体的原理和通信可以查看官网的文档。
  - Main 和 Render 并没有那么明显的界限，但是一般 Main 里面都是实现文件操作，Render 则负责界面的渲染
  - 整个 Electron 项目的架构是参考了 [Electron-vue](https://github.com/SimulatedGREG/electron-vue)，并自己做了一些修改
  - Render 使用了 [vue-router](https://router.vuejs.org/zh-cn/) 单页面设计
  - Render 一共有 9 个页面，每个页面有单独的文件夹，是这个页面的子模块，所有跟该页面有关的资源都在当前页面的文件夹中
  ```
      BlocklyPageView     图形化 Blockly 界面
      CommonPageView      通用模块页面 （一般为侧边栏，个人信息页）
      ControlPageView     控制页面
      HomePageView        主页面
      LeapmotionPageView  Leapmotion控制
      LoginPageView       登录页面
      PaintPageView       写字/雕刻页面
      SettingPageView     设置页面
      TeachPageView       示教页面
  ```
  - src/renderer/components/assets/api/uarmapi.js 是 与 uarmcore 做通信的核心 API
  - 整个项目使用 [webpack](https://webpack.github.io/) 作为构建工具 

4. Studio 编译打包
    1. 编译前请先安装基本的运行环境 (Node.js/yarn/python3/pip)
    2. Studio 的打包主要使用了 [electron-builder](https://github.com/electron-userland/electron-builder) 
    3. 首先要先编译 uamrcore. 可以直接执行，config/builder 下的 build_mac.sh/build_win.bat/build_linux.sh （需要在特定的操作系统）
    4. 然后执行 yarn install
    5. 编译和打包
        - 测试版: yarn run pack:beta && yarn run build:beta
        - 正式版: yarn run pack:prod && yarn run build:prod` 

5. Studio 发布
    1. Studio 的发布是使用了自己开发的 [ReleaseTool](http://192.168.1.19/gitlab/software/ReleaseTool)
    2. 运行环境 Python3
    3. pip install -r requirements.txt
    4. python3 setup.py install
    5. 发布的配置文件 config/publisher
    6. 发布指令: yarn run publish:beta 或者 yarn run publish:production
    7. 如果是发布到内部的 uarm.studio 服务器: yarn run publish:test-beta 或者 yarn run publish:test-production

### 附件
#### Blockly 开发指南
  1. [Blockly](https://developers.google.com/blockly/guides/overview)
  2. 目前 Blockly 只使用了 Javascript (ES2015)
  3. [Blockly 生成工具](https://blockly-demo.appspot.com/static/demos/blockfactory/index.html) 
  4. 文件目录结构
  
    ├── blockly.js  初始化，各类全局模块定义
    ├── i18n        国际化文件
    │   ├── cn.js
    │   └── en.js
    ├── media
    ├── toolbox.xml 边栏定义
    └── uarm 
        ├── blockly_lib.js      Blockly 一些依赖的函数
        ├── blocks_code.js      Blockly 获取当前 Block 的参数
        ├── blocks_color.js     Blockly 颜色定义
        ├── blocks_define.js    Blockly 定义
        ├── code_generator.js   Blockly Javascript 生成器
        └── pixels_default.js   Grove OLED 使用的默认 pixels

