import getBasketItems from "@/api/getBasketItems";

export default class Basket {
    constructor(el, basketInfo) {
        this.el = el

        this.basketInfo = basketInfo
        this.basketItems = null

        this.countProducts = 0
        this.sum = 0
        this.oldSum = 0
        this.discount = 0
        this.basketLength = 0
    }

    async init() {
        try {
            this.basketItems = await getBasketItems();
            this.renderItems(this.basketItems.items)
            this.basketLength = this.basketItems.items.length

            this.sum = this.basketItems.sum
            this.oldSum = this.basketItems.oldSum

            this.renderInfo(this.basketItems)

            await this.updateBasketLength()

            this.initChangeProduct()
        } catch (e) {
            console.log(e)
        }
    }

    renderItems(data) {
        let html = ``

        data.forEach(item => {
            html += this.renderItem(item)
        })

        this.el.innerHTML = html
    }

    renderItem(item) {
        const isDiscount = item.hasOwnProperty('oldPrice')
        const itemPrice = isDiscount ?
            `<div class="basket-card__old-price" product-old-price>${item.oldPrice} ₽</div>
            <div class="basket-card__current-price" product-price>${item.price} ₽</div>`
            : `<div class="basket-card__current-price" product-price>${item.price} ₽</div>`

        let html = `
            <div class="basket-card" id="basket-card${item.id}">
                <div class="basket-card__inner">
    
                  <div class="basket-card__image">
                    <img src="${item.image}" alt="">
                  </div>
    
                  <div class="basket-card__container">
                        <div class="basket-card__info">
                            <p class="basket-card__description">
                                ${item.description}
                            </p>
    
                            <div class="basket-card__price">
        `

        html += itemPrice

        html += `
                            </div>
                        </div>
                    <div class="basket-card__controls">
                        <div class="basket-card__count">
                            <button class="basket-card__decrement" id="decrement${item.id}" basket-item-decrement>-</button>
                            <input class="basket-card__count-control" id="basket-count${item.id}" value="${item.count}" basket-count>
                            <button class="basket-card__increment" id="increment${item.id}" basket-item-increment>+</button>
                    </div>
                    <div class="basket-card__delete" id="card-delete${item.id}" delete-basket-item>
                        <svg width="18" height="24" >
                            <use href="#trash"></use>
                        </svg>
                    </div>
                </div>
                </div>
            </div>
        </div>
        `

        return html
    }

    renderInfo(data) {
        this.discount = this.oldSum - this.sum

        for(let i = 0; i < data.items.length; i++) {
            this.countProducts += data.items[i].count
        }

        this.basketInfo.innerHTML = `
            <div class="basket__info-order">
                <span class="basket__info-order-heading">Информация о заказе</span>
    
                <div class="basket__info-order-count">
                  <span>Количество товаров:</span>
                  <span id="basket-count">${this.countProducts.toLocaleString('ru')}</span>
                </div>
    
                <div class="basket__info-order-cost">
                  <span>Стоимость:</span>
                  <span id="basket-old-sum">${this.oldSum.toLocaleString('ru')} ₽</span>
                </div>
    
                <div class="basket__info-order-discount">
                  <span>Скидка:</span>
                  <span class="basket__info-order-discount-sum" id="basket-discount">- ${this.discount.toLocaleString('ru')} ₽</span>
                </div>
            </div>
            <div class="basket__info-to-pay">
                <span class="basket__info-to-pay-text">Итого к оплате: </span>
                <span class="basket__info-to-pay-sum" id="basket-sum">${this.sum.toLocaleString('ru')} ₽</span>
            </div>
    
            <button class="basket__info-btn-ordering" id="btn-order">Оформить заказ</button>
        `
    }

