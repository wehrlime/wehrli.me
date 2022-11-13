// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const isProduction = process.env.NODE_ENV == 'production'

const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader'

const config = {
  entry: ['./src/index.ts', './src/index.scss'],
  output: {
    path: path.resolve(__dirname, '../root'),
  },
  devServer: {
    hot: true,
    open: true,
    host: 'localhost',
    watchFiles: ['./src/index.html'],
    liveReload: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      favicon: path.resolve(__dirname, './src/favicon.ico'),
    }),
    new CopyPlugin({
      patterns: [{ from: './src/sitemap.xml', to: '../root/sitemap.xml' }],
      patterns: [{ from: './src/robots.txt', to: '../root/robots.txt' }],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
}

module.exports = () => {
  if (isProduction) {
    config.mode = 'production'

    config.plugins.push(new MiniCssExtractPlugin({}))
  } else {
    config.mode = 'development'
  }
  return config
}
