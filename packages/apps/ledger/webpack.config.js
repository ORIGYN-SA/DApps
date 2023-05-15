const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'ledger',
  open: '-/dytv5-jaaaa-aaaal-qbgtq-cai/collection/-/ledger',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  res.output.publicPath = '/';
  return res;
};
