const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack.config');
const config = require('../config');

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    publicPath: config.pubicPath,
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(), // 打包结束后会启动一个服务在浏览器查看打包的大小以及包内容
  ],
  optimization: {
    minimizer: [
      // js压缩
      new TerserWebpackPlugin({
        parallel: true,
        exclude: /\/node_modules/,
        extractComments: false, // 这个选项如果为true 会生成一个xxx.js.LICENSE.txt文件 存储特定格式的注释
        terserOptions: {
          warnings: false,
          compress: {
            unused: true,
            drop_debugger: true, // 删除debugger
            drop_console: true, // 删除console
          },
        },
      }),
      // css压缩
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
      }),
    ],
  },
});
