import navData from "@/config/nav-data";

export default class Nav {
	constructor(el) {
		this.el = document.getElementById(el);

		this.init();
	}

	init() {
		this.render();
	}

	render() {
		let container = `
			<div class="nav__items">
				<div class="nav__control-panel">
					<svg width="18" height="18" data-hide-nav>
						<use href="#close"></use>
					</svg>
				</div>
		`;

		navData.forEach( item => {
			const title = item.title;
			const items = item.items;

			let domElem = `
				<div class="nav__item" data-nav-item>
					<div class="nav__content">
						<div class="nav__title button-1">
							<span>${title}</span>
							<svg width="10" height="20" class="nav__title-arrow">
								<use href="#arrow"></use>
							</svg>
						</div>
			`;

			const subDomElem = this.renderSubMenu(items);

			domElem += subDomElem;

			domElem += `
					</div>
	
					<div class="nav__bg"></div>
				</div>
			`;

			container += domElem;
		} );

		this.el.innerHTML = container;
	}

	renderSubMenu(items) {
		let container = `
			<div class="nav__inner" data-nav-subitems>
            	<div class="nav__control-panel" data-nav-item-hide>
            	    <svg width="8" height="12">
            	        <use href="#chevron"></use>
            	    </svg>
            	    
            	    <span class="button-1">назад</span>
            	</div>
		`;

		items.forEach( item => {
			const title = item.title;

			container += `<a class="nav__item nav__subcategory">${title}</a>`;
		} );

		return container + '</div>';
	}
}
