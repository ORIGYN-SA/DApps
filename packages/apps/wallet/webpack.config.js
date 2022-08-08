const webpack = require('../../../webpack.config')
const APP_NAME = 'wallet'

module.exports = (env, argv) => {
  const res = webpack(env, argv, APP_NAME)
  return res
}
