const BASE_URL = import.meta.env.VITE_BASE_URL;

// Upload image
export const uploadCustomerImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/customer/designs/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  return await res.json();
};

// Save design
export const saveCustomerDesign = async (data) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/customer/designs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return await res.json();
};

// Get design
export const getCustomerDesign = async (productId, mockupId) => {
  const token = localStorage.getItem('token');
  const url = `${BASE_URL}/api/customer/designs/${productId}${mockupId ? `?mockupId=${mockupId}` : ''}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
};

// Delete layer
export const deleteCustomerLayer = async (layerId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/customer/designs/layer/${layerId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
};

export const updateCustomerLayer = async (layerId, data) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/customer/designs/layer/${layerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return await res.json();
};


export const getcustomerDesignByuserId = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/customer/designs/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json();

    if (!res.ok) {
      console.warn(data.message);
      return [];
    }

    return data.success ? data.data : [];
  } catch (error) {
    console.log(error, "<<< error");
    return error;
  }
}