export default async function getCatalogItems(meta) {
    try {
        const response = await fetch('http://localhost:5000/api/catalog/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meta)
        });
        const json = await response.json();
        const {items, pageCount} = json.data
        
        return [items, pageCount]
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
