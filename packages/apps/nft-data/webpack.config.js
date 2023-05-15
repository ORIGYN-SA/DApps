const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'data',
  open: '-/dytv5-jaaaa-aaaal-qbgtq-cai/collection/-/data',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  res.output.publicPath = '/';
  return res;
};
