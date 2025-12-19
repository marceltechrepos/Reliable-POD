import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Breadcrumbs from '../components/Breadcrumbs';
import MenuItem from '@mui/material/MenuItem';
import BasicTabs from '../components/PrintareaAndVariantTabs';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
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


  return (
    <>
      <div className="flex w-full bg-slate-100">
        <div className="w-full p-10">
          <Breadcrumbs />

          <div className="product-fields w-1/2 bg-white mt-5 p-4 rounded-xl border-s-5 border-ocean border-solid">
            <h2 className="text-2xl font-bold text-black mb-10">
              Basic information
            </h2>

            {/* Product Title */}
            <div className="mb-5">
              <TextField
                label="Product Title"
                className="w-full"
                size="small"
              />
            </div>

            {/* Internal Name */}
            <div className="mb-5">
              <TextField
                label="Internal Name"
                className="w-full"
                size="small"
              />
            </div>

            {/* Fulfillment Provider */}
            <div className="mb-5">
              <FormControl fullWidth size="small">
                <InputLabel id="fulfillmentProvider-label">
                  Fulfillment Provider
                </InputLabel>
                <Select
                  labelId="fulfillmentProvider-label"
                  value={provider}
                  label="Fulfillment Provider"
                  onChange={fulfillmentHandler}
                >
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
              <div
                onClick={() => setOpen(true)}
                className="text-sm text-ocean underline text-end cursor-pointer mt-1"
              >
                Add Provider
              </div>
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
