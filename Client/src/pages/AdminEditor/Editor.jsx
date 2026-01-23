// ==================================================== ORGANIZED CODE ==================
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../api/product.api";
import { toPng, toJpeg } from "html-to-image";
import { useEditorHistory } from "./hooks/useEditorHistory";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import EditorHeader from "./components/EditorHeader";
import EditorCanvas from "./components/EditorCanvas";
import EditorLayersPanel from "./components/EditorLayersPanel";
import EditorPropertiesPanel from "./components/EditorPropertiesPanel";
// import { createLayer, getLayersByProductId } from "../../api/layers.api";
import {
  createLayer,
  getLayersByProductId,
  updateLayers,
  createLayers
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
  // useEffect(() => {
  //   const savedMockup = localStorage.getItem("mockupToEdit");

  //   console.log(savedMockup, " <<<<  savedMockup")
  //   if (savedMockup) {
  //     const parsed = JSON.parse(savedMockup);
  //     setMockup(parsed);

  //     // Pehle image load karo size ke liye
  //     const img = new Image();
  //     img.onload = function () {
  //       const naturalWidth = this.naturalWidth;
  //       const naturalHeight = this.naturalHeight;

  //       // MAXIMUM DISPLAY SIZE SET KARO
  //       const MAX_DISPLAY_SIZE = 1000;
  //       let displayWidth = naturalWidth;
  //       let displayHeight = naturalHeight;

  //       // Agar image bohat bari hai, toh scale down karo
  //       if (naturalWidth > MAX_DISPLAY_SIZE || naturalHeight > MAX_DISPLAY_SIZE) {
  //         const widthRatio = MAX_DISPLAY_SIZE / naturalWidth;
  //         const heightRatio = MAX_DISPLAY_SIZE / naturalHeight;
  //         const minRatio = Math.min(widthRatio, heightRatio);

  //         displayWidth = Math.floor(naturalWidth * minRatio);
  //         displayHeight = Math.floor(naturalHeight * minRatio);
  //       }

  //       setLayersWithHistory(
  //         [
  //           {
  //             id: "layer-bg",
  //             type: "background",
  //             src: parsed.url,
  //             x: 0,
  //             y: 0,
  //             width: displayWidth, // ✅ Scaled width
  //             height: displayHeight, // ✅ Scaled height
  //             _naturalWidth: naturalWidth, // Original size store karo
  //             _naturalHeight: naturalHeight,
  //             rotation: 0,
  //             opacity: 1,
  //             locked: true,
  //             visible: true,
  //           },
  //         ],
  //         { recordHistory: false }
  //       );
  //       setSelectedLayerId("layer-bg");
  //     };
  //     img.src = parsed.url;
  //   }
  // }, []);

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


  const addImageLayerFromFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);

    const img = new Image();
    img.onload = function () {
      const naturalWidth = this.naturalWidth;
      const naturalHeight = this.naturalHeight;

      const canvasSize = getCanvasSize();

      // ✅ Assume image ka DPI 72 (web images) ya 300 (print images)
      // Aap file ke metadata se DPI get kar sakte hain, lekin simple solution:
      const ASSUMED_IMAGE_DPI = 300; // Photoshop default

      // Image size in inches
      const imageWidthInInches = naturalWidth / ASSUMED_IMAGE_DPI;
      const imageHeightInInches = naturalHeight / ASSUMED_IMAGE_DPI;

      // Canvas size in inches (screen DPI)
      const canvasWidthInInches = canvasSize.width / SCREEN_DPI;
      const canvasHeightInInches = canvasSize.height / SCREEN_DPI;

      // Max size: canvas ka 60-70%
      const maxWidthInInches = canvasWidthInInches * 0.7;
      const maxHeightInInches = canvasHeightInInches * 0.7;

      let finalWidthInInches = imageWidthInInches;
      let finalHeightInInches = imageHeightInInches;

      // Scale down if needed
      if (imageWidthInInches > maxWidthInInches ||
        imageHeightInInches > maxHeightInInches) {

        const widthRatio = maxWidthInInches / imageWidthInInches;
        const heightRatio = maxHeightInInches / imageHeightInInches;
        const minRatio = Math.min(widthRatio, heightRatio);

        finalWidthInInches = imageWidthInInches * minRatio;
        finalHeightInInches = imageHeightInInches * minRatio;
      }

      // ✅ Convert back to pixels (screen DPI)
      const finalWidth = naturalWidth;
      const finalHeight = naturalHeight;

      // Center position
      const x = Math.max(0, (canvasSize.width - finalWidth) / 2);
      const y = Math.max(0, (canvasSize.height - finalHeight) / 2);


      const newLayer = {
        id: `layer-${Date.now()}`,
        type: "image",
        src: url,
        name: "",
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

  // Initial load - saved layers fetch karo

  // Replace your initial useEffect with this optimized version
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
            // Format and set layers
            const formattedLayers = response.data.map(layer => {
              const baseLayer = {
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
                name: layer.name || "",
                // Add other common fields if they exist
                ...(layer.productId && { productId: layer.productId }),
              };

              // Add type-specific fields
              switch (layer.type) {
                case "background":
                  return {
                    ...baseLayer,
                    src: layer.src,
                    _naturalWidth: layer._naturalWidth,
                    _naturalHeight: layer._naturalHeight
                  };

                case "text":
                  return {
                    ...baseLayer,
                    text: layer.name || "New Text", // Ensure text field is included
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
                      { x: layer.width || 0, y: 0 },
                      { x: layer.width || 0, y: layer.height || 0 },
                      { x: 0, y: layer.height || 0 }
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
                      { x: layer.width || 0, y: 0 },
                      { x: layer.width || 0, y: layer.height || 0 },
                      { x: 0, y: layer.height || 0 }
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
      if (savedMockup) {
        const parsed = JSON.parse(savedMockup);
        const img = new Image();
        img.onload = function () {
          const naturalWidth = this.naturalWidth;
          const naturalHeight = this.naturalHeight;

          const MAX_DISPLAY_SIZE = 1000;
          let displayWidth = naturalWidth;
          let displayHeight = naturalHeight;

          if (naturalWidth > MAX_DISPLAY_SIZE || naturalHeight > MAX_DISPLAY_SIZE) {
            const widthRatio = MAX_DISPLAY_SIZE / naturalWidth;
            const heightRatio = MAX_DISPLAY_SIZE / naturalHeight;
            const minRatio = Math.min(widthRatio, heightRatio);

            displayWidth = Math.floor(naturalWidth * minRatio);
            displayHeight = Math.floor(naturalHeight * minRatio);
          }

          setLayersWithHistory([
            {
              id: "layer-bg",
              type: "background",
              src: parsed.url,
              x: 0,
              y: 0,
              width: displayWidth,
              height: displayHeight,
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

  const onSave = async () => {
    try {
      if (!editId) {
        alert("Product ID not found!");
        return;
      }

      // Set saving state
      setIsSaving(true);

      // 1. Find printarea layer with blob image
      const printareaLayers = layers.filter(layer =>
        layer.type === "printarea" &&
        layer.hasImage &&
        layer.imageSrc &&
        layer.imageSrc.startsWith("blob:")
      );

      console.log("Printarea layers with blob images:", printareaLayers);

      // 2. Prepare layers data (excluding blob URLs)
      const serializable = layers.map((l) => {
        const layerCopy = { ...l };

        // Ensure productId is set
        layerCopy.productId = editId;

        // Remove React-specific or temporary fields
        delete layerCopy.__v;

        // Handle _id - if it's a temporary ID (starts with 'layer-' or 'printarea-'), remove it
        if (
          layerCopy._id &&
          (layerCopy._id.toString().startsWith('layer-') ||
            layerCopy._id.toString().startsWith('printarea-'))
        ) {
          delete layerCopy._id;
        }

        // If _id is ObjectId format (24 hex chars), keep it for updates
        if (layerCopy._id && !/^[0-9a-fA-F]{24}$/.test(layerCopy._id.toString())) {
          delete layerCopy._id;
        }

        // Convert corners to proper format if they exist
        if (layerCopy.corners && Array.isArray(layerCopy.corners)) {
          layerCopy.corners = layerCopy.corners.map((corner) => ({
            x: Number(corner.x) || 0,
            y: Number(corner.y) || 0,
          }));
        }

        // Ensure all numeric fields are numbers
        const numericFields = [
          'x', 'y', 'width', 'height', 'rotation', 'opacity',
          'perspective', 'rotateX', 'rotateY', 'rotateZ',
          'skewX', 'skewY', '_naturalWidth', '_naturalHeight',
        ];

        numericFields.forEach((field) => {
          if (layerCopy[field] !== undefined) {
            layerCopy[field] = Number(layerCopy[field]) || 0;
          }
        });

        // Ensure boolean fields are booleans
        const booleanFields = ['locked', 'visible', 'hasImage', 'border', 'enablePerspective'];
        booleanFields.forEach((field) => {
          if (layerCopy[field] !== undefined) {
            layerCopy[field] = Boolean(layerCopy[field]);
          }
        });

        // Ensure id field exists (use _id if no id)
        if (!layerCopy.id && layerCopy._id) {
          layerCopy.id = layerCopy._id.toString();
        }

        // For printarea layers, mark blob URLs for processing
        if (layerCopy.type === "printarea" &&
          layerCopy.imageSrc &&
          layerCopy.imageSrc.startsWith("blob:")) {
          // Mark that this needs image upload
          layerCopy._needsImageUpload = true;
          // Don't send blob URL to backend
          layerCopy.imageSrc = "UPLOADING";
        }

        return layerCopy;
      });

      console.log("Prepared layers data:", serializable);

      let saveSuccessful = false;
      let savedData = null;

      // 3. If there are printarea images to upload, use FormData approach
      if (printareaLayers.length > 0) {
        console.log("Using FormData to upload printarea images...");

        // Try PUT first (update)
        try {
          const result = await uploadLayersWithImages(editId, serializable, printareaLayers, "PUT");
          saveSuccessful = true;
          savedData = result.data;

          // Update local state
          if (savedData && savedData.length > 0) {
            const updatedLayers = savedData.map((layer) => {
              const formattedLayer = { ...layer };
              if (!formattedLayer.id && formattedLayer._id) {
                formattedLayer.id = formattedLayer._id.toString();
              }
              return formattedLayer;
            });
            setLayers(updatedLayers);
          }

          alert("Layers updated successfully with images!");
        } catch (putError) {
          console.log("PUT with images failed, trying POST...", putError);

          // Try POST (create)
          try {
            const result = await uploadLayersWithImages(editId, serializable, printareaLayers, "POST");
            saveSuccessful = true;
            savedData = result.data;

            // Update local state
            if (savedData && savedData.length > 0) {
              const updatedLayers = savedData.map((layer) => {
                const formattedLayer = { ...layer };
                if (!formattedLayer.id && formattedLayer._id) {
                  formattedLayer.id = formattedLayer._id.toString();
                }
                return formattedLayer;
              });
              setLayers(updatedLayers);
            }

            alert("New layers saved successfully with images!");
          } catch (postError) {
            throw new Error("Failed to save with images: " + postError.message);
          }
        }
      } else {
        // 4. No images to upload, use existing JSON approach
        console.log("No images to upload, using existing JSON approach...");

        try {
          const updateResponse = await updateLayers(editId, serializable);

          if (updateResponse && updateResponse.success) {
            saveSuccessful = true;
            savedData = updateResponse.data || updateResponse.layers;
            console.log("Layers updated successfully:", savedData);

            // Update local layers
            if (savedData && savedData.length > 0) {
              const updatedLayers = savedData.map((layer) => {
                const formattedLayer = { ...layer };
                if (!formattedLayer.id && formattedLayer._id) {
                  formattedLayer.id = formattedLayer._id.toString();
                }
                return formattedLayer;
              });
              setLayers(updatedLayers);
            }

            alert("Layers updated successfully!");
          } else {
            console.log("Update API returned error:", updateResponse);
            throw new Error(updateResponse?.message || "Update failed");
          }
        } catch (updateError) {
          console.log("Update endpoint failed, trying POST create...", updateError);

          try {
            const createResponse = await createLayers(editId, serializable);

            if (createResponse.success) {
              saveSuccessful = true;
              savedData = createResponse.data;
              console.log("New layers saved successfully:", savedData);

              if (savedData && savedData.length > 0) {
                const updatedLayers = savedData.map((layer) => {
                  const formattedLayer = { ...layer };
                  if (!formattedLayer.id && formattedLayer._id) {
                    formattedLayer.id = formattedLayer._id.toString();
                  }
                  return formattedLayer;
                });
                setLayers(updatedLayers);
              }

              alert("New layers saved successfully!");
            } else {
              throw new Error(createResponse.message || "Create failed");
            }
          } catch (createError) {
            throw new Error("Both update and create failed: " + createError.message);
          }
        }
      }

      // 5. Save to localStorage as backup
      if (saveSuccessful && savedData) {
        try {
          localStorage.setItem(`layers_${editId}`, JSON.stringify(savedData));
          localStorage.setItem("mockupEditedLayers", JSON.stringify(layers));
          console.log("Saved to localStorage as backup");
        } catch (localStorageError) {
          console.warn("Failed to save to localStorage:", localStorageError);
        }

        const event = new CustomEvent('mockupSaved', {
          detail: {
            productId: editId,
            timestamp: Date.now(),
          },
        });
        window.dispatchEvent(event);

        // Navigate back
        setTimeout(() => {
          navigate(-1);
        }, 500);
      }

    } catch (error) {
      console.error("Error saving layers:", error);

      // Fallback: Try to save to localStorage only
      try {
        localStorage.setItem("mockupEditedLayers", JSON.stringify(layers));
        localStorage.setItem(`layers_${editId}`, JSON.stringify(layers));
        console.log("Saved to localStorage as fallback");
        alert("Saved locally (backend error: " + error.message + ")");
      } catch (localStorageError) {
        console.error("LocalStorage backup failed:", localStorageError);
        alert("Save failed completely: " + error.message);
      }
    } finally {
      // Reset saving state
      setIsSaving(false);
    }
  };

  // ==================== HELPER FUNCTION FOR FORM DATA UPLOAD ====================
const uploadLayersWithImages = async (productId, layersData, printareaLayers, method = "PUT") => {
  try {
    console.log("=== UPLOAD LAYERS WITH IMAGES ===");
    console.log("Printarea layers count:", printareaLayers.length);
    
    // Create FormData
    const formData = new FormData();

    // Add productId
    formData.append("productId", productId);

    // Add layers as JSON - IMPORTANT: Remove _id from each layer
    const cleanedLayersData = layersData.map(layer => {
      const cleanLayer = { ...layer };
      // Remove MongoDB fields to avoid duplicate key error
      delete cleanLayer._id;
      delete cleanLayer.__v;
      delete cleanLayer.createdAt;
      delete cleanLayer.updatedAt;
      return cleanLayer;
    });
    
    const layersJson = JSON.stringify(cleanedLayersData);
    console.log("Layers JSON length:", layersJson.length);
    formData.append("layers", layersJson);

    // Create array of layer IDs that have images
    const layerIdsArray = [];

    // Add each printarea image
    for (let i = 0; i < printareaLayers.length; i++) {
      const layer = printareaLayers[i];
      console.log(`Processing image for layer ${layer.id}...`);

      try {
        // Convert blob URL to blob
        const response = await fetch(layer.imageSrc);
        const blob = await response.blob();

        // Create file from blob
        const file = new File([blob], `printarea-${layer.id}.png`, {
          type: "image/png"
        });

        // Append to form data - SAME field name for multiple files
        formData.append("printareaImages", file);
        
        // Add layer ID to array
        layerIdsArray.push(layer.id);

        console.log(`✓ Added image for layer ${layer.id}: ${file.size} bytes`);

      } catch (blobError) {
        console.error(`✗ Error processing blob for layer ${layer.id}:`, blobError);
      }
    }

    // Append layer IDs as JSON string
    if (layerIdsArray.length > 0) {
      formData.append("layerIds", JSON.stringify(layerIdsArray));
      console.log("Layer IDs to upload:", layerIdsArray);
    }

    // Get token
    const token = localStorage.getItem("token");

    // Determine endpoint
    const endpoint = method === "PUT"
      ? `${BaseUrl}/api/layers/${productId}`
      : `${BaseUrl}/api/layers`;

    console.log(`Sending to: ${endpoint}`);
    console.log(`Total files: ${layerIdsArray.length}`);

    // Make request
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Backend response:", data);

    if (!data.success) {
      throw new Error(data.message || "Upload failed");
    }

    console.log("✓ Upload successful!");
    return data;

  } catch (error) {
    console.error("✗ Error in uploadLayersWithImages:", error);
    throw error;
  }
};

  // const uploadLayersWithImages = async (productId, layersData, printareaLayers, method = "PUT") => {
  //   try {
  //     console.log("=== START uploadLayersWithImages ===");
  //     console.log("Product ID:", productId);
  //     console.log("Layers data count:", layersData.length);
  //     console.log("Printarea layers with images:", printareaLayers.length);

  //     // Create FormData
  //     const formData = new FormData();

  //     // Add productId
  //     formData.append("productId", productId);

  //     // Add layers as JSON string
  //     const layersJson = JSON.stringify(layersData);
  //     console.log("Layers JSON length:", layersJson.length);
  //     formData.append("layers", layersJson);

  //     // Create array of layer IDs that have images
  //     const layerIdsArray = [];

  //     // Add each printarea image
  //     for (let i = 0; i < printareaLayers.length; i++) {
  //       const layer = printareaLayers[i];
  //       console.log(`Processing image for layer ${layer.id}...`);

  //       try {
  //         // Convert blob URL to blob
  //         const response = await fetch(layer.imageSrc);
  //         const blob = await response.blob();

  //         // Create file from blob
  //         const file = new File([blob], `printarea-${layer.id}.png`, {
  //           type: "image/png"
  //         });

  //         // Append to form data with SAME field name for array
  //         formData.append("printareaImages", file);  // ✅ Same name for all files

  //         // Add layer ID to array
  //         layerIdsArray.push(layer.id);

  //         console.log(`✓ Added image for layer ${layer.id}: ${file.size} bytes`);

  //       } catch (blobError) {
  //         console.error(`✗ Error processing blob for layer ${layer.id}:`, blobError);
  //       }
  //     }

  //     // Append layer IDs as JSON string
  //     formData.append("layerIds", JSON.stringify(layerIdsArray));
  //     console.log("Layer IDs to upload:", layerIdsArray);

  //     // 🔥 DEBUG: Log FormData contents
  //     console.log("=== FormData Contents ===");
  //     for (let [key, value] of formData.entries()) {
  //       if (key === 'layers') {
  //         console.log(`${key}: ${typeof value} (${value.length} chars)`);
  //         console.log("First 100 chars:", value.substring(0, 100));
  //       } else if (value instanceof File) {
  //         console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
  //       } else {
  //         console.log(`${key}: ${value} (${typeof value})`);
  //       }
  //     }

  //     // Get token
  //     const token = localStorage.getItem("token");

  //     // Determine endpoint
  //     const endpoint = method === "PUT"
  //       ? `${BaseUrl}/api/layers/${productId}`
  //       : `${BaseUrl}/api/layers`;

  //     console.log(`Sending to: ${endpoint}`);
  //     console.log(`Files: ${layerIdsArray.length}, Method: ${method}`);

  //     // Make request
  //     const response = await fetch(endpoint, {
  //       method: method,
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //       },
  //       body: formData
  //     });

  //     console.log("Response status:", response.status);

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error("Backend error response:", errorText);
  //       throw new Error(`HTTP ${response.status}: ${errorText}`);
  //     }

  //     const data = await response.json();
  //     console.log("Backend response:", data);

  //     if (!data.success) {
  //       throw new Error(data.message || "Upload failed");
  //     }

  //     console.log("✓ Upload successful!");
  //     return data;

  //   } catch (error) {
  //     console.error("✗ Error in uploadLayersWithImages:", error);
  //     throw error;
  //   }
  // };

  // ========================================== last working func
  // const onSave = async () => {
  //   try {
  //     if (!editId) {
  //       alert("Product ID not found!");
  //       return;
  //     }

  //     // Set saving state
  //     setIsSaving(true);

  //     // 1. Prepare layers data
  //     const serializable = layers.map((l) => {
  //       const layerCopy = { ...l };

  //       // Ensure productId is set
  //       layerCopy.productId = editId;

  //       // Remove React-specific or temporary fields
  //       delete layerCopy.__v; // Remove mongoose version key

  //       // Handle _id - if it's a temporary ID (starts with 'layer-' or 'printarea-'), remove it
  //       if (
  //         layerCopy._id &&
  //         (layerCopy._id.toString().startsWith('layer-') ||
  //           layerCopy._id.toString().startsWith('printarea-'))
  //       ) {
  //         delete layerCopy._id;
  //       }

  //       // If _id is ObjectId format (24 hex chars), keep it for updates
  //       if (layerCopy._id && !/^[0-9a-fA-F]{24}$/.test(layerCopy._id.toString())) {
  //         delete layerCopy._id;
  //       }

  //       // Convert corners to proper format if they exist
  //       if (layerCopy.corners && Array.isArray(layerCopy.corners)) {
  //         layerCopy.corners = layerCopy.corners.map((corner) => ({
  //           x: Number(corner.x) || 0,
  //           y: Number(corner.y) || 0,
  //         }));
  //       }

  //       // Ensure all numeric fields are numbers
  //       const numericFields = [
  //         'x',
  //         'y',
  //         'width',
  //         'height',
  //         'rotation',
  //         'opacity',
  //         'perspective',
  //         'rotateX',
  //         'rotateY',
  //         'rotateZ',
  //         'skewX',
  //         'skewY',
  //         '_naturalWidth',
  //         '_naturalHeight',
  //       ];

  //       numericFields.forEach((field) => {
  //         if (layerCopy[field] !== undefined) {
  //           layerCopy[field] = Number(layerCopy[field]) || 0;
  //         }
  //       });

  //       // Ensure boolean fields are booleans
  //       const booleanFields = ['locked', 'visible', 'hasImage', 'border', 'enablePerspective'];
  //       booleanFields.forEach((field) => {
  //         if (layerCopy[field] !== undefined) {
  //           layerCopy[field] = Boolean(layerCopy[field]);
  //         }
  //       });

  //       // Ensure id field exists (use _id if no id)
  //       if (!layerCopy.id && layerCopy._id) {
  //         layerCopy.id = layerCopy._id.toString();
  //       }

  //       return layerCopy;
  //     });

  //     console.log("Prepared layers for save:", serializable);

  //     let saveSuccessful = false;
  //     let savedData = null;

  //     // 2. First try to update using PUT (update existing)
  //     try {
  //       const updateResponse = await updateLayers(editId, serializable);

  //       if (updateResponse && updateResponse.success) {
  //         saveSuccessful = true;
  //         savedData = updateResponse.data || updateResponse.layers;
  //         console.log("Layers updated successfully:", savedData);

  //         // Update local layers with server response (to get proper _id)
  //         if (savedData && savedData.length > 0) {
  //           const updatedLayers = savedData.map((layer) => {
  //             // Ensure layer has both id and _id
  //             const formattedLayer = { ...layer };
  //             if (!formattedLayer.id && formattedLayer._id) {
  //               formattedLayer.id = formattedLayer._id.toString();
  //             }
  //             return formattedLayer;
  //           });

  //           // Update state WITHOUT history (direct update)
  //           setLayers(updatedLayers);
  //         }

  //         alert("Layers updated successfully!");
  //       } else {
  //         console.log("Update API returned error:", updateResponse);
  //         throw new Error(updateResponse?.message || "Update failed");
  //       }
  //     } catch (updateError) {
  //       console.log("Update endpoint failed, trying POST create...", updateError);

  //       // 3. Fallback: Create new using POST
  //       try {
  //         const createResponse = await createLayers(editId, serializable);

  //         if (createResponse.success) {
  //           saveSuccessful = true;
  //           savedData = createResponse.data;
  //           console.log("New layers saved successfully:", savedData);

  //           // Update local state with server response
  //           if (savedData && savedData.length > 0) {
  //             const updatedLayers = savedData.map((layer) => {
  //               const formattedLayer = { ...layer };
  //               if (!formattedLayer.id && formattedLayer._id) {
  //                 formattedLayer.id = formattedLayer._id.toString();
  //               }
  //               return formattedLayer;
  //             });

  //             setLayers(updatedLayers);
  //           }

  //           alert("New layers saved successfully!");
  //         } else {
  //           throw new Error(createResponse.message || "Create failed");
  //         }
  //       } catch (createError) {
  //         console.error("Create also failed:", createError);
  //         throw new Error("Both update and create failed: " + createError.message);
  //       }
  //     }

  //     // 4. Save to localStorage as backup
  //     if (saveSuccessful && savedData) {
  //       try {
  //         localStorage.setItem(`layers_${editId}`, JSON.stringify(savedData));
  //         localStorage.setItem("mockupEditedLayers", JSON.stringify(layers));
  //         console.log("Saved to localStorage as backup");
  //       } catch (localStorageError) {
  //         console.warn("Failed to save to localStorage:", localStorageError);
  //       }

  //       const event = new CustomEvent('mockupSaved', {
  //         detail: {
  //           productId: editId,
  //           timestamp: Date.now(),
  //         },
  //       });
  //       window.dispatchEvent(event);

  //       // Navigate back
  //       setTimeout(() => {
  //         navigate(-1);
  //       }, 500);
  //     }
  //   } catch (error) {
  //     console.error("Error saving layers:", error);

  //     // Fallback: Try to save to localStorage only
  //     try {
  //       localStorage.setItem("mockupEditedLayers", JSON.stringify(layers));
  //       localStorage.setItem(`layers_${editId}`, JSON.stringify(layers));
  //       console.log("Saved to localStorage as fallback");
  //       alert("Saved locally (backend error: " + error.message + ")");
  //     } catch (localStorageError) {
  //       console.error("LocalStorage backup failed:", localStorageError);
  //       alert("Save failed completely: " + error.message);
  //     }
  //   } finally {
  //     // Reset saving state
  //     setIsSaving(false);
  //   }
  // };


  // const getCanvasSize = () => {
  //   // 1. Pehle background layer dekho
  //   const bgLayer = layers.find(l => l.type === "background");

  //   // 2. Agar background layer hai
  //   if (bgLayer && bgLayer.width && bgLayer.height) {
  //     // MAXIMUM CANVAS SIZE SET KARO
  //     const MAX_CANVAS_SIZE = 820; // Max canvas width/height

  //     // Calculate scaled dimensions
  //     let canvasWidth = bgLayer.width;
  //     let canvasHeight = bgLayer.height;

  //     // Agar image bohat bari hai, toh scale down karo
  //     if (bgLayer.width > MAX_CANVAS_SIZE || bgLayer.height > MAX_CANVAS_SIZE) {
  //       const widthRatio = MAX_CANVAS_SIZE / bgLayer.width;
  //       const heightRatio = MAX_CANVAS_SIZE / bgLayer.height;
  //       const minRatio = Math.min(widthRatio, heightRatio);

  //       canvasWidth = Math.floor(bgLayer.width * minRatio);
  //       canvasHeight = Math.floor(bgLayer.height * minRatio);
  //     }

  //     return {
  //       width: canvasWidth,
  //       height: canvasHeight
  //       // width: bgLayer.width,
  //       // height: bgLayer.height
  //     };
  //   }

  //   // 3. Default
  //   return { width: 800, height: 800 };
  // };


  // const getCanvasSize = () => {
  //   // 1. Pehle background layer dekho
  //   const bgLayer = layers.find(l => l.type === "background");

  //   // 2. Agar background layer hai
  //   if (bgLayer && bgLayer.width && bgLayer.height) {
  //     // BACKGROUND IMAGE KA EXACT SIZE USE KARO (No scaling)
  //     return {
  //       width: bgLayer.width,
  //       height: bgLayer.height
  //     };
  //   }

  //   // 3. Default - Agar printarea hai to uske hisaab se
  //   const printAreaLayer = layers.find(l => l.type === "printarea");
  //   if (printAreaLayer) {
  //     return {
  //       width: Math.max(800, printAreaLayer.width),
  //       height: Math.max(800, printAreaLayer.height)
  //     };
  //   }

  //   // 4. Default
  //   return { width: 800, height: 800 };
  // };

  const getCanvasSize = () => {
    // ✅ FIXED CANVAS SIZE - Original background image size nahi use karo
    const MAX_CANVAS_SIZE = 820; // Maximum canvas size

    // 1. Pehle background layer dekho
    const bgLayer = layers.find(l => l.type === "background");

    if (bgLayer && bgLayer.width && bgLayer.height) {
      // ✅ Calculate scaling to fit within MAX_CANVAS_SIZE
      const canvasWidth = Math.min(MAX_CANVAS_SIZE, bgLayer.width);
      const canvasHeight = Math.min(MAX_CANVAS_SIZE, bgLayer.height);

      // ✅ Maintain aspect ratio
      const widthRatio = MAX_CANVAS_SIZE / bgLayer.width;
      const heightRatio = MAX_CANVAS_SIZE / bgLayer.height;
      const minRatio = Math.min(widthRatio, heightRatio);

      return {
        width: Math.floor(bgLayer.width * minRatio),
        height: Math.floor(bgLayer.height * minRatio)
      };
    }

    // 3. Default - Agar background nahi hai
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
    const canvasSize = getCanvasSize();


    // ✅ Pixels ko inches mein convert karo
    const printAreaWidthInInches = printArea.width / PRINT_DPI;
    const printAreaHeightInInches = printArea.height / PRINT_DPI;

    // ✅ Canvas size bhi inches mein convert karo
    const canvasWidthInInches = canvasSize.width / SCREEN_DPI;
    const canvasHeightInInches = canvasSize.height / SCREEN_DPI;

    // ✅ Photoshop ki tarah: Printarea ko canvas ke 70-80% tak scale karo
    const maxWidthInInches = canvasWidthInInches * 0.8;
    const maxHeightInInches = canvasHeightInInches * 0.8;

    let finalWidthInInches = printAreaWidthInInches;
    let finalHeightInInches = printAreaHeightInInches;

    // Agar print area canvas se bara hai, scale down karo
    if (printAreaWidthInInches > maxWidthInInches ||
      printAreaHeightInInches > maxHeightInInches) {

      const widthRatio = maxWidthInInches / printAreaWidthInInches;
      const heightRatio = maxHeightInInches / printAreaHeightInInches;
      const minRatio = Math.min(widthRatio, heightRatio);

      finalWidthInInches = printAreaWidthInInches * minRatio;
      finalHeightInInches = printAreaHeightInInches * minRatio;
    }

    // ✅ Inches ko wapas pixels mein convert (SCREEN DPI use karo)
    // const finalWidth = Math.round(finalWidthInInches * SCREEN_DPI);
    // const finalHeight = Math.round(finalHeightInInches * SCREEN_DPI);
    const finalWidth = printArea.width;
    const finalHeight = printArea.height;

    // Center position calculate karo
    const x = Math.max(0, (canvasSize.width - finalWidth) / 2);
    const y = Math.max(0, (canvasSize.height - finalHeight) / 2);

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

    // ✅ Use existing corners or create default
    const startCorners = layer.corners || [
      { x: 0, y: 0 },
      { x: layer.width, y: 0 },
      { x: layer.width, y: layer.height },
      { x: 0, y: layer.height }
    ];

    const onMove = (ev) => {
      const deltaX = (ev.clientX - startX) / scale;
      const deltaY = (ev.clientY - startY) / scale;

      const newCorners = [...startCorners];
      newCorners[cornerIndex] = {
        x: Math.max(0, Math.min(layer.width, startCorners[cornerIndex].x + deltaX)),
        y: Math.max(0, Math.min(layer.height, startCorners[cornerIndex].y + deltaY))
      };

      // ✅ DIRECT UPDATE - No transform calculations
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

  // const handleZoomIn = () => setScale((s) => Math.min(2, +(s + 0.1).toFixed(2)));
  const handleZoomIn = () => {
    setScale((s) => {
      const newScale = Math.min(4, +(s * 1.2).toFixed(2)); // 20% increment
      return newScale;
    });
  };
  // const handleZoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)));
  const handleZoomOut = () => {
    setScale((s) => {
      const newScale = Math.max(0.1, +(s / 1.2).toFixed(2)); // 20% decrement
      return newScale;
    });
  };
  // const handleZoomReset = () => setScale(1);
  const handleZoomReset = () => {
    setScale(1);
    setCanvasOffset({ x: 0, y: 0 }); // Reset panning bhi
  };

  // Zoom to fit function add karo (Photoshop ki tarah)
  const handleZoomToFit = () => {
    const canvasContainer = canvasRef.current;
    if (!canvasContainer || !mockup) return;

    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;
    const canvasSize = getCanvasSize();

    const widthRatio = containerWidth / canvasSize.width;
    const heightRatio = containerHeight / canvasSize.height;
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