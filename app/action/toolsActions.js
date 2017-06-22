import actionTypes from './actionTypes';


function addRegion() {
  return {
    type: actionTypes.ADD_REGION
  };
}


function editStart() {
  console.log('action')
  return {
    type : actionTypes.EDIT_START
  }
}