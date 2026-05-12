import { toPng, toJpeg } from "html-to-image";
import { toast } from "react-toastify";
import {
  updateLayers,
} from "../../../api/layers.api";

// ================= CANVAS SIZE =================
export const getCanvasSize = (layers) => {
  const bgLayer = layers?.find(l => l.type === "background") || { _naturalWidth: 1500, _naturalHeight: 1500 };

  if (bgLayer && bgLayer._naturalWidth && bgLayer._naturalHeight) {
    const originalWidth = bgLayer._naturalWidth;
    const originalHeight = bgLayer._naturalHeight;

    const maxViewportWidth = window.innerWidth * 0.6;
    const maxViewportHeight = window.innerHeight * 0.8;

    const widthRatio = maxViewportWidth / originalWidth;
    const heightRatio = maxViewportHeight / originalHeight;
    const displayScale = Math.min(widthRatio, heightRatio, 1);

    return {
      displayWidth: Math.floor(originalWidth * displayScale),
      displayHeight: Math.floor(originalHeight * displayScale),
      originalWidth: originalWidth,
      originalHeight: originalHeight,
      scaleFactor: displayScale
    };
  }

  return {
    displayWidth: 800,
    displayHeight: 800,
    originalWidth: 800,
    originalHeight: 800,
    scaleFactor: 1
  };
};

// ================= LAYER OPERATIONS =================
export const updateLayer = (id, updates, layers, setLayersWithHistory) => {
  setLayersWithHistory((prev) =>
    prev.map((layer) => {
      if (layer.id !== id) return layer;
      let updatedLayer = { ...layer, ...updates };

      if (layer.type === "text") {
        if (updates.text !== undefined && updates.name === undefined) {
          updatedLayer.name = updates.text;
        } else if (updates.name !== undefined && updates.text === undefined) {
          updatedLayer.text = updates.name;
        }
      }

      if ((updates.width !== undefined && updates.width !== layer.width) ||
        (updates.height !== undefined && updates.height !== layer.height)) {
        const newWidth = updates.width !== undefined ? updates.width : layer.width;
        const newHeight = updates.height !== undefined ? updates.height : layer.height;
        updatedLayer.corners = [
          { x: 0, y: 0 },
          { x: newWidth, y: 0 },
          { x: newWidth, y: newHeight },
          { x: 0, y: newHeight }
        ];
      }
      return updatedLayer;
    })
  );
};

export const removeLayer = (id, layers, setLayersWithHistory, setSelectedLayerId, selectedLayerId) => {
  const layer = layers.find((l) => l.id === id);
  if (layer) {
    if (layer.src && layer.src.startsWith("blob:")) {
      try { URL.revokeObjectURL(layer.src); } catch (e) { }
    }
    if (layer.imageSrc && layer.imageSrc.startsWith("blob:")) {
      try { URL.revokeObjectURL(layer.imageSrc); } catch (e) { }
    }
  }
  setLayersWithHistory((prev) => prev.filter((l) => l.id !== id));
  if (selectedLayerId === id) setSelectedLayerId(null);
};

export const duplicateLayer = (selectedLayerId, layers, setLayersWithHistory, setSelectedLayerId) => {
  if (!selectedLayerId) return;
  const layerToCopy = layers.find((l) => l.id === selectedLayerId);
  if (!layerToCopy) return;

  const duplicatedLayer = {
    ...JSON.parse(JSON.stringify(layerToCopy)),
    id: `layer-${Date.now()}`,
    x: layerToCopy.x + 20,
    y: layerToCopy.y + 20,
  };

  setLayersWithHistory((prev) => [...prev, duplicatedLayer]);
  setSelectedLayerId(duplicatedLayer.id);
};

export const toggleLayerVisibility = (id, setLayersWithHistory) => {
  setLayersWithHistory((prev) =>
    prev.map((layer) =>
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    )
  );
};

