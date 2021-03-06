import Filter from "./filter";
import Pagination from "./pagination";
import getCatalogItems from "../api/getCatalogItems";
import Select from "./select";
import Cookie from "../utils/cookie";
import {encodeURL} from "@/utils/url";
import addBasketItem from "@/api/addBasketItem";

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
            limit: 12,
            q: null
        }
    }

    async init() {
        this.setLoading(true)

        try {
            this.meta.page = this.getCurrentPage()
            this.meta.query = this.getCurrentQuery()
            this.meta.sort = Cookie.getCookie('catalog-sort') || 'alp'

            if (this.filterEl) {
                this.elements.filter = await new Filter(this.filterEl, async (data) => {
                    this.meta.page = 1
                    this.meta.filters = data
                    await this.onMetaChange()
                }, this.meta.filters)
                await this.elements.filter.init()
                this.meta.filters = this.elements.filter.getCurrentFilter()
            }

            // const [items, pageCount] = await getCatalogItems(this.meta)
            // this.renderItems(items)
            this.initBasketToggleListeners()

            const sortEl = document.getElementById('sort')
            this.elements.sort = new Select({
                el: sortEl,
                onChange: (item) => {
                    // TODO - доделать Select
                },
                cookieName: 'catalog-sort'
            })

            // TODO - доделать Limit

            this.elements.pagination = new Pagination(this.paginationEl, async (page) => {
                this.meta.page = +page
                await this.onMetaChange()
            })
            // this.elements.pagination.renderPaginationItems(this.meta.page, pageCount)

            window.onpopstate = (async () => {
                this.meta.page = this.getCurrentPage()
                this.meta.query = this.getCurrentQuery()

                if (this.elements.filter) {
                    this.meta.filters = this.elements.filter.getCurrentFilter()
                    this.elements.filter.changeData(this.meta.filters)
                }

                // this.elements.pagination.renderPaginationItems(this.meta.page, pageCount)

                await this.onMetaChange(false)
            })
        } catch (e) {
            console.log(e)
        } finally {
            this.setLoading(false)
        }
    }

    async onMetaChange(isPushState = true) {
        this.setLoading(true)

        try {
            const [items, pageCount] = await getCatalogItems(this.meta)

            this.elements.pagination.renderPaginationItems(this.meta.page, pageCount)
            this.renderItems(items)

            if (isPushState) {
                const encodeFilterData = encodeURL([...this.meta.filters, {
                    code: 'page',
                    items: [this.meta.page]
                }])
                history.pushState({}, '', window.location.origin + window.location.pathname + encodeFilterData)
            }
        } catch (e) {
            console.log(e)
        } finally {
            this.setLoading(false)
        }
    }

    setLoading(value) {
        if (value) {
            this.el.classList.add('catalog__items_loading')
        } else {
            this.el.classList.remove('catalog__items_loading')
        }
    }

    getCurrentPage() {
        const params = new URL(window.location.href).searchParams
        return +params.get('page') || 1
    }

    getCurrentQuery() {
        const params = new URL(window.location.href).searchParams
        return params.get('q')
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

                    <div class="product-card__basket ${item.inBasket ? 'product-card__basket_active' : ''}" data-basket-toggle="${item.inBasket ? '1' : ''}" data-item-id="${item.id}">
                        <svg class="svg-primary" width="20" height="20">
                            <use href="#basket"></use>
                        </svg>
                    </div>
                </div>

                <img class="product-card__image"
                     src="/img/${item.image}"
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

    initBasketToggleListeners() {
        this.el.addEventListener('click', async event => {
            if (
                !event.target.hasAttribute('data-basket-toggle') &&
                !event.target.closest('[data-basket-toggle]')
            ) {
                return
            }

            let element;
            if (event.target.hasAttribute('data-basket-toggle')) {
                element = event.target
            } else {
                element = event.target.closest('[data-basket-toggle]')
            }

            const id = +element.dataset.itemId
            const inBasket = !!element.dataset.basketToggle

            const result = await addBasketItem(id, inBasket ? 0 : 1)

            if (result.ok) {
                element.classList.toggle('product-card__basket_active')
            }
        })
    }
}
