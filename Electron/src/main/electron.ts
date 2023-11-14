import { ipcMain, net, app, BrowserWindow, screen, globalShortcut } from 'electron';
import {
  createMainWindow,
  createFooterWindow,
  createMemberWindow,
  createModalWindow,
  createScreenWindow,
  createSettingWindow,
  createHostAnswerWindow,
  createApplyLinkWindow,
  createHostRecieveRecordWindow,
  createHostComfirmRecordWindow,
  createRecordWindow,
} from './utils';

import { ProcessEvent, WindowType } from '@/types';

const windowMap = new Map<WindowType, BrowserWindow>();

process.on('uncaughtException', (error) => {
  console.log('发生了未知错误', error);
});

const mainWindowWidth = 1380;
const mainWindowHeight = 820;
const changeMainWindowWidth = 1280;
let isShareWindow = false;

// http请求
ipcMain.on(ProcessEvent.HTTP, (e: any, apiName: string, params: string) => {
  console.log(`apiName: ${apiName}, params: ${params}`);
  const reqParams = {
    event_name: apiName,
    content: params,
  };
  const request = net.request({
    method: 'POST',
    url: 'http://rtc-test.bytedance.com/vertc_demo_me_os/login',
  });
  request.write(JSON.stringify(reqParams));
  request.on('response', (response: any) => {
    let data = '';
    response.on('data', (res: any) => {
      data += res;
    });
    response.on('end', () => {
      e.sender.send('reply', apiName, data.toString());
      console.log('No more data in response.');
    });
  });
  request.end();
});

// 窗口关闭
ipcMain.on(ProcessEvent.CloseWindow, (e: any) => {
  const mainWindow = windowMap.get(WindowType.MAIN);
  if (mainWindow) {
    mainWindow.close();
  }
});
// 窗口最小化
ipcMain.on(ProcessEvent.MinsizeWindow, (e: any) => {
  const mainWindow = windowMap.get(WindowType.MAIN);
  if (mainWindow) {
    mainWindow.minimize();
  }
});
// 全屏
ipcMain.on(ProcessEvent.FullScreenWindow, (e: any) => {
  const mainWindow = windowMap.get(WindowType.MAIN);
  if (mainWindow) {
    if (mainWindow.isSimpleFullScreen()) {
      mainWindow.setSimpleFullScreen(false);
    } else {
      mainWindow.setSimpleFullScreen(true);
    }
  }
});

ipcMain.on(ProcessEvent.MiniScreen, (e) => {
  const mainWindow = windowMap.get(WindowType.MAIN);
  if (mainWindow) {
    mainWindow.setFullScreen(false);
  }
});

// 监听window打开和关闭的请求
ipcMain.on(ProcessEvent.OperateWindow, (e, type: WindowType, operate: string) => {
  console.log(ProcessEvent.OperateWindow, type, operate);
  const win = windowMap.get(type);
  if (win) {
    if (win.isVisible()) {
      if (operate !== 'open') {
        win.hide();
      }
    } else {
      if (operate !== 'close') {
        win.show();
      }
    }
  }
});

// 共享屏幕时改变
ipcMain.on(ProcessEvent.ChangeMainWindow, (e, x, y, width, height, fixedW, fixedH) => {
  isShareWindow = true;
  let target;
  if (x !== undefined) {
    target = screen.getDisplayMatching({
      x,
      y,
      width,
      height,
    });
  } else {
    target = screen.getAllDisplays()[0];
  }
  const { x: screenX, y: screenY, width: screenWidth, height: screenHeight } = target.bounds;
  const mid = Math.floor(screenX + screenWidth / 2);
  const mainWindow = windowMap.get(WindowType.MAIN);
  if (mainWindow) {
    mainWindow.setFullScreen(false);
    mainWindow.hide();
    setTimeout(() => {
      console.log('setBounds:', x, y, width, height, fixedW, fixedH);
      mainWindow.setBounds({
        x: Math.floor(mid - changeMainWindowWidth / 2),
        y: 10,
        width: changeMainWindowWidth,
        height: 117,
      });
      mainWindow.show();
      mainWindow.setResizable(false);
      e.sender.send('mainWindowChangeFinish', mid, screenHeight);
    }, 500);
  }
});

// 展示底部操作栏
ipcMain.on(ProcessEvent.ShowFooter, (e, screenMid, screenHeight) => {
  const footerWindow = windowMap.get(WindowType.FOOTER);
  if (footerWindow) {
    const [w, h] = footerWindow.getSize();
    footerWindow.setBounds({
      x: Math.floor(screenMid - w / 2),
      y: screenHeight - 150,
      width: w,
      height: h,
    });
    footerWindow.show();
  }
  setTimeout(() => {
    e.sender.send('updateScreenFilter');
  }, 500);
});

