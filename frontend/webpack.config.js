const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const isProduction = process.env.NODE_ENV == 'production'
const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader'

const getAllFiles = (dir) =>
  fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file)
    const isDirectory = fs.statSync(name).isDirectory()
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
  }, [])

let pages = getAllFiles('./src/pages/').map((path) =>
  path.replace('.html', '').replace('src\\pages\\', '')
)
let pageHtmls = pages.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/pages/${name}.html`,
    filename: `./pages/${name}.html`,
    inject: false,
    minify: {
      removeComments: false,
    },
  })
})

let includes = getAllFiles('./src/includes/').map((path) =>
  path.replace('.html', '').replace('src\\includes\\', '')
)
let includeHtmls = includes.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/includes/${name}.html`,
    filename: `./includes/${name}.html`,
    inject: false,
    minify: {
      removeComments: false,
    },
  })
})

const config = {
  entry: ['./src/index.ts', './src/index.scss'],
  output: {
    path: path.resolve(__dirname, '../root'),
    filename: '[name].[fullhash].js',
    clean: true,
    publicPath: '/',
    assetModuleFilename: 'res/[name][ext]',
  },
  devServer: {
    hot: true,
    open: true,
    host: 'www.wehrli.me',
    watchFiles: ['./src/index.html'],
    liveReload: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      favicon: path.resolve(__dirname, './src/favicon.ico'),
      minify: true,
    }),
    ...includeHtmls,
    ...pageHtmls,
    new CopyPlugin({
      patterns: [
        { from: './src/robots.txt', to: './robots.txt' },
        { from: './src/static', to: './res/static' },
        { from: './src/favicon.png', to: './favicon.png' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash].css',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|gif|webp)$/i,
        type: 'asset/resource',
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
  } else {
    config.mode = 'development'
  }
  return config
}
