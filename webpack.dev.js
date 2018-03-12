const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  entry: [
    'webpack/hot/only-dev-server',
    'webpack-hot-middleware/client?reload=true'
  ],
  devServer: {
    contentBase: 'client/', // Relative directory for base of server
    hot: true, // Live-reload
    inline: true,
    port: process.env.PORT || 3000, // Port Number
    host: 'localhost', // Change to '0.0.0.0' for external facing server
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ]
});
