var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    Grid: './src/Grid.js',
    main: './src/main.jsx'
  },
  output: {
    publicPath: '/dist/',
    path: path.join(__dirname, 'dist/'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin('./styles.css')
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /styles/],
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query:
        {
          presets: ['es2015', 'react'],
          plugins: ['transform-class-properties']
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node-modules/],
        query:
          {
            presets: ['es2015', 'react']
          }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
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
