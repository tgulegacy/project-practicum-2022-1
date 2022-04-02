export default async function getCatalogItems(meta) {
    try {
        // const response = await fetch('./catalog.json');
        // const json = await response.json();
        const data = await Promise.all([
            new Promise(resolve => setTimeout(() => resolve(''), 500)),
            processData(meta)
        ])

        return data[1]
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function processData({page, filters, limit, sort}) {
    const response = await fetch('./catalog.json');
    let data = await response.json();
    const length = data.length

    switch (sort) {
        case 'alp':
            data = data.sort((a, b) => {
                if (a.description > b.description) {
                    return 1
                } else if (a.description < b.description) {
                    return -1
                } else {
                    return 0
                }
            })
            break
        case 'price-up':
            data = data.sort((a, b) => {
                if (a.price > b.price) {
                    return 1
                } else if (a.price < b.price) {
                    return -1
                } else {
                    return 0
                }
            })
            break
        case 'price-down':
            data = data.sort((a, b) => {
                if (a.price < b.price) {
                    return 1
                } else if (a.price > b.price) {
                    return -1
                } else {
                    return 0
                }
            })
            break
    }

    data = data.slice((page - 1) * limit, page * limit)

    return [data, Math.ceil(length / limit)]
}
