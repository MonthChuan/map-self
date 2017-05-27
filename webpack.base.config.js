var path = require('path');
 
export default function() {
  const ASSETS_LIMIT = 5000;
  return {
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {presets: ['es2015', 'react'] }
        },
        {
          test: /\.css$/, 
          // exclude: /node_modules/,
          loader: 'style!css?sourceMap'
        }
      ]
    },
    resolve: {
      extensions: ['','.js', '.jsx'],
    }
  }
};