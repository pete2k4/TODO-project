enum TaskStatus {
    Active,
    Finished
}

class Task {
    constructor(
        public id: string, 
        public title:string, 
        public description: string, 
        public deadline: string, 
        public status: TaskStatus) {

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

const taskState = TaskState.getInstance()

type Validatable = {
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    minDate?: number
    
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

    if (validatableInput.minDate != null && typeof validatableInput.value === 'string'){
        const inputDate = new Date(validatableInput.value) 
        const currentDate = new Date(validatableInput.minDate)
        isValid = isValid &&  inputDate > currentDate
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
      this.element.querySelector('#deadline')!.textContent = "Must be done until: " + new Date(this.task.deadline)
      
      const checkbox = this.element.querySelector('#checkbox') as HTMLInputElement;
      checkbox.checked = this.task.status === TaskStatus.Finished;
  
    }



    
  }


class TaskList extends Component<HTMLDivElement, HTMLElement>{

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

class TaskInput extends Component<HTMLDivElement, HTMLFormElement>{
    //input gotten from form
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    deadlineInputElement: HTMLInputElement

    constructor() {
        super('task-input', 'app', true, 'user-input')
        //containing form inputs in Task class
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
    public gatherUserInput(enteredTitle: string, enteredDescription: string, enteredDeadline: string): [string, string, string] | void {
        //const enteredTitle = this.titleInputElement.value
        //const enteredDescription = this.descriptionInputElement.value
        //const enteredDeadline = this.deadlineInputElement.value

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
        }

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: false,
            minLength: 2
        }

        const deadlineValidatable: Validatable = {
            value: enteredDeadline,
            required: false,
            minDate: Date.now()
        }

        if ( 
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(deadlineValidatable)
            
        ) {
            alert('Invalid data!')
        }
        else {
            return [enteredTitle, enteredDescription, enteredDeadline]
        }

    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault()//previne reload-ul la pagina
        const userInput = this.gatherUserInput(this.titleInputElement.value, this.descriptionInputElement.value, this.deadlineInputElement.value,)
        if (Array.isArray(userInput)) {
            const [enteredTitle, description, deadline] = userInput
            taskState.addTask(enteredTitle, description, deadline)
            this.clearInputs()
        }
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }

}

class TaskEdit extends Component<HTMLDListElement, HTMLFormElement> {    private task: Task;
    private modal: HTMLDivElement;
    private backdrop: HTMLDivElement;

    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    deadlineInputElement: HTMLInputElement


    constructor(task: Task) {
        super('edit-task', 'app', false);
        this.task = task;
        this.modal = document.getElementById('edit-modal') as HTMLDivElement;
        this.backdrop = document.getElementById('backdrop') as HTMLDivElement;
        
        this.titleInputElement = document.getElementById('titleEdit') as HTMLInputElement
        this.descriptionInputElement = document.getElementById('descriptionEdit') as HTMLInputElement
        this.deadlineInputElement = document.getElementById('deadlineEdit') as HTMLInputElement

        console.log('new task edit instance')
        this.configure();
        this.renderContent();
    
    }

    configure() {
        this.showModal()
        this.cancelBtn()
        this.outsideClick()
        this.modal.addEventListener('submit', this.editHandler)
    }

    renderContent() {}

    
    @autobind
    private showBackdrop() {
        if (!this.backdrop!.classList.contains('visible')){ 
            this.backdrop!.classList.add('visible')
        }
        
    }

    @autobind
    private closeBackdrop() {
        if (this.backdrop!.classList.contains('visible')){ 
            this.backdrop!.classList.remove('visible')
        }
    }

    public showModal() {
        //messy implementation
        if (!this.modal.classList.contains('visible')) {
            this.modal.classList.add('visible')
            this.showBackdrop()
        }
    }

    

    @autobind
    private editHandler(event: Event) {
        event.preventDefault(); // Prevent default form submission behavior
        const userInput = (task as TaskInput).gatherUserInput(this.titleInputElement.value, this.descriptionInputElement.value, this.deadlineInputElement.value); // Access gatherUserInput from TaskInput     
        console.log(userInput)   
    }

    @autobind
    public closeModal() {
        //messy implementation
        if (this.modal.classList.contains('visible')) {
            this.modal.remove();
            const cancel = document.getElementById('cancel-edit');
            cancel?.removeEventListener('click', this.closeModal);

        }
        this.closeBackdrop();

    }

    private cancelBtn() {
        const cancel = document.getElementById('cancel-edit')
        cancel!.addEventListener('click', this.closeModal)
    }

    @autobind
    private outsideClick() {
        this.backdrop.addEventListener('click', this.closeModal)

    }

}



const task = new TaskInput()

const activeTaskList = new TaskList('active')
const finishedTaskList = new TaskList('finished')
