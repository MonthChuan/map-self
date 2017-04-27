import getBaseConfig from './webpack.base.config';
import webpack from 'webpack';
// import ExtractTextPlugin from "extract-text-webpack-plugin";
import path from 'path';

const config = getBaseConfig();
const BUILD_DIR = path.resolve(__dirname, './dist');

// const plugins = [];
// plugins.push(new ExtractTextPlugin({ filename: 'fmap.css', disable: false, allChunks: true}));
// plugins.push(new webpack.optimize.DedupePlugin());
// plugins.push(new webpack.optimize.UglifyJsPlugin({compress: { warnings: true}, sourceMap: true, minimize: true}));
// config.plugins = plugins;

config.entry = path.resolve(__dirname, './app/index.js');
config.output = {
  publicPath: '',
  filename: 'editor.js',
  path: BUILD_DIR,
  libraryTarget: 'umd'
};

export default config;