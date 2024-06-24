import { Task } from "../models/project.js";
import { TaskStatus } from "../models/project.js";
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class TaskState extends State {
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
export const taskState = TaskState.getInstance();
//# sourceMappingURL=task-state.js.map