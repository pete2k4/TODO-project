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

class Task {
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
            this.clearInputs()
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }

}


const task = new Task()
