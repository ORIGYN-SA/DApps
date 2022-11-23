const webpack = require('../../../webpack.config')

const appConfig = {
  name: 'wallet',
  openPage: '-/bmdev/-/bm-1/-/wallet',
}

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig)
  return res
}
