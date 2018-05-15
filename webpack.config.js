const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const SriPlugin = require('webpack-subresource-integrity')
const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-first-webpack.bundle.js',
        crossOriginLoading: 'anonymous',
        publicPath: './'
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' }
        ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: require('./vendor.json')
        }),
        new HtmlWebpackPlugin({template: './src/index.ejs'}),
        // When toggling the SRIPlugin or the AddAssetHtmlPlugin, the build will break. 
        // We need the SRI for adding the Integrity key on our script
        // We need the AddAssetHtmlPlugin for adding our vendor file to the scripts.
        // The comibination will cause an error in the SRI plugin stating it cannot grab "publicPath of undefined", 
        // undefined is caused by the argument is an unfinished Promise, over here:
        //      SubresourceIntegrityPlugin.beforeHtmlGeneration
        //      [webpack-test]/[webpack-subresource-integrity]/index.js:271:44
  
        new AddAssetHtmlPlugin({
            filepath: './dist/vendor.js',
            includeSourcemap: false
        }),
        new SriPlugin({
            hashFuncNames: ['sha256', 'sha384'],
            enabled: true
        })
    ]    
};