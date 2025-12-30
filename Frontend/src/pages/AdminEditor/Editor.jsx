// ============================================================= IMPROVE SHORT KEY

// Editor.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { Rnd } from "react-rnd";
// import { ReactSortable } from "react-sortablejs";
// import { useParams } from "react-router-dom";
// import { getProductById } from "../../api/product.api";
// import { toPng, toJpeg } from "html-to-image";

// function Editor() {
//   const [mockup, setMockup] = useState(null);

//   // internal raw setter and wrapper that records history
//   const [layersState, _setLayersState] = useState([]);
//   const layers = layersState;

//   const historyRef = useRef([]);
//   const futureRef = useRef([]);
//   const HISTORY_LIMIT = 60;

//   // wrapper to set layers and optionally record history
//   const setLayers = (updater, options = { recordHistory: true }) => {
//     _setLayersState((prev) => {
//       const newLayers = typeof updater === "function" ? updater(prev) : updater;
//       if (options.recordHistory) {
//         try {
//           historyRef.current.push(JSON.parse(JSON.stringify(prev)));
//         } catch {
//           historyRef.current.push(prev);
//         }
//         if (historyRef.current.length > HISTORY_LIMIT) {
//           historyRef.current.shift();
//         }
//         futureRef.current = [];
//       }
//       return newLayers;
//     });
//   };

//   const [showPrintareaSelect, setShowPrintareaSelect] = useState(false);
//   const [printAreas, setPrintAreas] = useState([]);

//   const [selectedLayerId, setSelectedLayerId] = useState(null);
//   const fileInputRef = useRef(null);
//   const printAreaFileInputRef = useRef(null);
//   const canvasRef = useRef(null);
//   const innerCanvasRef = useRef(null);

//   const { editId } = useParams();

//   // Zoom/scale
//   const [scale, setScale] = useState(1);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (!editId) return;

//       const product = await getProductById(editId);
//       if (product) {
//         setPrintAreas(product.Printareas || []);
//       }
//     };

//     fetchProduct();
//   }, [editId]);

//   // initial load from localStorage - DON'T record in history
//   useEffect(() => {
//     const savedMockup = localStorage.getItem("mockupToEdit");
//     if (savedMockup) {
//       const parsed = JSON.parse(savedMockup);
//       setMockup(parsed);

//       setLayers(
//         [
//           {
//             id: "layer-bg",
//             type: "background",
//             src: parsed.url,
//             x: 0,
//             y: 0,
//             width: 800,
//             height: 800,
//             rotation: 0,
//             opacity: 1,
//             locked: true,
//             visible: true,
//           },
//           {
//             id: "layer-1",
//             type: "image",
//             src: parsed.url,
//             x: 80,
//             y: 80,
//             width: 640,
//             height: 640,
//             rotation: 0,
//             opacity: 1,
//             visible: true,
//           },
//         ],
//         { recordHistory: false }
//       );
//       setSelectedLayerId("layer-1");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Helper Functions
//   const addNewTextLayer = () => {
//     const newLayer = {
//       id: `layer-${Date.now()}`,
//       type: "text",
//       text: "New Text",
//       name: "", // separate layer name
//       x: 100,
//       y: 100,
//       width: 200,
//       height: 60,
//       rotation: 0,
//       fontSize: 22,
//       color: "#ffffff",
//       opacity: 1,
//       visible: true,
//       locked: false,
//     };
//     setLayers((prev) => [...prev, newLayer]);
//     setSelectedLayerId(newLayer.id);
//   };

//   const addImageLayerFromFile = (file) => {
//     if (!file) return;
//     const url = URL.createObjectURL(file);
//     const newLayer = {
//       id: `layer-${Date.now()}`,
//       type: "image",
//       src: url,
//       name: "",
//       x: 120,
//       y: 120,
//       width: 300,
//       height: 200,
//       rotation: 0,
//       opacity: 1,
//       visible: true,
//       fit: "contain",
//       locked: false,
//       // ✅ NEW: 3D Perspective Properties
//       perspective: 0,        // CSS perspective value (0-1000)
//       rotateX: 0,            // X-axis rotation (-180 to 180)
//       rotateY: 0,            // Y-axis rotation (-180 to 180)
//       rotateZ: 0,            // Z-axis rotation (same as rotation)
//       skewX: 0,              // X skew (-45 to 45)
//       skewY: 0,              // Y skew (-45 to 45)
//       transformOrigin: "center center" // transform origin
//     };
//     setLayers((prev) => [...prev, newLayer]);
//     setSelectedLayerId(newLayer.id);
//   };

//   const handleFileInputChange = (e) => {
//     const file = e.target.files && e.target.files[0];
//     if (file) {
//       addImageLayerFromFile(file);
//     }
//     e.target.value = "";
//   };

//   const addImageLayerButton = () => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   };

//   const updateLayer = (id, updates) => {
//     setLayers((prev) =>
//       prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
//     );
//   };

//   const removeLayer = (id) => {
//     const layer = layers.find((l) => l.id === id);
//     if (layer) {
//       // Cleanup blob URLs
//       if (layer.src && layer.src.startsWith("blob:")) {
//         try {
//           URL.revokeObjectURL(layer.src);
//         } catch (e) { }
//       }
//       if (layer.imageSrc && layer.imageSrc.startsWith("blob:")) {
//         try {
//           URL.revokeObjectURL(layer.imageSrc);
//         } catch (e) { }
//       }
//     }
//     setLayers((prev) => prev.filter((l) => l.id !== id));
//     if (selectedLayerId === id) setSelectedLayerId(null);
//   };

//   const bringForward = (id) => {
//     setLayers((prev) => {
//       const idx = prev.findIndex((l) => l.id === id);
//       if (idx === -1 || idx === prev.length - 1) return prev;
//       const copy = [...prev];
//       const [item] = copy.splice(idx, 1);
//       copy.splice(idx + 1, 0, item);
//       return copy;
//     });
//   };

//   const sendBackward = (id) => {
//     setLayers((prev) => {
//       const idx = prev.findIndex((l) => l.id === id);
//       if (idx <= 0) return prev;
//       const copy = [...prev];
//       const [item] = copy.splice(idx, 1);
//       copy.splice(idx - 1, 0, item);
//       return copy;
//     });
//   };

//   const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);

//   const onSave = () => {
//     const serializable = layers.map((l) => {
//       const copy = { ...l };
//       return copy;
//     });
//     localStorage.setItem("mockupEditedLayers", JSON.stringify(serializable));
//     console.log("Saved layers:", serializable);
//     alert("Saved to localStorage (mockupEditedLayers). Check console.");
//   };

//   const getCanvasSize = () => {
//     return { width: 800, height: 800 };
//   };

//   const duplicateLayer = () => {
//     if (!selectedLayerId) return;
//     const layerToCopy = layers.find((l) => l.id === selectedLayerId);
//     if (!layerToCopy) return;

//     const duplicatedLayer = {
//       ...JSON.parse(JSON.stringify(layerToCopy)),
//       id: `layer-${Date.now()}`,
//       x: layerToCopy.x + 20,
//       y: layerToCopy.y + 20,
//     };

//     setLayers((prev) => [...prev, duplicatedLayer]);
//     setSelectedLayerId(duplicatedLayer.id);
//   };

//   const toggleLayerVisibility = (id) => {
//     setLayers((prev) =>
//       prev.map((layer) =>
//         layer.id === id ? { ...layer, visible: !layer.visible } : layer
//       )
//     );
//   };

//   // Rotation with mouse - fixed to account for scale transform
//   const startRotation = (e, layerId) => {
//     e.stopPropagation();
//     e.preventDefault();
//     const layer = layers.find((l) => l.id === layerId);
//     if (!layer) return;

//     const canvasEl = innerCanvasRef.current;
//     if (!canvasEl) return;

//     const canvasRect = canvasEl.getBoundingClientRect();
//     // account for scale: layer coords are in logical units; transform scales the rendered pixels
//     const centerX = canvasRect.left + (layer.x + layer.width / 2) * scale;
//     const centerY = canvasRect.top + (layer.y + layer.height / 2) * scale;

//     const onMove = (ev) => {
//       const angleRad = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
//       const angleDeg = Math.round((angleRad * 180) / Math.PI);
//       updateLayer(layerId, { rotation: angleDeg });
//     };

//     const onUp = () => {
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseup", onUp);
//     };

//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onUp);
//   };

//   // Print Area Functions
//   const addPrintAreaToCanvas = (printArea) => {
//     const newLayer = {
//       id: `printarea-${Date.now()}`,
//       type: "printarea",
//       name: printArea.displayName || "",
//       x: 100,
//       y: 100,
//       width: printArea.width,
//       height: printArea.height,
//       rotation: 0,
//       opacity: 1,
//       visible: true,
//       hasImage: false,
//       imageSrc: null,
//       fit: "cover",
//       border: true,
//       locked: false,
//     };

//     setLayers((prev) => [...prev, newLayer]);
//     setSelectedLayerId(newLayer.id);
//   };

//   const handlePrintAreaImageUpload = (e) => {
//     const file = e.target.files && e.target.files[0];
//     if (!file || !selectedLayer) return;

//     if (selectedLayer.type !== "printarea") return;

//     if (selectedLayer.imageSrc && selectedLayer.imageSrc.startsWith("blob:")) {
//       try {
//         URL.revokeObjectURL(selectedLayer.imageSrc);
//       } catch (err) { }
//     }

//     const url = URL.createObjectURL(file);
//     updateLayer(selectedLayer.id, {
//       hasImage: true,
//       imageSrc: url,
//       border: false,
//     });

//     e.target.value = "";
//   };

//   const removePrintAreaImage = () => {
//     if (!selectedLayer) return;

//     if (selectedLayer.imageSrc && selectedLayer.imageSrc.startsWith("blob:")) {
//       try {
//         URL.revokeObjectURL(selectedLayer.imageSrc);
//       } catch (err) { }
//     }

//     updateLayer(selectedLayer.id, {
//       hasImage: false,
//       imageSrc: null,
//       border: true,
//     });
//   };

//   const triggerPrintAreaImageUpload = () => {
//     if (printAreaFileInputRef.current) {
//       printAreaFileInputRef.current.click();
//     }
//   };

//   // ---------------- Undo / Redo ----------------
//   const undo = () => {
//     if (historyRef.current.length === 0) return;
//     const last = historyRef.current.pop();
//     try {
//       futureRef.current.push(JSON.parse(JSON.stringify(layers)));
//     } catch {
//       futureRef.current.push(layers);
//     }
//     _setLayersState(last);
//     setSelectedLayerId(null);
//   };

