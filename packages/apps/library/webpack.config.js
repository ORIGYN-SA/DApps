const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'library',
  open: '-/dytv5-jaaaa-aaaal-qbgtq-cai/collection/-/library',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  res.output.publicPath = '/';
  return res;
};
