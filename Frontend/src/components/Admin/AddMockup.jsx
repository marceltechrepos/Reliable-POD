import React, { useRef, useState } from 'react';
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

export default function AddMockup({ open, onClose, Mockupdata }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedPreviews, setUploadedPreviews] = useState([]);

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
                <Box
                    sx={{
                        width: 240,
                        borderRight: '1px solid #eee',
                        p: 2,
                    }}
                >
                    <Typography fontWeight={600} mb={2}>
                        Categories
                    </Typography>

                    <Stack spacing={1}>
                        <Typography sx={categoryStyle(true)}>All</Typography>
                        <Typography sx={categoryStyle(false)}>TIB Mockups</Typography>
                        <Button size="small" sx={{ justifyContent: 'flex-start' }}>
                            + New category
                        </Button>
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
                    {uploadedPreviews.length > 0 && (
                        <Box mb={3}>
                            <Typography fontWeight={600} mb={1}>
                                Uploaded
                            </Typography>
                            <Grid container spacing={2}>
                                {uploadedPreviews.map((item) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                        <Box
                                            sx={{
                                                border: '1px solid #4caf50',
                                                borderRadius: 2,
                                                p: 1,
                                                position: 'relative',
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={item.url}
                                                alt={item.name}
                                                sx={{
                                                    width: '100%',
                                                    height: 160,        // ⬅ slightly bigger
                                                    objectFit: 'contain', // ⬅ better for uploads
                                                    borderRadius: 1,
                                                    bgcolor: '#fafafa',
                                                }}
                                            />

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
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>

                        </Box>
                    )}


                    {/* Search + reload */}
                    <Stack direction="row" spacing={2} mb={2}>
                        <TextField
                            size="small"
                            placeholder="Search..."
                            sx={{ width: 240 }}
                        />
                        <Button
                            startIcon={<RefreshIcon />}
                            variant="outlined"
                            size="small"
                        >
                            Reload
                        </Button>
                    </Stack>

                    {/* Mockup grid */}
                    <Grid container spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
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
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Footer */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" onClick={onClose}>
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
