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
    constructor(id, title, description, deadline, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.status = status;
        console.log('check task');
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class TaskState extends State {
    constructor() {
        super();
        this.tasks = [];
        console.log('check taskstate');
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new TaskState();
        return this.instance;
    }
    addTask(title, description, deadline) {
        const newTask = new Task(Math.random().toString(), title, description, deadline, TaskStatus.Active);
        this.tasks.push(newTask);
        for (const listenerFn of this.listeners) {
            listenerFn(this.tasks.slice());
        }
    }
    updateTaskStatus(taskId, newStatus) {
        const taskToUpdate = this.tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            taskToUpdate.status = newStatus;
            for (const listenerFn of this.listeners) {
                listenerFn(this.tasks.slice());
            }
        }
    }
}
const taskState = TaskState.getInstance();
function validate(validatableInput) {
    let isValid = true;
    console.log('check validate');
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length > validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
    }
    if (validatableInput.minDate != null && typeof validatableInput.value === 'string') {
        const inputDate = new Date(validatableInput.value);
        const currentDate = new Date(validatableInput.minDate);
        isValid = isValid && inputDate > currentDate;
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
class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        console.log('check component');
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtBeginning) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
    }
}
class TaskItem extends Component {
    constructor(hostId, task) {
        super('single-task', hostId, false, task.id);
        console.log('check taskitem');
        this.task = task;
        this.configure();
        this.renderContent();
    }
    configure() {
        const checkbox = this.element.querySelector('#checkbox');
        checkbox.addEventListener('change', this.checkboxChangeHandler);
        const editBtn = this.element.querySelector('#edit');
        editBtn.addEventListener('click', this.editClickHandler);
    }
    editClickHandler() {
        const taskEdit = new TaskEdit(this.task);
    }
    checkboxChangeHandler(event) {
        const checkbox = event.target;
        if (checkbox.checked) {
            taskState.updateTaskStatus(this.task.id, TaskStatus.Finished);
        }
        else {
            taskState.updateTaskStatus(this.task.id, TaskStatus.Active);
        }
    }
    renderContent() {
        this.element.querySelector('#title').textContent = this.task.title;
        this.element.querySelector('#description').textContent = this.task.description;
        this.element.querySelector('#deadline').textContent = "Must be done until: " + new Date(this.task.deadline);
        const checkbox = this.element.querySelector('#checkbox');
        checkbox.checked = this.task.status === TaskStatus.Finished;
    }
}
__decorate([
    autobind
], TaskItem.prototype, "editClickHandler", null);
__decorate([
    autobind
], TaskItem.prototype, "checkboxChangeHandler", null);
class TaskList extends Component {
    constructor(type) {
        super('task-list', 'app', false, `${type}-tasks`);
        this.type = type;
        this.assignedTasks = [];
        this.configure();
        this.renderContent();
    }
    configure() {
        taskState.addListener((tasks) => {
            const relevantProjects = tasks.filter(task => {
                if (this.type === 'active') {
                    return task.status === TaskStatus.Active;
                }
                return task.status === TaskStatus.Finished;
            });
            this.assignedTasks = relevantProjects;
            this.renderTasks();
        });
    }
    renderTasks() {
        const listEl = document.getElementById(`${this.type}-tasks-list`);
        listEl.innerHTML = '';
        for (const taskItem of this.assignedTasks) {
            new TaskItem(this.element.querySelector('ul').id, taskItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-tasks-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' TASKS';
    }
}
class TaskInput extends Component {
    constructor() {
        super('task-input', 'app', true, 'user-input');
        console.log('check taskinput');
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.deadlineInputElement = this.element.querySelector('#deadline');
        this.configure();
    }
    renderContent() {
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
            required: true,
        };
        const descriptionValidatable = {
            value: enteredDescription,
            required: false,
            minLength: 2
        };
        const deadlineValidatable = {
            value: enteredDeadline,
            required: false,
            minDate: Date.now()
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(deadlineValidatable)) {
            alert('Invalid data!');
        }
        else {
            return [enteredTitle, enteredDescription, enteredDeadline];
        }
    }
    submitHandler(event) {
        event.preventDefault();
        console.log('teeeeest');
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            console.log(userInput);
            const [enteredTitle, description, deadline] = userInput;
            taskState.addTask(enteredTitle, description, deadline);
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
class TaskEdit extends Component {
    constructor(task) {
        super('edit-task', 'task-list', false);
        console.log('taskedit');
        this.task = task;
        this.configure();
    }
    editHandler(event) {
        event.preventDefault();
    }
    configure() {
        console.log(task);
    }
    renderContent() {
    }
}
__decorate([
    autobind
], TaskEdit.prototype, "editHandler", null);
const task = new TaskInput();
const activeTaskList = new TaskList('active');
const finishedTaskList = new TaskList('finished');
//# sourceMappingURL=app.js.map