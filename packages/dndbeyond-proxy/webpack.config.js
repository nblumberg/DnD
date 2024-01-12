const base = require("../../webpack.config.node.cjs");

module.exports = () => {
  const config = { ...base(__dirname) };
  return config;
};
