export default async function getCatalogItems(meta) {
    try {
        console.log(meta)
        const response = await fetch('http://localhost:5000/api/catalog/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meta)
        });
        const json = await response.json();
        
        return [json.data.items, json.data.pageCount]
        // const data = await Promise.all([
        //     new Promise(resolve => setTimeout(() => resolve(''), 500)),
        //     processData(meta)
        // ])

        // return data[1]
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
