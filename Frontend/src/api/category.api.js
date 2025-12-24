const getAllCategory = async () => {
  try {
    const response = await fetch("/api/Category/get-all-category");
    const data = await response.json();

    if (data.success) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.log(error, "<<<<< error");
    return [];
  }
}


const createCategory = async (payload) => {
  try {
    const response = await fetch('/api/Category/create-category', {
      method: 'POST',
      body: payload, // FormData
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create category error:', error);
    return { success: false };
  }
};

export { getAllCategory, createCategory };
