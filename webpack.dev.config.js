/**
 * 跑起来, 其实就是跑某一个example
 */

import getBaseConfig from './webpack.base.config';
import path from 'path';
import webpack from 'webpack';

export default function getDevConfig() {
  const config = getBaseConfig();
  // const TEMP_DIR = path.resolve(__dirname, './temp');
  
  config.plugins = [
        new webpack.HotModuleReplacementPlugin()//热模块替换插件
    ];
  config.entry = [
        'webpack/hot/dev-server',
        path.resolve(__dirname, './app/index.js')
    ];
  config.output = {
      path: path.resolve(__dirname, './build'),
      filename: 'bundle.js',
  };
  return config;
}