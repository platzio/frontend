const process = require('process')

const { PLATZ_BACKEND = 'http://127.0.0.1:3000' } = process.env

module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: PLATZ_BACKEND,
      },
    },
  },
}
