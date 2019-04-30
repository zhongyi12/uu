import ReconnectingWebSocket from './lib/reconnecting-websocket';
import AccountAPI from './accountapi';

// TODO: 日誌打開或者關閉
const News = {};
let trigger = null;
News.socket_info = {
  socket: null,
  socket_connected: false,
};

News.feedBuffer = [];
News.feedCount = 0;
let failTimes = 0;
News.initSocketFlag = false;

News.init = () => {
  if (News.socket_info.socket === null) {
    if (AccountAPI.profile.websocket.host !== null && !News.initSocketFlag) {
      News.init_socket();
    }
    else {
      AccountAPI.getWSAddress().then((data) => {
        News.init_socket();
        console.log(`host: ${data.host}`);
      });
    }
  }
};

News.init_socket = (options) => {
  options = options || {};
  const host = options.host || AccountAPI.profile.websocket.host;
  News.initSocketFlag = true;
  News.socket_info.socket = new ReconnectingWebSocket(host, null, {
    debug: true,
    logger: console,
    reconnectInterval: 3000,
  });

  News.socket_info.socket.onclose = () => {
    News.socket_info.socket_connected = false;
    console.log('socket disconnect:');
    clearInterval(trigger);
    failTimes++;
    if (failTimes % 10 === 0) AccountAPI.getWSAddress();
  };


  News.socket_info.socket.onopen = () => {
    News.socket_info.socket_connected = true;
    failTimes = 0;
    const heartBeat = {};
    trigger = setInterval(() => {
      if (News.socket_info.socket_connected) News.send_msg(heartBeat);
    }, 20000);
    const startMsg = {
      cmd: 'login',
      appId: AccountAPI.profile.websocket.appId,
      installationId: AccountAPI.profile.websocket.objectId,
    };
    News.send_msg(startMsg);
  };

  News.socket_info.socket.onmessage = (evt) => {
    // console.log(evt); ---bug, crash if uncomment
    const msgData = evt;
    try {
      const item = JSON.parse(msgData.data);
      if (item.cmd === 'data') {
        News.insert_msg(item.msg);
        const rcvMsg = {
          cmd: 'ack',
          appId: AccountAPI.profile.websocket.appId,
          installationId: AccountAPI.profile.websocket.objectId,
          ids: item.ids,
        };
        News.send_msg(rcvMsg);
      }
      // News.feedBuffer[News.feedCount] = evt;
      // News.feedCount = News.feedCount + 1;
    }
    catch (e) {
      console.error(e);
    }
  };
};
News.insert_msg = (msgString) => { // save one msg item
  let existingEntries;
  if (localStorage.getItem('newsFeed') === null) {
    existingEntries = [];
  }
  else {
    try {
      existingEntries = JSON.parse(localStorage.getItem('newsFeed'));
    }
    catch (e) {
      console.error(e);
      return;
    }
  }
  const newsItem = {
    time: News.currentTime(),
    content: msgString,
  };
  existingEntries.unshift(newsItem);
  localStorage.setItem('newsFeed', JSON.stringify(existingEntries));
  News.feedCount += 1;
};
News.send_msg = (msg) => {
  const js_msg = JSON.stringify(msg);
  // console.log(`Message Send: ${js_msg}`);
  if (News.socket_info && News.socket_info.socket) {
    News.socket_info.socket.send(js_msg);
  }
};
News.currentTime = () => {
  const nowDate = new Date();
  const dateStr = `${nowDate.getFullYear()}-${nowDate.getMonth()}-${nowDate.getDate()}`;
  // const timeStr = `${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`;
  return dateStr;
};
News.resetCount = () => {
  News.feedCount = 0;
};
export default News;
