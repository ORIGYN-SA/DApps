const webpack = require("../../../webpack.config");

const appConfig = {
  name: 'template',
  openPage: '',
}

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  return res;
};
