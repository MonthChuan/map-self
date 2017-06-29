//将传入的store修改为normal状态
export const fixToNormal = (store) => {
    if(store.transform) {
        store.transform.enable({
            rotation: false,
            scaling : false
        });
    }

    if(store.dragging) {
        store.dragging.disable();
    }

    if(store.eachLayer) {
        store.eachLayer( i => {
            i.disableEdit();
        });
    }
    else {
        store.disableEdit();
    }
}