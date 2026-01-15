import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function ShippingPricesTable({ data }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: "#3b6d92", "& th": { color: "white" } }}>
          <TableRow>
            <TableCell>Shipping Method</TableCell>
            <TableCell>Country Group</TableCell>
            <TableCell>Up to Total Parcel Weight</TableCell>
            <TableCell>Shipping Band</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Price for multiple items</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx} hover>
              <TableCell>{row.method}</TableCell>
              <TableCell>{row.countryGroup}</TableCell>
              <TableCell>{row.totalWeight}</TableCell>
              <TableCell>{row.shippingBand}</TableCell>
              <TableCell>{row.price}</TableCell>
              <TableCell>{row.multiplePrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
