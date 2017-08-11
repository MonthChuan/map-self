import { Modal } from 'antd'; 

export const noCurStore = (list) => {
    if(list.length < 1) {
        Modal.warning({
            title : '提示',
            content : '没有可操作的对象！'
        });
        return false;
    }
    return true;
}

export const noCancelStore = (curlist, actionList, activeType) => {
    if((curlist.length < 1 || actionList.length < 1) && activeType == '') {
        Modal.warning({
            title : '提示',
            content : '没有可回退的操作！'
        });
        return false;
    }
    return true;
}