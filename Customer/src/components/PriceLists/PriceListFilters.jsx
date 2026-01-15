import React from "react";
import { Box, TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";

export default function PriceListFilters({ search, setSearch, jumpTo, setJumpTo, jumpOptions }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
      <TextField
        label="Search Name, SKU, Shipping Band"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ flex: 1, minWidth: 250 }}
      />

      <FormControl size="small" sx={{ minWidth: 250 }}>
        <InputLabel>Jump To</InputLabel>
        <Select value={jumpTo} label="Jump To" onChange={(e) => setJumpTo(e.target.value)}>
          {jumpOptions.map((item, idx) => (
            <MenuItem key={idx} value={item}>{item}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
