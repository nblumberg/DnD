const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const base = require("./webpack.config.base.cjs");

const stylesHandler = MiniCssExtractPlugin.loader;

module.exports = (outputDirName) => {
  const config = { ...base(outputDirName) };

  config.entry = {
    ...config.entry,
    "service-worker": "./src/js/service-worker.ts",
  };

  config.plugins = [
    ...config.plugins,
    new HtmlWebpackPlugin({
      template: "./src/html/index.html",
    }),
    new MiniCssExtractPlugin(),
  ];
  if (config.mode === "production") {
    // Generate a service worker file for you and add it to the webpack asset pipeline
    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  }

  config.module = { ...config.module };
  config.module.rules = [
    {
      test: /\.css$/i,
      use: [stylesHandler, "css-loader"],
    },
    {
      test: /\.s[ac]ss$/i,
      use: [stylesHandler, "css-loader", "sass-loader"],
    },
    ...config.module.rules,
  ];

  config.node = false;

  config.target = "web";

  return config;
};
