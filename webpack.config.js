var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  //watch: true,
  output: {
      path: './dist',
      filename: 'bundle.js',
        sourceMapFilename: '[file].map'
   },
   module: {
      preLoaders: [
        {
            test: /^src\/.*\.js$/,
            exclude: ["node_modules","dist"],
            loader: "jshint-loader"
        }
    ],
    loaders: [
      // the url-loader uses DataUrls.
      // the file-loader emits files.
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff', path: './dist' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream', path: './dist' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file', path: './dist' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml', path: './dist' },
      { test: /\.hbs$/, loader: "handlebars-loader" }
    ]
   },
   plugins: [
     // TODO handlebars!
    new HtmlWebpackPlugin({
      title: 'Chess Squad',
      template: './src/game/templates/game.ejs'
    }),
    new CleanWebpackPlugin(['dist'], {
      verbose: false, 
      dry: false
    })
   ]
};