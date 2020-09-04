'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost/tp5/public/index.php/yyb2019/index/"',
  IMG_URL: '"/static/"',
  QRC_URL: '"/static/qrcode/"',
  IRIS: '"test"'
})
