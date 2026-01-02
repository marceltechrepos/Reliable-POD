// variant.api.js
// All variant-related API calls

import { authFetch } from "./product.api";

export const getVariants = async (productId) => {
  try {
    const res = await authFetch(`/api/${productId}/get-variant`);
    return await res.json();
  } catch (err) {
    console.error('getVariants error', err);
    return null;
  }
};

export const createVariant = async (productId, payload) => {
  try {
    const res = await authFetch(`/api/${productId}/create-variant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error('createVariant error', err);
    return null;
  }
};

export const updateVariant = async (productId, variantId, payload) => {
  try {
    const res = await authFetch(`/api/${productId}/update-variant/${variantId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error('updateVariant error', err);
    return null;
  }
};

export const deleteVariant = async (productId, variantId) => {
  try {
    const res = await authFetch(`/api/${productId}/delete-variant/${variantId}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (err) {
    console.error('deleteVariant error', err);
    return null;
  }
};
