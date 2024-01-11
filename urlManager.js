class UrlManager {
    constructor() {
        this.url = window.location.href
        this.params = this.getParams()
    }

    getParams(){
        let params = {}
        if (this.url.indexOf("?") > 0) {
            let paramList= this.url.split("?")
            let arrURLParams= paramList[1].split("&")

            for (let i= 0; i < arrURLParams.length; i++) {
                let paramKeyValue = arrURLParams[i].split("=")
                this.#addParam(paramKeyValue[0], paramKeyValue[1], params)
            }
        }
        return params
    }

    append(paramName, paramValue) {
        let paramPrefix = '&'
        if (this.url.indexOf("?") < 0)
            paramPrefix = '?'
        this.#addParam(paramName, paramValue)
        this.url = `${this.url}${paramPrefix}${paramName}=${paramValue}`
    }

    remove(paramName, paramValue=null) {
        let urlParts = this.url.split('?')

        if (urlParts.length >= 2) {
            let params = urlParts[1].split(/[&;]/g)
            for (let i= params.length; i-- > 0;) {
                let regexToDel
                if (paramValue)
                    regexToDel = `${paramName}=${paramValue}`
                else
                    regexToDel = `${paramName}=.*`
                if (params[i].match(regexToDel)) {
                    params.splice(i, 1)
                }
            }
            this.#removeParam(paramName)
            this.url = `${urlParts[0]}?${params.join('&')}`
        }
    }

    changeOrAppend(paramName, paramValue) {
        if (this.url.indexOf(paramName + "=") >= 0) {
            let prefix = this.url.substring(0, this.url.indexOf(paramName + "="))
            let suffix = this.url.substring(this.url.indexOf(paramName + "="))
            let oldValue = suffix.substring(suffix.indexOf("=") + 1)
            suffix = (oldValue.indexOf("&") >= 0) ? oldValue.substring(oldValue.indexOf("&")) : ""
            this.url = prefix + paramName + "=" + paramValue + suffix
            this.#changeParam(paramName, oldValue, paramValue)
        }
        else
            this.append(paramName, paramValue)
    }

    has(paramName, paramValue=null) {
        if (paramValue)
            try {
                return Boolean(this.params[paramName].has(paramValue))
            }
            catch (error) {
                return false
            }
        else
            return Boolean(this.params[paramName])
    }

    get(paramName) {
        if (this.has(paramName))
            return this.params[paramName]
        else
            return null
    }

    getFirst(paramName) {
        if (this.has(paramName)) {
            let [firstElem] = this.params[paramName]
            return firstElem
        }
        else
            return null
    }

    reloadPage() {
        window.location.href = this.url
    }

    #addParam(paramName, paramValue, params=this.params) {
        if (params[paramName])
            params[paramName].add(paramValue.toString())
        else
            params[paramName] = new Set([paramValue.toString()])
    }

    #removeParam(paramName, paramValue=null) {
        if (paramValue) {
            let index = this.params[paramName].indexOf(paramValue)
            if (index >= 0)
                this.params.splice(index, 1)
        }
        if (this.params[paramName].length === 0)
            this.params.remove(paramName)
    }

    #changeParam(paramName, paramOldValue, paramNewValue) {
        this.params[paramName].delete(paramOldValue)
        this.params[paramName].add(paramNewValue)
    }
}
