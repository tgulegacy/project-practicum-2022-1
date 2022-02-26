import './assets/style/index.scss'
import Select from './components/select'

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
} else {
    init();
}

function init() {
    console.log('init')
    
    const sortEl = document.getElementById('sort')

    const sortCallback = (item) => {
        console.log(item)
    }
    
    new Select({
        el: sortEl,
        onChange: sortCallback,
        cookieName: 'catalog-sort'
    })
}