import './assets/style/index.scss'
import Select from './components/select'
import Accordion from "@/components/accordion";
import MobileNav from "@/components/mobile-nav";
import Nav from '@/components/nav';

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
} else {
    init();
}

function init() {
    new Nav('nav');
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
        const mobileNav = new MobileNav(document.getElementById('nav'))

        const burger = document.querySelector('[data-toggle-nav]')
        burger.addEventListener('click', () => mobileNav.toggleNav())

        const closeIcon = document.querySelector('[data-hide-nav]')
        closeIcon.addEventListener('click', () => mobileNav.hideNav())

        const items = document.querySelectorAll('[data-nav-item]')
        items.forEach(item => {
            item.addEventListener('click', () => mobileNav.openMenuItem(item))
        })

        const hideNavItems = document.querySelectorAll('[data-nav-item-hide]')
        hideNavItems.forEach(hideNavItem => {
            hideNavItem.addEventListener('click', () => mobileNav.hideMenuItem(hideNavItem))
        })

        const subcategories = document.querySelectorAll('[data-nav-subitems]')
        subcategories.forEach(subcategory => {
            subcategory.addEventListener('click', event => {
                event.stopPropagation()
            })
        })
    }
}
