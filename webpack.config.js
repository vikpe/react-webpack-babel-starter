const webpack         = require("webpack");
const {resolve}       = require("path");
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".jsx"],
    },
    entry:   [
        "react-hot-loader/patch", // activate HMR for React
        "webpack-dev-server/client?http://localhost:8080",// bundle the client for webpack-dev-server and connect to the provided endpoint
        "webpack/hot/only-dev-server", // bundle the client for hot reloading, only- means to only hot reload for successful updates
        "./index.js" // the entry point of our app
    ],
    output:  {
        filename:   "bundle.js", // the output bundle
        path:       resolve(__dirname, "public"),
        publicPath: "/" // necessary for HMR to know where to load the hot update chunks
    },

    context: resolve(__dirname, "src"),
    devtool: "inline-source-map",

    devServer: {
        hot:         true, // enable HMR on the server
        contentBase: resolve(__dirname, "public"), // match the output path
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
            }
        ],
    },

    plugins:     [
        new StyleLintPlugin(),
        new webpack.HotModuleReplacementPlugin(), // enable HMR globally
        new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates

    ],
    externals:   {
        "react":     "React",
        "react-dom": "ReactDOM"
    },
    performance: {
        hints: false
    }
};
