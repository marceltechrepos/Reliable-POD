// src/api/product.api.js

const createProduct = async (payload) => {
  try {
    const response = await fetch('/api/create-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error, '<<<< create product error');
    return { success: false };
  }
};

export {
  createProduct
};