    initChangeProduct() {
        const incrementButtons = document.querySelectorAll('[basket-item-increment]')
        const decrementButtons = document.querySelectorAll('[basket-item-decrement]')

        const deleteButtons = document.querySelectorAll('[delete-basket-item]')

        const clearBasket = document.getElementById('clear-basket')

        const countInputs = document.querySelectorAll('[basket-count]')

        incrementButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = +e.path[0].id.replace('increment', '')

                let {previousCount, productPrice, productOldPrice} = this.getInfoBasket(e)

                await this.incrementProduct(id, previousCount, productPrice, productOldPrice)
            })
        })

        decrementButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = +e.path[0].id.replace('decrement', '')

                let {previousCount, productPrice, productOldPrice} = this.getInfoBasket(e)

                await this.decrementProduct(id, previousCount, productPrice, productOldPrice)
            })
        })

        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = +e.path[2].id.replace('card-delete', '')
                await this.deleteProduct(id,this.getInfoCard(e))
            })
        })

        clearBasket.addEventListener('click', async () => {
            await this.clearBasket()
        })

        countInputs.forEach(input => {
            let previousCount;

            input.addEventListener(
                'focus',
                (e) => {
                    previousCount = +e.target.value
                },
                true
            )

            input.addEventListener('change', async (e) => {
                const id = +e.path[0].id.replace('basket-count', '')
                const quantity = +e.path[0].value

                let {productPrice, productOldPrice} = this.getInfoBasket(e)

                await this.changeCount(id, quantity, previousCount, productPrice, productOldPrice)
            })
        })
    }

    getInfoBasket(event) {
        let productOldPrice = 0

        const previousCount = +event.path[1].querySelector('[basket-count]').value
        const productPrice = +event.path[3].querySelector('[product-price]').innerText.replace('₽', '')
        const isDiscount = !!event.path[3].querySelector('[product-old-price]') && true;

        if(isDiscount) {
            productOldPrice = +event.path[3].querySelector('[product-old-price]').innerText.replace('₽', '')
        }

        return {previousCount, productPrice, productOldPrice}
    }

    getInfoCard(event){
        console.log(event.path)
        const cardCount = +event.path[3].querySelector('[basket-count]').value
        const cardPrice = +event.path[4].querySelector('[product-price]').innerText.replace('₽', '')
        const isDiscount = !!event.path[4].querySelector('[product-old-price]') && true;
        let cardOldPrice=0
        if(isDiscount) {
            cardOldPrice = +event.path[4].querySelector('[product-old-price]').innerText.replace('₽', '')
        }
        return{cardCount, cardPrice, cardOldPrice}
    }

    async clearBasket() {
        const result = await fetch(`http://localhost:5000/api/basket/clear`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (result.ok) {
            document.getElementById('basket-items').innerHTML = ''

            document.getElementById(`basket-count`).innerText = (0).toString();
            document.getElementById(`basket-old-sum`).innerText = (0).toString() + ' ₽';
            document.getElementById(`basket-discount`).innerText = '- ' + (0).toString() + ' ₽';
            document.getElementById(`basket-sum`).innerText = (0).toString() + ' ₽';
            document.getElementById('basket-length').innerText = (0).toString()
        }
    }

    async incrementProduct(id, previousCount, productPrice, productOldPrice) {
        previousCount++

        const body = { "id": id, "quantity": previousCount }

        const result = await fetch(`http://localhost:5000/api/basket`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })

        if(result.ok) {
            this.countProducts++
            this.sum += productPrice

            if(productOldPrice) {
                this.discount += productOldPrice - productPrice
                this.oldSum += productOldPrice
            } else {
                this.oldSum += productPrice
            }

            document.getElementById(`basket-count${id}`).value = (previousCount++).toLocaleString('ru');

            this.updateOrderInfo()
        }
    }

    async decrementProduct(id, previousCount, productPrice, productOldPrice) {
        if(previousCount === 1) {
            setTimeout (() => {
                document.getElementById(`basket-card${id}`).remove()
            }, 1000)
        }

        previousCount--

        const body = { "id": id, "quantity": previousCount }

        const result = await fetch(`http://localhost:5000/api/basket`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })

        if(result.ok) {
            this.countProducts--
            this.sum -= productPrice

            if(productOldPrice) {
                this.discount -= productOldPrice - productPrice
                this.oldSum -= productOldPrice
            } else {
                this.oldSum -= productPrice
            }

            document.getElementById(`basket-count${id}`).value = (previousCount--).toLocaleString('ru')

            this.updateOrderInfo()
        }
    }

    async deleteProduct(id,cardData) {
        const body = { "id": id, "quantity": 0}

        const result = await fetch(`http://localhost:5000/api/basket`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (result.ok) {
            document.getElementById(`basket-card${id}`).remove()
            this.basketItems.items.splice(id)
            this.basketLength = this.basketLength - 1
            if(cardData.cardOldPrice!==0){
                this.oldSum-=cardData.cardOldPrice*cardData.cardCount
                this.discount-=(cardData.cardOldPrice-cardData.cardPrice)*cardData.cardCount
            }
            else this.oldSum-=cardData.cardPrice*cardData.cardCount
            this.sum=this.oldSum-this.discount
            this.countProducts-=cardData.cardCount
            this.updateBasketLength()
            this.updateOrderInfo()
        }

    }

    async changeCount(id, quantity, previousCount, productPrice, productOldPrice) {
        if (previousCount === quantity) {
            return
        } else if (quantity === 0) {
            setTimeout (() => {
                document.getElementById(`basket-card${id}`).remove()
            }, 3000)
        }

        const count = Math.abs(previousCount - quantity)

        let discountPrice;
        if (productOldPrice) {
            discountPrice = productOldPrice - productPrice
        }

        const body = { "id": id, "quantity": quantity }

        const result = await fetch(`http://localhost:5000/api/basket`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (result.ok) {
            if (previousCount > quantity) {
                this.countProducts -= count
                this.sum -= productPrice * count

                if(productOldPrice) {
                    this.discount -= discountPrice * count
                    this.oldSum -= productOldPrice * count
                } else {
                    this.oldSum -= productPrice * count
                }
            } else if (previousCount < quantity) {
                this.countProducts += count
                this.sum += productPrice * count

                if(productOldPrice) {
                    this.discount += discountPrice * count
                    this.oldSum += productOldPrice * count
                } else {
                    this.oldSum += productPrice * count
                }
            }

            this.updateOrderInfo()
        }
    }

    updateOrderInfo() {
        document.getElementById(`basket-count`).innerText = (this.countProducts).toLocaleString('ru');
        document.getElementById(`basket-old-sum`).innerText = (this.oldSum).toLocaleString('ru') + ' ₽';
        document.getElementById(`basket-discount`).innerText = '- ' + (this.discount).toLocaleString('ru') + ' ₽';
        document.getElementById(`basket-sum`).innerText = (this.sum).toLocaleString('ru') + ' ₽';
    }

    updateBasketLength() {
        document.getElementById('basket-length').innerHTML = `<div class="basket-length__len">${this.basketLength}</div>`
    }
}