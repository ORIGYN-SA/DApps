const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'vault',
  open: '-/dytv5-jaaaa-aaaal-qbgtq-cai/collection/-/vault',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  res.output.publicPath = '/';
  return res;
};
