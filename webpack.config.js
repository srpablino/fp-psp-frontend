var webpack = require('webpack');
var entry = {
  main: './src/app/main',
  login_main: './src/login_app/login_main'
};

(output = {
  path: __dirname,
  filename: '[name].js'
}),
(uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
  compressor: {
    screw_ie8: true,
    warnings: false
  },
  output: {
    comments: false
  }
}));

module.exports.development = {
  debug: true,
  devtool: 'eval-source-map',
  entry: entry,
  output: output,
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
  }
};

module.exports.production = {
  debug: false,
  entry: entry,
  output: output,
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
  plugins: [uglifyJsPlugin]
};
