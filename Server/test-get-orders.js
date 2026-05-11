async function testGetOrders() {
  const url = "http://localhost:8000/api/orders";
  console.log("Fetching", url);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
testGetOrders();
