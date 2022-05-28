const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { NODE_ENV, HOST, PORT } = process.env;
const isDev = NODE_ENV === 'development';
const mode = isDev ? 'development' : 'production';
const host = HOST || 'localhost';
const port = PORT || 3000;

module.exports = {
    mode,
    entry: {
        index: path.join(__dirname, 'src', 'index.js'),
        search: path.join(__dirname, 'src', 'search.js'),
        basket: path.join(__dirname, 'src', 'basket.js')
    },
    output: {
        path: isDev ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'build'),
        filename: "js/[name].js",
        clean: true
    },
    devServer: {
        historyApiFallback: true,
        compress: true,
        host,
        port,
        hot: true,
        devMiddleware: {
            writeToDisk: true,
        }
    },
    module: {
        rules: [
            {
                test: /\.s?([ca])ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "/",
                        },
                    },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: 'img/[name][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style/[name].css'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            filename: "index.html",
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'basket.html'),
            filename: "basket.html",
            chunks: ['basket']
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'search.html'),
            filename: "search.html",
            chunks: ['search']
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "public", to: "/" },
            ],
        }),
    ],
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src')
        }
    }
};