export const bringForward = (id, setLayersWithHistory) => {
  setLayersWithHistory((prev) => {
    const idx = prev.findIndex((l) => l.id === id);
    if (idx === -1 || idx === prev.length - 1) return prev;
    const copy = [...prev];
    const [item] = copy.splice(idx, 1);
    copy.splice(idx + 1, 0, item);
    return copy;
  });
};

export const sendBackward = (id, setLayersWithHistory) => {
  setLayersWithHistory((prev) => {
    const idx = prev.findIndex((l) => l.id === id);
    if (idx <= 0) return prev;
    const copy = [...prev];
    const [item] = copy.splice(idx, 1);
    copy.splice(idx - 1, 0, item);
    return copy;
  });
};

export const toggleLockSelected = (selectedLayer, updateLayer) => {
  if (!selectedLayer) return;
  updateLayer(selectedLayer.id, { locked: !selectedLayer.locked });
};

export const toggleLockById = (id, setLayersWithHistory) => {
  setLayersWithHistory((prev) => prev.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)));
};

// ================= TEXT LAYER =================
export const addNewTextLayer = (setLayersWithHistory, setSelectedLayerId, getCanvasSize) => {
  const canvasSize = getCanvasSize();
  const originalWidth = canvasSize.originalWidth;
  const originalHeight = canvasSize.originalHeight;

  const defaultText = "New Text";
  const newLayer = {
    id: `layer-${Date.now()}`,
    type: "text",
    text: defaultText,
    name: defaultText,
    x: originalWidth * 0.1,
    y: originalHeight * 0.1,
    width: 200,
    height: 60,
    rotation: 0,
    fontSize: 22,
    color: "#ffffff",
    opacity: 1,
    visible: true,
    locked: false,
  };
  setLayersWithHistory((prev) => [...prev, newLayer]);
  setSelectedLayerId(newLayer.id);
};

