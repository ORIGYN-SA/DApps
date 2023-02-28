const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'data',
  openPage: '-/bmdev/-/bm-1/-/data',
};
module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  return res;
};
