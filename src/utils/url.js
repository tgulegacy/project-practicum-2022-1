function encodeURL(data) {
    let paramsArr = []

    data.forEach(el => {
        paramsArr.push(`${el.code}=${el.items.join(',')}`)
    })

    return `?${paramsArr.join('&')}`
}

function decodeURL(params) {
    const filterData = []

    params.forEach((value, key) => {
        filterData.push({
            code: key,
            items: value.split(',')
        })
    })

    return filterData
}

export {
    encodeURL,
    decodeURL
}