// ================= IMAGE LAYER =================
export const addImageLayerFromFile = (file, setLayersWithHistory, setSelectedLayerId, getCanvasSize, fileInputRef) => {
  if (!file) return;

  const url = URL.createObjectURL(file);
  const img = new Image();

  img.onload = function () {
    const naturalWidth = this.naturalWidth;
    const naturalHeight = this.naturalHeight;
    const canvasSize = getCanvasSize();
    const originalWidth = canvasSize.originalWidth;
    const originalHeight = canvasSize.originalHeight;

    let finalWidth = naturalWidth;
    let finalHeight = naturalHeight;

    if (naturalWidth > originalWidth || naturalHeight > originalHeight) {
      const widthRatio = originalWidth / naturalWidth;
      const heightRatio = originalHeight / naturalHeight;
      const scaleRatio = Math.min(widthRatio, heightRatio);
      finalWidth = Math.floor(naturalWidth * scaleRatio);
      finalHeight = Math.floor(naturalHeight * scaleRatio);
    }

    const minSize = Math.min(originalWidth, originalHeight) * 0.15;
    if (finalWidth < minSize || finalHeight < minSize) {
      const scaleUp = minSize / Math.min(finalWidth, finalHeight);
      finalWidth = Math.floor(finalWidth * scaleUp);
      finalHeight = Math.floor(finalHeight * scaleUp);
    }

    const x = Math.max(0, (originalWidth - finalWidth) / 2);
    const y = Math.max(0, (originalHeight - finalHeight) / 2);

    const newLayer = {
      id: `layer-${Date.now()}`,
      type: "image",
      src: url,
      name: file.name || "Image Layer",
      x: x,
      y: y,
      width: finalWidth,
      height: finalHeight,
      _naturalWidth: naturalWidth,
      _naturalHeight: naturalHeight,
      rotation: 0,
      opacity: 1,
      visible: true,
      fit: "contain",
      locked: false,
      perspective: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      skewX: 0,
      skewY: 0,
      transformOrigin: "center center",
      enablePerspective: false,
      corners: [
        { x: 0, y: 0 },
        { x: finalWidth, y: 0 },
        { x: finalWidth, y: finalHeight },
        { x: 0, y: finalHeight }
      ]
    };

    setLayersWithHistory((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  img.src = url;
};

export const handleFileInputChange = (e, addImageLayerFromFile, fileInputRef) => {
  const file = e.target.files && e.target.files[0];
  if (file) {
    addImageLayerFromFile(file);
  }
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

export const addImageLayerButton = (fileInputRef) => {
  if (fileInputRef.current) fileInputRef.current.click();
};

// ================= PRINT AREA =================
export const addPrintAreaToCanvas = (printArea, layers, setLayersWithHistory, setSelectedLayerId, getCanvasSize) => {
  const canvasSize = getCanvasSize();
  const originalWidth = canvasSize.originalWidth;
  const originalHeight = canvasSize.originalHeight;

  let finalWidth = printArea.width;
  let finalHeight = printArea.height;

  const maxWidth = originalWidth * 0.8;
  const maxHeight = originalHeight * 0.8;

  if (finalWidth > maxWidth || finalHeight > maxHeight) {
    const widthRatio = maxWidth / finalWidth;
    const heightRatio = maxHeight / finalHeight;
    const scaleRatio = Math.min(widthRatio, heightRatio);
    finalWidth = Math.floor(finalWidth * scaleRatio);
    finalHeight = Math.floor(finalHeight * scaleRatio);
  }

  const x = Math.max(0, (originalWidth - finalWidth) / 2);
  const y = Math.max(0, (originalHeight - finalHeight) / 2);

  const newLayer = {
    id: `printarea-${Date.now()}`,
    type: "printarea",
    name: printArea.displayName || "",
    x: x,
    y: y,
    width: finalWidth,
    height: finalHeight,
    _naturalHeight: printArea.height,
    _naturalWidth: printArea.width,
    rotation: 0,
    opacity: 1,
    visible: true,
    hasImage: false,
    imageSrc: null,
    fit: "cover",
    border: true,
    locked: false,
    perspective: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    skewX: 0,
    skewY: 0,
    transformOrigin: "center center",
    enablePerspective: false,
    corners: [
      { x: 0, y: 0 },
      { x: finalWidth, y: 0 },
      { x: finalWidth, y: finalHeight },
      { x: 0, y: finalHeight }
    ]
  };

  setLayersWithHistory((prev) => [...prev, newLayer]);
  setSelectedLayerId(newLayer.id);
};

export const handlePrintAreaImageUpload = (e, selectedLayer, updateLayer, printAreaFileInputRef) => {
  const file = e.target.files && e.target.files[0];
  if (!file || !selectedLayer) return;
  if (selectedLayer.type !== "printarea") return;

  if (selectedLayer.imageSrc && selectedLayer.imageSrc.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(selectedLayer.imageSrc);
    } catch (err) { }
  }

  const url = URL.createObjectURL(file);
  updateLayer(selectedLayer.id, {
    hasImage: true,
    imageSrc: url,
    border: false,
  });

  if (printAreaFileInputRef.current) {
    printAreaFileInputRef.current.value = "";
  }
};

export const removePrintAreaImage = (selectedLayer, updateLayer) => {
  if (!selectedLayer) return;

  if (selectedLayer.imageSrc && selectedLayer.imageSrc.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(selectedLayer.imageSrc);
    } catch (err) { }
  }

  updateLayer(selectedLayer.id, {
    hasImage: false,
    imageSrc: null,
    border: true,
  });
};

export const triggerPrintAreaImageUpload = (printAreaFileInputRef) => {
  if (printAreaFileInputRef.current) {
    printAreaFileInputRef.current.click();
  }
};

// ================= ROTATION =================
export const startRotation = (e, layerId, layers, updateLayer, innerCanvasRef, scale) => {
  e.stopPropagation();
  e.preventDefault();

  const layer = layers.find((l) => l.id === layerId);
  if (!layer) return;

  const canvasEl = innerCanvasRef.current;
  if (!canvasEl) return;

  const canvasRect = canvasEl.getBoundingClientRect();
  const centerX = canvasRect.left + (layer.x + layer.width / 2) * scale;
  const centerY = canvasRect.top + (layer.y + layer.height / 2) * scale;

  const onMove = (ev) => {
    const angleRad = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
    const angleDeg = Math.round((angleRad * 180) / Math.PI);
    updateLayer(layerId, { rotation: angleDeg });
  };

  const onUp = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
};

// ================= CORNER DRAG =================
export const startCornerDrag = (e, layerId, cornerIndex, layers, updateLayer, innerCanvasRef, scale, getCanvasSize, setDraggingCorner) => {
  e.stopPropagation();
  e.preventDefault();

  const layer = layers.find((l) => l.id === layerId);
  if (!layer) return;

  const canvasEl = innerCanvasRef.current;
  if (!canvasEl) return;

  const canvasSize = getCanvasSize();
  const scaleFactor = canvasSize.displayWidth / canvasSize.originalWidth;

  const startX = e.clientX;
  const startY = e.clientY;

  const startCorners = layer.corners || [
    { x: 0, y: 0 },
    { x: layer.width, y: 0 },
    { x: layer.width, y: layer.height },
    { x: 0, y: layer.height }
  ];

  const onMove = (ev) => {
    const deltaX = (ev.clientX - startX) / scale / scaleFactor;
    const deltaY = (ev.clientY - startY) / scale / scaleFactor;

    const newCorners = [...startCorners];
    newCorners[cornerIndex] = {
      x: Math.max(0, Math.min(layer.width, startCorners[cornerIndex].x + deltaX)),
      y: Math.max(0, Math.min(layer.height, startCorners[cornerIndex].y + deltaY))
    };

    updateLayer(layerId, { corners: newCorners });
  };

  const onUp = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    setDraggingCorner(null);
  };

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  setDraggingCorner({ layerId, cornerIndex });
};

// ================= EXPORT =================
export const exportAsImage = async (format = "png", innerCanvasRef) => {
  if (!innerCanvasRef.current) {
    toast.error("Canvas not ready");
    return;
  }

  try {
    if (format === "png") {
      const dataUrl = await toPng(innerCanvasRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `mockup-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } else {
      const dataUrl = await toJpeg(innerCanvasRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `mockup-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
    }
    toast.success("Exported successfully!");
  } catch (err) {
    console.error("Export error:", err);
    toast.error("Export failed");
  }
};

// ================= ZOOM =================
export const handleZoomToFit = (canvasRef, mockup, getCanvasSize, setScale, setCanvasOffset) => {
  const canvasContainer = canvasRef.current;
  if (!canvasContainer || !mockup) return;

  const containerWidth = canvasContainer.clientWidth;
  const containerHeight = canvasContainer.clientHeight;
  const canvasSize = getCanvasSize();

  const widthRatio = containerWidth / canvasSize.displayWidth;
  const heightRatio = containerHeight / canvasSize.displayHeight;
  const minRatio = Math.min(widthRatio, heightRatio) * 0.95;

  setScale(minRatio);
  setCanvasOffset({ x: 0, y: 0 });
};

// ================= UPLOAD HELPER =================
export const uploadLayersWithImages = async (productId, layersData, layersWithBlobs, selectedMockup, BaseUrl, method = "PUT", thumbnailBlob = null) => {
  try {
    console.log("=== uploadLayersWithImages ===");
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const formData = new FormData();
    formData.append("productId", productId);

    if (thumbnailBlob) {
      formData.append("mockupThumbnail", thumbnailBlob, "thumbnail.png");
    }

    const cleaned = layersData.map(layer => {
      const c = { ...layer };
      delete c._id;
      delete c.__v;
      delete c.createdAt;
      delete c.updatedAt;
      return c;
    });
    formData.append("layers", JSON.stringify(cleaned));

    const layerIds = [];

    for (let i = 0; i < layersWithBlobs.length; i++) {
      const layer = layersWithBlobs[i];
      let blobUrl = null;
      if (layer.type === "printarea") blobUrl = layer.imageSrc;
      if (layer.type === "image" || layer.type === "background") blobUrl = layer.src;
      if (!blobUrl) continue;

      try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const ext = (blob.type && blob.type.split("/")[1]) || "png";
        const filename = `${layer.type}-${layer.id || Date.now()}.${ext}`;
        const file = new File([blob], filename, { type: blob.type || "image/png" });
        formData.append("files", file);
        layerIds.push(layer.id);
        console.log("Appended file for", layer.id);
      } catch (e) {
        console.error("blob -> file error for", layer.id, e);
      }
    }

    if (layerIds.length) {
      formData.append("layerIds", JSON.stringify(layerIds));
      console.log("layerIds:", layerIds);
    }

    const endpoint = method === "PUT"
      ? `${BaseUrl}/api/layers/${productId}/${selectedMockup?._id}`
      : `${BaseUrl}/api/layers`;

    const response = await fetch(endpoint, {
      method,
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      throw new Error("Unauthorized: Token expired");
    }

    if (!response.ok) {
      const text = await response.text();
      console.error("Server error response:", text);
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message || "Upload failed");
    return data.data ?? data;
  } catch (err) {
    console.error("uploadLayersWithImages error:", err);
    throw err;
  }
};

// ================= SAVE =================
export const onSave = async ({ editId, selectedMockup, layers, setIsSaving, navigate, getCanvasSize, BaseUrl, setLayers, selectedLayerId, innerCanvasRef }) => {
  try {
    if (!editId) {
      toast.error("Product ID not found!");
      return;
    }

    setIsSaving(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired! Please login again.");
      navigate("/admin/login");
      return;
    }

    // 🔥 CAPTURE THUMBNAIL
    let thumbnailBlob = null;
    if (innerCanvasRef?.current) {
      try {
        const dataUrl = await toPng(innerCanvasRef.current, {
          cacheBust: true,
          pixelRatio: 1, // Lower ratio for thumbnail
        });
        const res = await fetch(dataUrl);
        thumbnailBlob = await res.blob();
      } catch (e) {
        console.error("Failed to capture thumbnail:", e);
      }
    }

    const canvasSize = getCanvasSize();
    const originalWidth = canvasSize.originalWidth || canvasSize.width;
    const originalHeight = canvasSize.originalHeight || canvasSize.height;

    const layersWithPercentage = layers.map(layer => {
      const layerCopy = { ...layer };

      if (layer.type === "background") {
        layerCopy.x = 0;
        layerCopy.y = 0;
        layerCopy.width = originalWidth;
        layerCopy.height = originalHeight;
        return layerCopy;
      }

      layerCopy.x_percent = originalWidth !== 0 ? (layer.x / originalWidth) * 100 : 0;
      layerCopy.y_percent = originalHeight !== 0 ? (layer.y / originalHeight) * 100 : 0;
      layerCopy.width_percent = originalWidth !== 0 ? (layer.width / originalWidth) * 100 : 0;
      layerCopy.height_percent = originalHeight !== 0 ? (layer.height / originalHeight) * 100 : 0;

      return layerCopy;
    });

    const layersWithBlobs = layers.filter(layer => {
      if (layer.type === "printarea" && layer.hasImage && layer.imageSrc && layer.imageSrc.startsWith("blob:")) return true;
      if (layer.type === "image" && layer.src && layer.src.startsWith("blob:")) return true;
      if (layer.type === "background" && layer.src && layer.src.startsWith("blob:")) return true;
      return false;
    });

    const serializable = layersWithPercentage.map(l => {
      const layerCopy = { ...l };
      layerCopy.productId = editId;
      delete layerCopy.__v;

      if (layerCopy._id && (layerCopy._id.toString().startsWith('layer-') || layerCopy._id.toString().startsWith('printarea-'))) {
        delete layerCopy._id;
      }
      if (layerCopy._id && !/^[0-9a-fA-F]{24}$/.test(layerCopy._id.toString())) delete layerCopy._id;

      if (layerCopy.type === "printarea" && layerCopy.imageSrc && layerCopy.imageSrc.startsWith("blob:")) {
        layerCopy.imageSrc = "UPLOADING";
        layerCopy.hasImage = true;
      }
      if (layerCopy.type === "image" && layerCopy.src && layerCopy.src.startsWith("blob:")) {
        layerCopy.src = "UPLOADING";
      }
      if (layerCopy.type === "background" && layerCopy.src && layerCopy.src.startsWith("blob:")) {
        layerCopy.src = "UPLOADING";
      }
      return layerCopy;
    });

    let savedData = null;

    if (layersWithBlobs.length > 0 || thumbnailBlob) {
      savedData = await uploadLayersWithImages(editId, serializable, layersWithBlobs, selectedMockup, BaseUrl, "PUT", thumbnailBlob);
    } else {
      const updateResponse = await updateLayers(editId, selectedMockup?._id, serializable);
      if (!updateResponse.success) throw new Error(updateResponse.message || "Update failed");
      savedData = updateResponse.data || updateResponse.layers;
    }

    if (Array.isArray(savedData) && savedData.length > 0) {
      setLayers(savedData.map(item => ({ ...item, id: item._id?.toString() || item.id })));
    }

    localStorage.setItem(`layers_${editId}`, JSON.stringify(savedData));
    toast.success("Saved successfully");
    navigate(`/admin/product/${editId}`);

  } catch (err) {
    console.error("onSave error:", err);
    if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
      toast.error("Session expired! Please login again.");
      navigate("/admin/login");
    } else {
      toast.error("Error: " + (err.message || err));
    }
  } finally {
    setIsSaving(false);
  }
};

// ================= LOAD EDITOR DATA =================
export const loadEditorData = async ({ editId, selectedMockup, setMockup, setLayers, setSelectedLayerId, getLayersByProductId }) => {
  if (!editId || !selectedMockup?._id) return;

  const savedMockup = localStorage.getItem("mockupToEdit");
  if (savedMockup) {
    const parsed = JSON.parse(savedMockup);
    setMockup(parsed);
  }

  if (editId) {
    try {
      const response = await getLayersByProductId(editId, selectedMockup?._id);
      if (response.success && response.data && response.data.length > 0) {
        const bgLayer = response.data.find(l => l.type === "background");
        let canvasWidth = bgLayer?._naturalWidth || 800;
        let canvasHeight = bgLayer?._naturalHeight || 800;

        if (bgLayer && bgLayer._naturalWidth && bgLayer._naturalHeight) {
          canvasWidth = bgLayer._naturalWidth;
          canvasHeight = bgLayer._naturalHeight;
        } else if (savedMockup) {
          const img = await new Promise((resolve) => {
            const image = new Image();
            image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
            image.src = JSON.parse(savedMockup).url;
          });
          canvasWidth = img.width;
          canvasHeight = img.height;
        }

        const formattedLayers = response.data.map(layer => {
          const x = layer.x_percent !== undefined ? (layer.x_percent / 100) * canvasWidth : layer.x || 0;
          const y = layer.y_percent !== undefined ? (layer.y_percent / 100) * canvasHeight : layer.y || 0;
          const width = layer.width_percent !== undefined ? (layer.width_percent / 100) * canvasWidth : layer.width || 100;
          const height = layer.height_percent !== undefined ? (layer.height_percent / 100) * canvasHeight : layer.height || 100;

          const baseLayer = {
            id: layer.id || layer._id,
            _id: layer._id,
            type: layer.type,
            x: x,
            y: y,
            width: width,
            height: height,
            rotation: layer.rotation || 0,
            opacity: layer.opacity !== undefined ? layer.opacity : 1,
            locked: !!layer.locked,
            visible: layer.visible !== false,
            name: layer.name || "",
          };

          switch (layer.type) {
            case "background":
              return {
                ...baseLayer,
                src: layer.src,
                _naturalWidth: layer._naturalWidth,
                _naturalHeight: layer._naturalHeight,
                x: 0,
                y: 0,
                width: canvasWidth,
                height: canvasHeight,
              };
            case "text":
              return {
                ...baseLayer,
                text: layer.text || layer.name || "New Text",
                name: layer.name || "New Text",
                fontSize: layer.fontSize || 22,
                color: layer.color || "#000000",
              };
            case "printarea":
              return {
                ...baseLayer,
                name: layer.name || "",
                _naturalWidth: layer._naturalWidth,
                _naturalHeight: layer._naturalHeight,
                hasImage: !!layer.hasImage,
                imageSrc: layer.imageSrc || null,
                fit: layer.fit || "cover",
                border: layer.border !== false,
                perspective: layer.perspective || 0,
                rotateX: layer.rotateX || 0,
                rotateY: layer.rotateY || 0,
                rotateZ: layer.rotateZ || 0,
                skewX: layer.skewX || 0,
                skewY: layer.skewY || 0,
                transformOrigin: layer.transformOrigin || "center center",
                enablePerspective: !!layer.enablePerspective,
                corners: layer.corners || [
                  { x: 0, y: 0 },
                  { x: width, y: 0 },
                  { x: width, y: height },
                  { x: 0, y: height }
                ]
              };
            case "image":
              return {
                ...baseLayer,
                src: layer.src,
                _naturalWidth: layer._naturalWidth,
                _naturalHeight: layer._naturalHeight,
                fit: layer.fit || "contain",
                perspective: layer.perspective || 0,
                rotateX: layer.rotateX || 0,
                rotateY: layer.rotateY || 0,
                rotateZ: layer.rotateZ || 0,
                skewX: layer.skewX || 0,
                skewY: layer.skewY || 0,
                transformOrigin: layer.transformOrigin || "center center",
                enablePerspective: !!layer.enablePerspective,
                corners: layer.corners || [
                  { x: 0, y: 0 },
                  { x: width, y: 0 },
                  { x: width, y: height },
                  { x: 0, y: height }
                ]
              };
            default:
              return baseLayer;
          }
        });

        setLayers(formattedLayers);
        if (formattedLayers.length > 0) {
          setSelectedLayerId(formattedLayers[formattedLayers.length - 1].id);
        }
        return;
      }
    } catch (error) {
      console.error("Failed to load saved layers:", error);
    }
  }

  if (savedMockup) {
    const parsed = JSON.parse(savedMockup);
    const img = new Image();
    img.onload = function () {
      const naturalWidth = this.naturalWidth;
      const naturalHeight = this.naturalHeight;
      setLayers([
        {
          id: "layer-bg",
          type: "background",
          src: parsed.url,
          x: 0,
          y: 0,
          width: naturalWidth,
          height: naturalHeight,
          _naturalWidth: naturalWidth,
          _naturalHeight: naturalHeight,
          rotation: 0,
          opacity: 1,
          locked: true,
          visible: true,
        }
      ]);
      setSelectedLayerId("layer-bg");
    };
    img.src = parsed.url;
  }
};

// ================= HISTORY =================
export const handleUndo = (undo, layers, setLayers) => {
  if (typeof undo !== 'function') {
    console.error('undo is not a function');
    return;
  }

  const previousLayers = undo(layers); // ✅ Sirf layers pass karo
  if (previousLayers) {
    setLayers(previousLayers);
  }
};

export const handleRedo = (redo, layers, setLayers) => {
  if (typeof redo !== 'function') {
    console.error('redo is not a function');
    return;
  }

  const nextLayers = redo(layers); // ✅ Sirf layers pass karo
  if (nextLayers) {
    setLayers(nextLayers);
  }
};