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
  port : 8080
  // ,
  // proxy: {
  //   '/beacon': {
  //     target: 'http://imap.sit.ffan.com/',
  //     changeOrigin: true,
  //     headers:{
  //       Cookie: 'FFAN_OPEN_SSO=c54fX0FcLl9kDQ8pcLx4i6zl8SSJdTrVEbtXCDywCb6sRJFvyYqwO9en9UI0m%2BzqdpqZL8eZ6JmZdMdaxZS32J6p57GBXFUZ%2BAhIMrUscewxehl4ULOV3NE1oipx3AhML%2F2KnPyuM4ROgKswEYYbXUs3Sc19Wc6PMoSXY9IQVw%2BTFSJnxGp8SAJKr1uwMYPm5rjTepieCSQKJoOlwq2pm4%2BQ3mWLzJ9oaXIiX8HNTGE69GOTS9TVd4%2FovABFwEay3RBGKUQTG%2FB2u0aN1xPI65Ai85LTGwFcfyDhGNL1E6nfPJifu94Hajt2pbSPbl0lC1Tt8hHX3rbvJtfMqjgpg9cebAklg8y4a7I8qhEk'
  //     }
  //   },
  //   '/poi': {
  //     target: 'http://imap.sit.ffan.com/',
  //     changeOrigin: true,
  //     headers:{
  //       Cookie: 'FFAN_OPEN_SSO=c54fX0FcLl9kDQ8pcLx4i6zl8SSJdTrVEbtXCDywCb6sRJFvyYqwO9en9UI0m%2BzqdpqZL8eZ6JmZdMdaxZS32J6p57GBXFUZ%2BAhIMrUscewxehl4ULOV3NE1oipx3AhML%2F2KnPyuM4ROgKswEYYbXUs3Sc19Wc6PMoSXY9IQVw%2BTFSJnxGp8SAJKr1uwMYPm5rjTepieCSQKJoOlwq2pm4%2BQ3mWLzJ9oaXIiX8HNTGE69GOTS9TVd4%2FovABFwEay3RBGKUQTG%2FB2u0aN1xPI65Ai85LTGwFcfyDhGNL1E6nfPJifu94Hajt2pbSPbl0lC1Tt8hHX3rbvJtfMqjgpg9cebAklg8y4a7I8qhEk'
  //     }
  //   }
  // }
});

server.listen(8080);
