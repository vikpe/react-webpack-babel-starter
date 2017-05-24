const webpack         = require("webpack");
const {resolve}       = require("path");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
                test: /\.css$/,
                use:  ["style-loader", "css-loader?modules", "postcss-loader",],
            },
            {
                test:    /\.scss$/,
                loaders: ["style-loader", "css-loader?modules", "postcss-loader", "sass-loader"]
            },
            {
                test:    /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false'
                ]
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            { test: /\.jade$/, loader: 'jade-loader' }
        ],
    },

    plugins:     [
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
            name: ['vendor', 'manifest'] // Specify the common bundle's name.
        })

    ],
    performance: {
        hints: false
    }
};
