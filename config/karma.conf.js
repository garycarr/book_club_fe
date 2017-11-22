module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'sinon'],

        // list of files / patterns to load in the browser
        files: [
            {
                pattern: '**/tests/**/*.spec.js'
                // watched: false,
                // included: true,
                // served: true
            }
        ],
        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // '**/tests/**/*.spec.js': ['webpack', 'sourcemap']
            '**/tests/**/*.spec.js': ['webpack', 'sourcemap']
            // 'app/javascript/**/*.js': ['coverage', 'webpack']
        },

        coverageReporter: {
            dir: 'reports/coverage',
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'text', subdir: '.', file: 'coverage.txt' },
                { type: 'cobertura', subdir: '.', file: 'coverage.xml' }
            ]
        },

        reporters: ['spec', 'coverage'],

        logLevel: config.LOG_WARN,

        plugins: [
            'karma-coverage',
            'karma-jquery',
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-phantomjs-shim',
            'karma-spec-reporter',
            'karma-sinon',
            'karma-sourcemap-loader',
            'karma-webpack'
        ],

        webpack: require('./webpack.config.karma.js'),

        webpackMiddleware: {
            // noInfo: true
        },

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
