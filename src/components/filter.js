import getFilterItems from "../api/getFilterItems";
import Accordion from "./accordion";
import {decodeURL} from "@/utils/url";
import initRangeInput from "@/components/rangeInput";

export default class Filter {
    constructor(el, onChange) {
        this.el = el
        this.filterItems = null
        this.onChange = onChange
    }

    async init() {
        this.filterItems = await getFilterItems()
        this.data = this.getCurrentFilter()
        await this.renderItems()
        this.initListeners()
    }

    async renderItems() {
        const filterItems = this.filterItems

        let html = ``

        filterItems.forEach(filterEl => {
            let items = ''

            if (filterEl.type === 'checkbox') {
                filterEl.items.forEach(item => {
                    const isPicked = this.isItemPicked(filterEl.code, item.code)

                    items += this.renderItem(item, filterEl.type, {isPicked})
                })

                html += `
                <div class="accordion filters__item" data-accordion data-filter-el data-filter-code="${filterEl.code}" data-filter-type="${filterEl.type}">
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
            } else if (filterEl.type === 'range') {
                const foundItem = this.data.find(item => item.code === filterEl.code)
                const {min, max} = filterEl

                const [left, right] = foundItem?.items.map(item => +item) || [min, max]

                html += `
                <div class="accordion filters__item" data-accordion data-filter-el data-filter-code="${filterEl.code}" data-filter-type="${filterEl.type}">
                    <div class="accordion__header" data-accordion-header>
                        <span class="accordion__title body-1">${filterEl.title}</span>
    
                        <svg class="accordion__icon" width="10" height="5">
                            <use href="#arrow"></use>
                        </svg>
                    </div>
    
                    <div class="accordion__inner filters__checkboxes"
                         data-accordion-inner>
                         <div>
                            ${this.renderItem(filterEl, filterEl.type, {
                    left,
                    right,
                    min,
                    max
                })}
                         </div>
                    </div>
                </div>
                `
            }
        })

        this.el.innerHTML = html
    }

    changeData(data) {
        this.data = data
        const elements = this.el.querySelectorAll('[data-filter-el]')

        elements.forEach(element => {
            const category = element.dataset.filterCode
            const items = element.querySelectorAll('[data-filter-item]')
            
            const el = data.find(el => el.code === category)

            if (!el) {
                const item = this.filterItems.find(item => item.code === category)

                if (item.type === 'checkbox') {
                    items.forEach(item => {
                        item.checked = false;
                    })
                } else if (item.type === 'range') {
                    const [left, right] = [item.min, item.max]
                    const rangeInput = element.querySelector('[data-range]')
                    this.changeRangeItemValue(rangeInput, left, right)
                }
                return
            }
            
            items.forEach(item => {
                const code = item.name

                if (el.type === 'checkbox') {
                    item.checked = !!(el && el.items.includes(code));
                } else {
                    const [left, right] = el.items.map(item => +item)
                    const rangeInput = item.closest('[data-range]')
                    this.changeRangeItemValue(rangeInput, left, right)
                }

            })
        })
    }

    renderItem(item, type, options = {}) {
        if (type === 'checkbox') {
            return `
                <label class="checkbox">
                    <input class="checkbox__native" 
                           type="checkbox" name="${item.code}"
                           data-filter-item 
                           ${options.isPicked ? 'checked' : ''}>
        
                    <span class="checkbox__box"></span>
        
                    <span class="checkbox__text">${item.title}</span>
                </label>
            `
        } else if (type === 'range') {
            const {min, max, left, right} = options

            return `
            <div class="range-el" style='--left: ${left}; --right: ${right}; --min: ${min}; --max: ${max}' data-range>
                <div class="range-el__inputs" role='group' aria-labelledby='multi-lbl'>
                    <input type='range' min=${min} value=${left} max=${max} data-range-left data-filter-item>
                    
                    <input type='range' min=${min} value=${right} max=${max} data-range-right>
                    
                    <div class="range-el__bg-line"></div>
                </div>
                <div class="range-el__outputs">
                    <output style='--c: var(--left)'></output>
                    <output style='--c: var(--right)'></output>
                </div>
            </div>
            `
        }
    }

    changeRangeItemValue(rangeInput, left, right) {
        const rangeLeft = rangeInput.querySelector('[data-range-left]')
        const rangeRight = rangeInput.querySelector('[data-range-right]')

        rangeLeft.value = left
        rangeRight.value = right

        rangeInput.style.setProperty(`--left`, left)
        rangeInput.style.setProperty(`--right`, right)
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
            const data = this.data

            data.forEach(item => {
                if (item.type === 'checkbox') {
                    item.items = []
                } else if (item.type === 'range') {
                    const code = item.code
                    const {
                        min,
                        max
                    } = this.filterItems.find(item => item.code === code)

                    item.items = [min, max]
                }
            })

            this.changeData(data)

            this.emitDataChange()
        })

        const elements = this.el.querySelectorAll('[data-filter-el]')

        elements.forEach(element => {
            const category = element.dataset.filterCode
            const type = element.dataset.filterType

            if (type === 'checkbox') {
                const items = element.querySelectorAll('[data-filter-item]')

                items.forEach(item => {
                    const code = item.name

                    item.addEventListener('change', () => {
                        if (item.checked) {
                            this.addItem(category, code, type)
                        } else {
                            this.removeItem(category, code)
                        }

                        this.emitDataChange()
                    })
                })
            } else {
                const rangeElement = element.querySelector('[data-range]')
                initRangeInput(rangeElement, (left, right) => {
                    const foundEl = this.data.find(item => item.code === category)
                    const {
                        min,
                        max
                    } = this.filterItems.find(item => item.code === category)

                    if (left === min && max === right) {
                        const index = this.data.findIndex(item => item.code === category)
                        this.data.splice(index, 1)
                    } else {
                        if (foundEl) {
                            foundEl.items = [left, right]
                        } else {
                            this.data.push({
                                code: category,
                                type,
                                items: [left, right]
                            })
                        }
                    }

                    this.emitDataChange()
                })
            }
        })
    }

    emitDataChange() {
        const data = this.data.filter(el => {
            if (el.type === 'checkbox') {
                return el.items.length
            } else {
                return true
            }
        })

        this.onChange(data)
    }

    addItem(category, code, type) {
        const foundEl = this.data.find(item => item.code === category)
        if (foundEl) {
            if (foundEl.items.includes(code)) {
                return
            }

            foundEl.items.push(code)
        } else {
            this.data.push({
                code: category,
                type,
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

    getCurrentFilter() {
        let params = new URL(window.location.href).searchParams
        params.delete('page')
        const data = decodeURL(params)

        this.filterItems.forEach(filterItem => {
            const dataFoundItem = data.find(item => item.code === filterItem.code)
            if (dataFoundItem) {
                dataFoundItem.type = filterItem.type
            }
        })
        return data
    }
}
