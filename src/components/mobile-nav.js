import navData from "@/config/nav-data";

export default class MobileNav {
    constructor(el) {
        this.el = el;
        this.isOpen = false;
        console.log(navData);
        console.log(this.el);
    }

    toggleNav() {
        this.isOpen ? this.hideNav() : this.openNav() ;
    }

    openNav() {
        this.el.classList.add('nav_open');
        this.isOpen = true;
    }

    hideNav() {
        this.el.classList.remove('nav_open');
        this.isOpen = false
    }

    openMenuItem(item) {
        item.classList.add('nav__item_open');
    }

    hideMenuItem(hideBtn) {
        const item = hideBtn.closest('[data-nav-item]');
        item.classList.remove('nav__item_open');
    }
}
