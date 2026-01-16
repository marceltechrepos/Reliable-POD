import { TableRow, TableCell, Checkbox, Chip } from "@mui/material";

export default function ProductListRow({ product, selected, toggleSelect }) {
  return (
    <TableRow hover>
      <TableCell><Checkbox checked={selected} onChange={toggleSelect} /></TableCell>
      <TableCell>{product.title}</TableCell>
      <TableCell>${product.price}</TableCell>
      <TableCell>{product.type}</TableCell>
      <TableCell>{product.discount && <Chip label="Discount" color="success" size="small" />}</TableCell>
    </TableRow>
  );
}
