
function submitForm(e, clearOnError=true, clearOnSuccess=true) {
    e.preventDefault()
    e.stopPropagation()
    let form = new Form($(e.target).closest('form'))

    if (form.isValid())
        return form.submit(clearOnError, clearOnSuccess)
    else
        return 1
}

class Form {
    constructor(target) {
        this.id = target
        this.obj = $(target)
    }

    isValid() {
        let requiredFieldsFilled = true
        let fieldsValid = true
        this.obj.find('input[required],textarea[required]').each(function () {
            let formField = new FormField(this)
            if (formField.isEmpty()) {
                formField.setInvalid(gettext('This field is required'))
                requiredFieldsFilled = false
            }
        })
        if (!requiredFieldsFilled) {
            showMsg(gettext('Fill required fields'), 'error')
            return false
        }

        this.obj.find('input[invalid],textarea[invalid]').each(function () {
            let formField = new FormField(this)
            if (!formField.isValid()) {
                formField.setInvalid()
                fieldsValid = false
            }
        })

        if (!fieldsValid) {
            showMsg(gettext('Correct provided data in form'), 'error')
            return false
        }
        else
            return true
    }

    submit(cleanOnError=true, cleanOnSuccess=true) {
        setBusy()
        let formData = new FormData(this.obj[0])
        let form = this

        $.ajax({
            url: this.obj.attr('action'),
            method: this.obj.attr('method'),
            data: formData,
            contentType: false,
            async: false,
            processData: false,
            timeout: 10,
            success: function (response) {
                setIdle()
                if (cleanOnSuccess)
                    form.clear()
            },
            error: function (response) {
                console.error(response)
                if (cleanOnError)
                    form.clear()
            }
        })
    }

    clear() {
        this.obj.trigger('reset')
    }
}

class FormField {

    constructor(target) {
        this.obj = $(target)
    }

    setValid() {
        this.obj.attr('invalid', null)
        this.obj.next('.validation-info').remove()
    }

    setInvalid(msg=this.obj.attr('data-validation-msg')) {
        this.obj.attr('invalid', '')

        if (this.hasValidationError())
            this.obj.next('.validation-info').remove()
        this.obj.after(`<span class="validation-info">${msg ? msg : "Validation error"}</span>`)
    }

    hasValidationError() {
        return this.obj.next(".validation-info")
    }

    isValid() {
        let pattern = this.obj.attr('pattern')
        return this.obj.val().match(pattern)
    }

    isEmpty() {
        return this.obj.val() === ''
    }
}

function onInput(target) {
    let formField = new FormField(target)
    if (formField.hasValidationError() && formField.isValid())
        formField.setValid()
}

function onFocus(target) {
    let formField = new FormField(target)
    if (formField.hasValidationError() && formField.isEmpty())
        formField.setValid()
}

function validate(target) {
    let formField = new FormField(target)

    if (!formField.isEmpty() && !formField.isValid())
        formField.setInvalid()
    else if (formField.hasValidationError())
        formField.setValid()
}

function formatPhoneNumber(target) {
    let value = target.value.replace(/\D/g, '')
    let formattedValue = ""
    for (let i = 0; i < value.length; i++) {
        if (i % 3 == 0 && i > 0) {
            formattedValue += " "
        }
        formattedValue += value[i]
    }
    target.value = formattedValue
}
