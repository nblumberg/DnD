const baseConfigs = require("../../webpack.config.both.cjs");

module.exports = baseConfigs.map((base) => {
  const config = { ...base(__dirname) };
  return config;
});
