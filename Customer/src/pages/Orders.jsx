// pages/Orders.jsx
import React, { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import OrdersTabs from "../components/Orders/OrdersTabs";
import OrdersFilters from "../components/Orders/OrdersFilters";
import OrdersTable from "../components/Orders/OrdersTable";

const dummyOrders = [
  { id: 1, orderId: "ORD-001", customer: "John Doe", status: "Pending", date: "2025-01-05", total: 240 },
  { id: 2, orderId: "ORD-002", customer: "Sarah Smith", status: "In production", date: "2025-01-06", total: 520 },
  { id: 3, orderId: "ORD-003", customer: "Michael Brown", status: "Held", date: "2025-01-07", total: 120 },
  { id: 4, orderId: "ORD-004", customer: "Emma Wilson", status: "Completed", date: "2025-01-09", total: 940 },
  { id: 5, orderId: "ORD-005", customer: "David Carter", status: "Rejected", date: "2025-01-10", total: 310 },
];

const Orders = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredData = dummyOrders.filter(
    (o) =>
      (status === "All" || o.status === status) &&
      (o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.orderId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Orders
      </Typography>

      <OrdersTabs value={tab} onChange={(e, newValue) => setTab(newValue)} />

      <Box mt={3}>
        <OrdersFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />

        <OrdersTable
          data={filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={(e, newPage) => setPage(newPage)}
          handleChangeRowsPerPage={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>
    </Container>
  );
};

export default Orders;
