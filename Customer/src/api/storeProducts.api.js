// API base URL - change according to your environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.expresspod.cloud';

export const fetchStoreProducts = async (storeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/custom-product/store/${storeId}/imported`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching store products:', error);
    throw error;
  }
};

export const syncStoreProducts = async (storeId) => {
  // You can implement sync logic here if needed
  // For now, just refetch products
  return await fetchStoreProducts(storeId);
};

export const exportProducts = async (storeId, products) => {
  try {
    // Create CSV data
    const csvData = products.map(product => ({
      'Product Name': product.name,
      'Price': product.price,
      'Status': product.imported ? 'Published' : 'Draft',
      'Created Date': new Date(product.createdAt).toLocaleDateString(),
      'Last Updated': new Date(product.updatedAt).toLocaleDateString()
    }));

    // Convert to CSV
    const headers = Object.keys(csvData[0]);
    const csvRows = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `store-products-${storeId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error exporting products:', error);
    throw error;
  }
};