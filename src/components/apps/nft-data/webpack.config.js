const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'data',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  res.output.publicPath = '/';
  return res;
};
