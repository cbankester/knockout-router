// This module helps us with the configuration data
var path = require('path');
var webpack = require('webpack');

// Configuration data
module.exports = {
    entry: './src/knockout-router.js',
    output: {
        path: __dirname,
        filename: 'index.js'
    },
    // allow modules listed in the bower_components folder to be loaded
    resolve: {
      root: [ path.join(__dirname, 'bower_components') ]
    },
    plugins: [
      // use the `main` key of modules' bower.json to determine the files to load
      new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ],
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', query: {compact: false} }
        ]
    }
};
