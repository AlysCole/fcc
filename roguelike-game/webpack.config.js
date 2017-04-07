var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: [
      './src/main.jsx'
    ]
  },
  output: {
    publicPath: '/dist/',
    path: path.join(__dirname, 'dist/'),
    filename: 'main.js'
  },
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin('./styles.css')
  ],
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: [/node_modules/, /styles/],
        include: path.join(__dirname, 'src'),
        loaders: [ 'babel-loader' ]
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader'
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  }
};
