const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'library',
  openPage: '-/mludz-biaaa-aaaal-qbhwa-cai/-/brainstem-hippocampus-diencephalon/-/library',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  return res;
};
