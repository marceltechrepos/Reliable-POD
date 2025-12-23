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

export default function AddMockup(props) {
    const { open, onClose, Mockupdata } = props
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedPreviews, setUploadedPreviews] = useState([]);

    // New state for categories
    const [categories, setCategories] = useState([
        { id: 1, name: 'All', active: true },
        { id: 2, name: 'TIB Mockups', active: false }
    ]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMockups, setSelectedMockups] = useState([]);

    const handleFiles = (files) => {
        const uploadedFiles = Array.from(files);

        const previews = uploadedFiles.map((file) => ({
            id: crypto.randomUUID(),
            file,
            url: URL.createObjectURL(file),
            name: file.name,
            status: 'uploaded',
        }));
        console.log(previews);
        // ✅ FIX: spread previews, not array
        setUploadedPreviews((prev) => [...prev, ...previews]);
    };


    const handleFileSelect = (e) => {
        handleFiles(e.target.files);
    };

    const removeUploadedFile = (id) => {
        setUploadedPreviews((prev) => {
            const fileToRemove = prev.find(item => item.id === id);
            if (fileToRemove) {
                URL.revokeObjectURL(fileToRemove.url); // cleanup memory
            }
            return prev.filter(item => item.id !== id);
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };



    // Add new category handler
    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            const newCategory = {
                id: categories.length + 1,
                name: newCategoryName.trim(),
                active: false
            };
            setCategories(prev => [...prev, newCategory]);
            setNewCategoryName('');
            setIsAddingCategory(false);
        }
    };

    // Filter images based on category and search
    const filteredMockups = useMemo(() => {
        // Combine existing and uploaded images
        const allImages = [
            ...Mockupdata,
            ...uploadedPreviews.map(item => ({
                ...item,
                category: 'Uploaded', // Default category for uploaded
                title: item.name,
                dimensions: '1500 × 1500' // You can extract actual dimensions
            }))
        ];

        // Filter by category
        let result = allImages;
        if (selectedCategory !== 'All') {
            result = result.filter(item =>
                item.category === selectedCategory ||
                (selectedCategory === 'Uploaded' && item.id.includes('uploaded'))
            );
        }

        // Filter by search
        if (searchQuery.trim()) {
            result = result.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result;
    }, [Mockupdata, uploadedPreviews, selectedCategory, searchQuery]);

    const handleCategoryClick = (categoryId) => {
        const selectedCat = categories.find(c => c.id === categoryId);
        setCategories(prev => prev.map(cat => ({
            ...cat,
            active: cat.id === categoryId
        })));
        setSelectedCategory(selectedCat.name);
    };

    const handleCheckboxChange = (item) => {
        setSelectedMockups(prev => {
            const isSelected = prev.some(selected => selected.id === item.id);
            if (isSelected) {
                return prev.filter(selected => selected.id !== item.id);
            } else {
                return [...prev, item];
            }
        });
    };

    const handleSelect = () => {
        // Create a new component/object with selected images
        const selectedImagesData = selectedMockups.map(item => ({
            id: item.id,
            url: item.url,
            title: item.title || item.name,
            dimensions: item.dimensions || '1500 × 1500',
            category: item.category || 'Uploaded',
            isUploaded: item.status === 'uploaded',
            file: item.file // For uploaded files
        }));

        // Call parent callback
        if (props.onSelect) {
            props.onSelect(selectedImagesData);
        }

        // You can pass this to parent component or create a new component
        console.log('Selected Images:', selectedImagesData);

        // Close modal
        onClose();
    };

    // ✅ MODAL OPEN HONE PAR AUTOMATICALLY RESET
    useEffect(() => {
        if (open) {
            resetModalState();
        }
    }, [open]); // Jab bhi modal open/close ho

    const resetModalState = () => {
        setUploadedPreviews([]); // Uploaded images clear
        setSelectedMockups([]); // Selection reset
        setSearchQuery(''); // Search clear
        setSelectedCategory('All'); // Category reset to All

        // Categories ko bhi default state mein lao
        setCategories([
            { id: 1, name: 'All', active: true },
            { id: 2, name: 'TIB Mockups', active: false }
        ]);

        // Memory cleanup for uploaded images
        uploadedPreviews.forEach(item => {
            if (item.url && item.status === 'uploaded') {
                URL.revokeObjectURL(item.url);
            }
        });
    };

    const handleReload = () => {
        resetModalState();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    inset: 40,
                    bgcolor: '#fff',
                    borderRadius: 2,
                    display: 'flex',
                    overflow: 'hidden',
                }}
            >
                {/* ========== LEFT SIDEBAR ========== */}
                <Box sx={{ width: 300, borderRight: '1px solid #eee', p: 2 }}>
                    <Typography fontWeight={600} mb={2}>
                        Categories
                    </Typography>

                    <Stack spacing={1}>
                        {categories.map((category) => (
                            <Typography
                                key={category.id}
                                sx={categoryStyle(category.active)}
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                {category.name}
                            </Typography>
                        ))}

                    </Stack>
                </Box>

                {/* ========== RIGHT CONTENT ========== */}
                <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    {/* Upload area */}
                    <Box
                        onClick={() => fileInputRef.current.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        sx={{
                            border: '2px dashed',
                            borderColor: isDragging ? '#3b6d92' : '#ddd',
                            borderRadius: 2,
                            py: 4,
                            textAlign: 'center',
                            mb: 3,
                            cursor: 'pointer',
                            bgcolor: isDragging ? '#f0f7ff' : 'transparent',
                            transition: '0.2s',
                        }}
                    >
                        <CloudUploadOutlinedIcon fontSize="large" />
                        <Typography fontWeight={500}>
                            Drag and drop, or click to upload!
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Do not close this page while uploading.
                        </Typography>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            hidden
                            onChange={handleFileSelect}
                        />
                    </Box>


                    {/* Search + reload */}
                    <Stack direction="row" spacing={2} mb={2}>
                        <TextField
                            size="small"
                            placeholder="Search..."
                            sx={{ width: 240 }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            startIcon={<RefreshIcon />}
                            variant="outlined"
                            size="small"
                            onClick={handleReload}
                        >
                            Reload
                        </Button>
                    </Stack>

                    {/* Mockup grid */}
                    {/* <Grid container spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
                        {Mockupdata.map((item) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>

                                <Box
                                    sx={{
                                        border: '1px solid #ddd',
                                        borderRadius: 2,
                                        p: 1,
                                        cursor: 'pointer',
                                        '&:hover': { borderColor: '#3b6d92' },
                                    }}
                                >
                                    <Checkbox size="small" />
                                    <Box
                                        component="img"
                                        src={item.url}
                                        alt={item.title}
                                        sx={{
                                            width: '100%',
                                            height: 140,
                                            objectFit: 'cover',
                                            borderRadius: 1,
                                            mb: 1,
                                        }}
                                    />
                                    <Typography variant="body2" fontWeight={500} noWrap>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        1500 × 1500
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid> */}
                    <Grid container spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
                        {filteredMockups.map((item) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                <Box
                                    sx={{
                                        border: '1px solid #ddd',
                                        borderRadius: 2,
                                        p: 1,
                                        cursor: 'pointer',
                                        '&:hover': { borderColor: '#3b6d92' },
                                        position: 'relative',
                                    }}
                                >
                                    {/* Checkbox */}
                                    <Checkbox
                                        size="small"
                                        checked={selectedMockups.some(selected => selected.id === item.id)}
                                        onChange={() => handleCheckboxChange(item)}
                                    />

                                    {/* Uploaded badge for uploaded images */}
                                    {item.status === 'uploaded' && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                position: 'absolute',
                                                top: 6,
                                                right: 6,
                                                bgcolor: '#4caf50',
                                                color: '#fff',
                                                px: 1,
                                                borderRadius: 1,
                                                fontSize: 10,
                                            }}
                                        >
                                            Uploaded
                                        </Typography>
                                    )}

                                    {/* Image */}
                                    <Box
                                        component="img"
                                        src={item.url}
                                        alt={item.title || item.name}
                                        sx={{
                                            width: 180,
                                            height: 180,
                                            objectFit: item.status === 'uploaded' ? 'contain' : 'cover',
                                            borderRadius: 1,
                                            mb: 1,
                                            bgcolor: item.status === 'uploaded' ? '#fafafa' : 'transparent',
                                        }}
                                    />

                                    {/* Title */}
                                    <Typography variant="body2" fontWeight={500} noWrap>
                                        {item.title || item.name}
                                    </Typography>

                                    {/* Dimensions */}
                                    <Typography variant="caption" color="text.secondary">
                                        {item.dimensions || '1500 × 1500'}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Footer */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" onClick={handleSelect}>
                            Select
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

/* ========== Styles ========== */
const categoryStyle = (active) => ({
    fontSize: 14,
    cursor: 'pointer',
    px: 1,
    py: 0.5,
    borderRadius: 1,
    bgcolor: active ? '#e3f2fd' : 'transparent',
    fontWeight: active ? 600 : 400,
});