const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'nftData',
  openPage: '-/bmdev/-/bm-1/-/nftData',
};
module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  return res;
};
