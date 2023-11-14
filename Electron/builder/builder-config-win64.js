const packageJson = require('../package.json');
const buildConfigCommon = require('./builder-config-common');

// see https://www.electron.build/configuration/configuration#configuration

let buildConfigWin = {
  nsis: {
    artifactName: `veRTC.exe`,
    perMachine: true,
    oneClick: false,
    warningsAsErrors: false,
    deleteAppDataOnUninstall: true,
    // "allowElevation": true,
    createDesktopShortcut: 'always',
    allowToChangeInstallationDirectory: true,
    runAfterFinish: true,
  },
  win: {
    icon: '../assets/win.png',
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
  },
  asar: false, // asar打包
  extraResources: [
    // {
    //   // 拷贝dll等静态文件到指定位置
    //   from: './assets/',
    //   to: 'assets',
    // },
    // { from: './effect.dll', to: '../effect.dll' },
    // { from: './pthreadVC2.dll', to: '../pthreadVC2.dll' },
  ],
};

Object.assign(buildConfigWin, buildConfigCommon);

module.exports = buildConfigWin;
