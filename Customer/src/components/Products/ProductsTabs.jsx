// // components/Products/ProductsTabs.jsx
// import React from "react";
// import { Button, Stack } from "@mui/material";
// import LocalOfferIcon from "@mui/icons-material/LocalOffer";
// import ListAltIcon from "@mui/icons-material/ListAlt";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import CategoryIcon from "@mui/icons-material/Category";

// const tabDefs = [
//   { id: "all", label: "All Products", icon: <InventoryIcon /> },
//   { id: "discounted", label: "Discounted", icon: <LocalOfferIcon /> },
//   { id: "details", label: "Detail List", icon: <ListAltIcon /> },
//   { id: "cart", label: "Cart List", icon: <ShoppingCartIcon /> },
//   { id: "store", label: "Store", icon: <CategoryIcon /> },
// ];

// export default function ProductsTabs({ activeTab, setActiveTab, viewMode, setViewMode }) {
//   return (
//     <Stack direction="row" spacing={2} alignItems="center">
//       {tabDefs.map((t) => {
//         const active = activeTab === t.id;
//         return (
//           <Button
//             key={t.id}
//             variant={active ? "contained" : "outlined"}
//             startIcon={t.icon}
//             onClick={() => setActiveTab(t.id)}
//             sx={{
//               textTransform: "none",
//               bgcolor: active ? "#3b6d92" : undefined,
//               color: active ? "#fff" : "#3b6d92",
//               "&:hover": { bgcolor: active ? "#355a78" : undefined },
//               borderRadius: 2
//             }}
//           >
//             {t.label}
//           </Button>
//         );
//       })}
//     </Stack>
//   );
// }



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


