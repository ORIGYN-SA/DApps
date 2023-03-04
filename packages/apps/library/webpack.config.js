const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'library',
  openPage: '-/brain-matters-dev/collection/-/library',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  res.output.publicPath = '/';
  return res;
};
