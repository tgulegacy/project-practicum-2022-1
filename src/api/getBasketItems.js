export default async function getBasketItems() {
    let response = await fetch(`http://localhost:5000/api/basket`)
    let data = await response.json()
    return data.data
}