export default async function getFilterItems() {
    const response = await fetch('http://localhost:5000/api/catalog/filters')
    const data = await response.json()
    return data.data.items
}
