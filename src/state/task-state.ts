import { Task } from "../models/project.js"
import { TaskStatus } from "../models/project.js"
type Listener<T> = (items: T[]) => void

class State<T> {
  protected listeners: Listener<T>[] = []

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn)
  }
}

export class TaskState extends State<Task> {
    private tasks: Task[] = []
    private static instance: TaskState

    private constructor(){
        super()

    }

    static getInstance() {
        if (this.instance) {
            return this.instance
        }
        this.instance = new TaskState()
        return this.instance
    }

    addTask(title: string, description: string, deadline: string) {
        const newTask = new Task(Math.random().toString(), title, description, deadline, TaskStatus.Active)
        this.tasks.push(newTask)
        for(const listenerFn of this.listeners) {
            listenerFn(this.tasks.slice())
        }
    }

    updateTask(id: string, title: string, description: string, deadline: string) {
        const newTitle = title
        const newDescription = description
        const newDeadline = deadline

        const task = this.tasks.find(task => task.id === id)
        task!.title = newTitle
        task!.description = newDescription
        task!.deadline = newDeadline

        for(const listenerFn of this.listeners) {
            listenerFn(this.tasks.slice())
        }
    }

    deleteTask(id: string) {
        this.tasks.splice(this.tasks.findIndex((element) => element.id === id), 1)
        for(const listenerFn of this.listeners) {
            listenerFn(this.tasks.slice())
        }
    }

    updateTaskStatus(taskId: string, newStatus: TaskStatus) {
        const taskToUpdate = this.tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            taskToUpdate.status = newStatus;
            for (const listenerFn of this.listeners) {
                listenerFn(this.tasks.slice()); // Update listeners with the updated tasks array
            }
        }
    }
}

export const taskState = TaskState.getInstance()
