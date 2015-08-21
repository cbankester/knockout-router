// Karma configuration
// Generated on Fri Aug 14 2015 11:29:35 GMT-0500 (CDT)
var path = require('path');
var webpack = require('webpack');

module.exports = function configureKarma(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/knockout/dist/knockout.js',
      'test/**/*-test.js'
    ],
    client: {
      mocha: {
        reporter: 'html' // change Karma's debug.html to the mocha web reporter
      }
    },


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*-test.js': ['webpack']
    },
    webpack: {
      // allow modules listed in the bower_components and src folders to be loaded
      resolve: {
        root: [
          path.join(__dirname, 'bower_components'),
          path.join(__dirname, 'src')
        ]
      },
      plugins: [
        // use the `main` key of modules' bower.json to determine the files to load
        new webpack.ResolverPlugin(
          new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
      ],
      module: {
        loaders: [
          {test: /\.js$/, loader: 'babel-loader', query: {compact: false}}
        ]
      },
      devTool: 'inline-source-map'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,
    webpackMiddleware: {
      noInfo: true
    },
    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-chai-sinon',
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-webpack'
    ]
  });
};
