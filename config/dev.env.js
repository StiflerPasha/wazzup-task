'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  port: 8080,
  NODE_ENV: '"development"'
})
