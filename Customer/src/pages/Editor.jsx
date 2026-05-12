import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { X, Loader2, Copy, Lock, Unlock, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { getProductById } from "../api/category.api";
import { getLayersByProductId } from "../api/layer.api";
import LayerProperties from "../components/Admin/LayerProperties";
import ThreeWarpedImage from "../components/Admin/ThreePerspectiveImage";
import { ReactSortable } from "react-sortablejs";
import {
    uploadCustomerImage,
    saveCustomerDesign,
    getCustomerDesign,
    deleteCustomerLayer,
    updateCustomerLayer,
    updateDesignMockupImages,
    captureElementAsFile,
} from "../api/customerDesign.api";
import AddMockup from "../components/Admin/AddMockup";
import { Rnd } from "react-rnd";
import * as layerHelpers from "../components/Admin/utils/layerHelpers";
import { toast } from "react-toastify";
import ConfirmDesignModal from "../components/Admin/ConfirmDesignModal";
import {
    getCustomProductById,
    getCustomProductByUserId,
    updateCustomProduct,
} from "../api/customerProduct.api";
import { captureFinalDesign } from "../api/customerDesign.api";

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const toNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};
const round2 = (v) => Math.round((v + Number.EPSILON) * 100) / 100;

const MAX_LAYER_PERCENT = 300;

const normalizeLayer = (layer) => {
    const width = clamp(toNumber(layer.width, 100), 5, MAX_LAYER_PERCENT);
    const height = clamp(toNumber(layer.height, 100), 5, MAX_LAYER_PERCENT);
    const positionX = toNumber(layer.positionX, 0);
    const positionY = toNumber(layer.positionY, 0);

    return {
        ...layer,
        width: round2(width),
        height: round2(height),
        positionX: round2(positionX),
        positionY: round2(positionY),
        rotation: round2(toNumber(layer.rotation, 0)),
        opacity: clamp(round2(toNumber(layer.opacity, 1)), 0, 1),
    };
};

const getLayerAspectRatio = (layer) => {
    const w = Math.max(toNumber(layer?.width, 100), 1);
    const h = Math.max(toNumber(layer?.height, 100), 1);
    return w / h;
};

const recalcZIndexForMockup = (mockupId, layersArray) => {
    return layersArray.map((layer, idx) => ({
        ...layer,
        zIndex: idx + 1
    }));
};

const stripHtml = (html) => {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
};

