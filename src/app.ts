enum TaskStatus {
    Active,
    Finished
}

class Task {
    constructor(
        public id: string, 
        public title:string, 
        public description: string, 
        public deadline: number, 
        public status: TaskStatus) {
        console.log('check task')

    }
}

type Listener<T> = (items: T[]) => void

class State<T> {
  protected listeners: Listener<T>[] = []

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn)
  }
}

class TaskState extends State<Task> {
    private tasks: Task[] = []
    private static instance: TaskState

    private constructor(){
        super()
        console.log('check taskstate')

    }

    static getInstance() {
        if (this.instance) {
            return this.instance
        }
        this.instance = new TaskState()
        return this.instance
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
    console.log('check validate')

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

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
        console.log('check component')

      this.templateElement = document.getElementById(
        templateId
      )! as HTMLTemplateElement;
      this.hostElement = document.getElementById(hostElementId)! as T;

      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.element = importedNode.firstElementChild as U;
      if (newElementId) {
        this.element.id = newElementId;
      }

      this.attach(insertAtStart);
    }

    private attach(insertAtBeginning: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtBeginning ? 'afterbegin' : 'beforeend',
        this.element
      );
    }

    abstract configure(): void;
    abstract renderContent(): void;
  }

  //clasa pentru structurarea fiecarui task
  class TaskItem extends Component<HTMLUListElement, HTMLLIElement> {
    private task: Task;
  
    constructor(hostId: string, task: Task) {
      super('single-task', hostId, false, task.id)
      console.log('check taskitem')

      this.task = task
  
      this.configure()
      this.renderContent()
    }
  
    configure() {
  
    }
  
    renderContent() {
      this.element.querySelector('#title')!.textContent = this.task.title
      this.element.querySelector('#description')!.textContent = this.task.description
      this.element.querySelector('#deadline')!.textContent = this.task.deadline.toString()
        
  
    }
  }


class TaskList extends Component<HTMLDivElement, HTMLElement>{

    assignedTasks: Task[]

    constructor(private type: 'active' | 'finished') {
        super('task-list', 'app', false, `${type}-tasks`)
        console.log('check tasklist')

        this.assignedTasks = [];

        this.configure();
        this.renderContent();
        
    }

    configure() {
        projectState.addListener((tasks: Task[]) => {
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

class TaskInput extends Component<HTMLDivElement, HTMLFormElement>{
    //input gotten from form
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    deadlineInputElement: HTMLInputElement

    constructor() {
        super('task-input', 'app', true, 'user-input')
        //containing form inputs in Task class
        console.log('check taskinput')
        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement
        this.deadlineInputElement = this.element.querySelector('#deadline')! as HTMLInputElement

        this.configure()
    }

    renderContent(): void {
        
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

    configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }

}


const task = new TaskInput()

const activeTaskList = new TaskList('active')
const finishedTaskList = new TaskList('finished')