const webpack         = require("webpack");
const {resolve}       = require("path");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const FileListPlugin = require('./plugins/FileListPlugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const styles = require('./rules/stylesRules');
var stylesRules = styles.rules;

module.exports = {
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".jsx", ".tsx", ".ts"],
    },
    entry:   {
        main: "./index.js", // the entry point of our app
        vendor: ['react', 'react-dom']
    },
    output:  {
        filename: '[name].[chunkhash].js',
        path:       resolve(__dirname, "../public"),
        publicPath: "/" // necessary for HMR to know where to load the hot update chunks
    },

    context: resolve(__dirname, "../src"),
    devtool: "inline-source-map",

    devServer: {
        hot:         true, // enable HMR on the server
        contentBase: resolve(__dirname, "../public"), // match the output path
        publicPath:  "/" // match the output `publicPath`
    },

    module: {
        rules: [
            {
                test:    /\.(js|jsx)$/,
                use:     ["babel-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            { 
                test: /\.jade$/, 
                loader: 'jade-loader' 
            },
            //stylesRules.bakStyle,
            stylesRules.fonts,
            stylesRules.cssExtractTextPlugin,
            stylesRules.scssExtractTextPlugin
        ],
    },

    plugins:     [
        new FileListPlugin({options: true}),
        new StyleLintPlugin(),
        //new webpack.HotModuleReplacementPlugin(), // enable HMR globally
        new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
        new HtmlWebpackPlugin({
            filename: 'index.html',
            favicon: resolve(__dirname, "../src/jade") +  '/favicon.ico',
            template: resolve(__dirname, "../src/jade") + '/template.jade',
            title: 'Jade demo'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'chunks', // Specify the common bundle's name.
            filename: `chunks-[chunkhash].js`,
        }),
        new WebpackShellPlugin({onBuildStart:['echo "Webpack Start"'], onBuildEnd:['echo "Webpack End"']}),
        // 
        styles.ExtractTextPlugin
    ],
    performance: {
        hints: false
    }
};
