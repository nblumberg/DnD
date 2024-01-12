// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

module.exports = (outputDirName) => {
  return {
    entry: {
      main: "./src/js/index.ts",
    },
    output: {
      filename: "index.js",
      libraryTarget: "umd",
      path: path.resolve(outputDirName, path.join("dist", "js")),
    },
    devtool: "source-map",
    devServer: {
      open: true,
      host: "localhost",
    },
    plugins: [
      // Add your plugins here
      // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    mode: process.env.NODE_ENV == "production" ? "production" : "development",
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          loader: "ts-loader",
          exclude: ["/node_modules/"],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: "asset",
        },
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: "defaults" }]],
              plugins: ["babel-plugin-styled-components"],
            },
          },
        },

        // Add your rules for custom modules here
        // Learn more about loaders from https://webpack.js.org/loaders/
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
      fallback: {},
    },
  };
};
