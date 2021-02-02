const webpack = require('webpack');
const merge = require('webpack-merge');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const baseConfig = require('./webpack.config');
const config = require('../config');

const devConfig = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  // mode: 'production',
  devServer: {
    hot: true, // hotOnly 修改内容后command+s后，页面并不会刷新，而需要手动进行刷新
    inline: true,
    disableHostCheck: true,
    contentBase: config.path,
    compress: true,
    host: 'localhost',
    port: 8082,
    overlay: true,
    publicPath: config.pubicPath,
    proxy: {
      '/sso': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/oauth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  output: {
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../static'),
    //     to: config.staticSubDirectory,
    //     ignore: ['.*'],
    //   },
    // ]),
  ],
  // optimization: {
  //   minimizer: [
  //     // js压缩
  //     new TerserWebpackPlugin({
  //       parallel: true,
  //       exclude: /\/node_modules/,
  //       extractComments: false, // 这个选项如果为true 会生成一个xxx.js.LICENSE.txt文件 存储特定格式的注释
  //       terserOptions: {
  //         warnings: false,
  //         compress: {
  //           unused: true,
  //           drop_debugger: true, // 删除debugger
  //           drop_console: true, // 删除console
  //         },
  //       },
  //     }),
  //     // css压缩
  //     new OptimizeCssAssetsPlugin({
  //       cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
  //     }),
  //   ],
  // },
});

module.exports = devConfig;
