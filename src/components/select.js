import Cookie from '../utils/cookie.js'

export default class Select {
    constructor({el, onChange, cookieName}) {
        this.el = el
        this.header = this.el.querySelector('[data-select-header]')
        this.headerText = this.el.querySelector('[data-header-text]')
        this.items = this.el.querySelectorAll('[data-select-item]')
        this.onChange = onChange
        this.cookieName = cookieName
        
        this.init()
    }
    
    init() {
        if (this.cookieName) {
            const value = Cookie.getCookie(this.cookieName)
            
            if (value) {
                const item = this.el.querySelector(`[data-select-item="${value}"]`)
                
                this.changeValue(item)
            }
        } 
        
        this.header.addEventListener('click', () => this.toggle())

        this.items.forEach(item => {
            item.addEventListener('click', () => this.changeValue(item))
        })
    }
    
    toggle() {
        this.el.classList.toggle('select_open')
    }
    
    open() {
        this.el.classList.add('select_open')
    }
    
    hide() {
        this.el.classList.remove('select_open')
    }

    changeValue(item) {
        const value = item.dataset.selectItem
        const name = item.innerText.trim()
        this.headerText.innerText = name
        this.hide()
        
        if (this.cookieName) {
            Cookie.setCookie(this.cookieName, value)
        }
        
        if (this.onChange) {
            this.onChange({
                name,
                value
            })
        }
    }
}