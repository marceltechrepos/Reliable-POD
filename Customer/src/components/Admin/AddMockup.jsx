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
        // setSelectedImages((prev) =>
        //     prev.some((i) => i.id === item.id)
        //         ? prev.filter((i) => i.id !== item.id)
        //         : [...prev, item]
        // );
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
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    maxWidth: 1200,
                    maxHeight: "90vh",
                    bgcolor: "#fff",
                    borderRadius: 2,
                    display: "flex",
                    overflow: "hidden"
                }}
            >
                {/* LEFT SIDEBAR */}
                <Box sx={{ width: 260, borderRight: "1px solid #eee", p: 2 }}>
                    <Typography fontWeight={600} mb={2}>
                        Image Library
                    </Typography>
                    <Stack spacing={1}>
                        {categories.map((cat) => (
                            <Typography
                                key={cat.id}
                                sx={categoryStyle(selectedCategory === cat.name)}
                                onClick={() => setSelectedCategory(cat.name)}
                            >
                                {cat.name}
                            </Typography>
                        ))}
                    </Stack>
                </Box>

                {/* RIGHT CONTENT */}
                <Box
                    sx={{
                        flex: 1,
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        height: "90vh"
                    }}
                >
                    {/* UPLOAD AREA */}
                    <Box
                        onClick={() => !uploading && fileInputRef.current.click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        sx={{
                            border: "2px dashed #ddd",
                            borderRadius: 2,
                            py: 4,
                            textAlign: "center",
                            mb: 3,
                            cursor: uploading ? "default" : "pointer",
                            opacity: uploading ? 0.7 : 1,
                            bgcolor: uploading ? "#f5f5f5" : "transparent"
                        }}
                    >
                        {uploading ? (
                            <CircularProgress size={40} />
                        ) : (
                            <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: "#666" }} />
                        )}
                        <Typography mt={1} color="textSecondary">
                            {uploading ? "Uploading..." : "Drag & drop or click to upload"}
                        </Typography>
                        <input
                            hidden
                            multiple
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            disabled={uploading}
                        />
                    </Box>

                    {/* SEARCH */}
                    <Stack direction="row" spacing={2} mb={2}>
                        <TextField
                            size="small"
                            placeholder="Search images..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            fullWidth
                        />
                        <Button
                            startIcon={<RefreshIcon />}
                            onClick={() => {
                                resetModal();
                                fetchImages();
                            }}
                            variant="outlined"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : "Reload"}
                        </Button>
                    </Stack>

                    {/* ERROR/SUCCESS MESSAGES */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                            {success}
                        </Alert>
                    )}

                    {/* IMAGE GRID */}
                    <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Grid container spacing={2}>
                                {filteredImages.length > 0 ? (
                                    filteredImages.map((item) => (
                                        <Grid item xs={6} md={3} key={item.id}>
                                            <Box
                                                sx={{
                                                    border: selectedImages.some((i) => i.id === item.id)
                                                        ? "2px solid #1976d2"
                                                        : "1px solid #ddd",
                                                    borderRadius: 2,
                                                    p: 1,
                                                    position: "relative",
                                                    cursor: "pointer",
                                                    "&:hover": {
                                                        boxShadow: 2
                                                    }
                                                }}
                                                onClick={() => toggleSelect(item)}
                                            >
                                                <Checkbox
                                                    checked={selectedImages.some((i) => i.id === item.id)}
                                                    onChange={() => toggleSelect(item)}
                                                    sx={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: "absolute",
                                                        top: 0,
                                                        right: 0,
                                                        bgcolor: "rgba(255,255,255,0.8)",
                                                        "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
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
                                                        width: "100%",
                                                        height: 160,
                                                        objectFit: "cover",
                                                        borderRadius: 1
                                                    }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/300?text=Error";
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    noWrap
                                                    sx={{ mt: 1, display: "block", textAlign: "center" }}
                                                >
                                                    {item.title}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid item xs={12}>
                                        <Typography textAlign="center" color="textSecondary" py={4}>
                                            No images found
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* ACTION BUTTON */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleSelect}
                            disabled={selectedImages.length === 0}
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