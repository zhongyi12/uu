// process.env.BABEL_ENV = 'main';

const path = require('path');
const pkg = require('../package.json');
const settings = require('./config.js');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let appConfigFileName;
let menuFileName;
switch (process.env.STUDIO_CHANNEL) {
  default:
    appConfigFileName = 'appConfig.dev.js';
    menuFileName = 'menu.dev.js';
    break;
  case 'production':
    appConfigFileName = 'appConfig.pro.js';
    menuFileName = 'menu.pro.js';
    break;
  case 'beta':
    appConfigFileName = 'appConfig.beta.js';
    menuFileName = 'menu.pro.js';
    break;
  case 'development':
    appConfigFileName = 'appConfig.dev.js';
    menuFileName = 'menu.dev.js';
    break;
}

const mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/main/index.js'),
  },
  externals: Object.keys(pkg.dependencies || {}),
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist'),
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.STUDIO_CHANNEL': process.env.STUDIO_CHANNEL,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new CopyWebpackPlugin([{
      from: 'src/main/pages/static',
      to: 'static',
    }]),
  ],
  resolve: {
    alias: {
      appConfig: path.join(__dirname, '..', 'src', 'main', appConfigFileName),
      menuTemplate: path.join(__dirname, '..', 'src', 'main', 'menu', menuFileName),
      firmwareProperty: path.join(__dirname, '..', 'src', 'property', 'firmware.json'),
    },
    extensions: ['.js', '.json', '.node'],
  },
  target: 'electron-main',
};

// console.log(path.join(__dirname, '..', 'src', 'main',
//   process.env.STUDIO_ENV === 'production' ? 'appConfig.pro.js' : 'appConfig.dev.js'));

if (settings.eslint) {
  mainConfig.module.rules.push({
    test: /\.(js)$/,
    enforce: 'pre',
    exclude: [/node_modules/],
    use: {
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint-friendly-formatter'),
      },
    },
  });
}


// TODO: Eslint Setting
module.exports = mainConfig;