//   const redo = () => {
//     if (futureRef.current.length === 0) return;
//     const next = futureRef.current.pop();
//     try {
//       historyRef.current.push(JSON.parse(JSON.stringify(layers)));
//     } catch {
//       historyRef.current.push(layers);
//     }
//     _setLayersState(next);
//     setSelectedLayerId(null);
//   };

//   // ---------------- Export (PNG/JPEG) ----------------
//   const exportAsImage = async (format = "png") => {
//     if (!innerCanvasRef.current) {
//       alert("Canvas not ready");
//       return;
//     }
//     try {
//       if (format === "png") {
//         const dataUrl = await toPng(innerCanvasRef.current, {
//           cacheBust: true,
//           pixelRatio: 2,
//         });
//         const link = document.createElement("a");
//         link.download = `mockup-${Date.now()}.png`;
//         link.href = dataUrl;
//         link.click();
//       } else {
//         const dataUrl = await toJpeg(innerCanvasRef.current, {
//           quality: 0.95,
//           pixelRatio: 2,
//         });
//         const link = document.createElement("a");
//         link.download = `mockup-${Date.now()}.jpg`;
//         link.href = dataUrl;
//         link.click();
//       }
//     } catch (err) {
//       console.error("Export error:", err);
//       alert("Export failed — check console for details.");
//     }
//   };

//   // ---------------- Lock toggle ----------------
//   const toggleLockSelected = () => {
//     if (!selectedLayer) return;
//     updateLayer(selectedLayer.id, { locked: !selectedLayer.locked });
//   };

//   // toggle lock by id (for list icon)
//   const toggleLockById = (id) => {
//     setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)));
//   };

//   // ---------------- Zoom controls ----------------
//   const handleZoomIn = () => setScale((s) => Math.min(2, +(s + 0.1).toFixed(2)));
//   const handleZoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)));
//   const handleZoomReset = () => setScale(1);

//   // ---------------- Keyboard shortcuts ----------------
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       const cmd = e.ctrlKey || e.metaKey;

//       // allow undo/redo even when typing (makes sense)
//       if (cmd && e.key.toLowerCase() === "z") {
//         e.preventDefault();
//         if (e.shiftKey) {
//           redo();
//         } else {
//           undo();
//         }
//         return;
//       }
//       if (cmd && e.key.toLowerCase() === "y") {
//         e.preventDefault();
//         redo();
//         return;
//       }



//       // active element check
//       const active = document.activeElement;
//       const activeTag = active && active.tagName;
//       const isTyping =
//         activeTag === "INPUT" ||
//         activeTag === "TEXTAREA" ||
//         (active && active.isContentEditable);

//       // Duplicate (Ctrl+D) - only when NOT typing
//       if (cmd && e.key.toLowerCase() === "d") {
//         if (!isTyping) {
//           e.preventDefault(); // prevent bookmark
//           duplicateLayer();
//         }
//         return;
//       }

//       // Delete selected layer
//       if (!isTyping && e.key === "Delete") {
//         e.preventDefault();
//         if (selectedLayerId) {
//           removeLayer(selectedLayerId);
//         }
//         return;
//       }

//       // Export (Ctrl+E) - only when NOT typing
//       if (cmd && e.key.toLowerCase() === "e") {
//         if (!isTyping) {
//           e.preventDefault();
//           exportAsImage("png");
//         }
//         return;
//       }

//       // Lock toggle (Ctrl+L) - only when NOT typing
//       if (cmd && e.key.toLowerCase() === "l") {
//         if (!isTyping) {
//           e.preventDefault();
//           toggleLockSelected();
//         }
//         return;
//       }

//       // Zoom shortcuts (Ctrl + + / = / - / 0) - only when NOT typing
//       if (cmd && !isTyping) {
//         // Zoom in: '+' (often shift+'=') or '='
//         if (e.key === "+" || e.key === "=") {
//           e.preventDefault();
//           handleZoomIn();
//           return;
//         }
//         // Zoom out: '-'
//         if (e.key === "-") {
//           e.preventDefault();
//           handleZoomOut();
//           return;
//         }
//         // Reset: 0
//         if (e.key === "0") {
//           e.preventDefault();
//           handleZoomReset();
//           return;
//         }
//       }

//       // Arrow keys for nudge (only when NOT typing)
//       if (
//         !isTyping &&
//         (e.key === "ArrowUp" ||
//           e.key === "ArrowDown" ||
//           e.key === "ArrowLeft" ||
//           e.key === "ArrowRight")
//       ) {
//         if (!selectedLayerId) return;
//         e.preventDefault();
//         const delta = e.shiftKey ? 10 : 1;
//         const sl = layers.find((l) => l.id === selectedLayerId);
//         if (!sl) return;

//         let nx = sl.x;
//         let ny = sl.y;
//         if (e.key === "ArrowUp") ny = sl.y - delta;
//         if (e.key === "ArrowDown") ny = sl.y + delta;
//         if (e.key === "ArrowLeft") nx = sl.x - delta;
//         if (e.key === "ArrowRight") nx = sl.x + delta;

//         updateLayer(selectedLayerId, { x: nx, y: ny });
//       }

//       // NOTE: we purposefully do NOT handle Delete or Backspace via keyboard,
//       // user wanted only the UI Delete button to remove layers.
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [selectedLayerId, layers]); // eslint-disable-line react-hooks/exhaustive-deps

//   return (
//     <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
//       {/* Header */}
//       <header className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
//         <h1 className="text-2xl font-bold text-blue-400">Mockup Editor</h1>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setShowPrintareaSelect((prev) => !prev)}
//             className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium shadow-md transition duration-200"
//           >
//             + Add Printarea
//           </button>

//           {showPrintareaSelect && (
//             <div className="absolute top-16 right-6 bg-gray-800 rounded-lg shadow-lg p-3 w-64 z-50">
//               <p className="text-gray-300 text-sm mb-2">Select Print Area</p>
//               <select
//                 className="w-full p-2 rounded bg-gray-700 text-white"
//                 onChange={(e) => {
//                   const selected = printAreas.find((p) => p._id === e.target.value);
//                   if (selected) addPrintAreaToCanvas(selected);
//                   setShowPrintareaSelect(false);
//                 }}
//               >
//                 <option value="">-- Select --</option>
//                 {printAreas.map((pa) => (
//                   <option key={pa._id} value={pa._id}>
//                     {pa.displayName} | {pa.width} x {pa.height}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           <button
//             className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium shadow-md transition duration-200"
//             onClick={addImageLayerButton}
//           >
//             + Add Image
//           </button>

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleFileInputChange}
//             style={{ display: "none" }}
//           />

//           <button
//             className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium shadow-md transition duration-200"
//             onClick={onSave}
//           >
//             Save
//           </button>

//           {/* Undo / Redo */}
//           <button
//             onClick={undo}
//             title="Undo (Ctrl/Cmd + Z)"
//             className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
//           >
//             ⤺
//           </button>
//           <button
//             onClick={redo}
//             title="Redo (Ctrl/Cmd + Y)"
//             className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
//           >
//             ⤻
//           </button>

//           {/* Export */}
//           <button
//             onClick={() => exportAsImage("png")}
//             className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700"
//             title="Export PNG (Ctrl+E)"
//           >
//             PNG
//           </button>
//           <button
//             onClick={() => exportAsImage("jpg")}
//             className="px-3 py-2 rounded bg-amber-600 hover:bg-amber-700"
//             title="Export JPG"
//           >
//             JPG
//           </button>

//           {/* Zoom */}
//           <div className="flex items-center gap-1 bg-gray-700 p-1 rounded">
//             <button
//               onClick={handleZoomOut}
//               className="px-2 py-1 rounded hover:bg-gray-600"
//               title="Zoom out (Ctrl+-)"
//             >
//               −
//             </button>
//             <div className="px-2 text-sm">{Math.round(scale * 100)}%</div>
//             <button
//               onClick={handleZoomIn}
//               className="px-2 py-1 rounded hover:bg-gray-600"
//               title="Zoom in (Ctrl+= / Ctrl++)"
//             >
//               +
//             </button>
//             <button
//               onClick={handleZoomReset}
//               className="px-2 py-1 rounded hover:bg-gray-600"
//               title="Reset zoom (Ctrl+0)"
//             >
//               reset
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="flex flex-1 flex-col lg:flex-row">
//         {/* Left Layers Panel */}
//         <div className="w-full lg:w-64 bg-gray-800 p-4 space-y-4 flex-shrink-0 overflow-auto">
//           <h2 className="text-lg font-semibold text-gray-300 mb-2">Layers</h2>

//           {layers.length === 0 && (
//             <div className="text-gray-400">No layers yet. Add text or image.</div>
//           )}

//           <ReactSortable
//             list={layers}
//             setList={(list) => setLayers(list)}
//             animation={200}
//             ghostClass="bg-gray-500/50"
//             handle=".drag-handle"
//           >
//             {layers.map((layer) => (
//               <div
//                 key={layer.id}
//                 onClick={() => setSelectedLayerId(layer.id)}
//                 className={`w-full flex items-center justify-between py-2 px-2 rounded shadow cursor-pointer transition ${selectedLayerId === layer.id
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-700 hover:bg-gray-600 text-gray-200"
//                   }`}
//               >
//                 <span
//                   className="drag-handle truncate cursor-move"
//                   onDoubleClick={() => {
//                     const prefill =
//                       layer.name && layer.name !== ""
//                         ? layer.name
//                         : layer.type === "text"
//                           ? layer.text
//                           : "Image Layer";
//                     const newName = prompt("Enter new layer name", prefill);
//                     if (newName !== null) updateLayer(layer.id, { name: newName });
//                   }}
//                 >
//                   {layer.name && layer.name !== ""
//                     ? layer.name
//                     : layer.type === "text"
//                       ? layer.text
//                       : layer.type === "printarea"
//                         ? layer.name || "Print Area"
//                         : "Image Layer"}
//                 </span>

//                 <div className="flex gap-2">
//                   {/* Lock Icon */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleLockById(layer.id);
//                     }}
//                     className="text-gray-300 hover:text-indigo-300 transition cursor-pointer"
//                     title={layer.locked ? "Unlock layer (Ctrl+L)" : "Lock layer (Ctrl+L)"}
//                   >
//                     {layer.locked ? (
//                       // locked icon
//                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
//                         <path d="M8 1a3 3 0 0 0-3 3v3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V4a3 3 0 0 0-3-3z" />
//                       </svg>
//                     ) : (
//                       // unlocked icon
//                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-unlock" viewBox="0 0 16 16">
//                         <path d="M11 1a2 2 0 0 0-2 2v2H7V3a4 4 0 0 1 8 0v2h-1V3a3 3 0 0 0-3-3z" />
//                         <path d="M3 7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H3z" />
//                       </svg>
//                     )}
//                   </button>

