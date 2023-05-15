const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'marketplace',
  open: '-/dytv5-jaaaa-aaaal-qbgtq-cai/collection/-/marketplace',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  res.output.publicPath = '/';
  return res;
};
