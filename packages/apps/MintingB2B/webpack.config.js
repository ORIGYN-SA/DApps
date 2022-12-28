const webpack = require('../../../webpack.config')

const appConfig = {
  name: 'vault',
  openPage: '-/bmdev/-/bm-1/-/vault',
}

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig)
  return res
}