//                   {/* Eye Icon */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleLayerVisibility(layer.id);
//                     }}
//                     className="text-gray-300 hover:text-green-400 transition cursor-pointer"
//                     title={layer.visible ? "Hide Layer" : "Show Layer"}
//                   >
//                     {layer.visible ? (
//                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
//                         <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
//                         <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
//                       </svg>
//                     ) : (
//                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
//                         <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
//                         <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
//                         <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
//                       </svg>
//                     )}
//                   </button>

//                   {/* Duplicate Icon */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setSelectedLayerId(layer.id);
//                       duplicateLayer();
//                     }}
//                     className="text-gray-300 hover:text-yellow-400 transition cursor-pointer"
//                     title="Duplicate Layer (Ctrl+D)"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-files" viewBox="0 0 16 16">
//                       <path d="M13 1H5a1 1 0 0 0-1 1v1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM5 2h8v1H5V2zm-3 2h2v9H2V4zm3 9v-9h6v9H5zm7-1h-2v-1h2v1z" />
//                     </svg>
//                   </button>

//                   {/* Delete Icon (UI button only) */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeLayer(layer.id);
//                     }}
//                     className="text-gray-300 hover:text-red-500 transition cursor-pointer"
//                     title="Delete Layer"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
//                       <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
//                       <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </ReactSortable>
//         </div>

//         {/* Editor Canvas */}
//         <div
//           ref={canvasRef}
//           className="flex-1 flex items-center justify-center bg-gray-700 mx-4 my-4 lg:my-0 rounded-xl relative overflow-hidden"
//         >
//           {mockup ? (
//             <div
//               className="relative bg-black/0"
//               style={{
//                 width: "90%",
//                 height: "90%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <div
//                 ref={innerCanvasRef}
//                 className="relative"
//                 style={{
//                   width: getCanvasSize().width,
//                   height: getCanvasSize().height,
//                   display: "inline-block",
//                   position: "relative",
//                   transform: `scale(${scale})`,
//                   transformOrigin: "center center",
//                 }}
//               >
//                 {layers.map((layer, index) => {
//                   if (layer.visible === false) return null;
//                   const zIndex = index + 1;

//                   if (layer.type === "background") {
//                     return (
//                       <img
//                         key={layer.id}
//                         src={layer.src}
//                         alt="background"
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "contain",
//                           display: "block",
//                           borderRadius: 8,
//                           boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
//                           position: "absolute",
//                           left: 0,
//                           top: 0,
//                         }}
//                       />
//                     );
//                   }

//                   const showRotationHandle = selectedLayerId === layer.id && layer.type !== "background" && !layer.locked;

//                   return (
//                     <Rnd
//                       key={layer.id}
//                       size={{ width: layer.width, height: layer.height }}
//                       position={{ x: layer.x, y: layer.y }}
//                       bounds="parent"
//                       onDragStop={(e, d) => updateLayer(layer.id, { x: d.x, y: d.y })}
//                       onResizeStop={(e, direction, ref, delta, position) =>
//                         updateLayer(layer.id, {
//                           width: parseInt(ref.style.width, 10),
//                           height: parseInt(ref.style.height, 10),
//                           ...position,
//                         })
//                       }
//                       onClick={() => setSelectedLayerId(layer.id)}
//                       enableResizing={layer.type !== "background" && !layer.locked}
//                       disableDragging={!!layer.locked}
//                       scale={1}
//                       style={{
//                         zIndex,
//                         border:
//                           selectedLayerId === layer.id
//                             ? "2px solid #3b82f6"
//                             : layer.type === "printarea" && layer.border
//                               ? "2px dashed #22c55e"
//                               : "1px dashed rgba(255,255,255,0.05)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: layer.locked ? "not-allowed" : "move",
//                         pointerEvents: "auto",
//                         position: "absolute",
//                       }}
//                     >
//                       {/* WRAPPER DIV FOR ROTATION */}
//                       <div
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           transform: `rotate(${layer.rotation || 0}deg) scale(${scale})`,
//                           transformOrigin: "center center",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           opacity: layer.opacity !== undefined ? layer.opacity : 1,
//                           background: layer.type === "text" ? "transparent" : "none",
//                         }}
//                       >
//                         {/* yahan saari content aayegi */}
//                         {layer.type === "text" && (
//                           <div
//                             style={{
//                               fontSize: layer.fontSize,
//                               color: layer.color,
//                               fontWeight: "700",
//                               width: "100%",
//                               height: "100%",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               userSelect: "none",
//                               whiteSpace: "pre-wrap",
//                             }}
//                           >
//                             {layer.text}
//                           </div>
//                         )}

//                         {layer.type === "image" && (
//                           <img
//                             src={layer.src}
//                             alt="layer"
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: layer.fit || "contain",
//                               pointerEvents: "none",
//                             }}
//                           />
//                         )}

//                         {layer.type === "image" && (
//                           <div
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               perspective: `${layer.perspective || 0}px`,
//                               transformStyle: "preserve-3d",
//                             }}
//                           >
//                             <img
//                               src={layer.src}
//                               alt="layer"
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: layer.fit || "contain",
//                                 pointerEvents: "none",
//                                 // ✅ 3D Transform Apply Karo
//                                 transform: `
//                                            rotateX(${layer.rotateX || 0}deg)
//                                            rotateY(${layer.rotateY || 0}deg)
//                                            rotateZ(${layer.rotateZ || 0}deg)
//                                            skewX(${layer.skewX || 0}deg)
//                                            skewY(${layer.skewY || 0}deg)
//                                            `,
//                                 transformOrigin: layer.transformOrigin || "center center",
//                               }}
//                             />
//                           </div>
//                         )}

//                         {layer.type === "printarea" && (
//                           <div
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               background: layer.hasImage ? "transparent" : "rgba(34,197,94,0.08)",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               fontSize: 14,
//                               color: "#22c55e",
//                               fontWeight: 600,
//                               userSelect: "none",
//                               textAlign: "center",
//                               overflow: "hidden",
//                             }}
//                           >
//                             {layer.hasImage ? (
//                               <img
//                                 src={layer.imageSrc}
//                                 alt="Print area"
//                                 style={{
//                                   width: "100%",
//                                   height: "100%",
//                                   objectFit: layer.fit || "cover",
//                                   pointerEvents: "none",
//                                 }}
//                               />
//                             ) : (
//                               <div>
//                                 {layer.name || "Print Area"}
//                                 <br />
//                                 {layer.width} × {layer.height}
//                                 <br />
//                                 <span
//                                   style={{
//                                     fontSize: 10,
//                                     color: "#888",
//                                     fontWeight: "normal",
//                                   }}
//                                 >
//                                   Upload image from properties panel
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                         )}

//                         {showRotationHandle && (
//                           <div
//                             onMouseDown={(e) => startRotation(e, layer.id)}
//                             className="absolute top-0 right-0 w-4 h-4 rounded-full bg-blue-500 cursor-crosshair"
//                             style={{ zIndex: 9999 }}
//                           />
//                         )}
//                       </div>
//                     </Rnd>

//                   );
//                 })}
//               </div>
//             </div>
//           ) : (
//             <span className="text-gray-400 text-lg">No mockup selected</span>
//           )}
//         </div>

//         {/* Right Properties Sidebar */}
//         <div className="w-full lg:w-64 bg-gray-800 p-6 space-y-6 flex-shrink-0 overflow-auto">
//           <h2 className="text-xl font-semibold text-gray-300 mb-2">Properties</h2>

//           <div className="flex gap-2 mb-3">
//             <button
//               onClick={addNewTextLayer}
//               className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded shadow transition"
//             >
//               + Text
//             </button>
//             <button
//               onClick={addImageLayerButton}
//               className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded shadow transition"
//             >
//               + Image
//             </button>
//           </div>

//           <button
//             onClick={duplicateLayer}
//             disabled={!selectedLayer}
//             className={`w-full py-2 rounded shadow mb-4 transition ${selectedLayer ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-600 cursor-not-allowed"
//               }`}
//           >
//             Duplicate Layer
//           </button>

//           {selectedLayer ? (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="text-gray-300 font-medium">
//                   {selectedLayer.type === "text"
//                     ? "Text Layer"
//                     : selectedLayer.type === "image"
//                       ? "Image Layer"
//                       : selectedLayer.type === "printarea"
//                         ? "Print Area"
//                         : "Background"}
//                 </div>
//                 <div className="text-sm text-gray-400">{selectedLayer.id}</div>
//               </div>

//               <div className="flex gap-2 items-center">
//                 <div className="text-gray-400 font-medium">Layer Name</div>
//                 <button
//                   onClick={toggleLockSelected}
//                   className={`ml-auto px-2 py-1 rounded ${selectedLayer.locked ? "bg-red-600" : "bg-gray-700 hover:bg-gray-600"
//                     }`}
//                 >
//                   {selectedLayer.locked ? "Unlock" : "Lock"}
//                 </button>
//               </div>

//               <div>
//                 <input
//                   type="text"
//                   className="w-full p-2 rounded bg-gray-700 text-white"
//                   value={selectedLayer.name ?? ""}
//                   onChange={(e) =>
//                     updateLayer(selectedLayer.id, {
//                       name: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               <div>
//                 <p className="text-gray-400 font-medium">Position (x, y)</p>
//                 <div className="flex gap-2 mt-1">
//                   <input
//                     type="number"
//                     className="w-1/2 p-2 rounded bg-gray-700 text-white"
//                     value={Math.round(selectedLayer.x)}
//                     onChange={(e) =>
//                       updateLayer(selectedLayer.id, { x: parseInt(e.target.value) || 0 })
//                     }
//                   />
//                   <input
//                     type="number"
//                     className="w-1/2 p-2 rounded bg-gray-700 text-white"
//                     value={Math.round(selectedLayer.y)}
//                     onChange={(e) =>
//                       updateLayer(selectedLayer.id, { y: parseInt(e.target.value) || 0 })
//                     }
//                   />
//                 </div>
//               </div>

