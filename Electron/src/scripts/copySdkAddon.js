const path = require('path');
const fse = require('fs-extra');
const rimraf = require('rimraf');
const srcDir = path.join(__dirname, '../../node_modules/@volcengine/vertc-electron-sdk/build');
const destDir = path.join(__dirname, '../../dist/@volcengine/vertc-electron-sdk/build');

const cardSrc = path.join(__dirname, '../../assets/VeRTCVirtualSoundCard.driver');
const cardDest = path.join(__dirname, '../../dist/VeRTCVirtualSoundCard.driver');

function main() {
  console.log('copySdkAddon, srcDir: ', srcDir);
  console.log('copySdkAddon, destDir: ', destDir);

  if (process.platform === 'darwin') {
    rimraf.sync(destDir);
    rimraf.sync(cardDest);
    fse.copySync(cardSrc, cardDest, { overwrite: true }, function (err) {
      if (err) {
        console.error('copy virtualCard, error: ', err);
      } else {
        console.log('copy virtualCard, success!');
      }
    });
  }
  // fse.mkdirsSync(destDir);
  fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
    if (err) {
      console.error('copy sdk addon, error: ', err);
    } else {
      console.log('copy sdk addon, success!');
    }
  });
  fse.copySync(
    path.join(__dirname, '../../assets/package.json'),
    path.join(__dirname, '../../dist/package.json'),
    { overwrite: true },
    function (err) {
      if (err) {
        console.error('copy package.json, error: ', err);
      } else {
        console.log('copy  package.json, success!');
      }
    }
  );
  fse.copySync(
    path.join(__dirname, '../../assets/test_misic.mp4'),
    path.join(__dirname, '../../dist/test_misic.mp4'),
    { overwrite: true },
    function (err) {
      if (err) {
        console.error('copy test_misic.mp4, error: ', err);
      } else {
        console.log('copy  test_misic.mp4, success!');
      }
    }
  );
}
main();
