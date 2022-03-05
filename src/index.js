import './assets/style/index.scss'
import Select from './components/select'
import Accordion from "@/components/accordion";
import Nav from "@/components/nav";

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
    
    if (window.innerWidth <= 1024) {
        const nav = new Nav(document.getElementById('nav'))
        
        const burger = document.querySelector('[data-toggle-nav]')
        burger.addEventListener('click', () => nav.toggleNav())
        
        const closeIcon = document.querySelector('[data-hide-nav]')
        closeIcon.addEventListener('click', () => nav.hideNav())
        
        const items = document.querySelectorAll('[data-nav-item]')
        items.forEach(item => {
            item.addEventListener('click', () => nav.openMenuItem(item))
        })
        
        const hideNavItems = document.querySelectorAll('[data-nav-item-hide]')
        hideNavItems.forEach(hideNavItem => {
            hideNavItem.addEventListener('click', () => nav.hideMenuItem(hideNavItem))
        })
        
        const subcategories = document.querySelectorAll('[data-nav-subitems]')
        subcategories.forEach(subcategory => {
            subcategory.addEventListener('click', event => {
                event.stopPropagation()
            })
        })
    }
}