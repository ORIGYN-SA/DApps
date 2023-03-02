const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'vault',
  openPage: '-/brain-matters-dev/collection/-/vault',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  res.output.publicPath = '/';
  return res;
};
