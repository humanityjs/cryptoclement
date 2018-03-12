const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const path = require('path');
const precss = require('precss');

const TransferWebpackPlugin = require('transfer-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: ['eventsource-polyfill', 'tether', './client/index.jsx'],
  plugins: [
    new CleanWebpackPlugin(['build']),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      tether: 'tether',
      Tether: 'tether',
      'window.Tether': 'tether',
      Popper: ['popper.js', 'default']
    }),
    new ExtractTextPlugin('main.css'),
    new TransferWebpackPlugin([{ from: 'client/assets/public' }])
  ],
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader' // translates CSS into CommonJS modules
            },
            {
              loader: 'postcss-loader', // Run post css actions
              options: {
                plugins() {
                  // post css plugins, can be exported to postcss.config.js
                  return [precss, autoprefixer];
                }
              }
            },
            {
              loader: 'sass-loader' // compiles SASS to CSS
            }
          ]
        })
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000'
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=images/[name].[ext]',
          'image-webpack-loader?bypassOnDebug'
        ]
      },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
