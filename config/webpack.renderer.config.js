process.env.BABEL_ENV = 'renderer';

const path = require('path');
const pkg = require('../package.json');
const settings = require('./config.js');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// console.log(path.join(__dirname, 'config.js'));

let indexjsFilename;
console.log(`current STUDIO CHANNEL ${process.env.STUDIO_CHANNEL}`);
switch (process.env.STUDIO_CHANNEL) {
  default:
    indexjsFilename = 'index.dev.ejs';
    break;
  case 'production':
    indexjsFilename = 'index.pro.ejs';
    break;
  case 'beta':
    indexjsFilename = 'index.beta.ejs';
    break;
  case 'development':
    indexjsFilename = 'index.dev.ejs';
    break;
}

const rendererConfig = {
  devtool: '#eval-source-map',
  devServer: {
    overlay: true,
    port: settings.port,
    contentBase: path.join(__dirname, '../dist'),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    host: '0.0.0.0',
  },
  entry: {
    renderer: path.join(__dirname, '../src/renderer/main.js'),
  },
  externals: Object.keys(pkg.dependencies || {}),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader',
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [path.resolve(__dirname, '../src/renderer')],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              'sass-loader': 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              'scss-loader': 'vue-style-loader!css-loader!sass-loader',
            },
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name].[ext]',
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name].[ext]',
          },
        },
      },
      {
        test: /\.xml/,
        loader: 'raw-loader',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '..', 'src', indexjsFilename),
      appModules: process.env.NODE_ENV !== 'production' ?
        path.resolve(__dirname, '../node_modules') : false,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin([{
      from: 'src/renderer/components/BlocklyPageView/assets/lib/blockly/media',
      to: 'media',
    }]),
    new CopyWebpackPlugin([{
      from: 'src/renderer/components/assets/lib/leapmotion',
      to: 'leapmotion',
    }]),
    new webpack.IgnorePlugin(/^(canvas|jsdom)$/),
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist'),
  },
  resolve: {
    alias: {
      components: path.join(__dirname, '../src/renderer/components'),
      renderer: path.join(__dirname, '../src/renderer'),
      'bootstrap-css': 'bootstrap/dist/css/bootstrap.min.css',
      firmwareProperty: path.join(__dirname, '..', 'src', 'property', 'firmware.json'),
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node'],
  },
  target: 'electron-renderer',
};

if (process.env.NODE_ENV !== 'production') {
  /**
   * Apply ESLint
   */
  if (settings.eslint) {
    rendererConfig.module.rules.push({
      test: /\.(js|vue)$/,
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
}

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  rendererConfig.devtool = '';

  rendererConfig.module.rules.push({
    test: /\.(js|vue)$/,
    enforce: 'pre',
    exclude: [/node_modules/],
    use: {
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint-friendly-formatter'),
      },
    },
  });
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.STUDIO_CHANNEL': process.env.STUDIO_CHANNEL,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    })
  );
}

module.exports = rendererConfig;
