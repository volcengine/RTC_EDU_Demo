const path = require('path');
const fse = require('fs-extra');
const rimraf = require('rimraf');
const srcDir = path.join(__dirname, '../../js');
const destDir = path.join(__dirname, '../../node_modules/@volcengine/vertc-electron-sdk/js');

function main() {
  console.log('overriteJs, srcDir: ', srcDir);
  console.log('overriteJs, destDir: ', destDir);
  rimraf.sync(destDir);
  fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
    if (err) {
      console.error('overriteJs, error: ', err);
    } else {
      console.log('overriteJs, success!');
    }
  });
}
main();
