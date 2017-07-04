import { Modal } from 'antd'; 

export const noCurStore = (list) => {
    if(list.length < 1) {
        Modal.warning({
            title : '提示',
            content : '没有可操作的对象，请先选择！'
        });
        return false;
    }
    return true;
}