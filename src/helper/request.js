const baseUrl = `http://localhost:5000`;

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export default {
  getAllOutlets: () => fetch(`${baseUrl}/outlets`),
  createOutlet: (outlet) => fetch(`${baseUrl}/outlets`, {
    method: 'POST',
    headers,
    body: JSON.stringify(outlet)
  }),
  getAllpurchaseEntriesForOutlet: (outletId, date) => fetch(`${baseUrl}/purchaseEntries/on-date`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      outletId,
      date
    })
  }),
  getAlltheItems: () => fetch(`${baseUrl}/rowMaterials`),
  getAlltheStockItems: () => fetch(`${baseUrl}/stockItems`),
  createPurchaseEntry: (purchaseData) => fetch(`${baseUrl}/purchaseEntries`, {
    method: 'POST',
    headers,
    body: JSON.stringify(purchaseData)
  }),
  createStockItemEntry: (stockItemData) => fetch(`${baseUrl}/inventoryCouting`, {
    method: 'POST',
    headers,
    body: JSON.stringify(stockItemData)
  }),
  getAllstockCountingsForOutlet: (outletId, date) => fetch(`${baseUrl}/inventoryCouting/on-date`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      outletId,
      date
    })
  }),
};