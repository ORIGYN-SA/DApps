const webpack = require('../../../webpack.config');

module.exports = (env, argv) => {
  const res = webpack(env, argv);
  return res;
};
