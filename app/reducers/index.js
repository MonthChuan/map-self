import { combineReducers } from 'redux';

// import toolsReducers from './toolsReducers';
import control from './controlReducers';
import map from './mapReducers';
import store from './storeReducers';

const editorReducers = combineReducers({
  control,
  map,
  store
});


export default editorReducers;