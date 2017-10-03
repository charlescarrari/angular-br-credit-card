const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

const uglify = new UglifyJSPlugin({
    test: /\.js$/,
    exclude: /node_modules/,
    minimize:true,
    parallel: {
        cache: true,
        workers: 4 // for e.g
    }
});

const ngAnnotate = new ngAnnotatePlugin({
        add: true,
    });
    
module.exports = {
    entry: './test/test.module.js',
    output: {
        path: __dirname + '/test',
        filename: 'card.bundle.js',
    },
    module: {
        loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        },
        { test: /\.html$/, loader: "html" },
        { test: /\.css$/, loader: "style!css" }
      ]
    },
    plugins: [        
        ngAnnotate,
        // uglify,
    ],
    // watch:true,
    devtool: "#inline-source-map"
}