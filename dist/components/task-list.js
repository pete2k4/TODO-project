import { Component } from "./base-component.js";
import { TaskStatus } from "../models/project.js";
import { taskState } from "../state/task-state.js";
import { TaskItem } from "./task-item.js";
export class TaskList extends Component {
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
//# sourceMappingURL=task-list.js.map