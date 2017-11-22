/* eslint-disable */
let webpackConfig = require('./webpack.config.js');
let _ = require('lodash');

_.merge(webpackConfig, {
    module: {
        rules: [
        ]
    },

    // https://github.com/webpack/jade-loader/issues/8
    node: {
        fs: 'empty'
    }
});

module.exports = webpackConfig;
