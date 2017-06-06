const ExtractTextPlugin = require('extract-text-webpack-plugin');


const rules = {
        // ...
        css:{
          test: /\.css$/,
          use:  ["style-loader", "css-loader?modules", "postcss-loader",],
        },
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
        cssExtractTextPlugin:{
                  test: /\.css$/,
                  exclude: /node_modules/,
                  use: ExtractTextPlugin.extract({
                      fallback: 'style-loader',

                      // Could also be write as follow:
                      // use: 'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
                      use: [
                          {
                              loader: 'css-loader',
                              query: {
                                  modules: true,
                                  localIdentName: '[name]__[local]___[hash:base64:5]'
                              }
                          },
                          'postcss-loader'
                      ]
                  }),
        },
        scssExtractTextPlugin:{
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',

                    // Could also be write as follow:
                    // use: 'css-loader?modules&importLoader=2&sourceMap&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                modules: true,
                                sourceMap: true,
                                importLoaders: 2,
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            }
                        },
                        'sass-loader'
                    ]
                }),
        }

  // ...
}

exports.rules = rules;
exports.ExtractTextPlugin = new ExtractTextPlugin("style.css");