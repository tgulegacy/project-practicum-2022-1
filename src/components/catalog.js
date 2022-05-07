import Filter from "./filter";
import Pagination from "./pagination";
import getCatalogItems from "../api/getCatalogItems";
import Select from "./select";
import Cookie from "../utils/cookie";
import {encodeURL} from "@/utils/url";
import {addBasketItem, clearBasketItem, deleteBasketItem, getBasketItem} from "@/api/addBasketItem";
import getSearchItems from "@/api/getSearchItems";

export default class Catalog {
    constructor(el, el1, filterEl, paginationEl) {
        this.el = el
        this.el1 = el1
        this.filterEl = filterEl
        this.paginationEl = paginationEl
        this.searchItems = null
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
        this.search()
        this.initInput()
        this.setLoading(true)
        this.basketRender()
        const pro = document.getElementsByClassName('basket container')[0]
        pro.style.display = 'none'

        try {
            this.meta.page = this.getCurrentPage()
            this.meta.sort = Cookie.getCookie('catalog-sort') || 'alp'

            let basketEl = document.querySelector('#countBasket');
            basketEl.innerHTML = (await getBasketItem()).data.items.length
            
            this.elements.filter = await new Filter(this.filterEl, async (data) => {
                this.meta.page = 1
                this.meta.filters = data
                await this.onMetaChange()
            }, this.meta.filters)
            await this.elements.filter.init()
            this.meta.filters = this.elements.filter.getCurrentFilter()

            const [items, pageCount] = await getCatalogItems(this.meta)
            this.renderItems(items)
            this.initBasketToggleListeners()

            const sortEl = document.getElementById('sort')
            this.elements.sort = new Select({el: sortEl, onChange: async (item) => {
                    console.log(item.value)
                    this.meta.sort=item.value
                    await this.onMetaChange()
                },
                cookieName: 'catalog-sort'

            })
            
            const limitEl = document.getElementById('limit')
            this.elements.sort = new Select({el: limitEl, onChange: async (item) => {
                    console.log(item.value)
                    this.meta.limit=item.value
                    await this.onMetaChange()
                },
                cookieName: 'catalog-limit'

            })

            this.elements.pagination = new Pagination(this.paginationEl, async (page) => {
                this.meta.page = +page
                await this.onMetaChange()
            })
            this.elements.pagination.renderPaginationItems(this.meta.page, pageCount)

            window.onpopstate = (async () => {
                this.meta.page = this.getCurrentPage()
                this.meta.filters = this.elements.filter.getCurrentFilter()

                this.elements.filter.changeData(this.meta.filters)
                this.elements.pagination.renderPaginationItems(this.meta.page, pageCount)

                await this.onMetaChange(false)
            })
        } catch (e) {
            console.log(e)
        } finally {
            this.setLoading(false)
        }
    }
    basketRender() {
        
        
        const a = document.querySelector('#linkas')
        a.addEventListener('click', async () => {
            console.log(1234)
            const pro = document.getElementsByClassName('catalog')[0]
            pro.style.display = 'none'
            const pro1 = document.getElementsByClassName('basket container')[0]
            pro1.style.display = 'block'
            const basket = document.getElementById('show_catalog')
            basket.addEventListener('click', () => {
                pro.style.display = 'block'
                pro1.style.display = 'none'
            })
            
            const b = document.querySelector('#basket-clear')
           b.addEventListener('click', async () => {
              console.log("bbb")
             await clearBasketItem()
              let basketEl = document.querySelector('#countBasket');
               basketEl.innerHTML = (await getBasketItem()).data.items.length
               location.reload()
                })


           // console.log("cc")
            //const c = document.querySelectorAll('.delete')
           // c.addEventListener('click', async () => {
           //     console.log("cccc")
            //})

           
           
            



           // result.length
            let summ=0
            let basketCod = '<div class="basket-noFlex">'
            
            const result = (await getBasketItem()).data.items
            console.log(result.length)
            const sum = (await getBasketItem()).data.sum
            const oldSum = (await getBasketItem()).data.oldSum
    
           for (let item of result) {
                console.log(item.description)
               basketCod+=this.renderBasketItem(item)
               
               summ+=item.price
            }
           
           console.log(+result.oldSum)
            
            basketCod+=`</div>
                    <div class="basket__items-inf">
                    <div class="basket__items-inf3">
                        <div class="basket__items-inf1">
                            Информация о заказе
                        </div>
                        
                    </div>


                    <div class="basket__items-inf3">
                        <div class="basket__items-inf1">
                            Количество товаров:
                        </div>

                        <div class="basket__items-inf2">
                            ${result.length}
                        </div>
                    </div>

                    <div class="basket__items-inf3">
                        <div class="basket__items-inf1">
                            Стоимость:
                        </div>

                        <div class="basket__items-inf2">
                            ${oldSum}
                        </div>
                    </div>

                    <div class="basket__items-inf3">
                        <div class="basket__items-inf1">
                            Скидка:
                        </div>

                        <div class="basket__items-inf2">
                             ${sum-oldSum}
                        </div>
                    </div>
                    
                    <div class="basket__items-inf4">
                        <div class="basket__items-inf1">
                            Итого к оплате:
                        </div>

                        <div class="basket__items-inf2">
                            ${sum}
                        </div>
                    </div>

                    <div class="basket__items-inf3">
                        <div class="basket__items-inf5">
                             Оформить заказ
                        </div>
                        
                    </div>
                    
                </div>`
            
            this.el1.innerHTML = basketCod
            this.initDeleteButtons()
            this.initPlusButtons()
            this.initMinButtons()
            this.initInputButtons()

            
        })
    }
    renderBasketItem(item){
        if (item.oldPrice!==undefined)
            return `<div class="basket__items-wrapper">
            <div class="basket__items" id="basket-items">
                <div class="basket-card">
                    <div class="basket-card__inner">
                        <div class="basket-card__inners">
                            

                            <img class="basket-card__image"
                                 src="${item.image}"
                                 alt="Изображение">
                            <div class="basket-card__name">
                                <div class="basket-card__description">
                                    ${item.description}
                                </div>
                                <div class="basket-card__volume">
                                    <button class="basket-card__min" data-item-id="${item.id}" data-item-idd="${item.count}">
                                        -
                                    </button>
                                    <input class="basket-card__input" data-item-id="${item.id}" data-item-idd="${item.count}" value="${item.count}">
                                        
                                    </input>
                                    <button class="basket-card__plus" data-item-id="${item.id}" data-item-idd="${item.count}">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        
                        <div class="basket-card__price">
                            <div class="basket-card__priceOld">
                                <span>
                                    ${item.oldPrice}
                                </span>
    
                                <svg class="svg-primary" width="17" height="17">
                                    <use href="#rub"></use>
                                </svg>
                            </div>
                            <div class="basket-card__priceNew">
                                <span>
                                    ${item.price}
                                </span>
    
                                <svg class="svg-primary" width="17" height="17">
                                    <use href="#rub"></use>
                                </svg>
                            </div>
                        </div>
                        
                        <button class="basket-card__delete" data-item-id="${item.id}" >
                            
                        
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>`
        else
            return `<div class="basket__items-wrapper">
            <div class="basket__items" id="basket-items">
                <div class="basket-card">
                    <div class="basket-card__inner">
                        <div class="basket-card__inners">
                            

                            <img class="basket-card__image"
                                 src="${item.image}"
                                 alt="Изображение">
                            <div class="basket-card__name">
                                <div class="basket-card__description">
                                    ${item.description}
                                </div>
                                <div class="basket-card__volume">
                                    <button class="basket-card__min" data-item-id="${item.id}"  data-item-idd="${item.count}">
                                        -
                                    </button>
                                    <input class="basket-card__input" data-item-id="${item.id}" data-item-idd="${item.count}" value="${item.count}">
 
                                    </input>
                                    <button class="basket-card__plus" data-item-id="${item.id}" data-item-idd="${item.count}">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        
                        <div class="basket-card__price">
                            <div class="basket-card__priceNew">
                                <span>
                                    ${item.price}
                                </span>
    
                                <svg class="svg-primary" width="17" height="17">
                                    <use href="#rub"></use>
                                </svg>
                            </div>
                        </div>
                        
                        <button class="basket-card__delete" data-item-id="${item.id}">
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>`
            
        
    }
    initDeleteButtons(){
        const a =[...document.getElementsByClassName('basket-card__delete')]
        console.log(a)
        a.forEach(box =>
            box.addEventListener("click", async (e) => {
                console.log("aaa")
                const element = e.target
                console.log(element)
                const id = +element.dataset.itemId
                const inBasket = !!element.dataset.basketToggle
                console.log(id)

                const result = await deleteBasketItem(id)
                location.reload()
                 

            }))
    }
    initPlusButtons(){
        const a =[...document.getElementsByClassName('basket-card__plus')]
        console.log(a)
        a.forEach(box =>
            box.addEventListener("click", async (e) => {
                console.log("aaa")
                const element = e.target
                console.log(element.dataset)
                const id = +element.dataset.itemId
                console.log(id)
                const count = +element.dataset.itemIdd
                console.log(count)
                const result = await addBasketItem(id, count+1)
                location.reload()
            }))
    }
    initMinButtons(){
        const a =[...document.getElementsByClassName('basket-card__min')]
        console.log(a)
        a.forEach(box =>
            box.addEventListener("click", async (e) => {
                console.log("aaa")
                const element = e.target
                console.log(element.dataset)
                const id = +element.dataset.itemId
                console.log(id)
                const count = +element.dataset.itemIdd
                console.log(count)
                const result2 = await addBasketItem(id, count-1)

                    
                location.reload()
            })) 
    }
    initInputButtons(){
        const a =[...document.getElementsByClassName('basket-card__input')]
        console.log(a)
        a.forEach(box =>
            box.addEventListener("keypress", async (e) => {
                if (e.key === 'Enter') {
                    console.log(box);

                    const element = e.target
                    console.log(element)
                    const id = +element.dataset.itemId
                    const count = +element.value
                    console.log(+element.value)
                    const result = await addBasketItem(id, count)
                    //location.reload()
                }
            }))
    }
    
