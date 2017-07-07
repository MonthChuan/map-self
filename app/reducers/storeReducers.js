const initialState = {
    store : [], //最后提交的时候
    bkStore : [], //取消操作数据备份
    curStore : [], //当前处理的store
    catgory : [], //业态数据
    actionCommand : [] //修改的历史记录
};

function store(previousState = initialState, action) {
    switch(action.type) {
        case 'editStart':
            return Object.assign({}, previousState, { status : action.status});
        // case 'setStore':
        //     if(action.data.store) {
        //         action.data.store = action.data.store.concat(previousState.store);
        //     }
        //     return Object.assign({}, previousState, action.data);
        case 'resetStore':
            return Object.assign({}, previousState, action.data);
        case 'getStoreCatgory':
            return Object.assign({}, previousState, {catgory : action.catgory});
        default:
            return previousState;
    }
}

export default store;