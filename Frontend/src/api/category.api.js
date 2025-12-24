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

export { getAllCategory };
