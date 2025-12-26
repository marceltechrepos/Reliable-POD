// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//     Modal,
//     Box,
//     Grid,
//     Typography,
//     Button,
//     TextField,
//     Checkbox,
//     Stack,
//     Divider,
// } from '@mui/material';
// import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
// import RefreshIcon from '@mui/icons-material/Refresh';

// export default function AddMockup(props) {
//     const { open, onClose, Mockupdata } = props
//     const fileInputRef = useRef(null);
//     const [isDragging, setIsDragging] = useState(false);
//     const [uploadedPreviews, setUploadedPreviews] = useState([]);

//     // New state for categories
//     const [categories, setCategories] = useState([
//         { id: 1, name: 'All', active: true },
//         { id: 2, name: 'TIB Mockups', active: false }
//     ]);
//     const [newCategoryName, setNewCategoryName] = useState('');
//     const [isAddingCategory, setIsAddingCategory] = useState(false);

//     const [selectedCategory, setSelectedCategory] = useState('All');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedMockups, setSelectedMockups] = useState([]);

//     const handleFiles = (files) => {
//         const uploadedFiles = Array.from(files);

//         const previews = uploadedFiles.map((file) => ({
//             id: crypto.randomUUID(),
//             file,
//             url: URL.createObjectURL(file),
//             name: file.name,
//             status: 'uploaded',
//         }));
//         console.log(previews);
//         // ✅ FIX: spread previews, not array
//         setUploadedPreviews((prev) => [...prev, ...previews]);
//     };


//     const handleFileSelect = (e) => {
//         handleFiles(e.target.files);
//     };

//     const removeUploadedFile = (id) => {
//         setUploadedPreviews((prev) => {
//             const fileToRemove = prev.find(item => item.id === id);
//             if (fileToRemove) {
//                 URL.revokeObjectURL(fileToRemove.url); // cleanup memory
//             }
//             return prev.filter(item => item.id !== id);
//         });
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setIsDragging(false);
//         handleFiles(e.dataTransfer.files);
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setIsDragging(true);
//     };

//     const handleDragLeave = () => {
//         setIsDragging(false);
//     };



//     // Add new category handler
//     const handleAddCategory = () => {
//         if (newCategoryName.trim()) {
//             const newCategory = {
//                 id: categories.length + 1,
//                 name: newCategoryName.trim(),
//                 active: false
//             };
//             setCategories(prev => [...prev, newCategory]);
//             setNewCategoryName('');
//             setIsAddingCategory(false);
//         }
//     };

//     // Filter images based on category and search
//     const filteredMockups = useMemo(() => {
//         // Combine existing and uploaded images
//         const allImages = [
//             ...Mockupdata,
//             ...uploadedPreviews.map(item => ({
//                 ...item,
//                 category: 'Uploaded', // Default category for uploaded
//                 title: item.name,
//                 dimensions: '1500 × 1500' // You can extract actual dimensions
//             }))
//         ];

//         // Filter by category
//         let result = allImages;
//         if (selectedCategory !== 'All') {
//             result = result.filter(item =>
//                 item.category === selectedCategory ||
//                 (selectedCategory === 'Uploaded' && item.id.includes('uploaded'))
//             );
//         }

//         // Filter by search
//         if (searchQuery.trim()) {
//             result = result.filter(item =>
//                 item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 item.name?.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }

//         return result;
//     }, [Mockupdata, uploadedPreviews, selectedCategory, searchQuery]);

//     const handleCategoryClick = (categoryId) => {
//         const selectedCat = categories.find(c => c.id === categoryId);
//         setCategories(prev => prev.map(cat => ({
//             ...cat,
//             active: cat.id === categoryId
//         })));
//         setSelectedCategory(selectedCat.name);
//     };

//     const handleCheckboxChange = (item) => {
//         setSelectedMockups(prev => {
//             const isSelected = prev.some(selected => selected.id === item.id);
//             if (isSelected) {
//                 return prev.filter(selected => selected.id !== item.id);
//             } else {
//                 return [...prev, item];
//             }
//         });
//     };

