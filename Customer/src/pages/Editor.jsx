import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import image from "../assets/image/dummy.jpg";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { getProductById } from "../api/category.api";
import { getLayersByProductId } from "../api/layer.api";
import LayerProperties from "../components/Admin/LayerProperties";
import ThreeWarpedImage from "../components/Admin/ThreePerspectiveImage";
import {
    uploadCustomerImage,
    saveCustomerDesign,
    getCustomerDesign,
    deleteCustomerLayer,
    updateCustomerLayer
} from "../api/customerDesign.api";
import AddMockup from "../components/Admin/AddMockup";
import IMG from "../assets/image/img.svg";
import { Rnd } from "react-rnd";
import { Pencil, Copy, Lock, Unlock, Trash2 } from "lucide-react";
import * as layerHelpers from "../components/Admin/utils/layerHelpers";
import { toast } from "react-toastify";
import ConfirmDesignModal from "../components/Admin/ConfirmDesignModal";
import { getCustomProductByUserId, updateCustomProduct } from "../api/customerProduct.api";
import { captureFinalDesign, uploadFinalImage } from "../api/customerDesign.api";

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const toNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};
const round2 = (v) => Math.round((v + Number.EPSILON) * 100) / 100;

const MAX_LAYER_PERCENT = 300; // ya 500 bhi rakh sakte ho

const normalizeLayer = (layer) => {
    const width = clamp(toNumber(layer.width, 30), 5, MAX_LAYER_PERCENT);
    const height = clamp(toNumber(layer.height, 30), 5, MAX_LAYER_PERCENT);
    const positionX = toNumber(layer.positionX, 0);
    const positionY = toNumber(layer.positionY, 0);

    const normalized = {
        ...layer,
        width: round2(width),
        height: round2(height),
        positionX: round2(positionX),
        positionY: round2(positionY),
        rotation: round2(toNumber(layer.rotation, 0)),
        opacity: clamp(round2(toNumber(layer.opacity, 1)), 0, 1),
    };

    // Initialize corners with absolute pixel values (same as admin)
    if (normalized.enablePerspective) {
        if (!normalized.corners || normalized.corners.length === 0) {
            normalized.corners = [
                { x: 0, y: 0 },
                { x: width, y: 0 },
                { x: width, y: height },
                { x: 0, y: height }
            ];
        }
    }
    return normalized;
};

const getLayerAspectRatio = (layer) => {
    const w = Math.max(toNumber(layer?.width, 30), 1);
    const h = Math.max(toNumber(layer?.height, 30), 1);
    return w / h;
};

const stripHtml = (html) => {
    if (!html) return "";
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
};

