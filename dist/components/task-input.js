var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./base-component.js";
import { validate } from "../util/validation.js";
import { autobind } from "../decorators/autobind.js";
import { taskState } from "../state/task-state.js";
export class TaskInput extends Component {
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
    static gatherUserInput(enteredTitle, enteredDescription, enteredDeadline) {
        const titleValidatable = {
            value: enteredTitle,
            required: true,
            minLength: 1,
            maxLength: 40
        };
        const descriptionValidatable = {
            value: enteredDescription,
            required: false,
            minLength: 0,
            maxLength: 150,
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
        const userInput = TaskInput.gatherUserInput(this.titleInputElement.value, this.descriptionInputElement.value, this.deadlineInputElement.value);
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
//# sourceMappingURL=task-input.js.map