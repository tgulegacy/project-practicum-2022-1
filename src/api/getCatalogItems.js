import catalogItemsData from "@/config/catalog-items-data";

export default async function getCatalogItems() {
    return await new Promise(resolve => {
        resolve(catalogItemsData)
    })
}
