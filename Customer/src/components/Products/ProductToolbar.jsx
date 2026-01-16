import React from "react";
import { Box, TextField, IconButton, InputAdornment, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";

const ProductToolbar = ({
  search,
  setSearch,
  filter,
  setFilter,
  viewMode,
  setViewMode,
  productNames,
}) => {
  return (
    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mb={3} justifyContent="center">
      <TextField
        size="small"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"><SearchIcon /></InputAdornment>
          ),
        }}
      />

      <TextField
        select
        size="small"
        label="Filter by Name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ minWidth: 160 }}
      >
        <MenuItem value="">All</MenuItem>
        {productNames.map((name) => (
          <MenuItem key={name} value={name}>{name}</MenuItem>
        ))}
      </TextField>

      <IconButton onClick={() => setViewMode("card")} color={viewMode === "card" ? "primary" : "default"}>
        <ViewModuleIcon />
      </IconButton>

      <IconButton onClick={() => setViewMode("list")} color={viewMode === "list" ? "primary" : "default"}>
        <ViewListIcon />
      </IconButton>
    </Box>
  );
};

export default ProductToolbar;
