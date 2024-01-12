const nodeExternals = require("webpack-node-externals");
const base = require("./webpack.config.base.cjs");

module.exports = (outputDirName) => {
  const config = { ...base(outputDirName) };

  config.node = {
    global: true,
    __filename: true,
    __dirname: true,
  };

  config.target = "async-node18.7";
  config.externals = [nodeExternals()];

  return config;
};
