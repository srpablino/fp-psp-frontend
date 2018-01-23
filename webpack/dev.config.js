const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  watch: true,
  debug: true,
  devtool: 'source-map',
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js/vendor.js'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['vendor', 'js/main'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/login.html',
      chunks: ['vendor', 'js/login_main'],
      filename: 'login.html'
    })
  ]
});
