import React from "react";
import { Table, TableBody, TableCell, TableRow, TableHead, Avatar } from "@mui/material";

const ProductListView = ({ data }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Image</TableCell>
          <TableCell>Title</TableCell>
          <TableCell>Price</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell><Avatar src={item.image} variant="rounded" /></TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell>${item.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductListView;
