import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function ProductPricesTable({ data }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: "#3b6d92", "& th": { color: "white" } }}>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Variant</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell>Shipping Band</TableCell>
            <TableCell>RRP</TableCell>
            <TableCell>Our Production Charge</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx} hover>
              <TableCell>{row.product}</TableCell>
              <TableCell>{row.variant}</TableCell>
              <TableCell>{row.weight}</TableCell>
              <TableCell>{row.shippingBand}</TableCell>
              <TableCell>{row.rrp}</TableCell>
              <TableCell>{row.productionCharge}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
