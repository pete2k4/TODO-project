import { Component } from "./base-component.js"
import { Validatable, validate } from "../util/validation.js"
import { autobind } from "../decorators/autobind.js"
import { taskState } from "../state/task-state.js"

export class TaskInput extends Component<HTMLDivElement, HTMLFormElement>{
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
    public static gatherUserInput(enteredTitle: string, enteredDescription: string, enteredDeadline: string): [string, string, string] | void {
        //const enteredTitle = this.titleInputElement.value
        //const enteredDescription = this.descriptionInputElement.value
        //const enteredDeadline = this.deadlineInputElement.value

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 1,
            maxLength: 40
        }

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: false,
            minLength: 0,
            maxLength: 150,
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
            console.log(deadlineValidatable.value)
        }
        else {
            return [enteredTitle, enteredDescription, enteredDeadline]
        }

    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault()//previne reload-ul la pagina
        const userInput = TaskInput.gatherUserInput(this.titleInputElement.value, this.descriptionInputElement.value, this.deadlineInputElement.value,)
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
