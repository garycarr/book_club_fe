/* eslint-disable */
var webpackConfig = require('./webpack.config.js');
var _ = require('lodash');

_.merge(webpackConfig, {
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|tests)\//,
                loader: 'isparta'
            }
        ]
    },

    isparta: {
        embedSource: true,
        noAutoWrap: true,
        // these babel options will be passed only to isparta and not to babel-loader
        babel: {
            presets: ['es2015']
        }
    },

    // https://github.com/webpack/jade-loader/issues/8
    node: {
        fs: 'empty'
    }
});

module.exports = webpackConfig;
