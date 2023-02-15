const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'data',
  openPage: '-/mludz-biaaa-aaaal-qbhwa-cai/-/brainstem-hippocampus-diencephalon/-/data',
};
module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  return res;
};
