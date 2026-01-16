// components/Products/ProductRow.jsx
import React from "react";
import { TableRow, TableCell, Checkbox, IconButton, Chip, Stack } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function ProductRow({ row, isSelected, onToggleSelect }) {
  return (
    <TableRow hover selected={isSelected}>
      <TableCell padding="checkbox">
        <Checkbox checked={isSelected} onChange={onToggleSelect} />
      </TableCell>

      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* small placeholder avatar */}
          <div style={{ width: 48, height: 48, borderRadius: 8, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
            {row.name.split(" ").map(x => x[0]).slice(0,2).join("")}
          </div>

          <div>
            <div style={{ fontWeight: 700 }}>{row.name}</div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>{row.id} • {row.type}</div>
          </div>
        </Stack>
      </TableCell>

      <TableCell>{row.type}</TableCell>
      <TableCell>{row.createdAt}</TableCell>

      <TableCell align="right">
        ${row.price.toFixed(2)}
      </TableCell>

      <TableCell align="center">
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          {row.discount && <Chip icon={<LocalOfferIcon />} label="discount" size="small" color="primary" sx={{ textTransform: "uppercase", fontWeight: 700 }} />}

          <IconButton size="small" title="View details">
            <VisibilityIcon />
          </IconButton>

          <IconButton size="small" title="Add to cart">
            <ShoppingCartIcon />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
