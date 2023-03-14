const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'ledger',
  open: '-/brain-matters-dev/collection/-/ledger',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  res.output.publicPath = '/';
  return res;
};
