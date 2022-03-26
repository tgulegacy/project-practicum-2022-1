export default async function getCatalogItems() {
    try {
        const response = await fetch('./catalog.json');
        const json = await response.json();
        console.log( json );
        return json;
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
