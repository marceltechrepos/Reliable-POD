// components/Products/ProductsTable.jsx
import React from "react";
import {
  Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TablePagination, Checkbox, IconButton, Box, Typography, Avatar
} from "@mui/material";
import ProductRow from "./ProductRow";

export default function ProductsTable({
  data = [],
  allDataCount = 0,
  page, rowsPerPage, setPage, setRowsPerPage,
  selectedIds = [], setSelectedIds,
  onToggleSelect,
  viewMode, setViewMode
}) {
  return (
    <Paper elevation={2} sx={{ borderRadius: 3 }}>
      <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{allDataCount} products</Typography>

        <Box>
          <IconButton onClick={() => setViewMode("grid")} size="small" title="Grid">
            <Avatar sx={{ bgcolor: viewMode === "grid" ? "#3b6d92" : "transparent", width: 32, height: 32 }}>
              G
            </Avatar>
          </IconButton>
          <IconButton onClick={() => setViewMode("detail")} size="small" title="Detail view">
            <Avatar sx={{ bgcolor: viewMode === "detail" ? "#3b6d92" : "transparent", width: 32, height: 32 }}>
              D
            </Avatar>
          </IconButton>
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={data.length > 0 && data.every(r => selectedIds.includes(r.id))}
                onChange={(e) => {
                  if (e.target.checked) {
                    // select visible on current page
                    const ids = data.map(r => r.id);
                    setSelectedIds(prev => Array.from(new Set([...prev, ...ids])));
                  } else {
                    // unselect visible on current page
                    setSelectedIds(prev => prev.filter(x => !data.map(r => r.id).includes(x)));
                  }
                }}
              />
            </TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row) => (
            <ProductRow
              key={row.id}
              row={row}
              isSelected={selectedIds.includes(row.id)}
              onToggleSelect={() => onToggleSelect(row.id)}
            />
          ))}

          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={allDataCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
}