// 共享屏幕复原
ipcMain.on(ProcessEvent.RecoverWindow, (e) => {
  isShareWindow = false;
  const mainWindow = windowMap.get(WindowType.MAIN);
  const target = screen.getAllDisplays()[0];
  const { x: screenX, y: screenY, width: screenWidth, height: screenHeight } = target.bounds;
  const midX = Math.floor(screenX + screenWidth / 2);
  const midY = Math.floor(screenY + screenHeight / 2);
  if (mainWindow) {
    mainWindow.setShape([]);
    mainWindow.setResizable(true);
    mainWindow.hide();
    setTimeout(() => {
      mainWindow.setBounds({
        x: midX - mainWindowWidth / 2,
        y: midY - mainWindowHeight / 2,
        width: mainWindowWidth,
        height: mainWindowHeight,
      });
      mainWindow.show();
    }, 500);
  }
  // 隐藏其他窗口
  windowMap.forEach((item) => {
    if (item && item.id !== mainWindow?.id) {
      item.hide();
    }
  });
});

// 收起视频悬浮窗
ipcMain.on(ProcessEvent.CloseVideoWindow, () => {
  const mainWindow = windowMap.get(WindowType.MAIN);
  if (mainWindow) {
    mainWindow.setContentSize(1280, 20);
    mainWindow.setShape([
      {
        x: 0,
        y: 0,
        width: 1280,
        height: 20,
      },
    ]);
  }
});

// 打开视频悬浮窗
ipcMain.on(ProcessEvent.OpenVideoWindow, () => {
  const mainWindow = windowMap.get(WindowType.MAIN);
  if (mainWindow) {
    mainWindow.setContentSize(1280, 117);
    mainWindow.setShape([
      {
        x: 0,
        y: 0,
        width: 1280,
        height: 117,
      },
    ]);
  }
});

ipcMain.on(ProcessEvent.OpenWindow, (e, url) => {
  const contentWindow = new BrowserWindow({
    width: 960,
    height: 720,
    fullscreenable: false,
  });
  contentWindow.loadURL(url);

  //   contentWindow.webContents.openDevTools();
});

ipcMain.on(ProcessEvent.IsShareWindow, (e) => {
  if (isShareWindow) {
    e.sender.send('shareWindow');
  }
});

// 录制回放
ipcMain.on(ProcessEvent.OpenRecord, (e, url) => {
  createRecordWindow(url);
});

// 注册快捷键
function registryShortcut() {
  globalShortcut.register('CommandOrControl+K', () => {
    // 获取当前窗口
    BrowserWindow.getFocusedWindow()?.webContents.openDevTools();
  });
  globalShortcut.register('Escape', () => {
    // 返回上一个窗口
    BrowserWindow.getFocusedWindow()?.webContents.goBack();
  });
}

function unregistryShortcut() {
  globalShortcut.unregisterAll();
}

/**
 * app 模块控制主进程的生命周期
 */
app.whenReady().then(async () => {
  registryShortcut();
  // let hostWindow = createHostAnswerWindow();
  let mainWindow = createMainWindow();
  let footerWindow = createFooterWindow();
  let memberWindow = createMemberWindow();
  let applyLinkWindow = createApplyLinkWindow();
  let attendeeWindow = createModalWindow();
  let screenWindow = createScreenWindow();
  let settingWindow = createSettingWindow();
  let hostRecieveRecordWindow = createHostRecieveRecordWindow();
  let hostComfirmRecordWindow = createHostComfirmRecordWindow();
  windowMap.set(WindowType.MAIN, mainWindow);
  // windowMap.set(WindowType.HOST_MODAL, hostWindow);
  windowMap.set(WindowType.FOOTER, footerWindow);
  windowMap.set(WindowType.MEMBER, memberWindow);
  windowMap.set(WindowType.APPLY_LINK, applyLinkWindow);

  windowMap.set(WindowType.ATTENDEE_MODAL, attendeeWindow);
  windowMap.set(WindowType.SCREEN, screenWindow);
  windowMap.set(WindowType.SETTING, settingWindow);
  windowMap.set(WindowType.HOST_RECORD_COMFIRM, hostComfirmRecordWindow);
  windowMap.set(WindowType.HOST_RECORD_RECIVE, hostRecieveRecordWindow);
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
      footerWindow = createFooterWindow();
      memberWindow = createMemberWindow();
      applyLinkWindow = createApplyLinkWindow();

      attendeeWindow = createModalWindow();
      // hostWindow = createHostAnswerWindow();
      screenWindow = createScreenWindow();
      settingWindow = createSettingWindow();
      hostRecieveRecordWindow = createHostRecieveRecordWindow();
      hostComfirmRecordWindow = createHostComfirmRecordWindow();
      windowMap.set(WindowType.MAIN, mainWindow);
      windowMap.set(WindowType.FOOTER, footerWindow);
      windowMap.set(WindowType.APPLY_LINK, applyLinkWindow);
      windowMap.set(WindowType.MEMBER, memberWindow);
      windowMap.set(WindowType.ATTENDEE_MODAL, attendeeWindow);
      // windowMap.set(WindowType.HOST_MODAL, hostWindow);
      windowMap.set(WindowType.SCREEN, screenWindow);
      windowMap.set(WindowType.SETTING, settingWindow);
      windowMap.set(WindowType.HOST_RECORD_COMFIRM, hostComfirmRecordWindow);
      windowMap.set(WindowType.HOST_RECORD_RECIVE, hostRecieveRecordWindow);
    }
  });
  mainWindow.on('close', () => {
    console.log('close');
    app.quit();
  });
  app.on('will-quit', () => {
    unregistryShortcut();
  });

  app.on('window-all-closed', () => {
    console.log('all window close');

    app.quit();
  });
});