//               <div>
//                 <p className="text-gray-400 font-medium">Size (w, h)</p>
//                 <div className="flex gap-2 mt-1">
//                   <input
//                     type="number"
//                     className="w-1/2 p-2 rounded bg-gray-700 text-white"
//                     value={Math.round(selectedLayer.width)}
//                     onChange={(e) =>
//                       updateLayer(selectedLayer.id, { width: parseInt(e.target.value) || 1 })
//                     }
//                   />
//                   <input
//                     type="number"
//                     className="w-1/2 p-2 rounded bg-gray-700 text-white"
//                     value={Math.round(selectedLayer.height)}
//                     onChange={(e) =>
//                       updateLayer(selectedLayer.id, { height: parseInt(e.target.value) || 1 })
//                     }
//                   />
//                 </div>
//               </div>

//               <div>
//                 <p className="text-gray-400 font-medium">Rotation (deg)</p>
//                 <input
//                   type="number"
//                   className="w-full p-2 rounded bg-gray-700 text-white"
//                   value={selectedLayer.rotation || 0}
//                   onChange={(e) =>
//                     updateLayer(selectedLayer.id, { rotation: parseInt(e.target.value) || 0 })
//                   }
//                 />
//               </div>

//               <div>
//                 <p className="text-gray-400 font-medium">Opacity</p>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="range"
//                     min="0"
//                     max="1"
//                     step="0.01"
//                     value={selectedLayer.opacity ?? 1}
//                     onChange={(e) =>
//                       updateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })
//                     }
//                     className="flex-1"
//                   />
//                   <div className="w-12 text-right">{Math.round((selectedLayer.opacity ?? 1) * 100)}%</div>
//                 </div>
//               </div>

//               {/* Text Layer Properties */}
//               {selectedLayer.type === "text" && (
//                 <>
//                   <div>
//                     <p className="text-gray-400 font-medium">Text</p>
//                     <input
//                       className="w-full p-2 rounded bg-gray-700 text-white"
//                       value={selectedLayer.text}
//                       onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
//                     />
//                   </div>

//                   <div>
//                     <p className="text-gray-400 font-medium">Font Size</p>
//                     <input
//                       type="number"
//                       className="w-full p-2 rounded bg-gray-700 text-white"
//                       value={selectedLayer.fontSize}
//                       onChange={(e) =>
//                         updateLayer(selectedLayer.id, {
//                           fontSize: parseInt(e.target.value) || 12,
//                         })
//                       }
//                     />
//                   </div>

//                   <div>
//                     <p className="text-gray-400 font-medium">Color</p>
//                     <input
//                       type="color"
//                       className="w-full h-10 p-1 rounded"
//                       value={selectedLayer.color}
//                       onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })}
//                     />
//                   </div>
//                 </>
//               )}

//               {/* Image Layer Properties */}
//               {selectedLayer.type === "image" && (
//                 <>
//                   <div>
//                     <p className="text-gray-400 font-medium">Replace Image</p>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const file = e.target.files && e.target.files[0];
//                         if (!file) return;
//                         if (selectedLayer.src && selectedLayer.src.startsWith("blob:")) {
//                           try {
//                             URL.revokeObjectURL(selectedLayer.src);
//                           } catch (err) { }
//                         }
//                         const url = URL.createObjectURL(file);
//                         updateLayer(selectedLayer.id, { src: url });
//                       }}
//                       className="w-full mt-1 p-2 bg-gray-700 rounded"
//                     />
//                   </div>

//                   <div>
//                     <p className="text-gray-400 font-medium">Fit Mode</p>
//                     <select
//                       value={selectedLayer.fit || "contain"}
//                       onChange={(e) => updateLayer(selectedLayer.id, { fit: e.target.value })}
//                       className="w-full p-2 rounded bg-gray-700 text-white"
//                     >
//                       <option value="contain">Contain</option>
//                       <option value="cover">Cover</option>
//                       <option value="fill">Fill</option>
//                     </select>
//                   </div>

//                   {/* ✅ NEW: 3D Perspective Controls */}
//                   <div className="pt-4 border-t border-gray-700">
//                     <h3 className="text-gray-300 font-medium mb-3">3D Perspective</h3>

//                     {/* Perspective (Depth) */}
//                     <div className="mb-3">
//                       <div className="flex justify-between">
//                         <p className="text-gray-400 font-medium">Perspective</p>
//                         <span className="text-xs text-gray-400">{selectedLayer.perspective || 0}px</span>
//                       </div>
//                       <input
//                         type="range"
//                         min="0"
//                         max="1000"
//                         step="10"
//                         value={selectedLayer.perspective || 0}
//                         onChange={(e) =>
//                           updateLayer(selectedLayer.id, { perspective: parseInt(e.target.value) || 0 })
//                         }
//                         className="w-full"
//                       />
//                       <div className="flex justify-between text-xs text-gray-400">
//                         <span>0px</span>
//                         <span>500px</span>
//                         <span>1000px</span>
//                       </div>
//                     </div>

//                     {/* 3D Rotation */}
//                     <div className="grid grid-cols-3 gap-2 mb-3">
//                       <div>
//                         <p className="text-gray-400 text-sm">Rotate X</p>
//                         <input
//                           type="number"
//                           className="w-full p-2 rounded bg-gray-700 text-white"
//                           value={selectedLayer.rotateX || 0}
//                           onChange={(e) =>
//                             updateLayer(selectedLayer.id, { rotateX: parseInt(e.target.value) || 0 })
//                           }
//                           min="-180"
//                           max="180"
//                         />
//                       </div>
//                       <div>
//                         <p className="text-gray-400 text-sm">Rotate Y</p>
//                         <input
//                           type="number"
//                           className="w-full p-2 rounded bg-gray-700 text-white"
//                           value={selectedLayer.rotateY || 0}
//                           onChange={(e) =>
//                             updateLayer(selectedLayer.id, { rotateY: parseInt(e.target.value) || 0 })
//                           }
//                           min="-180"
//                           max="180"
//                         />
//                       </div>
//                       <div>
//                         <p className="text-gray-400 text-sm">Rotate Z</p>
//                         <input
//                           type="number"
//                           className="w-full p-2 rounded bg-gray-700 text-white"
//                           value={selectedLayer.rotateZ || 0}
//                           onChange={(e) =>
//                             updateLayer(selectedLayer.id, { rotateZ: parseInt(e.target.value) || 0 })
//                           }
//                           min="-180"
//                           max="180"
//                         />
//                       </div>
//                     </div>

//                     {/* Skew */}
//                     <div className="grid grid-cols-2 gap-2 mb-3">
//                       <div>
//                         <p className="text-gray-400 text-sm">Skew X</p>
//                         <input
//                           type="number"
//                           className="w-full p-2 rounded bg-gray-700 text-white"
//                           value={selectedLayer.skewX || 0}
//                           onChange={(e) =>
//                             updateLayer(selectedLayer.id, { skewX: parseInt(e.target.value) || 0 })
//                           }
//                           min="-45"
//                           max="45"
//                         />
//                       </div>
//                       <div>
//                         <p className="text-gray-400 text-sm">Skew Y</p>
//                         <input
//                           type="number"
//                           className="w-full p-2 rounded bg-gray-700 text-white"
//                           value={selectedLayer.skewY || 0}
//                           onChange={(e) =>
//                             updateLayer(selectedLayer.id, { skewY: parseInt(e.target.value) || 0 })
//                           }
//                           min="-45"
//                           max="45"
//                         />
//                       </div>
//                     </div>

//                     {/* Transform Origin */}
//                     <div>
//                       <p className="text-gray-400 font-medium">Transform Origin</p>
//                       <select
//                         value={selectedLayer.transformOrigin || "center center"}
//                         onChange={(e) =>
//                           updateLayer(selectedLayer.id, { transformOrigin: e.target.value })
//                         }
//                         className="w-full p-2 rounded bg-gray-700 text-white"
//                       >
//                         <option value="center center">Center</option>
//                         <option value="top left">Top Left</option>
//                         <option value="top center">Top Center</option>
//                         <option value="top right">Top Right</option>
//                         <option value="center left">Center Left</option>
//                         <option value="center right">Center Right</option>
//                         <option value="bottom left">Bottom Left</option>
//                         <option value="bottom center">Bottom Center</option>
//                         <option value="bottom right">Bottom Right</option>
//                       </select>
//                     </div>

//                     {/* Reset Button */}
//                     <button
//                       onClick={() =>
//                         updateLayer(selectedLayer.id, {
//                           perspective: 0,
//                           rotateX: 0,
//                           rotateY: 0,
//                           rotateZ: 0,
//                           skewX: 0,
//                           skewY: 0,
//                           transformOrigin: "center center"
//                         })
//                       }
//                       className="w-full mt-3 py-2 bg-gray-600 hover:bg-gray-500 rounded transition"
//                     >
//                       Reset 3D
//                     </button>
//                   </div>
//                 </>
//               )}

//               {/* Print Area Properties */}
//               {selectedLayer.type === "printarea" && (
//                 <>
//                   <div className="pt-2 border-t border-gray-700">
//                     <p className="text-gray-400 font-medium mb-2">Print Area Image</p>

//                     <input
//                       ref={printAreaFileInputRef}
//                       type="file"
//                       accept="image/*"
//                       onChange={handlePrintAreaImageUpload}
//                       style={{ display: "none" }}
//                     />

//                     {!selectedLayer.hasImage ? (
//                       <div className="space-y-3">
//                         <button
//                           onClick={triggerPrintAreaImageUpload}
//                           className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
//                         >
//                           Upload Image
//                         </button>
//                         <p className="text-xs text-gray-400 text-center">
//                           Upload image for {selectedLayer.width}×{selectedLayer.height} area
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         <div className="relative bg-gray-900 rounded-lg p-3">
//                           <img
//                             src={selectedLayer.imageSrc}
//                             alt="Print area preview"
//                             className="w-full h-40 object-contain rounded"
//                           />
//                           <div className="flex justify-between mt-3">
//                             <button
//                               onClick={triggerPrintAreaImageUpload}
//                               className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded transition"
//                             >
//                               Replace Image
//                             </button>
//                             <button
//                               onClick={removePrintAreaImage}
//                               className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded transition"
//                             >
//                               Remove Image
//                             </button>
//                           </div>
//                         </div>

//                         <div>
//                           <p className="text-gray-400 font-medium">Image Fit</p>
//                           <select
//                             value={selectedLayer.fit || "cover"}
//                             onChange={(e) => updateLayer(selectedLayer.id, { fit: e.target.value })}
//                             className="w-full p-2 rounded bg-gray-700 text-white"
//                           >
//                             <option value="cover">Cover (Fill entire area)</option>
//                             <option value="contain">Contain (Fit inside)</option>
//                             <option value="fill">Fill (Stretch)</option>
//                           </select>
//                           <p className="text-xs text-gray-400 mt-1">
//                             Image will automatically fit the print area size
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}

