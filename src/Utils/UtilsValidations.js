export let validateFormDataInputRequired =
    (formData, inputKey, formErrors, setFormErrors) => {

        let regexNotEmpty = /^(.+)$/;
        let errorMessage = "Required"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexNotEmpty, errorMessage)
    }

export let validatePrice =
    (formData, inputKey, formErrors, setFormErrors) => {

        let regexNotEmpty = /^\d+(\.\d{1,2})?$/;
        let errorMessage = "Price must be numeric"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexNotEmpty, errorMessage)
    }

export let validateStringLong =
    (numberType, formData, inputKey, formErrors, setFormErrors) => {

        let regexNotEmpty = /^[A-Za-z0-9]{6}$/
        let errorMessage = "Password must be of length 6"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexNotEmpty, errorMessage)
    }

export let validateDocumentNumberFormat =
    (numberType, formData, inputKey, formErrors, setFormErrors) => {

        let regexNotEmpty = numberType === "NIF" ? /^\d{7}[A-Z]$/ : /^[A-Z0-9]{9}$/;
        let errorMessage = numberType === "NIF" ?
            "NIF number must be 7 numbers followed by an uppercase letter"
            : "Passport number must be an uppercase alphanumeric string of length 9"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexNotEmpty, errorMessage)
    }

export let validatePostalCodeFormat =
    (formData, inputKey, formErrors, setFormErrors) => {

        let regexNotEmpty = /^\d{5}$/;
        let errorMessage = "Postal Code must be of length 5 and only numbers"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexNotEmpty, errorMessage)
    }

export let validateCreditCardCode =
    (formData, inputKey, formErrors, setFormErrors) => {

        let regexNotEmpty = /^\d{4}$/;
        let errorMessage = "Code must be of length 4 and only numbers"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexNotEmpty, errorMessage)
    }

export let validateCreditCardNumber =
    (formData, inputKey, formErrors, setFormErrors) => {

        let regexNotEmpty = /^\d{6}$/;
        let errorMessage = "Number must be of length 6 and only numbers"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexNotEmpty, errorMessage)
    }

export let validateFormDataInputEmail =
    (formData, inputKey, formErrors, setFormErrors) => {

        //let regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        let regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        let errorMessage = "Not email format"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexEmail, errorMessage)
    }

export let validateFormDataInput =
    (formData, inputKey, formErrors, setFormErrors, regex, msgError) => {
        // not write Yet
        if (formData[inputKey] == null) {
            return true
        }

        // have a serverError
        if (formErrors[inputKey]?.type === "server") {
            return false
        }

        // Have some value, remove the error only client erros
        if (formData[inputKey] != null && regex.test(formData[inputKey])) {
            if (formErrors[inputKey] != null ) {
                formErrors[inputKey] = null;
                setFormErrors(formErrors)
                // don't put again the value in state
            }
            return true;
        }

        // Dont have value put the error
        if (formErrors[inputKey] == null) {
            formErrors[inputKey] = {msg: msgError }
            setFormErrors(formErrors)
        }
        return false;

    }

export let allowSubmitForm = (formData, formErrors, requiredInputWithNoErrors) => {
    let result = true;
    requiredInputWithNoErrors.forEach(inputKey => {
        // With client errors you cant not submit form
        if (formData[inputKey] == null
            || formErrors[inputKey] != null ) {

            result = false;
            return;
        }
    })
    return result;
}

export let setServerErrors = (serverErrors, setFormErrors) => {
    let newFormErrors = {} //delete all previous
    if ( Array.isArray(serverErrors)){
        serverErrors.forEach(e => {
            newFormErrors[e.field] = { msg: e.msg, type: "server" }
        });
    }
    // destroy all previous errors is a new SET
    setFormErrors(newFormErrors)
}

export let joinAllServerErrorMessages = (serverErrors) => {
    let generalErrorMessage = "";
    if ( Array.isArray(serverErrors)){
        serverErrors.forEach(e => {
            generalErrorMessage += e.msg
        });
    } else {
        if (serverErrors?.msg != null){
            generalErrorMessage = serverErrors.msg;
        }
    }
    return generalErrorMessage
}