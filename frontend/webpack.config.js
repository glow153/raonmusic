const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require('webpack');

module.exports = (env, argv) => {
  const prod = argv.mode === "production";
  
  return {
    mode: prod ? "production" : "development",
    devtool: prod ? "hidden-source-map" : "eval",
    entry: "./src/index.tsx",
    output: {
      path: path.join(__dirname, "/dist"),
      filename: "[name].js",
      publicPath: "/",
    },
    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
      rules: [
        { test: /\.tsx?$/, use: ["babel-loader", "ts-loader"] },
        { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
        { test: /\.svg$/, use: ['@svgr/webpack'] },
        {
          test: /\.(jpg|png|ico)$/,
          loader: "file-loader",
          options: {
            publicPath: "./",
            name: "[name].[ext]"
          }
        }
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        React: "react",
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        minify: process.env.NODE_ENV === 'production' ? {
          collapseWhitespace: true, // 빈칸 제거
          removeComments: true, // 주석 제거
        } : false,
        favicon: "./public/favicon.svg"
      }),
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          {from: 'public/css', to: 'css'},
          {from: 'public/fonts', to: 'fonts'},
          {from: 'public/img', to: 'img'},
        ]
      }),
    ],
  }
};



