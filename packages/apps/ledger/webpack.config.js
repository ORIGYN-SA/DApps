const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'ledger',
  openPage: '-/mludz-biaaa-aaaal-qbhwa-cai/-/brainstem-hippocampus-diencephalon/-/ledger',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  return res;
};
