export default function initRangeInput(el, callback) {
    const leftInput = el.querySelector('input[data-range-left]')
    const rightInput = el.querySelector('input[data-range-right]')

    leftInput.addEventListener('input', event => {
        const value = +event.target.value
        leftInput.value = String(value >= +rightInput.value ? +rightInput.value - 1 : value)
        el.style.setProperty(`--left`, leftInput.value)
    })

    rightInput.addEventListener('input', event => {
        const value = +event.target.value
        rightInput.value = String(value <= +leftInput.value ? +leftInput.value + 1 : value)
        el.style.setProperty(`--right`, rightInput.value)
    })

    if (callback) {
        leftInput.addEventListener('change', () => {
            callback(+leftInput.value, +rightInput.value)
        })
        
        rightInput.addEventListener('change', () => {
            callback(+leftInput.value, +rightInput.value)
        })
    }

}