import filterItemsData from "@/config/filter-items-data";

export default async function getFilterItems() {
    // const response = await fetch('/api/getFilterItems')
    // const data = await response.json()
    // return data
    return await new Promise(resolve => {
        resolve(filterItemsData)
    })
}
