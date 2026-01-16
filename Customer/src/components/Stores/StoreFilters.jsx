import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Button,
  FormControl,
  InputLabel
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import AppsIcon from "@mui/icons-material/Apps";

const TYPES = ["All", "Shopify", "Etsy", "Manual Order", "WooCommerce", "Anywhere POD"];

export default function StoreFilters({ search, setSearch, type, setType, view, setView, onCreate }) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
      
      <TextField
        size="small"
        placeholder="Search stores…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ width: 260 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 20, opacity: 0.7 }} />
            </InputAdornment>
          ),
        }}
      />

      <FormControl size="small" sx={{ width: 200 }}>
        <InputLabel>Store Type</InputLabel>
        <Select value={type} label="Store Type" onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
        <IconButton
          onClick={() => setView("list")}
          sx={{
            bgcolor: view === "list" ? "primary.main" : "transparent",
            color: view === "list" ? "#fff" : "inherit",
            borderRadius: 2,
            p: 1.2,
          }}
        >
          <ViewListIcon />
        </IconButton>

        <IconButton
          onClick={() => setView("card")}
          sx={{
            bgcolor: view === "card" ? "primary.main" : "transparent",
            color: view === "card" ? "#fff" : "inherit",
            borderRadius: 2,
            p: 1.2,
          }}
        >
          <AppsIcon />
        </IconButton>

        <Button variant="contained" onClick={onCreate} sx={{ borderRadius: 2, px: 2.5 }}>
          + Add Store
        </Button>
      </Box>

    </Box>
  );
}
