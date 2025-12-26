import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Breadcrumbs from '../components/Breadcrumbs';
import MenuItem from '@mui/material/MenuItem';
import BasicTabs from '../components/PrintareaAndVariantTabs';
import Box from '@mui/material/Box';

import { useParams, useNavigate } from "react-router-dom";

import { getAllProvider } from '../api/provider.api';
import { createProduct } from '../api/product.api';

import AddProviderModal from '../components/Admin/AddProviderModal';
import AddCategoryModal from '../components/Admin/AddCategoryModal';
import AddMockup from '../components/Admin/AddMockup';
import { Typography } from '@mui/material';
import { getAllCategory } from '../api/category.api';

// Local storage se data load karne ka function
const loadMockupsFromStorage = () => {
  const savedMockups = localStorage.getItem('selectedMockups');
  return savedMockups ? JSON.parse(savedMockups) : [];
};

// Local storage mein save karne ka function
const saveMockupsToStorage = (mockups) => {
  localStorage.setItem('selectedMockups', JSON.stringify(mockups));
};

function ProductBase() {
  /* ================== BASIC STATES ================== */
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState('');

  const [productTitle, setProductTitle] = useState('');
  const [internalName, setInternalName] = useState('');
  const [fulfilmentCatalogID, setFulfilmentCatalogID] = useState('');
  const [description, setDescription] = useState('');


  const { id: productId } = useParams(); // 👈 yahin se sab decide hoga
  const navigate = useNavigate();

  const isEditMode = Boolean(productId); // true if param exists



  const [providers, setProviders] = useState([
    { label: 'Print-On-Demand.App', value: 'print-on-demand-app' }
  ]);

  const [categories, setCategories] = useState([
    { label: 'T-Shirt', value: 't-shirt', thumbnail: '/images/categories/tshirt.png' }
  ]);

  const [open, setOpen] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  // const [selectedMockups, setSelectedMockups] = useState([]);
  const [selectedMockups, setSelectedMockups] = useState(() => {
    return loadMockupsFromStorage(); // Initial value localStorage se
  });

  const [newProvider, setNewProvider] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categoryThumbnail, setCategoryThumbnail] = useState(null);
  const [categoryThumbnailPreview, setCategoryThumbnailPreview] = useState('');

  /* ================== MOCKUP STATES ================== */
  const [openMockupModal, setOpenMockupModal] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState(null);

  const [mockupCategories, setMockupCategories] = useState(['All', 'TIB']);
  const [selectedMockupCategory, setSelectedMockupCategory] = useState('All');
  const [showAddMockupCategory, setShowAddMockupCategory] = useState(false);



  const [mockupImages, setMockupImages] = useState([
    { id: 1, url: 'https://i.pinimg.com/736x/37/b8/da/37b8da1abf03a7defd4dfc76d9f8d536.jpg', title: 'T-Shirt Front', category: 'TIB' },
    { id: 2, url: 'https://i.pinimg.com/736x/37/b8/da/37b8da1abf03a7defd4dfc76d9f8d536.jpg', title: 'T-Shirt Back', category: 'TIB' },
  ]);

  /* ================== HANDLERS ================== */
  const fulfillmentHandler = (e) => setProvider(e.target.value);
  const fulfillmentCategoryHandler = (e) => setCategory(e.target.value);



  const addProviderHandler = () => {
    if (!newProvider.trim()) return;
    const value = newProvider.toLowerCase().replace(/\s+/g, '-');
    setProviders(prev => [...prev, { label: newProvider, value }]);
    setProvider(value);
    setNewProvider('');
    setOpen(false);
  };

  const addCategoryHandler = () => {
    if (!newCategory.trim()) return;
    const value = newCategory.toLowerCase().replace(/\s+/g, '-');
    setCategories(prev => [...prev, { label: newCategory, value, thumbnail: categoryThumbnailPreview }]);
    setCategory(value);
    setNewCategory('');
    setCategoryThumbnail(null);
    setCategoryThumbnailPreview('');
    setOpenCategoryModal(false);
  };

  const saveProductHandler = async () => {
    const payload = {
      productTitle,
      internalName,
      fulfilmentProvider: provider,
      category,
      fulfilmentCatalogID,
      description
    };

    const data = await createProduct(payload);

    if (data.success) {

      if (data.success) {
        navigate(`/admin/product/${data.data._id}`, { replace: true });
      }
    }
  };


  useEffect(() => {
    const idFromUrl = window.location.pathname.split('/').pop();
    if (idFromUrl) {
      // setProductId(idFromUrl);
      // setProductCreated(true);
    }
  }, []);


  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
  });


  const handleMockupSelect = (selectedData) => {
    const updatedMockups = [...selectedMockups, ...selectedData];
    setSelectedMockups(updatedMockups);
    saveMockupsToStorage(updatedMockups); // Save to localStorage
  };

  // ✅ REMOVE MOCKUP FUNCTION

  const removeMockup = (id) => {
    const updatedMockups = selectedMockups.filter(mockup => mockup.id !== id);
    setSelectedMockups(updatedMockups);
    saveMockupsToStorage(updatedMockups); // Save to localStorage
  };

  // ✅ NEW: Clear all mockups with localStorage
  const clearAllMockups = () => {
    setSelectedMockups([]);
    localStorage.removeItem('selectedMockups'); // Clear from localStorage
  };

  // ✅ UPDATE: Mockup edit function
  const editMockup = (mockup) => {
    // Mockup data ko localStorage mein save karein editor ke liye
    localStorage.setItem('mockupToEdit', JSON.stringify(mockup));

    // Redirect to editor page
    window.location.href = '/admin/editor';
  };

  // ==================

  useEffect(() => {
    const fetchProviders = async () => {
      const data = await getAllProvider();
      if (data && data.length > 0) {
        const formattedProviders = data.map(p => ({
          label: p.provider,
          value: p._id
        }));
        setProviders(formattedProviders);
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategory();
      if (data && data.length > 0) {
        const formattedCategories = data.map(c => ({
          label: c.category,  // sirf naam
          value: c._id        // id ya koi unique value
        }));
        setCategories(formattedCategories);
      }
    };

    fetchCategories();
  }, []);

  /* ================== JSX ================== */
  return (
    <>
      <div className="flex w-full bg-slate-100">
        <div className="w-full p-8">
          <Breadcrumbs />

          <div className="flex gap-10">
            {/* ================= LEFT FORM ================= */}
            <div className="w-1/2 bg-white mt-5 p-4 rounded-xl border-s-5 border-ocean">
              <h2 className="text-2xl font-bold mb-10">Basic information</h2>

              <TextField
                label="Product Title"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
              />

              <TextField
                label="Internal Name"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={internalName}
                onChange={(e) => setInternalName(e.target.value)}
              />

              <FormControl fullWidth size="small" className="mb-2">
                <InputLabel>Fulfillment Provider</InputLabel>
                <Select value={provider} onChange={fulfillmentHandler} label="Fulfillment Provider">
                  <MenuItem value=""><em>Choose an option</em></MenuItem>
                  {providers.map((p, i) => (
                    <MenuItem key={i} value={p.value}>{p.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div onClick={() => setOpen(true)} className="text-sm text-ocean underline text-end cursor-pointer mb-5">
                Add Provider
              </div>

              <FormControl fullWidth size="small" className="mb-2">
                <InputLabel>Fulfillment Category</InputLabel>
                <Select value={category} onChange={fulfillmentCategoryHandler}>
                  <MenuItem value=""><em>Choose an option</em></MenuItem>
                  {categories.map((c, i) => (
                    <MenuItem key={i} value={c.value}>{c.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div onClick={() => setOpenCategoryModal(true)} className="text-sm text-ocean underline text-end mb-5 cursor-pointer">
                Add Category
              </div>

              <TextField
                type="number"
                label="Fulfillment catalog ID"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={fulfilmentCatalogID}
                onChange={(e) => setFulfilmentCatalogID(e.target.value)}
              />
              <TextField
                label="Your Message"
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 2 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button onClick={saveProductHandler} className="bg-ocean text-white px-4 py-2 rounded-md cursor-pointer">Save</button>
            </div>

            {/* ================= RIGHT MOCKUP ================= */}
            {
              isEditMode && (
                <div className="w-1/2">
                  <div className="flex justify-between bg-white mt-5 p-4 rounded-xl border-s-5 border-ocean">
                    <h2 className="text-2xl font-bold">Mockup</h2>
                    <Button variant="contained" sx={{ bgcolor: '#3b6d92' }} onClick={() => setOpenMockupModal(true)}>
                      Upload Mockup
                    </Button>
                  </div>

                  {/* ================= SELECTED MOCKUPS ================= */}
                  {selectedMockups.length > 0 ? (
                    selectedMockups.map((mockup) => (
                      <Box key={mockup.id} sx={{ marginTop: "20px" }}>
                        <div className='flex items-center gap-5 bg-white p-4 rounded-xl shadow-sm'>
                          <img
                            src={mockup.url}
                            alt={mockup.title}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: "cover",
                              borderRadius: "10px"
                            }}
                          />
                          <div className='flex-1'>
                            <Typography sx={{
                              marginBottom: "0",
                              lineHeight: "14px",
                              fontWeight: 500
                            }}>
                              {mockup.title}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                              {mockup.dimensions}
                            </Typography>
                            {mockup.category && (
                              <Typography variant="caption" sx={{
                                display: 'block',
                                color: 'primary.main',
                                mt: 0.5
                              }}>
                                Category: {mockup.category}
                              </Typography>
                            )}
                            <div className='flex items-center gap-2'>
                              <Button
                                variant="contained"
                                sx={{
                                  display: "block",
                                  minWidth: "auto",
                                  bgcolor: '#3b6d92',
                                  margin: "10px 0 0 0",
                                  padding: "8px",
                                  fontSize: "12px",
                                  textTransform: "capitalize",

                                }}
                                onClick={() => editMockup(mockup)}

                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                              </Button>
                              <Button
                                variant="contained"
                                sx={{
                                  display: "block",
                                  minWidth: "auto",
                                  bgcolor: 'error.main',
                                  margin: "10px 0 0 0",
                                  padding: "8px",
                                  fontSize: "12px",
                                  textTransform: "capitalize",
                                  '&:hover': {
                                    bgcolor: 'error.dark'
                                  }
                                }}
                                onClick={() => removeMockup(mockup.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                              </Button>
                            </div>



                          </div>
                        </div>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{
                      mt: 3,
                      textAlign: 'center',
                      py: 4,
                      border: '1px dashed #ddd',
                      borderRadius: 2,
                      bgcolor: '#fafafa'
                    }}>
                      <Typography color="text.secondary">
                        No mockups selected. Click "Upload Mockup" to add.
                      </Typography>
                    </Box>
                  )}

                  {/* Optional: Clear All Button */}
                  {selectedMockups.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={clearAllMockups}
                      >
                        Clear All Mockups
                      </Button>
                    </Box>
                  )}
                </div>

              )
            }
          </div>

          {isEditMode && (
            <BasicTabs productId={productId} />
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      <AddMockup
        open={openMockupModal}
        onClose={() => setOpenMockupModal(false)}
        Mockupdata={mockupImages}
        onSelect={handleMockupSelect}
      />

      <AddProviderModal
        open={open}
        onClose={() => setOpen(false)}
        newProvider={newProvider}
        setNewProvider={setNewProvider}
        onAdd={addProviderHandler}
      />

      <AddCategoryModal
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        categoryThumbnailPreview={categoryThumbnailPreview}
        setCategoryThumbnail={setCategoryThumbnail}
        setCategoryThumbnailPreview={setCategoryThumbnailPreview}
        onAdd={addCategoryHandler}
      />
    </>
  );
}

export default ProductBase;