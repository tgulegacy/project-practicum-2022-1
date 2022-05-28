export default async function getCatalogItems(meta) {
    try {
        const response = await fetch('http://mvc.php/api-catalog/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meta)
        });
        const json = await response.json();
        const {items, pageCount} = json

        return [items, pageCount]
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
