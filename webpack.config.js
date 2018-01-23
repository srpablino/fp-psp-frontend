var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

var entryPointsConfig = {
  main: {
    webpackEntry: { main: './src/app/main' },
    fullPath: './src/app/main'
  },
  login_main: {
    webpackEntry: { login_main: './src/login_app/login_main' },
    fullPath: './src/login_app/login_main'
  }
};

(output = {
  path: __dirname,
  //filename: '[name].js'
  filename: 'js/[name].[chunkhash].js'
}),
((uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
  compressor: {
    screw_ie8: true,
    warnings: false
  },
  output: {
    comments: false
  }
})),
  // move shared dependencies into the entry chunk
  (chunksPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    children: true,
    filename: 'js/vendor.[chunkhash].js',
    minChunks: 2
  })),
  // inject entry script into HTML file
  (htmlPlugin = new HtmlWebpackPlugin({
    template: './src/index.html',
    chunks: ['main']
  })),
  (loginHtmlPlugin = new HtmlWebpackPlugin({
    template: './src/login.html',
    chunks: ['login_main']
  })));

module.exports.development = {
  entryPointsConfig,
  getConfig(entry) {
    return {
      watch: true,
      debug: true,
      devtool: 'source-map',
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
      plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /es|en/),
        chunksPlugin,
        htmlPlugin,
        loginHtmlPlugin
      ]
    };
  }
};

module.exports.production = {
  entryPointsConfig,
  getConfig(entry) {
    return {
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
      plugins: [
        uglifyJsPlugin,
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /es|en/),
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
        })
      ]
    };
  }
};
