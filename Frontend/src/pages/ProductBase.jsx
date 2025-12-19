import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Breadcrumbs from '../components/Breadcrumbs';
import MenuItem from '@mui/material/MenuItem';
import BasicTabs from '../components/PrintareaAndVariantTabs';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete'; // Trash icon ke liye
import AddIcon from '@mui/icons-material/Add'; // Add icon ke liye

function ProductBase() {
  const [provider, setProvider] = useState('');
  const [providers, setProviders] = useState([
    { label: 'Print-On-Demand.App', value: 'print-on-demand-app' }
  ]);
  
import AddProviderModal from '../components/Admin/AddProviderModal';
import AddCategoryModal from '../components/Admin/AddCategoryModal';

function ProductBase() {
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState('');

  const [providers, setProviders] = useState([
    { label: 'Print-On-Demand.App', value: 'print-on-demand-app' }
  ]);
  const [categories, setCategories] = useState([
    { label: 'T-Shirt', value: 't-shirt', thumbnail: '/images/categories/tshirt.png' },
  ]);


  const [open, setOpen] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [newProvider, setNewProvider] = useState('');
  
  // New state for mockup modal
  const [openMockupModal, setOpenMockupModal] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState(null);
  
  // Category states
  const [categories, setCategories] = useState(['All', 'TIB']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  
  // Sample images for grid
  const [mockupImages, setMockupImages] = useState([
    { id: 1, url: 'https://via.placeholder.com/300x300?text=Mockup+1', title: 'T-Shirt Front', category: 'TIB' },
    { id: 2, url: 'https://via.placeholder.com/300x300?text=Mockup+2', title: 'T-Shirt Back', category: 'TIB' },
    { id: 3, url: 'https://via.placeholder.com/300x300?text=Mockup+3', title: 'Hoodie', category: 'All' },
    { id: 4, url: 'https://via.placeholder.com/300x300?text=Mockup+4', title: 'Mug', category: 'All' },
    { id: 5, url: 'https://via.placeholder.com/300x300?text=Mockup+5', title: 'Phone Case', category: 'All' },
    { id: 6, url: 'https://via.placeholder.com/300x300?text=Mockup+6', title: 'Poster', category: 'All' },
    { id: 7, url: 'https://via.placeholder.com/300x300?text=Mockup+7', title: 'Notebook', category: 'All' },
    { id: 8, url: 'https://via.placeholder.com/300x300?text=Mockup+8', title: 'Cap', category: 'All' },
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [categoryThumbnail, setCategoryThumbnail] = useState(null);
  const [categoryThumbnailPreview, setCategoryThumbnailPreview] = useState('');


  const fulfillmentHandler = (event) => {
    setProvider(event.target.value);
  };
  const fulfillmentCategoryHandler = (e) => {
    setCategory(e.target.value);
  };

  const addProviderHandler = () => {
    if (!newProvider.trim()) return;

    const value = newProvider.toLowerCase().replace(/\s+/g, '-');

    setProviders(prev => [...prev, { label: newProvider, value }]);
    setProvider(value);
    setNewProvider('');
    setOpen(false);
  };
  // const addCategoryHandler = () => {
  //   if (!newCategory.trim()) return;

  //   const value = newCategory.toLowerCase().replace(/\s+/g, '-');

  //   setCategories(prev => [...prev, { label: newCategory, value }]);
  //   setCategory(value);
  //   setNewCategory('');
  //   setOpenCategoryModal(false);
  // };

  const addCategoryHandler = () => {
    if (!newCategory.trim()) return;

    const value = newCategory
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    setCategories((prev) => [
      ...prev,
      {
        label: newCategory.trim(),
        value,
        thumbnail: categoryThumbnailPreview, // for now (later backend upload)
      },
    ]);

    setCategory(value);
    setNewCategory('');
    removeCategoryThumbnail();
    setOpenCategoryModal(false);
  };



  const handleCategoryThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCategoryThumbnail(file);
    setCategoryThumbnailPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleCategoryThumbnailChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };


  const removeCategoryThumbnail = () => {
    setCategoryThumbnail(null);
    setCategoryThumbnailPreview('');
  };


  // Category selection handler
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Add new category handler
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    // Add to categories array
    setCategories(prev => [...prev, newCategory]);
    
    // Add to dropdown and list
    setNewCategory('');
    setShowAddCategoryInput(false);
  };

  // Mockup selection handler
  const handleMockupSelect = (mockup) => {
    setSelectedMockup(mockup);
    setOpenMockupModal(false);
  };

  // Remove mockup from grid
  const handleRemoveMockup = (id, event) => {
    event.stopPropagation(); // Prevent triggering parent click
    setMockupImages(prev => prev.filter(mockup => mockup.id !== id));
    
    // Agar selected mockup remove ho raha hai to selected bhi clear karo
    if (selectedMockup?.id === id) {
      setSelectedMockup(null);
    }
  };

  // Remove selected mockup
  const handleRemoveSelectedMockup = () => {
    setSelectedMockup(null);
  };

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMockup = {
          id: mockupImages.length + 1,
          url: e.target.result,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          category: 'All',
          isUploaded: true
        };
        setMockupImages(prev => [...prev, newMockup]);
        setSelectedMockup(newMockup);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter mockups based on selected category
  const filteredMockups = selectedCategory === 'All' 
    ? mockupImages 
    : mockupImages.filter(mockup => mockup.category === selectedCategory);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <>
      <div className="flex w-5/6 bg-slate-100">
        <div className="w-full p-10">
          <Breadcrumbs />
          <div className='flex gap-10'>
            <div className='w-1/2'>
              <div className="product-fields w-full bg-white mt-5 p-4 rounded-xl border-s-5 border-ocean border-solid">
                <h2 className="text-2xl font-bold text-black mb-10">Basic information</h2>
                {/* Product Title */}
                <div className="mb-5">
                  <TextField label="Product Title" className="w-full" size="small" />
                </div>
                {/* Internal Name */}
                <div className="mb-5">
                  <TextField label="Internal Name" className="w-full" size="small" />
                </div>
                {/* Fulfillment Provider */}
                <div className="mb-5">
                  <FormControl fullWidth size="small">
                    <InputLabel id="fulfillmentProvider-label">
                      Fulfillment Provider
                    </InputLabel>
                    <Select labelId="fulfillmentProvider-label" value={provider} label="Fulfillment Provider" onChange={fulfillmentHandler} >
                      <MenuItem value="">
                        <em>Choose an option</em>
                      </MenuItem>
                      {providers.map((p, index) => (
                        <MenuItem key={index} value={p.value}>
                          {p.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Add Provider */}
                  <div onClick={() => setOpen(true)} className="text-sm text-ocean underline text-end cursor-pointer mt-1">
                    Add Provider
                  </div>
                </div>
                {/* Fulfillment catalog ID */}
                <div className="mb-5">
                  <TextField type="number" label="Fulfillment catalog ID" className="w-full" size="small"/>
                </div>
                {/* Message */}
                <div className="mb-5">
                  <TextField label="Your Message" className="w-full" multiline rows={4} />
                </div>
                {/* Save Button */}
                <div className="save-btn">
                  <button className="text-sm shadow-lg bg-ocean hover:bg-hoverTiger rounded-md text-white py-2 px-4">
                    Save
                  </button>
                </div>
              </div>
            </div>
            <div className='w-1/2'>
              <div className='w-full mockup-container flex justify-between bg-white mt-5 p-4 rounded-xl border-s-5 border-ocean border-solid'>
                <h2 className="text-2xl font-bold text-black">Mockup</h2>
                {/* Upload Mockup Button - Modal Open Karega */}
                <Button 
                  variant="contained" 
                  sx={{bgcolor:"#3b6d92"}}
                  onClick={() => setOpenMockupModal(true)}
                >
                  Upload Mockup
                </Button>
              </div>
              
              {/* Selected Mockup Display */}
              {selectedMockup && (
                <div className="mt-4 bg-white p-4 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2">Selected Mockup</h3>
                  <div className="flex items-center gap-4">
                    <img 
                      src="/src/assets/images/bg-image.webp" 
                      alt={selectedMockup.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{selectedMockup.title}</p>
                      <p className="text-sm text-gray-500">
                        {selectedMockup.isUploaded ? 'Uploaded by you' : 'From library'}
                      </p>
                      <Button
                        sx={{
                          textTransform:"capitalize", 
                          margin:"10px 0;", 
                          padding:"3px 6px", 
                          fontSize:"10px"
                        }}
                        variant="contained" 
                        color="error"
                        onClick={handleRemoveSelectedMockup}
                        startIcon={<DeleteIcon fontSize="small" />}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="mb-5">
              <FormControl fullWidth size="small">
                <InputLabel id="category-label">Fulfillment Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  label="Fulfillment Category"
                  onChange={fulfillmentCategoryHandler}
                >
                  <MenuItem value="">
                    <em>Choose an option</em>
                  </MenuItem>

                  {categories.map((c, index) => (
                    <MenuItem key={index} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Add Category */}
              <div
                onClick={() => setOpenCategoryModal(true)}
                className="text-sm text-ocean underline text-end cursor-pointer mt-1"
              >
                Add Category
              </div>


            </div>


            {/* Fulfillment catalog ID */}
            <div className="mb-5">
              <TextField
                type="number"
                label="Fulfillment catalog ID"
                className="w-full"
                size="small"
              />
            </div>

            {/* Message */}
            <div className="mb-5">
              <TextField
                label="Your Message"
                className="w-full"
                multiline
                rows={4}
              />
            </div>

            {/* Save Button */}
            <div className="save-btn">
              <button className="text-sm shadow-lg bg-ocean hover:bg-hoverTiger rounded-md text-white py-2 px-4">
                Save
              </button>
            </div>
          </div>
          <BasicTabs />
        </div>
      </div>

      {/* ================= PROVIDER MODAL ================= */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 400,
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <h2 className="text-xl font-semibold mb-4">Add Provider</h2>

          <TextField
            label="Provider Name"
            fullWidth
            size="small"
            value={newProvider}
            onChange={(e) => setNewProvider(e.target.value)}
          />

          <div className="flex justify-end gap-2 mt-5">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm border rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={addProviderHandler}
              className="px-4 py-2 text-sm bg-ocean text-white rounded-md cursor-pointer"
            >
              Add Provider
            </button>
          </div>
        </Box>
      </Modal>

      {/* ================= MOCKUP SELECTION MODAL ================= */}
      <Modal open={openMockupModal} onClose={() => setOpenMockupModal(false)}>
        <Box
          sx={{
            width: '90%',
            maxWidth: 1200,
            maxHeight: '80vh',
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            overflowY: 'auto',
          }}
        >
          <div className='flex gap-6'>
            <aside className='w-1/4'>
              <FormControl fullWidth size="small">
                <InputLabel id="category-select-label">Choose Category</InputLabel>
                <Select 
                  labelId="category-select-label"
                  value={selectedCategory}
                  label="Choose Category"
                  onChange={handleCategoryChange}
                >
                  {categories.map((category, index) => (
                    <MenuItem key={index} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Add Category Button/Input */}
              <div className="mt-3">
                {showAddCategoryInput ? (
                  <div className="flex gap-2">
                    <TextField
                      size="small"
                      placeholder="New category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleAddCategory}
                      sx={{ minWidth: 'auto', padding: '6px 12px' }}
                    >
                      <AddIcon fontSize="small" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    sx={{
                      textTransform: "capitalize", 
                      bgcolor: "#3b6d92", 
                      color: "#fff", 
                      margin: "10px 0", 
                      padding: "3px 6px", 
                      fontSize: "10px"
                    }} 
                    variant="text"
                    onClick={() => setShowAddCategoryInput(true)}
                    startIcon={<AddIcon fontSize="small" />}
                  >
                    Add Category
                  </Button>
                )}
              </div>
              
              {/* Categories List */}
              <ul className='aside-categories mt-4 space-y-1'>
                {categories.map((category, index) => (
                  <li 
                    key={index}
                    className={`text-sm py-1 px-3 rounded-sm cursor-pointer transition-colors ${
                      selectedCategory === category 
                        ? 'font-bold bg-[#f05a28] text-white' 
                        : 'font-normal text-black hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </aside>
            
            <div className='w-3/4'>
              <div className="flex justify-between items-center mb-6">
                {/* Direct File Upload Option */}
                <Button
                  component="label"
                  variant="contained"
                  sx={{
                    backgroundColor: "#3b6d92",
                    textTransform: "capitalize"
                  }}
                  startIcon={<AddIcon />}
                >
                  Upload File
                  <VisuallyHiddenInput 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </Button>
              </div>
              
              {/* Mockup Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMockups.map((mockup) => (
                  <div 
                    key={mockup.id}
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg relative group ${
                      selectedMockup?.id === mockup.id ? 'ring-2 ring-[#f05a28]' : ''
                    }`}
                    onClick={() => handleMockupSelect(mockup)}
                  >
                    {/* Trash Icon for removing mockup */}
                    <div 
                      className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleRemoveMockup(mockup.id, e)}
                    >
                      <DeleteIcon 
                        sx={{ 
                          color: '#f05a28',
                          fontSize: '20px',
                          cursor: 'pointer'
                        }} 
                      />
                    </div>
                    
                    <div className="aspect-square overflow-hidden relative">
                      <img 
                        src="/src/assets/images/bg-image.webp" 
                        alt={mockup.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 bg-white">
                      <h3 className="font-medium text-center truncate">{mockup.title}</h3>
                      {mockup.isUploaded && (
                        <span className="text-xs text-gray-500 block text-center">Uploaded</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Close Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setOpenMockupModal(false)}
                  className="px-4 py-2 text-sm border rounded-md cursor-pointer hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
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