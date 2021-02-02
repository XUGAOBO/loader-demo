const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ConsolePlugin = require('./console-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const s3Path = 'https://s3plus.vip.sankuai.com/hrdataportal/helper/';

const config = require('../config');

const webpackConfig = {
  devtool: false, // 此选项控制是否生成，以及如何生成 source map
  resolve: {
    alias: {
      demo: path.join(__dirname, '../src/components'),
    },
    // 尝试按顺序解析文件后缀名, 如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
    extensions: ['*', '.js', '.jsx', '.less', '.css'],
  },
  // 入口配置
  entry: {
    bundle: config.entry,
    // vendor: ['react', 'react-dom'],
  },
  // 输出配置
  output: {
    filename: '[name]-[hash:8].js',
    // chunkFilename: '[name]-[chunkhash:8].js',
    path: config.path,
  },
  module: {
    // 解析器配置
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      // 大于相关浏览器版本无需用到 preset-env
                      edge: '17',
                      firefox: '60',
                      chrome: '67',
                      safari: '11.1',
                    },
                    corejs: '3', // 声明corejs版本
                    // 根据代码逻辑中用到的 ES6+语法进行方法的导入，而不是全部导入
                    useBuiltIns: 'usage', // useBuiltIns就是是否开启自动支持 polyfill，它能自动给每个文件添加其需要的poly-fill。
                  },
                ],
                '@babel/preset-react',
              ],
              plugins: [
                '@babel/proposal-class-properties',
                [
                  'import',
                  {
                    libraryName: '@ss/mtd-react',
                    style: 'css',
                    // "style": true 会加载 scss 文件
                    // "style": false 不会加载样式文件
                  },
                ],
              ], // Support for the experimental syntax 'classProperties' isn't currently enabled
            },
          },
          {
            loader: path.resolve(__dirname, './replace-html-loader.js'),
            options: {
              key: 'include',
              data: 'data',
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss', // 说明options里面插件的使用是针对于谁的，我们这里是针对于postcss的
                plugins: [
                  // 这里的插件只是这对于postcss
                  require('autoprefixer')(), // 引入添加前缀的插件,第二个空括号是将该插件执行
                ],
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100, // 不超过100byte, 则转换成base64位
              name: '[name].[ext]', // 图片输出路径
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]', // 音视频输出路径
            },
          },
        ],
      },
      {
        test: /\.(|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]', // 字体输出路径
              outputPath: s3Path,
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]', // 字体输出路径
              outputPath: s3Path,
            },
          },
        ],
      },
    ],
  },
  // 插件配置
  plugins: [
    new HtmlWebpackPlugin({
      template: config.template,
      inject: true, // 注入选项 有四个值 true,body(script标签位于body底部),head,false(不插入js文件)
      filename: 'index.html',
      minify: {
        // 压缩html
        removeComments: true, // 去除注释
        collapseWhitespace: true, // 去除空格
      },
    }),
    new ConsolePlugin(),
    // new MiniCssExtractPlugin(),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 8889,
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   logLevel: 'info',
    // }),
  ],
};

module.exports = webpackConfig;
