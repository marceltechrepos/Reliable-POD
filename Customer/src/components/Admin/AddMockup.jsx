import React, { useEffect, useMemo, useRef, useState } from "react";
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
    IconButton,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    getAllPrintAreaImages,
    uploadPrintAreaImage,
    deletePrintAreaImage
} from "../../api/printareaImage.api";

export default function AddMockup({ open, onClose, onImageSelect, productId }) {
    const fileInputRef = useRef(null);

    const [images, setImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const categories = [
        { id: 1, name: "My Images" },
        { id: 2, name: "Sample Images" }
    ];

    const [selectedCategory, setSelectedCategory] = useState("My Images");

    // Fetch images from API when modal opens
    useEffect(() => {
        if (open) {
            fetchImages();
        }
    }, [open]);

    const fetchImages = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllPrintAreaImages();
            // Transform API data to match component format
            const formattedImages = data.map(item => ({
                id: item._id,
                url: item.printAreaImage?.url,
                title: item.name || "Print Area Image",
                category: "Uploaded", // All API images are user uploaded
                size: item.size,
                createdAt: item.createdAt
            }));
            setImages(formattedImages);
        } catch (err) {
            setError("Failed to load images");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetModal = () => {
        setSelectedImages([]);
        setSearchQuery("");
        setSelectedCategory("My Images");
        setError(null);
        setSuccess(null);
    };

    const handleFiles = async (files) => {
        setUploading(true);
        setError(null);

        try {
            // Upload each file to API
            for (const file of files) {
                const formData = new FormData();
                formData.append("printAreaImage", file);
                formData.append("name", file.name);
                formData.append("size", file.size.toString());
                formData.append("productId", productId);
                formData.append("UserId", user._id)
                const uploadedImage = await uploadPrintAreaImage(formData);

                // Add to local state
                const newImage = {
                    id: uploadedImage._id,
                    url: uploadedImage.printAreaImage?.url,
                    title: uploadedImage.name || file.name,
                    category: "Uploaded",
                    size: uploadedImage.size
                };

                setImages(prev => [newImage, ...prev]);
            }

            setSuccess(`${files.length} image(s) uploaded successfully`);
        } catch (err) {
            setError("Failed to upload images");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e) => {
        handleFiles(e.target.files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            await deletePrintAreaImage(id);
            setImages(prev => prev.filter(img => img.id !== id));
            setSelectedImages(prev => prev.filter(img => img.id !== id));
            setSuccess("Image deleted successfully");
        } catch (err) {
            setError("Failed to delete image");
            console.error(err);
        }
    };

    const filteredImages = useMemo(() => {
        let list = [...images];

        if (selectedCategory === "My Images") {
            list = list.filter((img) => img.category === "Uploaded");
        } else if (selectedCategory === "Sample Images") {
            // Sample images would come from a different source
            list = list.filter((img) => img.category === "Sample");
        }

        if (searchQuery.trim()) {
            list = list.filter((img) =>
                img.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return list;
    }, [images, selectedCategory, searchQuery]);

    const toggleSelect = (item) => {
        setSelectedImages([item]);
    };

    const handleSelect = () => {
        if (selectedImages.length > 0) {
            const selectedImage = selectedImages[0];
            onImageSelect?.({
                id: selectedImage.id,
                url: selectedImage.url,
                title: selectedImage.title
            });
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 1200,
                    maxHeight: '90vh',
                    bgcolor: '#fff',
                    borderRadius: 3,
                    boxShadow: 24,
                    display: 'flex',
                    overflow: 'hidden'
                }}
            >
                {/* Sidebar (unchanged, but you can add icons) */}

                {/* Main Content */}
                <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', height: '90vh' }}>
                    {/* Upload Area */}
                    <Box
                        onClick={() => !uploading && fileInputRef.current.click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        sx={{
                            border: '2px dashed #d1d5db',
                            borderRadius: 3,
                            py: 4,
                            textAlign: 'center',
                            mb: 3,
                            cursor: uploading ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            bgcolor: uploading ? '#f9fafb' : 'transparent',
                            '&:hover': { borderColor: '#f05a28', bgcolor: '#fff5f0' }
                        }}
                    >
                        {uploading ? (
                            <CircularProgress size={40} sx={{ color: '#f05a28' }} />
                        ) : (
                            <>
                                <CloudUploadOutlinedIcon sx={{ fontSize: 48, color: '#9ca3af' }} />
                                <Typography mt={1} color="textSecondary" fontWeight={500}>
                                    Drag & drop or click to upload
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    Supports JPG, PNG, GIF (max 5MB)
                                </Typography>
                            </>
                        )}
                        <input hidden multiple type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} disabled={uploading} />
                    </Box>

                    {/* Search & Reload */}
                    <Stack direction="row" spacing={2} mb={2}>
                        <TextField
                            size="small"
                            placeholder="Search images..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': { borderColor: '#f05a28' }
                                }
                            }}
                        />
                        <Button
                            startIcon={<RefreshIcon />}
                            onClick={() => { resetModal(); fetchImages(); }}
                            variant="outlined"
                            disabled={loading}
                            sx={{ borderColor: '#d1d5db', color: '#374151', '&:hover': { borderColor: '#f05a28', bgcolor: '#fff5f0' } }}
                        >
                            {loading ? <CircularProgress size={20} /> : 'Reload'}
                        </Button>
                    </Stack>

                    {/* Image Grid */}
                    <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                        ) : (
                            <Grid container spacing={2}>
                                {filteredImages.length > 0 ? (
                                    filteredImages.map((item) => (
                                        <Grid item xs={6} md={4} lg={3} key={item.id}>
                                            <Box
                                                sx={{
                                                    border: selectedImages.some((i) => i.id === item.id) ? '2px solid #f05a28' : '1px solid #e5e7eb',
                                                    borderRadius: 2,
                                                    p: 1,
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { boxShadow: 4, borderColor: '#f05a28' }
                                                }}
                                                onClick={() => toggleSelect(item)}
                                            >
                                                <Checkbox
                                                    checked={selectedImages.some((i) => i.id === item.id)}
                                                    onChange={() => toggleSelect(item)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        left: 4,
                                                        zIndex: 1,
                                                        color: '#f05a28',
                                                        '&.Mui-checked': { color: '#f05a28' }
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        bgcolor: 'rgba(255,255,255,0.8)',
                                                        '&:hover': { bgcolor: '#ffffff' },
                                                        zIndex: 1
                                                    }}
                                                    onClick={(e) => handleDelete(item.id, e)}
                                                >
                                                    <DeleteIcon fontSize="small" color="error" />
                                                </IconButton>
                                                <Box
                                                    component="img"
                                                    src={item.url}
                                                    alt={item.title}
                                                    sx={{
                                                        width: '100%',
                                                        height: 160,
                                                        objectFit: 'cover',
                                                        borderRadius: 1,
                                                        bgcolor: '#f3f4f6'
                                                    }}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=Error'; }}
                                                />
                                                <Typography variant="caption" noWrap sx={{ mt: 1, display: 'block', textAlign: 'center', fontWeight: 500 }}>
                                                    {item.title}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid item xs={12}><Typography textAlign="center" color="textSecondary" py={4}>No images found</Typography></Grid>
                                )}
                            </Grid>
                        )}
                    </Box>

                    {/* Actions */}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={onClose} sx={{ color: '#6b7280' }}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleSelect}
                            disabled={selectedImages.length === 0}
                            sx={{ bgcolor: '#f05a28', '&:hover': { bgcolor: '#d94c1f' } }}
                        >
                            Select ({selectedImages.length})
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

const categoryStyle = (active) => ({
    fontSize: 14,
    cursor: "pointer",
    px: 1,
    py: 0.5,
    borderRadius: 1,
    bgcolor: active ? "#e3f2fd" : "transparent",
    fontWeight: active ? 600 : 400,
    "&:hover": {
        bgcolor: active ? "#bbdefb" : "#f5f5f5"
    }
});
