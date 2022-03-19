import navData from "@/config/catalog-data";
import catalogData from "@/config/catalog-data";

export default class Catalog {
    constructor(el) {
        this.el = document.getElementById(el);
        this.init();
    }

    init() {
        this.render();
    }

    render() {
        let container = `
			<div class="catalog__items">
		`;

        catalogData.forEach( item => {
            const name = item.name;
            const price = item.price;
            const image = item.image;

            let domElem = `
                    
                                <div class="catalog__item">
                                    <div style="background: #FFFFFF;padding: 24px 
                                    24px 145px 24px;border: 1px solid #E9E9E9;border-radius: 2px;">
                                        <div class="catalog__svgg">
                                            <svg class="catalog__svg" width="20" height="20">
                                                <use href="#basket"></use>
                                            </svg>
                                            <svg class="catalog__svg1" width="20" height="20">
                                                <use href="#basket"></use>
                                            </svg>
                                        </div>
                
                                        <img src="${image}" alt=""
                                             style="width: 100%;height:100%;object-fit: 
                                                 contain;" height="238">
                                        <div class="catalog__np">
                                            <div class="catalog__name">
                                                ${name}
                                            </div>
                                            <div class="catalog__price">
                                                ${price}
                                            </div>
                                        </div>
                                     </div>
                                </div>
			`;
            

            container += domElem;
        } );
        container += '</div>';

        this.el.innerHTML = container;
    }
    
}
