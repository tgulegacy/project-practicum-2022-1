import './assets/style/index.scss'
import Select from './components/select'
import Accordion from "@/components/accordion";

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
} else {
    init();
}

function init() {
    const sortEl = document.getElementById('sort')
    const sortCallback = (item) => {
        console.log(item)
    }
    new Select({
        el: sortEl,
        onChange: sortCallback,
        cookieName: 'catalog-sort'
    })
    
    function filter() {
        const accordions = []

        const accordionsEl = document.querySelectorAll('[data-accordion]')
        accordionsEl.forEach(accordion => {
            accordions.push(new Accordion(accordion))
        })
        
        const hideFiltersBtn = document.querySelector('[data-filters-open]')
        const openFiltersBtn = document.querySelector('[data-filters-hide]')

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
    }

    filter()
}