import { combineReducers } from 'redux';

// import toolsReducers from './toolsReducers';
import control from './controlReducers';
import map from './mapReducers';
import store from './storeReducers';
import user from './userReducers';

const editorReducers = combineReducers({
  control,
  map,
  store,
  user
});


export default editorReducers;