//     const handleSelect = () => {
//         // Create a new component/object with selected images
//         const selectedImagesData = selectedMockups.map(item => ({
//             id: item.id,
//             url: item.url,
//             title: item.title || item.name,
//             dimensions: item.dimensions || '1500 × 1500',
//             category: item.category || 'Uploaded',
//             isUploaded: item.status === 'uploaded',
//             file: item.file // For uploaded files
//         }));

//         // Call parent callback
//         if (props.onSelect) {
//             props.onSelect(selectedImagesData);
//         }

//         // You can pass this to parent component or create a new component
//         console.log('Selected Images:', selectedImagesData);

//         // Close modal
//         onClose();
//     };

//     // ✅ MODAL OPEN HONE PAR AUTOMATICALLY RESET
//     useEffect(() => {
//         if (open) {
//             resetModalState();
//         }
//     }, [open]); // Jab bhi modal open/close ho

//     const resetModalState = () => {
//         setUploadedPreviews([]); // Uploaded images clear
//         setSelectedMockups([]); // Selection reset
//         setSearchQuery(''); // Search clear
//         setSelectedCategory('All'); // Category reset to All

//         // Categories ko bhi default state mein lao
//         setCategories([
//             { id: 1, name: 'All', active: true },
//             { id: 2, name: 'TIB Mockups', active: false }
//         ]);

//         // Memory cleanup for uploaded images
//         uploadedPreviews.forEach(item => {
//             if (item.url && item.status === 'uploaded') {
//                 URL.revokeObjectURL(item.url);
//             }
//         });
//     };

//     const handleReload = () => {
//         resetModalState();
//     };

//     return (
//         <Modal open={open} onClose={onClose}>
//             <Box
//                 sx={{
//                     position: 'absolute',
//                     inset: 40,
//                     bgcolor: '#fff',
//                     borderRadius: 2,
//                     display: 'flex',
//                     overflow: 'hidden',
//                 }}
//             >
//                 {/* ========== LEFT SIDEBAR ========== */}
//                 <Box sx={{ width: 300, borderRight: '1px solid #eee', p: 2 }}>
//                     <Typography fontWeight={600} mb={2}>
//                         Categories
//                     </Typography>

//                     <Stack spacing={1}>
//                         {categories.map((category) => (
//                             <Typography
//                                 key={category.id}
//                                 sx={categoryStyle(category.active)}
//                                 onClick={() => handleCategoryClick(category.id)}
//                             >
//                                 {category.name}
//                             </Typography>
//                         ))}

//                     </Stack>
//                 </Box>

