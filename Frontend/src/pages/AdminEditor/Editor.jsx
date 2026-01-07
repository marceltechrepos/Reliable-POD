// ==================================================== ORGANIZED CODE ==================
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../api/product.api";
import { toPng, toJpeg } from "html-to-image";
import { useEditorHistory } from "./hooks/useEditorHistory";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import EditorHeader from "./components/EditorHeader";
import EditorCanvas from "./components/EditorCanvas";
import EditorLayersPanel from "./components/EditorLayersPanel";
import EditorPropertiesPanel from "./components/EditorPropertiesPanel";

function Editor() {
  const [mockup, setMockup] = useState(null);
  const [layers, setLayers] = useState([]);
  const [showPrintareaSelect, setShowPrintareaSelect] = useState(false);
  const [printAreas, setPrintAreas] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [draggingCorner, setDraggingCorner] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('canvas');

  const fileInputRef = useRef(null);
  const printAreaFileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const innerCanvasRef = useRef(null);
  const { editId } = useParams();

  // History hook
  const { recordHistory, undo, redo } = useEditorHistory();

  // Wrapper for setLayers with history
  const setLayersWithHistory = (updater, options = { recordHistory: true }) => {
    setLayers((prev) => {
      const newLayers = typeof updater === "function" ? updater(prev) : updater;
      if (options.recordHistory) {
        recordHistory(prev);
      }
      return newLayers;
    });
  };

  const handleLayerReorder = (newLayers) => {
    // Direct set without history for drag-drop reordering
    setLayers(newLayers);
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!editId) return;
      const product = await getProductById(editId);
      if (product) {
        setPrintAreas(product.Printareas || []);
      }
    };
    fetchProduct();
  }, [editId]);

  // Initial load from localStorage
  useEffect(() => {
    const savedMockup = localStorage.getItem("mockupToEdit");
    if (savedMockup) {
      const parsed = JSON.parse(savedMockup);
      setMockup(parsed);
      setLayersWithHistory(
        [
          {
            id: "layer-bg",
            type: "background",
            src: parsed.url,
            x: 0,
            y: 0,
            width: 800,
            height: 800,
            rotation: 0,
            opacity: 1,
            locked: true,
            visible: true,
          },
          {
            id: "layer-1",
            type: "image",
            src: parsed.url,
            x: 80,
            y: 80,
            width: 640,
            height: 640,
            rotation: 0,
            opacity: 1,
            visible: true,
          },
        ],
        { recordHistory: false }
      );
      setSelectedLayerId("layer-1");
    }
  }, []);

  // Layer operations
  const addNewTextLayer = () => {
    const newLayer = {
      id: `layer-${Date.now()}`,
      type: "text",
      text: "New Text",
      name: "",
      x: 100,
      y: 100,
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

  const addImageLayerFromFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newLayer = {
      id: `layer-${Date.now()}`,
      type: "image",
      src: url,
      name: "",
      x: 120,
      y: 120,
      width: 300,
      height: 200,
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
      // NEW (4 points only):
      corners: [
        { x: 0, y: 0 },     // top-left
        { x: 300, y: 0 },   // top-right
        { x: 300, y: 200 }, // bottom-right
        { x: 0, y: 200 }    // bottom-left
      ]
      // corners: [
      //   { x: 0, y: 0 },
      //   { x: 150, y: 0 },
      //   { x: 300, y: 0 },
      //   { x: 300, y: 100 },
      //   { x: 300, y: 200 },
      //   { x: 150, y: 200 },
      //   { x: 0, y: 200 },
      //   { x: 0, y: 100 },
      // ]
    };
    setLayersWithHistory((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      addImageLayerFromFile(file);
    }
    e.target.value = "";
  };

  const addImageLayerButton = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const updateLayer = (id, updates) => {
    setLayersWithHistory((prev) =>
      prev.map((layer) => {
        if (layer.id !== id) return layer;
        const updatedLayer = { ...layer, ...updates };

        // ✅ Agar enablePerspective disable ho raha hai, toh CORNERS PRESERVE KAREIN
        // Yeh line IMPORTANT hai
        if (updates.enablePerspective === false) {
          // Sirf enablePerspective update karein, corners ko nahi
          // Corners preserve rahenge for future use
          return { ...layer, enablePerspective: false };
        }

        // ✅ Size change pe corners reset (4 points only)
        if ((updates.width !== undefined && updates.width !== layer.width) ||
          (updates.height !== undefined && updates.height !== layer.height)) {
          const newWidth = updates.width !== undefined ? updates.width : layer.width;
          const newHeight = updates.height !== undefined ? updates.height : layer.height;
          updatedLayer.corners = [
            { x: 0, y: 0 },                     // top-left
            { x: newWidth, y: 0 },              // top-right
            { x: newWidth, y: newHeight },      // bottom-right
            { x: 0, y: newHeight }              // bottom-left
          ];
        }

        return updatedLayer;
      })
    );
  };

  // const updateLayer = (id, updates) => {
  //   setLayersWithHistory((prev) =>
  //     prev.map((layer) => {
  //       if (layer.id !== id) return layer;
  //       const updatedLayer = { ...layer, ...updates };

  //       if ((updates.width !== undefined && updates.width !== layer.width) ||
  //         (updates.height !== undefined && updates.height !== layer.height)) {
  //         const newWidth = updates.width !== undefined ? updates.width : layer.width;
  //         const newHeight = updates.height !== undefined ? updates.height : layer.height;
  //         updatedLayer.corners = [
  //           { x: 0, y: 0 },
  //           { x: newWidth / 2, y: 0 },
  //           { x: newWidth, y: 0 },
  //           { x: newWidth, y: newHeight / 2 },
  //           { x: newWidth, y: newHeight },
  //           { x: newWidth / 2, y: newHeight },
  //           { x: 0, y: newHeight },
  //           { x: 0, y: newHeight / 2 },
  //         ];
  //       }
  //       return updatedLayer;
  //     })
  //   );
  // };

  // const updateLayer = (id, updates) => {
  //   setLayersWithHistory((prev) =>
  //     prev.map((layer) => {
  //       if (layer.id !== id) return layer;
  //       const updatedLayer = { ...layer, ...updates };

  //       // ✅ Size change pe corners reset (4 points only)
  //       if ((updates.width !== undefined && updates.width !== layer.width) ||
  //         (updates.height !== undefined && updates.height !== layer.height)) {
  //         const newWidth = updates.width !== undefined ? updates.width : layer.width;
  //         const newHeight = updates.height !== undefined ? updates.height : layer.height;
  //         updatedLayer.corners = [
  //           { x: 0, y: 0 },                     // top-left
  //           { x: newWidth, y: 0 },              // top-right
  //           { x: newWidth, y: newHeight },      // bottom-right
  //           { x: 0, y: newHeight }              // bottom-left
  //         ];
  //       }

  //       return updatedLayer;
  //     })
  //   );
  // };

  const removeLayer = (id) => {
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

  const bringForward = (id) => {
    setLayersWithHistory((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(idx + 1, 0, item);
      return copy;
    });
  };

  const sendBackward = (id) => {
    setLayersWithHistory((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx <= 0) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(idx - 1, 0, item);
      return copy;
    });
  };

  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);

  const onSave = () => {
    const serializable = layers.map((l) => {
      const copy = { ...l };
      return copy;
    });
    localStorage.setItem("mockupEditedLayers", JSON.stringify(serializable));
    console.log("Saved layers:", serializable);
    alert("Saved to localStorage (mockupEditedLayers). Check console.");
  };

  const getCanvasSize = () => {
    return { width: 800, height: 800 };
  };

  const duplicateLayer = () => {
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

  const toggleLayerVisibility = (id) => {
    setLayersWithHistory((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const startRotation = (e, layerId) => {
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

  const addPrintAreaToCanvas = (printArea) => {
    const newLayer = {
      id: `printarea-${Date.now()}`,
      type: "printarea",
      name: printArea.displayName || "",
      x: 100,
      y: 100,
      width: printArea.width,
      height: printArea.height,
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
      // corners: [
      //   { x: 0, y: 0 },
      //   { x: printArea.width / 2, y: 0 },
      //   { x: printArea.width, y: 0 },
      //   { x: printArea.width, y: printArea.height / 2 },
      //   { x: printArea.width, y: printArea.height },
      //   { x: printArea.width / 2, y: printArea.height },
      //   { x: 0, y: printArea.height },
      //   { x: 0, y: printArea.height / 2 },
      // ]
      corners: [
        { x: 0, y: 0 },                            // top-left
        { x: printArea.width, y: 0 },              // top-right
        { x: printArea.width, y: printArea.height }, // bottom-right
        { x: 0, y: printArea.height }              // bottom-left
      ]
    };

    setLayersWithHistory((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handlePrintAreaImageUpload = (e) => {
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

    e.target.value = "";
  };

  const removePrintAreaImage = () => {
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

  const triggerPrintAreaImageUpload = () => {
    if (printAreaFileInputRef.current) {
      printAreaFileInputRef.current.click();
    }
  };

  // const startCornerDrag = (e, layerId, cornerIndex) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   const layer = layers.find((l) => l.id === layerId);
  //   if (!layer) return;

  //   const canvasEl = innerCanvasRef.current;
  //   if (!canvasEl) return;

  //   const canvasRect = canvasEl.getBoundingClientRect();
  //   const startX = e.clientX;
  //   const startY = e.clientY;
  //   const startCorners = [...layer.corners];

  //   const onMove = (ev) => {
  //     const deltaX = (ev.clientX - startX) / scale;
  //     const deltaY = (ev.clientY - startY) / scale;

  //     const newCorners = [...startCorners];
  //     newCorners[cornerIndex] = {
  //       x: Math.max(0, Math.min(layer.width, startCorners[cornerIndex].x + deltaX)),
  //       y: Math.max(0, Math.min(layer.height, startCorners[cornerIndex].y + deltaY))
  //     };

  //     const width = layer.width;
  //     const height = layer.height;
  //     const topLeft = newCorners[0];
  //     const topRight = newCorners[2];
  //     const bottomLeft = newCorners[6];
  //     const bottomRight = newCorners[4];

  //     const skewX = ((topRight.y - topLeft.y) / height) * 45;
  //     const skewY = ((bottomLeft.x - topLeft.x) / width) * 45;
  //     const rotateX = ((topRight.y + bottomRight.y - topLeft.y - bottomLeft.y) / (2 * height)) * 30;
  //     const rotateY = ((bottomLeft.x + bottomRight.x - topLeft.x - topRight.x) / (2 * width)) * 30;

  //     const dx1 = Math.abs(topRight.x - topLeft.x);
  //     const dx2 = Math.abs(bottomRight.x - bottomLeft.x);
  //     const dy1 = Math.abs(bottomLeft.y - topLeft.y);
  //     const dy2 = Math.abs(bottomRight.y - topRight.y);
  //     const maxDiff = Math.max(dx1, dx2, dy1, dy2);
  //     const perspective = Math.min(1000, Math.max(100, maxDiff * 3));

  //     updateLayer(layerId, {
  //       corners: newCorners,
  //       skewX: Math.round(skewX),
  //       skewY: Math.round(skewY),
  //       rotateX: Math.round(rotateX),
  //       rotateY: Math.round(rotateY),
  //       perspective: Math.round(perspective)
  //     });
  //   };

  //   const onUp = () => {
  //     window.removeEventListener("mousemove", onMove);
  //     window.removeEventListener("mouseup", onUp);
  //     setDraggingCorner(null);
  //   };

  //   window.addEventListener("mousemove", onMove);
  //   window.addEventListener("mouseup", onUp);
  //   setDraggingCorner({ layerId, cornerIndex });
  // };

  const startCornerDrag = (e, layerId, cornerIndex) => {
    e.stopPropagation();
    e.preventDefault();
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;

    const canvasEl = innerCanvasRef.current;
    if (!canvasEl) return;

    const canvasRect = canvasEl.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCorners = [...layer.corners];

    const onMove = (ev) => {
      const deltaX = (ev.clientX - startX) / scale;
      const deltaY = (ev.clientY - startY) / scale;

      const newCorners = [...startCorners];
      newCorners[cornerIndex] = {
        x: Math.max(0, Math.min(layer.width, startCorners[cornerIndex].x + deltaX)),
        y: Math.max(0, Math.min(layer.height, startCorners[cornerIndex].y + deltaY))
      };

      // ✅ SIRF CORNERS UPDATE - KOI TRANSFORM VALUES CALCULATE NAHI
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

  const exportAsImage = async (format = "png") => {
    if (!innerCanvasRef.current) {
      alert("Canvas not ready");
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
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed — check console for details.");
    }
  };

  const toggleLockSelected = () => {
    if (!selectedLayer) return;
    updateLayer(selectedLayer.id, { locked: !selectedLayer.locked });
  };

  const toggleLockById = (id) => {
    setLayersWithHistory((prev) => prev.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)));
  };

  const handleZoomIn = () => setScale((s) => Math.min(2, +(s + 0.1).toFixed(2)));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)));
  const handleZoomReset = () => setScale(1);

  const handleUndo = () => undo(layers, setLayers);
  const handleRedo = () => redo(layers, setLayers);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    selectedLayerId,
    layers,
    updateLayer,
    removeLayer,
    duplicateLayer,
    exportAsImage,
    toggleLockSelected,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleUndo,
    handleRedo,
  });

  // Operations object for passing to components
  const operations = {
    addNewTextLayer,
    addImageLayerFromFile,
    handleFileInputChange,
    addImageLayerButton,
    updateLayer,
    removeLayer,
    bringForward,
    sendBackward,
    duplicateLayer,
    toggleLayerVisibility,
    startRotation,
    addPrintAreaToCanvas,
    handlePrintAreaImageUpload,
    removePrintAreaImage,
    triggerPrintAreaImageUpload,
    startCornerDrag,
    exportAsImage,
    toggleLockSelected,
    toggleLockById,
    onSave,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleUndo,
    handleRedo,
    setLayers: setLayersWithHistory,
    handleLayerReorder,
  };

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      <EditorHeader
        showPrintareaSelect={showPrintareaSelect}
        setShowPrintareaSelect={setShowPrintareaSelect}
        printAreas={printAreas}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        scale={scale}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        fileInputRef={fileInputRef}
        operations={operations}
      />

      <div className="flex-1 flex overflow-hidden">
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
        )}

        <EditorLayersPanel
          layers={layers}
          selectedLayerId={selectedLayerId}
          setSelectedLayerId={setSelectedLayerId}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          operations={operations}
        />

        {/* Canvas - FIXED RESPONSIVE CLASSES */}
        <div className={`flex-1 ${activePanel === 'canvas' ? 'flex' : 'hidden'} lg:flex items-center justify-center bg-gray-700 p-2 lg:p-4`}>
          <EditorCanvas
            mockup={mockup}
            layers={layers}
            selectedLayerId={selectedLayerId}
            setSelectedLayerId={setSelectedLayerId}
            scale={scale}
            showGrid={showGrid}
            gridSize={gridSize}
            getCanvasSize={getCanvasSize}
            canvasRef={canvasRef}
            innerCanvasRef={innerCanvasRef}
            draggingCorner={draggingCorner}
            operations={operations}
            activePanel={activePanel} // ✅ ADD THIS PROP
          />
        </div>

        <EditorPropertiesPanel
          selectedLayer={selectedLayer}
          activePanel={activePanel}
          printAreaFileInputRef={printAreaFileInputRef}
          operations={operations}
          setShowGrid={setShowGrid}
        />
      </div>
    </div>
  );
}

export default Editor;