const buildConfigCommon = require('./builder-config-common');

let buildConfigMac = {
  mac: {
    target: 'dmg',
    icon: '../assets/mac.png',
    entitlements: 'builder/builder-config/entitlements.mac.plist',
    extendInfo: {
      NSCameraUsageDescription: 'Request camera usage',
      NSMicrophoneUsageDescription: 'Request mic usage',
    },
  },
  asar: false, // asar打包
  extraResources: [
    {
      // 拷贝dll等静态文件到指定位置
      from: './assets/VeRTCVirtualSoundCard.driver',
      to: 'assets/VeRTCVirtualSoundCard.driver',
    },
    // {
    //   from: './libeffect.dylib',
    //   to: '../Frameworks/libeffect.dylib',
    // },
  ],
  publish: null,
};

Object.assign(buildConfigMac, buildConfigCommon);

module.exports = buildConfigMac;
