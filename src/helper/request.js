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
  createPurchaseEntry: (purchaseData) => fetch(`${baseUrl}/purchaseEntries`, {
    method: 'POST',
    headers,
    body: JSON.stringify(purchaseData)
  })
};