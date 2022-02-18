import './assets/style/index.scss'

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
} else {
    init();
}

function init() {
    console.log('init')
}