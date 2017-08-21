/**
 * 跑某一个例子
 */

import webpack from 'webpack';
import getDevConfig from '../webpack.dev.config';
import WebpackDevServer from 'webpack-dev-server';


const config = getDevConfig();

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
  // contentBase: './temp',
  inline: true,
  hot: true,
  stats: {
    colors: true
  },
  port : 3001
  ,
  proxy: {
    '/mapeditor': {
      target: 'http://yunjin.intra.sit.ffan.com/',
      changeOrigin: true,
      headers:{
        Cookie: 'uuid=253110'
      }
    }
  }
});

server.listen(8081);
