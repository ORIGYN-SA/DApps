const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'marketplace',
  openPage: '-/-/mludz-biaaa-aaaal-qbhwa-cai/-/brainstem-hippocampus-diencephalon/-/marketplace',
};
module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  return res;
};
