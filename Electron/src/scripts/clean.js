const path = require('path');
const rimraf = require('rimraf');

function main() {
  rimraf(path.join(__dirname, '../../dist'), function (err) {
    if (err) {
      console.log('删除dist失败');
    } else {
      console.log('删除dist成功');
    }
  });
}
main();
