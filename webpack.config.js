const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: [path.join(__dirname, 'public/src/index.jsx')],

    output: {
        filename: 'build.js',
        path: path.join(__dirname, '/public/dist')
    },

    resolve: {
        modules: [
          path.resolve(__dirname, 'public/'),
          path.resolve(__dirname, 'node_modules/'),
        ],
        descriptionFiles: ['package.json'],
        extensions: ['.js', '.jsx', '*']
      },

    module:{
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env', '@babel/react'],
                    plugins: ['@babel/plugin-transform-runtime', "@babel/plugin-proposal-class-properties"],
                }
            },
            {
                test: /\.(sass|scss|css)$/, //Check for sass or scss file names
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            }
        ]
 }
 }