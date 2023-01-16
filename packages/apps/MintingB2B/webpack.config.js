const webpack = require('../../../webpack.config')

const appConfig = {
  name: 'mintingB2B',
  openPage: '',
}

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig)
  return res
}