//                 {/* ========== RIGHT CONTENT ========== */}
//                 <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
//                     {/* Upload area */}
//                     <Box
//                         onClick={() => fileInputRef.current.click()}
//                         onDrop={handleDrop}
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         sx={{
//                             border: '2px dashed',
//                             borderColor: isDragging ? '#3b6d92' : '#ddd',
//                             borderRadius: 2,
//                             py: 4,
//                             textAlign: 'center',
//                             mb: 3,
//                             cursor: 'pointer',
//                             bgcolor: isDragging ? '#f0f7ff' : 'transparent',
//                             transition: '0.2s',
//                         }}
//                     >
//                         <CloudUploadOutlinedIcon fontSize="large" />
//                         <Typography fontWeight={500}>
//                             Drag and drop, or click to upload!
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                             Do not close this page while uploading.
//                         </Typography>

//                         {/* Hidden file input */}
//                         <input
//                             ref={fileInputRef}
//                             type="file"
//                             multiple
//                             accept="image/*"
//                             hidden
//                             onChange={handleFileSelect}
//                         />
//                     </Box>


//                     {/* Search + reload */}
//                     <Stack direction="row" spacing={2} mb={2}>
//                         <TextField
//                             size="small"
//                             placeholder="Search..."
//                             sx={{ width: 240 }}
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                         <Button
//                             startIcon={<RefreshIcon />}
//                             variant="outlined"
//                             size="small"
//                             onClick={handleReload}
//                         >
//                             Reload
//                         </Button>
//                     </Stack>

//                     {/* Mockup grid */}
//                     {/* <Grid container spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
//                         {Mockupdata.map((item) => (
//                             <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>

//                                 <Box
//                                     sx={{
//                                         border: '1px solid #ddd',
//                                         borderRadius: 2,
//                                         p: 1,
//                                         cursor: 'pointer',
//                                         '&:hover': { borderColor: '#3b6d92' },
//                                     }}
//                                 >
//                                     <Checkbox size="small" />
//                                     <Box
//                                         component="img"
//                                         src={item.url}
//                                         alt={item.title}
//                                         sx={{
//                                             width: '100%',
//                                             height: 140,
//                                             objectFit: 'cover',
//                                             borderRadius: 1,
//                                             mb: 1,
//                                         }}
//                                     />
//                                     <Typography variant="body2" fontWeight={500} noWrap>
//                                         {item.title}
//                                     </Typography>
//                                     <Typography variant="caption" color="text.secondary">
//                                         1500 × 1500
//                                     </Typography>
//                                 </Box>
//                             </Grid>
//                         ))}
//                     </Grid> */}
//                     <Grid container spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
//                         {filteredMockups.map((item) => (
//                             <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
//                                 <Box
//                                     sx={{
//                                         border: '1px solid #ddd',
//                                         borderRadius: 2,
//                                         p: 1,
//                                         cursor: 'pointer',
//                                         '&:hover': { borderColor: '#3b6d92' },
//                                         position: 'relative',
//                                     }}
//                                 >
//                                     {/* Checkbox */}
//                                     <Checkbox
//                                         size="small"
//                                         checked={selectedMockups.some(selected => selected.id === item.id)}
//                                         onChange={() => handleCheckboxChange(item)}
//                                     />

//                                     {/* Uploaded badge for uploaded images */}
//                                     {item.status === 'uploaded' && (
//                                         <Typography
//                                             variant="caption"
//                                             sx={{
//                                                 position: 'absolute',
//                                                 top: 6,
//                                                 right: 6,
//                                                 bgcolor: '#4caf50',
//                                                 color: '#fff',
//                                                 px: 1,
//                                                 borderRadius: 1,
//                                                 fontSize: 10,
//                                             }}
//                                         >
//                                             Uploaded
//                                         </Typography>
//                                     )}

//                                     {/* Image */}
//                                     <Box
//                                         component="img"
//                                         src={item.url}
//                                         alt={item.title || item.name}
//                                         sx={{
//                                             width: 180,
//                                             height: 180,
//                                             objectFit: item.status === 'uploaded' ? 'contain' : 'cover',
//                                             borderRadius: 1,
//                                             mb: 1,
//                                             bgcolor: item.status === 'uploaded' ? '#fafafa' : 'transparent',
//                                         }}
//                                     />

//                                     {/* Title */}
//                                     <Typography variant="body2" fontWeight={500} noWrap>
//                                         {item.title || item.name}
//                                     </Typography>

//                                     {/* Dimensions */}
//                                     <Typography variant="caption" color="text.secondary">
//                                         {item.dimensions || '1500 × 1500'}
//                                     </Typography>
//                                 </Box>
//                             </Grid>
//                         ))}
//                     </Grid>

//                     <Divider sx={{ my: 2 }} />

//                     {/* Footer */}
//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                         <Button variant="contained" onClick={handleSelect}>
//                             Select
//                         </Button>
//                     </Box>
//                 </Box>
//             </Box>
//         </Modal>
//     );
// }

// /* ========== Styles ========== */
// const categoryStyle = (active) => ({
//     fontSize: 14,
//     cursor: 'pointer',
//     px: 1,
//     py: 0.5,
//     borderRadius: 1,
//     bgcolor: active ? '#e3f2fd' : 'transparent',
//     fontWeight: active ? 600 : 400,
// });


// =================================================================================

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//     Modal,
//     Box,
//     Grid,
//     Typography,
//     Button,
//     TextField,
//     Checkbox,
//     Stack,
//     Divider,
// } from '@mui/material';
// import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
// import RefreshIcon from '@mui/icons-material/Refresh';

// export default function AddMockup(props) {
//     const { open, onClose, onSelect } = props;

//     const fileInputRef = useRef(null);
//     const [isDragging, setIsDragging] = useState(false);

//     const [mockups, setMockups] = useState([]);          // 🔥 GET se aane wala data
//     const [uploadedPreviews, setUploadedPreviews] = useState([]);

//     const [categories, setCategories] = useState([
//         { id: 1, name: 'All', active: true },
//         { id: 2, name: 'Uploaded', active: false },
//     ]);

//     const [selectedCategory, setSelectedCategory] = useState('All');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedMockups, setSelectedMockups] = useState([]);

//     /* ================= GET MOCKUPS ================= */
//     const getMockups = async () => {
//         try {
//             const res = await fetch('/api/get-mockup-image');
//             const json = await res.json();

//             if (json.success) {
//                 const formatted = json.data.map(item => ({
//                     id: item._id,
//                     url: item.mockupImage.url,
//                     title: item.name,
//                     category: 'Uploaded',
//                     dimensions: '1500 × 1500',
//                     status: 'uploaded',
//                 }));
//                 setMockups(formatted);
//             }
//         } catch (err) {
//             console.error('failed to load mockups', err);
//         }
//     };




//     const uploadMockupImage = async (file) => {
//         const formData = new FormData();
//         formData.append("mockupImage", file);
//         formData.append("name", file.name);

//         // ✅ Send a valid ObjectId for category
//         formData.append("category", "TIB");

//         formData.append("size", Math.round(file.size / 1024));

//         try {
//             const res = await fetch("/api/create-mockup-image", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!res.ok) {
//                 const text = await res.text();
//                 console.error("server error:", text);
//                 return null;
//             }

//             return await res.json();
//         } catch (error) {
//             console.error("upload failed", error);
//             return null;
//         }
//     };


//     /* ================= MODAL OPEN ================= */
//     useEffect(() => {
//         if (open) {
//             resetModalState();
//             getMockups(); // 🔥 GET on open
//         }
//     }, [open]);

//     const resetModalState = () => {
//         setUploadedPreviews([]);
//         setSelectedMockups([]);
//         setSearchQuery('');
//         setSelectedCategory('All');
//         setCategories([
//             { id: 1, name: 'All', active: true },
//             { id: 2, name: 'Uploaded', active: false },
//         ]);
//     };

//     /* ================= FILE HANDLING ================= */
//     // const handleFiles = (files) => {
//     //     const previews = Array.from(files).map(file => ({
//     //         id: crypto.randomUUID(),
//     //         file,
//     //         url: URL.createObjectURL(file),
//     //         name: file.name,
//     //         status: 'uploaded',
//     //     }));
//     //     setUploadedPreviews(prev => [...prev, ...previews]);
//     // };


//     const handleFiles = async (files) => {
//         const fileArray = Array.from(files);

//         for (const file of fileArray) {
//             const tempId = crypto.randomUUID();

//             // 1️⃣ temp preview
//             const tempPreview = {
//                 id: tempId,
//                 url: URL.createObjectURL(file),
//                 title: file.name,
//                 category: 'Uploaded',
//                 dimensions: '1500 × 1500',
//                 status: 'uploading',
//             };

//             setUploadedPreviews(prev => [...prev, tempPreview]);

//             // 2️⃣ upload API
//             const response = await uploadMockupImage(file);

//             if (response?.success) {
//                 const uploadedItem = {
//                     id: response.data._id,
//                     url: response.data.mockupImage.url,
//                     title: response.data.name,
//                     category: 'Uploaded',
//                     dimensions: '1500 × 1500',
//                     status: 'uploaded',
//                 };

//                 // 3️⃣ temp preview replace + main list me add
//                 setUploadedPreviews(prev =>
//                     prev.filter(item => item.id !== tempId)
//                 );

//                 setMockups(prev => [uploadedItem, ...prev]);
//             } else {
//                 // ❌ fail → remove temp preview
//                 setUploadedPreviews(prev =>
//                     prev.filter(item => item.id !== tempId)
//                 );
//             }
//         }
//     };



//     const handleFileSelect = (e) => handleFiles(e.target.files);

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//         handleFiles(e.dataTransfer.files);
//     };

//     /* ================= FILTER ================= */
//     const filteredMockups = useMemo(() => {
//         const allImages = [
//             ...mockups,
//             ...uploadedPreviews.map(item => ({
//                 ...item,
//                 title: item.name,
//                 category: 'Uploaded',
//                 dimensions: '1500 × 1500',
//             })),
//         ];

//         let result = allImages;

//         if (selectedCategory !== 'All') {
//             result = result.filter(i => i.category === selectedCategory);
//         }

//         if (searchQuery.trim()) {
//             result = result.filter(i =>
//                 i.title?.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }

//         return result;
//     }, [mockups, uploadedPreviews, selectedCategory, searchQuery]);

//     /* ================= UI ACTIONS ================= */
//     const handleCategoryClick = (id) => {
//         const cat = categories.find(c => c.id === id);
//         setCategories(prev =>
//             prev.map(c => ({ ...c, active: c.id === id }))
//         );
//         setSelectedCategory(cat.name);
//     };

//     const handleCheckboxChange = (item) => {
//         setSelectedMockups(prev =>
//             prev.some(i => i.id === item.id)
//                 ? prev.filter(i => i.id !== item.id)
//                 : [...prev, item]
//         );
//     };

//     const handleSelect = () => {
//         const data = selectedMockups.map(item => ({
//             id: item.id,
//             url: item.url,
//             title: item.title,
//             dimensions: item.dimensions,
//             category: item.category,
//         }));

//         onSelect?.(data);
//         onClose();
//     };

//     const handleReload = () => {
//         resetModalState();
//         getMockups(); // 🔥 API reload
//     };

//     return (
//         <Modal open={open} onClose={onClose}>
//             <Box sx={{ position: 'absolute', inset: 40, bgcolor: '#fff', borderRadius: 2, display: 'flex' }}>
//                 {/* LEFT */}
//                 <Box sx={{ width: 300, borderRight: '1px solid #eee', p: 2 }}>
//                     <Typography fontWeight={600} mb={2}>Categories</Typography>
//                     <Stack spacing={1}>
//                         {categories.map(cat => (
//                             <Typography
//                                 key={cat.id}
//                                 sx={categoryStyle(cat.active)}
//                                 onClick={() => handleCategoryClick(cat.id)}
//                             >
//                                 {cat.name}
//                             </Typography>
//                         ))}
//                     </Stack>
//                 </Box>

//                 {/* RIGHT */}
//                 <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
//                     {/* Upload */}
//                     <Box
//                         onClick={() => fileInputRef.current.click()}
//                         onDrop={handleDrop}
//                         onDragOver={(e) => e.preventDefault()}
//                         sx={{
//                             border: '2px dashed #ddd',
//                             borderRadius: 2,
//                             py: 4,
//                             textAlign: 'center',
//                             mb: 3,
//                             cursor: 'pointer',
//                         }}
//                     >
//                         <CloudUploadOutlinedIcon />
//                         <Typography>Drag & drop or click</Typography>
//                         <input hidden multiple type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} />
//                     </Box>

//                     {/* Search */}
//                     <Stack direction="row" spacing={2} mb={2}>
//                         <TextField
//                             size="small"
//                             placeholder="Search..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                         <Button startIcon={<RefreshIcon />} onClick={handleReload}>
//                             Reload
//                         </Button>
//                     </Stack>

//                     {/* Grid */}

//                     <Grid container spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
//                         {filteredMockups.map(item => (
//                             <Grid item xs={6} md={3} key={item.id}>
//                                 <Box
//                                     sx={{
//                                         border: '1px solid #ddd',
//                                         p: 1,
//                                         borderRadius: 2,
//                                         position: 'relative',
//                                     }}
//                                 >
//                                     {/* 🔥 uploading badge */}
//                                     {item.status === 'uploading' && (
//                                         <Typography
//                                             variant="caption"
//                                             sx={{
//                                                 position: 'absolute',
//                                                 top: 6,
//                                                 right: 6,
//                                                 bgcolor: '#ff9800',
//                                                 color: '#fff',
//                                                 px: 1,
//                                                 borderRadius: 1,
//                                                 fontSize: 10,
//                                                 zIndex: 2,
//                                             }}
//                                         >
//                                             Uploading…
//                                         </Typography>
//                                     )}

//                                     <Checkbox
//                                         checked={selectedMockups.some(i => i.id === item.id)}
//                                         onChange={() => handleCheckboxChange(item)}
//                                     />

//                                     <Box
//                                         component="img"
//                                         src={item.url}
//                                         sx={{
//                                             width: '100%',
//                                             height: 160,
//                                             objectFit: 'cover',
//                                             opacity: item.status === 'uploading' ? 0.6 : 1,
//                                         }}
//                                     />

//                                     <Typography noWrap>{item.title}</Typography>
//                                 </Box>
//                             </Grid>
//                         ))}
//                     </Grid>


//                     {/* <Grid container spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
//                         {filteredMockups.map(item => (
//                             <Grid item xs={6} md={3} key={item.id}>
//                                 <Box sx={{ border: '1px solid #ddd', p: 1, borderRadius: 2 }}>
//                                     <Checkbox
//                                         checked={selectedMockups.some(i => i.id === item.id)}
//                                         onChange={() => handleCheckboxChange(item)}
//                                     />
//                                     <Box component="img" src={item.url} sx={{ width: '100%', height: 160, objectFit: 'cover' }} />
//                                     <Typography noWrap>{item.title}</Typography>
//                                 </Box>
//                             </Grid>
//                         ))}
//                     </Grid> */}

//                     <Divider sx={{ my: 2 }} />

//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                         <Button variant="contained" onClick={handleSelect}>
//                             Select
//                         </Button>
//                     </Box>
//                 </Box>
//             </Box>
//         </Modal>
//     );
// }

// const categoryStyle = (active) => ({
//     fontSize: 14,
//     cursor: 'pointer',
//     px: 1,
//     py: 0.5,
//     borderRadius: 1,
//     bgcolor: active ? '#e3f2fd' : 'transparent',
//     fontWeight: active ? 600 : 400,
// });


// ====================================================

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Modal,
    Box,
    Grid,
    Typography,
    Button,
    TextField,
    Checkbox,
    Stack,
    Divider,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';

import { getMockups, uploadMockupImage } from '../../api/mockupApi';

export default function AddMockup({ open, onClose, onSelect }) {
    const fileInputRef = useRef(null);
    const [mockups, setMockups] = useState([]);
    const [uploadedPreviews, setUploadedPreviews] = useState([]);
    const [categories, setCategories] = useState([
        { id: 1, name: 'All', active: true },
        { id: 2, name: 'Uploaded', active: false },
    ]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMockups, setSelectedMockups] = useState([]);

    const categoryObjectId = "694917d1d0a3a403cf06aaac"; // 🔥 valid ObjectId

    useEffect(() => {
        if (open) {
            resetModalState();
            loadMockups();
        }
    }, [open]);

    const resetModalState = () => {
        setUploadedPreviews([]);
        setSelectedMockups([]);
        setSearchQuery('');
        setSelectedCategory('All');
        setCategories([
            { id: 1, name: 'All', active: true },
            { id: 2, name: 'Uploaded', active: false },
        ]);
    };

    const loadMockups = async () => {
        const data = await getMockups();
        setMockups(data);
    };

    const handleFiles = async (files) => {
        for (const file of Array.from(files)) {
            const tempId = crypto.randomUUID();
            const tempPreview = {
                id: tempId,
                url: URL.createObjectURL(file),
                title: file.name,
                category: 'Uploaded',
                dimensions: '1500 × 1500',
                status: 'uploading',
            };
            setUploadedPreviews(prev => [...prev, tempPreview]);

            const response = await uploadMockupImage(file, categoryObjectId);
            if (response?.success) {
                const uploadedItem = {
                    id: response.data._id,
                    url: response.data.mockupImage.url,
                    title: response.data.name,
                    category: 'Uploaded',
                    dimensions: '1500 × 1500',
                    status: 'uploaded',
                };
                setUploadedPreviews(prev => prev.filter(item => item.id !== tempId));
                setMockups(prev => [uploadedItem, ...prev]);
            } else {
                setUploadedPreviews(prev => prev.filter(item => item.id !== tempId));
            }
        }
    };

    const handleFileSelect = (e) => handleFiles(e.target.files);
    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const filteredMockups = useMemo(() => {
        let allImages = [...mockups, ...uploadedPreviews.map(item => ({ ...item, title: item.name }))];
        if (selectedCategory !== 'All') allImages = allImages.filter(i => i.category === selectedCategory);
        if (searchQuery.trim()) allImages = allImages.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()));
        return allImages;
    }, [mockups, uploadedPreviews, selectedCategory, searchQuery]);

    const handleCategoryClick = (id) => {
        const cat = categories.find(c => c.id === id);
        setCategories(prev => prev.map(c => ({ ...c, active: c.id === id })));
        setSelectedCategory(cat.name);
    };

    const handleCheckboxChange = (item) => {
        setSelectedMockups(prev => prev.some(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]);
    };

    const handleSelect = () => {
        onSelect?.(selectedMockups.map(item => ({
            id: item.id,
            url: item.url,
            title: item.title,
            dimensions: item.dimensions,
            category: item.category,
        })));
        onClose();
    };

    const handleReload = () => {
        resetModalState();
        loadMockups();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: 'absolute', inset: 40, bgcolor: '#fff', borderRadius: 2, display: 'flex' }}>
                <Box sx={{ width: 300, borderRight: '1px solid #eee', p: 2 }}>
                    <Typography fontWeight={600} mb={2}>Categories</Typography>
                    <Stack spacing={1}>
                        {categories.map(cat => (
                            <Typography key={cat.id} sx={categoryStyle(cat.active)} onClick={() => handleCategoryClick(cat.id)}>
                                {cat.name}
                            </Typography>
                        ))}
                    </Stack>
                </Box>
                <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box onClick={() => fileInputRef.current.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
                        sx={{ border: '2px dashed #ddd', borderRadius: 2, py: 4, textAlign: 'center', mb: 3, cursor: 'pointer' }}>
                        <CloudUploadOutlinedIcon />
                        <Typography>Drag & drop or click</Typography>
                        <input hidden multiple type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} />
                    </Box>
                    <Stack direction="row" spacing={2} mb={2}>
                        <TextField size="small" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        <Button startIcon={<RefreshIcon />} onClick={handleReload}>Reload</Button>
                    </Stack>
                    <Grid container spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
                        {filteredMockups.map(item => (
                            <Grid item xs={6} md={3} key={item.id}>
                                <Box sx={{ border: '1px solid #ddd', p: 1, borderRadius: 2, position: 'relative' }}>
                                    {item.status === 'uploading' && (
                                        <Typography variant="caption" sx={{ position: 'absolute', top: 6, right: 6, bgcolor: '#ff9800', color: '#fff', px: 1, borderRadius: 1, fontSize: 10, zIndex: 2 }}>
                                            Uploading…
                                        </Typography>
                                    )}
                                    <Checkbox checked={selectedMockups.some(i => i.id === item.id)} onChange={() => handleCheckboxChange(item)} />
                                    <Box component="img" src={item.url} sx={{ width: '100%', height: 160, objectFit: 'cover', opacity: item.status === 'uploading' ? 0.6 : 1 }} />
                                    <Typography noWrap>{item.title}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" onClick={handleSelect}>Select</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

const categoryStyle = (active) => ({
    fontSize: 14,
    cursor: 'pointer',
    px: 1,
    py: 0.5,
    borderRadius: 1,
    bgcolor: active ? '#e3f2fd' : 'transparent',
    fontWeight: active ? 600 : 400,
});
