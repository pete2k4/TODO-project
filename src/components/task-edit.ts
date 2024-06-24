import { Component } from "./base-component.js";
import { Task } from "../models/project.js";
import { autobind } from "../decorators/autobind.js";
import { TaskInput } from "./task-input.js";
import { taskState } from "../state/task-state.js";

export class TaskEdit extends Component<HTMLDListElement, HTMLFormElement> {    
    private task: Task;
    private modal: HTMLDivElement;
    private backdrop: HTMLDivElement;

    private titleInputElement: HTMLInputElement;
    private descriptionInputElement: HTMLInputElement;
    private deadlineInputElement: HTMLInputElement;

    constructor(task: Task) {
        super('edit-task', 'app', false);
        this.task = task;
        this.modal = document.getElementById('edit-modal') as HTMLDivElement;
        this.backdrop = document.getElementById('backdrop') as HTMLDivElement;
        
        this.titleInputElement = document.getElementById('titleEdit') as HTMLInputElement;
        this.titleInputElement.value = this.task.title;
        this.descriptionInputElement = document.getElementById('descriptionEdit') as HTMLInputElement;
        this.descriptionInputElement.value = this.task.description;        
        this.deadlineInputElement = document.getElementById('deadlineEdit') as HTMLInputElement;
        this.deadlineInputElement.value = this.task.deadline;

        this.configure();
        this.renderContent();
    }

    configure() {
        this.modal.addEventListener('submit', this.editHandler);
        const cancelBtn = document.getElementById('cancel-edit');
        cancelBtn?.addEventListener('click', this.closeModal);
        this.backdrop.addEventListener('click', this.closeModal);
    }

    renderContent() {
        this.showModal();
    }

    @autobind
    private showBackdrop() {
        this.backdrop.classList.add('visible');
    }

    @autobind
    private closeBackdrop() {
        this.backdrop.classList.remove('visible');
    }

    @autobind
    public showModal() {
        if (!this.modal.classList.contains('visible')) {
            this.modal.classList.add('visible')
            this.showBackdrop()
        }
    }

    @autobind
    public closeModal() {
        if (this.modal.classList.contains('visible')) {
            this.modal.remove();
            const cancel = document.getElementById('cancel-edit');
            cancel?.removeEventListener('click', this.closeModal);

        }
        this.closeBackdrop();
    }

    @autobind
    private editHandler(event: Event) {
        event.preventDefault(); // Prevent default form submission behavior
        const userInput = TaskInput.gatherUserInput(this.titleInputElement.value, this.descriptionInputElement.value, this.deadlineInputElement.value); // Access gatherUserInput from TaskInput     
        
        if (Array.isArray(userInput)) {
            const [enteredTitle, description, deadline] = userInput
            taskState.updateTask(this.task.id, enteredTitle, description, deadline)
            this.closeModal()
        }
        
    }
}