const Editor = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const location = useLocation();
    const createNewFlag = location.state?.createNew;
    const customProductIdFromState = location.state?.customProductId;
    const selectedMockupFromState = location.state?.selectedMockup;
    const productFromState = location.state?.product;

    // â”€â”€â”€ States â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [product, setProduct] = useState(productFromState || null);
    const [loading, setLoading] = useState(!productFromState);
    const [startDesigning, setStartDesigning] = useState(false);
    const [openMockupModal, setOpenMockupModal] = useState(false);
    const [adminLayers, setAdminLayers] = useState([]); // print areas of current mockup
    const [alladminLayers, setAllAdminLayers] = useState([]); // all layers of current mockup (bg + pa)
    const [allproductMockupsAdminLayers, setAllProductMockupsAdminLayers] = useState({}); // full map
    const [customerLayers, setCustomerLayers] = useState([]);
    const [selectedMockup, setSelectedMockup] = useState(null); // full object
    const [allProductMockups, setAllProductMockups] = useState([]);
    const [selectedPrintArea, setSelectedPrintArea] = useState(null);
    const [saving, setSaving] = useState(false);
    const [selectedLayerIndex, setSelectedLayerIndex] = useState(null);
    const [isLoadingDesign, setIsLoadingDesign] = useState(false);
    const [hasSavedDesign, setHasSavedDesign] = useState(false);
    const [containersReady, setContainersReady] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [customerDesignId, setCustomerDesignId] = useState(null);
    const [existingCustomProduct, setExistingCustomProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCheckingExisting, setIsCheckingExisting] = useState(false);
    const [isPreviewActive, setIsPreviewActive] = useState(false);
    const [windowSize, setWindowSize] = useState(0);
    const [layersByMockup, setLayersByMockup] = useState({});
    const [containerSizes, setContainerSizes] = useState({});
    const [allMockupLayersReady, setAllMockupLayersReady] = useState(false);
    const currentLayers = selectedMockup?._id
        ? (layersByMockup[selectedMockup._id] || [])
        : [];

    const containerRefs = useRef({});
    const designContainerRef = useRef(null);
    const mockupImgRef = useRef(null);
    const [dragState, setDragState] = useState({
        index: null,
        tempX: 0,
        tempY: 0,
        tempWidth: 0,
        tempHeight: 0,
    });

    const sortableLayers = currentLayers.map((layer, idx) => ({
        ...layer,
        id: layer.clientKey || layer._id || `layer-${idx}`
    }));

    // â”€â”€â”€ Derived data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const activeProduct = existingCustomProduct?.baseProduct || product;
    const currentMockupIndex = allProductMockups.findIndex(m => m._id === selectedMockup?._id);

    const productColors =
        activeProduct?.Variants?.reduce((acc, variant) => {
            if (!variant.color || variant.color === "") return acc;
            const existingColor = acc.find((c) => c.name === variant.color);
            if (!existingColor) {
                acc.push({
                    name: variant.color,
                    hex: variant.colorHex || "#ffffff",
                    variants: [variant],
                });
            } else {
                existingColor.variants.push(variant);
            }
            return acc;
        }, []) || [];

    const productSizes =
        activeProduct?.Variants?.reduce((acc, variant) => {
            if (!variant.size || variant.size === "") return acc;
            if (!acc.includes(variant.size)) {
                acc.push(variant.size);
            }
            return acc;
        }, []) || [];

    const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
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

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // Effects
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

    // Keyboard
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Shift") setIsShiftPressed(true);
            if (
                selectedLayerIndex !== null &&
                currentLayers[selectedLayerIndex] &&
                !currentLayers[selectedLayerIndex].locked
            ) {
                const step = e.shiftKey ? 5 : 1;
                let dx = 0, dy = 0;
                if (e.key === "ArrowLeft") dx = -step;
                else if (e.key === "ArrowRight") dx = step;
                else if (e.key === "ArrowUp") dy = -step;
                else if (e.key === "ArrowDown") dy = step;
                if (dx !== 0 || dy !== 0) {
                    e.preventDefault();
                    const layer = currentLayers[selectedLayerIndex];
                    const newX = clamp(layer.positionX + dx, -50, 150);
                    const newY = clamp(layer.positionY + dy, -50, 150);
                    updateLayerLocalAndMaybeServer(selectedLayerIndex, {
                        positionX: round2(newX),
                        positionY: round2(newY),
                    }, true);
                }
            }
        };
        const handleKeyUp = (e) => { if (e.key === "Shift") setIsShiftPressed(false); };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [selectedLayerIndex, currentLayers]);

    // Check existing custom product
    useEffect(() => {

        // ðŸ”¥ Agar SingleProduct se specific customProductId aayi hai
        if (customProductIdFromState) {
            const loadSpecificCustomProduct = async () => {
                setIsCheckingExisting(true);
                try {
                    const res = await getCustomProductById(customProductIdFromState);
                    if (res.success && res.data) {
                        const cp = res.data;
                        setExistingCustomProduct(cp);
                        setIsEditing(true);
                        setCustomerLayers(cp.currentLayers || []);
                        setCustomerDesignId(cp.customerDesign?._id || cp.customerDesign);
                        if (selectedMockupFromState) {
                            setSelectedMockup(selectedMockupFromState);
                        }
                        // Agar chahte ho to seedha designing mode on kardo
                        // setStartDesigning(true);
                    }
                } catch (error) {
                    console.error("Error loading custom product:", error);
                    toast.error("Failed to load design");
                } finally {
                    setIsCheckingExisting(false);
                }
            };
            loadSpecificCustomProduct();
            return; // Baaki generic find skip karo
        }

        if (createNewFlag) {
            setExistingCustomProduct(null);
            setIsEditing(false);
            setIsCheckingExisting(false);
            return;
        }
        const checkExistingDesign = async () => {
            if (!productId || !selectedMockup?._id) return;
            try {
                setIsCheckingExisting(true);
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user?._id) return;
                const res = await getCustomProductByUserId(user._id);
                if (res.success && res.data) {
                    const existing = res.data.find(
                        (cp) => cp.baseProduct?._id === productId,
                    );
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
    }, [productId, selectedMockup, createNewFlag]);

    // Fetch product & mockups
    useEffect(() => {
        const fetchProduct = async () => {
            if (!product && productId) {
                try {
                    setLoading(true);
                    const res = await getProductById(productId);
                    setProduct(res);
                    if (res.mockupIds?.length > 0) {
                        setAllProductMockups(res.mockupIds.map(m => m));
                        const configMockup = res.mockupIds.find(m => m.name?.toLowerCase().startsWith("config"));
                        setSelectedMockup(configMockup || res.mockupIds[0]);
                    }
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
        const fetchAllMockupLayers = async () => {
            if (product?._id && allProductMockups.length > 0) {
                const allLayersMap = {};
                for (const mockup of allProductMockups) {
                    try {
                        const res = await getLayersByProductId(product._id, mockup._id);
                        if (res.data) {
                            allLayersMap[mockup._id] = {
                                all: res.data,
                                printAreas: res.data.filter(l => l.type === "printarea"),
                            };
                        }
                    } catch (e) {
                        console.error(`Layers for mockup ${mockup._id}:`, e);
                    }
                }
                setAllProductMockupsAdminLayers(allLayersMap);

                // ðŸ‘‡ Mark ready only if every mockup got some data (at least an empty array)
                const allIds = allProductMockups.map(m => m._id);
                const ready = allIds.every(id => allLayersMap[id] !== undefined);
                setAllMockupLayersReady(ready);
            }
        };
        fetchAllMockupLayers();
    }, [product?._id, allProductMockups]);

    // When selected mockup changes, load admin layers from map
    useEffect(() => {
        if (selectedMockup?._id && allproductMockupsAdminLayers[selectedMockup._id]) {
            const data = allproductMockupsAdminLayers[selectedMockup._id];
            setAdminLayers(data.printAreas);
            setAllAdminLayers(data.all);
        } else {
            setAdminLayers([]);
            setAllAdminLayers([]);
        }
    }, [selectedMockup, allproductMockupsAdminLayers]);

    // Customer design fetch (only if not preview active)
    useEffect(() => {

        if (createNewFlag) return;

        const fetchCustomerDesign = async () => {
            if (productId && selectedMockup?._id && !isPreviewActive) {
                setIsLoadingDesign(true);
                try {
                    const res = await getCustomerDesign(productId, selectedMockup._id);
                    if (res.success && res.data) {
                        const loadedLayers = (res.data.layers || []).map((layer) => ({
                            ...layer,
                            horizontalAlign: layer.horizontalAlign || "center",
                            verticalAlign: layer.verticalAlign || "middle",
                            positionX: Number(layer.positionX) || 0,
                            positionY: Number(layer.positionY) || 0,
                            width: Number(layer.width) || 100,
                            height: Number(layer.height) || 100,
                            rotation: Number(layer.rotation) || 0,
                            opacity: Number(layer.opacity) || 1,
                        }));
                        setCustomerLayers(loadedLayers);
                    }
                } catch (error) {
                    console.error("Error loading design:", error);
                } finally {
                    setIsLoadingDesign(false);
                }
            }
        };
        fetchCustomerDesign();
    }, [productId, selectedMockup, isPreviewActive, createNewFlag]);

    useEffect(() => {
        if (!startDesigning || adminLayers.length === 0) return;

        const measure = () => {
            const sizes = {};
            adminLayers.forEach(pa => {
                const el = containerRefs.current[pa._id];
                if (el) {
                    const rect = el.getBoundingClientRect();
                    sizes[pa._id] = { width: rect.width, height: rect.height };
                }
            });
            setContainerSizes(prev => ({ ...prev, ...sizes }));
        };

        // Delay to allow the browser to paint the new mockup
        const timeout = setTimeout(measure, 100);
        window.addEventListener('resize', measure);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', measure);
        };
    }, [startDesigning, adminLayers, windowSize]);

    useEffect(() => {
        const handleResize = () => setWindowSize((w) => w + 1);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // Helpers & Handlers
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•


    // Syncs a new layer to all other mockups of the same product
    const syncNewLayerToAllMockups = async (newLayer, sourcePrintArea) => {
        if (allProductMockups.length <= 1) return;
        if (!sourcePrintArea?.name) {
            console.warn("Cannot sync â€“ print area has no name");
            return;
        }
        const sourceName = sourcePrintArea.name;

        for (const mockup of allProductMockups) {
            if (mockup._id === selectedMockup._id) continue;
            const targetData = allproductMockupsAdminLayers[mockup._id];
            if (!targetData) continue;
            const targetPrintAreas = targetData.printAreas || [];
            const targetPA = targetPrintAreas.find(pa => pa.name === sourceName);
            if (!targetPA) {
                console.warn(`No matching print area "${sourceName}" on mockup ${mockup._id}`);
                continue;
            }

            // Clean manyek layer (remove temporary IDs)
            const { _id, clientKey, ...cleanLayer } = newLayer;
            const targetLayer = {
                ...cleanLayer,
                printArea: targetPA._id,
                corners: targetPA.corners || cleanLayer.corners || [],
            };

            // Fetch existing design for this mockup and append the layer
            try {
                const designRes = await getCustomerDesign(productId, mockup._id);
                const existingLayers = designRes.success && designRes.data?.layers
                    ? designRes.data.layers
                    : [];
                await saveCustomerDesign({
                    productId,
                    mockupId: mockup._id,
                    layers: [...existingLayers, targetLayer],
                });
            } catch (err) {
                console.error(`Failed to sync layer to mockup ${mockup._id}`, err);
            }
        }
        toast.success("Layer synced to all mockups");
    };

    const getPixelValues = (printAreaId, layer) => {
        const c = containerSizes[printAreaId] || { width: 300, height: 300 };
        const cw = c.width || 300;
        const ch = c.height || 300;
        const safe = normalizeLayer(layer);
        return {
            x: (safe.positionX / 100) * cw,
            y: (safe.positionY / 100) * ch,
            width: (safe.width / 100) * cw,
            height: (safe.height / 100) * ch,
            scaleFactor: cw / 100,
        };
    };

    const updateLayerLocalAndMaybeServer = (index, updates, callServer = true) => {
        setLayersByMockup(prev => {
            const mockupId = selectedMockup._id;
            const currentLayers = [...(prev[mockupId] || [])];
            const layer = currentLayers[index];
            if (!layer) return prev;

            const updatedLayer = { ...layer, ...updates };
            currentLayers[index] = updatedLayer;

            // Sync to server if the design is already saved
            if (callServer && updatedLayer._id) {
                updateCustomerLayer(updatedLayer._id, { ...updatedLayer }).catch(err =>
                    console.error("update layer failed", err)
                );
            }

            const newMap = { ...prev, [mockupId]: currentLayers };

            // Propagate to all other mockups that share the same masterKey
            const masterKey = layer.masterKey;
            if (masterKey) {
                Object.keys(newMap).forEach(mid => {
                    if (mid === mockupId) return;
                    const layers = newMap[mid];
                    if (!layers) return;
                    const targetIndex = layers.findIndex(l => l.masterKey === masterKey);
                    if (targetIndex !== -1) {
                        const targetLayer = layers[targetIndex];
                        // Merge updates but preserve the target's own printArea, clientKey, etc.
                        const updatedTarget = {
                            ...targetLayer,
                            ...updates,
                            masterKey: targetLayer.masterKey,
                            clientKey: targetLayer.clientKey,
                            printArea: targetLayer.printArea,
                            corners: targetLayer.corners,
                            enablePerspective: targetLayer.enablePerspective,
                            fit: targetLayer.fit,
                        };
                        newMap[mid] = [
                            ...layers.slice(0, targetIndex),
                            updatedTarget,
                            ...layers.slice(targetIndex + 1),
                        ];
                    }
                });
            }

            return newMap;
        });
    };

    const handleDragStart = (layerIndex) => setSelectedLayerIndex(layerIndex);

    const handleDragStop = (printAreaId, layerIndex, d) => {
        const container = containerRefs.current[printAreaId];
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const layer = currentLayers[layerIndex];
        if (!layer) return;
        let newXPercent = (d.x / rect.width) * 100;
        let newYPercent = (d.y / rect.height) * 100;
        updateLayerLocalAndMaybeServer(layerIndex, {
            positionX: round2(newXPercent),
            positionY: round2(newYPercent),
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
            positionY: round2(posY),
        }, true);
    };

    const handleToggleLock = (index) => {
        setLayersByMockup(prev => {
            const mockupId = selectedMockup._id;
            const layers = [...(prev[mockupId] || [])];
            if (layers[index]) {
                layers[index] = { ...layers[index], locked: !layers[index].locked };
            }
            return { ...prev, [mockupId]: layers };
        });
    };


    const handleAddTextLayer = () => {
        const defaultPrintArea = selectedPrintArea || adminLayers[0];
        if (!defaultPrintArea) {
            toast.error("No print area available");
            return;
        }

        // Measure the default text "New Text" with default font (Arial 30px)
        const defaultText = "New Text";
        const defaultFontSize = 30;
        const { width: textPxWidth, height: textPxHeight } = getTextPixelSize(
            defaultText,
            defaultFontSize,
            "Arial",
            "normal"
        );

        // Get print area container size (fallback to 500px if not measured yet)
        const containerRect = containerRefs.current[defaultPrintArea._id]?.getBoundingClientRect();
        const printAreaWidthPx = containerRect?.width || 500;
        const printAreaHeightPx = containerRect?.height || 500;

        // Convert pixel dimensions to percentages (clamped between 5% and 100%)
        let widthPercent = (textPxWidth / printAreaWidthPx) * 100;
        let heightPercent = (textPxHeight / printAreaHeightPx) * 100;
        widthPercent = Math.min(Math.max(widthPercent, 5), 100);
        heightPercent = Math.min(Math.max(heightPercent, 5), 100);

        const newLayer = {
            clientKey: crypto.randomUUID(),
            printArea: defaultPrintArea._id,
            type: "text",
            text: defaultText,
            fontSize: defaultFontSize,
            fontFamily: "Arial",
            fontWeight: "normal",
            fill: "#000000",
            positionX: 15,
            positionY: 15,
            width: round2(widthPercent),
            height: round2(heightPercent),
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            horizontalAlign: "center",
            verticalAlign: "middle",
            enablePerspective: false,
            align: "center",
            lineHeight: 1.2,
        };

        addLayerToAllMockups(newLayer, selectedMockup._id, defaultPrintArea);
    };
    // Get pixel dimensions of a text string using canvas
    const getTextPixelSize = (text, fontSize, fontFamily = "Arial", fontWeight = "normal") => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        const metrics = ctx.measureText(text);
        const width = metrics.width;
        // Approximate height: typical line height = fontSize * 1.2
        const height = fontSize * 1.2;
        return { width, height };
    };
    const handleImageFromModal = (image) => {
        const defaultPrintArea = selectedPrintArea || adminLayers[0];
        if (!defaultPrintArea) {
            toast.error("No print area found");
            return;
        }
        const fullPrintArea = adminLayers.find(pa => pa._id === defaultPrintArea._id);

        const newLayer = {
            clientKey: crypto.randomUUID(),
            printArea: defaultPrintArea._id,
            imageUrl: image.url,
            publicId: image.id || null,
            positionX: 0,
            positionY: 0,
            width: 100,
            height: 100,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            horizontalAlign: "center",
            verticalAlign: "middle",
            enablePerspective: fullPrintArea?.enablePerspective || false,
            corners: fullPrintArea?.enablePerspective && fullPrintArea.corners
                ? JSON.parse(JSON.stringify(fullPrintArea.corners))
                : undefined,
            fit: fullPrintArea?.fit || "cover",
        };

        addLayerToAllMockups(newLayer, selectedMockup._id, fullPrintArea);
        setOpenMockupModal(false);
    };

    const handleRemoveLayer = async (index) => {
        const layer = currentLayers[index];
        if (!layer) return;

        const masterKey = layer.masterKey;
        const currentMockupId = selectedMockup._id;

        // â”€â”€â”€ 1. Delete from server for all mockups that contain this masterKey â”€â”€â”€
        if (masterKey) {
            const deletePromises = [];
            for (const mockup of allProductMockups) {
                const mockupId = mockup._id;
                const mockupLayers = layersByMockup[mockupId] || [];
                const foundLayer = mockupLayers.find(l => l.masterKey === masterKey);
                if (foundLayer && foundLayer._id) {
                    deletePromises.push(
                        deleteCustomerLayer(foundLayer._id).catch(e =>
                            console.error(`Failed to delete layer in mockup ${mockupId}:`, e)
                        )
                    );
                }
            }
            await Promise.all(deletePromises);
        } else {
            // No masterKey -> just delete the single layer from the current mockup
            if (layer._id) {
                try {
                    await deleteCustomerLayer(layer._id);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        // â”€â”€â”€ 2. Remove layer from local state for all mockups that have this masterKey â”€â”€â”€
        setLayersByMockup(prev => {
            const newMap = { ...prev };
            if (masterKey) {
                for (const mockup of allProductMockups) {
                    const mockupId = mockup._id;
                    if (newMap[mockupId]) {
                        newMap[mockupId] = newMap[mockupId].filter(l => l.masterKey !== masterKey);
                    }
                }
            } else {
                const currentLayersList = [...(newMap[currentMockupId] || [])];
                currentLayersList.splice(index, 1);
                newMap[currentMockupId] = currentLayersList;
            }
            return newMap;
        });

        // â”€â”€â”€ 3. Clear selection if the deleted layer was selected â”€â”€â”€
        if (selectedLayerIndex === index || (masterKey && selectedLayerIndex !== null)) {
            setSelectedLayerIndex(null);
        }
    };

    const handleDuplicateLayer = (index) => {
        const layer = currentLayers[index];
        if (!layer) return;
        const { _id, clientKey, ...rest } = layer;
        const duplicate = {
            ...rest,
            clientKey: crypto.randomUUID(),
            positionX: (layer.positionX || 0) + 5,
            positionY: (layer.positionY || 0) + 5,
            zIndex: (Math.max(...currentLayers.map(l => l.zIndex || 0), 0) + 1),
        };
        setLayersByMockup(prev => {
            const mockupId = selectedMockup._id;
            return {
                ...prev,
                [mockupId]: [...(prev[mockupId] || []), duplicate],
            };
        });
        setSelectedLayerIndex(currentLayers.length); // points to new duplicate
    };

    const handleAlignHorizontal = (align) => {
        if (selectedLayerIndex === null) return;
        const layer = currentLayers[selectedLayerIndex];
        if (!layer) return;
        let newX;
        if (align === "left") newX = 0;
        else if (align === "center") newX = 50 - toNumber(layer.width, 100) / 2;
        else newX = 100 - toNumber(layer.width, 100);
        updateLayerLocalAndMaybeServer(
            selectedLayerIndex,
            { positionX: round2(newX), horizontalAlign: align },
            true,
        );
    };

    const handleAlignVertical = (align) => {
        if (selectedLayerIndex === null) return;
        const layer = currentLayers[selectedLayerIndex];
        if (!layer) return;
        let newY;
        if (align === "top") newY = 0;
        else if (align === "middle") newY = 50 - toNumber(layer.height, 100) / 2;
        else newY = 100 - toNumber(layer.height, 100);
        updateLayerLocalAndMaybeServer(
            selectedLayerIndex,
            { positionY: round2(newY), verticalAlign: align },
            true,
        );
    };
    const handleLayerPropertiesChange = (updates) => {
        if (selectedLayerIndex === null) return;
        updateLayerLocalAndMaybeServer(selectedLayerIndex, updates, true);
    };

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // Mockup Navigation & Preview
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

    const mapLayersToMockup = (layers, sourceMockupId, targetMockupId) => {
        const sourceData = allproductMockupsAdminLayers[sourceMockupId];
        const targetData = allproductMockupsAdminLayers[targetMockupId];

        if (!sourceData) {
            console.error(`No admin data for source mockup ${sourceMockupId}`);
            return [];
        }
        if (!targetData) {
            console.error(`No admin data for target mockup ${targetMockupId}`);
            return [];
        }

        const sourcePrintAreas = sourceData.printAreas || [];
        const targetPrintAreas = targetData.printAreas || [];

        console.log(`Mapping from ${sourceMockupId} (${sourcePrintAreas.length} PAs) to ${targetMockupId} (${targetPrintAreas.length} PAs)`);

        const mapped = layers
            .map((layer) => {
                const sourcePA = sourcePrintAreas.find(pa => pa._id === (layer.printArea?._id || layer.printArea));
                if (!sourcePA) {
                    console.warn(`Layer print area not found in source:`, layer.printArea);
                    return null;
                }
                const targetPA = targetPrintAreas.find(pa => pa.name === sourcePA.name);
                if (!targetPA) {
                    console.warn(`No matching print area named "${sourcePA.name}" in target mockup ${targetMockupId}`);
                    return null;
                }

                // --- Scale size proportionally ---
                const scaleX = targetPA.width / sourcePA.width;
                const scaleY = targetPA.height / sourcePA.height;
                let newWidth = layer.width * scaleX;
                let newHeight = layer.height * scaleY;

                newWidth = Math.min(Math.max(newWidth, 5), MAX_LAYER_PERCENT);
                newHeight = Math.min(Math.max(newHeight, 5), MAX_LAYER_PERCENT);

                // --- Position using alignment ---
                const hAlign = layer.horizontalAlign || 'center';
                const vAlign = layer.verticalAlign || 'middle';
                let newX, newY;

                if (hAlign === 'left') newX = 0;
                else if (hAlign === 'right') newX = 100 - newWidth;
                else newX = 50 - newWidth / 2;

                if (vAlign === 'top') newY = 0;
                else if (vAlign === 'bottom') newY = 100 - newHeight;
                else newY = 50 - newHeight / 2;

                newX = Math.min(Math.max(newX, -50), 150);
                newY = Math.min(Math.max(newY, -50), 150);

                const masterKey = layer.masterKey || `${targetMockupId}-${layer.clientKey || layer._id}`;
                const mappedLayer = {
                    ...layer,
                    _id: undefined,
                    clientKey: `${targetMockupId}-${layer.clientKey || layer._id}`,
                    masterKey,
                    printArea: targetPA._id,
                    positionX: round2(newX),
                    positionY: round2(newY),
                    width: round2(newWidth),
                    height: round2(newHeight),
                    enablePerspective: targetPA.enablePerspective || false,
                    corners: targetPA.corners ? JSON.parse(JSON.stringify(targetPA.corners)) : layer.corners,
                };
                return normalizeLayer(mappedLayer);
            })
            .filter(Boolean);

        console.log(`Mapped ${mapped.length} out of ${layers.length} layers to ${targetMockupId}`);
        return mapped;
    };

    // Swap two layers in the given mockup's array
    const swapLayersInMockup = (mockupId, fromIndex, toIndex) => {
        setLayersByMockup(prev => {
            const layers = [...(prev[mockupId] || [])];
            if (fromIndex < 0 || toIndex < 0 || fromIndex >= layers.length || toIndex >= layers.length) return prev;
            [layers[fromIndex], layers[toIndex]] = [layers[toIndex], layers[fromIndex]];
            return { ...prev, [mockupId]: layers };
        });
    };

    const moveLayer = (direction) => {
        if (selectedLayerIndex === null) return;

        const newIndex = direction === 'up'
            ? selectedLayerIndex - 1
            : selectedLayerIndex + 1;

        if (newIndex < 0 || newIndex >= currentLayers.length) return;

        const mockupId = selectedMockup._id;

        setLayersByMockup(prev => {
            const currentLayersList = [...(prev[mockupId] || [])];

            // Swap layers
            [currentLayersList[selectedLayerIndex], currentLayersList[newIndex]] =
                [currentLayersList[newIndex], currentLayersList[selectedLayerIndex]];

            // Recalculate zIndex based on new order
            const reorderedWithZIndex = currentLayersList.map((layer, idx) => ({
                ...layer,
                zIndex: idx + 1
            }));

            // Update current mockup
            const updated = { ...prev, [mockupId]: reorderedWithZIndex };

            // Propagate to other mockups using masterKey
            const layerA = currentLayers[selectedLayerIndex];
            const layerB = currentLayers[newIndex];

            if (layerA?.masterKey && layerB?.masterKey) {
                Object.keys(updated).forEach(otherId => {
                    if (otherId === mockupId) return;
                    const otherLayers = updated[otherId] || [];

                    const indexA = otherLayers.findIndex(l => l.masterKey === layerA.masterKey);
                    const indexB = otherLayers.findIndex(l => l.masterKey === layerB.masterKey);

                    if (indexA !== -1 && indexB !== -1) {
                        const swappedOther = [...otherLayers];
                        [swappedOther[indexA], swappedOther[indexB]] =
                            [swappedOther[indexB], swappedOther[indexA]];

                        updated[otherId] = swappedOther.map((l, idx) => ({
                            ...l,
                            zIndex: idx + 1
                        }));
                    }
                });
            }

            return updated;
        });

        // Update selected layer index
        setSelectedLayerIndex(newIndex);
    };

    const handleSwitchMockup = (targetMockup) => {
        setSelectedLayerIndex(null);

        // If we already have layers for this mockup (from previous saves), just switch
        if (layersByMockup[targetMockup._id]) {
            setSelectedMockup(targetMockup);
            return;
        }

        // Otherwise, map the current design (from the current mockup) to the target
        const sourceMockupId = selectedMockup._id;
        const sourceLayers = currentLayers; // layers of the currently active mockup

        if (sourceLayers.length === 0) {
            setSelectedMockup(targetMockup);
            return;
        }

        const mapped = mapLayersToMockup(sourceLayers, sourceMockupId, targetMockup._id, true);
        setLayersByMockup(prev => ({
            ...prev,
            [targetMockup._id]: mapped,
        }));
        setSelectedMockup(targetMockup);
    };

    const handleNextMockup = () => {
        if (currentMockupIndex < allProductMockups.length - 1) {
            handleSwitchMockup(allProductMockups[currentMockupIndex + 1]);
        }
    };

    const handlePrevMockup = () => {
        if (currentMockupIndex > 0) {
            handleSwitchMockup(allProductMockups[currentMockupIndex - 1]);
        }
    };

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // Save & Next (Multiple Mockup Capture)
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

    const handleSave = async () => {
        try {
            setSelectedLayerIndex(null);
            setSaving(true);
            const normalized = currentLayers.map((l) => normalizeLayer(l));
            let res;
            let designId = null;
            if (isEditing && existingCustomProduct?._id && !createNewFlag) {
                const payload = {
                    productId,
                    mockupId: selectedMockup._id,
                    layers: normalized,
                    customVariant: existingCustomProduct.customVariant || {
                        enabled: true,
                        name: "",
                        description: "",
                        tags: [],
                    },
                    selectedDefaultVariants:
                        existingCustomProduct.selectedDefaultVariants || [],
                };
                res = await updateCustomProduct(existingCustomProduct._id, payload);
                if (res.success) {
                    designId = existingCustomProduct._id;
                    setShowConfirmModal(false);
                    toast.success("Design updated successfully!");
                }
            } else {
                res = await saveCustomerDesign({
                    productId,
                    mockupId: selectedMockup._id,
                    layers: normalized,
                    forceNew: true,
                });
                if (res.success) {
                    designId = res.data?._id;
                    setCustomerDesignId(designId);
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
                        const loaded = (fresh.data.layers || []).map((l) =>
                            normalizeLayer({
                                ...l,
                                horizontalAlign: l.horizontalAlign || "center",
                                verticalAlign: l.verticalAlign || "middle",
                            }),
                        );
                        setLayersByMockup(prev => ({ ...prev, [selectedMockup._id]: loaded }));

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
                    currentLayers,
                    adminLayers,
                    customerDesignId: savedDesignId,
                    isEditing: isEditing && !createNewFlag,
                    existingCustomProduct: (isEditing && !createNewFlag) ? existingCustomProduct : null,
                    createNewFlag: createNewFlag,
                },
            });
        }
    };

    const isConfigMockup = (mockup) => {
        if (!mockup?.name) return false;
        return mockup.name.toLowerCase().startsWith("config");
    };
    const cropImageToRect = (file, rect) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = rect.width;
                canvas.height = rect.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
                canvas.toBlob((blob) => {
                    if (!blob) return reject(new Error('Canvas to Blob failed'));
                    const croppedFile = new File([blob], file.name, { type: file.type });
                    resolve(croppedFile);
                }, file.type);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    };

    const captureThumbnailsForAllMockupsExceptConfig = async (configMockup) => {
        const uploadedImages = [];
        const waitForImages = () => {
            const images = designContainerRef.current?.querySelectorAll('img');
            if (!images?.length) return Promise.resolve();
            const loaders = Array.from(images).map(img =>
                img.complete ? Promise.resolve() : new Promise(resolve => { img.onload = resolve; img.onerror = resolve; })
            );
            return Promise.all(loaders);
        };

        for (const mockup of allProductMockups) {
            if (mockup._id === configMockup._id) continue;

            // Switch mockup and update admin layers
            const data = allproductMockupsAdminLayers[mockup._id];
            if (data) {
                setAdminLayers(data.printAreas);
                setAllAdminLayers(data.all);
            }
            setSelectedMockup(mockup);
            await new Promise(r => setTimeout(r, 300));

            const imgEl = mockupImgRef.current;
            if (imgEl && !imgEl.complete) {
                await new Promise(resolve => { imgEl.onload = resolve; imgEl.onerror = resolve; });
            }

            // Measure containers (force reflow)
            const measureContainers = () => {
                const sizes = {};
                data?.printAreas.forEach(pa => {
                    const el = containerRefs.current[pa._id];
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        sizes[pa._id] = { width: rect.width, height: rect.height };
                    }
                });
                setContainerSizes(prev => ({ ...prev, ...sizes }));
            };
            measureContainers();

            await new Promise(r => setTimeout(r, 500));
            await waitForImages();
            await new Promise(r => setTimeout(r, 300));

            const imageFile = await captureFinalDesign(designContainerRef);
            if (imageFile) {
                const uploadRes = await uploadCustomerImage(imageFile);
                if (uploadRes.success) {
                    uploadedImages.push({
                        mockupId: mockup._id,
                        imageUrl: uploadRes.data.imageUrl,
                        publicId: uploadRes.data.publicId,
                    });
                }
            }
        }
        return uploadedImages;
    };

    const waitForCanvasReady = async (container, maxFrames = 20) => {
        if (!container) return;
        let frame = 0;
        return new Promise((resolve) => {
            const check = () => {
                const canvases = container.querySelectorAll('canvas');
                let allDrawn = true;
                for (const canvas of canvases) {
                    if (canvas.width === 0 || canvas.height === 0) {
                        allDrawn = false;
                        break;
                    }
                    try {
                        const ctx = canvas.getContext('2d');
                        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        // Ensure at least one nonâ€‘transparent pixel exists (optional)
                        // const hasContent = imgData.data.some(ch => ch !== 0);
                        // if (!hasContent) allDrawn = false;
                    } catch (e) {
                        allDrawn = false;
                    }
                }
                if (allDrawn || frame >= maxFrames) {
                    resolve();
                } else {
                    frame++;
                    requestAnimationFrame(check);
                }
            };
            requestAnimationFrame(check);
        });
    };

    const handleNext = async () => {
        try {
            setSaving(true);
            setSelectedLayerIndex(null);

            // --- 1. Identify config mockup ---
            const configMockup = allProductMockups.find(m => m.name?.toLowerCase().startsWith("config"));
            if (!configMockup) {
                toast.error("No config mockup found.");
                return;
            }

            // --- 2. Capture each print area of the config mockup as an image ---
            const configPrintAreas = allproductMockupsAdminLayers[configMockup._id]?.printAreas || [];
            if (!configPrintAreas.length) {
                toast.error("Config mockup has no print areas.");
                return;
            }

            const capturedImages = {};
            for (const pa of configPrintAreas) {
                const containerEl = containerRefs.current[pa._id];
                if (!containerEl) continue;

                // Capture ONLY the content inside the print area (excluding the mockup background)
                // Set transparent=true so that the mockup image behind remains visible on other mockups
                const imageFile = await captureElementAsFile(containerEl, true);
                if (!imageFile) {
                    toast.error(`Failed to capture print area "${pa.name}"`);
                    continue;
                }

                const uploadRes = await uploadCustomerImage(imageFile);
                if (uploadRes.success) {
                    capturedImages[pa.name] = {
                        url: uploadRes.data.imageUrl,
                        publicId: uploadRes.data.publicId,
                    };
                }
            }

            if (Object.keys(capturedImages).length === 0) {
                toast.error("No print areas could be captured.");
                return;
            }

            // --- 3. For every OTHER mockup, apply the captured image as a single layer (100% width/height) ---
            const allSavedDesigns = {};
            let masterDesignId = null;

            for (const mockup of allProductMockups) {
                if (mockup._id === configMockup._id) {
                    // Skip saving the config mockup design record as per request
                    continue;
                }

                // For nonâ€‘config mockups: create a single image layer per matching print area
                const targetData = allproductMockupsAdminLayers[mockup._id];
                if (!targetData) continue;

                const targetPrintAreas = targetData.printAreas || [];
                const newLayers = [];

                for (const capturedName in capturedImages) {
                    const targetPA = targetPrintAreas.find(pa => pa.name === capturedName);
                    if (!targetPA) {
                        console.warn(`No matching print area "${capturedName}" on mockup ${mockup._id}`);
                        continue;
                    }

                    newLayers.push({
                        clientKey: crypto.randomUUID(),
                        printArea: targetPA._id,
                        type: "image",
                        imageUrl: capturedImages[capturedName].url,
                        publicId: capturedImages[capturedName].publicId,
                        positionX: 0,     // 0% left
                        positionY: 0,     // 0% top
                        width: 100,       // 100% width of print area
                        height: 100,      // 100% height
                        rotation: 0,
                        opacity: 1,
                        visible: true,
                        locked: false,
                        enablePerspective: targetPA.enablePerspective || false,
                        corners: targetPA.corners ? JSON.parse(JSON.stringify(targetPA.corners)) : undefined,
                        fit: targetPA.fit || "cover",
                        horizontalAlign: "center",
                        verticalAlign: "middle",
                        zIndex: 1,
                    });
                }

                if (newLayers.length === 0) {
                    console.warn(`No layers created for mockup ${mockup._id}`);
                    continue;
                }

                // Save the design (overwrites any previous layers)
                const res = await saveCustomerDesign({
                    productId,
                    mockupId: mockup._id,
                    layers: newLayers.map(l => normalizeLayer(l)),
                    forceNew: createNewFlag,
                });

                if (res?.success && res.data?._id) {
                    allSavedDesigns[mockup._id] = res.data._id;
                    if (!masterDesignId) masterDesignId = res.data._id;
                    // Update local state
                    setLayersByMockup(prev => ({ ...prev, [mockup._id]: newLayers }));
                } else {
                    throw new Error(`Failed to save design for mockup ${mockup._id}`);
                }
            }

            // --- 4. Generate thumbnails for ALL mockups (including config) ---
            const uploadedImages = [];
            const waitForImages = () => {
                const images = designContainerRef.current?.querySelectorAll('img');
                if (!images?.length) return Promise.resolve();
                const loaders = Array.from(images).map(img =>
                    img.complete ? Promise.resolve() : new Promise(resolve => { img.onload = resolve; img.onerror = resolve; })
                );
                return Promise.all(loaders);
            };


            for (const mockup of allProductMockups) {
                if (mockup._id === configMockup._id) continue;

                // Switch mockup in UI to ensure correct rendering
                const data = allproductMockupsAdminLayers[mockup._id];
                if (data) {
                    setAdminLayers(data.printAreas);
                    setAllAdminLayers(data.all);
                }
                setSelectedMockup(mockup);
                await new Promise(r => setTimeout(r, 300));

                const imgEl = mockupImgRef.current;
                if (imgEl && !imgEl.complete) {
                    await new Promise(resolve => { imgEl.onload = resolve; imgEl.onerror = resolve; });
                }

                // Force container size recalc
                const sizes = {};
                data?.printAreas.forEach(pa => {
                    const el = containerRefs.current[pa._id];
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        sizes[pa._id] = { width: rect.width, height: rect.height };
                    }
                });
                setContainerSizes(prev => ({ ...prev, ...sizes }));

                await new Promise(r => setTimeout(r, 100));
                await waitForImages();
                await waitForCanvasReady(designContainerRef.current);

                await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));


                const imageFile = await captureFinalDesign(designContainerRef);
                if (imageFile) {
                    const uploadRes = await uploadCustomerImage(imageFile);
                    if (uploadRes.success) {
                        uploadedImages.push({
                            mockupId: mockup._id,
                            imageUrl: uploadRes.data.imageUrl,
                            publicId: uploadRes.data.publicId,
                        });
                    }
                }
            }

            if (uploadedImages.length > 0 && masterDesignId) {
                await updateDesignMockupImages(masterDesignId, uploadedImages);
            }

            toast.success(`Design applied to ${allProductMockups.length - 1} mockups!`);
            setShowConfirmModal(false);

            // Navigate to next screen
            navigate(`/user/design-variants/${productId}/${masterDesignId}`, {
                state: {
                    product,
                    selectedMockup: configMockup,
                    currentLayers: layersByMockup[configMockup._id] || [],
                    adminLayers,
                    customerDesignId: masterDesignId,
                    isEditing,
                    existingCustomProduct: isEditing ? existingCustomProduct : null,
                    allSavedDesigns,
                    forceRefresh: true,
                },
            });
        } catch (error) {
            console.error("Error in handleNext:", error);
            toast.error("Something went wrong: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleReorder = (newOrderedLayers) => {
        const mockupId = selectedMockup._id;

        setLayersByMockup(prev => {
            const currentMockupLayers = prev[mockupId] || [];

            // Map new order to actual layer data with updated zIndex
            const reorderedLayers = newOrderedLayers.map((newLayer, idx) => {
                const layerKey = newLayer.clientKey || newLayer._id;
                const existingLayer = currentMockupLayers.find(
                    l => (l.clientKey || l._id) === layerKey
                );
                return {
                    ...(existingLayer || newLayer),
                    zIndex: idx + 1  // âœ… Consistent zIndex assignment
                };
            });

            const updated = { ...prev, [mockupId]: reorderedLayers };

            // Propagate masterKey order to other mockups
            const masterKeyOrder = reorderedLayers
                .map(l => l.masterKey)
                .filter(k => k);

            if (masterKeyOrder.length > 0) {
                Object.keys(updated).forEach(otherId => {
                    if (otherId === mockupId) return;
                    const otherLayers = updated[otherId] || [];

                    const sorted = [...otherLayers].sort((a, b) => {
                        const aIdx = masterKeyOrder.indexOf(a.masterKey);
                        const bIdx = masterKeyOrder.indexOf(b.masterKey);
                        if (aIdx === -1 && bIdx === -1) return 0;
                        if (aIdx === -1) return 1;
                        if (bIdx === -1) return -1;
                        return aIdx - bIdx;
                    });

                    updated[otherId] = sorted.map((l, i) => ({ ...l, zIndex: i + 1 }));
                });
            }

            return updated;
        });

        // Update selected layer index
        if (selectedLayerIndex !== null) {
            const selectedKey = currentLayers[selectedLayerIndex]?.clientKey ||
                currentLayers[selectedLayerIndex]?._id;
            if (selectedKey) {
                const newIndex = newOrderedLayers.findIndex(
                    l => (l.clientKey || l._id) === selectedKey
                );
                if (newIndex !== -1) {
                    setSelectedLayerIndex(newIndex);
                }
            }
        }
    };

    const handleOpenModal = () => setShowConfirmModal(true);

    const addLayerToAllMockups = (newLayer, sourceMockupId, sourcePrintArea) => {
        const masterKey = crypto.randomUUID(); // â† shared identifier
        const updatedMap = { ...layersByMockup };

        // Source mockup
        const sourceLayers = updatedMap[sourceMockupId] || [];
        const maxZ = Math.max(...sourceLayers.map(l => l.zIndex || 0), 0);
        updatedMap[sourceMockupId] = [
            ...sourceLayers,
            { ...newLayer, zIndex: maxZ + 1, masterKey },
        ];

        // Every other mockup
        allProductMockups.forEach(mockup => {
            if (mockup._id === sourceMockupId) return;
            const targetData = allproductMockupsAdminLayers[mockup._id];
            if (!targetData || !targetData.printAreas) {
                console.warn(`Skipping mockup ${mockup._id} â€“ no admin layers loaded`);
                return;
            }
            const targetPA = targetData.printAreas.find(
                pa => pa.name === sourcePrintArea?.name
            );
            if (!targetPA) return;

            const { _id, clientKey, ...cleanLayer } = newLayer;
            const mappedLayer = {
                ...cleanLayer,
                masterKey,                 // â† shared key
                clientKey: crypto.randomUUID(),
                printArea: targetPA._id,
                enablePerspective: targetPA.enablePerspective || cleanLayer.enablePerspective || false,
                corners: targetPA.corners || cleanLayer.corners || [],
                zIndex: (updatedMap[mockup._id]?.length || 0) + 1,
            };
            updatedMap[mockup._id] = [
                ...(updatedMap[mockup._id] || []),
                normalizeLayer(mappedLayer),
            ];
        });

        setLayersByMockup(updatedMap);
    };
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // Render
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] py-6 px-4 md:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate(-1)} className="text-sm font-medium text-gray-500 hover:text-[#f05a28]">
                        Back to Products
                    </button>
                    {startDesigning && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleOpenModal}
                                disabled={saving || isCheckingExisting}
                                className={`px-5 py-2 text-white text-sm font-semibold transition disabled:opacity-50 cursor-pointer ${isEditing ? "bg-blue-600 hover:bg-blue-700" : "bg-[#f05a28] hover:bg-[#d94d24]"}`}
                            >
                                {saving ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update & Next" : "Save & Next")}
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Main Canvas */}
                    <div className="lg:col-span-8">
                        <div className="relative bg-white shadow-xl border border-gray-200 overflow-hidden">
                            <div
                                onClick={() => setSelectedLayerIndex(null)}
                                ref={designContainerRef}
                                className="aspect-square relative"
                            >
                                <img
                                    ref={mockupImgRef}
                                    src={selectedMockup?.mockupImage?.url || product?.thumbnail?.url || "https://placehold.co/600x600?text=No+Image"}
                                    alt={product?.productTitle}
                                    className="w-full h-full object-cover"
                                />

                                {/* Admin overlay images */}
                                {alladminLayers
                                    .filter(layer => layer.type === "image" && layer.visible !== false)
                                    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                                    .map(imageLayer => (
                                        <div
                                            key={imageLayer._id}
                                            className="absolute pointer-events-none"
                                            style={{
                                                left: `${imageLayer.x_percent || 0}%`,
                                                top: `${imageLayer.y_percent || 0}%`,
                                                width: `${imageLayer.width_percent || 100}%`,
                                                height: `${imageLayer.height_percent || 100}%`,
                                                transform: `rotate(${imageLayer.rotation || 0}deg)`,
                                                opacity: imageLayer.opacity ?? 1,
                                                zIndex: 5,
                                            }}
                                        >
                                            <img
                                                src={imageLayer.src}
                                                alt=""
                                                className="w-full h-full object-contain"
                                                style={{ transform: `scaleX(${imageLayer.flipX ? -1 : 1}) scaleY(${imageLayer.flipY ? -1 : 1})` }}
                                            />
                                        </div>
                                    ))}

                                {/* Print Areas & Customer Layers */}
                                {startDesigning && adminLayers.map(printAreaLayer => {
                                    const areaLayers = currentLayers.filter(
                                        l => (l.printArea?._id || l.printArea) === printAreaLayer._id
                                    );
                                    return (
                                        <div
                                            key={printAreaLayer._id}
                                            ref={el => { if (el) containerRefs.current[printAreaLayer._id] = el; }}
                                            className={`absolute print-area-border ${saving ? 'border-none' : 'border-2 border-dashed border-[#f05a28] bg-white/10'}`}
                                            style={{
                                                left: `${printAreaLayer.x_percent || 20}%`,
                                                top: `${printAreaLayer.y_percent || 20}%`,
                                                width: `${printAreaLayer.width_percent || 30}%`,
                                                height: `${printAreaLayer.height_percent || 30}%`,
                                                overflow: "hidden",
                                                boxShadow: saving ? "none" : "0 8px 24px rgba(0,0,0,0.08)",
                                            }}
                                        >
                                            {isLoadingDesign ? (
                                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50">
                                                    <Loader2 className="animate-spin text-[#f05a28]" size={40} />
                                                </div>
                                            ) : (
                                                areaLayers.map(layer => {
                                                    // const globalIndex = currentLayers.findIndex(
                                                    //     l => (l._id ? String(l._id) : null) === (layer._id ? String(layer._id) : null)
                                                    // );
                                                    const globalIndex = currentLayers.findIndex(l => {
                                                        if (layer.clientKey && l.clientKey) {
                                                            return l.clientKey === layer.clientKey;
                                                        }
                                                        if (layer._id && l._id) {
                                                            return String(l._id) === String(layer._id);
                                                        }
                                                        return false;
                                                    });
                                                    if (globalIndex === -1) return null;
                                                    const pixelValues = getPixelValues(printAreaLayer._id, layer);
                                                    return (
                                                        <Rnd
                                                            key={`${selectedMockup?._id || 'mockup'}-${layer.clientKey || layer._id || globalIndex}`}
                                                            size={{ width: pixelValues.width, height: pixelValues.height }}
                                                            position={{ x: pixelValues.x, y: pixelValues.y }}
                                                            disableDragging={globalIndex !== selectedLayerIndex || layer.locked}
                                                            enableResizing={globalIndex === selectedLayerIndex && !layer.locked}
                                                            lockAspectRatio={isShiftPressed ? getLayerAspectRatio(layer) : false}
                                                            onDragStart={() => handleDragStart(globalIndex)}
                                                            onDrag={(e, d) => {
                                                                if (globalIndex === selectedLayerIndex && !layer.locked) {
                                                                    const container = containerRefs.current[printAreaLayer._id];
                                                                    if (!container) return;
                                                                    const rect = container.getBoundingClientRect();
                                                                    const newXPercent = (d.x / rect.width) * 100;
                                                                    const newYPercent = (d.y / rect.height) * 100;
                                                                    setDragState({
                                                                        index: globalIndex,
                                                                        tempX: newXPercent,
                                                                        tempY: newYPercent,
                                                                        tempWidth: layer.width,
                                                                        tempHeight: layer.height,
                                                                    });
                                                                }
                                                            }}
                                                            onDragStop={(e, d) => {
                                                                setDragState({ index: null, tempX: 0, tempY: 0, tempWidth: 0, tempHeight: 0 });
                                                                handleDragStop(printAreaLayer._id, globalIndex, d);
                                                            }}
                                                            onResize={(e, dir, ref, delta, pos) => {
                                                                if (globalIndex === selectedLayerIndex && !layer.locked) {
                                                                    const container = containerRefs.current[printAreaLayer._id];
                                                                    if (!container) return;
                                                                    const rect = container.getBoundingClientRect();
                                                                    const newWidthPercent = (parseFloat(ref.style.width) / rect.width) * 100;
                                                                    const newHeightPercent = (parseFloat(ref.style.height) / rect.height) * 100;
                                                                    const newXPercent = (pos.x / rect.width) * 100;
                                                                    const newYPercent = (pos.y / rect.height) * 100;
                                                                    setDragState({
                                                                        index: globalIndex,
                                                                        tempX: newXPercent,
                                                                        tempY: newYPercent,
                                                                        tempWidth: newWidthPercent,
                                                                        tempHeight: newHeightPercent,
                                                                    });
                                                                }
                                                            }}
                                                            onResizeStop={(e, dir, ref, delta, pos) => {
                                                                setDragState({ index: null, tempX: 0, tempY: 0, tempWidth: 0, tempHeight: 0 });
                                                                handleResizeStop(printAreaLayer._id, globalIndex, ref, pos);
                                                            }}
                                                            scale={1}
                                                            style={{
                                                                zIndex: layer.zIndex || 1,
                                                                pointerEvents: globalIndex === selectedLayerIndex ? 'auto' : 'none',
                                                            }}
                                                        >
                                                            <div
                                                                onClick={(e) => e.stopPropagation()}
                                                                className={`relative group w-full h-full ${layer.type === "text" ? "overflow-visible" : "overflow-hidden"} ${selectedLayerIndex === globalIndex ? " ring-inset" : ""
                                                                    }`}
                                                                style={{ opacity: layer.opacity ?? 1 }}
                                                            >
                                                                {layer.type === "text" ? (
                                                                    <div className="w-full h-full flex items-center justify-center pointer-events-auto"
                                                                        style={{
                                                                            transform: `rotate(${layer.rotation || 0}deg)`,
                                                                            color: layer.fill || "#000000",
                                                                            fontSize: `${layer.fontSize || 24}px`,
                                                                            fontFamily: layer.fontFamily || "Arial",
                                                                            fontWeight: layer.fontWeight || "normal",
                                                                            fontStyle: layer.fontStyle || "normal",
                                                                            textAlign: layer.align || "center",
                                                                            lineHeight: layer.lineHeight || 1.2,
                                                                            whiteSpace: "pre-wrap",
                                                                            wordBreak: "break-word",
                                                                            textDecoration: layer.textDecoration || "none",
                                                                            letterSpacing: `${layer.letterSpacing || 0}px`,
                                                                        }}
                                                                    >
                                                                        {layer.text || "Your Text"}
                                                                    </div>
                                                                ) : layer.enablePerspective && layer.corners ? (
                                                                    (() => {
                                                                        const printArea = adminLayers.find(pa => pa._id === (layer.printArea?._id || layer.printArea));
                                                                        const adminWidth = printArea?.width || 500;
                                                                        const adminHeight = printArea?.height || 500;

                                                                        // Container dimensions (full print area on screen)
                                                                        const CW = pixelValues.width / (layer.width / 100);
                                                                        const CH = pixelValues.height / (layer.height / 100);

                                                                        // Layer offset relative to print area top-left in screen pixels
                                                                        const LX = (layer.positionX / 100) * CW;
                                                                        const LY = (layer.positionY / 100) * CH;

                                                                        // Normalized coordinates (0-1) of the layer corners within the print area
                                                                        const u0 = (layer.positionX || 0) / 100;
                                                                        const v0 = (layer.positionY || 0) / 100;
                                                                        const u1 = ((layer.positionX || 0) + (layer.width || 100)) / 100;
                                                                        const v1 = ((layer.positionY || 0) + (layer.height || 100)) / 100;

                                                                        // Print area corners in normalized (0-1) admin space
                                                                        const c = layer.corners.map(pt => ({
                                                                            x: pt.x / adminWidth,
                                                                            y: pt.y / adminHeight
                                                                        }));

                                                                        const lerp = (a, b, t) => a + (b - a) * t;
                                                                        const bilinear = (u, v) => ({
                                                                            x: lerp(lerp(c[0].x, c[1].x, u), lerp(c[3].x, c[2].x, u), v),
                                                                            y: lerp(lerp(c[0].y, c[1].y, u), lerp(c[3].y, c[2].y, u), v)
                                                                        });

                                                                        // Calculate warped corners of the specific layer, relative to its own top-left
                                                                        const scaledCorners = [
                                                                            bilinear(u0, v0), // TL
                                                                            bilinear(u1, v0), // TR
                                                                            bilinear(u1, v1), // BR
                                                                            bilinear(u0, v1)  // BL
                                                                        ].map(p => ({
                                                                            x: p.x * CW - LX,
                                                                            y: p.y * CH - LY
                                                                        }));

                                                                        return (
                                                                            <div style={{ width: "100%", height: "100%", position: "relative" }}>
                                                                                <ThreeWarpedImage
                                                                                    key={`${layer._id || layer.clientKey}-${pixelValues.width}x${pixelValues.height}-${JSON.stringify(scaledCorners)}`}
                                                                                    src={layer.imageUrl}
                                                                                    corners={scaledCorners}
                                                                                    width={pixelValues.width}
                                                                                    height={pixelValues.height}
                                                                                    fit={layer.fit || "cover"}
                                                                                    opacity={layer.opacity ?? 1}
                                                                                />
                                                                            </div>
                                                                        );
                                                                    })()
                                                                ) : (
                                                                    <img
                                                                        src={layer?.imageUrl}
                                                                        alt=""
                                                                        className="w-full h-full object-cover pointer-events-none"
                                                                        style={{ transform: `rotate(${layer.rotation || 0}deg)` }}
                                                                    />
                                                                )}
                                                                {selectedLayerIndex === globalIndex && (
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleRemoveLayer(globalIndex); }}
                                                                        className="absolute -top-0 -right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 z-10 cursor-pointer shadow-lg rounded-bl-md"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </Rnd>


                                                    );
                                                })


                                            )}

                                            {(() => {
                                                const selectedLayer = selectedLayerIndex !== null ? currentLayers[selectedLayerIndex] : null;
                                                if (!selectedLayer) return null;
                                                const belongsToThisPA = (selectedLayer.printArea?._id || selectedLayer.printArea) === printAreaLayer._id;
                                                if (!belongsToThisPA) return null;

                                                // Use temporary drag/resize values if this layer is being dragged/resized
                                                const isDraggingOrResizing = dragState.index === selectedLayerIndex;
                                                const tempX = isDraggingOrResizing ? dragState.tempX : selectedLayer.positionX;
                                                const tempY = isDraggingOrResizing ? dragState.tempY : selectedLayer.positionY;
                                                const tempWidth = isDraggingOrResizing ? dragState.tempWidth : selectedLayer.width;
                                                const tempHeight = isDraggingOrResizing ? dragState.tempHeight : selectedLayer.height;

                                                const container = containerRefs.current[printAreaLayer._id];
                                                if (!container) return null;
                                                const rect = container.getBoundingClientRect();

                                                const boxX = (tempX / 100) * rect.width;
                                                const boxY = (tempY / 100) * rect.height;
                                                const boxWidth = (tempWidth / 100) * rect.width;
                                                const boxHeight = (tempHeight / 100) * rect.height;

                                                return (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            left: boxX,
                                                            top: boxY,
                                                            width: boxWidth,
                                                            height: boxHeight,
                                                            border: '2px solid #3b82f6',
                                                            pointerEvents: 'none',
                                                            zIndex: 99999,
                                                            boxSizing: 'border-box',
                                                            transition: 'none', // ensure no lag
                                                        }}
                                                    />
                                                );
                                            })()}
                                        </div>
                                    );
                                })}

                                {/* Navigation Arrows - Hidden as per request */}
                                {false && allProductMockups.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePrevMockup}
                                            disabled={currentMockupIndex === 0}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-20 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            <ChevronLeft size={22} />
                                        </button>
                                        <button
                                            onClick={handleNextMockup}
                                            disabled={currentMockupIndex === allProductMockups.length - 1}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-20 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            <ChevronRight size={22} />
                                        </button>
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-20">
                                            {currentMockupIndex + 1} / {allProductMockups.length}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-6 self-start">
                        <div className="bg-white border border-gray-200 shadow-xl overflow-hidden">
                            <div className="p-4 border-b border-gray-200 flex justify-between">
                                <h3 className="text-[15px] font-black text-gray-900">
                                    Design Studio
                                </h3>

                                <div
                                    style={{ display: startDesigning ? "none" : "block" }}
                                    onClick={() => {
                                        if (!allMockupLayersReady) {
                                            toast.info("Loading mockup data, please wait...");
                                            return;
                                        }
                                        setStartDesigning(true);
                                    }}
                                    className={`px-4 py-3 text-white font-bold text-sm transition cursor-pointer rounded-md
            ${allMockupLayersReady ? 'bg-[#f05a28] hover:opacity-90' : 'bg-gray-400 cursor-not-allowed'}`}
                                >
                                    {allMockupLayersReady ? 'Start Designing' : 'Loading mockupsâ€¦'}
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                {!startDesigning ? (
                                    // Product Info View
                                    <>
                                        <div className="bg-gray-50 border border-gray-200 p-4">
                                            <h1 className="text-xl font-black text-gray-900 leading-snug truncate">
                                                {product?.productTitle || product?.title}
                                            </h1>
                                            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                                {stripHtml(product?.description) ||
                                                    "No description available"}
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

                                        {/* Mockup Thumbnails - Hidden as per request */}
                                        {false && allProductMockups.length > 1 && (
                                            <div className="border border-gray-200 p-4">
                                                <h4 className="text-[11px] font-black uppercase text-gray-400 mb-3">
                                                    Mockups ({allProductMockups.length})
                                                </h4>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {allProductMockups.map((mockup, idx) => (
                                                        <div
                                                            key={mockup._id}
                                                            onClick={() => {
                                                                setSelectedMockup(mockup);
                                                                setStartDesigning(true);
                                                            }}
                                                            className={`cursor-pointer border-2 p-1 rounded transition ${selectedMockup?._id === mockup._id
                                                                ? "border-[#f05a28] bg-orange-50"
                                                                : "border-gray-200 hover:border-gray-400"
                                                                }`}
                                                        >
                                                            <img
                                                                src={mockup?.mockupImage?.url || "https://placehold.co/600x600?text=No+Image"}
                                                                alt={mockup?.name || `Mockup ${idx + 1}`}
                                                                className="w-full aspect-square object-cover rounded"
                                                            />
                                                            <p className="text-[10px] text-gray-600 mt-1 truncate text-center">
                                                                {mockup?.name || `View ${idx + 1}`}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="border border-gray-200 p-4">

                                            {
                                                displayColors.length > 0 && (
                                                    <>
                                                        <h4 className="text-[11px] font-black uppercase text-gray-400 mb-3">
                                                            Available Colors ({displayColors.length})
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                                            {displayColors.map((c, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-2 py-2"
                                                                >
                                                                    <div
                                                                        className="w-5 h-5 rounded border border-gray-200"
                                                                        style={{ backgroundColor: c.hex }}
                                                                    ></div>
                                                                    <span className="truncate capitalize">
                                                                        {c.name}
                                                                    </span>
                                                                </div>
                                                            ))}

                                                        </div>
                                                    </>
                                                )
                                            }


                                            {
                                                displaySizes.length > 0 && (
                                                    <>
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

                                                        </div>
                                                    </>
                                                )
                                            }


                                        </div>
                                    </>
                                ) : (
                                    // Design Editor View
                                    <>
                                        {/* Mockup Switcher Thumbnails - Hidden as per request */}
                                        {false && allProductMockups.length > 1 && (
                                            <div className="border border-gray-200 bg-white p-3">
                                                <h4 className="text-[11px] font-black uppercase text-gray-400 mb-2">
                                                    Mockups
                                                </h4>
                                                <div className="flex gap-2 overflow-x-auto pb-1">
                                                    {allProductMockups.map((mockup, idx) => (
                                                        <div
                                                            key={mockup._id}
                                                            onClick={() => handleSwitchMockup(mockup, true)}
                                                            className={`cursor-pointer border-2 rounded flex-shrink-0 w-14 h-14 overflow-hidden transition ${selectedMockup?._id === mockup._id
                                                                ? "border-[#f05a28]"
                                                                : "border-gray-200 hover:border-gray-400"
                                                                }`}
                                                        >
                                                            <img
                                                                src={mockup?.mockupImage?.url || "https://placehold.co/600x600?text=No+Image"}
                                                                alt={mockup?.name || `Mockup ${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Layers Panel */}
                                        {/* // Replace your existing layers panel div with this: */}
                                        {/* Layers Panel - Complete Working Version */}
                                        <div className="border border-gray-200 bg-white p-3">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm font-semibold text-gray-800">
                                                    Layers{" "}
                                                    <span className="text-xs text-gray-400">
                                                        ({currentLayers.length})
                                                    </span>
                                                </h3>
                                            </div>

                                            <ReactSortable
                                                list={currentLayers.map(layer => ({
                                                    ...layer,
                                                    id: layer.clientKey || layer._id || `temp-${Math.random()}`
                                                }))}
                                                setList={(newList) => {
                                                    const reordered = newList.map(({ id, ...rest }) => rest);
                                                    handleReorder(reordered);
                                                }}
                                                animation={200}
                                                ghostClass="sortable-ghost"
                                                dragClass="sortable-drag"
                                                handle=".drag-handle"
                                                direction="vertical"
                                                className="space-y-2"
                                            >
                                                {currentLayers.map((layer, index) => {
                                                    const isSelected = selectedLayerIndex === index;
                                                    return (
                                                        <div
                                                            key={layer.clientKey || layer._id || index}
                                                            onClick={() => setSelectedLayerIndex(index)}
                                                            className={`group flex items-center justify-between p-2 border transition-all cursor-pointer ${isSelected
                                                                ? "border-[#f05a28] bg-[#fff7f3]"
                                                                : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                {/* Drag Handle */}
                                                                <div
                                                                    className="drag-handle cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors"
                                                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                                                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                                                >
                                                                    <svg
                                                                        className="w-4 h-4 text-gray-500"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={2}
                                                                    >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                                                    </svg>
                                                                </div>

                                                                {/* Thumbnail */}
                                                                <div className="w-10 h-10 overflow-hidden bg-gray-100 flex-shrink-0 rounded">
                                                                    {layer.type === "text" ? (
                                                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xs font-bold">
                                                                            T
                                                                        </div>
                                                                    ) : (
                                                                        <img
                                                                            src={layer?.imageUrl}
                                                                            alt=""
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    )}
                                                                </div>

                                                                {/* Layer Info */}
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="text-sm font-medium text-gray-800 truncate">
                                                                        {layer.type === "text" ? "Text Layer" : `Layer ${index + 1}`}
                                                                    </div>
                                                                    <div className="text-[11px] text-gray-500">
                                                                        {Math.round(layer.width || 0)}% Ã— {Math.round(layer.height || 0)}%
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        moveLayer('up');
                                                                    }}
                                                                    className="cursor-pointer p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 transition rounded"
                                                                    title="Move up"
                                                                >
                                                                    â†‘
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        moveLayer('down');
                                                                    }}
                                                                    className="cursor-pointer p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 transition rounded"
                                                                    title="Move down"
                                                                >
                                                                    â†“
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDuplicateLayer(index);
                                                                    }}
                                                                    className="cursor-pointer p-1.5 text-green-600 hover:bg-green-50 transition rounded"
                                                                    title="Duplicate"
                                                                >
                                                                    <Copy size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleToggleLock(index);
                                                                    }}
                                                                    className="cursor-pointer p-1.5 text-amber-600 hover:bg-amber-50 transition rounded"
                                                                    title={layer.locked ? "Unlock" : "Lock"}
                                                                >
                                                                    {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRemoveLayer(index);
                                                                    }}
                                                                    className="cursor-pointer p-1.5 text-red-600 hover:bg-red-50 transition rounded"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </ReactSortable>

                                            {currentLayers.length === 0 && (
                                                <div className="text-center py-6 text-gray-400 text-sm">
                                                    No layers added yet
                                                </div>
                                            )}
                                        </div>

                                        {/* Layer Properties */}
                                        {selectedLayerIndex !== null &&
                                            currentLayers[selectedLayerIndex] && (
                                                <div className="border border-gray-200 bg-white p-3">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="text-sm font-semibold text-gray-800">
                                                            Properties
                                                        </h3>
                                                        <span className="text-[11px] text-gray-400">
                                                            Selected Layer
                                                        </span>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <LayerProperties
                                                            layer={currentLayers[selectedLayerIndex]}
                                                            onChange={handleLayerPropertiesChange}
                                                            onAlignHorizontal={handleAlignHorizontal}
                                                            onAlignVertical={handleAlignVertical}
                                                        />
                                                        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                                            {currentLayers[selectedLayerIndex]?.type === "text" && (
                                                                <button
                                                                    onClick={() => {
                                                                        const layer = currentLayers[selectedLayerIndex];
                                                                        if (!layer) return;
                                                                        const printAreaId = layer.printArea?._id || layer.printArea;
                                                                        const containerRect = containerRefs.current[printAreaId]?.getBoundingClientRect();
                                                                        if (!containerRect) {
                                                                            toast.info("Cannot auto-size â€“ print area not ready");
                                                                            return;
                                                                        }
                                                                        const { width: textPxWidth, height: textPxHeight } = getTextPixelSize(
                                                                            layer.text || "Text",
                                                                            layer.fontSize || 24,
                                                                            layer.fontFamily || "Arial",
                                                                            layer.fontWeight || "normal"
                                                                        );
                                                                        let newWidth = (textPxWidth / containerRect.width) * 100;
                                                                        let newHeight = (textPxHeight / containerRect.height) * 100;
                                                                        newWidth = Math.min(Math.max(newWidth, 5), 100);
                                                                        newHeight = Math.min(Math.max(newHeight, 5), 100);
                                                                        handleLayerPropertiesChange({
                                                                            width: round2(newWidth),
                                                                            height: round2(newHeight),
                                                                        });
                                                                    }}
                                                                    className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 border text-sm font-medium hover:bg-gray-50 cursor-pointer"
                                                                >
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v16h16" /><path d="M8 20h8" /><path d="M20 12v4" /></svg>
                                                                    Autoâ€‘size
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    handleDuplicateLayer(selectedLayerIndex)
                                                                }
                                                                className="flex items-center justify-center gap-2 px-3 py-2 border text-sm font-medium hover:bg-gray-50 cursor-pointer"
                                                            >
                                                                <Copy size={14} /> Duplicate
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleToggleLock(selectedLayerIndex)
                                                                }
                                                                className="flex items-center justify-center gap-2 px-3 py-2 border text-sm font-medium hover:bg-gray-50 cursor-pointer"
                                                            >
                                                                {currentLayers[selectedLayerIndex]?.locked ? (
                                                                    <Unlock size={14} />
                                                                ) : (
                                                                    <Lock size={14} />
                                                                )}
                                                                {currentLayers[selectedLayerIndex]?.locked
                                                                    ? "Unlock"
                                                                    : "Lock"}
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleRemoveLayer(selectedLayerIndex)
                                                                }
                                                                className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white text-sm font-semibold hover:bg-red-600 cursor-pointer"
                                                            >
                                                                <Trash2 size={14} /> Delete Layer
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        {/* Add Buttons */}
                                        <button
                                            onClick={() => {
                                                if (!adminLayers.length) {
                                                    toast.info("No print area available");
                                                    return;
                                                }
                                                setOpenMockupModal(true);
                                            }}
                                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 font-medium hover:border-[#f05a28] hover:text-[#f05a28] transition-colors cursor-pointer rounded"
                                        >
                                            Add Image from Library
                                        </button>
                                        <button
                                            onClick={handleAddTextLayer}
                                            disabled={!adminLayers.length}
                                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 font-medium hover:border-[#f05a28] hover:text-[#f05a28] transition-colors cursor-pointer rounded disabled:opacity-50"
                                        >
                                            Add Text
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