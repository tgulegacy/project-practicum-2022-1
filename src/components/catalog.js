import Filter from "./filter";
import Pagination from "./pagination";
import getCatalogItems from "../api/getCatalogItems";
import Select from "./select";
import Cookie from "../utils/cookie";

export default class Catalog {
    constructor(el, filterEl, paginationEl) {
        this.el = el
        this.filterEl = filterEl
        this.paginationEl = paginationEl
        this.elements = {
            filter: null,
            pagination: null,
            sort: null
        }
        this.meta = {
            page: null,
            filters: [],
            sort: null,
            limit: 12
        }
    }

    async init() {
        this.meta.page = this.getCurrentPage()
        this.meta.filters = this.getCurrentFilter()
        this.meta.sort = Cookie.getCookie('catalog-sort') || 'alp'

        const [items, pageCount] = await getCatalogItems(this.meta)
        this.renderItems(items)

        const sortEl = document.getElementById('sort')
        this.elements.sort = new Select({
            el: sortEl,
            onChange: (item) => {
                // TODO - доделать Select
            },
            cookieName: 'catalog-sort'
        })

        // TODO - доделать Limit

        this.elements.filter = await new Filter(this.filterEl, async (data) => {
            this.meta.filters = data
            await this.onMetaChange()
        },this.meta.filters)
        await this.elements.filter.init()

        this.elements.pagination = new Pagination(this.paginationEl, async (page) => {
            this.meta.page = +page
            await this.onMetaChange()
        })
        this.elements.pagination.renderPaginationItems(this.meta.page, pageCount)

        window.onpopstate = (async () => {
            this.meta.page = this.getCurrentPage()
            this.meta.filters = this.getCurrentFilter()

            this.elements.filter.changeData(this.meta.filters)
            this.elements.pagination.renderPaginationItems(this.meta.page, pageCount)

            await this.onMetaChange(false)
        })
    }

    async onMetaChange(isPushState = true) {
        const [items, pageCount] = await getCatalogItems(this.meta)

        this.elements.pagination.renderPaginationItems(this.meta.page, pageCount)
        this.renderItems(items)

        if (isPushState) {
            const encodeFilterData = this.encodeURL([...this.meta.filters, {code: 'page', items: [this.meta.page]}])
            history.pushState({}, '', window.location.origin + encodeFilterData)
        }
    }

    getCurrentPage() {
        const params = new URL(window.location.href).searchParams
        return +params.get('page') || 1
    }

    getCurrentFilter() {
        const params = new URL(window.location.href).searchParams
        params.delete('page')
        return this.decodeURL(params)
    }

    encodeURL(data) {
        let paramsArr = []

        data.forEach(el => {
            paramsArr.push(`${el.code}=${el.items.join(',')}`)
        })

        return `?${paramsArr.join('&')}`
    }

    decodeURL(params) {
        const filterData = []

        params.forEach((value, key) => {
            filterData.push({
                code: key,
                items: value.split(',')
            })
        })

        return filterData
    }

    renderItems(items) {
        let itemsDom = ''

        items.forEach(item => {
            itemsDom += this.renderItem(item)
        })

        this.el.innerHTML = itemsDom
    }

    renderItem(item) {
        return `
        <div class="product-card">
            <div class="product-card__inner">
                <div class="product-card__controls">
                    <svg class="svg-grey" width="24" height="22">
                        <use href="#hearth"></use>
                    </svg>

                    <div class="product-card__basket ${item.inBasket ? 'product-card__basket_active' : ''}">
                        <svg class="svg-primary" width="20" height="20">
                            <use href="#basket"></use>
                        </svg>
                    </div>
                </div>

                <img class="product-card__image"
                     src="${item.image}"
                     alt="Изображение">

                <div class="product-card__description">
                    ${item.description}
                </div>

                <div class="product-card__price">
                    <span>
                        ${item.price}
                    </span>

                    <svg class="svg-primary" width="17" height="17">
                        <use href="#rub"></use>
                    </svg>
                </div>
            </div>
        </div>`
    }
}
