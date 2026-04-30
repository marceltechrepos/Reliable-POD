import {
  DndContext,
  closestCenter,
  DragOverlay
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

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
import ThumbnailModal from '../components/Admin/ThumbnailModal';

import { useParams, useNavigate } from "react-router-dom";

import { getAllProvider, createProvider } from '../api/provider.api';
import { createProduct, getProductById, removeMockupFromProduct, updateProduct } from '../api/product.api';
import { getAllCategory, createCategory, getCategoryDropdown } from '../api/category.api';
import { addMockupsToProduct } from '../api/product.api';

import AddProviderModal from '../components/Admin/AddProviderModal';
import AddCategoryModal from '../components/Admin/AddCategoryModal';
import AddMockup from '../components/Admin/AddMockup';
import { Typography } from '@mui/material';
import { deleteMockupImage, duplicateMockupApi, updateMockup } from '../api/mockupApi';
import RichTextEditor from '../components/RichTextEditor';
import { toast } from 'react-toastify';
import { showConfirmationToast } from './AdminEditor/helper/confirmation';



const loadMockupsFromStorage = () => {
  const savedMockups = localStorage.getItem('selectedMockups');
  return savedMockups ? JSON.parse(savedMockups) : [];
};

const saveMockupsToStorage = (mockups) => {
  localStorage.setItem('selectedMockups', JSON.stringify(mockups));
};

function ProductBase() {
  /* ================== BASIC STATES ================== */
  const [provider, setProvider] = useState('');

  const [parentCategory, setParentCategory] = useState(''); // parent _id
  const [subCategory, setSubCategory] = useState('');       // selected child _id

  // hold fetched dropdown structure
  const [categoryTree, setCategoryTree] = useState([]); // array of { _id, name, children: [...] }
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const [productTitle, setProductTitle] = useState('');
  const [internalName, setInternalName] = useState('');
  const [fulfilmentCatalogID, setFulfilmentCatalogID] = useState('');
  const [description, setDescription] = useState('');
  const [editProductById, setEditProductById] = useState();

  const [isThumbnailModalOpen, setIsThumbnailModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [visible, setVisible] = useState(true)
  const [updatingVisibility, setUpdatingVisibility] = useState(false);
  const [activeMockup, setActiveMockup] = useState(null);

  const [editingMockupId, setEditingMockupId] = useState(null);
  const [editingMockupName, setEditingMockupName] = useState('');


  const startEditMockupName = (mockup) => {
    setEditingMockupId(mockup._id);
    setEditingMockupName(mockup.name || '');
  };

  const cancelEditMockupName = () => {
    setEditingMockupId(null);
    setEditingMockupName('');
  };

  const saveMockupName = async (mockupId) => {
    if (!editingMockupName.trim()) {
      toast.error("Mockup name cannot be empty");
      return;
    }

    try {
      // ✅ Pass the string, not an object
      const response = await updateMockup(mockupId, editingMockupName.trim());

      if (response?.success) {
        toast.success("Mockup name updated successfully!");
        await fetchProductByProductId(productId);
        cancelEditMockupName();
      } else {
        toast.error(response?.message || "Failed to update mockup name");
      }
    } catch (error) {
      console.error("Error updating mockup name:", error);
      toast.error("Failed to update mockup name");
    }
  };


  const DragIndicatorIcon = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ cursor: "grab", ...props.style }}
      {...props}
    >
      <circle cx="9" cy="5" r="1.5" />
      <circle cx="15" cy="5" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="15" cy="19" r="1.5" />
    </svg>
  );

  const { id: productId } = useParams();
  const navigate = useNavigate();


  const isEditMode = Boolean(productId);

  const [providers, setProviders] = useState([
    { label: 'Print-On-Demand.App', value: 'print-on-demand-app' }
  ]);

  const [categories, setCategories] = useState([
    { label: 'T-Shirt', value: 't-shirt', thumbnail: '/images/categories/tshirt.png' }
  ]);
  // ===================================== drag mockup

  const handleDragStart = (event) => {
    const activeId = String(event.active.id);
    const found = editProductById?.mockupIds?.find(
      (m) => String(m._id) === activeId
    );
    setActiveMockup(found || null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || String(active.id) === String(over.id)) {
      setActiveMockup(null);
      return;
    }

    const oldIndex = editProductById?.mockupIds?.findIndex(
      (m) => String(m._id) === String(active.id)
    );
    const newIndex = editProductById?.mockupIds?.findIndex(
      (m) => String(m._id) === String(over.id)
    );

    console.log("oldIndex/newIndex:", oldIndex, newIndex);

    if (oldIndex < 0 || newIndex < 0) {
      setActiveMockup(null);
      return;
    }

    const newOrder = arrayMove(editProductById.mockupIds, oldIndex, newIndex);

    setEditProductById((prev) => ({
      ...prev,
      mockupIds: newOrder,
    }));

    try {
      const res = await updateProduct(productId, {
        mockupIds: newOrder.map((m) => String(m._id)),
      });

      console.log("reorder response:", res);
    } finally {
      setActiveMockup(null);
    }
  };

  const handleDragCancel = () => {
    setActiveMockup(null);
  };

  const SortableItem = ({ mockup, children }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: String(mockup._id) });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.4 : 1,
      zIndex: isDragging ? 999 : "auto"
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        {children(listeners, isDragging)}
      </div>
    );
  };


  // ===================================== drag mockup

  const fetchProductByProductId = async (id) => {
    try {
      if (!id) return;
      const data = await getProductById(id);

      console.log(data, "<<<<< main data")
      setEditProductById(data);

      // POPULATE FORM FIELDS
      setProductTitle(data?.productTitle || '');
      setInternalName(data?.internalName || '');
      setProvider(data?.fulfilmentProvider || '');
      setFulfilmentCatalogID(data?.fulfilmentCatalogID || '');
      setDescription(data?.description || '');
      setPreview(data?.thumbnail?.url || "")
      setVisible(data?.visibility ?? true);

      setEditProductById(data);

      // Category - handle parent and child
      const category = data?.category;
      if (category) {
        if (category.parent) {
          setParentCategory(category.parent._id); // parent dropdown
          setSubCategory(category._id);           // child dropdown
        } else {
          setParentCategory(category._id);
          setSubCategory('');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateThumbnailHandler = async () => {
    if (!thumbnail) {
      toast.error("Please select an image first");
      return;
    }


    try {
      const formData = new FormData();
      formData.append("thumbnail", thumbnail);

      const data = await updateProduct(productId, formData);

      if (data?.success) {
        toast.success("Thumbnail updated successfully!");
        setIsThumbnailModalOpen(false);
        fetchProductByProductId(productId); // Refresh data
        setThumbnail(null); // Reset thumbnail state
      } else {
        toast.error(data?.message || "Failed to update thumbnail");
      }
    } catch (error) {
      console.error("Error updating thumbnail:", error);
      toast.error("Failed to update thumbnail");
    }
  };

  const toggleVisibility = async () => {
    setUpdatingVisibility(true);
    try {
      const newValue = !visible;
      console.log("Sending payload:", { visibility: newValue }, "Product ID:", productId);
      const res = await updateProduct(productId, { visibility: newValue });
      console.log("Response:", res);
      if (res?.success) {
        setVisible(newValue);
        toast.success(`Product ${newValue ? "shown" : "hidden"} successfully`);
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Failed to update visibility");
    } finally {
      setUpdatingVisibility(false);
    }
  };

  // const toggleVisibility = async () => {
  //   setUpdatingVisibility(true);
  //   try {
  //     const newValue = !visible;

  //     const res = await updateProduct(productId, { visibility: newValue });

  //     if (res?.success) {
  //       setVisible(newValue);
  //       toast.success(`Product ${newValue ? "shown" : "hidden"} successfully`);
  //     } else {
  //       toast.error("Update failed");
  //     }

  //   } catch (error) {
  //     toast.error("Failed to update visibility");
  //   } finally {
  //     setUpdatingVisibility(false)
  //   }
  // };

  // Remove Thumbnail Handler - Fixed
  const removeThumbnailHandler = async () => {
    if (!productId) return;

    if (window.confirm("Are you sure you want to remove this thumbnail?")) {
      try {
        // Send empty FormData to indicate thumbnail removal
        const formData = new FormData();
        formData.append("thumbnail", ""); // Empty string for removal

        const data = await updateProduct(productId, formData);

        if (data?.success) {
          setThumbnail(null);
          setPreview(null);
          toast.success("Thumbnail removed successfully!");
          fetchProductByProductId(productId);
        } else {
          toast.error(data?.message || "Failed to remove thumbnail");
        }
      } catch (error) {
        console.error("Remove thumbnail error:", error);
        toast.error("Failed to remove thumbnail");
      }
    }
  };

  // Update Product Handler - Fixed
  const updateProductHandler = async () => {
    if (!subCategory) {
      toast.error("Please select a sub category");
      return;
    }

    const payload = {
      productTitle,
      internalName,
      fulfilmentProvider: provider,
      category: subCategory,
      fulfilmentCatalogID,
      description,
    };

    try {
      const data = await updateProduct(productId, payload);
      if (data?.success) {
        toast.success("Product updated successfully!");
        fetchProductByProductId(productId);
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update product");
    }
  };


  useEffect(() => {
    fetchProductByProductId(productId)
  }, [productId]);

  // Add this function to refresh all data
  const refreshAllData = async () => {
    console.log("Refreshing all data...");

    // Refresh mockups from localStorage
    const savedMockups = loadMockupsFromStorage();
    setSelectedMockups(savedMockups);

    // Refresh product data
    if (productId) {
      await fetchProductByProductId(productId);
    }
  };

  // Update the editMockup function to use navigate
  const editMockup = (mockup) => {
    localStorage.setItem('mockupToEdit', JSON.stringify(mockup));
    // Use navigate instead of window.location.href
    navigate(`/admin/editor${editId ? `/${editId}/${mockup._id}` : ''}`);
  };

  useEffect(() => {
    // This will run when component mounts
    refreshAllData();

    // Listen for custom event from editor
    const handleMockupSaved = (event) => {
      console.log("Mockup saved event received", event.detail);
      if (event.detail && event.detail.productId === productId) {
        refreshAllData();
      }
    };

    window.addEventListener('mockupSaved', handleMockupSaved);

    return () => {
      window.removeEventListener('mockupSaved', handleMockupSaved);
    };
  }, [productId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && productId) {
        console.log("Page became visible, refreshing data...");
        refreshAllData();
      }
    };

    // document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [productId]);

  useEffect(() => {
    // This will run whenever the component renders
    const handleFocus = () => {
      console.log("Page focused, refreshing data...");
      refreshAllData();
    };

    // Listen for focus event
    // window.addEventListener('focus', handleFocus);

    // Also run once immediately
    handleFocus();

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []); // Empty dependency array means it runs on every render


  useEffect(() => {
    if (editProductById && categoriesLoaded) {
      const cat = editProductById.category;
      if (cat) {
        if (cat.parent) {
          setParentCategory(cat.parent._id); // Home Decor
          setSubCategory(cat._id);           // Tile & Easel
        } else {
          setParentCategory(cat._id);
          setSubCategory('');
        }
      }
    }
  }, [editProductById, categoriesLoaded]);

  const duplicateMockup = async (mockup) => {
    try {
      const toastId = toast.loading("Duplicating mockup...");

      const data = await duplicateMockupApi(mockup._id, productId);

      if (data.success) {
        // New mockup created, now add its ID to current product
        const newMockupId = data.data.mockup._id;

        // Add to product's mockupIds
        await addMockupsToProduct(productId, [newMockupId]);

        toast.update(toastId, {
          render: "Mockup duplicated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000
        });

        // Refresh product data
        fetchProductByProductId(productId);
      } else {
        throw new Error(data.message || "Duplication failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [open, setOpen] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [selectedMockups, setSelectedMockups] = useState(() => loadMockupsFromStorage());

  const [newProvider, setNewProvider] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categoryThumbnail, setCategoryThumbnail] = useState(null);
  const [categoryThumbnailPreview, setCategoryThumbnailPreview] = useState('');
  const [editId, setEditId] = useState(productId);

  /* ================== MOCKUP STATES ================== */
  const [openMockupModal, setOpenMockupModal] = useState(false);

  const [mockupImages, setMockupImages] = useState([]);

  useEffect(() => {
    const fetchDropdown = async () => {
      const data = await getCategoryDropdown();
      // data shape: [{ _id, name, children: [{ _id, name, children: [...] }, ...] }, ...]
      setCategoryTree(data || []);
      setCategoriesLoaded(true);
    };
    fetchDropdown();
  }, []);

  /* ================== HANDLERS ================== */
  const fulfillmentHandler = (e) => setProvider(e.target.value);
  const fulfillmentCategoryHandler = (e) => setCategory(e.target.value);

  const addProviderHandler = async () => {
    if (!newProvider.trim()) return;

    const payload = { provider: newProvider };
    const res = await createProvider(payload);

    if (res?.success) {
      const newItem = { label: res.data.provider, value: res.data._id };
      setProviders(prev => [...prev, newItem]);
      setProvider(res.data._id);
      setNewProvider('');
      setOpen(false);
      toast.success("Provider Added");
    }
  };

  const addCategoryHandler = async () => {
    if (!newCategory.trim()) return;

    const formData = new FormData();
    formData.append("category", newCategory);
    formData.append("thumbnail", categoryThumbnail);

    const res = await createCategory(formData);
    console.log(res, "REsponse ");

    if (res?.success) {
      const newItem = { label: res.data[0].name, value: res.data._id };

      setCategories(prev => [...prev, newItem]);
      setCategory(res.data._id);
      setNewCategory('');
      setCategoryThumbnail(null);
      setCategoryThumbnailPreview('');
      setOpenCategoryModal(false);
      toast.success("Category Added");
    }
  };

  const saveProductHandler = async () => {

    if (!subCategory) {
      toast.error("Please select a sub category");
      return;
    }

    const payload = {
      productTitle,
      internalName,
      fulfilmentProvider: provider,
      category: subCategory,
      fulfilmentCatalogID,
      description
    };

    const data = await createProduct(payload);

    if (data?.success) {
      setEditId(data.data._id);
      navigate(`/admin/product/${data.data._id}`, { replace: true });
    }
  };

  useEffect(() => {
    const idFromUrl = window.location.pathname.split('/').pop();
    if (idFromUrl) {
      // preserved intentionally - no change to behaviour
    }
  }, []);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
  });


  const handleMockupSelect = async (selectedData) => {
    try {
      const ids = selectedData
        .map(item => item.id || item._id)
        .filter(Boolean);

      if (!productId || ids.length === 0) return;

      // ❌ Yaha pe pehle tum duplicate API call kar rahe the
      // ❌ Aur optimistic update bhi kar rahe the jisse UI bigad raha tha

      // ✅ Ab sirf modal band karo aur backend se fresh data lao
      setOpenMockupModal(false);
      await fetchProductByProductId(productId);
      toast.success("Mockup added successfully!");
    } catch (error) {
      console.error("Mockup save error:", error);
      toast.error("Failed to save mockups");
    }
  };


  // const handleMockupSelect = async (selectedData) => {
  //   try {
  //     const ids = selectedData
  //       .map(item => item.id || item._id)
  //       .filter(Boolean);

  //     if (!productId || ids.length === 0) return;

  //     // ✅ 1. UI ko turant update karo
  //     setEditProductById(prev => ({
  //       ...prev,
  //       mockupIds: [
  //         ...(prev?.mockupIds || []),
  //         ...selectedData.map(item => ({
  //           _id: item._id || item.id,
  //           name: item.name || "Mockup",
  //           mockupImage: {
  //             url: item.url || item.mockupImage?.url
  //           },
  //           size: item.size,
  //           category: item.category
  //         }))
  //       ]
  //     }));

  //     // ✅ 2. Backend call (background me)
  //     const res = await addMockupsToProduct(productId, ids);

  //     if (res?.success) {
  //       toast.success("Selected Mockup Added...");
  //       setOpenMockupModal(false);
  //     }



  //     if (!res?.success) {
  //       toast.error("Failed to sync with server");
  //     }

  //   } catch (error) {
  //     console.error("Mockup save error:", error);
  //     toast.error("Failed to save mockups");
  //   }
  // };

  const removeMockup = async (mockupId) => {
    try {
      showConfirmationToast(
        "Are you sure you want to delete this mockup?",
        async () => {
          // Confirmation ke baad wala code
          const res = await removeMockupFromProduct(productId, mockupId);

          if (!res.success) {
            toast.error(res.message);
            return;
          }

          await deleteMockupImage(mockupId);
          fetchProductByProductId(productId);
          toast.success("Mockup removed successfully!");
        }
      );
    } catch (error) {
      console.error("Error removing mockup:", error);
      toast.error("Failed to remove mockup");
    }
  };


  const clearAllMockups = () => {
    setSelectedMockups([]);
    localStorage.removeItem('selectedMockups');
  };

  useEffect(() => {
    const reloaded = sessionStorage.getItem("reloaded")

    if (!reloaded) {
      sessionStorage.setItem("reloaded", "true")
      window.location.reload()
    }
  }, [])

  useEffect(() => {
    const fetchProviders = async () => {
      const data = await getAllProvider();
      if (data && data.length > 0) {
        const formattedProviders = data.map(p => ({ label: p.provider, value: p._id }));
        setProviders(formattedProviders);
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategory();
      if (data && data.length > 0) {
        const formattedCategories = data.map(c => ({ label: c.slug, value: c.id, thumbnail: c.thumbnail, name: c.name, id: c._id }));
        setCategories(formattedCategories);
        console.log(formattedCategories, " <<<< formattedCategories");
      }
    };
    fetchCategories();
  }, []);

  /* ================== JSX ================== */
  return (
    <>
      <div className="w-full bg-slate-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs />

          {/* Responsive layout: stack on small, 2 columns on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-4">
            {/* LEFT FORM */}

            <div className="bg-white p-4 sm:p-6 rounded-xl border-l-4 border-ocean">
              <div className='flex space-x-2 items-center justify-between mb-4'>
                <h2 className="text-2xl font-bold mb-6 ">Basic information</h2>
                {isEditMode && (
                  <button
                    onClick={toggleVisibility}
                    disabled={updatingVisibility}
                    className="bg-orange-500  text-white px-4 py-2 rounded-md cursor-pointer w-full sm:w-auto"
                  >
                    {updatingVisibility ? "Updating..." : visible ? "Hide" : "Show"}
                  </button>
                )}

              </div>

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
              <div
                onClick={() => setOpen(true)}
                className="text-sm text-ocean underline text-right cursor-pointer mb-5"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(true); }}
              >
                Add Provider
              </div>

              <FormControl fullWidth size="small" className="mb-2">
                <InputLabel>Fulfillment Category</InputLabel>
                <Select
                  value={parentCategory}
                  onChange={(e) => {
                    const parentId = e.target.value;
                    setParentCategory(parentId);
                    setSubCategory(''); // reset child when parent changes
                  }}
                  label="Fulfillment Category"
                >
                  <MenuItem value=""><em>Choose an option</em></MenuItem>
                  {categoryTree.map((c) => (
                    <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div
                onClick={() => navigate("/admin/category")}
                className="text-sm text-ocean underline text-right mb-5 cursor-pointer"
                role="button"
                tabIndex={0}
              // onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenCategoryModal(true); }}
              >
                Add Category
              </div>


              {parentCategory && categoryTree.find(p => p._id === parentCategory)?.children?.length > 0 && (
                <FormControl fullWidth size="small" className="mb-4">
                  <InputLabel>Fulfillment Sub Category</InputLabel>
                  <Select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    label="Fulfillment Sub Category"
                  >
                    <MenuItem value=""><em>Choose an option</em></MenuItem>
                    {(categoryTree.find(p => p._id === parentCategory)?.children || []).map((child) => (
                      <MenuItem key={child._id} value={child._id}>{child.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <TextField
                style={{ marginTop: '12px' }}
                className='mt-3'
                type="text"
                label="Product SKU"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={fulfilmentCatalogID}
                onChange={(e) => setFulfilmentCatalogID(e.target.value)}
              />
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Your Message
                </label>

                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between mt-3">
                <button
                  onClick={isEditMode ? updateProductHandler : saveProductHandler}
                  className="bg-ocean text-white px-4 py-2 rounded-md cursor-pointer w-full sm:w-auto"
                >
                  {isEditMode ? 'Update Product' : 'Save Product'}
                </button>

                {isEditMode && (
                  <button
                    onClick={() => setIsThumbnailModalOpen(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md cursor-pointer w-full sm:w-auto"
                  >
                    {preview ? 'Edit Thumbnail' : 'Add Thumbnail'}
                  </button>
                )}
              </div>
              {preview && (
                <div className="mt-4 sm:mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">

                  {/* Action Buttons - Fix Remove button */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setIsThumbnailModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-sm font-medium shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Thumbnail
                    </button>

                    {/* Change this button to call removeThumbnailHandler */}
                    <button
                      onClick={removeThumbnailHandler}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 text-sm font-medium shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Thumbnail
                    </button>

                    <button
                      onClick={() => window.open(preview, '_blank')}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 text-sm font-medium shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Full
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT MOCKUP */}
            {isEditMode && (
              <div>
                <div className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-xl border-l-4 border-ocean">
                  <h2 className="text-2xl font-bold">Mockup</h2>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: '#3b6d92', '&:hover': { bgcolor: '#355a78' } }}
                    onClick={() => setOpenMockupModal(true)}
                  >
                    Upload Mockup
                  </Button>
                </div>

                {/* selected mockups list - responsive cards */}
                <div className="mt-4 grid grid-cols-1 gap-4">
                  {/* 1. Main mockupImage from editProductById */}
                  {editProductById?.mockupImage && (
                    <Box>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                        <img
                          src={editProductById.mockupImage}
                          alt="Main Mockup"
                          className="w-full sm:w-24 h-44 sm:h-24 object-cover rounded-xl"
                          style={{ borderRadius: 10 }}
                        />
                        <div className='flex-1 w-full'>
                          <Typography sx={{ marginBottom: 0, lineHeight: "1.1", fontWeight: 500 }}>
                            {editProductById.productTitle} (Main)
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                            Main Mockup Image
                          </Typography>
                          {/* Action buttons */}
                          <div className='flex items-center gap-2 mt-3'>
                            {/* Edit Button */}
                            <Button
                              variant="contained"
                              sx={{
                                display: "inline-flex",
                                minWidth: "auto",
                                bgcolor: '#3b6d92',
                                padding: "8px",
                                fontSize: "12px",
                                textTransform: "none",
                              }}
                              onClick={() => {
                                const mockupData = {
                                  id: editProductById._id,
                                  url: editProductById.mockupImage,
                                  title: editProductById.productTitle
                                };
                                localStorage.setItem('mockupToEdit', JSON.stringify(mockupData));
                                window.location.href = `/admin/editor${editId ? `/${editId}` : ''}`;
                              }}
                            >

                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                              </svg>
                            </Button>

                            {/* Delete Button */}
                            <Button
                              variant="contained"
                              sx={{
                                display: "inline-flex",
                                minWidth: "auto",
                                bgcolor: 'error.main',
                                padding: "8px",
                                fontSize: "12px",
                                textTransform: "none",
                                '&:hover': { bgcolor: 'error.dark' }
                              }}
                              onClick={async () => {
                                if (window.confirm("Delete main mockup image?")) {
                                  try {
                                    const formData = new FormData();
                                    formData.append("mockupImage", "");
                                    const data = await updateProduct(productId, formData);

                                    if (data?.success) {
                                      toast.success("Mockup removed!");
                                      fetchProductByProductId(productId);
                                    }
                                  } catch (error) {
                                    toast.error("Failed to remove mockup");
                                  }
                                }
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Box>
                  )}

                  {/* 2. Mockups from Database */}
                  {editProductById?.mockupIds?.length > 0 ? (
                    <DndContext
                      collisionDetection={closestCenter}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDragCancel={handleDragCancel}
                    >
                      <SortableContext
                        items={editProductById?.mockupIds?.map(m => String(m._id)) || []}
                        strategy={verticalListSortingStrategy}
                      >
                        {editProductById?.mockupIds?.map((mockup) => (
                          <SortableItem key={mockup._id} mockup={mockup}>
                            {(listeners, isDragging) => (
                              <Box>
                                <div
                                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm transition-all"
                                  style={{
                                    background: isDragging ? "#e3f2fd" : "#fff",
                                    boxShadow: isDragging
                                      ? "0 10px 25px rgba(0,0,0,0.2)"
                                      : "0 2px 6px rgba(0,0,0,0.05)"
                                  }}
                                >
                                  <img
                                    src={mockup?.mockupImage?.url}
                                    className="w-full sm:w-24 h-24 object-cover rounded-xl"
                                  />
                                  <div className="flex-1">
                                    {editingMockupId === mockup._id ? (
                                      // Edit mode
                                      <div className="flex items-center gap-2 mb-2">
                                        <input
                                          type="text"
                                          value={editingMockupName}
                                          onChange={(e) => setEditingMockupName(e.target.value)}
                                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ocean"
                                          autoFocus
                                          onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                              saveMockupName(mockup._id);
                                            }
                                          }}
                                        />
                                        <button
                                          onClick={() => saveMockupName(mockup._id)}
                                          className="text-green-600 hover:text-green-700"
                                          title="Save"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M12.5 3a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5z" />
                                            <path d="M10.854 5.646a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.293l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5a.5.5 0 0 0-.5-.5H12v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h3.5a.5.5 0 0 0 0-1H4z" />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={cancelEditMockupName}
                                          className="text-red-600 hover:text-red-700"
                                          title="Cancel"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                          </svg>
                                        </button>
                                      </div>
                                    ) : (
                                      // Display mode
                                      <div className="flex items-center gap-2">
                                        <Typography>{mockup?.name || 'Untitled Mockup'}</Typography>
                                        <button
                                          onClick={() => startEditMockupName(mockup)}
                                          className="text-gray-500 hover:text-ocean transition-colors"
                                          title="Edit name"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.5 7.5 1.243-1.243A.5.5 0 0 0 4.5 12h-.5v-.5a.5.5 0 0 0-.146-.354L2.5 10.793 1.793 11.5l2.5 2.5z" />
                                          </svg>
                                        </button>
                                      </div>
                                    )}
                                    {mockup?.size && (
                                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                        Size: {mockup.size}
                                      </Typography>
                                    )}

                                    <div className='flex items-center gap-2 mt-3'>
                                      {/* DUPLICATE BUTTON */}
                                      <Button
                                        variant="contained"
                                        sx={{
                                          display: "inline-flex",
                                          minWidth: "auto",
                                          bgcolor: '#4caf50',        // Green color
                                          padding: "8px",
                                          fontSize: "12px",
                                          textTransform: "none",
                                          '&:hover': { bgcolor: '#388e3c' }
                                        }}
                                        onClick={() => duplicateMockup(mockup)}
                                        title="Duplicate Mockup"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                          <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                                        </svg>
                                      </Button>

                                      {/* EDIT */}
                                      <Button
                                        variant="contained"
                                        sx={{
                                          display: "inline-flex",
                                          minWidth: "auto",
                                          bgcolor: '#3b6d92',
                                          padding: "8px",
                                          fontSize: "12px",
                                          textTransform: "none",
                                        }}
                                        onClick={() => editMockup(mockup)}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                        </svg>
                                      </Button>

                                      {/* DELETE */}
                                      <Button
                                        variant="contained"
                                        sx={{
                                          display: "inline-flex",
                                          minWidth: "auto",
                                          bgcolor: 'error.main',
                                          padding: "8px",
                                          fontSize: "12px",
                                          textTransform: "none",
                                        }}
                                        onClick={() => removeMockup(mockup._id)}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                        </svg>
                                      </Button>


                                    </div>
                                  </div>

                                  {/* 🔥 DRAG HANDLE */}
                                  <div
                                    {...listeners}
                                    style={{
                                      cursor: "grab",
                                      touchAction: "none",
                                      padding: "8px",
                                      background: "#f5f5f5",
                                      borderRadius: "6px"
                                    }}
                                  >
                                    <DragIndicatorIcon />
                                  </div>
                                </div>
                              </Box>
                            )}
                          </SortableItem>
                        ))}
                      </SortableContext>

                      {/* 🔥 DRAG PREVIEW */}
                      <DragOverlay>
                        {activeMockup ? (
                          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-2xl">
                            <img
                              src={activeMockup?.mockupImage?.url}
                              className="w-20 h-20 rounded-lg"
                            />
                            <span>{activeMockup.name}</span>
                          </div>
                        ) : null}
                      </DragOverlay>
                    </DndContext>
                  ) : (
                    !editProductById?.mockupImage && (
                      <Box sx={{
                        mt: 3,
                        textAlign: 'center',
                        py: 4,
                        border: '1px dashed #ddd',
                        borderRadius: 2,
                        bgcolor: '#fafafa'
                      }}>
                        <Typography color="text.secondary">
                          No mockups available. Click "Upload Mockup" to add.
                        </Typography>
                      </Box>
                    )
                  )}
                </div>

                {/* Clear All Button - only show if there are multiple mockups */}
                {(selectedMockups.length > 0 || editProductById?.mockupImage) && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={async () => {
                        if (window.confirm("Clear all mockups?")) {
                          try {
                            // Clear main mockup
                            if (editProductById?.mockupImage) {
                              const formData = new FormData();
                              formData.append("mockupImage", "");
                              await updateProduct(productId, formData);
                            }

                            // Clear selected mockups
                            setSelectedMockups([]);
                            localStorage.removeItem('selectedMockups');

                            toast.success("All mockups cleared!");
                            fetchProductByProductId(productId);
                          } catch (error) {
                            toast.error("Failed to clear mockups");
                          }
                        }
                      }}
                    >
                      Clear All Mockups
                    </Button>
                  </Box>
                )}
              </div>
            )}

          </div>

          {/* TABS - stay full width below */}
          {isEditMode && (
            <div className="mt-6">
              <BasicTabs productId={productId} />
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <ThumbnailModal
        open={isThumbnailModalOpen}
        isEditMode={isEditMode}
        onClose={() => setIsThumbnailModalOpen(false)}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        preview={preview}
        setPreview={setPreview}
        productId={productId}
        existingThumbnailUrl={editProductById?.thumbnail?.url}
        onUpdateThumbnail={updateThumbnailHandler} // Pass the handler
        onRemoveThumbnail={removeThumbnailHandler} // Pass the handler
      />

      <AddMockup
        open={openMockupModal}
        onClose={() => setOpenMockupModal(false)}
        Mockupdata={mockupImages}
        onSelect={handleMockupSelect}
        productId={productId}
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
