//将传入的store修改为normal状态
export const fixToNormal = (store) => {
    // if(store.transform) {
    //     store.transform.enable({
    //         rotation: false,
    //         scaling : false
    //     });
    // }

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

export const cancelDraw = (store) => {
    if(store._proxy && store._proxy.editor.map.editTools) {
        store._proxy.editor.map.editTools.stopDrawing();
    }
    
    if(store.graphics) {
        store.graphics.remove();
    }
    else {
        if(store.transform) {
        store.transform.disable();
        }
        store.remove();
    }

    if(store.label) {
        store.label.remove();
    }
}

export const deleteStore = (store) => {
    if(store.graphics) {
        store.graphics.remove();
    }
    else {
        store.remove();
    }
    
    if(store.label) {
        store.label.remove();
    }
}