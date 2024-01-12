const base = require("./webpack.config.base.cjs");
const node = require("./webpack.config.node.cjs");

module.exports = [
  // web
  (outputDirName) => {
    const config = { ...base(outputDirName) };
    config.node = false;
    config.target = "web";
    return config;
  },
  // node
  (outputDirName) => {
    const config = { ...node(outputDirName) };
    config.output = { ...config.output, filename: "index.node.js" };
    return config;
  },
];
