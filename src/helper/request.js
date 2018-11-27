const baseUrl = `https://upandup-audit-backend.herokuapp.com`;
// const baseUrl = `http://192.168.0.105:5000`;

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const postMethodProps = {
  method: 'POST',
  headers
};

const deleteMethodProps = {
  method: 'DELETE'
};

const putMethodProps = {
  method: 'PUT',
  headers
};

export default {
  // Users
  getAllUsers: () => fetch(`${baseUrl}/users`),

  // outlets
  getAllOutlets: () => fetch(`${baseUrl}/outlets`),
  createOutlet: outlet => fetch(`${baseUrl}/outlets`, {
    ...postMethodProps,
    body: JSON.stringify(outlet)
  }),

  // row materials
  getAlltheItems: () => fetch(`${baseUrl}/rowMaterials`),

  // stock materials
  getAlltheStockItems: () => fetch(`${baseUrl}/stockItems`),

  // purchase entries
  getAllpurchaseEntriesForOutlet: purchaseEntryfilters => fetch(`${baseUrl}/purchaseEntries/on-date`, {
    ...postMethodProps,
    body: JSON.stringify(purchaseEntryfilters)
  }),
  createPurchaseEntry: purchaseData => fetch(`${baseUrl}/purchaseEntries`, {
    ...postMethodProps,
    body: JSON.stringify(purchaseData)
  }),
  updatePurchaseEntry: (id, purchaseData) => fetch(`${baseUrl}/purchaseEntries/${id}`, {
    ...putMethodProps,
    body: JSON.stringify(purchaseData)
  }),
  deletePurchaseEntry: id => fetch(`${baseUrl}/purchaseEntries/${id}`, {
    ...deleteMethodProps,
  }),

  // inventory counting
  getAllstockCountingsForOutlet: stockCountingFilters => fetch(`${baseUrl}/inventoryCouting/on-date`, {
    ...postMethodProps,
    body: JSON.stringify(stockCountingFilters)
  }),
  createStockItemEntry: stockItemData => fetch(`${baseUrl}/inventoryCouting`, {
    ...postMethodProps,
    body: JSON.stringify(stockItemData)
  }),
  updateStockItemEntry: (id, stockItemData) => fetch(`${baseUrl}/inventoryCouting/${id}`, {
    ...putMethodProps,
    body: JSON.stringify(stockItemData)
  }),
  deleteStockItemEntry: id => fetch(`${baseUrl}/inventoryCouting/${id}`, {
    ...deleteMethodProps,
  }),

  //stock transfer
  getAllstockTransferForOutlet: stockTransferFilters => fetch(`${baseUrl}/stockTransferEntries/on-date`, {
    ...postMethodProps,
    body: JSON.stringify(stockTransferFilters)
  }),
  createStockTransferEntry: stockTransferData => fetch(`${baseUrl}/stockTransferEntries`, {
    ...postMethodProps,
    body: JSON.stringify(stockTransferData)
  }),
  updateStockTransferEntry: (id, stockTransferData) => fetch(`${baseUrl}/stockTransferEntries/${id}`, {
    ...putMethodProps,
    body: JSON.stringify(stockTransferData)
  }),
  deleteStockTransferEntry: id => fetch(`${baseUrl}/stockTransferEntries/${id}`, {
    ...deleteMethodProps,
  }),

  // Attendance Entries
  getAllattendanceEntriesForOutlet: attendanceEntryfilters => fetch(`${baseUrl}/attendanceEntries/on-date`, {
    ...postMethodProps,
    body: JSON.stringify(attendanceEntryfilters)
  }),
  createAttendanceEntry: attendanData => fetch(`${baseUrl}/attendanceEntries`, {
    ...postMethodProps,
    body: JSON.stringify(attendanData)
  }),
  updateAttendanceEntry: (id, attendanData) => fetch(`${baseUrl}/attendanceEntries/${id}`, {
    ...putMethodProps,
    body: JSON.stringify(attendanData)
  }),
  deleteAttendanceEntry: id => fetch(`${baseUrl}/attendanceEntries/${id}`, {
    ...deleteMethodProps,
  }),
};