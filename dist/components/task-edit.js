var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./base-component.js";
import { autobind } from "../decorators/autobind.js";
import { TaskInput } from "./task-input.js";
import { taskState } from "../state/task-state.js";
export class TaskEdit extends Component {
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
        const cancelBtn = document.getElementById('cancel-edit');
        cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', this.closeModal);
        this.backdrop.addEventListener('click', this.closeModal);
    }
    renderContent() {
        this.showModal();
    }
    showBackdrop() {
        this.backdrop.classList.add('visible');
    }
    closeBackdrop() {
        this.backdrop.classList.remove('visible');
    }
    showModal() {
        if (!this.modal.classList.contains('visible')) {
            this.modal.classList.add('visible');
            this.showBackdrop();
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
    editHandler(event) {
        event.preventDefault();
        const userInput = TaskInput.gatherUserInput(this.titleInputElement.value, this.descriptionInputElement.value, this.deadlineInputElement.value);
        if (Array.isArray(userInput)) {
            const [enteredTitle, description, deadline] = userInput;
            taskState.updateTask(this.task.id, enteredTitle, description, deadline);
            this.closeModal();
        }
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
], TaskEdit.prototype, "showModal", null);
__decorate([
    autobind
], TaskEdit.prototype, "closeModal", null);
__decorate([
    autobind
], TaskEdit.prototype, "editHandler", null);
//# sourceMappingURL=task-edit.js.map