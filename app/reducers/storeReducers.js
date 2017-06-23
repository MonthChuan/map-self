const initialState = {
    store : [], //最后提交的时候
    bkStore : [] //取消操作数据备份
};

function store(previousState = initialState, action) {
    switch(action.type) {
        case 'editStart':
            return Object.assign({}, previousState, { status : action.status});
        case 'setStore':
            return Object.assign({}, previousState, {store : action.data});
        case 'setBKStore':
            return Object.assign({}, previousState, {bkStore : action.data});
        default:
            return previousState;
    }
}

export default store;