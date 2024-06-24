import { Component } from "./base-component.js";
import { Task, TaskStatus } from "../models/project.js";
import { taskState } from "../state/task-state.js";
import { TaskItem } from "./task-item.js";

export class TaskList extends Component<HTMLDivElement, HTMLElement>{

    assignedTasks: Task[]

    constructor(private type: 'active' | 'finished') {
        super('task-list', 'app', false, `${type}-tasks`)

        this.assignedTasks = [];
        this.configure();
        this.renderContent();
        
    }

    

    configure() {
        taskState.addListener((tasks: Task[]) => {
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
    

          private renderTasks() {
            const listEl = document.getElementById(
              `${this.type}-tasks-list`
            )! as HTMLUListElement;
            listEl.innerHTML = '';
            for (const taskItem of this.assignedTasks) {
                new TaskItem(this.element.querySelector('ul')!.id, taskItem);
            }
          }
    

    renderContent() {
        const listId = `${this.type}-tasks-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' TASKS'

    }

    
}
