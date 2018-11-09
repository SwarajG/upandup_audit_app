const baseUrl = `http://localhost:5000`;

export default {
  getAllOutlets: () => fetch(`${baseUrl}/outlets`),
  createOutlet: (outlet) => fetch(`${baseUrl}/outlets`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(outlet)
  })
};