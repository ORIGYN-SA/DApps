const webpack = require('../../../webpack.config')

const appConfig = {
  name: 'ledger',
  openPage: '-/baycdev/-/bayc-1/-/ledger',
}

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig)
  return res
}
