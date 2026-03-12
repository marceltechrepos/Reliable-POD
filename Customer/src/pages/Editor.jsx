import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import image from "../assets/image/dummy.jpg";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { getProductsById } from "../api/category.api";
import { getLayersByProductId } from "../api/layer.api";
import LayerProperties from "../components/Admin/LayerProperties";
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

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const toNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};
const round2 = (v) => Math.round((v + Number.EPSILON) * 100) / 100;

// const normalizeLayer = (layer) => {
//     const width = clamp(toNumber(layer.width, 30), 5, 100);
//     const height = clamp(toNumber(layer.height, 30), 5, 100);
//     const maxX = clamp(100 - width, 0, 100);
//     const maxY = clamp(100 - height, 0, 100);
//     const positionX = clamp(toNumber(layer.positionX, 0), 0, maxX);
//     const positionY = clamp(toNumber(layer.positionY, 0), 0, maxY);

//     return {
//         ...layer,
//         width: round2(width),
//         height: round2(height),
//         positionX: round2(positionX),
//         positionY: round2(positionY),
//         rotation: round2(toNumber(layer.rotation, 0)),
//         opacity: clamp(round2(toNumber(layer.opacity, 1)), 0, 1)
//     };
// };

const normalizeLayer = (layer) => {
    // Sirf width/height ko normalize karo, position ko nahi
    const width = clamp(toNumber(layer.width, 30), 5, 100);
    const height = clamp(toNumber(layer.height, 30), 5, 100);

    // Position ko EXACT rahne do, clamp mat karo
    const positionX = toNumber(layer.positionX, 0);
    const positionY = toNumber(layer.positionY, 0);

    return {
        ...layer,
        width: round2(width),
        height: round2(height),
        positionX: round2(positionX),
        positionY: round2(positionY),
        rotation: round2(toNumber(layer.rotation, 0)),
        opacity: clamp(round2(toNumber(layer.opacity, 1)), 0, 1)
    };
};

