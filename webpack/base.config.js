var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    'js/main': './src/app/main',
    'js/login_main': './src/login_app/login_main',
    vendor: ['jquery', 'bootstrap', 'backbone', 'backbone.marionette', 'lodash']
  },
  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.hbs$/, loader: 'handlebars-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /bootstrap.+\.(jsx|js)$/,
        loader: 'imports?jQuery=jquery,$=jquery,this=>window'
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /es|en/)
  ]
};
