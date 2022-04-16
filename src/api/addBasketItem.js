export default async function addBasketItem(id, quantity) {
    try {
        const response = await fetch('http://localhost:5000/api/basket/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                quantity
            })
        });
        return await response.json()
    } catch (error) {
        console.error('Ошибка:', error);
    }
}