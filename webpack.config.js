const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
    mode: 'production',
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            use: ['babel-loader', 'eslint-loader'],
            exclude: /node_modules/
          },
        ]
    },
    plugins: [
      new UglifyJSPlugin({
        sourceMap: true,
      }),
    ]
};

module.exports = config;