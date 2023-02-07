const webpack = require("../../../webpack.config");

const appConfig = {
  name: 'claiming',
}

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  return res;
};
