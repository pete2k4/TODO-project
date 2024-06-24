export function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.minDate != null && validatableInput.value !== "") {
        const inputDate = new Date(validatableInput.value);
        const currentDate = new Date(validatableInput.minDate);
        isValid = isValid && inputDate > currentDate;
    }
    return isValid;
}
//# sourceMappingURL=validation.js.map