const Editor = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const location = useLocation();
    const productFromState = location.state?.product;

    // states
    const [draggingCorner, setDraggingCorner] = useState(null);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [product, setProduct] = useState(productFromState || null);
    const [loading, setLoading] = useState(!productFromState);
    const [startDesigning, setStartDesigning] = useState(false);
    const [openMockupModal, setOpenMockupModal] = useState(false);
    const [adminLayers, setAdminLayers] = useState([]);
    const [customerLayers, setCustomerLayers] = useState([]);
    const [selectedMockup, setSelectedMockup] = useState(null);
    const [selectedPrintArea, setSelectedPrintArea] = useState(null);
    const [saving, setSaving] = useState(false);
    const [selectedLayerIndex, setSelectedLayerIndex] = useState(null);
    const [windowSize, setWindowSize] = useState(0);
    const [renderKey, setRenderKey] = useState(0);
    const [isLoadingDesign, setIsLoadingDesign] = useState(false);
    const [hasSavedDesign, setHasSavedDesign] = useState(false);
    const [containersReady, setContainersReady] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [customerDesignId, setCustomerDesignId] = useState(null);
    const [existingCustomProduct, setExistingCustomProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCheckingExisting, setIsCheckingExisting] = useState(false);

    const fileInputRef = useRef(null);
    const containerRefs = useRef({});
    const designContainerRef = useRef(null);
    const rndRefs = useRef({});
    const fontStack = 'ui-sans-serif, system-ui, -apple-system, sans-serif';

    const colors = [
        { name: "Black", class: "bg-black" },
        { name: "White", class: "bg-white border" },
        { name: "Dark Heather", class: "bg-gray-700" },
        { name: "Sports Grey", class: "bg-gray-400" },
        { name: "Light Blue", class: "bg-blue-400" },
        { name: "Azalea Pink", class: "bg-pink-400" }
    ];

    const activeProduct = existingCustomProduct?.baseProduct || product;

    const productColors = activeProduct?.Variants?.reduce((acc, variant) => {
        if (!variant.color || variant.color === "") return acc;
        const existingColor = acc.find(c => c.name === variant.color);
        if (!existingColor) {
            acc.push({
                name: variant.color,
                hex: variant.colorHex || '#ffffff',
                variants: [variant]
            });
        } else {
            existingColor.variants.push(variant);
        }
        return acc;
    }, []) || [];

    const productSizes = activeProduct?.Variants?.reduce((acc, variant) => {
        if (!variant.size || variant.size === "") return acc;
        if (!acc.includes(variant.size)) {
            acc.push(variant.size);
        }
        return acc;
    }, []) || [];

    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
    const sortedSizes = [...productSizes].sort((a, b) => {
        const indexA = sizeOrder.indexOf(a);
        const indexB = sizeOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    const displayColors = productColors.length > 0 ? productColors : [];
    const displaySizes = sortedSizes.length > 0 ? sortedSizes : [];

    const startCornerDrag = (e, layerIndex, cornerIndex, printAreaId) => {
        e.preventDefault();
        e.stopPropagation();

        const container = containerRefs.current[printAreaId];
        const designContainer = designContainerRef.current;
        if (!container || !designContainer) return;

        const printAreaRect = container.getBoundingClientRect();
        const designContainerRect = designContainer.getBoundingClientRect();

        const layer = customerLayers[layerIndex];

        // Calculate print area position relative to design container
        const printAreaLeft = printAreaRect.left - designContainerRect.left;
        const printAreaTop = printAreaRect.top - designContainerRect.top;
        const printAreaWidth = printAreaRect.width;
        const printAreaHeight = printAreaRect.height;

        // Calculate layer dimensions in pixels
        const layerWidthPx = (layer.width / 100) * printAreaWidth;
        const layerHeightPx = (layer.height / 100) * printAreaHeight;

        // Scale factor
        const scaleFactor = layerWidthPx / layer.width;

        const onMouseMove = (moveEvent) => {
            moveEvent.preventDefault();

            // Get mouse position relative to design container
            const mouseX = moveEvent.clientX - designContainerRect.left;
            const mouseY = moveEvent.clientY - designContainerRect.top;

            // Calculate layer position in pixels (relative to design container)
            const layerLeftPx = printAreaLeft + (layer.positionX / 100) * printAreaWidth;
            const layerTopPx = printAreaTop + (layer.positionY / 100) * printAreaHeight;

            // Mouse position relative to layer's top-left corner (in pixels)
            const relativeX = mouseX - layerLeftPx;
            const relativeY = mouseY - layerTopPx;

            // Convert to original coordinate space
            const originalX = relativeX / scaleFactor;
            const originalY = relativeY / scaleFactor;

            // Clamp to layer bounds
            const clampedX = Math.max(0, Math.min(layer.width, originalX));
            const clampedY = Math.max(0, Math.min(layer.height, originalY));

            setCustomerLayers(prev => {
                const updated = [...prev];
                const currentLayer = updated[layerIndex];
                if (currentLayer && currentLayer.corners) {
                    const newCorners = [...currentLayer.corners];
                    newCorners[cornerIndex] = { x: clampedX, y: clampedY };
                    updated[layerIndex] = { ...currentLayer, corners: newCorners };
                }
                return updated;
            });
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);

            const updatedLayer = customerLayers[layerIndex];
            if (updatedLayer?._id && hasSavedDesign) {
                updateCustomerLayer(updatedLayer._id, {
                    corners: updatedLayer.corners
                }).catch(console.error);
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Shift") setIsShiftPressed(true);
        };

        const handleKeyUp = (e) => {
            if (e.key === "Shift") setIsShiftPressed(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    // Check existing custom product
    useEffect(() => {
        const checkExistingDesign = async () => {
            if (!productId || !selectedMockup?._id) return;
            try {
                setIsCheckingExisting(true);
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user?._id) return;
                const res = await getCustomProductByUserId(user._id);
                if (res.success && res.data) {
                    const existing = res.data.find(cp => cp.baseProduct?._id === productId);
                    if (existing) {
                        setExistingCustomProduct(existing);
                        setIsEditing(true);
                        const designRes = await getCustomerDesign(productId, selectedMockup._id);
                        if (designRes.success && designRes.data) {
                            setCustomerLayers(designRes.data.layers || []);
                            setCustomerDesignId(designRes.data._id);
                        }
                    } else {
                        setIsEditing(false);
                        setExistingCustomProduct(null);
                    }
                }
            } catch (error) {
                console.error("Error checking existing design:", error);
                setIsEditing(false);
            } finally {
                setIsCheckingExisting(false);
            }
        };
        checkExistingDesign();
    }, [productId, selectedMockup]);

    useEffect(() => {
        const handleResize = () => setWindowSize(w => w + 1);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!product && productId) {
                try {
                    setLoading(true);
                    const res = await getProductById(productId);
                    setProduct(res);
                    if (res.mockupIds?.length > 0) setSelectedMockup(res.mockupIds[0]);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProduct();
    }, [productId, product]);

    useEffect(() => {
        const fetchAdmin = async () => {
            if (product?._id && selectedMockup?._id) {
                try {
                    const res = await getLayersByProductId(product._id, selectedMockup._id);
                    if (res.data) {
                        const areas = res.data.filter(l => l.type === "printarea");
                        setAdminLayers(areas);
                    }
                } catch (e) {
                    console.error("admin layers:", e);
                }
            }
        };
        fetchAdmin();
    }, [product?._id, selectedMockup]);

    useEffect(() => {
        const fetchCustomerDesign = async () => {
            if (productId && selectedMockup?._id) {
                setIsLoadingDesign(true);
                try {
                    const res = await getCustomerDesign(productId, selectedMockup._id);
                    if (res.success && res.data) {
                        const loadedLayers = (res.data.layers || []).map(layer => ({
                            ...layer,
                            horizontalAlign: layer.horizontalAlign || 'center',
                            verticalAlign: layer.verticalAlign || 'middle',
                            positionX: Number(layer.positionX) || 20,
                            positionY: Number(layer.positionY) || 20,
                            width: Number(layer.width) || 30,
                            height: Number(layer.height) || 30,
                            rotation: Number(layer.rotation) || 0,
                            opacity: Number(layer.opacity) || 1
                        }));
                        setCustomerLayers(loadedLayers);
                        setTimeout(() => {
                            setRenderKey(prev => prev + 1);
                            setContainersReady(false);
                        }, 100);
                    }
                } catch (error) {
                    console.error("Error loading design:", error);
                } finally {
                    setIsLoadingDesign(false);
                }
            }
        };
        fetchCustomerDesign();
    }, [productId, selectedMockup]);

    const getPixelValues = (printAreaId, layer) => {
        const container = containerRefs.current[printAreaId];
        if (!container) return { x: 0, y: 0, width: 100, height: 100, scaleFactor: 1 };
        const rect = container.getBoundingClientRect();
        const cw = rect.width || 300;
        const ch = rect.height || 300;
        const safe = normalizeLayer(layer);

        const scaleFactor = cw / 100; // Convert percentage to pixels

        return {
            x: (safe.positionX / 100) * cw,
            y: (safe.positionY / 100) * ch,
            width: (safe.width / 100) * cw,
            height: (safe.height / 100) * ch,
            scaleFactor: scaleFactor
        };
    };

    useEffect(() => {
        if (!startDesigning || adminLayers.length === 0) return;
        const timer = setTimeout(() => setContainersReady(true), 200);
        return () => clearTimeout(timer);
    }, [startDesigning, adminLayers]);

    const updateLayerLocalAndMaybeServer = (index, updates, callServer = true) => {
        setCustomerLayers(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...updates };
            if (callServer && hasSavedDesign && updated[index]._id) {
                const payload = { ...updated[index] };
                updateCustomerLayer(updated[index]._id, payload).catch(err => {
                    console.error("update layer failed", err);
                    toast.error("Unable to update layer on server");
                });
            }
            return updated;
        });
        setTimeout(() => setRenderKey(k => k + 1), 5);
    };

    const handleDragStart = (layerIndex) => setSelectedLayerIndex(layerIndex);

    const handleDragStop = (printAreaId, layerIndex, d) => {
        const container = containerRefs.current[printAreaId];
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const layer = customerLayers[layerIndex];
        if (!layer) return;
        let newXPercent, newYPercent;
        if (d.x === 0 && d.y === 0 && layer.positionX !== 0 && layer.positionY !== 0) {
            newXPercent = layer.positionX;
            newYPercent = layer.positionY;
        } else {
            newXPercent = (d.x / rect.width) * 100;
            newYPercent = (d.y / rect.height) * 100;
        }
        updateLayerLocalAndMaybeServer(layerIndex, {
            positionX: round2(newXPercent),
            positionY: round2(newYPercent)
        }, true);
    };

    const handleResizeStop = (printAreaId, layerIndex, ref, position) => {
        const container = containerRefs.current[printAreaId];
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const widthPercent = (parseFloat(ref.style.width) / rect.width) * 100;
        const heightPercent = (parseFloat(ref.style.height) / rect.height) * 100;
        const posX = (position.x / rect.width) * 100;
        const posY = (position.y / rect.height) * 100;
        updateLayerLocalAndMaybeServer(layerIndex, {
            width: round2(widthPercent),
            height: round2(heightPercent),
            positionX: round2(posX),
            positionY: round2(posY)
        }, true);
    };

    const handleDuplicateLayer = (index) => {
        const updated = layerHelpers.duplicateLayer(customerLayers, index);
        setCustomerLayers(updated.map(l => normalizeLayer(l)));
        setSelectedLayerIndex(updated.length - 1);
        setRenderKey(k => k + 1);
    };

    const handleToggleLock = (index) => {
        setCustomerLayers(prev => {
            const updated = layerHelpers.toggleLayerLock(prev, index);
            return updated;
        });
        setTimeout(() => setRenderKey(k => k + 1), 10);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const normalized = customerLayers.map(l => normalizeLayer(l));
            let res;
            let designId = null;
            if (isEditing && existingCustomProduct?._id) {
                const payload = {
                    productId,
                    mockupId: selectedMockup._id,
                    layers: normalized,
                    customVariant: existingCustomProduct.customVariant || {
                        enabled: true,
                        name: "",
                        description: "",
                        tags: []
                    },
                    selectedDefaultVariants: existingCustomProduct.selectedDefaultVariants || []
                };
                res = await updateCustomProduct(existingCustomProduct._id, payload);
                if (res.success) {
                    designId = existingCustomProduct._id;
                    setShowConfirmModal(false)
                    toast.success("Design updated successfully!");
                }
            } else {
                res = await saveCustomerDesign({
                    productId,
                    mockupId: selectedMockup._id,
                    layers: normalized
                });
                if (res.success) {
                    designId = res.data?._id;
                    toast.success("Design saved successfully!");
                }
            }
            if (res?.success) {
                setHasSavedDesign(true);
                setCustomerDesignId(designId);
                try {
                    const fresh = await getCustomerDesign(productId, selectedMockup._id);
                    if (fresh.success && fresh.data) {
                        if (fresh.data._id) setCustomerDesignId(fresh.data._id);
                        const loaded = (fresh.data.layers || []).map(l => normalizeLayer({
                            ...l,
                            horizontalAlign: l.horizontalAlign || 'center',
                            verticalAlign: l.verticalAlign || 'middle'
                        }));
                        setCustomerLayers(loaded);
                        setRenderKey(k => k + 1);
                    }
                } catch (e) {
                    console.error("fetch fresh after save", e);
                }
                return designId;
            } else {
                toast.error(isEditing ? "Update failed" : "Save failed");
                return null;
            }
        } catch (e) {
            console.error("save error", e);
            toast.error(isEditing ? "Update failed" : "Save failed");
            return null;
        } finally {
            setSaving(false);
        }
    };

    const handleConfirm = async () => {
        const savedDesignId = await handleSave();
        if (savedDesignId) {
            navigate(`/user/design-variants/${productId}`, {
                state: {
                    product,
                    selectedMockup,
                    customerLayers,
                    adminLayers,
                    customerDesignId: savedDesignId,
                    isEditing,
                    existingCustomProduct: isEditing ? existingCustomProduct : null
                }
            });
        }
    };

    const handleOpenModal = () => setShowConfirmModal(true);

    // Refactored handleNext: now uses captureFinalDesign and uploadFinalImage
    const handleNext = async () => {
        try {
            setSaving(true);
            const normalized = customerLayers.map(l => normalizeLayer(l));
            let designId = null;

            if (isEditing && existingCustomProduct?._id) {
                const designRes = await getCustomerDesign(productId, selectedMockup._id);
                if (designRes.success && designRes.data) {
                    const updateRes = await saveCustomerDesign({
                        productId,
                        mockupId: selectedMockup._id,
                        layers: normalized
                    });
                    if (updateRes.success) {
                        designId = designRes.data._id;
                        setShowConfirmModal(false)
                        toast.success("Design updated successfully!");
                    } else {
                        toast.error("Design update failed");
                        setSaving(false);
                        return;
                    }
                } else {
                    const createRes = await saveCustomerDesign({
                        productId,
                        mockupId: selectedMockup._id,
                        layers: normalized
                    });
                    if (createRes.success) {
                        designId = createRes.data?._id;
                        setShowConfirmModal(false)
                        toast.success("Design saved successfully!");
                    } else {
                        toast.error("Save failed");
                        setSaving(false);
                        return;
                    }
                }
            } else {
                const res = await saveCustomerDesign({
                    productId,
                    mockupId: selectedMockup._id,
                    layers: normalized
                });
                if (res.success) {
                    designId = res.data?._id;
                    setShowConfirmModal(false)
                    toast.success("Design saved successfully!");
                } else {
                    toast.error("Save failed");
                    setSaving(false);
                    return;
                }
            }

            // Capture and upload final image
            if (designId) {
                const imageFile = await captureFinalDesign(designContainerRef);
                if (imageFile) {
                    await uploadFinalImage(designId, imageFile);
                } else {
                    toast.warn("Could not generate final image, but design saved.");
                }
            }

            // Navigate
            if (designId) {
                navigate(`/user/design-variants/${productId}`, {
                    state: {
                        product,
                        selectedMockup,
                        customerLayers,
                        adminLayers,
                        customerDesignId: designId,
                        isEditing,
                        existingCustomProduct: isEditing ? existingCustomProduct : null
                    }
                });
            }
        } catch (error) {
            console.error("Error in handleNext:", error);
            toast.error("Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    const handleAlignHorizontal = (align) => {
        if (selectedLayerIndex === null) return;
        const layer = customerLayers[selectedLayerIndex];
        if (!layer) return;
        let newX;
        if (align === 'left') newX = 0;
        else if (align === 'center') newX = 50 - (toNumber(layer.width, 30) / 2);
        else newX = 100 - toNumber(layer.width, 30);
        updateLayerLocalAndMaybeServer(selectedLayerIndex, {
            positionX: round2(newX),
            horizontalAlign: align
        }, true);
    };

    const handleAlignVertical = (align) => {
        if (selectedLayerIndex === null) return;
        const layer = customerLayers[selectedLayerIndex];
        if (!layer) return;
        let newY;
        if (align === 'top') newY = 0;
        else if (align === 'middle') newY = 50 - (toNumber(layer.height, 30) / 2);
        else newY = 100 - toNumber(layer.height, 30);
        updateLayerLocalAndMaybeServer(selectedLayerIndex, {
            positionY: round2(newY),
            verticalAlign: align
        }, true);
    };

    const handleLayerPropertiesChange = (updates) => {
        if (selectedLayerIndex === null) return;
        updateLayerLocalAndMaybeServer(selectedLayerIndex, updates, true);
    };

    const handlePrintAreaImageUpload = async (printAreaLayer, file) => {
        if (!file) return;
        try {
            setSaving(true);
            const uploadRes = await uploadCustomerImage(file);
            if (!uploadRes.success) throw new Error(uploadRes.message);
            const { imageUrl, publicId } = uploadRes.data;
            const newLayer = {
                printArea: printAreaLayer._id,
                imageUrl,
                publicId,
                positionX: printAreaLayer.x_percent || 20,
                positionY: printAreaLayer.y_percent || 20,
                width: printAreaLayer.width_percent || 30,
                height: printAreaLayer.height_percent || 30,
                rotation: 0,
                opacity: 1,
                visible: true,
                zIndex: customerLayers.length + 1,
                locked: false,
                horizontalAlign: 'center',
                verticalAlign: 'middle'
            };
            setCustomerLayers(prev => [...prev, normalizeLayer(newLayer)]);
            setSelectedLayerIndex(customerLayers.length);
            setTimeout(() => setRenderKey(k => k + 1), 10);
            toast.success("Image uploaded");
        } catch (e) {
            console.error("upload err", e);
            toast.error("Upload failed");
        } finally {
            setSaving(false);
        }
    };

    const handleImageFromModal = (image) => {
        const defaultPrintArea = selectedPrintArea || adminLayers[0];
        if (!defaultPrintArea) {
            toast.error("No print area found");
            return;
        }
        const newLayerData = {
            printArea: defaultPrintArea._id,
            imageUrl: image.url,
            publicId: image.id || null,
            positionX: defaultPrintArea.x_percent || 20,
            positionY: defaultPrintArea.y_percent || 20,
            width: defaultPrintArea.width_percent || 30,
            height: defaultPrintArea.height_percent || 30,
            rotation: 0,
            opacity: 1,
            visible: true,
            zIndex: customerLayers.length + 1,
            locked: false,
            horizontalAlign: 'center',
            verticalAlign: 'middle'
        };
        setCustomerLayers(prev => [...prev, normalizeLayer(newLayerData)]);
        setSelectedLayerIndex(customerLayers.length);
        setOpenMockupModal(false);
        setTimeout(() => setRenderKey(k => k + 1), 10);
    };

    const handleRemoveLayer = async (index) => {
        const layer = customerLayers[index];
        if (layer && layer._id) {
            try {
                await deleteCustomerLayer(layer._id);
            } catch (e) {
                console.error("delete err", e);
            }
        }
        setCustomerLayers(prev => prev.filter((_, i) => i !== index));
        setSelectedLayerIndex(null);
        setTimeout(() => setRenderKey(k => k + 1), 10);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] py-6 px-4 md:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm font-medium text-gray-500 hover:text-[#f05a28] transition-colors"
                    >
                        Back to Products
                    </button>
                    {startDesigning && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleOpenModal}
                                    disabled={saving || isCheckingExisting}
                                    className={`px-5 py-2 text-white text-sm font-semibold transition disabled:opacity-50 cursor-pointer ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#f05a28] hover:bg-[#d94d24]'
                                        }`}
                                >
                                    {saving
                                        ? (isEditing ? 'Updating...' : 'Saving...')
                                        : (isEditing ? 'Update & Next' : 'Save & Next')
                                    }
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8">
                        <div className="relative bg-white shadow-xl border border-gray-200 overflow-hidden">
                            <div onClick={() => setSelectedLayerIndex(null)} ref={designContainerRef} className="aspect-square relative">
                                <img
                                    src={selectedMockup?.mockupImage?.url || product?.thumbnail?.url || image}
                                    alt={product?.productTitle}
                                    className="w-full h-full object-cover"
                                />
                                {startDesigning && adminLayers.map((printAreaLayer) => {
                                    const areaLayers = customerLayers.filter(
                                        l => (l.printArea?._id || l.printArea) === printAreaLayer._id
                                    );
                                    return (
                                        <div
                                            key={printAreaLayer._id}
                                            ref={el => { if (el) containerRefs.current[printAreaLayer._id] = el; }}
                                            className="absolute print-area-border border-2 border-dashed border-[#f05a28] bg-white/10"
                                            style={{
                                                left: `${printAreaLayer.x_percent || 20}%`,
                                                top: `${printAreaLayer.y_percent || 20}%`,
                                                width: `${printAreaLayer.width_percent || 30}%`,
                                                height: `${printAreaLayer.height_percent || 30}%`,
                                                overflow: "hidden",
                                                boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
                                            }}
                                        >
                                            {isLoadingDesign ? (
                                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50">
                                                    <Loader2 className="animate-spin text-[#f05a28]" size={40} />
                                                </div>
                                            ) : (
                                                areaLayers.map(layer => {
                                                    const globalIndex = customerLayers.findIndex(
                                                        l => (l._id ? String(l._id) : null) === (layer._id ? String(layer._id) : null)
                                                    );
                                                    if (globalIndex === -1) return null;
                                                    const pixelValues = getPixelValues(printAreaLayer._id, layer);
                                                    return (
                                                        <Rnd
                                                            dragAxis="both"
                                                            key={`${layer._id || globalIndex}-${renderKey}`}
                                                            size={{ width: pixelValues.width, height: pixelValues.height }}
                                                            position={{ x: pixelValues.x, y: pixelValues.y }}
                                                            disableDragging={layer.locked || layer.enablePerspective}
                                                            enableResizing={!layer.locked && !layer.enablePerspective}
                                                            lockAspectRatio={isShiftPressed ? getLayerAspectRatio(layer) : false}
                                                            onDragStart={() => handleDragStart(globalIndex)}
                                                            onDragStop={(e, d) => handleDragStop(printAreaLayer._id, globalIndex, d)}
                                                            onResizeStop={(e, dir, ref, delta, pos) =>
                                                                handleResizeStop(printAreaLayer._id, globalIndex, ref, pos)
                                                            }
                                                            onMouseDown={() => setSelectedLayerIndex(globalIndex)}
                                                            scale={1}
                                                            style={{
                                                                zIndex: layer.zIndex || 1,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                        >
                                                            <div onClick={(e) => e.stopPropagation()} className={`relative group w-full h-full overflow-hidden ${selectedLayerIndex === globalIndex ? 'ring-2 ring-blue-500 ring-inset' : ''}`}>
                                                                {layer.enablePerspective && layer.corners ? (
                                                                    <div style={{
                                                                        width: "100%",
                                                                        height: "100%",
                                                                        position: "relative",
                                                                    }}>
                                                                        <div style={{
                                                                            width: layer.width,
                                                                            height: layer.height,
                                                                            position: "relative",
                                                                            transform: `scale(${pixelValues.width / layer.width})`,
                                                                            transformOrigin: "0 0"
                                                                        }}>
                                                                            <ThreeWarpedImage
                                                                                key={`${layer._id}-${JSON.stringify(layer.corners)}`}
                                                                                src={layer.imageUrl}
                                                                                corners={layer.corners}
                                                                                width={layer.width}
                                                                                height={layer.height}
                                                                                fit={layer.fit || "cover"}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <img
                                                                        src={layer?.imageUrl}
                                                                        alt=""
                                                                        className="w-full h-full object-cover pointer-events-none"
                                                                        style={{
                                                                            transform: `rotate(${layer.rotation || 0}deg)`,
                                                                            opacity: layer.opacity ?? 1
                                                                        }}
                                                                    />
                                                                )}

                                                                {selectedLayerIndex === globalIndex && (
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleRemoveLayer(globalIndex); }}
                                                                        className="absolute -top-0 -right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 z-10 cursor-pointer shadow-lg"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </Rnd>
                                                    );
                                                })
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Perspective Handles Overlay */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        pointerEvents: "none",
                                        zIndex: 1000
                                    }}
                                >
                                    {customerLayers.map((layer, idx) => {
                                        const printAreaId = layer.printArea?._id || layer.printArea;
                                        if (
                                            selectedLayerIndex === idx &&
                                            layer.enablePerspective &&
                                            layer.corners &&
                                            layer.visible !== false
                                        ) {
                                            const container = containerRefs.current[printAreaId];
                                            if (!container) return null;

                                            // Get print area container position and dimensions
                                            const printAreaRect = container.getBoundingClientRect();
                                            const designContainerRect = designContainerRef.current?.getBoundingClientRect();

                                            if (!designContainerRect) return null;

                                            // Calculate print area position relative to design container
                                            const printAreaLeft = printAreaRect.left - designContainerRect.left;
                                            const printAreaTop = printAreaRect.top - designContainerRect.top;
                                            const printAreaWidth = printAreaRect.width;
                                            const printAreaHeight = printAreaRect.height;

                                            // Calculate layer position within print area (as percentages)
                                            const layerLeftPercent = layer.positionX / 100;
                                            const layerTopPercent = layer.positionY / 100;
                                            const layerWidthPercent = layer.width / 100;
                                            const layerHeightPercent = layer.height / 100;

                                            // Calculate layer position and dimensions in pixels (relative to design container)
                                            const layerLeft = printAreaLeft + (layerLeftPercent * printAreaWidth);
                                            const layerTop = printAreaTop + (layerTopPercent * printAreaHeight);
                                            const layerWidth = layerWidthPercent * printAreaWidth;
                                            const layerHeight = layerHeightPercent * printAreaHeight;

                                            // Scale factor for corners (display pixels / original dimensions)
                                            const scaleFactor = layerWidth / layer.width;

                                            return layer.corners.map((corner, i) => {
                                                // Calculate handle position
                                                const handleX = layerLeft + (corner.x * scaleFactor);
                                                const handleY = layerTop + (corner.y * scaleFactor);

                                                return (
                                                    <div
                                                        key={`${layer._id || idx}-corner-${i}`}
                                                        onMouseDown={(e) => startCornerDrag(e, idx, i, printAreaId)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            position: "absolute",
                                                            left: handleX - 6,
                                                            top: handleY - 6,
                                                            width: 12,
                                                            height: 12,
                                                            backgroundColor: "#f59e0b",
                                                            borderRadius: "50%",
                                                            border: "2px solid white",
                                                            cursor: "move",
                                                            pointerEvents: "auto",
                                                            zIndex: 1001,
                                                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                                        }}
                                                    />
                                                );
                                            });
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-6 self-start">
                        <div className="bg-white border border-gray-200 shadow-xl overflow-hidden">
                            <div className="p-4 border-b border-gray-200 flex justify-between">
                                <h3 className="text-[15px] font-black text-gray-900">Design Studio</h3>
                                <div
                                    style={{ display: startDesigning ? "none" : "block" }}
                                    onClick={() => setStartDesigning(true)}
                                    className="px-4 py-3 bg-[#f05a28] text-white font-bold text-sm hover:opacity-90 transition cursor-pointer rounded-md"
                                >
                                    Start Designing
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                {!startDesigning ? (
                                    <>
                                        <div className="bg-gray-50 border border-gray-200 p-4">
                                            <h1 className="text-xl font-black text-gray-900 leading-snug truncate">
                                                {product?.productTitle || product?.title}
                                            </h1>
                                            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                                {stripHtml(product?.description) || "No description available"}
                                            </p>
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="text-xl font-black text-gray-900">
                                                    ${product?.Variants?.[0]?.basePrice || "0.00"}
                                                </div>
                                                <span className="text-[11px] font-bold text-emerald-700">
                                                    Ready to design
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <button className="px-4 py-3 border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition">
                                                Product
                                            </button>
                                            <button
                                                onClick={() => setStartDesigning(true)}
                                                className="cursor-pointer px-4 py-3 bg-[#f05a28] text-white font-bold text-sm hover:opacity-90 transition rounded-l-sm"
                                            >
                                                Design
                                            </button>
                                        </div>

                                        <div className="border border-gray-200 p-4">
                                            <h4 className="text-[11px] font-black uppercase text-gray-400 mb-3">
                                                Available Colors ({displayColors.length})
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                {displayColors.map((c, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-2 py-2">
                                                        <div
                                                            className="w-5 h-5 rounded border border-gray-200"
                                                            style={{ backgroundColor: c.hex }}
                                                        ></div>
                                                        <span className="truncate capitalize">{c.name}</span>
                                                    </div>
                                                ))}
                                                {displayColors.length === 0 && (
                                                    <div className="col-span-2 text-center text-gray-400 text-xs py-2">
                                                        No colors available
                                                    </div>
                                                )}
                                            </div>

                                            <h4 className="text-[11px] font-black uppercase text-gray-400 mb-3">
                                                Available Sizes ({displaySizes.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {displaySizes.map((size, i) => (
                                                    <div
                                                        key={i}
                                                        className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 rounded"
                                                    >
                                                        {size}
                                                    </div>
                                                ))}
                                                {displaySizes.length === 0 && (
                                                    <div className="text-center text-gray-400 text-xs py-2 w-full">
                                                        No sizes available
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="border border-gray-200 bg-white p-3">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm font-semibold text-gray-800">
                                                    Layers <span className="text-xs text-gray-400">({customerLayers.length})</span>
                                                </h3>
                                            </div>
                                            <div className="space-y-2">
                                                {customerLayers.length > 0 ? (
                                                    customerLayers.map((layer, index) => (
                                                        <div
                                                            key={layer._id || index}
                                                            onClick={() => setSelectedLayerIndex(index)}
                                                            className={`group flex items-center justify-between p-2 border transition-all cursor-pointer ${selectedLayerIndex === index
                                                                ? 'border-[#f05a28] bg-[#fff7f3]'
                                                                : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                                                                }`}
                                                        >

                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="w-10 h-10 overflow-hidden bg-gray-100 flex-shrink-0">
                                                                    <img src={layer?.imageUrl} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="text-sm font-medium text-gray-800 truncate">
                                                                        Layer {index + 1}
                                                                    </div>
                                                                    <div className="text-[11px] text-gray-500">
                                                                        {Math.round(layer.width || 0)}% × {Math.round(layer.height || 0)}%
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleDuplicateLayer(index); }}
                                                                    className="cursor-pointer p-1.5 text-green-600 hover:bg-green-50 transition"
                                                                    title="Duplicate"
                                                                >
                                                                    <Copy size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleToggleLock(index); }}
                                                                    className="cursor-pointer p-1.5 text-amber-600 hover:bg-amber-50 transition"
                                                                    title={layer.locked ? 'Unlock' : 'Lock'}
                                                                >
                                                                    {layer.locked ? <Unlock size={14} /> : <Lock size={14} />}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleRemoveLayer(index); }}
                                                                    className="cursor-pointer p-1.5 text-red-600 hover:bg-red-50 transition"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>

                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-6 text-gray-400 text-sm">
                                                        No layers added yet
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {selectedLayerIndex !== null && customerLayers[selectedLayerIndex] && (
                                            <div className="border border-gray-200 bg-white p-3">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-sm font-semibold text-gray-800">Properties</h3>
                                                    <span className="text-[11px] text-gray-400">Selected Layer</span>
                                                </div>
                                                <div className="space-y-3">
                                                    <LayerProperties
                                                        layer={customerLayers[selectedLayerIndex]}
                                                        onChange={handleLayerPropertiesChange}
                                                        onAlignHorizontal={handleAlignHorizontal}
                                                        onAlignVertical={handleAlignVertical}
                                                    />
                                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                                        <button
                                                            onClick={() => handleDuplicateLayer(selectedLayerIndex)}
                                                            className="flex items-center justify-center gap-2 px-3 py-2 border text-sm font-medium hover:bg-gray-50 cursor-pointer"
                                                        >
                                                            <Copy size={14} />
                                                            Duplicate
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleLock(selectedLayerIndex)}
                                                            className="flex items-center justify-center gap-2 px-3 py-2 border text-sm font-medium hover:bg-gray-50 cursor-pointer"
                                                        >
                                                            {customerLayers[selectedLayerIndex]?.locked ? <Unlock size={14} /> : <Lock size={14} />}
                                                            {customerLayers[selectedLayerIndex]?.locked ? "Unlock" : "Lock"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveLayer(selectedLayerIndex)}
                                                            className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white text-sm font-semibold hover:bg-red-600 cursor-pointer"
                                                        >
                                                            <Trash2 size={14} />
                                                            Delete Layer
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => {
                                                if (!adminLayers.length) {
                                                    toast.info('No print area available');
                                                    return;
                                                }
                                                setOpenMockupModal(true);
                                            }}
                                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 font-medium hover:border-[#f05a28] hover:text-[#f05a28] transition-colors cursor-pointer rounded"
                                        >
                                            Add Image from Library
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <AddMockup
                    open={openMockupModal}
                    onClose={() => setOpenMockupModal(false)}
                    productId={product?._id || productId}
                    onImageSelect={handleImageFromModal}
                />

                <ConfirmDesignModal
                    open={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={handleNext}
                    saving={saving}
                />
            </div>
        </div>
    );
};

export default Editor;