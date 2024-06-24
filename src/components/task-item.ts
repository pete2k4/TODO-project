import { Component } from "./base-component.js";
import { Task } from "../models/project.js";
import { TaskEdit } from "./task-edit.js";
import { autobind } from "../decorators/autobind.js";
import { taskState } from "../state/task-state.js";
import { TaskStatus } from "../models/project.js";


export class TaskItem extends Component<HTMLUListElement, HTMLLIElement> {
    private task: Task;
    private taskEdit: TaskEdit | null = null
  
    constructor(hostId: string, task: Task) {
        super('single-task', hostId, false, task.id)

        this.task = task
    
        this.configure()
        this.renderContent()
    }
  
    configure() {
        const checkbox = this.element.querySelector('#checkbox') as HTMLInputElement;
        checkbox.addEventListener('change', this.checkboxChangeHandler);

        const editBtn = this.element.querySelector('#edit') as HTMLButtonElement;
        editBtn.addEventListener('click', this.editClickHandler);

        const deleteBtn = this.element.querySelector('#delete') as HTMLButtonElement
        deleteBtn.addEventListener('click', this.deleteItem)
    }

    @autobind
    private deleteItem() {
        taskState.deleteTask(this.task.id)
    }

    @autobind
    private editClickHandler() {
        this.taskEdit = new TaskEdit(this.task);

    }

    @autobind
    private checkboxChangeHandler(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            taskState.updateTaskStatus(this.task.id, TaskStatus.Finished);
        } else {
            taskState.updateTaskStatus(this.task.id, TaskStatus.Active);
        }
    }

    
  
    renderContent() {
        this.element.querySelector('#title')!.textContent = this.task.title
        this.element.querySelector('#description')!.textContent = this.task.description
        this.task.deadline  
        ? this.element.querySelector('#deadline')!.textContent = "Must be done until: " + new Date(this.task.deadline)
        : this.element.querySelector('#deadline')!.textContent = ""
        const checkbox = this.element.querySelector('#checkbox') as HTMLInputElement;
        checkbox.checked = this.task.status === TaskStatus.Finished;
  
    }



    
  }