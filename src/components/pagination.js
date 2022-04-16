export default class Pagination {
	constructor(el, onChange) {
		this.el = el;
		this.onChange = onChange;

		this.initListeners()
	}

	initListeners() {
		this.el.addEventListener( 'click', (event) => {
			const target = event.target

			let page

			if (target.dataset.page) {
				page = +target.dataset.page
			} else if (target.closest('[data-page]')) {
				page = +target.closest('[data-page]').dataset.page
			} else {
				return
			}

			this.onPageChange(page)
		} );
	}

	onPageChange(page) {
		if (!page) {
			return
		}

		this.onChange(page)
	}

	renderPaginationItems(currenPage, pageCount) {
		let html = '<div class="catalog__pagination-pages">';
		if (currenPage===pageCount)
		{
			for ( let i = 1; i <= pageCount; i++ ) {
				if (i>pageCount-3||i ===1)
					html += this.renderPaginationItem(i, +currenPage);
				else if (i===4)
					html += this.renderPaginationItem(i, +currenPage, true);}
			}
		else if (currenPage===1)
		{
					for ( let i = 1; i <= pageCount; i++ ) {
						if (i<4||i ===pageCount)
							html += this.renderPaginationItem(i, +currenPage);
						else if (i===4)
							html += this.renderPaginationItem(i, +currenPage, true);}}
		else
		{
		for ( let i = 1; i <= pageCount; i++ ) {
			if ((i === 1 || i === pageCount) || (i - 1 <= currenPage && i + 1 >= currenPage))
				html += this.renderPaginationItem(i, +currenPage);
			else if (i - 2 === currenPage)
				html += this.renderPaginationItem(i, +currenPage, true);
			else if (i + 2 === currenPage)
				html += this.renderPaginationItem(i, +currenPage, true);
		}
		}
		html += '</div>'

		html += this.renderButtons(currenPage, pageCount)

		this.el.innerHTML = html;
	}

	renderPaginationItem(page, currenPage,bool) {
		if (bool)
			return `<button class="catalog__pagination-page" data-page="...">
						...
					</button>`;
		if ( page === currenPage ) {
			return `<button class="catalog__pagination-page catalog__pagination-page_select" data-page="${page}">
						${page}
					</button>`;
		} else {
			return `<button class="catalog__pagination-page" data-page="${page}">
						${page}
					</button>`;
		}
	}

	renderButtons(currenPage, pageCount) {
		return `
			<div class="catalog__pagination-by-one">
        	    <button class="catalog__pagination-arrow" data-page="${currenPage - 1}" ${currenPage === 1 ? 'disabled' : ''}>
        	        <svg class="" width="10" height="16">
        	            <use href="#arrow-pagination"></use>
        	        </svg>
        	    </button>
	
        	    <button class="catalog__pagination-arrow" data-page="${currenPage + 1}" ${currenPage === pageCount ? 'disabled' : ''}>
        	        <svg class="" width="10" height="16">
        	            <use href="#arrow-pagination"></use>
        	        </svg>
        	    </button>
        	</div>
		`
	}
}
