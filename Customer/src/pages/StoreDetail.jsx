import React, { useState } from "react";
import {
  Box,
  Container,
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
  InputLabel
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
  Download
} from "@mui/icons-material";

export default function StoreDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const store = location.state?.store;
  const [activeTab, setActiveTab] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

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

  // Mock products data
  const products = [
    { id: 1, name: "Premium T-Shirt", state: "Published", sync: "Synced", updated: "2 hours ago", created: "Jan 15, 2024" },
    { id: 2, name: "Designer Hoodie", state: "Draft", sync: "Pending", updated: "1 day ago", created: "Jan 10, 2024" },
    { id: 3, name: "Custom Mug", state: "Published", sync: "Synced", updated: "3 hours ago", created: "Jan 12, 2024" },
    { id: 4, name: "Phone Case", state: "Archived", sync: "Failed", updated: "2 days ago", created: "Jan 5, 2024" },
    { id: 5, name: "Laptop Sleeve", state: "Published", sync: "Synced", updated: "5 hours ago", created: "Jan 18, 2024" },
  ];

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
                  label={store.status} 
                  size="small" 
                  color="success" 
                  variant="outlined"
                />
                 <Chip 
                  label="12345678" 
                  size="small" 
                  color="success" 
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
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
                {store.name} • {store.products} products
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<ShoppingBag />}>
              Add Product
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search for Product..."
              sx={{ width: 300 }}
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
              <Select label="State" defaultValue="">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 150 }}>
              <InputLabel>Sync Status</InputLabel>
              <Select label="Sync Status" defaultValue="">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="synced">Synced</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>

            <Button startIcon={<FilterList />} variant="outlined">
              More Filters
            </Button>

            <Button startIcon={<Download />} variant="outlined" sx={{ ml: 'auto' }}>
              Export
            </Button>
          </Box>

          {/* Products Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
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
                  <TableCell>State</TableCell>
                  <TableCell>Sync Status</TableCell>
                  <TableCell>Updated</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{product.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.state} 
                        size="small"
                        color={
                          product.state === 'Published' ? 'success' :
                          product.state === 'Draft' ? 'warning' :
                          'default'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: product.sync === 'Synced' ? '#10B981' :
                                   product.sync === 'Pending' ? '#F59E0B' : '#EF4444'
                        }} />
                        {product.sync}
                      </Box>
                    </TableCell>
                    <TableCell>{product.updated}</TableCell>
                    <TableCell>{product.created}</TableCell>
                    <TableCell align="right">
                      <Button size="small">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Table Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, pt: 2, borderTop: '1px solid #E5E7EB' }}>
            <Typography variant="body2" color="text.secondary">
              Showing 5 of {store.products} products
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" disabled>Previous</Button>
              <Button size="small" variant="contained">1</Button>
              <Button size="small">2</Button>
              <Button size="small">3</Button>
              <Button size="small">Next</Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Store Stats */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <ShoppingBag color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>{store.products}</Typography>
            <Typography color="text.secondary">Total Products</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <Receipt color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>{store.orders}</Typography>
            <Typography color="text.secondary">Total Orders</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <TrendingUp color="warning" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>${store.revenue}</Typography>
            <Typography color="text.secondary">Total Revenue</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Last Sync</Typography>
            <Typography variant="h4" fontWeight={700}>{store.lastSync}</Typography>
            <Button size="small" variant="outlined" sx={{ mt: 1 }}>
              Sync Now
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}