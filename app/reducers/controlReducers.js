const initialState = {
  isAdd : false,
  isEdit : false,
  isDelete : false,
  isMerge : false,
  isSubMerge : false,
  isZT : false,
  isStart : true,
  isActive : false,
  isSubmit : false
};


function control(previousState = initialState, action) {
    switch(action.type) {
        case 'setStatus':
            return Object.assign({}, previousState, action.status);
        // case 'STORE_CHANGE':
        //     return Object.assign({}, state, {store : action.data});
        default:
            return previousState;
    }
}

export default control;