export default class Catalog {
    constructor(el) {
        this.el = el
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
