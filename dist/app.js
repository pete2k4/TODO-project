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
    updateTask(id, title, description, deadline) {
        const newTitle = title;
        const newDescription = description;
        const newDeadline = deadline;
        const task = this.tasks.find(task => task.id === id);
        task.title = newTitle;
        task.description = newDescription;
        task.deadline = newDeadline;
        for (const listenerFn of this.listeners) {
            listenerFn(this.tasks.slice());
        }
    }
    deleteTask(id) {
        this.tasks.splice(this.tasks.findIndex((element) => element.id === id), 1);
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
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.minDate != null && validatableInput.value !== "") {
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
        this.taskEdit = null;
        this.task = task;
        this.configure();
        this.renderContent();
    }
    configure() {
        const checkbox = this.element.querySelector('#checkbox');
        checkbox.addEventListener('change', this.checkboxChangeHandler);
        const editBtn = this.element.querySelector('#edit');
        editBtn.addEventListener('click', this.editClickHandler);
        const deleteBtn = this.element.querySelector('#delete');
        deleteBtn.addEventListener('click', this.deleteItem);
    }
    deleteItem() {
        taskState.deleteTask(this.task.id);
    }
    editClickHandler() {
        this.taskEdit = new TaskEdit(this.task);
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
        this.task.deadline
            ? this.element.querySelector('#deadline').textContent = "Must be done until: " + new Date(this.task.deadline)
            : this.element.querySelector('#deadline').textContent = "";
        const checkbox = this.element.querySelector('#checkbox');
        checkbox.checked = this.task.status === TaskStatus.Finished;
    }
}
__decorate([
    autobind
], TaskItem.prototype, "deleteItem", null);
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
    gatherUserInput(enteredTitle, enteredDescription, enteredDeadline) {
        const titleValidatable = {
            value: enteredTitle,
            required: true,
            minLength: 1,
        };
        const descriptionValidatable = {
            value: enteredDescription,
            required: false,
            minLength: 0
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
            console.log(deadlineValidatable.value);
        }
        else {
            return [enteredTitle, enteredDescription, enteredDeadline];
        }
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput(this.titleInputElement.value, this.descriptionInputElement.value, this.deadlineInputElement.value);
        if (Array.isArray(userInput)) {
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
        super('edit-task', 'app', false);
        this.task = task;
        this.modal = document.getElementById('edit-modal');
        this.backdrop = document.getElementById('backdrop');
        this.titleInputElement = document.getElementById('titleEdit');
        this.titleInputElement.value = this.task.title;
        this.descriptionInputElement = document.getElementById('descriptionEdit');
        this.descriptionInputElement.value = this.task.description;
        this.deadlineInputElement = document.getElementById('deadlineEdit');
        this.deadlineInputElement.value = this.task.deadline;
        this.configure();
        this.renderContent();
    }
    configure() {
        this.modal.addEventListener('submit', this.editHandler);
    }
    renderContent() {
        this.showModal();
        this.cancelBtn();
        this.outsideClick();
    }
    showBackdrop() {
        if (!this.backdrop.classList.contains('visible')) {
            this.backdrop.classList.add('visible');
        }
    }
    closeBackdrop() {
        if (this.backdrop.classList.contains('visible')) {
            this.backdrop.classList.remove('visible');
        }
    }
    showModal() {
        if (!this.modal.classList.contains('visible')) {
            this.modal.classList.add('visible');
            this.showBackdrop();
        }
    }
    editHandler(event) {
        event.preventDefault();
        const userInput = task.gatherUserInput(this.titleInputElement.value, this.descriptionInputElement.value, this.deadlineInputElement.value);
        if (Array.isArray(userInput)) {
            const [enteredTitle, description, deadline] = userInput;
            taskState.updateTask(this.task.id, enteredTitle, description, deadline);
            this.closeModal();
        }
    }
    closeModal() {
        if (this.modal.classList.contains('visible')) {
            this.modal.remove();
            const cancel = document.getElementById('cancel-edit');
            cancel === null || cancel === void 0 ? void 0 : cancel.removeEventListener('click', this.closeModal);
        }
        this.closeBackdrop();
    }
    cancelBtn() {
        const cancel = document.getElementById('cancel-edit');
        cancel.addEventListener('click', this.closeModal);
    }
    outsideClick() {
        this.backdrop.addEventListener('click', this.closeModal);
    }
}
__decorate([
    autobind
], TaskEdit.prototype, "showBackdrop", null);
__decorate([
    autobind
], TaskEdit.prototype, "closeBackdrop", null);
__decorate([
    autobind
], TaskEdit.prototype, "editHandler", null);
__decorate([
    autobind
], TaskEdit.prototype, "closeModal", null);
__decorate([
    autobind
], TaskEdit.prototype, "outsideClick", null);
const task = new TaskInput();
const activeTaskList = new TaskList('active');
const finishedTaskList = new TaskList('finished');
//# sourceMappingURL=app.js.map