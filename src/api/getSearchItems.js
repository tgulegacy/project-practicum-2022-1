export default async function getSearchItems(search) {
    const response = await fetch(`http://localhost:5000/api/search?q=${search}`)
    const data = await response.json()
    return data.data.items
}