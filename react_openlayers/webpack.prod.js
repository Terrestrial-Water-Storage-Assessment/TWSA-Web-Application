const path = require('path');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const buildPath = path.resolve(__dirname, '../web');

module.exports = {
    devtool: 'source-map',
    entry: ['elm-pep', './src/index.js'],
    output: {
        filename: '[name].[hash:20].js',
        path: buildPath
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env', '@babel/react']
                }
            },
            {
                test: /\.(scss|css|sass)$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            // translates CSS into CommonJS
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            // Runs compiled CSS through postcss for vendor prefixing
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            // compiles Sass to CSS
                            loader: 'sass-loader',
                            options: {
                                outputStyle: 'expanded',
                                sourceMap: true,
                                sourceMapContents: true
                            }
                        }
                    ],
                    fallback: 'style-loader'
                }),
            },
            {
                test: /\.less$/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            //modifyVars: CustomAntThemeModifyVars(),
                            javascriptEnabled: true // Less version > 3.0.0
                        }
                    }]
            },
            {
                test: /\.(svg|woff|woff2|ttf|eot|otf)([\?]?.*)$/,
                loader: 'file-loader?name=assets/fonts/[name].[ext]',
            },
            {
                // Load all images as base64 encoding if they are smaller than 8192 bytes
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[hash:20].[ext]',
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            favicon: './favicon.ico',
            // Inject the js bundle at the end of the body of the given template
            inject: 'body',
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns:['main*', 'style*', 'index.html'],
            verbose: true,
            dry: false
        }),
        new ExtractTextPlugin('styles.[md5:contenthash:hex:20].css', {
            allChunks: true
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                map: {
                    inline: false,
                },
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        })
    ]
};
