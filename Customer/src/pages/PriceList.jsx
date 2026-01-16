import React, { useState, useMemo } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";

import PriceListFilters from "../components/PriceLists/PriceListFilters";
import ProductPricesTable from "../components/PriceLists/ProductPricesTable";
import ShippingPricesTable from "../components/PriceLists/ShippingPricesTable";

// Dummy Data
import { PRODUCT_PRICES, SHIPPING_PRICES, JUMP_OPTIONS } from "../components/PriceLists/dummyData";

export default function PriceLists() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [jumpTo, setJumpTo] = useState("");

  const filteredProductData = useMemo(() => {
    return PRODUCT_PRICES.filter(row =>
      (row.product.toLowerCase().includes(search.toLowerCase()) ||
        row.variant.toLowerCase().includes(search.toLowerCase()) ||
        row.shippingBand.toLowerCase().includes(search.toLowerCase())) &&
      (jumpTo ? row.product.includes(jumpTo) : true)
    );
  }, [search, jumpTo]);

  const filteredShippingData = useMemo(() => {
    return SHIPPING_PRICES.filter(row =>
      row.method.toLowerCase().includes(search.toLowerCase()) ||
      row.countryGroup.toLowerCase().includes(search.toLowerCase()) ||
      row.shippingBand.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" mb={3}>Price Lists</Typography>

      <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ mb: 3 }}>
        <Tab label="Product Prices" />
        <Tab label="Shipping Prices" />
      </Tabs>

      <PriceListFilters search={search} setSearch={setSearch} jumpTo={jumpTo} setJumpTo={setJumpTo} jumpOptions={JUMP_OPTIONS} />

      {activeTab === 0 && <ProductPricesTable data={filteredProductData} />}
      {activeTab === 1 && <ShippingPricesTable data={filteredShippingData} />}
    </Box>
  );
}
