const path = require('path');

const resolve = (dir) => path.resolve(__dirname, dir);

const config = {
  // publicPath(客户端所访问的上线资源地址)指定的路径会被作为前缀添加到所有的url上, 例如html文件中的link标签，script标签、img标签
  pubicPath: process.env.PUBLIC_URL, // '/'
  template: resolve('../public/index.html'),
  entry: resolve('../src/index.js'),
  // 打包文件放置位置
  path: resolve('../build'),
};

module.exports = config;
