import React, { useState, useMemo } from "react";
import { PRODUCTS } from "../components/Products/productData";
import ProductTabs from "../components/Products/ProductsTabs";
import ProductFilters from "../components/Products/ProductsFilters";
import ProductCard from "../components/Products/ProductCard";
import ProductListRow from "../components/Products/ProductListRow";
import { Box, Grid, TableContainer, Table, TableHead, TableRow, TableCell, Paper, Typography } from "@mui/material";

export default function MyProducts() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [filterName, setFilterName] = useState("");
  const [sort, setSort] = useState("newest");
  const [discountOnly, setDiscountOnly] = useState(false);
  const [view, setView] = useState("card");
  const [productType, setProductType] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const productNames = useMemo(() => [...new Set(PRODUCTS.map(p => p.title))], []);

  const filtered = useMemo(() => {
    let arr = PRODUCTS;
    if (search) arr = arr.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    if (filterName) arr = arr.filter(p => p.title === filterName);
    if (productType) arr = arr.filter(p => p.type.toLowerCase().includes(productType.toLowerCase()));
    if (discountOnly) arr = arr.filter(p => p.discount);
    if (sort === "newest") arr = arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "oldest") arr = arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return arr;
  }, [search, filterName, sort, discountOnly, productType]);

  const toggleSelect = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedProducts(filtered.map(p => p.id));
  const selectNone = () => setSelectedProducts([]);

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" mb={3}>Products</Typography>

      {/* Tabs */}
      <ProductTabs tab={tab} setTab={setTab} />

      {/* Filters */}
      <ProductFilters
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        filterName={filterName} setFilterName={setFilterName}
        discountOnly={discountOnly} setDiscountOnly={setDiscountOnly}
        view={view} setView={setView}
        productNames={productNames}
        productType={productType} setProductType={setProductType}
        selectAll={selectAll} selectNone={selectNone}
      />

      {/* Products Area */}
      {view === "card" ? (
        <Grid container spacing={2}>
          {filtered.map(p => (
            <Grid item key={p.id}>
              <ProductCard
                product={p}
                selected={selectedProducts.includes(p.id)}
                toggleSelect={() => toggleSelect(p.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Discount</TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {filtered.map(p => (
                <ProductListRow
                  key={p.id}
                  product={p}
                  selected={selectedProducts.includes(p.id)}
                  toggleSelect={() => toggleSelect(p.id)}
                />
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
