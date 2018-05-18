var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "src/main.jsx")
  },
  output: {
    filename: "main.js",
    path: path.join(__dirname, "public"),
    publicPath: "/public/"
  },
  devServer: {
    contentBase: "./",
    publicPath: "/public/",
    inline: true
  },
  devtool: "source-map",
  plugins: [new ExtractTextPlugin("./styles.css")],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /styles/, /public/],
        include: path.join(__dirname, "src"),
        loader: "babel-loader",
        query: {
          presets: ["es2015", "react"],
          plugins: ["transform-class-properties"]
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: [/node-modules/, /public/],
        include: path.join(__dirname, "src"),
        query: {
          presets: ["es2015", "react"]
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!sass-loader"
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  }
};
