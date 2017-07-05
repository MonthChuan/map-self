export const AciontCommand = () => {
    this.data = [];
}

AciontCommand.prototype = {
    initial(data = []) {
        this.data = data.slice(0);
    },
    execute(arg = []) {
        return arg.concat(this.data);
    },
    undo() {
        return this.data;
    }
}