const webpack = require('../../../webpack.config')

const appConfig = {
  name: 'library',
  openPage: '-/bmdev/-/bm-1/-/library',
}

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig)
  return res
}
