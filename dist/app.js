"use strict";
class Task {
    constructor() {
        this.templateElement = document.getElementById("task-input");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
const task = new Task();
console.log('test');
//# sourceMappingURL=app.js.map