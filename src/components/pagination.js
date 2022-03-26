import { catalogRenderData } from "@/server-front/catalog";
import Catalog from "@/components/catalog";
import getCatalogItems from "@/api/getCatalogItems";

export default class Pagination {
	constructor(el) {
		this.el = el;

		this.el.addEventListener( 'click', this.handlerListener );
	}

	async handlerListener(event) {
		if ( event.target.classList.contains('catalog__pagination-page') ) {
			const catalog = new Catalog(document.getElementById('catalog-items'));
			const pagination = new Pagination(document.getElementById('pagination'));
			const catalogItems = await getCatalogItems();
			const catalogRender = catalogRenderData();
			const catalogRenderObj = catalogRender(catalogItems.map((x) => x), {
				page: event.target.dataset.page,
			});
			const pagesCount = catalogRenderObj.pageCount

			const catalogPageItems = catalogRenderObj.pagination

			pagination.renderPaginationItems(pagesCount, event.target.dataset.page)

			catalog.renderItems(catalogPageItems)
		}
	}

	renderPaginationItems(pageCount, currenPage) {
		let paginationList = '';
		for ( let i = 1; i <= pageCount; i++ ) {
			paginationList += this.renderPaginationItem(i, +currenPage);
		}

		this.el.innerHTML = paginationList;
	}

	renderPaginationItem(page, currenPage) {
		// if ( arg ) {
		//     return `<button class="catalog__pagination-page">...</button>`
		// }
		if ( page === currenPage ) {
			return `<button class="catalog__pagination-page catalog__pagination-page_select"
				data-page="${page}">${page}</button>`;
		} else {
			return `<button class="catalog__pagination-page"
				data-page="${page}">${page}</button>`;
		}
	}
}
