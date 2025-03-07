/* eslint-disable */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => {
  return {
    mode: env.mode ?? 'development',
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'index.html') }),
      new webpack.ProgressPlugin(),
    ],
    module: {
      rules: [
        { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
        },
      ]
    },
    devServer: {
      open: true,
    }
  }
}