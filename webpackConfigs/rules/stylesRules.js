

const rules = {
  // ...
  scss: {
    test: /\.scss$/,
    loaders: ["style-loader", "css-loader", "sass-loader"],
    //exclude: path.resolve(__dirname, 'src/app')
  },
  fonts: {
    test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
    loader: 'file-loader?name=fonts/[name].[ext]'
  },
  bakStyle:{
    test:    /\.scss$/,
    loaders: ["style-loader", "css-loader?modules", "postcss-loader", "sass-loader"]
  },
  bakFonts:{
                test:    /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false'
                ]
            },
  // ...
}

module.exports = rules;