const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const meta = {
  basePath: "/themeforge",
  baseFolder: "themeforge",
};

module.exports = {
  mode: "development",

  entry: "./src/index.js",

  output: {
    filename: "index.bundle.js",
    path: path.resolve(__dirname, "dist", meta.baseFolder),
  },

  module: {
    rules: [
      // ejs
      {
        test: /\.ejs$/,
        use: [
          {
            loader: "ejs-webpack-loader",
            options: {
              data: { meta: meta },
              htmlmin: true,
            },
          },
        ],
      },
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
      template: path.resolve(__dirname, "src/templates", "index.ejs"),
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/templates", "screenshots.ejs"),
      inject: false,
      filename: "screenshots/index.html",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/templates", "faq.ejs"),
      inject: false,
      filename: "faq/index.html",
    }),
  ],

  // removes the wrapping of index.bundle.js with (() => {})();
  target: ["web", "es5"],

  devServer: {
    hot: false,
    static: path.resolve(__dirname, "dist"),
    devMiddleware: {
      publicPath: meta.basePath,
    },
    port: 9000,
  },
};
