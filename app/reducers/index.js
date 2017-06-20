import { combineReducers } from 'redux';

import toolsReducers from './toolsReducers';

const editorReducers = combineReducers({
  startEdit
});


function startEdit (previousState, action) {
  console.log('start edit');
  return {};
}


export default editorReducers;