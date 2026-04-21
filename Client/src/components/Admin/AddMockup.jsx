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
import { toast } from "react-toastify"

import { getMockups, uploadMockupImage } from '../../api/mockupApi';
import { addMockupsToProduct } from '../../api/product.api';

export default function AddMockup({ open, onClose, onSelect, productId }) {
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


    console.log(mockups, " <<<<<<<< mockups");

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
            const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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

    const handleSelect = async () => {

        // ✅ Filter out any temp IDs or invalid IDs
        const selected = selectedMockups
            .filter(item => item.id && !String(item.id).startsWith('temp-'))
            .map(item => String(item.id));

              console.log("Selected IDs:", selected); // Debug

        // if productId provided, save to product
        if (productId) {
            const res = await addMockupsToProduct(productId, selected);
            if (res?.success) {
                onSelect?.(selected); // or onSelect?.(res.data)
                onClose();
                return;
            } else {
                // handle error (toast / alert)
                toast.error("Failed to add mockups to product")
                console.error("Failed to add mockups", res);
                // still close or keep modal open based on UX
                return;
            }
        }

        // fallback: just return selection to parent
        onSelect?.(selectedMockups);
        onClose();


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

// --------------------------------------------------------------

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
// import { toast } from "react-toastify"

// import { getMockups, uploadMockupImage } from '../../api/mockupApi';

// export default function AddMockup({ open, onClose, onSelect }) {
//     const fileInputRef = useRef(null);
//     const [mockups, setMockups] = useState([]);
//     const [uploadedPreviews, setUploadedPreviews] = useState([]);
//     const [selectedMockups, setSelectedMockups] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');

//     const categoryObjectId = "694917d1d0a3a403cf06aaac";

//     useEffect(() => {
//         if (open) {
//             resetModalState();
//             loadMockups();
//         }
//     }, [open]);

//     const resetModalState = () => {
//         setUploadedPreviews([]);
//         setSelectedMockups([]);
//         setSearchQuery('');
//     };

//     const loadMockups = async () => {
//         const data = await getMockups();
//         setMockups(data || []);
//     };

//     const handleFiles = async (files) => {
//         for (const file of Array.from(files)) {
//             const tempId = `temp-${Date.now()}`;

//             const preview = {
//                 _id: tempId,
//                 url: URL.createObjectURL(file),
//                 name: file.name,
//                 status: 'uploading'
//             };

//             setUploadedPreviews(prev => [...prev, preview]);

//             const res = await uploadMockupImage(file, categoryObjectId);

//             if (res?.success) {
//                 const uploaded = {
//                     _id: res.data._id,
//                     url: res.data.mockupImage.url,
//                     name: res.data.name,
//                 };

//                 setUploadedPreviews(prev => prev.filter(p => p._id !== tempId));
//                 setMockups(prev => [uploaded, ...prev]);
//             }
//         }
//     };

//     const handleCheckboxChange = (item) => {
//         setSelectedMockups(prev =>
//             prev.some(i => i._id === item._id)
//                 ? prev.filter(i => i._id !== item._id)
//                 : [...prev, item]
//         );
//     };

//     const filteredMockups = useMemo(() => {
//         let all = [...mockups, ...uploadedPreviews];

//         if (searchQuery.trim()) {
//             all = all.filter(i =>
//                 (i.name || '').toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }

//         return all;
//     }, [mockups, uploadedPreviews, searchQuery]);

//     const handleSelect = () => {
//         if (selectedMockups.length === 0) {
//             toast.error("Select at least one mockup");
//             return;
//         }

//         // ✅ IMPORTANT: full objects send karo
//         onSelect(selectedMockups);

//         onClose();
//     };

//     return (
//         <Modal open={open} onClose={onClose}>
//             <Box sx={{ position: 'absolute', inset: 40, bgcolor: '#fff', borderRadius: 2, display: 'flex' }}>
//                 <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>

//                     {/* Upload */}
//                     <Box
//                         onClick={() => fileInputRef.current.click()}
//                         onDrop={(e) => {
//                             e.preventDefault();
//                             handleFiles(e.dataTransfer.files);
//                         }}
//                         onDragOver={(e) => e.preventDefault()}
//                         sx={{ border: '2px dashed #ddd', borderRadius: 2, py: 4, textAlign: 'center', mb: 3, cursor: 'pointer' }}
//                     >
//                         <CloudUploadOutlinedIcon />
//                         <Typography>Drag & drop or click</Typography>
//                         <input hidden multiple type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleFiles(e.target.files)} />
//                     </Box>

//                     {/* Search */}
//                     <Stack direction="row" spacing={2} mb={2}>
//                         <TextField
//                             size="small"
//                             placeholder="Search..."
//                             value={searchQuery}
//                             onChange={e => setSearchQuery(e.target.value)}
//                         />
//                         <Button startIcon={<RefreshIcon />} onClick={loadMockups}>
//                             Reload
//                         </Button>
//                     </Stack>

//                     {/* Grid */}
//                     <Grid container spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
//                         {filteredMockups.map(item => (
//                             <Grid item xs={6} md={3} key={item._id}>
//                                 <Box sx={{ border: '1px solid #ddd', p: 1, borderRadius: 2 }}>

//                                     <Checkbox
//                                         checked={selectedMockups.some(i => i._id === item._id)}
//                                         onChange={() => handleCheckboxChange(item)}
//                                     />

//                                     <Box
//                                         component="img"
//                                         src={item.url}
//                                         sx={{ width: '100%', height: 160, objectFit: 'cover' }}
//                                     />

//                                     <Typography noWrap>{item.name}</Typography>
//                                 </Box>
//                             </Grid>
//                         ))}
//                     </Grid>

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