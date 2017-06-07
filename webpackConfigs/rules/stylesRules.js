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

module.exports = rules;