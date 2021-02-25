const path = require("path");
const babiliPlugin = require("babili-webpack-plugin"); // minificador de js
const extractTextPlugin = require("extract-text-webpack-plugin"); // otimizador de imports de estilos
const optimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // minificador de css
const webpack = require("webpack");
const { config } = require("process");

let plugins = [];
plugins.push(new extractTextPlugin("styles.css"));
// importação do jQuery em contexto global
plugins.push(new webpack.ProvidePlugin({
  '$': 'jquery/dist/jquery.js',
  'jQuery': 'jquery/dist/jquery.js'
}))
if (process.env.NODE_ENV == "production") {
  plugins.push(new webpack.optimize.ModuleConcatenationPlugin()); // otimização de importação de módulos
  plugins.push(new babiliPlugin());
  plugins.push(new optimizeCSSAssetsPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {
      discardComments: {
        removeAll: true
      }
    },
    canPrint: true
  }));
}

module.exports = {
  entry: "./app-src/app.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "dist",
  },
  module: {
    rules: [
      { // regra de carregamento de scripts, menos do nome-modules
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      { // regra de carregamento de estilos de forma otimizada com extract-text-webpack-plugin
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: 'style-loader',
          use: "css-loader"
        })
      },
      { // regras de carregamento de arquivos comumente usados pelo bootstrap
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff",
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream",
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      },
    ],
  },
  plugins,
};
