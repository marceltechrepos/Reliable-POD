// components/OrdersTabs.jsx
import { Tabs, Tab, Box } from "@mui/material";

export default function OrdersTabs({ value, onChange }) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
      <Tabs value={value} onChange={onChange} centered>
        <Tab label="All Orders" />
        <Tab label="Orders Requiring Attention" />
        <Tab label="Store Orders" />
      </Tabs>
    </Box>
  );
}
