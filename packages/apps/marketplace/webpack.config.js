const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'marketplace',
  open: '-/brain-matters-dev/collection/-/marketplace',
};
module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  res.output.publicPath = '/';
  return res;
};
