const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

let titlePage = 'CPNV - Horaire ouverture Magasin'


let config = {

    entry: './src/index.js',

    output:{
        filename : 'js/main.js',
		path: path.resolve(__dirname, './public'),
        assetModuleFilename: 'images/[name][ext]',
        publicPath: '/',
    },
    resolve: {
		extensions: ['.js', '.jsx', '.png', '.jpg', '.mp4', '.gif'],
        alias:{
            "@" : path.resolve("./src/"),
            "@css" : path.resolve("./src/style/"),
            "@images": path.resolve("./src/images/"),
            "@videos": path.resolve("./src/videos/"),
        }
    },
    module : {
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use:{
                    loader : 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    {loader : 'style-loader'},
                    {loader : 'css-loader'},
                ]
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(mp4|webm|ogv|avi|ogg)$/i,
                type: 'asset/resource',
            },
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "[id].css"
        }),
        new ESLintPlugin({}),
        // Load .env file for environment variables in JS
        new Dotenv({
            path: "./.env"
        }),
    ]
}

module.exports = (env, args) =>{
    config.mode = args.mode

    if (args.mode === 'development'){
        config.devtool = 'inline-source-map',

        config.devServer ={
            static:{
                directory: path.resolve("./src")
            },
            client:{
                logging: 'warn',
                overlay : true
            },
            historyApiFallback : true,
            compress : true,
            port: 8080,
        },
        config.plugins.push(
            new BundleAnalyzerPlugin({
                openAnalyzer : false,
                defaultSizes :'gzip'
            }),
            new HtmlWebpackPlugin({
                template : './src/index.html', 
                title : titlePage + " DEV", 
                minify : false
            }),
        )
    }

    if(args.mode === 'production'){
        config.devtool = false
        config.watch = false
        config.plugins.push(
            new BundleAnalyzerPlugin({
                openAnalyzer : false,
                defaultSizes :'gzip',
                analyzerMode : 'static'
            }),
            new HtmlWebpackPlugin({
                template : './src/index.html', 
                title : titlePage, 
                minify : true
            }),
        )
    }

    return config;
}
