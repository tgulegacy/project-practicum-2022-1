import './assets/style/index.scss'
import MobileNav from "@/components/mobile-nav";
import Nav from '@/components/nav';
import Catalog from "@/components/catalog";
import Basket from "@/components/basket";

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
} else {
    init();
}

async function init() {
    new Nav('nav');

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

    const isBasket = window.location.href.includes('basket')

    if (isBasket) {
        await new Basket(
            document.getElementById('basket-items'),
            document.getElementById('basket-info'),
        ).init()
    } else {
        await new Catalog(
            document.getElementById('catalog-items'),
            document.getElementById('filter-items'),
            document.getElementById('pagination'),
        ).init();
    }
}
