const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  context: process.cwd(),
  entry: {
      vendor: [
        'jquery'
    ]
  },
  output: {
    filename: 'vendor.js',
    library: 'vendor'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: './[name].json'
    }),
    new UglifyJsPlugin({
      sourceMap: true
    })
  ]
}
