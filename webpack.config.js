const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist/static'),
        filename: 'bundle.js',
		publicPath: 'static/',
        chunkFilename: '[name].js'

    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
        extensions: [".js", ".json", ".jsx", ".css"],
        alias: {
            containers: path.resolve(__dirname, 'src/containers'),
            actions: path.resolve(__dirname, 'src/actions')
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(js|jsx)$/,

                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react'],
                    }
                },
                exclude: [
                    path.join(__dirname, '../node_modules')
                ]
            }
        ]
    },

    devtool: 'inline-source-map',
    devServer: {
        port: 3000,
        contentBase: './dist',
        compress: true,
        open: true,
        hot: true,
        historyApiFallback: true,
        proxy: {
            "/billing/api": {
                target: "http://localhost:8000",
                secure: false,
                timeout: 600000,
                changeOrigin: true
            }
        },
    },

    plugins: [
        // new HtmlWebpackPlugin({template: './public/index.html'}),
        new webpack.optimize.SplitChunksPlugin({
            chunks: "all",
            minSize: 20000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true
        }),
        new ExtractTextPlugin('style.css'),
        new webpack.DefinePlugin({
			'process.env': {
				// Useful to reduce the size of client-side libraries, e.g. react
				NODE_ENV: JSON.stringify('dev'),
                PUBLIC_URL: JSON.stringify('static')
			}
		}),

    ]
};
