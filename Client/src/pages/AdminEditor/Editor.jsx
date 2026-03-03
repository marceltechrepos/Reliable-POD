import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../api/product.api";
import { toPng, toJpeg } from "html-to-image";
import { useEditorHistory } from "./hooks/useEditorHistory";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import EditorHeader from "./components/EditorHeader";
import EditorCanvas from "./components/EditorCanvas";
import EditorLayersPanel from "./components/EditorLayersPanel";
import EditorPropertiesPanel from "./components/EditorPropertiesPanel";
import {
  getLayersByProductId,
  updateLayers,
} from "../../api/layers.api";


function Editor() {
  const BaseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
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
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);


  const fileInputRef = useRef(null);
  const printAreaFileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const innerCanvasRef = useRef(null);
  const { editId } = useParams();

  const SCREEN_DPI = 96; // Standard screen DPI
  const PRINT_DPI = 300; // Standard print DPI (Photoshop default)

  const pixelsToInches = (pixels, dpi = PRINT_DPI) => {
    return pixels / dpi;
  };

  const inchesToPixels = (inches, dpi = PRINT_DPI) => {
    return Math.round(inches * dpi);
  };

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

      const img = new Image();
      img.onload = function () {
        const naturalWidth = this.naturalWidth;
        const naturalHeight = this.naturalHeight;

        // ✅ NO SCALING - ORIGINAL SIZE USE KARO
        const displayWidth = naturalWidth;
        const displayHeight = naturalHeight;

        setLayersWithHistory(
          [
            {
              id: "layer-bg",
              type: "background",
              src: parsed.url,
              x: 0,
              y: 0,
              width: displayWidth, // ✅ Original width
              height: displayHeight, // ✅ Original height
              _naturalWidth: naturalWidth,
              _naturalHeight: naturalHeight,
              rotation: 0,
              opacity: 1,
              // locked: true,
              visible: true,
            },
          ],
          { recordHistory: false }
        );
        setSelectedLayerId("layer-bg");
      };
      img.src = parsed.url;
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

  // const addImageLayerFromFile = (file) => {
  //   if (!file) return;
  //   const url = URL.createObjectURL(file);

  //   const img = new Image();
  //   img.onload = function () {
  //     const naturalWidth = this.naturalWidth;
  //     const naturalHeight = this.naturalHeight;

  //     const canvasSize = getCanvasSize();

  //     // ✅ NEW: Calculate maximum size for uploaded image (40% of canvas)
  //     // const maxCanvasWidth = canvasSize.width * 0.4;  // 40% of canvas width
  //     // const maxCanvasHeight = canvasSize.height * 0.4; // 40% of canvas height

  //     // let finalWidth = naturalWidth;
  //     // let finalHeight = naturalHeight;

  //     // // Scale down if image is larger than allowed size
  //     // if (naturalWidth > maxCanvasWidth || naturalHeight > maxCanvasHeight) {
  //     //   const widthRatio = maxCanvasWidth / naturalWidth;
  //     //   const heightRatio = maxCanvasHeight / naturalHeight;
  //     //   const minRatio = Math.min(widthRatio, heightRatio);

  //     //   finalWidth = Math.floor(naturalWidth * minRatio);
  //     //   finalHeight = Math.floor(naturalHeight * minRatio);
  //     // }
  //     let finalWidth = naturalWidth;
  //     let finalHeight = naturalHeight;

  //     // Only scale DOWN if image is bigger than canvas
  //     if (naturalWidth > canvasSize.width || naturalHeight > canvasSize.height) {
  //       const widthRatio = canvasSize.width / naturalWidth;
  //       const heightRatio = canvasSize.height / naturalHeight;
  //       const scaleRatio = Math.min(widthRatio, heightRatio);

  //       finalWidth = Math.floor(naturalWidth * scaleRatio);
  //       finalHeight = Math.floor(naturalHeight * scaleRatio);
  //     }


  //     // Also ensure minimum size for very small images
  //     const minSize = Math.min(canvasSize.width, canvasSize.height) * 0.15;
  //     if (finalWidth < minSize || finalHeight < minSize) {
  //       const scaleUp = minSize / Math.min(finalWidth, finalHeight);
  //       finalWidth = Math.floor(finalWidth * scaleUp);
  //       finalHeight = Math.floor(finalHeight * scaleUp);
  //     }

  //     // Center position
  //     const x = Math.max(0, (canvasSize.width - finalWidth) / 2);
  //     const y = Math.max(0, (canvasSize.height - finalHeight) / 2);

  //     const newLayer = {
  //       id: `layer-${Date.now()}`,
  //       type: "image",
  //       src: url,
  //       name: file.name || "Image Layer",
  //       x: x,
  //       y: y,
  //       width: finalWidth,
  //       height: finalHeight,
  //       _naturalWidth: naturalWidth,
  //       _naturalHeight: naturalHeight,
  //       rotation: 0,
  //       opacity: 1,
  //       visible: true,
  //       fit: "contain",
  //       locked: false,
  //       perspective: 0,
  //       rotateX: 0,
  //       rotateY: 0,
  //       rotateZ: 0,
  //       skewX: 0,
  //       skewY: 0,
  //       transformOrigin: "center center",
  //       enablePerspective: false,
  //       corners: [
  //         { x: 0, y: 0 },
  //         { x: finalWidth, y: 0 },
  //         { x: finalWidth, y: finalHeight },
  //         { x: 0, y: finalHeight }
  //       ]
  //     };

  //     setLayersWithHistory((prev) => [...prev, newLayer]);
  //     setSelectedLayerId(newLayer.id);
  //   };
  //   img.src = url;
  // };


  const addImageLayerFromFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);

    const img = new Image();
    img.onload = function () {
      const naturalWidth = this.naturalWidth;
      const naturalHeight = this.naturalHeight;

      const canvasSize = getCanvasSize();
      // ✅ ORIGINAL dimensions use karo
      const originalWidth = canvasSize.originalWidth;
      const originalHeight = canvasSize.originalHeight;

      let finalWidth = naturalWidth;
      let finalHeight = naturalHeight;

      // Only scale DOWN if image is bigger than canvas (original size se compare)
      if (naturalWidth > originalWidth || naturalHeight > originalHeight) {
        const widthRatio = originalWidth / naturalWidth;
        const heightRatio = originalHeight / naturalHeight;
        const scaleRatio = Math.min(widthRatio, heightRatio);

        finalWidth = Math.floor(naturalWidth * scaleRatio);
        finalHeight = Math.floor(naturalHeight * scaleRatio);
      }

      // Also ensure minimum size for very small images (original size ke hisaab se)
      const minSize = Math.min(originalWidth, originalHeight) * 0.15;
      if (finalWidth < minSize || finalHeight < minSize) {
        const scaleUp = minSize / Math.min(finalWidth, finalHeight);
        finalWidth = Math.floor(finalWidth * scaleUp);
        finalHeight = Math.floor(finalHeight * scaleUp);
      }

      // Center position (original coordinates)
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
    };
    img.src = url;
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

        // ✅ IMPORTANT: When size changes, reset corners to rectangle
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

  console.log(editId, " <<<<, edit id")

  // Saved layers fetch karne ka function
  const fetchSavedLayers = async () => {
    if (!editId) return;

    try {
      const response = await getLayersByProductId(editId);
      console.log("Saved layers response:", response);

      if (response.success && response.data && response.data.length > 0) {
        // Process saved layers
        const savedLayers = response.data;

        // 1. Pehle mockup set karo
        const mockupData = JSON.parse(localStorage.getItem("mockupToEdit")) || {};
        setMockup(mockupData);

        // 2. Layers ko format karo
        const formattedLayers = savedLayers.map(layer => {
          const formattedLayer = {
            id: layer.id || layer._id,
            _id: layer._id,
            type: layer.type,
            x: layer.x,
            y: layer.y,
            width: layer.width,
            height: layer.height,
            rotation: layer.rotation || 0,
            opacity: layer.opacity !== undefined ? layer.opacity : 1,
            locked: !!layer.locked,
            visible: layer.visible !== false,
            createdAt: layer.createdAt,
            updatedAt: layer.updatedAt,
            __v: layer.__v
          };

          // Type-specific properties add karo
          if (layer.type === "background") {
            formattedLayer.src = layer.src;
            formattedLayer._naturalWidth = layer._naturalWidth;
            formattedLayer._naturalHeight = layer._naturalHeight;
          }

          if (layer.type === "printarea") {
            formattedLayer.name = layer.name || "";
            formattedLayer.border = layer.border !== false;
            formattedLayer.corners = layer.corners || [];
            formattedLayer.enablePerspective = !!layer.enablePerspective;
            formattedLayer.fit = layer.fit || "fill";
            formattedLayer.hasImage = !!layer.hasImage;
            formattedLayer.imageSrc = layer.imageSrc;
            formattedLayer.perspective = layer.perspective || 0;
            formattedLayer.rotateX = layer.rotateX || 0;
            formattedLayer.rotateY = layer.rotateY || 0;
            formattedLayer.rotateZ = layer.rotateZ || 0;
            formattedLayer.skewX = layer.skewX || 0;
            formattedLayer.skewY = layer.skewY || 0;
            formattedLayer.transformOrigin = layer.transformOrigin || "center center";
            formattedLayer._naturalWidth = layer._naturalWidth;
            formattedLayer._naturalHeight = layer._naturalHeight;
          }

          if (layer.type === "image") {
            formattedLayer.src = layer.src || "";
            formattedLayer.name = layer.name || "";
            formattedLayer.fit = layer.fit || "contain";
            formattedLayer.perspective = layer.perspective || 0;
            formattedLayer.rotateX = layer.rotateX || 0;
            formattedLayer.rotateY = layer.rotateY || 0;
            formattedLayer.rotateZ = layer.rotateZ || 0;
            formattedLayer.skewX = layer.skewX || 0;
            formattedLayer.skewY = layer.skewY || 0;
            formattedLayer.transformOrigin = layer.transformOrigin || "center center";
            formattedLayer.enablePerspective = !!layer.enablePerspective;
            formattedLayer.corners = layer.corners || [
              { x: 0, y: 0 },
              { x: layer.width, y: 0 },
              { x: layer.width, y: layer.height },
              { x: 0, y: layer.height }
            ];
            formattedLayer._naturalWidth = layer._naturalWidth;
            formattedLayer._naturalHeight = layer._naturalHeight;
          }

          if (layer.type === "text") {
            formattedLayer.text = layer.name || "New Text";
            formattedLayer.name = layer.name || "";
            formattedLayer.fontSize = layer.fontSize || 22;
            formattedLayer.color = layer.color || "#ffffff";
          }

          return formattedLayer;
        });

        console.log("Formatted layers:", formattedLayers);

        // 3. Layers set karo without history record
        setLayers(formattedLayers);

        // 4. Last selected layer ko select karo
        if (formattedLayers.length > 0) {
          const lastLayer = formattedLayers[formattedLayers.length - 1];
          setSelectedLayerId(lastLayer.id);
        }

        alert("Saved layers loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching saved layers:", error);
      // Fallback: localStorage se load karo
      const localSavedLayers = localStorage.getItem("mockupEditedLayers");
      if (localSavedLayers) {
        const parsed = JSON.parse(localSavedLayers);
        setLayers(parsed);
      }
    }
  };

  // Replace your initial useEffect with this optimized version
  // useEffect(() => {
  //   const loadEditorData = async () => {
  //     // 1. First load mockup
  //     const savedMockup = localStorage.getItem("mockupToEdit");
  //     if (savedMockup) {
  //       const parsed = JSON.parse(savedMockup);
  //       setMockup(parsed);
  //     }

  //     // 2. Try to load saved layers from API
  //     if (editId) {
  //       try {
  //         const response = await getLayersByProductId(editId);

  //         if (response.success && response.data && response.data.length > 0) {
  //           // Format and set layers
  //           const formattedLayers = response.data.map(layer => {
  //             const baseLayer = {
  //               id: layer.id || layer._id,
  //               _id: layer._id,
  //               type: layer.type,
  //               x: layer.x,
  //               y: layer.y,
  //               width: layer.width,
  //               height: layer.height,
  //               rotation: layer.rotation || 0,
  //               opacity: layer.opacity !== undefined ? layer.opacity : 1,
  //               locked: !!layer.locked,
  //               visible: layer.visible !== false,
  //               name: layer.name || "",
  //               // Add other common fields if they exist
  //               ...(layer.productId && { productId: layer.productId }),
  //             };

  //             // Add type-specific fields
  //             switch (layer.type) {
  //               case "background":
  //                 return {
  //                   ...baseLayer,
  //                   src: layer.src,
  //                   _naturalWidth: layer._naturalWidth,
  //                   _naturalHeight: layer._naturalHeight
  //                 };

  //               case "text":
  //                 return {
  //                   ...baseLayer,
  //                   text: layer.name || "New Text", // Ensure text field is included
  //                   fontSize: layer.fontSize || 22,
  //                   color: layer.color || "#000000",
  //                 };

  //               case "printarea":
  //                 return {
  //                   ...baseLayer,
  //                   name: layer.name || "",
  //                   _naturalWidth: layer._naturalWidth,
  //                   _naturalHeight: layer._naturalHeight,
  //                   hasImage: !!layer.hasImage,
  //                   imageSrc: layer.imageSrc || null,
  //                   fit: layer.fit || "cover",
  //                   border: layer.border !== false,
  //                   perspective: layer.perspective || 0,
  //                   rotateX: layer.rotateX || 0,
  //                   rotateY: layer.rotateY || 0,
  //                   rotateZ: layer.rotateZ || 0,
  //                   skewX: layer.skewX || 0,
  //                   skewY: layer.skewY || 0,
  //                   transformOrigin: layer.transformOrigin || "center center",
  //                   enablePerspective: !!layer.enablePerspective,
  //                   corners: layer.corners || [
  //                     { x: 0, y: 0 },
  //                     { x: layer.width || 0, y: 0 },
  //                     { x: layer.width || 0, y: layer.height || 0 },
  //                     { x: 0, y: layer.height || 0 }
  //                   ]
  //                 };

  //               case "image":
  //                 return {
  //                   ...baseLayer,
  //                   src: layer.src,
  //                   _naturalWidth: layer._naturalWidth,
  //                   _naturalHeight: layer._naturalHeight,
  //                   fit: layer.fit || "contain",
  //                   perspective: layer.perspective || 0,
  //                   rotateX: layer.rotateX || 0,
  //                   rotateY: layer.rotateY || 0,
  //                   rotateZ: layer.rotateZ || 0,
  //                   skewX: layer.skewX || 0,
  //                   skewY: layer.skewY || 0,
  //                   transformOrigin: layer.transformOrigin || "center center",
  //                   enablePerspective: !!layer.enablePerspective,
  //                   corners: layer.corners || [
  //                     { x: 0, y: 0 },
  //                     { x: layer.width || 0, y: 0 },
  //                     { x: layer.width || 0, y: layer.height || 0 },
  //                     { x: 0, y: layer.height || 0 }
  //                   ]
  //                 };

  //               default:
  //                 return baseLayer;
  //             }
  //           });

  //           setLayers(formattedLayers);

  //           // Select last layer if available
  //           if (formattedLayers.length > 0) {
  //             setSelectedLayerId(formattedLayers[formattedLayers.length - 1].id);
  //           }

  //           return; // Exit early if we have saved layers
  //         }
  //       } catch (error) {
  //         console.error("Failed to load saved layers:", error);
  //       }
  //     }

  //     // 3. Fallback: Create background from mockup
  //     if (savedMockup) {
  //       const parsed = JSON.parse(savedMockup);
  //       const img = new Image();
  //       img.onload = function () {
  //         const naturalWidth = this.naturalWidth;
  //         const naturalHeight = this.naturalHeight;

  //         // const MAX_DISPLAY_SIZE = 1000;
  //         // let displayWidth = naturalWidth;
  //         // let displayHeight = naturalHeight;

  //         // if (naturalWidth > MAX_DISPLAY_SIZE || naturalHeight > MAX_DISPLAY_SIZE) {
  //         //   const widthRatio = MAX_DISPLAY_SIZE / naturalWidth;
  //         //   const heightRatio = MAX_DISPLAY_SIZE / naturalHeight;
  //         //   const minRatio = Math.min(widthRatio, heightRatio);

  //         //   displayWidth = Math.floor(naturalWidth * minRatio);
  //         //   displayHeight = Math.floor(naturalHeight * minRatio);
  //         // }

  //         // DON'T UPSCALE: use original natural dimensions, but scale DOWN if larger than viewport
  //         let displayWidth = naturalWidth;
  //         let displayHeight = naturalHeight;

  //         // compute available space (90% of viewport)
  //         const maxViewportWidth = window.innerWidth * 0.9;
  //         const maxViewportHeight = window.innerHeight * 0.9;

  //         // compute ratio to scale down if needed; the `1` prevents upscaling
  //         const widthRatio = maxViewportWidth / naturalWidth;
  //         const heightRatio = maxViewportHeight / naturalHeight;
  //         const scaleDownRatio = Math.min(widthRatio, heightRatio, 1); // <= 1

  //         displayWidth = Math.floor(naturalWidth * scaleDownRatio);
  //         displayHeight = Math.floor(naturalHeight * scaleDownRatio);


  //         setLayersWithHistory([
  //           {
  //             id: "layer-bg",
  //             type: "background",
  //             src: parsed.url,
  //             x: 0,
  //             y: 0,
  //             width: displayWidth,
  //             height: displayHeight,
  //             _naturalWidth: naturalWidth,
  //             _naturalHeight: naturalHeight,
  //             rotation: 0,
  //             opacity: 1,
  //             locked: true,
  //             visible: true,
  //           }
  //         ], { recordHistory: false });

  //         setSelectedLayerId("layer-bg");
  //       };
  //       img.src = parsed.url;
  //     }
  //   };

  //   loadEditorData();
  // }, [editId]);
  // ============================== above working
  useEffect(() => {
    const loadEditorData = async () => {
      // 1. First load mockup
      const savedMockup = localStorage.getItem("mockupToEdit");
      if (savedMockup) {
        const parsed = JSON.parse(savedMockup);
        setMockup(parsed);
      }

      // 2. Try to load saved layers from API
      if (editId) {
        try {
          const response = await getLayersByProductId(editId);

          if (response.success && response.data && response.data.length > 0) {
            // Pehle canvas size calculate karo (background image ke through)
            const bgLayer = response.data.find(l => l.type === "background");
            let canvasWidth = bgLayer?._naturalWidth || 800;
            let canvasHeight = bgLayer?._naturalHeight || 800;

            if (bgLayer && bgLayer._naturalWidth && bgLayer._naturalHeight) {
              canvasWidth = bgLayer._naturalWidth;
              canvasHeight = bgLayer._naturalHeight;
            } else if (savedMockup) {
              // Agar background layer nahi hai to mockup se size lo
              const img = new Promise((resolve) => {
                const image = new Image();
                image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
                image.src = JSON.parse(savedMockup).url;
              });
              const dimensions = await img;
              canvasWidth = dimensions.width;
              canvasHeight = dimensions.height;
            }

            // Format and set layers with PERCENTAGE to ABSOLUTE conversion
            const formattedLayers = response.data.map(layer => {
              // Convert percentage to absolute values
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

              // Add type-specific fields
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
                    text: layer.name || "New Text",
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

            // Select last layer if available
            if (formattedLayers.length > 0) {
              setSelectedLayerId(formattedLayers[formattedLayers.length - 1].id);
            }

            return; // Exit early if we have saved layers
          }
        } catch (error) {
          console.error("Failed to load saved layers:", error);
        }
      }

      // 3. Fallback: Create background from mockup
      // if (savedMockup) {
      //   const parsed = JSON.parse(savedMockup);
      //   const img = new Image();
      //   img.onload = function () {
      //     const naturalWidth = this.naturalWidth;
      //     const naturalHeight = this.naturalHeight;

      //     // const MAX_DISPLAY_SIZE = 1000;
      //     // let displayWidth = naturalWidth;
      //     // let displayHeight = naturalHeight;

      //     // if (naturalWidth > MAX_DISPLAY_SIZE || naturalHeight > MAX_DISPLAY_SIZE) {
      //     //   const widthRatio = MAX_DISPLAY_SIZE / naturalWidth;
      //     //   const heightRatio = MAX_DISPLAY_SIZE / naturalHeight;
      //     //   const minRatio = Math.min(widthRatio, heightRatio);

      //     //   displayWidth = Math.floor(naturalWidth * minRatio);
      //     //   displayHeight = Math.floor(naturalHeight * minRatio);
      //     // }

      //     // DON'T UPSCALE: use original natural dimensions, but scale DOWN if larger than viewport
      //     let displayWidth = naturalWidth;
      //     let displayHeight = naturalHeight;

      //     // compute available space (90% of viewport)
      //     const maxViewportWidth = window.innerWidth * 0.9;
      //     const maxViewportHeight = window.innerHeight * 0.9;

      //     // compute ratio to scale down if needed; the `1` prevents upscaling
      //     const widthRatio = maxViewportWidth / naturalWidth;
      //     const heightRatio = maxViewportHeight / naturalHeight;
      //     const scaleDownRatio = Math.min(widthRatio, heightRatio, 1); // <= 1

      //     displayWidth = Math.floor(naturalWidth * scaleDownRatio);
      //     displayHeight = Math.floor(naturalHeight * scaleDownRatio);


      //     setLayersWithHistory([
      //       {
      //         id: "layer-bg",
      //         type: "background",
      //         src: parsed.url,
      //         x: 0,
      //         y: 0,
      //         width: displayWidth,
      //         height: displayHeight,
      //         _naturalWidth: naturalWidth,
      //         _naturalHeight: naturalHeight,
      //         rotation: 0,
      //         opacity: 1,
      //         locked: true,
      //         visible: true,
      //       }
      //     ], { recordHistory: false });

      //     setSelectedLayerId("layer-bg");
      //   };
      //   img.src = parsed.url;
      // }

      // Editor.js - initial load mein (around line 280-300)

      // Fallback: Create background from mockup
      if (savedMockup) {
        const parsed = JSON.parse(savedMockup);
        const img = new Image();
        img.onload = function () {
          const naturalWidth = this.naturalWidth;
          const naturalHeight = this.naturalHeight;

          // ✅ DIRECTLY USE ORIGINAL SIZE - NO SCALING
          setLayersWithHistory([
            {
              id: "layer-bg",
              type: "background",
              src: parsed.url,
              x: 0,
              y: 0,
              width: naturalWidth,        // ← Original width
              height: naturalHeight,      // ← Original height
              _naturalWidth: naturalWidth,
              _naturalHeight: naturalHeight,
              rotation: 0,
              opacity: 1,
              locked: true,
              visible: true,
            }
          ], { recordHistory: false });

          setSelectedLayerId("layer-bg");
        };
        img.src = parsed.url;
      }
    };

    loadEditorData();
  }, [editId]);

  // Editor.js - onSave function me

  const onSave = async () => {
    try {
      if (!editId) {
        alert("Product ID not found!");
        return;
      }
      setIsSaving(true);

      const canvasSize = getCanvasSize();
      // ✅ Use ORIGINAL dimensions for percentage calculation
      const originalWidth = canvasSize.originalWidth || canvasSize.width;
      const originalHeight = canvasSize.originalHeight || canvasSize.height;

      // Convert ALL layers positions to PERCENTAGE before saving
      const layersWithPercentage = layers.map(layer => {
        const layerCopy = { ...layer };

        if (layer.type === "background") {
          layerCopy.x = 0;
          layerCopy.y = 0;
          layerCopy.width = originalWidth;
          layerCopy.height = originalHeight;
          return layerCopy;
        }

        // ✅ Use ORIGINAL dimensions for percentage calculation
        layerCopy.x_percent = (layer.x / originalWidth) * 100;
        layerCopy.y_percent = (layer.y / originalHeight) * 100;
        layerCopy.width_percent = (layer.width / originalWidth) * 100;
        layerCopy.height_percent = (layer.height / originalHeight) * 100;

        return layerCopy;
      });

      // Collect ALL layers that have blob URLs
      const layersWithBlobs = layers.filter(layer => {
        if (layer.type === "printarea" && layer.hasImage && layer.imageSrc && layer.imageSrc.startsWith("blob:")) return true;
        if (layer.type === "image" && layer.src && layer.src.startsWith("blob:")) return true;
        if (layer.type === "background" && layer.src && layer.src.startsWith("blob:")) return true;
        return false;
      });

      // Prepare serializable layers JSON (replace blobs with placeholder)
      const serializable = layersWithPercentage.map(l => {
        const layerCopy = { ...l };
        layerCopy.productId = editId;
        delete layerCopy.__v;
        if (layerCopy._id && (layerCopy._id.toString().startsWith('layer-') || layerCopy._id.toString().startsWith('printarea-'))) {
          delete layerCopy._id;
        }
        if (layerCopy._id && !/^[0-9a-fA-F]{24}$/.test(layerCopy._id.toString())) delete layerCopy._id;

        // Mark blob placeholders for all types
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

      if (layersWithBlobs.length > 0) {
        savedData = await uploadLayersWithImages(editId, serializable, layersWithBlobs, "PUT");
      } else {
        const updateResponse = await updateLayers(editId, serializable);
        if (!updateResponse.success) throw new Error(updateResponse.message || "Update failed");
        savedData = updateResponse.data || updateResponse.layers;
      }

      if (Array.isArray(savedData) && savedData.length > 0) {
        setLayers(savedData.map(item => ({ ...item, id: item._id?.toString() || item.id })));
      }

      localStorage.setItem(`layers_${editId}`, JSON.stringify(savedData));
      alert("Saved successfully");
      navigate(-1);

    } catch (err) {
      console.error("onSave error:", err);
      alert("Error: " + (err.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  // ================= UPLOAD HELPER =================
  const uploadLayersWithImages = async (productId, layersData, layersWithBlobs, method = "PUT") => {
    try {
      console.log("=== uploadLayersWithImages ===");
      // layersWithBlobs must be in same order as files appended
      const formData = new FormData();
      formData.append("productId", productId);

      // Append layers JSON (clean)
      const cleaned = layersData.map(layer => {
        const c = { ...layer };
        delete c._id;
        delete c.__v;
        delete c.createdAt;
        delete c.updatedAt;
        return c;
      });
      formData.append("layers", JSON.stringify(cleaned));

      // We'll append all files using same fieldname "files"
      const layerIds = [];

      // convert each blob url => File and append
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
          formData.append("files", file);   // use generic "files" field
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

      const token = localStorage.getItem("token");
      const endpoint = method === "PUT" ? `${BaseUrl}/api/layers/${productId}` : `${BaseUrl}/api/layers`;

      const response = await fetch(endpoint, {
        method,
        headers: { "Authorization": `Bearer ${token}` }, // do NOT set Content-Type
        body: formData
      });

      // If server returns HTML error page, show it in console for debugging
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

  const getCanvasSize = () => {
    const bgLayer = layers.find(l => l.type === "background");

    if (bgLayer && bgLayer._naturalWidth && bgLayer._naturalHeight) {
      const originalWidth = bgLayer._naturalWidth;
      const originalHeight = bgLayer._naturalHeight;

      // Viewport ke hisaab se display size calculate karo
      const maxViewportWidth = window.innerWidth * 0.6; // Panels ke liye space
      const maxViewportHeight = window.innerHeight * 0.8;

      const widthRatio = maxViewportWidth / originalWidth;
      const heightRatio = maxViewportHeight / originalHeight;
      const displayScale = Math.min(widthRatio, heightRatio, 1);

      return {
        // ✅ Display ke liye scaled size
        displayWidth: Math.floor(originalWidth * displayScale),
        displayHeight: Math.floor(originalHeight * displayScale),
        // ✅ Original size (calculation ke liye)
        originalWidth: originalWidth,
        originalHeight: originalHeight,
        // ✅ Scale factor
        scaleFactor: displayScale
      };
    }

    // Default
    return {
      displayWidth: 800,
      displayHeight: 800,
      originalWidth: 800,
      originalHeight: 800,
      scaleFactor: 1
    };
  };

  // const getCanvasSize = () => {
  //   // 1. Pehle background layer dekho
  //   const bgLayer = layers.find(l => l.type === "background");

  //   if (bgLayer && bgLayer._naturalWidth && bgLayer._naturalHeight) {
  //     // ✅ ALWAYS use original background size for canvas
  //     const originalWidth = bgLayer._naturalWidth;
  //     const originalHeight = bgLayer._naturalHeight;

  //     // ✅ Calculate maximum available screen space (90% of viewport)
  //     const maxViewportWidth = window.innerWidth * 0.9;
  //     const maxViewportHeight = window.innerHeight * 0.9;

  //     // ✅ Calculate scaling to fit within viewport while maintaining aspect ratio
  //     const widthRatio = maxViewportWidth / originalWidth;
  //     const heightRatio = maxViewportHeight / originalHeight;
  //     const minRatio = Math.min(widthRatio, heightRatio, 1); // Don't scale up beyond original

  //     return {
  //       width: Math.floor(originalWidth * minRatio),
  //       height: Math.floor(originalHeight * minRatio),
  //       scaleFactor: minRatio
  //     };
  //   }

  //   // Default - Agar background nahi hai
  //   return { width: 800, height: 800, scaleFactor: 1 };
  // };

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

  // const addPrintAreaToCanvas = (printArea) => {
  //   const canvasSize = getCanvasSize();


  //   // ✅ Pixels ko inches mein convert karo
  //   const printAreaWidthInInches = printArea.width / PRINT_DPI;
  //   const printAreaHeightInInches = printArea.height / PRINT_DPI;

  //   // ✅ Canvas size bhi inches mein convert karo
  //   const canvasWidthInInches = canvasSize.width / SCREEN_DPI;
  //   const canvasHeightInInches = canvasSize.height / SCREEN_DPI;

  //   // ✅ Photoshop ki tarah: Printarea ko canvas ke 70-80% tak scale karo
  //   const maxWidthInInches = canvasWidthInInches * 0.8;
  //   const maxHeightInInches = canvasHeightInInches * 0.8;

  //   let finalWidthInInches = printAreaWidthInInches;
  //   let finalHeightInInches = printAreaHeightInInches;

  //   // Agar print area canvas se bara hai, scale down karo
  //   if (printAreaWidthInInches > maxWidthInInches ||
  //     printAreaHeightInInches > maxHeightInInches) {

  //     const widthRatio = maxWidthInInches / printAreaWidthInInches;
  //     const heightRatio = maxHeightInInches / printAreaHeightInInches;
  //     const minRatio = Math.min(widthRatio, heightRatio);

  //     finalWidthInInches = printAreaWidthInInches * minRatio;
  //     finalHeightInInches = printAreaHeightInInches * minRatio;
  //   }

  //   // ✅ Inches ko wapas pixels mein convert (SCREEN DPI use karo)
  //   // const finalWidth = Math.round(finalWidthInInches * SCREEN_DPI);
  //   // const finalHeight = Math.round(finalHeightInInches * SCREEN_DPI);
  //   const finalWidth = printArea.width;
  //   const finalHeight = printArea.height;

  //   // Center position calculate karo
  //   const x = Math.max(0, (canvasSize.width - finalWidth) / 2);
  //   const y = Math.max(0, (canvasSize.height - finalHeight) / 2);

  //   const newLayer = {
  //     id: `printarea-${Date.now()}`,
  //     type: "printarea",
  //     name: printArea.displayName || "",
  //     x: x,
  //     y: y,
  //     width: finalWidth,
  //     height: finalHeight,
  //     _naturalHeight: printArea.height,
  //     _naturalWidth: printArea.width,
  //     rotation: 0,
  //     opacity: 1,
  //     visible: true,
  //     hasImage: false,
  //     imageSrc: null,
  //     fit: "cover",
  //     border: true,
  //     locked: false,
  //     perspective: 0,
  //     rotateX: 0,
  //     rotateY: 0,
  //     rotateZ: 0,
  //     skewX: 0,
  //     skewY: 0,
  //     transformOrigin: "center center",
  //     enablePerspective: false,
  //     corners: [
  //       { x: 0, y: 0 },
  //       { x: finalWidth, y: 0 },
  //       { x: finalWidth, y: finalHeight },
  //       { x: 0, y: finalHeight }
  //     ]
  //   };

  //   setLayersWithHistory((prev) => [...prev, newLayer]);
  //   setSelectedLayerId(newLayer.id);
  // };

  const addPrintAreaToCanvas = (printArea) => {
    const canvasSize = getCanvasSize();
    const originalWidth = canvasSize.originalWidth;
    const originalHeight = canvasSize.originalHeight;

    // Print area ke original dimensions (in pixels)
    let finalWidth = printArea.width;
    let finalHeight = printArea.height;

    // Optional: Scale down agar print area canvas se bada ho (80% tak)
    const maxWidth = originalWidth * 0.8;
    const maxHeight = originalHeight * 0.8;

    if (finalWidth > maxWidth || finalHeight > maxHeight) {
      const widthRatio = maxWidth / finalWidth;
      const heightRatio = maxHeight / finalHeight;
      const scaleRatio = Math.min(widthRatio, heightRatio);
      finalWidth = Math.floor(finalWidth * scaleRatio);
      finalHeight = Math.floor(finalHeight * scaleRatio);
    }

    // Center position (original coordinates)
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

  //   // ✅ Use existing corners or create default
  //   const startCorners = layer.corners || [
  //     { x: 0, y: 0 },
  //     { x: layer.width, y: 0 },
  //     { x: layer.width, y: layer.height },
  //     { x: 0, y: layer.height }
  //   ];

  //   const onMove = (ev) => {
  //     const deltaX = (ev.clientX - startX) / scale;
  //     const deltaY = (ev.clientY - startY) / scale;

  //     const newCorners = [...startCorners];
  //     newCorners[cornerIndex] = {
  //       x: Math.max(0, Math.min(layer.width, startCorners[cornerIndex].x + deltaX)),
  //       y: Math.max(0, Math.min(layer.height, startCorners[cornerIndex].y + deltaY))
  //     };

  //     // ✅ DIRECT UPDATE - No transform calculations
  //     updateLayer(layerId, { corners: newCorners });
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

    const canvasSize = getCanvasSize();
    const scaleFactor = canvasSize.displayWidth / canvasSize.originalWidth; // same as before

    const canvasRect = canvasEl.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;

    const startCorners = layer.corners || [
      { x: 0, y: 0 },
      { x: layer.width, y: 0 },
      { x: layer.width, y: layer.height },
      { x: 0, y: layer.height }
    ];

    const onMove = (ev) => {
      // Mouse movement ko original coordinates mein convert karo
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

  const handleZoomIn = () => {
    setScale((prev) => Math.min(3, prev + 0.1));
  };
  // const handleZoomIn = () => {
  //   setScale((s) => {
  //     const newScale = Math.min(4, +(s * 1.2).toFixed(2)); // 20% increment
  //     return newScale;
  //   });
  // };
  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.3, prev - 0.1));
  };
  // const handleZoomOut = () => {
  //   setScale((s) => {
  //     const newScale = Math.max(0.1, +(s / 1.2).toFixed(2)); // 20% decrement
  //     return newScale;
  //   });
  // };
  const handleZoomReset = () => {
    setScale(1);
    setCanvasOffset({ x: 0, y: 0 });
  };
  // const handleZoomReset = () => {
  //   setScale(1);
  //   setCanvasOffset({ x: 0, y: 0 }); // Reset panning bhi
  // };

  // Zoom to fit function add karo (Photoshop ki tarah)
  const handleZoomToFit = () => {
    const canvasContainer = canvasRef.current;
    if (!canvasContainer || !mockup) return;

    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;
    const canvasSize = getCanvasSize();

    const widthRatio = containerWidth / canvasSize.displayWidth;
    const heightRatio = containerHeight / canvasSize.displayHeight;
    const minRatio = Math.min(widthRatio, heightRatio) * 0.95; // 95% tak

    setScale(minRatio);
    setCanvasOffset({ x: 0, y: 0 }); // Center mein le aao
  };


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
    isSaving: isSaving, // Pass the state
    setIsSaving: setIsSaving, // Pass the setter
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleZoomToFit,
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
            activePanel={activePanel}
            canvasOffset={canvasOffset} setCanvasOffset={setCanvasOffset}// ✅ ADD THIS PROP
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