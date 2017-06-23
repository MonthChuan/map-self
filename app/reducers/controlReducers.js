import STATUS from '../config/status';

function control(previousState = STATUS.initial, action) {
    switch(action.type) {
        case 'setStatus':
            return Object.assign({}, previousState, action.status);
        default:
            return previousState;
    }
}

export default control;