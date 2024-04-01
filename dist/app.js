"use strict";
class Task {
    constructor() {
        this.templateElement = document.getElementById("task-input");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.deadlineInputElement = this.element.querySelector('#deadline');
        this.configure();
    }
    submitHandler(event) {
        event.preventDefault();
        console.log(this);
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }
}
const task = new Task();
console.log('test');
//# sourceMappingURL=app.js.map