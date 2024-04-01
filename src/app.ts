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

    submitHandler(event: Event) {
        event.preventDefault()//previne reload-ul la pagina
        console.log(this)
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this))
    }

}


const task = new Task()
console.log('test')