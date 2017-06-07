const rules = {
    ts : {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
    },
    reactJs:{
        test:    /\.(js|jsx)$/,
        use:     ["babel-loader"],
        exclude: /node_modules/
    }
}

module.exports = rules;