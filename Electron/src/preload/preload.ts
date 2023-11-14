const remote = require('electron').remote;
const rApp = remote.app;
const fs = require('fs');
const rPath = require('path');

const mkdirsSync = (dirname: string) => {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(rPath.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
};

const SDK = require('@volcengine/vertc-electron-sdk');

window.VERTCVideo = SDK.RTCVideo;
window.veTools = {
  getLogPath: () => {
    let USER_DATA_PATH = rApp.getPath('userData');
    let logFilePath = rPath.join(USER_DATA_PATH, 'logs', 'vertc');
    mkdirsSync(logFilePath);
    return logFilePath;
  },
  getAppPath: () => {
    return rApp.getAppPath();
  },
  getPlatform: () => {
    return process.platform;
  },
};

console.log('SDK: ', SDK);
console.log('veTools: ', window.veTools);
