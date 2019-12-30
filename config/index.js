'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const process = require('process')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      "/auth/api/v1/**": {
        target: "https://app.dev-wazzup24.com/",
        secure: false,
        // pathRewrite: {"^/auth/api/v1/" : ""},
        changeOrigin: true
      },
      "/api/v1/**": {
        target: "https://new74478752.dev-wazzup24.com/",
        secure: false,
        // pathRewrite: {"^/auth/api/v1/" : ""},
        changeOrigin: true
      },
      "/api/backend": {
        target: "https://dev-backend.wazzup24.com/",
        secure: false,
        pathRewrite: {"^/api/backend" : ""},
        changeOrigin: true
      },
      "/production/api/auth": {
        target: "https://app.wazzup24.com/",
        secure: false,
        pathRewrite: {"^/production/api/auth" : ""},
        changeOrigin: true
      },
      "/production/api/backend": {
        target: "https://app.wazzup24.com/",
        secure: false,
        pathRewrite: {"^/production/api/backend" : ""},
        changeOrigin: true
      }
    },

    // Various Dev Server settings
    host: '127.0.0.1', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    disableHostCheck: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },
  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: !!process.env.IS_DEV,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: process.env.IS_DEV ? '#source-map' : false,

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
