/**
 * AciontCommand用来记录每次操作
 */
let ActionCommand = function(oldData = {}) {
    this.oldData = Object.assign({}, oldData);
    this.id = oldData.id || '';
    this.newData = {};
}

ActionCommand.prototype = {
    execute(obj = {}) {
        // const keyList = Object.keys(obj);
        // keyList.map( item => {
        //     if(item != 'coordinates') {
        //         oldData[item] = store.feature.properties[item];
        //     }
        //     else {
        //         oldData[item] = store.feature.geometry.coordinates;
        //     }
        // });

        this.newData = obj;
    },
    undo() {
        return this.oldData;
    }
}

export default ActionCommand;