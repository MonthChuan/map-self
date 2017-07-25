const initialState = {
  ffmap : null,
  plazaId : '', //1100314
//   plazalist : [],
  floor : [], //楼层店铺数据
  floorId : 1, //默认一楼
  floorMaxNum : 0, //为了拼新建商铺的ID
  floorName : 'F1', //为了拼新建商铺的ID
  floorData : null, //为了楼层控件
  popconfirmVisible : false,
  pageType : '',
  newLayers : [] //把每层楼新添加的layer收集起来，切换楼层的时候清理掉
};


function map(previousState = initialState, action) {
    switch(action.type) {
        case 'setPageInfo':
            return Object.assign({}, previousState, { 
                plazaId : action.id ,
                pageType : action.pageType
            });
        // case 'getPlazaList':
        //     return Object.assign({}, previousState, { plazalist : action.list });
        case 'addMap':
            return Object.assign({}, previousState, { ffmap : action.ffmap });
        case 'setFloorInfo':
            return Object.assign({}, previousState, action.info);
        case 'setConfirmShow':
            return Object.assign({}, previousState, {popconfirmVisible : action.data});
        case 'addNewLayers':
            if(action.data) {
                previousState.newLayers.push(action.data)
            }
            return Object.assign({}, previousState);
        case 'resetNewLayers':
            return Object.assign({}, previousState, action.data);
        case 'increaseMaxNum':
            previousState.floorMaxNum++;
            return Object.assign({}, previousState);
        default:
            return previousState;
    }
}

export default map;