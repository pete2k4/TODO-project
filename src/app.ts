class Task {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement

    constructor() {
        this.templateElement = document.getElementById("task-input")! as HTMLTemplateElement
        this.hostElement = document.getElementById("app")! as HTMLDivElement

        //copie templateElement (forma) ca dupa sa fie atasat la host (div app)
        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement
        //atasarea formei (element) la host (div app)
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const task = new Task()
console.log('test')