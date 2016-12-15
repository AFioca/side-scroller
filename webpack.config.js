var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: __dirname,

  entry: './js/entry.js', // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs

  output: {
    path: path.resolve('./js/'),
    filename: "bundle.js",
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },

}
