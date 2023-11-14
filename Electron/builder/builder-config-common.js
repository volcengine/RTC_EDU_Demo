const packageJson = require('../package.json');

// see https://www.electron.build/configuration/configuration#configuration
let buildConfigCommon = {
  productName: 'veRTCRoom',
  artifactName: 'veRTC.${ext}',
  appId: `${packageJson.name}`,
  files: ['**/*'],
  directories: {
    buildResources: 'dist',
    output: 'output',
    app: 'dist',
  },
  compression: 'maximum',
  asarUnpack: ['@volcengine/vertc-electron-sdk'],
};

module.exports = buildConfigCommon;
