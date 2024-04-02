"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["Active"] = 0] = "Active";
    TaskStatus[TaskStatus["Finished"] = 1] = "Finished";
})(TaskStatus || (TaskStatus = {}));
class Task {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class TaskState {
    constructor() {
        this.listeners = [];
        this.tasks = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new TaskState();
        return this.instance;
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    addTask(title, description, deadline) {
        const newTask = new Task(Math.random().toString(), title, description, deadline, TaskStatus.Active);
        this.tasks.push(newTask);
        for (const listenerFn of this.listeners) {
            listenerFn(this.tasks.slice());
        }
    }
}
const projectState = TaskState.getInstance();
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length > validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
class TaskList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById('task-list');
        this.hostElement = document.getElementById('app');
        this.assignedTasks = [];
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-tasks`;
        projectState.addListener((tasks) => {
            this.assignedTasks = tasks;
            this.renderTasks();
        });
        this.hostElement.insertAdjacentElement('beforeend', this.element);
        this.renderContent();
    }
    renderTasks() {
        const listEl = document.getElementById(`${this.type}-tasks-list`);
        for (const taskItem of this.assignedTasks) {
            const listItem = document.createElement('li');
            listItem.textContent = taskItem.title;
            listEl.appendChild(listItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-tasks-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' TASKS';
    }
}
class TaskInput {
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
    clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.deadlineInputElement.value = '';
    }
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredDeadline = this.deadlineInputElement.value;
        const titleValidatable = {
            value: enteredTitle,
            required: false,
        };
        const descriptionValidatable = {
            value: enteredDescription,
            required: true,
            minLength: 2
        };
        const deadlineValidatable = {
            value: enteredDeadline,
            required: true,
            min: 1
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(deadlineValidatable)) {
            alert('Invalid data!');
        }
        else {
            return [enteredTitle, enteredDescription, +enteredDeadline];
        }
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            console.log(userInput);
            const [enteredTitle, description, people] = userInput;
            projectState.addTask(enteredTitle, description, people);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
}
__decorate([
    autobind
], TaskInput.prototype, "submitHandler", null);
const task = new TaskInput();
const activeTaskList = new TaskList('active');
const finishedTaskList = new TaskList('finished');
//# sourceMappingURL=app.js.map