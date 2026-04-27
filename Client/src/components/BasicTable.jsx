// BasicTable.js (modified)
import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import AddIcon from '@mui/icons-material/Add';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useParams } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  getVariantAttributes,
  saveVariantAttributes,
} from '../api/variant.api';
import { toast } from 'react-toastify';
import { Chip, FormControlLabel } from '@mui/material';

export default function BasicTable({
  showForm,
  onFormClose,
  deleteSelectedTrigger,
  isCustomPrintArea,
}) {
  const { id: productId } = useParams();

  const isSmall = useMediaQuery('(max-width:767px)');
  const isMedium = useMediaQuery('(max-width:1023px)');
  const isLarge = useMediaQuery('(min-width:1024px)');
  const isCompact = !isLarge;

  // State
  const [rows, setRows] = useState([]);
  const [internalShowForm, setInternalShowForm] = useState(showForm || false);
  const [editingId, setEditingId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [printAreaData, setPrintAreaData] = useState({
    key: '',
    displayName: '',
    width: '',
    height: '',
  });

  const [formData, setFormData] = useState({
    variantsName: '',
    sku: '',
    color: '',
    size: '',
    colorHex: '#ffffff',
    weight: '',
    price: '',
    comparePrice: '',
    baseCost: '',
    available: 'available',
    addToCampaigns: false,
  });

  const [variantAttributes, setVariantAttributes] = useState({
    // sizes: ['L', 'XS', 'S', 'M'],
    // colors: { white: '#ffffff', black: '#000000' },
    sizes: [],
    colors: {},
    customFields: [],
  });

  const [attributesModalOpen, setAttributesModalOpen] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState({ name: '', hex: '#ffffff' });
  const [newCustomField, setNewCustomField] = useState({
    name: '',
    type: 'text',
    options: [],
  });

  const [editFormData, setEditFormData] = useState({});

  // ---------- Load Variant Attributes ----------
  useEffect(() => {
    const loadAttributes = async () => {
      if (!productId) return;
      const response = await getVariantAttributes(productId);
      if (response?.success && response.data) {
        setVariantAttributes(response.data);
      }
    };
    loadAttributes();
  }, [productId]);

  // ---------- Load Variants ----------
  useEffect(() => {
    if (!productId) return;
    const fetchVariantsData = async () => {
      const json = await getVariants(productId);
      if (json?.success && Array.isArray(json.data)) {
        const mapped = json.data.map((item) => ({
          id: item._id,
          variantsName: item.variantsName,
          sku: item.sku,
          color: item.color,
          size: item.size,
          colorHex: item.colorHex || '#ffffff',
          weight: item.weight,
          price: item.basePrice ?? 0,
          stock: item.stock ?? 0,
          comparePrice: null,
          baseCost: item.baseCost ?? 0,
          available: item.available ?? 'available',
          addToCampaigns: item.addToCampaigns ?? false,
          customAttributes: item.customAttributes || {},
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));
        setRows(mapped);
      } else {
        setRows([]);
      }
    };
    fetchVariantsData();
  }, [productId]);

  // ---------- Dynamic Columns ----------
  const columns = useMemo(() => {
    const baseCols = [
      { id: 'selection', label: '', type: 'checkbox' },
      { id: 'id', label: 'Variant ID', type: 'text' },
      { id: 'variantsName', label: 'Variant Name', type: 'text' },
      { id: 'sku', label: 'Fulfield SKU', type: 'text' },
    ];

    // Add Size column if sizes exist
    if (variantAttributes.sizes?.length > 0) {
      baseCols.push({ id: 'size', label: 'Size', type: 'text' });
    }

    // Add Color column if colors exist
    if (variantAttributes.colors && Object.keys(variantAttributes.colors).length > 0) {
      baseCols.push({ id: 'color', label: 'Color', type: 'color' });
    }

    baseCols.push(
      { id: 'price', label: 'Selling Price', type: 'price' },
      { id: 'baseCost', label: 'Cost Price', type: 'price' },
      { id: 'stock', label: 'Stock', type: 'number' },
      // { id: 'available', label: 'Available', type: 'status' },
      // { id: 'addToCampaigns', label: 'Add to Campaigns', type: 'boolean' },
    );

    // Add custom fields
    variantAttributes.customFields?.forEach((field) => {
      baseCols.push({
        id: `custom_${field.name}`,
        label: field.name,
        type: field.type, // text, number, select, checkbox
        options: field.options,
      });
    });

    // ✅ Then add createdAt and updatedAt
    baseCols.push(
      { id: 'createdAt', label: 'Create at', type: 'date' },
      { id: 'updatedAt', label: 'Update at', type: 'date' }
    );

    baseCols.push({ id: 'actions', label: 'Actions', type: 'actions' });
    return baseCols;
  }, [variantAttributes]);

  // ---------- Helpers ----------
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? '-' : d.toISOString().split('T')[0];
  };

  const getCellValue = (row, col) => {
    if (col.id === 'id') return row.id.substring(0, 8) + '...';
    if (col.id === 'variantsName') return row.variantsName || '-';
    if (col.id === 'sku') return row.sku;
    if (col.id === 'size') return row.size || '-';
    if (col.id === 'color') return row.color || '-';
    if (col.id === 'price') return `£${(row.price ?? 0).toFixed(2)}`;
    if (col.id === 'baseCost') return `£${(row.baseCost ?? 0).toFixed(2)}`;
    if (col.id === 'stock') return row.stock ?? 0;
    if (col.id === 'available') return row.available;
    if (col.id === 'addToCampaigns') return row.addToCampaigns ? 'Yes' : 'No';
    if (col.id === 'createdAt') return formatDate(row.createdAt);
    if (col.id === 'updatedAt') return formatDate(row.updatedAt);
    if (col.id.startsWith('custom_')) {
      const fieldName = col.id.replace('custom_', '');
      const value = row.customAttributes?.[fieldName];
      if (col.type === 'checkbox') return value ? 'Yes' : 'No';
      return value?.toString() || '-';
    }
    return '';
  };

  // ---------- Handlers ----------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.sku?.trim() || !formData.price) {
      toast.warn('SKU and Price are required');
      return;
    }
    const customAttributes = {};
    variantAttributes.customFields.forEach((field) => {
      const val = formData[`custom_${field.name}`];
      if (val !== undefined && val !== '') customAttributes[field.name] = val;
    });
    const selectedColorHex = variantAttributes.colors[formData.color] || '#ffffff';
    const payload = {
      variantsName: formData.variantsName,
      sku: formData.sku,
      size: formData.size,
      weight: formData.weight ? parseFloat(formData.weight) : 0,
      color: formData.color,
      colorHex: selectedColorHex,
      basePrice: parseFloat(formData.price),
      baseCost: formData.baseCost ? parseFloat(formData.baseCost) : 0,
      stock: formData.stock ? parseInt(formData.stock) : 0,
      available: formData.available.toLowerCase().trim(),
      addToCampaigns: formData.addToCampaigns,
      customAttributes,
    };

    const json = await createVariant(productId, payload);
    if (json?.success && json.data) {
      const item = json.data;
      const newRow = {
        id: item._id,
        variantsName: item.variantsName,
        sku: item.sku,
        color: item.color,
        size: item.size,
        colorHex: item.colorHex,
        weight: item.weight,
        price: item.basePrice,
        baseCost: item.baseCost,
        available: item.available,
        addToCampaigns: item.addToCampaigns,
        customAttributes: item.customAttributes || {},
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
      setRows((prev) => [...prev, newRow]);
      setInternalShowForm(false);
      onFormClose?.();
      setFormData({
        variantsName: '',
        sku: '',
        color: '',
        size: '',
        stock: '',
        colorHex: '#ffffff',
        weight: '',
        price: '',
        comparePrice: '',
        baseCost: '',
        available: 'available',
        addToCampaigns: false,
      });
      toast.success('Variant added');
    } else {
      toast.error(json?.message || 'Failed');
    }
  };

  const handleSaveEdit = async () => {
    const variantId = editingId;
    if (!variantId) return;
    const customAttributes = {};
    variantAttributes.customFields.forEach((field) => {
      const val = editFormData[`custom_${field.name}`];
      if (val !== undefined && val !== '') customAttributes[field.name] = val;
    });
    const payload = {
      variantsName: editFormData.variantsName,
      sku: editFormData.sku,
      size: editFormData.size,
      weight: parseFloat(editFormData.weight) || 0,
      color: editFormData.color,
      colorHex: editFormData.colorHex,
      basePrice: parseFloat(editFormData.price),
      stock: editFormData.stock ? parseInt(editFormData.stock) : 0,
      baseCost: editFormData.baseCost ? parseFloat(editFormData.baseCost) : 0,
      available: editFormData.available?.toLowerCase().trim(),
      addToCampaigns: editFormData.addToCampaigns,
      customAttributes,
    };

    const json = await updateVariant(productId, variantId, payload);
    if (json?.success && json.data) {
      const item = json.data;
      setRows((prev) =>
        prev.map((r) =>
          r.id === variantId
            ? {
              ...r,
              variantsName: item.variantsName,
              sku: item.sku,
              color: item.color,
              size: item.size,
              colorHex: item.colorHex,
              weight: item.weight,
              price: item.basePrice,
              baseCost: item.baseCost,
              stock: item.stock ?? 0,
              available: item.available,
              addToCampaigns: item.addToCampaigns,
              customAttributes: item.customAttributes || {},
              updatedAt: item.updatedAt,
            }
            : r
        )
      );
      setEditingId(null);
      toast.success('Variant updated');
    } else {
      toast.error(json?.message || 'Update failed');
    }
  };

  const handleDeleteClick = async (variantId) => {
    if (!window.confirm('Delete this variant?')) return;
    const json = await deleteVariant(productId, variantId);
    if (json?.success) {
      setRows((prev) => prev.filter((r) => r.id !== variantId));
      setSelectedRows((prev) => prev.filter((id) => id !== variantId));
    } else {
      toast.error(json?.message || 'Delete failed');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return toast.warn('No rows selected');
    if (!window.confirm(`Delete ${selectedRows.length} variant(s)?`)) return;
    const results = await Promise.all(
      selectedRows.map((id) => deleteVariant(productId, id))
    );
    const failed = results.filter((r) => !r?.success);
    if (failed.length) console.warn('Some deletions failed');
    setRows((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
    setSelectedRows([]);
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? rows.map((r) => r.id) : []);
  };

  const handleCancelEdit = () => setEditingId(null);
  const handleCancelForm = () => {
    setInternalShowForm(false);
    onFormClose?.();
  };

  const handleEditClick = (row) => {
    setEditingId(row.id);
    setInternalShowForm(false);
    const editData = {
      variantsName: row.variantsName || '',
      sku: row.sku,
      color: row.color,
      size: row.size,
      colorHex: row.colorHex,
      weight: row.weight,
      price: String(row.price),
      stock: row.stock ? String(row.stock) : '',
      comparePrice: row.comparePrice ? String(row.comparePrice) : '',
      baseCost: row.baseCost ? String(row.baseCost) : '',
      available: row.available || 'available',
      addToCampaigns: row.addToCampaigns || false,
    };
    if (row.customAttributes) {
      Object.entries(row.customAttributes).forEach(([key, val]) => {
        editData[`custom_${key}`] = val;
      });
    }
    setEditFormData(editData);
  };

  // Attributes management handlers (unchanged, kept as is)
  const handleAddSize = () => {
    if (newSize && !variantAttributes.sizes.includes(newSize)) {
      setVariantAttributes((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize],
      }));
      setNewSize('');
    }
  };
  const handleDeleteSize = (size) => {
    setVariantAttributes((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));
  };
  const handleAddColor = () => {
    if (newColor.name && newColor.hex) {
      setVariantAttributes((prev) => ({
        ...prev,
        colors: { ...prev.colors, [newColor.name]: newColor.hex },
      }));
      setNewColor({ name: '', hex: '#ffffff' });
    }
  };
  const handleDeleteColor = (colorName) => {
    setVariantAttributes((prev) => {
      const newColors = { ...prev.colors };
      delete newColors[colorName];
      return { ...prev, colors: newColors };
    });
  };
  const handleAddCustomField = () => {
    if (newCustomField.name) {
      setVariantAttributes((prev) => ({
        ...prev,
        customFields: [...prev.customFields, { ...newCustomField }],
      }));
      setNewCustomField({ name: '', type: 'text', options: [] });
    }
  };
  const handleDeleteCustomField = (index) => {
    setVariantAttributes((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };
  const handleSaveAttributes = async () => {
    const res = await saveVariantAttributes(productId, variantAttributes);
    if (res?.success) {
      toast.success('Attributes saved');
      setAttributesModalOpen(false);
    } else {
      toast.error(res?.message || 'Failed');
    }
  };

  // Print area modal (unchanged)
  const handlePrintAreaChange = (e) => {
    setPrintAreaData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const generateTIB = () => 'PA-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  const handleModalOpen = (row) => {
    setPrintAreaData({
      tib: row?.id || generateTIB(),
      key: row?.key || '',
      displayName: row?.displayName || '',
      width: row?.width || '',
      height: row?.height || '',
    });
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setPrintAreaData({ key: '', displayName: '', width: '', height: '' });
  };
  const handlePrintAreaSubmit = () => {
    if (!printAreaData.displayName || !printAreaData.width || !printAreaData.height) {
      toast.warn('Fill all fields');
      return;
    }
    toast.success('Print area added');
    handleModalClose();
  };

  // Sync showForm prop
  useEffect(() => {
    setInternalShowForm(showForm);
    if (showForm) {
      setEditingId(null);
      setFormData({
        variantsName: '',
        sku: '',
        color: '',
        size: '',
        colorHex: '#ffffff',
        weight: '',
        price: '',
        comparePrice: '',
        baseCost: '',
        available: 'available',
        addToCampaigns: false,
      });
    }
  }, [showForm]);

  useEffect(() => {
    if (deleteSelectedTrigger) handleDeleteSelected();
    // eslint-disable-next-line
  }, [deleteSelectedTrigger]);

  const availableOptions = [
    { value: 'available', label: 'Available' },
    { value: 'out of stock', label: 'Out of Stock' },
    { value: 'coming soon', label: 'Coming Soon' },
    { value: 'discontinued', label: 'Discontinued' },
  ];

  // ---------- RENDER ----------
  return (
    <Box sx={{ width: '100%' }}>
      {/* Add Variant Form (unchanged except minor adjustments for custom fields) */}
      {internalShowForm && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add New Variant
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(auto-fill, minmax(250px, 1fr))',
                },
                gap: 2,
              }}
            >
              <TextField
                label="Variant Name"
                name="variantsName"
                value={formData.variantsName}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Variant SKU"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                fullWidth
                size="small"
                required
              />
              {variantAttributes.sizes?.length > 0 && (
                <TextField
                  label="Size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="">Select Size</option>
                  {variantAttributes.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </TextField>
              )}
              {variantAttributes.colors && Object.keys(variantAttributes.colors).length > 0 && (
                <TextField
                  label="Color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="">Select Color</option>
                  {Object.keys(variantAttributes.colors).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </TextField>
              )}
              <TextField
                label="Selling Price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                fullWidth
                size="small"
                type="number"
                required
              />

              <TextField
                label="Your Cost Price"
                name="baseCost"
                value={formData.baseCost}
                onChange={handleInputChange}
                fullWidth
                size="small"
                type="number"
              />
              <TextField
                label="Stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                fullWidth
                size="small"
                type="number"
              />
              {/* <FormControl fullWidth size="small">
                <InputLabel>Available</InputLabel>
                <Select
                  name="available"
                  value={formData.available}
                  onChange={handleInputChange}
                  label="Available"
                >
                  {availableOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
              {variantAttributes.customFields.map((field, idx) =>
                field.type === 'select' ? (
                  <FormControl key={idx} fullWidth size="small">
                    <InputLabel>{field.name}</InputLabel>
                    <Select
                      name={`custom_${field.name}`}
                      value={formData[`custom_${field.name}`] || ''}
                      onChange={handleInputChange}
                      label={field.name}
                    >
                      <MenuItem value="">Select {field.name}</MenuItem>
                      {field.options.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : field.type === 'checkbox' ? (
                  <FormControlLabel
                    key={idx}
                    control={
                      <Checkbox
                        name={`custom_${field.name}`}
                        checked={formData[`custom_${field.name}`] || false}
                        onChange={handleInputChange}
                      />
                    }
                    label={field.name}
                  />
                ) : (
                  <TextField
                    key={idx}
                    label={field.name}
                    name={`custom_${field.name}`}
                    value={formData[`custom_${field.name}`] || ''}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    type={field.type}
                  />
                )
              )}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => setAttributesModalOpen(true)}
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ borderStyle: 'dashed', textTransform: 'none' }}
                >
                  Manage Attributes
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button variant="outlined" onClick={handleCancelForm}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ bgcolor: 'skyblue', '&:hover': { bgcolor: '#5bbad5' } }}
              >
                Add Variant
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* COMPACT VIEW (Cards) */}
      {isCompact ? (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {rows.length === 0 ? (
            <Card>
              <CardContent>
                <Typography>No variants found. Click "New Variant" to add one.</Typography>
              </CardContent>
            </Card>
          ) : (
            rows.map((row) => (
              <Card key={row.id} sx={{ p: 1 }}>
                {editingId === row.id ? (
                  <CardContent>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 1 }}>
                      <TextField
                        name="variantsName"
                        value={editFormData.variantsName}
                        onChange={handleEditInputChange}
                        size="small"
                        label="Variant Name"
                        fullWidth
                      />
                      <TextField
                        name="sku"
                        value={editFormData.sku}
                        onChange={handleEditInputChange}
                        size="small"
                        label="SKU"
                        fullWidth
                      />
                      {variantAttributes.sizes?.length > 0 && (
                        <TextField
                          label="Size"
                          name="size"
                          value={editFormData.size}
                          onChange={handleEditInputChange}
                          size="small"
                          select
                          fullWidth
                        >
                          {variantAttributes.sizes.map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                      {variantAttributes.colors && Object.keys(variantAttributes.colors).length > 0 && (
                        <TextField
                          label="Color"
                          name="color"
                          value={editFormData.color}
                          onChange={handleEditInputChange}
                          size="small"
                          select
                          fullWidth
                        >
                          {Object.keys(variantAttributes.colors).map((c) => (
                            <MenuItem key={c} value={c}>
                              {c}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                      <TextField
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditInputChange}
                        size="small"
                        type="number"
                        label="Price"
                        fullWidth
                      />
                      <TextField
                        name="baseCost"
                        value={editFormData.baseCost}
                        onChange={handleEditInputChange}
                        size="small"
                        type="number"
                        label="Cost Price"
                        fullWidth
                      />
                      <TextField
                        name="stock"
                        value={editFormData.stock}
                        onChange={handleEditInputChange}
                        
                        size="small"
                        type="number"
                        label="Stock"
                        fullWidth
                      />
                      {variantAttributes.customFields.map((field, idx) =>
                        field.type === 'select' ? (
                          <FormControl key={idx} fullWidth size="small">
                            <InputLabel>{field.name}</InputLabel>
                            <Select
                              name={`custom_${field.name}`}
                              value={editFormData[`custom_${field.name}`] || ''}
                              onChange={handleEditInputChange}
                              label={field.name}
                            >
                              <MenuItem value="">Select {field.name}</MenuItem>
                              {field.options.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                  {opt}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : field.type === 'checkbox' ? (
                          <FormControlLabel
                            key={idx}
                            control={
                              <Checkbox
                                name={`custom_${field.name}`}
                                checked={editFormData[`custom_${field.name}`] || false}
                                onChange={handleEditInputChange}
                              />
                            }
                            label={field.name}
                          />
                        ) : (
                          <TextField
                            key={idx}
                            label={field.name}
                            name={`custom_${field.name}`}
                            value={editFormData[`custom_${field.name}`] || ''}
                            onChange={handleEditInputChange}
                            size="small"
                            fullWidth
                            type={field.type}
                          />
                        )
                      )}
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button variant="contained" size="small" onClick={handleSaveEdit} startIcon={<SaveIcon />}>
                          Save
                        </Button>
                        <Button variant="outlined" size="small" onClick={handleCancelEdit} startIcon={<CancelIcon />}>
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                ) : (
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {row.sku || row.id.substring(0, 8) + '...'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.color && `${row.color}`} {row.size && `• ${row.size}`}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton size="small" onClick={() => handleEditClick(row)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteClick(row.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        {isCustomPrintArea && (
                          <Button size="small" onClick={() => handleModalOpen(row)} sx={{ ml: 1, minWidth: 'auto' }}>
                            <AddIcon fontSize="small" />
                          </Button>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Price</Typography>
                        <Typography>£{(row.price ?? 0).toFixed(2)}</Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">Cost</Typography>
                        <Typography>£{(row.baseCost ?? 0).toFixed(2)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Stock</Typography>
                        <Typography>{row.stock ?? 0}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Available</Typography>
                        <Typography>{row.available}</Typography>
                      </Box>
                      {variantAttributes.customFields.map((field) => (
                        <Box key={field.name}>
                          <Typography variant="caption" color="text.secondary">{field.name}</Typography>
                          <Typography>
                            {field.type === 'checkbox'
                              ? row.customAttributes?.[field.name] ? 'Yes' : 'No'
                              : row.customAttributes?.[field.name] || '-'}
                          </Typography>
                        </Box>
                      ))}
                      <Box>
                        <Typography variant="caption" color="text.secondary">Created</Typography>
                        <Typography>{formatDate(row.createdAt)}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </Box>
      ) : (
        // LARGE TABLE VIEW - DYNAMIC COLUMNS
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer component={Paper} sx={{ minWidth: { lg: 1100 }, width: '100%' }}>
            <Table sx={{ minWidth: { lg: 1100 } }}>
              <TableHead>
                <TableRow>
                  {columns.map((col) =>
                    col.id === 'selection' ? (
                      <TableCell key={col.id} padding="checkbox">
                        <Checkbox
                          checked={rows.length > 0 && selectedRows.length === rows.length}
                          indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                    ) : (
                      <TableCell key={col.id}>{col.label}</TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((col) => {
                      if (col.id === 'selection') {
                        return (
                          <TableCell key={col.id} padding="checkbox">
                            <Checkbox
                              checked={selectedRows.includes(row.id)}
                              onChange={() => handleCheckboxChange(row.id)}
                            />
                          </TableCell>
                        );
                      }
                      if (col.id === 'actions') {
                        return (
                          <TableCell key={col.id}>
                            {editingId === row.id ? (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton color="primary" onClick={handleSaveEdit} size="small">
                                  <SaveIcon />
                                </IconButton>
                                <IconButton color="secondary" onClick={handleCancelEdit} size="small">
                                  <CancelIcon />
                                </IconButton>
                              </Box>
                            ) : (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton color="primary" onClick={() => handleEditClick(row)} size="small">
                                  <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDeleteClick(row.id)} size="small">
                                  <DeleteIcon />
                                </IconButton>
                                {isCustomPrintArea && (
                                  <Button size="small" onClick={() => handleModalOpen(row)}>
                                    <AddIcon fontSize="small" />
                                  </Button>
                                )}
                              </Box>
                            )}
                          </TableCell>
                        );
                      }
                      // For editable fields when row is in edit mode



                      if (editingId === row.id) {

                        if (col.id === 'variantsName') {
                          return (
                            <TableCell key={col.id}>
                              <TextField
                                name="variantsName"
                                value={editFormData.variantsName || ''}
                                onChange={handleEditInputChange}
                                size="small"
                                fullWidth
                              />
                            </TableCell>
                          );
                        }
                        if (col.id === 'sku') {
                          return (
                            <TableCell key={col.id}>
                              <TextField
                                name="sku"
                                value={editFormData.sku}
                                onChange={handleEditInputChange}
                                size="small"
                                fullWidth
                              />
                            </TableCell>
                          );
                        }
                        if (col.id === 'size' && variantAttributes.sizes?.length > 0) {
                          return (
                            <TableCell key={col.id}>
                              <TextField
                                name="size"
                                value={editFormData.size}
                                onChange={handleEditInputChange}
                                size="small"
                                select
                                fullWidth
                              >
                                {variantAttributes.sizes.map((s) => (
                                  <MenuItem key={s} value={s}>
                                    {s}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </TableCell>
                          );
                        }

                        if (col.id === "stock") {
                          return (
                            <TableCell key={col.id}>
                              <TextField
                                name="stock"
                                value={editFormData.stock}
                                onChange={handleEditInputChange}
                                size="small"
                                type="number"
                                fullWidth
                              />
                            </TableCell>
                          );
                        }

                        if (col.id === 'color' && variantAttributes.colors) {
                          return (
                            <TableCell key={col.id}>
                              <TextField
                                name="color"
                                value={editFormData.color}
                                onChange={handleEditInputChange}
                                size="small"
                                select
                                fullWidth
                              >
                                {Object.keys(variantAttributes.colors).map((c) => (
                                  <MenuItem key={c} value={c}>
                                    {c}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </TableCell>
                          );
                        }
                        if (col.id === 'price') {
                          return (
                            <TableCell key={col.id}>
                              <TextField
                                name="price"
                                value={editFormData.price}
                                onChange={handleEditInputChange}
                                size="small"
                                type="number"
                                fullWidth
                              />
                            </TableCell>
                          );
                        }

                        if (col.id === "baseCost") {
                          return (
                            <TableCell key={col.id}>
                              <TextField
                                name="baseCost"
                                value={editFormData.baseCost}
                                onChange={handleEditInputChange}
                                size="small"
                                type="number"
                                fullWidth
                              />
                            </TableCell>
                          );
                        }


                        if (col.id === 'available') {
                          return (
                            <TableCell key={col.id}>
                              <FormControl size="small" fullWidth>
                                <Select
                                  name="available"
                                  value={editFormData.available}
                                  onChange={handleEditInputChange}
                                >
                                  {availableOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                          );
                        }
                        if (col.id === 'addToCampaigns') {
                          return (
                            <TableCell key={col.id}>
                              <Checkbox
                                name="addToCampaigns"
                                checked={editFormData.addToCampaigns || false}
                                onChange={handleEditInputChange}
                              />
                            </TableCell>
                          );
                        }
                        if (col.id.startsWith('custom_')) {
                          const fieldName = col.id.replace('custom_', '');
                          const field = variantAttributes.customFields.find((f) => f.name === fieldName);
                          if (!field) return <TableCell key={col.id}>-</TableCell>;
                          if (field.type === 'select') {
                            return (
                              <TableCell key={col.id}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    name={col.id}
                                    value={editFormData[col.id] || ''}
                                    onChange={handleEditInputChange}
                                  >
                                    <MenuItem value="">Select {field.name}</MenuItem>
                                    {field.options.map((opt) => (
                                      <MenuItem key={opt} value={opt}>
                                        {opt}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>
                            );
                          }
                          if (field.type === 'checkbox') {
                            return (
                              <TableCell key={col.id}>
                                <Checkbox
                                  name={col.id}
                                  checked={editFormData[col.id] || false}
                                  onChange={handleEditInputChange}
                                />
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell key={col.id}>
                              <TextField
                                name={col.id}
                                value={editFormData[col.id] || ''}
                                onChange={handleEditInputChange}
                                size="small"
                                type={field.type}
                                fullWidth
                              />
                            </TableCell>
                          );
                        }
                        // For createdAt/updatedAt (non-editable)
                        return <TableCell key={col.id}>{getCellValue(row, col)}</TableCell>;
                      }
                      // Normal display mode
                      if (col.id === 'available') {
                        return (
                          <TableCell key={col.id}>
                            <Box
                              sx={{
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                display: 'inline-block',
                                bgcolor:
                                  row.available === 'available'
                                    ? '#e8f5e9'
                                    : row.available === 'out of stock'
                                      ? '#ffebee'
                                      : row.available === 'coming soon'
                                        ? '#fff3e0'
                                        : '#f5f5f5',
                                color:
                                  row.available === 'available'
                                    ? '#2e7d32'
                                    : row.available === 'out of stock'
                                      ? '#c62828'
                                      : row.available === 'coming soon'
                                        ? '#f57c00'
                                        : '#616161',
                              }}
                            >
                              {row.available}
                            </Box>
                          </TableCell>
                        );
                      }
                      return <TableCell key={col.id}>{getCellValue(row, col)}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Attributes Management Modal (unchanged) */}
      <Dialog
        open={attributesModalOpen}
        onClose={() => setAttributesModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Manage Variant Attributes</DialogTitle>
        <DialogContent>
          {/* Sizes */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Sizes
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {variantAttributes.sizes.map((size, i) => (
                <Chip key={i} label={size} onDelete={() => handleDeleteSize(size)} variant="outlined" />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                label="Add Size"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value.toUpperCase())}
                fullWidth
              />
              <Button variant="contained" onClick={handleAddSize} disabled={!newSize}>
                Add
              </Button>
            </Box>
          </Box>
          {/* Colors */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Colors
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {Object.entries(variantAttributes?.colors).map(([name, hex]) => (
                <Box
                  key={name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: '#f8f9fa',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: hex, border: '1px solid #ddd' }} />
                  <Typography variant="body2">{name}</Typography>
                  <IconButton size="small" onClick={() => handleDeleteColor(name)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                label="Color Name"
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
              />
              <TextField
                size="small"
                label="Hex"
                value={newColor.hex}
                onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                type="color"
                sx={{ width: 100 }}
              />
              <Button variant="contained" onClick={handleAddColor} disabled={!newColor.name || !newColor.hex}>
                Add
              </Button>
            </Box>
          </Box>
          {/* Custom Fields */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Custom Fields
            </Typography>
            {variantAttributes.customFields.map((field, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 1.5,
                  mb: 1,
                  bgcolor: '#fafafa',
                  borderRadius: 1,
                }}
              >
                <Box>
                  <Typography variant="body2">{field.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {field.type} {field.options.length > 0 && `• ${field.options.join(', ')}`}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => handleDeleteCustomField(i)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 1, mt: 2 }}>
              <Typography variant="body2" fontWeight={500} mb={2}>
                Add New Field
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  label="Field Name"
                  value={newCustomField.name}
                  onChange={(e) => setNewCustomField({ ...newCustomField, name: e.target.value })}
                />
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newCustomField.type}
                    onChange={(e) =>
                      setNewCustomField({ ...newCustomField, type: e.target.value, options: [] })
                    }
                    label="Type"
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="select">Select</MenuItem>
                    <MenuItem value="checkbox">Checkbox</MenuItem>
                  </Select>
                </FormControl>
                {newCustomField.type === 'select' && (
                  <TextField
                    size="small"
                    label="Options (comma separated)"
                    onChange={(e) =>
                      setNewCustomField({
                        ...newCustomField,
                        options: e.target.value.split(',').map((o) => o.trim()),
                      })
                    }
                  />
                )}
                <Button variant="contained" onClick={handleAddCustomField} disabled={!newCustomField.name}>
                  Add
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttributesModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAttributes}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Print Area Modal (unchanged) */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Custom Print Area</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Variant ID"
            value={printAreaData.tib || 'Will be auto-generated'}
            InputProps={{ readOnly: true }}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Display Name"
            name="displayName"
            value={printAreaData.displayName}
            onChange={handlePrintAreaChange}
            margin="dense"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Width (px)"
              name="width"
              value={printAreaData.width}
              onChange={handlePrintAreaChange}
              type="number"
              fullWidth
              margin="dense"
            />
            <TextField
              label="Height (px)"
              name="height"
              value={printAreaData.height}
              onChange={handlePrintAreaChange}
              type="number"
              fullWidth
              margin="dense"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handlePrintAreaSubmit} variant="contained">
            Add Print Area
          </Button>
        </DialogActions>
      </Dialog>

      {rows.length === 0 && isLarge && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>No variants found. Click "New Variant" to add one.</Typography>
        </Box>
      )}
    </Box>
  );
}