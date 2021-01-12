// https://cli.vuejs.org/config/#vue-config-js
// eslint-disable-next-line
const webpack = require('webpack');

module.exports = {
  publicPath: process.env.BASE_URL || './',
  outputDir: 'dist',
  devServer: {
    port: 3517,
    disableHostCheck: true,
    https: true,
  },
  configureWebpack: {
    entry: {
      crm: './src/crm.js',
    },
    module: {
      rules: [
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'raw-loader',
        },
        {
          test: /\.ya?ml$/,
          use: ['json-loader', 'yaml-loader'],
          include: __dirname,
          exclude: /(node_modules)/,
        },
      ],
    },
    output: {
      filename: '[name].js',
    },
    optimization: {
      splitChunks: false,
    },
  },
  css: {
    extract: {
      filename: '[name].css',
    },
  },
};
