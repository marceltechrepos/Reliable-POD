import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Grid,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Divider,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowBack,
  Home,
  Store,
  Search,
  FilterList,
  MoreVert,
  Settings,
  Archive,
  ShoppingBag,
  Receipt,
  TrendingUp,
  Download,
  Sync
} from "@mui/icons-material";
import { fetchStoreProducts, syncStoreProducts, exportProducts } from "../api/storeProducts.api";

export default function StoreDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const store = location.state?.store;
  const [activeTab, setActiveTab] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [syncFilter, setSyncFilter] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch products when component mounts
  useEffect(() => {
    const storeId = store?.id || store?._id;
    if (storeId) {
      console.log("Fetching products for store:", storeId);
      fetchProducts(storeId);
    } else {
      console.log("No store ID found", store);
      setLoading(false);
    }
  }, [store]);

  const fetchProducts = async (storeId) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Calling fetchStoreProducts with ID:", storeId);
      const data = await fetchStoreProducts(storeId);
      console.log("API Response:", data);

      if (data.success && data.data) {
        // Transform API data to match component structure
        const transformedProducts = data.data.map(product => ({
          id: product._id,
          name: product.customVariant?.name || product.baseProduct?.productTitle || "Unnamed Product",
          price: product.baseProduct?.price ? `$${product.baseProduct.price}` : "$0",
          // image: product.customVariant?.imageUrl || 
          //        product.selectedMockup?.imageUrl || 
          //        product.baseProduct?.thumbnail?.url || 
          //        "https://via.placeholder.com/50x50?text=No+Image",
          image: product.customerDesign?.finalDesignImage,
          description: product.customVariant?.description ||
            product.baseProduct?.description ||
            "No description available",
          variants: product.selectedDefaultVariants || [],
          imported: product.importedToShopify,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          storeId: product.storeId,
          customVariant: product.customVariant,
          baseProduct: product.baseProduct
        }));

        setProducts(transformedProducts);
        console.log("Products set:", transformedProducts.length);
      } else {
        setError(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error loading products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    const storeId = store?.id || store?._id;
    if (!storeId) return;

    try {
      setLoading(true);
      await syncStoreProducts(storeId);
      await fetchProducts(storeId);
      setSnackbar({
        open: true,
        message: 'Products synced successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to sync products',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const storeId = store?.id || store?._id;
    if (!storeId) return;

    try {
      await exportProducts(storeId, filteredProducts);
      setSnackbar({
        open: true,
        message: 'Products exported successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to export products',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!store) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Store not found</Typography>
        <Button onClick={() => navigate('/user/stores')}>Back to Stores</Button>
      </Box>
    );
  }

  const getStoreColor = (type) => {
    switch (type) {
      case 'Shopify': return '#96BF48';
      case 'Etsy': return '#F16521';
      case 'WooCommerce': return '#96588A';
      case 'Anywhere POD': return '#3B82F6';
      case 'Manual Order': return '#6B7280';
      default: return '#4F46E5';
    }
  };

  const storeColor = getStoreColor(store.type);

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = !stateFilter ||
      (stateFilter === 'published' && product.imported) ||
      (stateFilter === 'draft' && !product.imported);
    const matchesSync = !syncFilter || syncFilter === 'synced';
    return matchesSearch && matchesState && matchesSync;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? (a.name || '').localeCompare(b.name || '')
        : (b.name || '').localeCompare(a.name || '');
    }
    if (sortBy === 'created') {
      return sortOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'updated') {
      return sortOrder === 'asc'
        ? new Date(a.updatedAt) - new Date(b.updatedAt)
        : new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    return 0;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getSyncStatusColor = () => {
    return '#10B981';
  };

  // Debug log
  console.log("Products in component:", products.length);
  console.log("Filtered products:", filteredProducts.length);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F5F7FA", p: 4 }}>
      {/* Header with Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            underline="hover"
            color="inherit"
            href="/user/dashboard"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="small" />
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate('/user/stores')}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Store sx={{ mr: 0.5 }} fontSize="small" />
            Stores
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            {store.name}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/user/stores')} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Avatar
              sx={{
                bgcolor: storeColor,
                color: '#fff',
                width: 60,
                height: 60,
                fontSize: '1.5rem'
              }}
            >
              {store.type === 'Shopify' ? 'S' :
                store.type === 'Etsy' ? 'E' :
                  store.type === 'WooCommerce' ? 'WC' :
                    store.type === 'Anywhere POD' ? 'POD' : 'MO'}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {store.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Chip
                  label={store.type}
                  size="small"
                  sx={{
                    bgcolor: `${storeColor}15`,
                    color: storeColor,
                    fontWeight: 600
                  }}
                />
                <Chip
                  label={store.validated ? "Connected" : "Pending"}
                  size="small"
                  color={store.validated ? "success" : "warning"}
                  variant="outlined"
                />
                {store.apiKey && (
                  <Chip
                    label={store.apiKey}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<Sync />}
              variant="outlined"
              onClick={handleSync}
              disabled={loading}
            >
              Sync
            </Button>
            <Button startIcon={<Settings />} variant="outlined">
              Settings
            </Button>
            <Button startIcon={<Archive />} variant="outlined">
              Archive
            </Button>
            <IconButton>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Products" icon={<ShoppingBag />} iconPosition="start" />
          <Tab label="Orders" icon={<Receipt />} iconPosition="start" />
          <Tab label="Analytics" icon={<TrendingUp />} iconPosition="start" />
          <Tab label="Settings" icon={<Settings />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Products Section */}
      {activeTab === 0 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {store.name} • {products.length} imported products
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<ShoppingBag />}
              onClick={() => window.open('http://localhost:8080/user/my-products', '_blank')}
            >
              Import More Products
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search for Product..."
              sx={{ width: 300 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ width: 150 }}>
              <InputLabel>State</InputLabel>
              <Select
                label="State"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 150 }}>
              <InputLabel>Sync Status</InputLabel>
              <Select
                label="Sync Status"
                value={syncFilter}
                onChange={(e) => setSyncFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="synced">Synced</MenuItem>
              </Select>
            </FormControl>

            <Button startIcon={<FilterList />} variant="outlined">
              More Filters
            </Button>

            <Button
              startIcon={<Download />}
              variant="outlined"
              sx={{ ml: 'auto' }}
              onClick={handleExport}
              disabled={products.length === 0}
            >
              Export
            </Button>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert severity="error" sx={{ mb: 2 }} action={
              <Button color="inherit" size="small" onClick={() => fetchProducts(store?.id || store?._id)}>
                Retry
              </Button>
            }>
              {error}
            </Alert>
          )}

          {/* Products Table */}
          {!loading && !error && (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell>Image</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'name'}
                          direction={sortOrder}
                          onClick={() => {
                            setSortBy('name');
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          }}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>Sync Status</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'updated'}
                          direction={sortOrder}
                          onClick={() => {
                            setSortBy('updated');
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          }}
                        >
                          Updated
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'created'}
                          direction={sortOrder}
                          onClick={() => {
                            setSortBy('created');
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          }}
                        >
                          Created
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                          <Typography color="text.secondary">
                            No products found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedProducts.map((product) => (
                        <TableRow key={product.id} hover>
                          <TableCell>
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: 'cover',
                                borderRadius: 8
                              }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={500}>{product.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={600}>{product.price}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={product.imported ? "Published" : "Draft"}
                              size="small"
                              color={product.imported ? "success" : "warning"}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: getSyncStatusColor()
                              }} />
                              Synced
                            </Box>
                          </TableCell>
                          <TableCell>{formatDate(product.updatedAt)}</TableCell>
                          <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              onClick={() => {
                                console.log('View product:', product);
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Table Footer */}
              {sortedProducts.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, pt: 2, borderTop: '1px solid #E5E7EB' }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {sortedProducts.length} of {products.length} products
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" disabled>Previous</Button>
                    <Button size="small" variant="contained">1</Button>
                    <Button size="small">2</Button>
                    <Button size="small">3</Button>
                    <Button size="small">Next</Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Paper>
      )}

      {/* Store Stats */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <ShoppingBag color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>{products.length}</Typography>
            <Typography color="text.secondary">Total Products</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <Receipt color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>{store.orders || 0}</Typography>
            <Typography color="text.secondary">Total Orders</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <TrendingUp color="warning" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>${store.revenue || 0}</Typography>
            <Typography color="text.secondary">Total Revenue</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Last Sync</Typography>
            <Typography variant="h4" fontWeight={700}>
              {products.length > 0 ? new Date(products[0]?.updatedAt).toLocaleDateString() : 'Never'}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={handleSync}
              disabled={loading}
            >
              Sync Now
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}