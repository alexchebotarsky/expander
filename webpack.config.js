const webpack = require('webpack');
const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const banner = `
/**!
 * @link https://github.com/goodleby/expander
 * @version 0.0.2
 */
`;

module.exports = (env = {}, argv) => {
  const defaults = {
    sourcemap: {
      development: 'source-map',
    },
    usehash: {
      production: false,
    },
    chunking: {
      production: false,
    },
  };
  const options = {};
  Object.keys(defaults).forEach(
    (key) => (options[key] = env[key] || defaults[key][argv.mode] || false)
  );
  return {
    entry: {
      'jquery.expander': './src/index.js',
    },
    output: {
      filename:
        '[name]' +
        (options.usehash ? '_[contenthash:6]' : '') +
        (argv.mode === 'production' ? '.min' : '') +
        '.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new CleanWebpackPlugin(),
      // new HtmlWebpackPlugin({template: path.resolve(__dirname, './src/index.html')}),
      new MiniCssExtractPlugin({
        filename:
          '[name]' +
          (options.usehash ? '_[contenthash:6]' : '') +
          (argv.mode === 'production' ? '.min' : '') +
          '.css',
      }),
      new webpack.BannerPlugin({
        banner: banner,
        raw: true,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(js|ts)$/i,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i, use: ['file-loader']},
        {
          test: /\.(css|sass|scss)$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: true,
              },
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: options.sourcemap,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  plugins: () => {
                    const plugins = [require('postcss-preset-env')()];
                    if (argv.mode === 'production') plugins.push(require('cssnano'));
                    return plugins;
                  },
                },
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    mode: argv.mode || 'production',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    devtool: options.sourcemap,
    devServer: {
      contentBase: './dist',
      hot: true,
    },
    optimization: options.chunking
      ? {
          runtimeChunk: 'single',
          moduleIds: 'hashed',
          splitChunks: {
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'modules',
                chunks: 'all',
              },
            },
          },
        }
      : {},
  };
};
