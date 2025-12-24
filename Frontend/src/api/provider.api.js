const getAllProvider = async () => {
  try {
    const response = await fetch("/api/Provider/get-all-provider");
    const data = await response.json();

    if (data.success) {
      return data.data;
    }
    return []; // fallback agar success false ho
  } catch (error) {
    console.log(error, "<<<<< error");
    return []; // fallback agar fetch fail ho
  }
}


export {
    getAllProvider
}