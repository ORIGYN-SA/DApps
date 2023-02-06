const webpack = require('../../../webpack.config');

const appConfig = {
  name: 'b2b-management',
  openPage: '',
};

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig);
  return res;
};
