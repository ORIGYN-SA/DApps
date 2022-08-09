/* const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

console.log(process.env.NODE_ENV, process.mode);

const asset_entry = path.join("src", "index.tsx");
const publicPath = path.join("public");

module.exports  = (env, argv) => ({
  target: "web",
  mode: argv.mode || "production",
  entry: {
    index: path.join(__dirname, asset_entry),
  },
  devtool: argv.mode ? "source-map" : false,
  optimization: {
    minimize: !argv.mode,
    minimizer: [new TerserPlugin()],
  },
  resolveLoader: {
    modules: [path.join(__dirname, "node_modules")],
  },

  resolve: {
    modules: [path.join(__dirname, "node_modules")],
    extensions: [".js", ".ts", ".jsx", ".tsx"],
  },
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist"),
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            envName: argv.mode || "production",
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2|png|jpg)$/,
        loader: require.resolve("file-loader"),
        options: {
          name: "static/media/[name].[hash:8].[ext]",
        },
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: process.env.DOTENV_PATH || "./.env",
    }),
    new HtmlWebpackPlugin(argv?.mode === "development" ? {
      template: path.resolve(publicPath, "index.html"),
      inject: "body",
      publicPath: "/"
    } : {
      template: path.resolve(publicPath, "index.html"),
      inject: "body",
    }),
    new HtmlInlineScriptPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
  ],
  // proxy /api to port 8000 during development
  devServer: {
    hot: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "./"),
    watchContentBase: true,
    open: true,
    disableHostCheck: true,
    openPage: "-/nftforgood_uffc/-/ogy.nftforgood_uffc.1/wallet",
  },
});
 */

const webpack = require('../../../webpack.config')

const appConfig = {
  name: 'nftData',
  openPage: '-/baycdev/-/bayc-1/-/nftData',
}
module.exports = (env, argv) => {
  const res = webpack(env, argv, appConfig)
  return res
}