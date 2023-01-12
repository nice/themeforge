const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",

  entry: "./src/index.js",

  output: {
    filename: "index.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  module: {
    rules: [
      // js
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      // css, sass
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },

  plugins: [
    // to move injected <style> from <head> to seperate file
    new MiniCssExtractPlugin({
      filename: "main.bundle.css",
    }),
    // to create dist/index.html from src
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
      inject: false,
    }),
  ],

  // removes the wrapping of index.bundle.js with (() => {})();
  target: ["web", "es5"],

  devServer: {
    hot: false,
    static: path.resolve(__dirname, "dist"),
    port: 9000,
  },
};
