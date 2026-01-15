// components/Products/SelectionControls.jsx
import React from "react";
import { Box, Button, Typography } from "@mui/material";

export default function SelectionControls({ selectAllVisible, selectNone, selectedCount, totalVisible }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" size="small" onClick={selectAllVisible}>Select All</Button>
        <Button variant="outlined" size="small" onClick={selectNone}>Select None</Button>
      </Box>

      <Typography variant="body2" color="text.secondary">
        Selected: <strong>{selectedCount}</strong> / {totalVisible}
      </Typography>
    </Box>
  );
}
