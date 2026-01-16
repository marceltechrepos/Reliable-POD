// components/OrdersFilters.jsx
import { Box, TextField, MenuItem } from "@mui/material";

const statuses = [
  "All",
  "Pending",
  "In production",
  "Held",
  "Completed",
  "Rejected",
  "Cancelled",
];

export default function OrdersFilters({ search, setSearch, status, setStatus }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        mb: 2,
        justifyContent: "space-between",
      }}
    >
      <TextField
        label="Search Orders"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ flex: 1, minWidth: 250 }}
      />

      <TextField
        select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        sx={{ width: 200 }}
      >
        {statuses.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
