const initialState = {
  ffmap : null,
  plazaId : '', //1100314
//   plazalist : [],
  floor : [], //楼层店铺数据
  floorId : 1, //默认一楼
  floorMaxNum : 0, //为了拼新建商铺的ID
  floorName : 'F1', //为了拼新建商铺的ID
  popconfirmVisible : false
};


function map(previousState = initialState, action) {
    switch(action.type) {
        case 'setPlazaId':
            return Object.assign({}, previousState, { plazaId : action.id });
        // case 'getPlazaList':
        //     return Object.assign({}, previousState, { plazalist : action.list });
        case 'addMap':
            return Object.assign({}, previousState, { ffmap : action.ffmap });
        case 'setFloorInfo':
            return Object.assign({}, previousState, action.info);
        case 'setConfirmShow':
            return Object.assign({}, previousState, {popconfirmVisible : action.data});
        case 'increaseMaxNum':
            previousState.floorMaxNum++;
            return Object.assign({}, previousState);
        default:
            return previousState;
    }
}

export default map;