/* eslint-disable */
let dirName = __dirname;
let path = require('path');
require('dotenv').config();

let context = path.join(__dirname, '..');

module.exports = {

    context: context,

    entry: path.join(context, '/app/javascript/index.js'),

    // TODO - get rid of the url path
    output: {
        path: path.join(context, '/dist/'),
        filename: 'bundle.js',
        publicPath: '/'
    },

    devtool: 'sourcemap',

    module: {
        rules: [
            // Preloader to check the files before babel-loader has transformed them
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: /node_modules/
            },
            {
                test: /\.hbs$/,
                enforce: 'pre',
                loader: 'handlebars-loader'
            },
            {
                // Transpiles the javascript files for ES2015 use on browsers
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules\/)/,
                query: {
                    presets: ['es2015']
                }
            }
        ],
        loaders: [
            {
                test: /\.css$/,
                enforce: 'pre',
                loader: 'style!css'
            },
        ]
    },

    devServer: {
        // historyApiFallback: true,
        port: process.env.PORT_APP,
        inline: true,
        proxy: {
             '/api': {
                 target: process.env.API_PROXY_PROTOCOL +
                        process.env.API_PROXY_HOST +
                        (process.env.API_PROXY_PORT ? ':' + process.env.API_PROXY_PORT : '') +
                        process.env.API_PROXY_PATH,

                pathRewrite: {
                    '^/api' : ''
                },
            },
        },
    }
};
