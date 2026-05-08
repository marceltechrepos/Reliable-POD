export const validateOrderPayload = (data) => {
    const errors = [];

    if (!data.shopify_order_id) errors.push("shopify_order_id is required.");
    if (!data.shopify_store_id) errors.push("shopify_store_id is required.");
    if (!data.total_price) errors.push("total_price is required.");
    if (!data.currency) errors.push("currency is required.");
    
    // Check if line_items is an array
    if (data.line_items && !Array.isArray(data.line_items)) {
        errors.push("line_items must be an array.");
    }

    return errors;
};
