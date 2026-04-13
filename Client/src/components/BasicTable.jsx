import React, { useState, useEffect } from 'react';
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
import { getVariants, createVariant, updateVariant, deleteVariant, getVariantAttributes, saveVariantAttributes } from '../api/variant.api';
import { toast } from 'react-toastify';
import { Chip, FormControlLabel } from '@mui/material';

// Helper function to create data (local usage)
function createData(id, sku, color, size, colorHex, weight, price, comparePrice, baseCost, available, addToCampaigns, createdAt, updatedAt) {
  return { id, sku, color, size, colorHex, weight, price, comparePrice, baseCost, available, addToCampaigns, createdAt, updatedAt };
}

export default function BasicTable({ showForm, onFormClose, deleteSelectedTrigger, isCustomPrintArea }) {
  const { id } = useParams(); // product id from route

  // breakpoints
  const isSmall = useMediaQuery('(max-width:767px)');
  const isMedium = useMediaQuery('(max-width:1023px)');
  // large = desktop/table layout only when viewport >= 1024px
  const isLarge = useMediaQuery('(min-width:1024px)');

  // compact means small OR medium (treat both as card view)
  const isCompact = !isLarge;

  // State
  const [rows, setRows] = useState([]);
  const [internalShowForm, setInternalShowForm] = useState(showForm || false);
  const [editingId, setEditingId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [printAreaData, setPrintAreaData] = useState({ key: '', displayName: '', width: '', height: '' });

  // Form data for new variant
  const [formData, setFormData] = useState({
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

  // Add these states with your existing states
  const [variantAttributes, setVariantAttributes] = useState({
    sizes: ['L', 'XS', 'S', 'M'], // default sizes
    colors: {
      white: '#ffffff',
      black: '#000000',
      // more colors can be added
    },
    customFields: [] // array of custom fields
  });
  const [attributesModalOpen, setAttributesModalOpen] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState({ name: '', hex: '#ffffff' });
  const [newCustomField, setNewCustomField] = useState({ name: '', type: 'text', options: [] });



  // Size handlers
  const handleAddSize = () => {
    if (newSize && !variantAttributes.sizes.includes(newSize)) {
      setVariantAttributes(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize]
      }));
      setNewSize('');
    }
  };

  const handleDeleteSize = (sizeToDelete) => {
    setVariantAttributes(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== sizeToDelete)
    }));
  };

  // Color handlers
  const handleAddColor = () => {
    if (newColor.name && newColor.hex) {
      setVariantAttributes(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          [newColor.name]: newColor.hex
        }
      }));
      setNewColor({ name: '', hex: '#ffffff' });
    }
  };

  const handleDeleteColor = (colorName) => {
    setVariantAttributes(prev => {
      const newColors = { ...prev.colors };
      delete newColors[colorName];
      return { ...prev, colors: newColors };
    });
  };

  // Custom Field handlers
  const handleAddCustomField = () => {
    if (newCustomField.name) {
      setVariantAttributes(prev => ({
        ...prev,
        customFields: [...prev.customFields, { ...newCustomField }]
      }));
      setNewCustomField({ name: '', type: 'text', options: [] });
    }
  };

  const handleDeleteCustomField = (index) => {
    setVariantAttributes(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };

  // Form data for editing
  const [editFormData, setEditFormData] = useState({
    sku: '',
    color: '',
    size: '',
    colorHex: '',
    weight: '',
    price: '',
    comparePrice: '',
    baseCost: '',
    available: 'available',
    addToCampaigns: false,
  });

  useEffect(() => {
    setInternalShowForm(showForm);
    if (showForm) {
      setEditingId(null);
      setFormData({
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
    if (deleteSelectedTrigger) {
      handleDeleteSelected();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSelectedTrigger]);

  // In your component, replace the useEffect that loads from localStorage
  useEffect(() => {
    // Load saved attributes from API
    const loadAttributes = async () => {
      if (!id) return;

      const response = await getVariantAttributes(id);
      if (response?.success && response.data) {
        setVariantAttributes(response.data);
      } else {
        // Fallback to default if no attributes in DB
        setVariantAttributes({
          sizes: ['L', 'XS', 'S', 'M'],
          colors: {
            white: '#ffffff',
            black: '#000000',
          },
          customFields: []
        });
      }
    };

    loadAttributes();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toISOString().split('T')[0];
  };

  // fetch variants on mount / id change
  useEffect(() => {
    if (!id) return;

    const fetchVariantsData = async () => {
      const json = await getVariants(id);
      if (json?.success && Array.isArray(json.data)) {
        const mappedRows = json.data.map((item) => ({
          id: item._id,
          sku: item.sku,
          color: item.color,
          size: item.size,
          colorHex: item.colorHex || '#ffffff',
          weight: item.weight,
          price: item.basePrice ?? 0,
          comparePrice: null,
          baseCost: null,
          available: item.available ?? 'available',
          addToCampaigns: item.addToCampaigns ?? false,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));
        setRows(mappedRows);
      } else {
        setRows([]);
      }
    };

    fetchVariantsData();
  }, [id]);

  // Update save button handler to save to database
  const handleSaveAttributes = async () => {
    try {
      const response = await saveVariantAttributes(id, variantAttributes);

      if (response?.success) {
        toast.success('Attributes saved Successfull');
        setAttributesModalOpen(false);
      } else {
        toast.error(response?.message || 'Failed to save attributes');
      }
    } catch (error) {
      console.error('Error saving attributes:', error);
      toast.error('Failed to save attributes');
    }
  };

  // form changes - UPDATED VERSION
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'addToCampaigns' ? e.target.checked : value
    }));
  };

  // ---------- CREATE (POST) ----------
  const handleSubmit = async () => {
    // Validation
    if (!formData.sku?.trim()) {
      toast.warn('SKU is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.warn('Valid selling price is required');
      return;
    }

    // Collect custom fields data
    const customAttributes = {};
    variantAttributes.customFields.forEach(field => {
      const fieldValue = formData[`custom_${field.name}`];
      if (fieldValue !== undefined && fieldValue !== '') {
        customAttributes[field.name] = fieldValue;
      }
    });

    // 🔥 IMPORTANT: Get colorHex from selected color
    const selectedColorHex = variantAttributes.colors[formData.color] || '#ffffff';

    const payload = {
      sku: formData.sku,
      size: formData.size,  // Don't convert to number if it's string
      weight: formData.weight ? parseFloat(formData.weight) : 0,
      color: formData.color,
      colorHex: selectedColorHex,  // ✅ Dynamic color hex from selected color
      basePrice: parseFloat(formData.price),
      available: formData.available.toLowerCase().trim(),
      addToCampaigns: formData.addToCampaigns,
      customAttributes: customAttributes
    };

    console.log("Sending payload:", payload); // Debug log

    const json = await createVariant(id, payload);

    if (json?.success && json.data) {
      const item = json.data;
      const newRow = {
        id: item._id || uuidv4(),
        sku: item.sku,
        color: item.color,
        size: item.size,
        colorHex: item.colorHex || selectedColorHex,
        weight: item.weight,
        price: item.basePrice ?? parseFloat(formData.price),
        comparePrice: null,
        baseCost: null,
        available: formData.available.toLowerCase().trim(),
        addToCampaigns: formData.addToCampaigns,
        customAttributes: item.customAttributes || customAttributes,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      };
      setRows(prev => [...prev, newRow]);
      setInternalShowForm(false);
      if (onFormClose) onFormClose();
      setFormData({
        sku: '',
        color: '',
        size: '',
        colorHex: '#ffffff',
        weight: '',
        price: '',
        comparePrice: '',
        baseCost: '',
        available: 'available',
        addToCampaigns: false
      });
      toast.success('Variant added successfully!');
    } else {
      toast.error(json?.message || 'Failed to create variant');
    }
  };


  // ---------- UPDATE (PUT) ----------
  const handleSaveEdit = async () => {
    if (!editFormData.sku || !editFormData.color || !editFormData.size || !editFormData.price) {
      toast.warn('Please fill all required fields!');
      return;
    }

    const variantId = editingId;
    if (!variantId) return toast.error('No variant selected to update.');

    const payload = {
      sku: editFormData.sku,
      size: isNaN(Number(editFormData.size)) ? editFormData.size : Number(editFormData.size),
      weight: isNaN(Number(editFormData.weight)) ? editFormData.weight : Number(editFormData.weight),
      color: editFormData.color,
      colorHex: editFormData.colorHex,
      basePrice: parseFloat(editFormData.price),
      available: editFormData.available.toLowerCase().trim(),
      addToCampaigns: editFormData.addToCampaigns,
    };

    const json = await updateVariant(id, variantId, payload);

    if (json?.success && json.data) {
      const item = json.data;
      const updatedRow = {
        id: item._id || variantId,
        sku: item.sku,
        color: item.color,
        size: item.size,
        colorHex: item.colorHex || '#ffffff',
        weight: item.weight,
        price: item.basePrice ?? parseFloat(editFormData.price),
        comparePrice: null,
        baseCost: null,
        available: editFormData.available?.toLowerCase().trim(),
        addToCampaigns: editFormData.addToCampaigns,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      };
      setRows(prev => prev.map(r => (r.id === variantId ? updatedRow : r)));
      setEditingId(null);
    } else {
      const updatedDate = new Date().toISOString();
      setRows(prev => prev.map(row => row.id === variantId ? {
        ...row,
        sku: editFormData.sku,
        color: editFormData.color,
        size: editFormData.size,
        colorHex: editFormData.colorHex,
        weight: editFormData.weight,
        price: parseFloat(editFormData.price),
        comparePrice: editFormData.comparePrice ? parseFloat(editFormData.comparePrice) : null,
        baseCost: editFormData.baseCost ? parseFloat(editFormData.baseCost) : null,
        available: editFormData.available,
        addToCampaigns: editFormData.addToCampaigns,
        updatedAt: updatedDate,
      } : row));
      setEditingId(null);
    }
  };


  // ---------- DELETE (single) ----------
  const handleDeleteClick = async (variantId) => {
    if (!window.confirm('Are you sure you want to delete this variant?')) return;
    const json = await deleteVariant(id, variantId);
    if (json?.success) {
      setRows(prev => prev.filter(r => r.id !== variantId));
      setSelectedRows(prev => prev.filter(i => i !== variantId));
    } else {
      toast.error(json?.message || 'Delete failed');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return toast.warn('Please select at least one row to delete.');
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} selected variant(s)?`)) return;

    const deletePromises = selectedRows.map(vId => deleteVariant(id, vId));
    const results = await Promise.all(deletePromises);
    const failed = results.filter(r => !r?.success);
    if (failed.length > 0) console.warn('Some deletions failed', failed);
    setRows(prev => prev.filter(r => !selectedRows.includes(r.id)));
    setSelectedRows([]);
  };


  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(rows.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleCancelForm = () => {
    setInternalShowForm(false);
    if (onFormClose) onFormClose();
  };

  // print area modal functions
  const handlePrintAreaChange = (event) => {
    const { name, value } = event.target;
    setPrintAreaData(prev => ({ ...prev, [name]: value }));
  };

  const generateTIB = () => {
    const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `PA-${randomPart}`;
  };

  const handleModalOpen = (row) => {
    const tibValue = (row && row.id) ? row.id : generateTIB();
    setPrintAreaData({
      tib: tibValue,
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

  const handleEditClick = (row) => {
    setEditingId(row.id);
    setInternalShowForm(false);
    if (onFormClose) onFormClose();

    // Base edit form data
    const editData = {
      sku: row.sku,
      color: row.color,
      size: row.size,
      colorHex: row.colorHex,
      weight: row.weight,
      price: row.price ? String(row.price) : '',
      comparePrice: row.comparePrice ? String(row.comparePrice) : '',
      baseCost: row.baseCost ? String(row.baseCost) : '',
      available: row.available || 'available',
      addToCampaigns: row.addToCampaigns || false,
    };

    if (row.customAttributes) {
      Object.entries(row.customAttributes).forEach(([key, value]) => {
        editData[`custom_${key}`] = value;
      });
    } F

    setEditFormData(editData);
  };

  const availableOptions = [
    { value: 'available', label: 'Available' },
    { value: 'out of stock', label: 'Out of Stock' },
    { value: 'coming soon', label: 'Coming Soon' },
    { value: 'discontinued', label: 'Discontinued' },
  ];

  const handlePrintAreaSubmit = () => {
    if (!printAreaData.key || !printAreaData.displayName || !printAreaData.width || !printAreaData.height) {
      toast.warn('Please fill all fields!');
      return;
    }
    const newPrintArea = {
      id: Date.now(),
      tib: printAreaData.tib || generateTIB(),
      key: printAreaData.key,
      displayName: printAreaData.displayName,
      width: printAreaData.width,
      height: printAreaData.height,
      createdAt: new Date().toISOString(),
    };
    console.log('New Print Area Added:', newPrintArea);
    toast.success('Print area added successfully!');
    handleModalClose();
  };

  // ---------------- RENDER ----------------
  return (
    <Box sx={{ width: '100%' }}>
      {/* Add Variant Form (desktop & compact-friendly) */}
      {internalShowForm && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add New Variant
            </Typography>

            {/* Main Grid with ALL fields including custom fields */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(auto-fill, minmax(250px, 1fr))'
              },
              gap: 2
            }}>
              {/* Basic Fields */}
              <TextField
                label="Variant SKU"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                fullWidth
                size="small"
                required
                InputLabelProps={{ required: false }}
              />

              {/* Size Dropdown */}
              {Array.isArray(variantAttributes.sizes) && variantAttributes.sizes.length > 0 && (
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
                  {variantAttributes.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </TextField>
              )}

              {/* Color Dropdown */}
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
                  {Object.keys(variantAttributes.colors).map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </TextField>
              )}

              <TextField
                label="Your Selling Price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                fullWidth
                size="small"
                type="number"
                InputProps={{ inputProps: { step: 0.01 } }}
                required
                InputLabelProps={{ required: false }}
              />

              <TextField
                label="Your Cost Price"
                name="baseCost"
                value={formData.baseCost}
                onChange={handleInputChange}
                fullWidth
                size="small"
                type="number"
                InputProps={{ inputProps: { step: 0.01 } }}
                InputLabelProps={{ required: false }}
              />

              <FormControl fullWidth size="small">
                <InputLabel>Available</InputLabel>
                <Select
                  name="available"
                  value={formData.available}
                  onChange={handleInputChange}
                  label="Available"
                >
                  {availableOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Custom Fields - Mixed in the same grid */}
              {variantAttributes.customFields.map((field, index) => (
                field.type === 'select' ? (
                  <FormControl key={index} fullWidth size="small">
                    <InputLabel>{field.name}</InputLabel>
                    <Select
                      name={`custom_${field.name}`}
                      value={formData[`custom_${field.name}`] || ''}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          [name]: value
                        }));
                      }}
                      label={field.name}
                    >
                      <MenuItem value="">Select {field.name}</MenuItem>
                      {field.options.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : field.type === 'checkbox' ? (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        name={`custom_${field.name}`}
                        checked={formData[`custom_${field.name}`] || false}
                        onChange={(e) => {
                          const { name, checked } = e.target;
                          setFormData(prev => ({
                            ...prev,
                            [name]: checked
                          }));
                        }}
                      />
                    }
                    label={field.name}
                    sx={{
                      gridColumn: {
                        xs: 'span 2',
                        sm: 'span 1'
                      }
                    }}
                  />
                ) : (
                  <TextField
                    key={index}
                    label={field.name}
                    name={`custom_${field.name}`}
                    value={formData[`custom_${field.name}`] || ''}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    type={field.type}
                  />
                )
              ))}

              {/* Plus Icon Button - LAST ITEM (after all custom fields) */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Button
                  variant="outlined"
                  onClick={() => setAttributesModalOpen(true)}
                  startIcon={<AddIcon />}
                  sx={{
                    width: '100%',
                    py: 1,
                    borderStyle: 'dashed',
                    textTransform: 'none'
                  }}
                >
                  Manage Attributes
                </Button>
              </Box>
            </Box>

            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button variant="outlined" onClick={handleCancelForm}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "skyblue",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#5bbad5"
                  }
                }}

              >
                Add Variant
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Compact (small + medium) => card list, Large => table */}
      {isCompact ? (
        // COMPACT: card list
        <Box sx={{ display: 'grid', gap: 2 }}>
          {rows.length === 0 ? (
            <Card><CardContent><Typography>No variants found. Click "New Variant" to add one.</Typography></CardContent></Card>
          ) : rows.map(row => (
            <Card key={row.id} sx={{ p: 1 }}>
              {editingId === row.id ? (
                <CardContent>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1
                  }}>
                    <TextField name="sku" value={editFormData.sku} onChange={handleEditInputChange} size="small" label="SKU" fullWidth />
                    <TextField name="color" value={editFormData.color} onChange={handleEditInputChange} size="small" label="Color" fullWidth />
                    <TextField name="size" value={editFormData.size} onChange={handleEditInputChange} size="small" label="Size" fullWidth />
                    <TextField name="price" value={editFormData.price} onChange={handleEditInputChange} size="small" type="number" label="Price" fullWidth />
                    {/* Add custom fields in edit mode */}
                    {variantAttributes.customFields.map((field, idx) => (
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
                            {field.options.map(option => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
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
                    ))}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button variant="contained" size="small" onClick={handleSaveEdit} startIcon={<SaveIcon />}>Save</Button>
                      <Button variant="outlined" size="small" onClick={handleCancelEdit} startIcon={<CancelIcon />}>Cancel</Button>
                    </Box>
                  </Box>
                </CardContent>
              ) : (
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{row.sku || (row.id.substring(0, 8) + '...')}</Typography>
                      <Typography variant="caption" color="text.secondary">{row.color} • {row.size}</Typography>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => handleEditClick(row)} title="Edit"><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDeleteClick(row.id)} title="Delete"><DeleteIcon fontSize="small" /></IconButton>
                      {isCustomPrintArea && (
                        <Button variant="contained" size="small" onClick={() => handleModalOpen(row)} sx={{ ml: 1, minWidth: '36px', padding: '6px' }}><AddIcon fontSize="small" /></Button>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Price</Typography>
                      <Typography>£{(row.price ?? 0).toFixed(2)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Available</Typography>
                      <Typography>{row.available}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Weight</Typography>
                      <Typography>{row.weight || '-'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Created</Typography>
                      <Typography>{formatDate(row.createdAt)}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              )}
            </Card>
          ))}
        </Box>
      ) : (
        // LARGE: table with horizontal scroll fallback (minWidth only applied on large)
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer component={Paper} sx={{ minWidth: { lg: 1100 }, width: '100%' }}>
            <Table sx={{ minWidth: { lg: 1100 } }} aria-label="variants table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox checked={rows.length > 0 && selectedRows.length === rows.length} onChange={handleSelectAll} indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length} />
                  </TableCell>
                  <TableCell>TIB Variant ID</TableCell>
                  <TableCell>Fulfield SKU</TableCell>
                  <TableCell>Your Selling Price</TableCell>
                  {/* <TableCell>Your Cost Price</TableCell> */}
                  <TableCell>Available</TableCell>
                  <TableCell>Add to Campaigns</TableCell>
                  <TableCell>Create at</TableCell>
                  <TableCell>Update at</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedRows.includes(row.id)} onChange={() => handleCheckboxChange(row.id)} />
                    </TableCell>

                    {editingId === row.id ? (
                      <>
                        <TableCell>{row.id.substring(0, 8)}</TableCell>
                        <TableCell>
                          <TextField name="sku" value={editFormData.sku} onChange={handleEditInputChange} size="small" fullWidth />
                        </TableCell>
                        <TableCell>
                          <TextField name="price" value={editFormData.price} onChange={handleEditInputChange} size="small" type="number" InputProps={{ inputProps: { step: 0.01 } }} fullWidth />
                        </TableCell>
                        <TableCell>
                          <TextField name="comparePrice" value={editFormData.comparePrice} onChange={handleEditInputChange} size="small" type="number" InputProps={{ inputProps: { step: 0.01 } }} fullWidth />
                        </TableCell>
                        <TableCell>
                          <TextField name="baseCost" value={editFormData.baseCost} onChange={handleEditInputChange} size="small" type="number" InputProps={{ inputProps: { step: 0.01 } }} fullWidth />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" fullWidth>
                            <Select name="available" value={editFormData.available} onChange={handleEditInputChange}>
                              {availableOptions.map(option => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Checkbox name="addToCampaigns" checked={editFormData.addToCampaigns} onChange={handleEditInputChange} />
                        </TableCell>
                        <TableCell>{formatDate(row.createdAt)}</TableCell>
                        <TableCell>{formatDate(row.updatedAt)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton color="primary" onClick={handleSaveEdit} size="small"><SaveIcon /></IconButton>
                            <IconButton color="secondary" onClick={handleCancelEdit} size="small"><CancelIcon /></IconButton>
                          </Box>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{row.id.substring(0, 8)}...</TableCell>
                        <TableCell>{row.sku}</TableCell>
                        <TableCell>£{(row.price ?? 0).toFixed(2)}</TableCell>
                        {/* <TableCell>{row.baseCost ? `£${row.baseCost.toFixed(2)}` : '-'}</TableCell> */}
                        <TableCell sx={{ padding: '10px' }}>
                          <Box sx={{
                            px: 1, py: 0.5, borderRadius: 1, display: 'inline-block', textAlign: 'center', width: '100px', padding: '10px',
                            backgroundColor: row.available === 'available' ? '#e8f5e9' : row.available === 'out of stock' ? '#ffebee' : row.available === 'coming soon' ? '#fff3e0' : '#f5f5f5',
                            color: row.available === 'available' ? '#2e7d32' : row.available === 'out of stock' ? '#c62828' : row.available === 'coming soon' ? '#f57c00' : '#616161',
                          }}>{row.available}</Box>
                        </TableCell>
                        <TableCell>{row.addToCampaigns ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{formatDate(row.createdAt)}</TableCell>
                        <TableCell>{formatDate(row.updatedAt)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <IconButton color="primary" onClick={() => handleEditClick(row)} size="small" title="Edit"><EditIcon /></IconButton>
                            <IconButton color="error" onClick={() => handleDeleteClick(row.id)} size="small" title="Delete"><DeleteIcon /></IconButton>
                            {isCustomPrintArea && (
                              <Button variant='contained' size='small' onClick={() => handleModalOpen(row)} sx={{ backgroundColor: '#3b6d92', color: '#fff !important', '&:hover': { backgroundColor: '#2a4d6e' }, ml: 2, minWidth: '5px', padding: '6px' }}>
                                <AddIcon fontSize="small" />
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Modal for Print Area - use fullWidth and responsive behavior */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth='sm' fullWidth fullScreen={isCompact}>
        <DialogTitle>Add Custom Print Area</DialogTitle>
        <DialogContent>
          <div className='space-y-4 mt-2'>
            <TextField fullWidth label='Variant ID' value={printAreaData.tib || 'Will be auto-generated'} variant='outlined' size='small' InputProps={{ readOnly: true }} helperText="Auto-generated unique identifier" InputLabelProps={{ required: false }} />
            <TextField fullWidth label='Fulfill Key' name='key' value={printAreaData.key} onChange={handlePrintAreaChange} variant='outlined' size='small' required placeholder='Enter Fulfill Key (e.g., Front, Back)' InputLabelProps={{ required: false }} />
            <TextField fullWidth label='Display Name' name='displayName' value={printAreaData.displayName} onChange={handlePrintAreaChange} variant='outlined' size='small' required placeholder='Enter Display Name' InputLabelProps={{ required: false }} />
            <div className='grid grid-cols-2 gap-4'>
              <TextField label='Width (px)' name='width' value={printAreaData.width} onChange={handlePrintAreaChange} variant='outlined' size='small' type='number' required placeholder='e.g., 1314' />
              <TextField label='Height (px)' name='height' value={printAreaData.height} onChange={handlePrintAreaChange} variant='outlined' size='small' type='number' required placeholder='e.g., 1314' />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color='secondary'>Cancel</Button>
          <Button onClick={handlePrintAreaSubmit} variant='contained' sx={{ backgroundColor: '#3b6d92', '&:hover': { backgroundColor: '#2a4d6e' } }}>Add Print Area</Button>
        </DialogActions>
      </Dialog>

      {/* Attributes Management Modal - Simple Professional Design */}
      <Dialog
        open={attributesModalOpen}
        onClose={() => setAttributesModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: '1px solid #e0e0e0',
          pb: 2,
          bgcolor: '#fafafa'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Manage Variant Attributes
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
            Configure sizes, colors, and custom fields for variants
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box>

            {/* Sizes Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Sizes
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {variantAttributes.sizes.map((size, index) => (
                  <Chip
                    key={index}
                    label={size}
                    onDelete={() => handleDeleteSize(size)}
                    variant="outlined"
                    size="medium"
                    sx={{
                      borderRadius: 1.5,
                      '&:hover': {
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  size="small"
                  label="Add Size"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value.toUpperCase())}
                  placeholder="e.g., XL"
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleAddSize}
                  disabled={!newSize}
                  sx={{
                    textTransform: 'none',
                    px: 3,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none'
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Box>

            {/* Colors Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Colors
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                {Object.entries(variantAttributes.colors).map(([colorName, colorHex]) => (
                  <Box
                    key={colorName}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      bgcolor: '#f8f9fa',
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 1.5,
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 1,
                        backgroundColor: colorHex,
                        border: '1px solid #ddd'
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem' }}>{colorName}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteColor(colorName)}
                      sx={{
                        p: 0.5,
                        color: '#999',
                        '&:hover': { color: '#d32f2f' }
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                <TextField
                  size="small"
                  label="Color Name"
                  value={newColor.name}
                  onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                  placeholder="e.g., Red"
                  sx={{ flex: 2 }}
                />
                <TextField
                  size="small"
                  label="Hex Code"
                  value={newColor.hex}
                  onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                  type="color"
                  sx={{ width: 100 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddColor}
                  disabled={!newColor.name || !newColor.hex}
                  sx={{
                    textTransform: 'none',
                    px: 3,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Box>

            {/* Custom Fields Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Custom Fields
              </Typography>

              <Box sx={{ mb: 3, maxHeight: 280, overflowY: 'auto' }}>
                {variantAttributes.customFields.length === 0 ? (
                  <Box sx={{
                    textAlign: 'center',
                    py: 4,
                    bgcolor: '#fafafa',
                    borderRadius: 1.5,
                    border: '1px solid #e0e0e0'
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      No custom fields added
                    </Typography>
                  </Box>
                ) : (
                  variantAttributes.customFields.map((field, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        mb: 1,
                        bgcolor: '#fafafa',
                        borderRadius: 1.5,
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {field.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {field.type}
                          {field.options.length > 0 && ` • ${field.options.join(', ')}`}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCustomField(index)}
                        sx={{ color: '#999' }}
                      >
                        <DeleteIcon sx={{ fontSize: '1rem' }} />
                      </IconButton>
                    </Box>
                  ))
                )}
              </Box>

              {/* Add Custom Field Form */}
              <Box sx={{
                p: 2,
                bgcolor: '#fafafa',
                borderRadius: 1.5,
                border: '1px solid #e0e0e0'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                  Add New Field
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    label="Field Name"
                    value={newCustomField.name}
                    onChange={(e) => setNewCustomField({ ...newCustomField, name: e.target.value })}
                    placeholder="e.g., Material"
                    sx={{ flex: 2 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <InputLabel>Field Type</InputLabel>
                    <Select
                      value={newCustomField.type}
                      onChange={(e) => setNewCustomField({ ...newCustomField, type: e.target.value, options: [] })}
                      label="Field Type"
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
                      placeholder="Option1, Option2, Option3"
                      onChange={(e) => setNewCustomField({
                        ...newCustomField,
                        options: e.target.value.split(',').map(opt => opt.trim())
                      })}
                      sx={{ flex: 2 }}
                    />
                  )}
                  <Button
                    variant="contained"
                    onClick={handleAddCustomField}
                    disabled={!newCustomField.name}
                    sx={{
                      textTransform: 'none',
                      px: 3,
                      boxShadow: 'none',
                      '&:hover': { boxShadow: 'none' }
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{
          p: 2.5,
          borderTop: '1px solid #e0e0e0',
          bgcolor: '#fafafa'
        }}>
          <Button
            onClick={() => setAttributesModalOpen(false)}
            sx={{
              textTransform: 'none',
              color: '#666'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveAttributes}
            sx={{
              textTransform: 'none',
              px: 3,
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {rows.length === 0 && isLarge && (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>No variants found. Click "New Variant" to add one.</Typography>
        </Box>
      )}
    </Box>
  );
}
