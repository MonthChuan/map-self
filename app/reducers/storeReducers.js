const initialState = {
    store : [], //最后提交的时候
    bkStore : [], //取消操作数据备份
    curStore : [], //当前处理的store
    catgory : [], //业态数据
    actionCommand : [] //修改的历史记录
};

function store(previousState = initialState, action) {
    switch(action.type) {
        case 'setStore':
            return Object.assign({}, previousState, action.data);
        case 'resetStore':
            if(action.data.store) {
                for(let i = 0, len = action.data.store.length; i < len; i++) {
                    const item = action.data.store[len - i -1];
                    if(previousState.store.indexOf(item) < 0) {
                        previousState.store.unshift(item);
                    }
                }
                action.data.store = previousState.store;
            }
            return Object.assign({}, previousState, action.data);
        case 'getStoreCatgory':
            return Object.assign({}, previousState, {catgory : action.catgory});
        default:
            return previousState;
    }
}

export default store;