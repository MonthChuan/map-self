/**
 * AciontCommand用来记录每次操作
 */
let AciontCommand = () => {
    // this.data = data;
    // this.newData = data;
}

AciontCommand.prototype = {
    oldData : {},
    newData : {}, 
    execute(store, obj = {}) {
        const keyList = Object.keys(obj);
        keyList.map( item => {
            if(item != 'coordinates') {
                oldData[item] = store.feature.properties[item];
            }
            else {
                oldData[item] = store.feature.geometry.coordinates;
            }
        });

        this.newData = obj;
    },
    undo() {
        return this.oldData;
    }
}


export default AciontCommand;