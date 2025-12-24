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


const getProductById = async (productId) => {
    try {
        const res = await fetch("/api/get-product");
        const data = await res.json();

        if (data.success) {
            // product find by id
            const product = data.data.find(
                (item) => item._id === productId
            );

            return product || null;
        }
    } catch (error) {
        console.log(error, "<<<< getProductById error");
        return null;
    }
};


export {
    createProduct,
    getProductById
};
