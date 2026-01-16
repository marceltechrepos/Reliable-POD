import React, { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Masonry from "react-masonry-css";

import { CATALOGUES } from "../components/Catalogue/data";
import CatalogueFilters from "../components/Catalogue/CatalogueFilters";
import CatalogueCard from "../components/Catalogue/CatalogueCard";

export default function Catalogue() {
  const [search, setSearch] = useState("");
  const [discountOnly, setDiscountOnly] = useState(false);

  const filtered = useMemo(() => {
    let arr = CATALOGUES;
    if (search) arr = arr.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    if (discountOnly) arr = arr.filter(c => c.discount);
    return arr;
  }, [search, discountOnly]);

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" mb={3}>Product Catalogue</Typography>

      {/* Search + Discount */}
      <CatalogueFilters
        search={search}
        setSearch={setSearch}
        discountOnly={discountOnly}
        setDiscountOnly={setDiscountOnly}
      />

      {/* Masonry Grid */}
      {filtered.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {filtered.map(c => (
            <CatalogueCard key={c.id} catalogue={c} />
          ))}
        </Masonry>
      ) : (
        <Typography mt={4} color="text.secondary">
          No catalogue found.
        </Typography>
      )}
    </Box>
  );
}