    search(){
        const a = document.querySelector('#form')
        console.log(1)
        a.addEventListener('submit', async event =>{

            console.log(1)
            const b = document.getElementById('input')
            event.preventDefault()
            this.searchItems = await getSearchItems(b.value)
            console.log(this.searchItems)
            await this.onMetaChange()
            
            //const element = event.target
            //const param = +element.value
            




        })
    }
    
    initInput(){
        const a = document.querySelector('#input')
        a.addEventListener("keypress", async (e) => {
            if (e.key === 'Enter') {
            console.log(1234)

            }
        })
    }
    

     //function deleteItem(id){
      //   (async ()=> await  deleteBasketItem(id))()
       
        
   //}

    async onMetaChange(isPushState = true) {
        this.setLoading(true)
        if (this.searchItems===null) {

            try {
                const [items, pageCount] = await getCatalogItems(this.meta)

                this.elements.pagination.renderPaginationItems(this.meta.page, pageCount)
                this.renderItems(items)

                if (isPushState) {
                    const encodeFilterData = encodeURL([...this.meta.filters, {
                        code: 'page',
                        items: [this.meta.page]
                    }])
                    history.pushState({}, '', window.location.origin + encodeFilterData)
                }
            } catch (e) {
                console.log(e)
            } finally {
                this.setLoading(false)
            }
        }
        else{
            try {
                let [items, pageCount] = await getCatalogItems(this.meta)
                items=this.searchItems

                this.elements.pagination.renderPaginationItems(this.meta.page, pageCount)
                this.renderItems(items)

                if (isPushState) {
                    const encodeFilterData = encodeURL([...this.meta.filters, {
                        code: 'page',
                        items: [this.meta.page]
                    }])
                    history.pushState({}, '', window.location.origin + encodeFilterData)
                }
            } catch (e) {
                console.log(e)
            } finally {
                this.setLoading(false)
            }
            
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
            console.log(element)

            const id = +element.dataset.itemId
            const inBasket = !!element.dataset.basketToggle
            
            const result = await addBasketItem(id, inBasket ? 0 : 1)

            
            
            if (result.ok) {
                console.log(result)
                let basketEl = document.querySelector('#countBasket');
                basketEl.innerHTML = (await getBasketItem()).data.items.length
                
                element.classList.toggle('product-card__basket_active')
                
            }
        })
    }

}
