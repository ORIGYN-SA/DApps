const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

const repoRoot = path.join(process.cwd());
const monorepoRoot = '../../../';

const asset_entry = repoRoot + '/src/index.tsx';
const publicPath = monorepoRoot + 'public';

module.exports = (env, argv, dAppConfig) => ({
  target: 'web',
  mode: argv.mode || 'production',
  entry: {
    index: asset_entry,
  },
  devtool: argv.mode ? 'source-map' : false,
  optimization: {
    minimize: !argv.mode,
    minimizer: [new TerserPlugin()],
  },
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')],
  },

  resolve: {
    modules: [path.join(__dirname, 'node_modules'), path.join(repoRoot, 'node_modules')],
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    alias: {
      react: path.join(__dirname, 'node_modules/react'),
    },
    fallback: {
      fs: false,
      path: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  output: {
    filename: dAppConfig?.name ? `${dAppConfig?.name}.js` : 'index.js',
    path: path.join(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
            cacheDirectory: true,
            envName: argv.mode || 'production',
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2|png|jpg)$/,
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new Dotenv({
      path: process.env.DOTENV_PATH || './.env',
    }),
    new HtmlWebpackPlugin(
      argv?.mode === 'development'
        ? {
            template: path.resolve(publicPath, 'index.html'),
            inject: 'body',
            publicPath: `/`,
          }
        : {
            template: path.resolve(publicPath, 'index.html'),
            filename: dAppConfig?.name ? `${dAppConfig?.name}.html` : 'index.html',
            inject: 'body',
          },
    ),
    new HtmlInlineScriptPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      typescript: {
        configFile: '../../../tsconfig.json',
      },
    }),
  ],
  // proxy /api to port 8000 during development
  devServer: {
    hot: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './'),
    watchContentBase: true,
    open: true,
    disableHostCheck: true,
    openPage: dAppConfig?.openPage ? dAppConfig.openPage : '-/baycdev/-/bayc-1/-/',
  },
});
