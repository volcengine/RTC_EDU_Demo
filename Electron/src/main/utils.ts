import { app, BrowserWindow, systemPreferences } from 'electron';
import path from 'path';
(global as any).shareWindowId = {
  mainWindowId: '',
  footerWindowId: '',
  settingWindowId: '',
  memberWindowId: '',
  attendeeWindowId: '',
  hostWindowId: '',
  screenWindowId: '',
  applyLinkWindowId: '',
};

// 创建主窗口
export function createMainWindow() {
  const mainWindow = new BrowserWindow({
    show: false,
    width: 1380,
    minWidth: 1280,
    height: 820,
    frame: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true, // require is not defined
      devTools: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });
  mainWindow.setSkipTaskbar(false);
  mainWindow.loadURL('http://127.0.0.1:7001');
  mainWindow.webContents.openDevTools();

  //   const session = mainWindow.webContents.session;

  const domain = 'https://demo.volcvideo.com';
  const filter = {
    urls: [`${domain}/*`],
  };

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    // PPE
    // details.requestHeaders['Referer'] = 'https://rtc.demo.volcengine.com';
    // details.requestHeaders['Origin'] = 'https://rtc.demo.volcengine.com';
    console.log(' mainWindow.webContents.session.webRequest.onBeforeSendHeaders:', filter, details);
    details.requestHeaders['Referer'] = domain;
    details.requestHeaders['Origin'] = domain;

    callback({ requestHeaders: details.requestHeaders });
  });

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false });
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  mainWindow.on('close', () => {
    app.quit();
  });
  (global as any).shareWindowId.mainWindowId = mainWindow.webContents.id;
  return mainWindow;
}

// 创建底部操作栏窗口
export function createFooterWindow() {
  const footerWindow = new BrowserWindow({
    width: 597,
    height: 76,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true, // require is not defined
      devTools: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  footerWindow.loadURL('http://127.0.0.1:7002');
  // footerWindow.webContents.openDevTools();
  footerWindow.setAlwaysOnTop(true, 'pop-up-menu');
  footerWindow.setVisibleOnAllWorkspaces(true);
  (global as any).shareWindowId.footerWindowId = footerWindow.webContents.id;
  return footerWindow;
}
// 参会人确认弹窗窗口
export function createModalWindow() {
  const modalWindow = new BrowserWindow({
    width: 300,
    height: 280,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true, // require is not defined
      devTools: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  modalWindow.loadURL('http://127.0.0.1:7002');
  modalWindow.setVisibleOnAllWorkspaces(true);
  (global as any).shareWindowId.attendeeWindowId = modalWindow.webContents.id;
  return modalWindow;
}

// 开启录制确认弹窗窗口
export function createHostComfirmRecordWindow() {
  const hostRecordComfirm = new BrowserWindow({
    width: 300,
    height: 280,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true, // require is not defined
      devTools: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  hostRecordComfirm.loadURL('http://127.0.0.1:7002');
  hostRecordComfirm.setVisibleOnAllWorkspaces(true);
  (global as any).shareWindowId.hostRecordComfirmwindowId = hostRecordComfirm.webContents.id;
  return hostRecordComfirm;
}
// 收到开启录制弹窗
export function createHostRecieveRecordWindow() {
  const hostRecordRecieve = new BrowserWindow({
    width: 300,
    height: 280,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true, // require is not defined
      devTools: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  hostRecordRecieve.loadURL('http://127.0.0.1:7002');
  hostRecordRecieve.setVisibleOnAllWorkspaces(true);
  (global as any).shareWindowId.hostRecordRecieveWindowId = hostRecordRecieve.webContents.id;
  return hostRecordRecieve;
}

// 主持人同意收到参会人申请权限
export function createHostAnswerWindow() {
  const modalWindow = new BrowserWindow({
    width: 640,
    height: 480,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true, // require is not defined
      devTools: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  modalWindow.loadURL('http://127.0.0.1:7002');
  (global as any).shareWindowId.hostWindowId = modalWindow.webContents.id;
  return modalWindow;
}

// 创建屏幕list窗口
export function createScreenWindow() {
  const screenWindow = new BrowserWindow({
    width: 800,
    height: 480,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true, // require is not defined
      devTools: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  screenWindow.loadURL('http://127.0.0.1:7002');
  screenWindow.setVisibleOnAllWorkspaces(true);
  (global as any).shareWindowId.screenWindowId = screenWindow.webContents.id;
  return screenWindow;
}
// 成员窗口
export function createMemberWindow() {
  const memberWindow = new BrowserWindow({
    width: 300,
    height: 600,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true, // require is not defined
      devTools: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  memberWindow.loadURL('http://127.0.0.1:7002');
  memberWindow.setVisibleOnAllWorkspaces(true);
  //   memberWindow.webContents.openDevTools();

  (global as any).shareWindowId.memberWindowId = memberWindow.webContents.id;
  return memberWindow;
}

// 连麦申请窗口
export function createApplyLinkWindow() {
  const applyLinkWindow = new BrowserWindow({
    width: 220,
    height: 600,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true, // require is not defined
      devTools: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  applyLinkWindow.loadURL('http://127.0.0.1:7002');
  applyLinkWindow.setVisibleOnAllWorkspaces(true);
  //   applyLinkWindow.webContents.openDevTools();

  (global as any).shareWindowId.applyLinkWindowId = applyLinkWindow.webContents.id;
  return applyLinkWindow;
}

// 设置窗口
export function createSettingWindow() {
  const settingWindow = new BrowserWindow({
    width: 600,
    height: 480,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true, // require is not defined
      devTools: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  settingWindow.loadURL('http://127.0.0.1:7002');
  settingWindow.setVisibleOnAllWorkspaces(true);
  (global as any).shareWindowId.settingWindowId = settingWindow.webContents.id;
  return settingWindow;
}

// 播放窗口
export function createRecordWindow(url: string) {
  const recordWindow = new BrowserWindow({
    width: 960,
    height: 720,
    show: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true, // require is not defined
      devTools: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  recordWindow.loadURL('http://127.0.0.1:7002');
  recordWindow.on('ready-to-show', () => {
    recordWindow.webContents.send('recordUrl', url);
    recordWindow.show();
  });
}

// 检查并申请设备权限：麦克风、摄像头、屏幕录制
export async function checkAndApplyDeviceAccessPrivilege() {
  const cameraPrivilege = systemPreferences.getMediaAccessStatus('camera');
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply cameraPrivilege: ${cameraPrivilege}`
  );
  if (cameraPrivilege !== 'granted') {
    await systemPreferences.askForMediaAccess('camera');
  }

  const micPrivilege = systemPreferences.getMediaAccessStatus('microphone');
  console.log(`checkAndApplyDeviceAccessPrivilege before apply micPrivilege: ${micPrivilege}`);
  if (micPrivilege !== 'granted') {
    await systemPreferences.askForMediaAccess('microphone');
  }

  return {
    cameraPrivilege,
    micPrivilege,
  };
}
