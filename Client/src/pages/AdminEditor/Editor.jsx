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
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

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
  // useEffect(() => {
  //   const savedMockup = localStorage.getItem("mockupToEdit");

  //   console.log(savedMockup, " <<<<  savedMockup")
  //   if (savedMockup) {
  //     const parsed = JSON.parse(savedMockup);
  //     setMockup(parsed);
  //     setLayersWithHistory(
  //       [
  //         {
  //           id: "layer-bg",
  //           type: "background",
  //           src: parsed.url,
  //           x: 0,
  //           y: 0,
  //           width: 800,
  //           height: 800,
  //           rotation: 0,
  //           opacity: 1,
  //           locked: true,
  //           visible: true,
  //         },
  //         // {
  //         //   id: "layer-1",
  //         //   type: "image",
  //         //   src: parsed.url,
  //         //   x: 80,
  //         //   y: 80,
  //         //   width: 640,
  //         //   height: 640,
  //         //   rotation: 0,
  //         //   opacity: 1,
  //         //   visible: true,
  //         // },
  //       ],
  //       { recordHistory: false }
  //     );
  //     setSelectedLayerId("layer-1");
  //   }
  // }, []);

  // Initial load from localStorage

  // Initial load from localStorage
  useEffect(() => {
    const savedMockup = localStorage.getItem("mockupToEdit");

    console.log(savedMockup, " <<<<  savedMockup")
    if (savedMockup) {
      const parsed = JSON.parse(savedMockup);
      setMockup(parsed);

      // Pehle image load karo size ke liye
      const img = new Image();
      img.onload = function () {
        const naturalWidth = this.naturalWidth;
        const naturalHeight = this.naturalHeight;

        // MAXIMUM DISPLAY SIZE SET KARO
        const MAX_DISPLAY_SIZE = 1000;
        let displayWidth = naturalWidth;
        let displayHeight = naturalHeight;

        // Agar image bohat bari hai, toh scale down karo
        if (naturalWidth > MAX_DISPLAY_SIZE || naturalHeight > MAX_DISPLAY_SIZE) {
          const widthRatio = MAX_DISPLAY_SIZE / naturalWidth;
          const heightRatio = MAX_DISPLAY_SIZE / naturalHeight;
          const minRatio = Math.min(widthRatio, heightRatio);

          displayWidth = Math.floor(naturalWidth * minRatio);
          displayHeight = Math.floor(naturalHeight * minRatio);
        }

        setLayersWithHistory(
          [
            {
              id: "layer-bg",
              type: "background",
              src: parsed.url,
              x: 0,
              y: 0,
              width: displayWidth, // ✅ Scaled width
              height: displayHeight, // ✅ Scaled height
              _naturalWidth: naturalWidth, // Original size store karo
              _naturalHeight: naturalHeight,
              rotation: 0,
              opacity: 1,
              locked: true,
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
  // useEffect(() => {
  //   const savedMockup = localStorage.getItem("mockupToEdit");

  //   console.log(savedMockup, " <<<<  savedMockup")
  //   if (savedMockup) {
  //     const parsed = JSON.parse(savedMockup);
  //     setMockup(parsed);

  //     // Pehle image load karo size ke liye
  //     const img = new Image();
  //     img.onload = function () {
  //       const bgWidth = this.naturalWidth;
  //       const bgHeight = this.naturalHeight;

  //       setLayersWithHistory(
  //         [
  //           {
  //             id: "layer-bg",
  //             type: "background",
  //             src: parsed.url,
  //             x: 0,
  //             y: 0,
  //             width: bgWidth, // ✅ Natural width use karo
  //             height: bgHeight, // ✅ Natural height use karo
  //             _naturalWidth: bgWidth, // ✅ Store natural dimensions
  //             _naturalHeight: bgHeight,
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
  //   const newLayer = {
  //     id: `layer-${Date.now()}`,
  //     type: "image",
  //     src: url,
  //     name: "",
  //     x: 120,
  //     y: 120,
  //     width: 300,
  //     height: 200,
  //     rotation: 0,
  //     opacity: 1,
  //     visible: true,
  //     fit: "contain",
  //     locked: false,
  //     perspective: 0,
  //     rotateX: 0,
  //     rotateY: 0,
  //     rotateZ: 0,
  //     skewX: 0,
  //     skewY: 0,
  //     transformOrigin: "center center",
  //     enablePerspective: false,
  //     // NEW (4 points only):
  //     corners: [
  //       { x: 0, y: 0 },     // top-left
  //       { x: 300, y: 0 },   // top-right
  //       { x: 300, y: 200 }, // bottom-right
  //       { x: 0, y: 200 }    // bottom-left
  //     ]
  //   };
  //   setLayersWithHistory((prev) => [...prev, newLayer]);
  //   setSelectedLayerId(newLayer.id);
  // };

  // const addImageLayerFromFile = (file) => {
  //   if (!file) return;
  //   const url = URL.createObjectURL(file);

  //   const img = new Image();
  //   img.onload = function () {
  //     const naturalWidth = this.naturalWidth;
  //     const naturalHeight = this.naturalHeight;

  //     // Canvas size get karo - async handle karo
  //     getCanvasSize().then(canvasSize => {
  //       let finalWidth = naturalWidth;
  //       let finalHeight = naturalHeight;

  //       // Agar image canvas se zyada bari hai, to scale down karo
  //       const maxWidth = canvasSize.width * 0.9;
  //       const maxHeight = canvasSize.height * 0.9;

  //       if (naturalWidth > maxWidth || naturalHeight > maxHeight) {
  //         const widthRatio = maxWidth / naturalWidth;
  //         const heightRatio = maxHeight / naturalHeight;
  //         const minRatio = Math.min(widthRatio, heightRatio);

  //         finalWidth = Math.floor(naturalWidth * minRatio);
  //         finalHeight = Math.floor(naturalHeight * minRatio);
  //       }

  //       // **Center position calculate karo**
  //       const x = Math.max(0, (canvasSize.width - finalWidth) / 2);
  //       const y = Math.max(0, (canvasSize.height - finalHeight) / 2);

  //       const newLayer = {
  //         id: `layer-${Date.now()}`,
  //         type: "image",
  //         src: url,
  //         name: "",
  //         x: x,
  //         y: y,
  //         width: finalWidth,
  //         height: finalHeight,
  //         _naturalWidth: naturalWidth, // ✅ Store natural size
  //         _naturalHeight: naturalHeight,
  //         rotation: 0,
  //         opacity: 1,
  //         visible: true,
  //         fit: "contain",
  //         locked: false,
  //         perspective: 0,
  //         rotateX: 0,
  //         rotateY: 0,
  //         rotateZ: 0,
  //         skewX: 0,
  //         skewY: 0,
  //         transformOrigin: "center center",
  //         enablePerspective: false,
  //         corners: [
  //           { x: 0, y: 0 },
  //           { x: finalWidth, y: 0 },
  //           { x: finalWidth, y: finalHeight },
  //           { x: 0, y: finalHeight }
  //         ]
  //       };

  //       setLayersWithHistory((prev) => [...prev, newLayer]);
  //       setSelectedLayerId(newLayer.id);
  //     });
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

      // Canvas size get karo - SYNC
      const canvasSize = getCanvasSize();

      // MAXIMUM DISPLAY SIZE SET KARO
      const MAX_DISPLAY_SIZE = Math.min(canvasSize.width, canvasSize.height) * 0.8;

      let finalWidth = naturalWidth;
      let finalHeight = naturalHeight;

      // Agar image canvas se zyada bari hai, to scale down karo
      if (naturalWidth > MAX_DISPLAY_SIZE || naturalHeight > MAX_DISPLAY_SIZE) {
        const widthRatio = MAX_DISPLAY_SIZE / naturalWidth;
        const heightRatio = MAX_DISPLAY_SIZE / naturalHeight;
        const minRatio = Math.min(widthRatio, heightRatio);

        finalWidth = Math.floor(naturalWidth * minRatio);
        finalHeight = Math.floor(naturalHeight * minRatio);
      }

      // **Center position calculate karo**
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

  // const addImageLayerFromFile = (file) => {
  //   if (!file) return;
  //   const url = URL.createObjectURL(file);

  //   const img = new Image();
  //   img.onload = function () {
  //     const naturalWidth = this.naturalWidth;
  //     const naturalHeight = this.naturalHeight;

  //     const canvasSize = getCanvasSize();

  //     // **Photoshop jaisa - image ko actual size mein add karo**
  //     let finalWidth = naturalWidth;
  //     let finalHeight = naturalHeight;

  //     // Agar image canvas se zyada bari hai, to scale down karo
  //     const maxWidth = canvasSize.width * 0.9; // 90% of canvas
  //     const maxHeight = canvasSize.height * 0.9; // 90% of canvas

  //     if (naturalWidth > maxWidth || naturalHeight > maxHeight) {
  //       const widthRatio = maxWidth / naturalWidth;
  //       const heightRatio = maxHeight / naturalHeight;
  //       const minRatio = Math.min(widthRatio, heightRatio);

  //       finalWidth = Math.floor(naturalWidth * minRatio);
  //       finalHeight = Math.floor(naturalHeight * minRatio);
  //     }

  //     // **Center position calculate karo**
  //     const x = Math.max(0, (canvasSize.width - finalWidth) / 2);
  //     const y = Math.max(0, (canvasSize.height - finalHeight) / 2);

  //     const newLayer = {
  //       id: `layer-${Date.now()}`,
  //       type: "image",
  //       src: url,
  //       name: "",
  //       x: x,
  //       y: y,
  //       width: finalWidth,
  //       height: finalHeight,
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

  // const addImageLayerFromFile = (file) => {
  //   if (!file) return;
  //   const url = URL.createObjectURL(file);

  //   // Naya code - image ka natural size get karna
  //   const img = new Image();
  //   img.onload = function () {
  //     const naturalWidth = this.naturalWidth;
  //     const naturalHeight = this.naturalHeight;

  //     // Canvas size get karna (800x800)
  //     const canvasSize = getCanvasSize(); // {width: 800, height: 800}

  //     // Agar image canvas se bari hai, to scale down karo
  //     let finalWidth = naturalWidth;
  //     let finalHeight = naturalHeight;

  //     if (naturalWidth > canvasSize.width || naturalHeight > canvasSize.height) {
  //       const widthRatio = canvasSize.width / naturalWidth;
  //       const heightRatio = canvasSize.height / naturalHeight;
  //       const minRatio = Math.min(widthRatio, heightRatio);

  //       finalWidth = Math.floor(naturalWidth * minRatio);
  //       finalHeight = Math.floor(naturalHeight * minRatio);
  //     }

  //     const newLayer = {
  //       id: `layer-${Date.now()}`,
  //       type: "image",
  //       src: url,
  //       name: "",
  //       x: 120,
  //       y: 120,
  //       width: finalWidth, // Fixed size ke bajaye natural size
  //       height: finalHeight, // Fixed size ke bajaye natural size
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

  const onSave = () => {
    const serializable = layers.map((l) => {
      const copy = { ...l };
      return copy;
    });
    localStorage.setItem("mockupEditedLayers", JSON.stringify(serializable));
    console.log("Saved layers:", serializable);
    alert("Saved to localStorage (mockupEditedLayers). Check console.");
  };

  // const getCanvasSize = () => {
  //   if (mockup) {
  //     // Canvas size dynamic rakhne ke liye
  //     const maxCanvasSize = 1200; // Maximum canvas size (optional)

  //     // Mockup ke dimensions ke hisab se canvas set karo
  //     // Yeh part wohi rahega jahan se mockup load hota hai
  //     // Wo already width/height set hoga
  //     return {
  //       width: Math.min(mockup.width || 800, maxCanvasSize),
  //       height: Math.min(mockup.height || 800, maxCanvasSize)
  //     };
  //   }
  //   return { width: 800, height: 800 }; // Default
  // };

  const getCanvasSize = () => {
    // 1. Pehle background layer dekho
    const bgLayer = layers.find(l => l.type === "background");

    // 2. Agar background layer hai
    if (bgLayer && bgLayer.width && bgLayer.height) {
      // MAXIMUM CANVAS SIZE SET KARO
      const MAX_CANVAS_SIZE = 800; // Max canvas width/height

      // Calculate scaled dimensions
      let canvasWidth = bgLayer.width;
      let canvasHeight = bgLayer.height;

      // Agar image bohat bari hai, toh scale down karo
      if (bgLayer.width > MAX_CANVAS_SIZE || bgLayer.height > MAX_CANVAS_SIZE) {
        const widthRatio = MAX_CANVAS_SIZE / bgLayer.width;
        const heightRatio = MAX_CANVAS_SIZE / bgLayer.height;
        const minRatio = Math.min(widthRatio, heightRatio);

        canvasWidth = Math.floor(bgLayer.width * minRatio);
        canvasHeight = Math.floor(bgLayer.height * minRatio);
      }

      return {
        width: canvasWidth,
        height: canvasHeight
      };
    }

    // 3. Default
    return { width: 800, height: 800 };
  };

  // Pehle yeh function update karo

  // Yeh function sync rakhna hoga
  // Yeh function sync rakhna hoga
  // const getCanvasSize = () => {
  //   // 1. Pehle background layer dekho
  //   const bgLayer = layers.find(l => l.type === "background");

  //   // 2. Agar background layer hai aur usme width/height hai
  //   if (bgLayer && bgLayer.width && bgLayer.height) {
  //     return {
  //       width: bgLayer.width,
  //       height: bgLayer.height
  //     };
  //   }

  //   // 3. Agar mockup se dimensions mil rahe hain
  //   if (mockup && mockup.width && mockup.height) {
  //     return {
  //       width: mockup.width,
  //       height: mockup.height
  //     };
  //   }

  //   // 4. Default
  //   return { width: 800, height: 800 };
  // };
  // Yeh function replace karo
  // const getCanvasSize = () => {
  //   // 1. Background layer dekho
  //   const bgLayer = layers.find(l => l.type === "background");

  //   // 2. Agar background layer hai aur usme natural dimensions hain
  //   if (bgLayer) {
  //     // Background image ka actual size get karo
  //     return new Promise((resolve) => {
  //       if (bgLayer._naturalWidth && bgLayer._naturalHeight) {
  //         resolve({
  //           width: bgLayer._naturalWidth,
  //           height: bgLayer._naturalHeight
  //         });
  //       } else {
  //         const img = new Image();
  //         img.onload = () => {
  //           resolve({
  //             width: img.naturalWidth,
  //             height: img.naturalHeight
  //           });
  //         };
  //         img.src = bgLayer.src;
  //       }
  //     });
  //   }

  //   // 3. Agar mockup se dimensions mil rahe hain
  //   if (mockup && mockup.width && mockup.height) {
  //     return Promise.resolve({
  //       width: mockup.width,
  //       height: mockup.height
  //     });
  //   }

  //   // 4. Default
  //   return Promise.resolve({ width: 800, height: 800 });
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
  //   const newLayer = {
  //     id: `printarea-${Date.now()}`,
  //     type: "printarea",
  //     name: printArea.displayName || "",
  //     x: 100,
  //     y: 100,
  //     width: printArea.width,
  //     height: printArea.height,
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
  //       { x: 0, y: 0 },                            // top-left
  //       { x: printArea.width, y: 0 },              // top-right
  //       { x: printArea.width, y: printArea.height }, // bottom-right
  //       { x: 0, y: printArea.height }              // bottom-left
  //     ]
  //   };

  //   setLayersWithHistory((prev) => [...prev, newLayer]);
  //   setSelectedLayerId(newLayer.id);
  // };

  const addPrintAreaToCanvas = (printArea) => {
    const canvasSize = getCanvasSize();

    let finalWidth = printArea.width;
    let finalHeight = printArea.height;

    // Agar print area canvas se bari hai, toh scale down karo
    if (printArea.width > canvasSize.width || printArea.height > canvasSize.height) {
      const widthRatio = canvasSize.width / printArea.width;
      const heightRatio = canvasSize.height / printArea.height;
      const minRatio = Math.min(widthRatio, heightRatio) * 0.7;

      finalWidth = Math.floor(printArea.width * minRatio);
      finalHeight = Math.floor(printArea.height * minRatio);
    }

    // **Center position calculate karo**
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