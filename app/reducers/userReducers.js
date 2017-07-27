const initialState = null;

function store(previousState = initialState, action) {
    switch(action.type) {
        case 'setUserInfo':
            return Object.assign({}, action.data, {password : ''});
        default:
            return previousState;
    }
}

export default store;