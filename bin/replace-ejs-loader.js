const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

let html = null;

module.exports = function (source) {
  // 关闭该 Loader 的缓存功能
  this.cacheable(false);

  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this);
  const { key } = options;
  const reg = new RegExp(`(@${key}\\()(.*?)\\)`);
  const regResult = reg.exec(source);
  console.log('regResult', regResult);

  // 告诉 webpack本次转换是异步的，Loader 会在 callback 中回调结果
  const callback = this.async();

  if (regResult) {
    const request = loaderUtils.urlToRequest(regResult[2]);
    console.log('request', request, regResult[2]);
    // 像 require 语句一样获得指定文件的完整路径
    this.resolve('/src', request, (err, rs) => {
      if (err) {
        rs = path.resolve(this.resourcePath, '../', request);
        console.log('rs', rs);
      }
      html = fs.readFileSync(rs, 'utf-8');
      this.addDependency(rs);
      // 用读取的文件内容 替换 @include(../templates/list.html)
      const res = source.replace(regResult[0], html);
      console.log('res', res);
      callback(null, res);
    });
  } else {
    callback(null, source);
  }

  return source;
};
