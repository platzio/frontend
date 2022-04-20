/* eslint-disable @typescript-eslint/no-var-requires */
const process = require('process')

const { PLATZ_BACKEND = 'http://127.0.0.1:3000' } = process.env

module.exports = {
  devServer: {
    https: true,
    compress: true,
    proxy: {
      '^/api': {
        target: PLATZ_BACKEND,
      },
    },
  },
}