const Editor = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const location = useLocation();
    const productFromState = location.state?.product;

    // states
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

    const fileInputRef = useRef(null);
    const containerRefs = useRef({});
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

    // resize listener (cheap trigger)
    useEffect(() => {
        const handleResize = () => setWindowSize(w => w + 1);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // fetch product
    useEffect(() => {
        const fetchProduct = async () => {
            if (!product && productId) {
                try {
                    setLoading(true);
                    const res = await getProductsById(productId);
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

    // fetch admin print areas
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

                        // Add this: Wait for next tick then trigger container check
                        setTimeout(() => {
                            setRenderKey(prev => prev + 1);
                            setContainersReady(false); // This will trigger recheck
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

    // convert percent -> pixels relative to printArea DOM
    const getPixelValues = (printAreaId, layer) => {
        const container = containerRefs.current[printAreaId];
        if (!container) return { x: 0, y: 0, width: 100, height: 100 };
        const rect = container.getBoundingClientRect();
        const cw = rect.width || 300;
        const ch = rect.height || 300;

        // ensure normalized layer (safety)
        const safe = normalizeLayer(layer);
        return {
            x: (safe.positionX / 100) * cw,
            y: (safe.positionY / 100) * ch,
            width: (safe.width / 100) * cw,
            height: (safe.height / 100) * ch
        };
    };

    useEffect(() => {
        if (!startDesigning || adminLayers.length === 0) return;

        // Directly set containersReady to true after a small delay
        const timer = setTimeout(() => {
            setContainersReady(true);
        }, 200);

        return () => clearTimeout(timer);
    }, [startDesigning, adminLayers]);

    // local update helper that also optionally triggers server update
    // const updateLayerLocalAndMaybeServer = (index, updates, callServer = true) => {
    //     setCustomerLayers(prev => {
    //         const updated = [...prev];
    //         const layer = { ...updated[index], ...updates };
    //         updated[index] = normalizeLayer(layer);
    //         // trigger server call (fire & forget)
    //         if (callServer && hasSavedDesign && updated[index]._id) {
    //             const payload = { ...updated[index] };
    //             // ensure server expects numbers (sanitized)
    //             payload.positionX = Number(payload.positionX);
    //             payload.positionY = Number(payload.positionY);
    //             payload.width = Number(payload.width);
    //             payload.height = Number(payload.height);
    //             payload.rotation = Number(payload.rotation);
    //             payload.opacity = Number(payload.opacity);
    //             updateCustomerLayer(updated[index]._id, payload).catch(err => {
    //                 console.error("update layer failed", err);
    //                 toast.error("Unable to update layer on server");
    //             });
    //         }
    //         return updated;
    //     });
    //     // minor re-render trigger for Rnd to pick new position/size
    //     setTimeout(() => setRenderKey(k => k + 1), 5);
    // };

    const updateLayerLocalAndMaybeServer = (index, updates, callServer = true) => {
        setCustomerLayers(prev => {
            const updated = [...prev];
            // Normalize mat karo - exact values save karo
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

    // drag start
    const handleDragStart = (layerIndex) => {
        setSelectedLayerIndex(layerIndex);
    };

    // drag stop -> compute percent, clamp, update local + server
    // const handleDragStop = (printAreaId, layerIndex, d) => {
    //     const container = containerRefs.current[printAreaId];
    //     if (!container) return;
    //     const rect = container.getBoundingClientRect();
    //     const layer = customerLayers[layerIndex];
    //     if (!layer) return;

    //     const newXPercent = clamp((d.x / rect.width) * 100, 0, 100 - toNumber(layer.width, 0));
    //     const newYPercent = clamp((d.y / rect.height) * 100, 0, 100 - toNumber(layer.height, 0));

    //     updateLayerLocalAndMaybeServer(layerIndex, { positionX: round2(newXPercent), positionY: round2(newYPercent) }, true);
    // };

    const handleDragStop = (printAreaId, layerIndex, d) => {
        const container = containerRefs.current[printAreaId];
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const layer = customerLayers[layerIndex];
        if (!layer) return;

        // Check if d.x and d.y are valid (not zero when they shouldn't be)
        let newXPercent, newYPercent;

        if (d.x === 0 && d.y === 0 && layer.positionX !== 0 && layer.positionY !== 0) {
            // Rnd bug - use current layer position
            console.warn("Rnd bug detected - using current position");
            newXPercent = layer.positionX;
            newYPercent = layer.positionY;
        } else {
            newXPercent = (d.x / rect.width) * 100;
            newYPercent = (d.y / rect.height) * 100;
        }

        // Agar border par hai to exact value lo
        if (Math.abs(newXPercent - 0) < 0.1 || Math.abs(newXPercent - (100 - layer.width)) < 0.1) {
            console.log("Border touch detected");
        }

        updateLayerLocalAndMaybeServer(layerIndex, {
            positionX: round2(newXPercent),
            positionY: round2(newYPercent)
        }, true);
    };

    // const handleDragStop = (printAreaId, layerIndex, d) => {
    //     const container = containerRefs.current[printAreaId];
    //     if (!container) return;
    //     const rect = container.getBoundingClientRect();
    //     const layer = customerLayers[layerIndex];
    //     if (!layer) return;

    //     // Clamping hatao - exact values save karo
    //     const newXPercent = (d.x / rect.width) * 100;
    //     const newYPercent = (d.y / rect.height) * 100;

    //      console.log("Drag Stop - Raw values:", {
    //     d_x: d.x,
    //     d_y: d.y,
    //     rect_width: rect.width,
    //     rect_height: rect.height,
    //     newXPercent,
    //     newYPercent,
    //     layerId: layer._id
    // });

    //     updateLayerLocalAndMaybeServer(layerIndex, {
    //         positionX: round2(newXPercent),
    //         positionY: round2(newYPercent)
    //     }, true);
    // };

    // resize stop -> compute width/height + pos percent, clamp, update local + server
    // const handleResizeStop = (printAreaId, layerIndex, ref, position) => {
    //     const container = containerRefs.current[printAreaId];
    //     if (!container) return;
    //     const rect = container.getBoundingClientRect();
    //     const widthPercent = clamp((parseFloat(ref.style.width) / rect.width) * 100, 5, 100);
    //     const heightPercent = clamp((parseFloat(ref.style.height) / rect.height) * 100, 5, 100);
    //     const posX = clamp((position.x / rect.width) * 100, 0, 100 - widthPercent);
    //     const posY = clamp((position.y / rect.height) * 100, 0, 100 - heightPercent);

    //     updateLayerLocalAndMaybeServer(layerIndex, {
    //         width: round2(widthPercent),
    //         height: round2(heightPercent),
    //         positionX: round2(posX),
    //         positionY: round2(posY)
    //     }, true);
    // };

    const handleResizeStop = (printAreaId, layerIndex, ref, position) => {
        const container = containerRefs.current[printAreaId];
        if (!container) return;
        const rect = container.getBoundingClientRect();

        // Clamping hatao
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

    // duplicate
    const handleDuplicateLayer = (index) => {
        const updated = layerHelpers.duplicateLayer(customerLayers, index);
        setCustomerLayers(updated.map(l => normalizeLayer(l)));
        setSelectedLayerIndex(updated.length - 1);
        setRenderKey(k => k + 1);
    };

    // toggle lock
    const handleToggleLock = (index) => {
        setCustomerLayers(prev => {
            const updated = layerHelpers.toggleLayerLock(prev, index);
            return updated;
        });
        setTimeout(() => setRenderKey(k => k + 1), 10);
    };

    // save design (first time or update whole)
    const handleSave = async () => {
        try {
            setSaving(true);
            // normalize all layers before saving
            const normalized = customerLayers.map(l => normalizeLayer(l));
            const res = await saveCustomerDesign({
                productId: product._id,
                mockupId: selectedMockup._id,
                layers: normalized
            });
            if (res.success) {
                setHasSavedDesign(true); // now subsequent changes call updateCustomerLayer
                // refresh from server (to get _id fields and canonical values)
                try {
                    const fresh = await getCustomerDesign(product._id, selectedMockup._id);
                    if (fresh.success && fresh.data) {
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
                toast.success("Design saved successfully!");
            } else {
                toast.error("Save failed");
            }
        } catch (e) {
            console.error("save error", e);
            toast.error("Save failed");
        } finally {
            setSaving(false);
        }
    };

    // align handlers - update locally + server
    // const handleAlignHorizontal = (align) => {
    //     if (selectedLayerIndex === null) return;
    //     const layer = customerLayers[selectedLayerIndex];
    //     if (!layer) return;

    //     let newX;
    //     if (align === 'left') newX = 0;
    //     else if (align === 'center') newX = 50 - (toNumber(layer.width, 30) / 2);
    //     else newX = 100 - toNumber(layer.width, 30);

    //     const safe = clamp(newX, 0, 100 - toNumber(layer.width, 30));
    //     updateLayerLocalAndMaybeServer(selectedLayerIndex, { positionX: round2(safe), horizontalAlign: align }, true);
    // };

    const handleAlignHorizontal = (align) => {
        if (selectedLayerIndex === null) return;
        const layer = customerLayers[selectedLayerIndex];
        if (!layer) return;

        let newX;
        if (align === 'left') newX = 0;
        else if (align === 'center') newX = 50 - (toNumber(layer.width, 30) / 2);
        else newX = 100 - toNumber(layer.width, 30);

        // Direct value bhejo - clamp mat karo
        updateLayerLocalAndMaybeServer(selectedLayerIndex, {
            positionX: round2(newX),
            horizontalAlign: align
        }, true);
    };

    // const handleAlignVertical = (align) => {
    //     if (selectedLayerIndex === null) return;
    //     const layer = customerLayers[selectedLayerIndex];
    //     if (!layer) return;

    //     let newY;
    //     if (align === 'top') newY = 0;
    //     else if (align === 'middle') newY = 50 - (toNumber(layer.height, 30) / 2);
    //     else newY = 100 - toNumber(layer.height, 30);

    //     const safe = clamp(newY, 0, 100 - toNumber(layer.height, 30));
    //     updateLayerLocalAndMaybeServer(selectedLayerIndex, { positionY: round2(safe), verticalAlign: align }, true);
    // };

    const handleAlignVertical = (align) => {
        if (selectedLayerIndex === null) return;
        const layer = customerLayers[selectedLayerIndex];
        if (!layer) return;

        let newY;
        if (align === 'top') newY = 0;
        else if (align === 'middle') newY = 50 - (toNumber(layer.height, 30) / 2);
        else newY = 100 - toNumber(layer.height, 30);

        // Direct value bhejo - clamp mat karo
        updateLayerLocalAndMaybeServer(selectedLayerIndex, {
            positionY: round2(newY),
            verticalAlign: align
        }, true);
    };

    // properties change from LayerProperties component
    const handleLayerPropertiesChange = (updates) => {
        if (selectedLayerIndex === null) return;
        updateLayerLocalAndMaybeServer(selectedLayerIndex, updates, true);
    };

    // upload handler from input or modal
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

    // modal image select
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

    // remove via top-right button
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
        <div className="min-h-screen bg-[#fcfcfc] py-8 px-4 md:px-8" style={{ fontFamily: fontStack }}>
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 text-sm mb-8 hover:text-[#f05a28] cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Back to Products
                </button>

                {/* hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && selectedPrintArea) handlePrintAreaImageUpload(selectedPrintArea, file);
                        e.target.value = '';
                    }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* canvas */}
                    <div className="lg:col-span-6">
                        <div style={{ marginTop: "185px" }} className="relative aspect-square bg-white border border-gray-100 overflow-hidden shadow-sm">
                            <img
                                src={selectedMockup?.mockupImage?.url || product?.thumbnail?.url || image}
                                alt={product?.productTitle}
                                className="w-full h-full object-cover absolute inset-0"
                            />

                            {startDesigning && adminLayers.map((printAreaLayer) => {
                                const areaLayers = customerLayers.filter(
                                    l => (l.printArea?._id || l.printArea) === printAreaLayer._id
                                );

                                return (
                                    <div
                                        key={printAreaLayer._id}
                                        ref={el => {
                                            if (el) {
                                                containerRefs.current[printAreaLayer._id] = el;
                                            }
                                        }}
                                        className="absolute"
                                        style={{
                                            left: `${printAreaLayer.x_percent || 20}%`,
                                            top: `${printAreaLayer.y_percent || 20}%`,
                                            width: `${printAreaLayer.width_percent || 30}%`,
                                            height: `${printAreaLayer.height_percent || 30}%`,
                                            border: "2px dashed #f05a28",
                                            overflow: "hidden"
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
                                                    // <Rnd
                                                    //     bounds="parent"
                                                    //     dragAxis="both"
                                                    //     key={`${layer._id || globalIndex}-${renderKey}`}
                                                    //     size={{ width: pixelValues.width, height: pixelValues.height }}
                                                    //     position={{ x: pixelValues.x, y: pixelValues.y }}
                                                    //     disableDragging={layer.locked}
                                                    //     enableResizing={!layer.locked}
                                                    //     onDragStart={() => handleDragStart(globalIndex)}
                                                    //     onDragStop={(e, d) => handleDragStop(printAreaLayer._id, globalIndex, d)}
                                                    //     onResizeStop={(e, dir, ref, delta, pos) =>
                                                    //         handleResizeStop(printAreaLayer._id, globalIndex, ref, pos)
                                                    //     }
                                                    //     onMouseDown={() => setSelectedLayerIndex(globalIndex)}
                                                    // >
                                                    <Rnd
                                                        dragAxis="both"
                                                        // bounds prop hata do
                                                        key={`${layer._id || globalIndex}-${renderKey}`}
                                                        size={{ width: pixelValues.width, height: pixelValues.height }}
                                                        position={{ x: pixelValues.x, y: pixelValues.y }}
                                                        disableDragging={layer.locked}
                                                        enableResizing={!layer.locked}
                                                        onDragStart={() => handleDragStart(globalIndex)}
                                                        onDrag={(e, d) => {
                                                            console.log("Dragging:", {
                                                                x: d.x,
                                                                y: d.y,
                                                                containerWidth: containerRefs.current[printAreaLayer._id]?.getBoundingClientRect().width,
                                                                percentageX: (d.x / containerRefs.current[printAreaLayer._id]?.getBoundingClientRect().width) * 100
                                                            });
                                                        }}
                                                        onDragStop={(e, d) => handleDragStop(printAreaLayer._id, globalIndex, d)}
                                                        onResizeStop={(e, dir, ref, delta, pos) =>
                                                            handleResizeStop(printAreaLayer._id, globalIndex, ref, pos)
                                                        }
                                                        onMouseDown={() => setSelectedLayerIndex(globalIndex)}
                                                    >
                                                        <div className={`relative group w-full h-full ${selectedLayerIndex === globalIndex ? 'ring-2 ring-blue-500 ring-inset' : ''}`}>
                                                            <img
                                                                src={layer.imageUrl}
                                                                alt=""
                                                                className="w-full h-full object-cover pointer-events-none"
                                                                style={{ transform: `rotate(${layer.rotation || 0}deg)`, opacity: layer.opacity ?? 1 }}
                                                            />
                                                            {selectedLayerIndex === globalIndex && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleRemoveLayer(globalIndex); }}
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
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

                            {/* {startDesigning && adminLayers.map(printAreaLayer => {
                                const areaLayers = customerLayers.filter(l => (l.printArea?._id || l.printArea) === printAreaLayer._id);

                                return (
                                    <div
                                        key={printAreaLayer._id}
                                        ref={el => containerRefs.current[printAreaLayer._id] = el}
                                        className="absolute"
                                        style={{
                                            left: `${printAreaLayer.x_percent || 20}%`,
                                            top: `${printAreaLayer.y_percent || 20}%`,
                                            width: `${printAreaLayer.width_percent || 30}%`,
                                            height: `${printAreaLayer.height_percent || 30}%`,
                                            border: "2px dashed #f05a28",
                                            overflow: "hidden"
                                        }}
                                    >
                                        {isLoadingDesign ? (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50">
                                                <Loader2 className="animate-spin text-[#f05a28]" size={40} />
                                            </div>
                                        ) : (
                                            areaLayers.map(layer => {
                                                const globalIndex = customerLayers.findIndex(l => (l._id ? String(l._id) : null) === (layer._id ? String(layer._id) : null));
                                                if (globalIndex === -1) return null;
                                                const pixel = getPixelValues(printAreaLayer._id, layer);
                                                return (
                                                    <Rnd
                                                        bounds="parent"
                                                        key={`${layer._id || globalIndex}-${renderKey}-${layer.positionX}-${layer.positionY}-${layer.width}-${layer.height}`}
                                                        ref={(el) => { if (el) rndRefs.current[`${printAreaLayer._id}-${globalIndex}`] = el; }}
                                                        size={{ width: pixel.width || 50, height: pixel.height || 50 }}
                                                        position={{ x: pixel.x || 0, y: pixel.y || 0 }}
                                                        disableDragging={layer.locked}
                                                        enableResizing={!layer.locked}
                                                        onDragStart={() => handleDragStart(globalIndex)}
                                                        onDragStop={(e, d) => handleDragStop(printAreaLayer._id, globalIndex, d)}
                                                        onResizeStop={(e, dir, ref, delta, pos) => handleResizeStop(printAreaLayer._id, globalIndex, ref, pos)}
                                                        onMouseDown={() => setSelectedLayerIndex(globalIndex)}
                                                    >
                                                        <div className={`relative group w-full h-full ${selectedLayerIndex === globalIndex ? 'ring-2 ring-blue-500 ring-inset' : ''}`}>
                                                            <img
                                                                src={layer.imageUrl}
                                                                alt=""
                                                                className="w-full h-full object-cover pointer-events-none"
                                                                style={{ transform: `rotate(${layer.rotation || 0}deg)`, opacity: layer.opacity ?? 1 }}
                                                            />
                                                            {selectedLayerIndex === globalIndex && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleRemoveLayer(globalIndex); }}
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
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
                            })} */}
                        </div>
                    </div>

                    {/* right panel */}
                    <div className="lg:col-span-6">
                        {!startDesigning ? (
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between">
                                        <h1 className="text-3xl font-black text-gray-900 leading-tight">{product?.productTitle || product?.title}</h1>
                                        <button onClick={() => setStartDesigning(true)} className="px-6 py-2 bg-[#f05a28] text-white font-bold text-sm rounded hover:opacity-90 transition cursor-pointer">
                                            Start Design
                                        </button>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">{product?.description || "No description available"}</p>
                                </div>
                                <div className="text-2xl font-black text-gray-900">${product?.Variants?.[0]?.basePrice || "0.00"}</div>

                                <div>
                                    <h4 className="text-[12px] font-black uppercase text-gray-400 mb-3">Available Colors</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map((c, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                <div className={`w-6 h-6 rounded-full ${c.class}`}></div>
                                                {c.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <button className="cursor-pointer mt-6 px-8 py-3 bg-[#146e3a] text-white font-bold text-sm rounded hover:opacity-90 transition mr-1.5">Product</button>
                                    <button onClick={() => setStartDesigning(true)} className="cursor-pointer mt-6 px-8 py-3 bg-[#f05a28] text-white font-bold text-sm rounded hover:opacity-90 transition">Design</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">Click on print areas to add images</h2>
                                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white text-sm rounded hover:opacity-90 transition disabled:opacity-50">
                                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                        {saving ? 'Saving...' : 'Save Design'}
                                    </button>
                                </div>

                                {/* Layers list */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold">Layers:</h3>
                                    </div>

                                    {customerLayers.map((layer, index) => (
                                        <div key={layer._id || index} className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${selectedLayerIndex === index ? 'border-blue-500 bg-blue-50' : ''}`} onClick={() => setSelectedLayerIndex(index)}>
                                            <div className="flex items-center gap-3">
                                                <img src={layer.imageUrl} className="w-10 h-10 object-cover rounded" alt="" />
                                                <span>Layer {index + 1} {layer.locked && '(Locked)'}</span>
                                            </div>

                                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => setSelectedLayerIndex(index)} className="cursor-pointer p-1 text-blue-500 hover:bg-blue-50 rounded" title="Edit"><Pencil size={16} /></button>
                                                <button onClick={() => handleDuplicateLayer(index)} className="cursor-pointer p-1 text-green-600 hover:bg-green-50 rounded" title="Duplicate"><Copy size={16} /></button>
                                                <button onClick={() => handleToggleLock(index)} className="cursor-pointer p-1 text-yellow-600 hover:bg-yellow-50 rounded" title={layer.locked ? "Unlock" : "Lock"}>{layer.locked ? <Unlock size={16} /> : <Lock size={16} />}</button>
                                                <button onClick={() => handleRemoveLayer(index)} className="cursor-pointer p-1 text-red-500 hover:bg-red-50 rounded" title="Delete"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}

                                </div>

                                {/* Layer properties */}
                                {selectedLayerIndex !== null && customerLayers[selectedLayerIndex] && (
                                    <div className="bg-white border rounded p-4 mt-4">
                                        <h3 className="font-bold mb-3">Properties</h3>
                                        <LayerProperties
                                            layer={customerLayers[selectedLayerIndex]}
                                            onChange={handleLayerPropertiesChange}
                                            onAlignHorizontal={handleAlignHorizontal}
                                            onAlignVertical={handleAlignVertical}
                                        />
                                    </div>
                                )}

                                <button onClick={() => {
                                    if (!adminLayers.length) { toast.info("No print area available"); return; }
                                    setOpenMockupModal(true);
                                }} className="cursor-pointer px-6 py-3 border border-gray-200 rounded hover:bg-gray-50 font-medium w-full flex justify-center items-center gap-2">
                                    <img width={20} height={20} src={IMG} alt="" />
                                    Add Image from Library
                                </button>

                                <div className="bg-white border p-6 rounded">
                                    <h3 className="font-bold mb-3">RelaiblePOD Need help?</h3>
                                    <p className="text-sm text-gray-600 mb-3">We have some further information on our website. You can access it by clicking on the links below.</p>
                                    <div className="flex gap-6 text-[#f05a28] text-sm font-medium">
                                        <button>Watch our help tutorial</button>
                                        <button>Email our support team</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddMockup
                open={openMockupModal}
                onClose={() => setOpenMockupModal(false)}
                productId={product?._id || productId}
                onImageSelect={handleImageFromModal}
            />

        </div>
    );
};

export default Editor;