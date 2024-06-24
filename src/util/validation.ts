
export type Validatable = {
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    minDate?: number
    
}

export function validate(validatableInput: Validatable) {
    //true by default, until it unmeets any criteria
    let isValid = true

    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }

    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength
    }

    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
    }

    if (validatableInput.minDate != null && validatableInput.value !== ""){
        const inputDate = new Date(validatableInput.value) 
        const currentDate = new Date(validatableInput.minDate)
        isValid = isValid &&  inputDate > currentDate
    }

    

    return isValid
}
