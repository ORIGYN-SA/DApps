const webpack = require('../../../webpack.config')

const appConfig = {
  name: 'marketplace',
  openPage: '-/-/bmdev/-/bm-1/-/marketplace',
}
module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig)
  return res
}
