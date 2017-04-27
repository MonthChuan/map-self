import webpack from 'webpack';
import distConfig from '../webpack.dist.config';


webpack(distConfig, (err, state) => {
  if (err) {
    console.log(err);
    throw err;
  } else {
    console.log('deploy completed');
  }
});