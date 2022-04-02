import getFilterItems from "../api/getFilterItems";
import Accordion from "./accordion";

export default class Filter {
    constructor(el, onChange, data) {
        this.el = el
        this.data = data || []
        this.onChange = onChange
    }

    async init() {
        await this.renderItems()

        this.initListeners()
    }

    async renderItems() {
        const filterItems = await getFilterItems()
        let html = ``

        filterItems.forEach(filterEl => {
            let items = ''


            filterEl.items.forEach(item => {
                const isPicked = this.isItemPicked(filterEl.code, item.code)

                items += this.renderItem(item, filterEl.type, isPicked)
            })

            html += `
                <div class="accordion filters__item" data-accordion data-filter-el="${filterEl.code}">
                    <div class="accordion__header" data-accordion-header>
                        <span class="accordion__title body-1">${filterEl.title}</span>
    
                        <svg class="accordion__icon" width="10" height="5">
                            <use href="#arrow"></use>
                        </svg>
                    </div>
    
                    <div class="accordion__inner filters__checkboxes"
                         data-accordion-inner>
                         ${items}
                    </div>
                </div>
            `
        })

        this.el.innerHTML = html
    }

    changeData(data) {
        this.data = data
        const elements = this.el.querySelectorAll('[data-filter-el]')

        elements.forEach(element => {
            const category = element.dataset.filterEl
            const items = element.querySelectorAll('[data-filter-item]')

            items.forEach(item => {
                const code = item.name

                const el = data.find(el => el.code === category)

                item.checked = !!(el && el.items.includes(code));
            })
        })
    }

    renderItem(item, type, isPicked) {
        if (type === 'checkbox') {
            return `
                <label class="checkbox">
                    <input class="checkbox__native" 
                           type="checkbox" name="${item.code}"
                           data-filter-item 
                           ${isPicked ? 'checked' : ''}>
        
                    <span class="checkbox__box"></span>
        
                    <span class="checkbox__text">${item.title}</span>
                </label>
            `
        }
    }

    initListeners() {
        const accordions = []

        const accordionsEl = this.el.querySelectorAll('[data-accordion]')
        accordionsEl.forEach(accordion => {
            accordions.push(new Accordion(accordion))
        })

        const hideFiltersBtn = document.querySelector('[data-filters-open]')
        const openFiltersBtn = document.querySelector('[data-filters-hide]')
        const filterResetBtn = document.querySelector('[data-filters-reset]')

        hideFiltersBtn.addEventListener('click', () => {
            accordions.forEach(accordion => {
                accordion.hide()
            })
        })

        openFiltersBtn.addEventListener('click', () => {
            accordions.forEach(accordion => {
                accordion.open()
            })
        })


        filterResetBtn.addEventListener('click', () => {
            this.data = []

            this.el.querySelectorAll('input[type="checkbox"]').forEach(input => {
                input.checked = false
            })

            this.emitDataChange()
        })

        const elements = this.el.querySelectorAll('[data-filter-el]')

        elements.forEach(element => {
            const category = element.dataset.filterEl
            const items = element.querySelectorAll('[data-filter-item]')

            items.forEach(item => {
                const code = item.name

                item.addEventListener('change', () => {
                    if (item.checked) {
                        this.addItem(category, code)
                    } else {
                        this.removeItem(category, code)
                    }

                    this.emitDataChange()
                })
            })
        })
    }

    emitDataChange() {
        const data = this.data.filter(el => el.items.length)

        this.onChange(data)
    }

    addItem(category, code) {
        const foundEl = this.data.find(item => item.code === category)
        if (foundEl) {
            if (foundEl.items.includes(code)) {
                return
            }

            foundEl.items.push(code)
        } else {
            this.data.push({
                code: category,
                items: [code]
            })
        }
    }

    removeItem(category, code) {
        const foundEl = this.data.find(item => item.code === category)

        if (foundEl) {
            const itemIndex = foundEl.items.indexOf(code)

            foundEl.items.splice(itemIndex, 1)
        }
    }

    isItemPicked(category, code) {
        const el = this.data.find(el => el.code === category)

        return el ? el.items.includes(code) : false
    }
}
