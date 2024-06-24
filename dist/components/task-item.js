var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./base-component.js";
import { TaskEdit } from "./task-edit.js";
import { autobind } from "../decorators/autobind.js";
import { taskState } from "../state/task-state.js";
import { TaskStatus } from "../models/project.js";
export class TaskItem extends Component {
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
//# sourceMappingURL=task-item.js.map