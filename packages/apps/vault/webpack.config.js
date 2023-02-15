const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'vault',
  openPage: '-/mludz-biaaa-aaaal-qbhwa-cai/-/brainstem-hippocampus-diencephalon/-/vault',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  return res;
};
