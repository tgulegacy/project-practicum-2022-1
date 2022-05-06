export async function addBasketItem(id, quantity) {
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
export async function getBasketItem() {
    try {
        const response = await fetch('http://localhost:5000/api/basket/', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json()
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
export async function deleteBasketItem(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/basket/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id
            })
        });
        return await response.json()
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
export async function clearBasketItem() {
    try {
        const response = await fetch('http://localhost:5000/api/basket/clear', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return await response.json()
    } catch (error) {
        console.error('Ошибка:', error);
    }
}