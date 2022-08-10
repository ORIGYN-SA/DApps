const webpack = require('../../../webpack.config')

const appConfig = {
  name: 'library',
  openPage: '-/baycdev/-/bayc-1/-/library',
}

module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig)
  return res
}