//               {/* Layer Order Controls */}
//               <div className="flex gap-2 pt-4 border-t border-gray-700">
//                 <button
//                   onClick={() => bringForward(selectedLayer.id)}
//                   className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded transition"
//                 >
//                   Bring Forward
//                 </button>
//                 <button
//                   onClick={() => sendBackward(selectedLayer.id)}
//                   className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded transition"
//                 >
//                   Send Backward
//                 </button>
//               </div>

//               {/* Delete Layer */}
//               <div className="pt-2">
//                 <button
//                   onClick={() => removeLayer(selectedLayer.id)}
//                   className="w-full py-2 bg-red-600 hover:bg-red-700 rounded transition"
//                 >
//                   Delete Layer
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <p className="text-gray-400 text-center py-4">Select a layer to edit</p>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Editor;


// ============================================= perspective =====================


// Editor.jsx
import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { ReactSortable } from "react-sortablejs";
import { useParams } from "react-router-dom";
import { getProductById } from "../../api/product.api";
import { toPng, toJpeg } from "html-to-image";

function Editor() {
  const [mockup, setMockup] = useState(null);

  // internal raw setter and wrapper that records history
  const [layersState, _setLayersState] = useState([]);
  const layers = layersState;

  const historyRef = useRef([]);
  const futureRef = useRef([]);
  const HISTORY_LIMIT = 60;

  // wrapper to set layers and optionally record history
  const setLayers = (updater, options = { recordHistory: true }) => {
    _setLayersState((prev) => {
      const newLayers = typeof updater === "function" ? updater(prev) : updater;
      if (options.recordHistory) {
        try {
          historyRef.current.push(JSON.parse(JSON.stringify(prev)));
        } catch {
          historyRef.current.push(prev);
        }
        if (historyRef.current.length > HISTORY_LIMIT) {
          historyRef.current.shift();
        }
        futureRef.current = [];
      }
      return newLayers;
    });
  };

  const [showPrintareaSelect, setShowPrintareaSelect] = useState(false);
  const [printAreas, setPrintAreas] = useState([]);

  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const fileInputRef = useRef(null);
  const printAreaFileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const innerCanvasRef = useRef(null);

  const { editId } = useParams();

  // Zoom/scale
  const [scale, setScale] = useState(1);

  // Grid and Perspective States
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [draggingCorner, setDraggingCorner] = useState(null);

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

  // initial load from localStorage - DON'T record in history
  useEffect(() => {
    const savedMockup = localStorage.getItem("mockupToEdit");
    if (savedMockup) {
      const parsed = JSON.parse(savedMockup);
      setMockup(parsed);

      setLayers(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper Functions
  const addNewTextLayer = () => {
    const newLayer = {
      id: `layer-${Date.now()}`,
      type: "text",
      text: "New Text",
      name: "", // separate layer name
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
    setLayers((prev) => [...prev, newLayer]);
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
      // ✅ NEW: 3D Perspective Properties
      perspective: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      skewX: 0,
      skewY: 0,
      transformOrigin: "center center",
      enablePerspective: false, // Checkbox control
      corners: [ // 8 points for perspective dragging
        { x: 0, y: 0 },       // top-left
        { x: 150, y: 0 },     // top-middle
        { x: 300, y: 0 },     // top-right
        { x: 300, y: 100 },   // right-middle
        { x: 300, y: 200 },   // bottom-right
        { x: 150, y: 200 },   // bottom-middle
        { x: 0, y: 200 },     // bottom-left
        { x: 0, y: 100 },     // left-middle
      ]
    };
    setLayers((prev) => [...prev, newLayer]);
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
    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id !== id) return layer;

        const updatedLayer = { ...layer, ...updates };

        // ✅ FIX: Agar size change hua hai toh corners bhi update karo
        if ((updates.width !== undefined && updates.width !== layer.width) ||
          (updates.height !== undefined && updates.height !== layer.height)) {

          const newWidth = updates.width !== undefined ? updates.width : layer.width;
          const newHeight = updates.height !== undefined ? updates.height : layer.height;

          // Update corners with new size
          updatedLayer.corners = [
            { x: 0, y: 0 },
            { x: newWidth / 2, y: 0 },
            { x: newWidth, y: 0 },
            { x: newWidth, y: newHeight / 2 },
            { x: newWidth, y: newHeight },
            { x: newWidth / 2, y: newHeight },
            { x: 0, y: newHeight },
            { x: 0, y: newHeight / 2 },
          ];
        }

        return updatedLayer;
      })
    );
  };

  const removeLayer = (id) => {
    const layer = layers.find((l) => l.id === id);
    if (layer) {
      // Cleanup blob URLs
      if (layer.src && layer.src.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(layer.src);
        } catch (e) { }
      }
      if (layer.imageSrc && layer.imageSrc.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(layer.imageSrc);
        } catch (e) { }
      }
    }
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const bringForward = (id) => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(idx + 1, 0, item);
      return copy;
    });
  };

  const sendBackward = (id) => {
    setLayers((prev) => {
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

    setLayers((prev) => [...prev, duplicatedLayer]);
    setSelectedLayerId(duplicatedLayer.id);
  };

  const toggleLayerVisibility = (id) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  // Rotation with mouse
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

  // Print Area Functions
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
      // ✅ NEW: Add perspective properties for print area too
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
        { x: printArea.width / 2, y: 0 },
        { x: printArea.width, y: 0 },
        { x: printArea.width, y: printArea.height / 2 },
        { x: printArea.width, y: printArea.height },
        { x: printArea.width / 2, y: printArea.height },
        { x: 0, y: printArea.height },
        { x: 0, y: printArea.height / 2 },
      ]

    };

    setLayers((prev) => [...prev, newLayer]);
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

  // ---------------- Perspective Corner Dragging ----------------
  const startCornerDrag = (e, layerId, cornerIndex) => {
    e.stopPropagation();
    e.preventDefault();

    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;

    const canvasEl = innerCanvasRef.current;
    if (!canvasEl) return;

    const canvasRect = canvasEl.getBoundingClientRect();

    // Save initial positions
    const startX = e.clientX;
    const startY = e.clientY;
    const startCorners = [...layer.corners];

    const onMove = (ev) => {
      // Calculate mouse movement
      const deltaX = (ev.clientX - startX) / scale;
      const deltaY = (ev.clientY - startY) / scale;

      // Update the specific corner position
      const newCorners = [...startCorners];
      newCorners[cornerIndex] = {
        x: Math.max(0, Math.min(layer.width, startCorners[cornerIndex].x + deltaX)),
        y: Math.max(0, Math.min(layer.height, startCorners[cornerIndex].y + deltaY))
      };

      // Calculate perspective transforms from corners
      const width = layer.width;
      const height = layer.height;

      // Calculate based on corner positions
      const topLeft = newCorners[0];
      const topRight = newCorners[2];
      const bottomLeft = newCorners[6];
      const bottomRight = newCorners[4];

      // Calculate skew based on corner differences
      const skewX = ((topRight.y - topLeft.y) / height) * 45;
      const skewY = ((bottomLeft.x - topLeft.x) / width) * 45;

      // Calculate rotation based on corner positions
      const rotateX = ((topRight.y + bottomRight.y - topLeft.y - bottomLeft.y) / (2 * height)) * 30;
      const rotateY = ((bottomLeft.x + bottomRight.x - topLeft.x - topRight.x) / (2 * width)) * 30;

      // Calculate perspective (distance effect)
      const dx1 = Math.abs(topRight.x - topLeft.x);
      const dx2 = Math.abs(bottomRight.x - bottomLeft.x);
      const dy1 = Math.abs(bottomLeft.y - topLeft.y);
      const dy2 = Math.abs(bottomRight.y - topRight.y);

      const maxDiff = Math.max(dx1, dx2, dy1, dy2);
      const perspective = Math.min(1000, Math.max(100, maxDiff * 3));

      updateLayer(layerId, {
        corners: newCorners,
        skewX: Math.round(skewX),
        skewY: Math.round(skewY),
        rotateX: Math.round(rotateX),
        rotateY: Math.round(rotateY),
        perspective: Math.round(perspective)
      });
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

  // ---------------- Undo / Redo ----------------
  const undo = () => {
    if (historyRef.current.length === 0) return;
    const last = historyRef.current.pop();
    try {
      futureRef.current.push(JSON.parse(JSON.stringify(layers)));
    } catch {
      futureRef.current.push(layers);
    }
    _setLayersState(last);
    setSelectedLayerId(null);
  };

  const redo = () => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current.pop();
    try {
      historyRef.current.push(JSON.parse(JSON.stringify(layers)));
    } catch {
      historyRef.current.push(layers);
    }
    _setLayersState(next);
    setSelectedLayerId(null);
  };

  // ---------------- Export (PNG/JPEG) ----------------
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

  // ---------------- Lock toggle ----------------
  const toggleLockSelected = () => {
    if (!selectedLayer) return;
    updateLayer(selectedLayer.id, { locked: !selectedLayer.locked });
  };

  // toggle lock by id (for list icon)
  const toggleLockById = (id) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)));
  };

  // ---------------- Zoom controls ----------------
  const handleZoomIn = () => setScale((s) => Math.min(2, +(s + 0.1).toFixed(2)));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)));
  const handleZoomReset = () => setScale(1);

  // ---------------- Keyboard shortcuts ----------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      const cmd = e.ctrlKey || e.metaKey;

      // allow undo/redo even when typing (makes sense)
      if (cmd && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }
      if (cmd && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }

      // active element check
      const active = document.activeElement;
      const activeTag = active && active.tagName;
      const isTyping =
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA" ||
        (active && active.isContentEditable);

      // Duplicate (Ctrl+D) - only when NOT typing
      if (cmd && e.key.toLowerCase() === "d") {
        if (!isTyping) {
          e.preventDefault(); // prevent bookmark
          duplicateLayer();
        }
        return;
      }

      // Delete selected layer
      if (!isTyping && e.key === "Delete") {
        e.preventDefault();
        if (selectedLayerId) {
          removeLayer(selectedLayerId);
        }
        return;
      }

      // Export (Ctrl+E) - only when NOT typing
      if (cmd && e.key.toLowerCase() === "e") {
        if (!isTyping) {
          e.preventDefault();
          exportAsImage("png");
        }
        return;
      }

      // Lock toggle (Ctrl+L) - only when NOT typing
      if (cmd && e.key.toLowerCase() === "l") {
        if (!isTyping) {
          e.preventDefault();
          toggleLockSelected();
        }
        return;
      }

      // Zoom shortcuts (Ctrl + + / = / - / 0) - only when NOT typing
      if (cmd && !isTyping) {
        // Zoom in: '+' (often shift+'=') or '='
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          handleZoomIn();
          return;
        }
        // Zoom out: '-'
        if (e.key === "-") {
          e.preventDefault();
          handleZoomOut();
          return;
        }
        // Reset: 0
        if (e.key === "0") {
          e.preventDefault();
          handleZoomReset();
          return;
        }
      }

      // Arrow keys for nudge (only when NOT typing)
      if (
        !isTyping &&
        (e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight")
      ) {
        if (!selectedLayerId) return;
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 1;
        const sl = layers.find((l) => l.id === selectedLayerId);
        if (!sl) return;

        let nx = sl.x;
        let ny = sl.y;
        if (e.key === "ArrowUp") ny = sl.y - delta;
        if (e.key === "ArrowDown") ny = sl.y + delta;
        if (e.key === "ArrowLeft") nx = sl.x - delta;
        if (e.key === "ArrowRight") nx = sl.x + delta;

        updateLayer(selectedLayerId, { x: nx, y: ny });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLayerId, layers]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------- Grid Drawing ----------------
  const drawGrid = () => {
    if (!showGrid || !innerCanvasRef.current) return null;

    const gridStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 0,
    };

    return (
      <div style={gridStyle}>
        <svg width="100%" height="100%">
          {/* Vertical lines */}
          {Array.from({ length: Math.ceil(getCanvasSize().width / gridSize) + 1 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * gridSize}
              y1="0"
              x2={i * gridSize}
              y2={getCanvasSize().height}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
            />
          ))}
          {/* Horizontal lines */}
          {Array.from({ length: Math.ceil(getCanvasSize().height / gridSize) + 1 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * gridSize}
              x2={getCanvasSize().width}
              y2={i * gridSize}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-blue-400">Mockup Editor</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPrintareaSelect((prev) => !prev)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium shadow-md transition duration-200"
          >
            + Add Printarea
          </button>

          {showPrintareaSelect && (
            <div className="absolute top-16 right-6 bg-gray-800 rounded-lg shadow-lg p-3 w-64 z-50">
              <p className="text-gray-300 text-sm mb-2">Select Print Area</p>
              <select
                className="w-full p-2 rounded bg-gray-700 text-white"
                onChange={(e) => {
                  const selected = printAreas.find((p) => p._id === e.target.value);
                  if (selected) addPrintAreaToCanvas(selected);
                  setShowPrintareaSelect(false);
                }}
              >
                <option value="">-- Select --</option>
                {printAreas.map((pa) => (
                  <option key={pa._id} value={pa._id}>
                    {pa.displayName} | {pa.width} x {pa.height}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium shadow-md transition duration-200"
            onClick={addImageLayerButton}
          >
            + Add Image
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium shadow-md transition duration-200"
            onClick={onSave}
          >
            Save
          </button>

          {/* Undo / Redo */}
          <button
            onClick={undo}
            title="Undo (Ctrl/Cmd + Z)"
            className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            ⤺
          </button>
          <button
            onClick={redo}
            title="Redo (Ctrl/Cmd + Y)"
            className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            ⤻
          </button>

          {/* Export */}
          <button
            onClick={() => exportAsImage("png")}
            className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700"
            title="Export PNG (Ctrl+E)"
          >
            PNG
          </button>
          <button
            onClick={() => exportAsImage("jpg")}
            className="px-3 py-2 rounded bg-amber-600 hover:bg-amber-700"
            title="Export JPG"
          >
            JPG
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-2 rounded ${showGrid ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}
            title="Toggle Grid"
          >
            Grid
          </button>

          {/* Zoom */}
          <div className="flex items-center gap-1 bg-gray-700 p-1 rounded">
            <button
              onClick={handleZoomOut}
              className="px-2 py-1 rounded hover:bg-gray-600"
              title="Zoom out (Ctrl+-)"
            >
              −
            </button>
            <div className="px-2 text-sm">{Math.round(scale * 100)}%</div>
            <button
              onClick={handleZoomIn}
              className="px-2 py-1 rounded hover:bg-gray-600"
              title="Zoom in (Ctrl+= / Ctrl++)"
            >
              +
            </button>
            <button
              onClick={handleZoomReset}
              className="px-2 py-1 rounded hover:bg-gray-600"
              title="Reset zoom (Ctrl+0)"
            >
              reset
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Left Layers Panel */}
        <div className="w-full lg:w-64 bg-gray-800 p-4 space-y-4 flex-shrink-0 overflow-auto">
          <h2 className="text-lg font-semibold text-gray-300 mb-2">Layers</h2>

          {layers.length === 0 && (
            <div className="text-gray-400">No layers yet. Add text or image.</div>
          )}

          <ReactSortable
            list={layers}
            setList={(list) => setLayers(list)}
            animation={200}
            ghostClass="bg-gray-500/50"
            handle=".drag-handle"
          >
            {layers.map((layer) => (
              <div
                key={layer.id}
                onClick={() => setSelectedLayerId(layer.id)}
                className={`w-full flex items-center justify-between py-2 px-2 rounded shadow cursor-pointer transition ${selectedLayerId === layer.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  }`}
              >
                <span
                  className="drag-handle truncate cursor-move"
                  onDoubleClick={() => {
                    const prefill =
                      layer.name && layer.name !== ""
                        ? layer.name
                        : layer.type === "text"
                          ? layer.text
                          : "Image Layer";
                    const newName = prompt("Enter new layer name", prefill);
                    if (newName !== null) updateLayer(layer.id, { name: newName });
                  }}
                >
                  {layer.name && layer.name !== ""
                    ? layer.name
                    : layer.type === "text"
                      ? layer.text
                      : layer.type === "printarea"
                        ? layer.name || "Print Area"
                        : "Image Layer"}
                </span>

                <div className="flex gap-2">
                  {/* Lock Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLockById(layer.id);
                    }}
                    className="text-gray-300 hover:text-indigo-300 transition cursor-pointer"
                    title={layer.locked ? "Unlock layer (Ctrl+L)" : "Lock layer (Ctrl+L)"}
                  >
                    {layer.locked ? (
                      // locked icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                        <path d="M8 1a3 3 0 0 0-3 3v3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V4a3 3 0 0 0-3-3z" />
                      </svg>
                    ) : (
                      // unlocked icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-unlock" viewBox="0 0 16 16">
                        <path d="M11 1a2 2 0 0 0-2 2v2H7V3a4 4 0 0 1 8 0v2h-1V3a3 3 0 0 0-3-3z" />
                        <path d="M3 7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H3z" />
                      </svg>
                    )}
                  </button>

                  {/* Eye Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                    className="text-gray-300 hover:text-green-400 transition cursor-pointer"
                    title={layer.visible ? "Hide Layer" : "Show Layer"}
                  >
                    {layer.visible ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                      </svg>
                    )}
                  </button>

                  {/* Duplicate Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLayerId(layer.id);
                      duplicateLayer();
                    }}
                    className="text-gray-300 hover:text-yellow-400 transition cursor-pointer"
                    title="Duplicate Layer (Ctrl+D)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-files" viewBox="0 0 16 16">
                      <path d="M13 1H5a1 1 0 0 0-1 1v1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM5 2h8v1H5V2zm-3 2h2v9H2V4zm3 9v-9h6v9H5zm7-1h-2v-1h2v1z" />
                    </svg>
                  </button>

                  {/* Delete Icon (UI button only) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLayer(layer.id);
                    }}
                    className="text-gray-300 hover:text-red-500 transition cursor-pointer"
                    title="Delete Layer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </ReactSortable>
        </div>

        {/* Editor Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 flex items-center justify-center bg-gray-700 mx-4 my-4 lg:my-0 rounded-xl relative overflow-hidden"
        >
          {mockup ? (
            <div
              className="relative bg-black/0"
              style={{
                width: "90%",
                height: "90%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                ref={innerCanvasRef}
                className="relative"
                style={{
                  width: getCanvasSize().width,
                  height: getCanvasSize().height,
                  display: "inline-block",
                  position: "relative",
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                }}
              >
                {/* Grid */}
                {drawGrid()}

                {layers.map((layer, index) => {
                  if (layer.visible === false) return null;
                  const zIndex = index + 1;

                  if (layer.type === "background") {
                    return (
                      <img
                        key={layer.id}
                        src={layer.src}
                        alt="background"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          display: "block",
                          borderRadius: 8,
                          boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
                          position: "absolute",
                          left: 0,
                          top: 0,
                        }}
                      />
                    );
                  }

                  const showRotationHandle = selectedLayerId === layer.id && layer.type !== "background" && !layer.locked;
                  // const showPerspectiveHandles = selectedLayerId === layer.id && layer.type === "image" && layer.enablePerspective;
                  const showPerspectiveHandles = selectedLayerId === layer.id &&
                    (layer.type === "image" || layer.type === "printarea") &&
                    layer.enablePerspective;

                  return (
                    <Rnd
                      key={layer.id}
                      size={{ width: layer.width, height: layer.height }}
                      position={{ x: layer.x, y: layer.y }}
                      bounds="parent"
                      onDragStop={(e, d) => updateLayer(layer.id, { x: d.x, y: d.y })}
                      onResizeStop={(e, direction, ref, delta, position) =>
                        updateLayer(layer.id, {
                          width: parseInt(ref.style.width, 10),
                          height: parseInt(ref.style.height, 10),
                          ...position,
                        })
                      }
                      onClick={() => setSelectedLayerId(layer.id)}
                      enableResizing={layer.type !== "background" && !layer.locked &&
                        !(layer.enablePerspective && (layer.type === "image" || layer.type === "printarea"))}
                      // enableResizing={layer.type !== "background" && !layer.locked && !layer.enablePerspective}
                      disableDragging={!!layer.locked}
                      scale={1}
                      style={{
                        zIndex,
                        border:
                          selectedLayerId === layer.id
                            ? "2px solid #3b82f6"
                            : layer.type === "printarea" && layer.border
                              ? "2px dashed #22c55e"
                              : "1px dashed rgba(255,255,255,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: layer.locked ? "not-allowed" : "move",
                        pointerEvents: "auto",
                        position: "absolute",
                      }}
                    >
                      {/* WRAPPER DIV FOR ROTATION */}
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          transform: `rotate(${layer.rotation || 0}deg) scale(${scale})`,
                          transformOrigin: "center center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: layer.opacity !== undefined ? layer.opacity : 1,
                          background: layer.type === "text" ? "transparent" : "none",
                        }}
                      >
                        {/* yahan saari content aayegi */}
                        {layer.type === "text" && (
                          <div
                            style={{
                              fontSize: layer.fontSize,
                              color: layer.color,
                              fontWeight: "700",
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              userSelect: "none",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {layer.text}
                          </div>
                        )}

                        {layer.type === "image" && (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              perspective: `${layer.perspective || 0}px`,
                              transformStyle: "preserve-3d",
                            }}
                          >
                            <img
                              src={layer.src}
                              alt="layer"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: layer.fit || "contain",
                                pointerEvents: "none",
                                transform: `
                                  rotateX(${layer.rotateX || 0}deg)
                                  rotateY(${layer.rotateY || 0}deg)
                                  rotateZ(${layer.rotateZ || 0}deg)
                                  skewX(${layer.skewX || 0}deg)
                                  skewY(${layer.skewY || 0}deg)
                                `,
                                transformOrigin: layer.transformOrigin || "center center",
                              }}
                            />
                          </div>
                        )}



                        {layer.type === "printarea" && (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              perspective: `${layer.perspective || 0}px`,
                              transformStyle: "preserve-3d",
                            }}
                          >
                            {layer.hasImage ? (
                              <img
                                src={layer.imageSrc}
                                alt="Print area"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: layer.fit || "cover",
                                  pointerEvents: "none",
                                  transform: `
            rotateX(${layer.rotateX || 0}deg)
            rotateY(${layer.rotateY || 0}deg)
            rotateZ(${layer.rotateZ || 0}deg)
            skewX(${layer.skewX || 0}deg)
            skewY(${layer.skewY || 0}deg)
          `,
                                  transformOrigin: layer.transformOrigin || "center center",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  background: "rgba(34,197,94,0.08)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 14,
                                  color: "#22c55e",
                                  fontWeight: 600,
                                  userSelect: "none",
                                  textAlign: "center",
                                  overflow: "hidden",
                                  transform: `
            rotateX(${layer.rotateX || 0}deg)
            rotateY(${layer.rotateY || 0}deg)
            rotateZ(${layer.rotateZ || 0}deg)
            skewX(${layer.skewX || 0}deg)
            skewY(${layer.skewY || 0}deg)
          `,
                                  transformOrigin: layer.transformOrigin || "center center",
                                }}
                              >
                                {layer.name || "Print Area"}
                                <br />
                                {layer.width} × {layer.height}
                                <br />
                                <span
                                  style={{
                                    fontSize: 10,
                                    color: "#888",
                                    fontWeight: "normal",
                                  }}
                                >
                                  Upload image from properties panel
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Perspective Handles - 8 points */}
                        {showPerspectiveHandles && layer.corners && (
                          <>
                            {layer.corners.map((corner, index) => (
                              <div
                                key={`corner-${index}`}
                                onMouseDown={(e) => startCornerDrag(e, layer.id, index)}
                                style={{
                                  position: "absolute",
                                  left: corner.x - 4,
                                  top: corner.y - 4,
                                  width: 8,
                                  height: 8,
                                  backgroundColor: "#f59e0b",
                                  borderRadius: "50%",
                                  border: "2px solid white",
                                  cursor: "move",
                                  zIndex: 9999,
                                }}
                                title={`Drag to adjust perspective (Point ${index + 1})`}
                              />
                            ))}
                          </>
                        )}

                        {/* Rotation Handle */}
                        {showRotationHandle && (
                          <div
                            onMouseDown={(e) => startRotation(e, layer.id)}
                            className="absolute top-0 right-0 w-4 h-4 rounded-full bg-blue-500 cursor-crosshair"
                            style={{ zIndex: 9999 }}
                          />
                        )}
                      </div>
                    </Rnd>
                  );
                })}
              </div>
            </div>
          ) : (
            <span className="text-gray-400 text-lg">No mockup selected</span>
          )}
        </div>

        {/* Right Properties Sidebar */}
        <div className="w-full lg:w-64 bg-gray-800 p-6 space-y-6 flex-shrink-0 overflow-auto">
          <h2 className="text-xl font-semibold text-gray-300 mb-2">Properties</h2>

          <div className="flex gap-2 mb-3">
            <button
              onClick={addNewTextLayer}
              className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded shadow transition"
            >
              + Text
            </button>
            <button
              onClick={addImageLayerButton}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded shadow transition"
            >
              + Image
            </button>
          </div>

          <button
            onClick={duplicateLayer}
            disabled={!selectedLayer}
            className={`w-full py-2 rounded shadow mb-4 transition ${selectedLayer ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-600 cursor-not-allowed"
              }`}
          >
            Duplicate Layer
          </button>

          {selectedLayer ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-300 font-medium">
                  {selectedLayer.type === "text"
                    ? "Text Layer"
                    : selectedLayer.type === "image"
                      ? "Image Layer"
                      : selectedLayer.type === "printarea"
                        ? "Print Area"
                        : "Background"}
                </div>
                <div className="text-sm text-gray-400">{selectedLayer.id}</div>
              </div>

              <div className="flex gap-2 items-center">
                <div className="text-gray-400 font-medium">Layer Name</div>
                <button
                  onClick={toggleLockSelected}
                  className={`ml-auto px-2 py-1 rounded ${selectedLayer.locked ? "bg-red-600" : "bg-gray-700 hover:bg-gray-600"
                    }`}
                >
                  {selectedLayer.locked ? "Unlock" : "Lock"}
                </button>
              </div>

              <div>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={selectedLayer.name ?? ""}
                  onChange={(e) =>
                    updateLayer(selectedLayer.id, {
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <p className="text-gray-400 font-medium">Position (x, y)</p>
                <div className="flex gap-2 mt-1">
                  <input
                    type="number"
                    className="w-1/2 p-2 rounded bg-gray-700 text-white"
                    value={Math.round(selectedLayer.x)}
                    onChange={(e) =>
                      updateLayer(selectedLayer.id, { x: parseInt(e.target.value) || 0 })
                    }
                  />
                  <input
                    type="number"
                    className="w-1/2 p-2 rounded bg-gray-700 text-white"
                    value={Math.round(selectedLayer.y)}
                    onChange={(e) =>
                      updateLayer(selectedLayer.id, { y: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div>
                <p className="text-gray-400 font-medium">Size (w, h)</p>
                <div className="flex gap-2 mt-1">
                  <input
                    type="number"
                    className="w-1/2 p-2 rounded bg-gray-700 text-white"
                    value={Math.round(selectedLayer.width)}
                    onChange={(e) =>
                      updateLayer(selectedLayer.id, { width: parseInt(e.target.value) || 1 })
                    }
                  />
                  <input
                    type="number"
                    className="w-1/2 p-2 rounded bg-gray-700 text-white"
                    value={Math.round(selectedLayer.height)}
                    onChange={(e) =>
                      updateLayer(selectedLayer.id, { height: parseInt(e.target.value) || 1 })
                    }
                  />
                </div>
              </div>

              <div>
                <p className="text-gray-400 font-medium">Rotation (deg)</p>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={selectedLayer.rotation || 0}
                  onChange={(e) =>
                    updateLayer(selectedLayer.id, { rotation: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <p className="text-gray-400 font-medium">Opacity</p>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={selectedLayer.opacity ?? 1}
                    onChange={(e) =>
                      updateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <div className="w-12 text-right">{Math.round((selectedLayer.opacity ?? 1) * 100)}%</div>
                </div>
              </div>

              {/* Text Layer Properties */}
              {selectedLayer.type === "text" && (
                <>
                  <div>
                    <p className="text-gray-400 font-medium">Text</p>
                    <input
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      value={selectedLayer.text}
                      onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                    />
                  </div>

                  <div>
                    <p className="text-gray-400 font-medium">Font Size</p>
                    <input
                      type="number"
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      value={selectedLayer.fontSize}
                      onChange={(e) =>
                        updateLayer(selectedLayer.id, {
                          fontSize: parseInt(e.target.value) || 12,
                        })
                      }
                    />
                  </div>

                  <div>
                    <p className="text-gray-400 font-medium">Color</p>
                    <input
                      type="color"
                      className="w-full h-10 p-1 rounded"
                      value={selectedLayer.color}
                      onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })}
                    />
                  </div>
                </>
              )}

              {/* Image Layer Properties */}
              {selectedLayer.type === "image" && (
                <>
                  <div>
                    <p className="text-gray-400 font-medium">Replace Image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (!file) return;
                        if (selectedLayer.src && selectedLayer.src.startsWith("blob:")) {
                          try {
                            URL.revokeObjectURL(selectedLayer.src);
                          } catch (err) { }
                        }
                        const url = URL.createObjectURL(file);
                        updateLayer(selectedLayer.id, { src: url });
                      }}
                      className="w-full mt-1 p-2 bg-gray-700 rounded"
                    />
                  </div>

                  <div>
                    <p className="text-gray-400 font-medium">Fit Mode</p>
                    <select
                      value={selectedLayer.fit || "contain"}
                      onChange={(e) => updateLayer(selectedLayer.id, { fit: e.target.value })}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    >
                      <option value="contain">Contain</option>
                      <option value="cover">Cover</option>
                      <option value="fill">Fill</option>
                    </select>
                  </div>

                  {/* ✅ NEW: Perspective Checkbox */}
                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-gray-300 font-medium">Perspective</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLayer.enablePerspective || false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            updateLayer(selectedLayer.id, {
                              enablePerspective: checked
                            });
                            setShowGrid(checked); // Auto show grid when perspective enabled
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    {selectedLayer.enablePerspective && (
                      <div className="space-y-4">
                        <p className="text-xs text-gray-400">
                          ✅ Perspective enabled! Drag the 8 yellow points on canvas to adjust.
                        </p>

                        {/* Perspective (Depth) */}
                        <div className="mb-3">
                          <div className="flex justify-between">
                            <p className="text-gray-400 font-medium">Perspective</p>
                            <span className="text-xs text-gray-400">{selectedLayer.perspective || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1000"
                            step="10"
                            value={selectedLayer.perspective || 0}
                            onChange={(e) =>
                              updateLayer(selectedLayer.id, { perspective: parseInt(e.target.value) || 0 })
                            }
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>0px</span>
                            <span>500px</span>
                            <span>1000px</span>
                          </div>
                        </div>

                        {/* 3D Rotation */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div>
                            <p className="text-gray-400 text-sm">Rotate X</p>
                            <input
                              type="number"
                              className="w-full p-2 rounded bg-gray-700 text-white"
                              value={selectedLayer.rotateX || 0}
                              onChange={(e) =>
                                updateLayer(selectedLayer.id, { rotateX: parseInt(e.target.value) || 0 })
                              }
                              min="-180"
                              max="180"
                            />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Rotate Y</p>
                            <input
                              type="number"
                              className="w-full p-2 rounded bg-gray-700 text-white"
                              value={selectedLayer.rotateY || 0}
                              onChange={(e) =>
                                updateLayer(selectedLayer.id, { rotateY: parseInt(e.target.value) || 0 })
                              }
                              min="-180"
                              max="180"
                            />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Rotate Z</p>
                            <input
                              type="number"
                              className="w-full p-2 rounded bg-gray-700 text-white"
                              value={selectedLayer.rotateZ || 0}
                              onChange={(e) =>
                                updateLayer(selectedLayer.id, { rotateZ: parseInt(e.target.value) || 0 })
                              }
                              min="-180"
                              max="180"
                            />
                          </div>
                        </div>

                        {/* Skew */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <p className="text-gray-400 text-sm">Skew X</p>
                            <input
                              type="number"
                              className="w-full p-2 rounded bg-gray-700 text-white"
                              value={selectedLayer.skewX || 0}
                              onChange={(e) =>
                                updateLayer(selectedLayer.id, { skewX: parseInt(e.target.value) || 0 })
                              }
                              min="-45"
                              max="45"
                            />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Skew Y</p>
                            <input
                              type="number"
                              className="w-full p-2 rounded bg-gray-700 text-white"
                              value={selectedLayer.skewY || 0}
                              onChange={(e) =>
                                updateLayer(selectedLayer.id, { skewY: parseInt(e.target.value) || 0 })
                              }
                              min="-45"
                              max="45"
                            />
                          </div>
                        </div>

                        {/* Transform Origin */}
                        <div>
                          <p className="text-gray-400 font-medium">Transform Origin</p>
                          <select
                            value={selectedLayer.transformOrigin || "center center"}
                            onChange={(e) =>
                              updateLayer(selectedLayer.id, { transformOrigin: e.target.value })
                            }
                            className="w-full p-2 rounded bg-gray-700 text-white"
                          >
                            <option value="center center">Center</option>
                            <option value="top left">Top Left</option>
                            <option value="top center">Top Center</option>
                            <option value="top right">Top Right</option>
                            <option value="center left">Center Left</option>
                            <option value="center right">Center Right</option>
                            <option value="bottom left">Bottom Left</option>
                            <option value="bottom center">Bottom Center</option>
                            <option value="bottom right">Bottom Right</option>
                          </select>
                        </div>

                        {/* Reset Button */}
                        <button
                          onClick={() =>
                            updateLayer(selectedLayer.id, {
                              perspective: 0,
                              rotateX: 0,
                              rotateY: 0,
                              rotateZ: 0,
                              skewX: 0,
                              skewY: 0,
                              transformOrigin: "center center",
                              corners: [
                                { x: 0, y: 0 },
                                { x: selectedLayer.width / 2, y: 0 },
                                { x: selectedLayer.width, y: 0 },
                                { x: selectedLayer.width, y: selectedLayer.height / 2 },
                                { x: selectedLayer.width, y: selectedLayer.height },
                                { x: selectedLayer.width / 2, y: selectedLayer.height },
                                { x: 0, y: selectedLayer.height },
                                { x: 0, y: selectedLayer.height / 2 },
                              ]
                            })
                          }
                          className="w-full mt-3 py-2 bg-gray-600 hover:bg-gray-500 rounded transition"
                        >
                          Reset Perspective
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Print Area Properties */}
              {selectedLayer.type === "printarea" && (
                <>
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-gray-400 font-medium mb-2">Print Area Image</p>

                    <input
                      ref={printAreaFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePrintAreaImageUpload}
                      style={{ display: "none" }}
                    />

                    {!selectedLayer.hasImage ? (
                      <div className="space-y-3">
                        <button
                          onClick={triggerPrintAreaImageUpload}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
                        >
                          Upload Image
                        </button>
                        <p className="text-xs text-gray-400 text-center">
                          Upload image for {selectedLayer.width}×{selectedLayer.height} area
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative bg-gray-900 rounded-lg p-3">
                          <img
                            src={selectedLayer.imageSrc}
                            alt="Print area preview"
                            className="w-full h-40 object-contain rounded"
                          />
                          <div className="flex justify-between mt-3">
                            <button
                              onClick={triggerPrintAreaImageUpload}
                              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded transition"
                            >
                              Replace Image
                            </button>
                            <button
                              onClick={removePrintAreaImage}
                              className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded transition"
                            >
                              Remove Image
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-400 font-medium">Image Fit</p>
                          <select
                            value={selectedLayer.fit || "cover"}
                            onChange={(e) => updateLayer(selectedLayer.id, { fit: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                          >
                            <option value="cover">Cover (Fill entire area)</option>
                            <option value="contain">Contain (Fit inside)</option>
                            <option value="fill">Fill (Stretch)</option>
                          </select>
                          <p className="text-xs text-gray-400 mt-1">
                            Image will automatically fit the print area size
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ✅ NEW: Perspective Controls for Print Area */}
                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-gray-300 font-medium">Perspective</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLayer.enablePerspective || false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            updateLayer(selectedLayer.id, {
                              enablePerspective: checked
                            });
                            setShowGrid(checked);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    {selectedLayer.enablePerspective && (
                      <div className="space-y-4">
                        <p className="text-xs text-gray-400">
                          ✅ Perspective enabled! Drag the 8 yellow points on canvas to adjust.
                        </p>

                        {/* Perspective (Depth) */}
                        <div className="mb-3">
                          <div className="flex justify-between">
                            <p className="text-gray-400 font-medium">Perspective</p>
                            <span className="text-xs text-gray-400">{selectedLayer.perspective || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1000"
                            step="10"
                            value={selectedLayer.perspective || 0}
                            onChange={(e) =>
                              updateLayer(selectedLayer.id, { perspective: parseInt(e.target.value) || 0 })
                            }
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>0px</span>
                            <span>500px</span>
                            <span>1000px</span>
                          </div>
                        </div>

                        {/* 3D Rotation */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div>
                            <p className="text-gray-400 text-sm">Rotate X</p>
                            <input
                              type="number"
                              className="w-full p-2 rounded bg-gray-700 text-white"
                              value={selectedLayer.rotateX || 0}
                              onChange={(e) =>
                                updateLayer(selectedLayer.id, { rotateX: parseInt(e.target.value) || 0 })
                              }
                              min="-180"
                              max="180"
                            />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Rotate Y</p>
                            <input
                              type="number"
                              className="w-full p-2 rounded bg-gray-700 text-white"
                              value={selectedLayer.rotateY || 0}
                              onChange={(e) =>
                                updateLayer(selectedLayer.id, { rotateY: parseInt(e.target.value) || 0 })
                              }
                              min="-180"
                              max="180"
                            />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Rotate Z</p>
                            <input
                              type="number"
                              className="w-full p-2 rounded bg-gray-700 text-white"
                              value={selectedLayer.rotateZ || 0}
                              onChange={(e) =>
                                updateLayer(selectedLayer.id, { rotateZ: parseInt(e.target.value) || 0 })
                              }
                              min="-180"
                              max="180"
                            />
                          </div>
                        </div>

                        {/* Skew */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <p className="text-gray-400 text-sm">Skew X</p>
                            <input
                              type="number"
                              className="w-full p-2 rounded bg-gray-700 text-white"
                              value={selectedLayer.skewX || 0}
                              onChange={(e) =>
                                updateLayer(selectedLayer.id, { skewX: parseInt(e.target.value) || 0 })
                              }
                              min="-45"
                              max="45"
                            />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Skew Y</p>
                            <input
                              type="number"
                              className="w-full p-2 rounded bg-gray-700 text-white"
                              value={selectedLayer.skewY || 0}
                              onChange={(e) =>
                                updateLayer(selectedLayer.id, { skewY: parseInt(e.target.value) || 0 })
                              }
                              min="-45"
                              max="45"
                            />
                          </div>
                        </div>

                        {/* Transform Origin */}
                        <div>
                          <p className="text-gray-400 font-medium">Transform Origin</p>
                          <select
                            value={selectedLayer.transformOrigin || "center center"}
                            onChange={(e) =>
                              updateLayer(selectedLayer.id, { transformOrigin: e.target.value })
                            }
                            className="w-full p-2 rounded bg-gray-700 text-white"
                          >
                            <option value="center center">Center</option>
                            <option value="top left">Top Left</option>
                            <option value="top center">Top Center</option>
                            <option value="top right">Top Right</option>
                            <option value="center left">Center Left</option>
                            <option value="center right">Center Right</option>
                            <option value="bottom left">Bottom Left</option>
                            <option value="bottom center">Bottom Center</option>
                            <option value="bottom right">Bottom Right</option>
                          </select>
                        </div>

                        {/* Reset Button */}
                        <button
                          onClick={() =>
                            updateLayer(selectedLayer.id, {
                              perspective: 0,
                              rotateX: 0,
                              rotateY: 0,
                              rotateZ: 0,
                              skewX: 0,
                              skewY: 0,
                              transformOrigin: "center center",
                              corners: [
                                { x: 0, y: 0 },
                                { x: selectedLayer.width / 2, y: 0 },
                                { x: selectedLayer.width, y: 0 },
                                { x: selectedLayer.width, y: selectedLayer.height / 2 },
                                { x: selectedLayer.width, y: selectedLayer.height },
                                { x: selectedLayer.width / 2, y: selectedLayer.height },
                                { x: 0, y: selectedLayer.height },
                                { x: 0, y: selectedLayer.height / 2 },
                              ]
                            })
                          }
                          className="w-full mt-3 py-2 bg-gray-600 hover:bg-gray-500 rounded transition"
                        >
                          Reset Perspective
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Layer Order Controls */}
              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <button
                  onClick={() => bringForward(selectedLayer.id)}
                  className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded transition"
                >
                  Bring Forward
                </button>
                <button
                  onClick={() => sendBackward(selectedLayer.id)}
                  className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded transition"
                >
                  Send Backward
                </button>
              </div>

              {/* Delete Layer */}
              <div className="pt-2">
                <button
                  onClick={() => removeLayer(selectedLayer.id)}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 rounded transition"
                >
                  Delete Layer
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">Select a layer to edit</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Editor;

