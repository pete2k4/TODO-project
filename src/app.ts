enum TaskStatus {
    Active,
    Finished
}

class Task {
    constructor(
        public id: string, 
        public title:string, 
        public description: string, 
        public people: number, 
        public status: TaskStatus) {
    }
}

type Listener = (items: Task[]) => void

class TaskState {
    private listeners: Listener[] = []
    private tasks: Task[] = []
    private static instance: TaskState

    private constructor(){}

    static getInstance() {
        if (this.instance) {
            return this.instance
        }
        this.instance = new TaskState()
        return this.instance
    }

    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn)
    }

    addTask(title: string, description: string, deadline: number) {
        const newTask = new Task(Math.random().toString(), title, description, deadline, TaskStatus.Active)
        this.tasks.push(newTask)
        for(const listenerFn of this.listeners) {
            listenerFn(this.tasks.slice())
        }
    }
}

const projectState = TaskState.getInstance()

type Validatable = {
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

function validate(validatableInput: Validatable) {
    //true by default, until it unmeets any criteria
    let isValid = true

    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }

    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length > validatableInput.minLength
    }

    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length < validatableInput.maxLength
    }

    if (validatableInput.min != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value >= validatableInput.min
    }

    if (validatableInput.max != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value <= validatableInput.max
    }

    return isValid
}

//autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value//submit handler
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor
}

class TaskList {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLElement
    assignedTasks: Task[]

    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById('task-list')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement
        this.assignedTasks = []

        const importedNode = document.importNode(this.templateElement.content, true)

        this.element = importedNode.firstElementChild as HTMLElement
        this.element.id = `${this.type}-tasks`

        projectState.addListener((tasks: Task[]) => {
            const relevantTasks = tasks.filter( task => {
                if (this.type === 'active') {
                    return task.status === TaskStatus.Active
                }
                return task.status === TaskStatus.Finished
            })
            this.assignedTasks = relevantTasks
            this.renderTasks()
        })

        this.hostElement.insertAdjacentElement('beforeend', this.element)
        this.renderContent()
    }

    renderTasks() {
        const listEl = document.getElementById(`${this.type}-tasks-list`) as HTMLLIElement
        listEl.innerHTML = ''
        for (const taskItem of this.assignedTasks) {
            const listItem = document.createElement('li')
            listItem.textContent = taskItem.title
            listEl.appendChild(listItem)
        }
    }
    

    private renderContent() {
        const listId = `${this.type}-tasks-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' TASKS'

    }

    
}

class TaskInput {
    //atached elements
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement //the form itself

    //input gotten from form
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    deadlineInputElement: HTMLInputElement

    constructor() {
        this.templateElement = document.getElementById("task-input")! as HTMLTemplateElement
        this.hostElement = document.getElementById("app")! as HTMLDivElement

        //copie templateElement (forma) ca dupa sa fie atasat la host (div app)
        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement
        //atasarea formei (element) la host (div app)
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
        //this.element.id = 'user-input' (daca voi avea nevoie de id-uri)

        //containing form inputs in Task class
        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement
        this.deadlineInputElement = this.element.querySelector('#deadline')! as HTMLInputElement

        this.configure()
    }

    private clearInputs() {
        this.titleInputElement.value = ''
        this.descriptionInputElement.value = ''
        this.deadlineInputElement.value = ''
    }
    //ori returneaza touple ori nimic in caz de nu e validat
    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredDeadline = this.deadlineInputElement.value

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: false,
        }

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 2
        }

        const deadlineValidatable: Validatable = {
            value: enteredDeadline,
            required: true,
            min: 1
        }

        if ( 
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(deadlineValidatable)
            
        ) {
            alert('Invalid data!')
        }
        else {
            return [enteredTitle, enteredDescription, +enteredDeadline]
        }

    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault()//previne reload-ul la pagina
        const userInput = this.gatherUserInput()
        if (Array.isArray(userInput)) {
            console.log(userInput)
            const [enteredTitle, description, people] = userInput
            projectState.addTask(enteredTitle, description, people)
            this.clearInputs()
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }

}


const task = new TaskInput()

const activeTaskList = new TaskList('active')
const finishedTaskList = new TaskList('finished')