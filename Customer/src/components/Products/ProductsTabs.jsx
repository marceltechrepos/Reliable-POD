import { Tabs, Tab, Box } from "@mui/material";

export default function ProductTabs({ tab, setTab }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
        <Tab label="My Products" />
        <Tab label="Available Pre-designs" />
        <Tab label="Licenced Pre-designs" />
      </Tabs>
    </Box>
  );
}


