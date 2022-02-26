export default class Accordion {
    constructor(el) {
        this.el = el
        this.header = this.el.querySelector('[data-accordion-header]')
        this.inner = this.el.querySelector('[data-accordion-inner]')
        this.innerHeigth = this.inner.scrollHeight
        this.isOpen = false
        
        this.init()
    }
    
    init() {
        this.header.addEventListener('click', () => {
            if (this.isOpen) {
                this.hide()
            } else {
                this.open()
            }
        })
    }
    
    toggle() {
        this.el.classList.toggle('accordion_open')
    }
    
    open() {
        this.inner.style.height = this.innerHeigth + 'px'
        this.el.classList.add('accordion_open')
        this.isOpen = true
    }
    
    hide() {
        this.inner.style.height = '0px'
        this.el.classList.remove('accordion_open')
        this.isOpen = false
    }
}