const url = "http://localhost:8000/api/orders";

const payload = {
  shopify_store_id: "test-store.myshopify.com",
  shopify_order_id: Math.floor(Math.random() * 10000000000), // Random to avoid duplicate errors on re-runs
  shopify_graphql_id: "gid://shopify/Order/6184470872238",
  order_number: Math.floor(Math.random() * 10000),
  order_name: "#1003",
  confirmation_number: "3LTMIE5H0",
  token: "2c304bfffef1e75ea8c861d303e251dd",
  payment_gateway: ["stripe"],
  payment_status: "paid",
  financial_status: "paid",
  total_price: "736.85",
  subtotal_price: "729.95",
  total_tax: "6.90",
  total_discounts: "0.00",
  currency: "USD",
  presentment_currency: "USD",
  fulfillment_status: null,
  customer: {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com"
  },
  shipping_address: {
    address1: "123 Main St",
    city: "New York",
    country: "US"
  },
  billing_address: {
    address1: "123 Main St",
    city: "New York",
    country: "US"
  },
  line_items: [
    {
      id: 123456,
      sku: "WH-BLK-001",
      title: "Cool T-Shirt",
      quantity: 2,
      price: "368.42",
      product_id: 987654,
      variant_id: 112233,
      name: "Cool T-Shirt - Black / M"
    }
  ],
  test_order: true,
  confirmed: true,
  source_name: "web",
  browser_ip: "27.96.92.248",
  shopify_created_at: "2025-11-20T21:04:43.000+00:00",
  shopify_updated_at: "2025-11-20T21:04:44.000+00:00",
  processed_at: "2025-11-20T21:04:39.000+00:00"
};

async function testCreateOrder() {
  try {
    console.log("Sending POST request to:", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error connecting to server:", error.message);
    console.log("Make sure the backend server is running on http://localhost:8080");
  }
}

testCreateOrder();
