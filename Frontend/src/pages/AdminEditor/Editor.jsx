

// ================================= LAST ===================================================

// import React, { useState, useEffect } from "react";
// import { Rnd } from "react-rnd";

// function Editor() {
//   const [mockup, setMockup] = useState(null);
//   const [layers, setLayers] = useState([]);
//   const [selectedLayerId, setSelectedLayerId] = useState(null);

//   useEffect(() => {
//     const savedMockup = localStorage.getItem("mockupToEdit");
//     if (savedMockup) {
//       const parsed = JSON.parse(savedMockup);
//       setMockup(parsed);
//       setLayers([
//         {
//           id: "layer-1",
//           type: "image",
//           src: parsed.url,
//           x: 50,
//           y: 50,
//           width: 300,
//           height: 300,
//           rotation: 0,
//         },
//       ]);
//       setSelectedLayerId("layer-1");
//     }
//   }, []);

//   // Add new text layer
//   const addNewTextLayer = () => {
//     const newLayer = {
//       id: `layer-${Date.now()}`,
//       type: "text",
//       text: "New Text",
//       x: 100,
//       y: 100,
//       width: 150,
//       height: 50,
//       rotation: 0,
//       fontSize: 18,
//       color: "#ffffff",
//     };
//     setLayers((prev) => [...prev, newLayer]);
//     setSelectedLayerId(newLayer.id);
//   };

//   const updateLayer = (id, updates) => {
//     setLayers((prev) =>
//       prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
//     );
//   };

//   const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);

//   return (
//     <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
//       {/* Header */}
//       <header className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
//         <h1 className="text-2xl font-bold text-blue-400">Mockup Editor</h1>
//         <button
//           className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium shadow-md transition duration-200"
//           onClick={() => console.log({ layers })}
//         >
//           Save
//         </button>
//       </header>

//       <main className="flex flex-1 flex-col lg:flex-row">
//         {/* Left Toolbar */}
//         <div className="w-full lg:w-64 bg-gray-800 p-6 space-y-4 flex-shrink-0">
//           <h2 className="text-xl font-semibold text-gray-300 mb-4">Layers</h2>
//           {layers.map((layer) => (
//             <button
//               key={layer.id}
//               onClick={() => setSelectedLayerId(layer.id)}
//               className={`w-full py-2 rounded shadow text-left px-2 transition ${
//                 selectedLayerId === layer.id
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-700 hover:bg-gray-600 text-gray-200"
//               }`}
//             >
//               {layer.type === "text" ? layer.text : "Image Layer"}
//             </button>
//           ))}
//         </div>

//         {/* Editor Canvas */}
//         <div className="flex-1 flex items-center justify-center bg-gray-700 mx-4 my-4 lg:my-0 rounded-xl relative overflow-hidden">
//           {mockup ? (
//             <div className="relative w-full h-full flex items-center justify-center">
//               {/* Mockup Image */}
//               <img
//                 src={mockup.url}
//                 alt={mockup.title}
//                 className="max-w-full max-h-full object-contain rounded-xl shadow-lg border border-gray-600"
//               />

//               {/* Layers */}
//               {layers.map((layer) => (
//                 <Rnd
//                   key={layer.id}
//                   size={{ width: layer.width, height: layer.height }}
//                   position={{ x: layer.x, y: layer.y }}
//                   onDragStop={(e, d) =>
//                     updateLayer(layer.id, { x: d.x, y: d.y })
//                   }
//                   onResizeStop={(e, direction, ref, delta, position) =>
//                     updateLayer(layer.id, {
//                       width: parseInt(ref.style.width),
//                       height: parseInt(ref.style.height),
//                       ...position,
//                     })
//                   }
//                   style={{
//                     border:
//                       selectedLayerId === layer.id
//                         ? "2px solid #3b82f6"
//                         : "1px dashed #ccc",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     cursor: "move",
//                   }}
//                   onClick={() => setSelectedLayerId(layer.id)}
//                 >
//                   {layer.type === "text" ? (
//                     <span
//                       style={{
//                         fontSize: layer.fontSize,
//                         color: layer.color,
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {layer.text}
//                     </span>
//                   ) : (
//                     <img
//                       src={layer.src}
//                       alt="layer"
//                       className="w-full h-full object-contain"
//                     />
//                   )}
//                 </Rnd>
//               ))}
//             </div>
//           ) : (
//             <span className="text-gray-400 text-lg">No mockup selected</span>
//           )}
//         </div>

//         {/* Right Properties Sidebar */}
//         <div className="w-full lg:w-64 bg-gray-800 p-6 space-y-6 flex-shrink-0">
//           <h2 className="text-xl font-semibold text-gray-300 mb-4">Properties</h2>

//           {/* New Text Button */}
//           <button
//             onClick={addNewTextLayer}
//             className="w-full py-2 bg-green-600 hover:bg-green-700 rounded shadow mb-4"
//           >
//             + Add New Text
//           </button>

//           {/* Selected Layer Properties */}
//           {selectedLayer ? (
//             <div className="space-y-4">
//               {selectedLayer.type === "text" && (
//                 <>
//                   <div>
//                     <p className="text-gray-400 font-medium">Text:</p>
//                     <input
//                       className="w-full p-2 rounded bg-gray-700 text-white"
//                       value={selectedLayer.text}
//                       onChange={(e) =>
//                         updateLayer(selectedLayer.id, { text: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <p className="text-gray-400 font-medium">Font Size:</p>
//                     <input
//                       type="number"
//                       className="w-full p-2 rounded bg-gray-700 text-white"
//                       value={selectedLayer.fontSize}
//                       onChange={(e) =>
//                         updateLayer(selectedLayer.id, {
//                           fontSize: parseInt(e.target.value),
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <p className="text-gray-400 font-medium">Color:</p>
//                     <input
//                       type="color"
//                       className="w-full h-10 p-1 rounded"
//                       value={selectedLayer.color}
//                       onChange={(e) =>
//                         updateLayer(selectedLayer.id, { color: e.target.value })
//                       }
//                     />
//                   </div>
//                 </>
//               )}
//             </div>
//           ) : (
//             <p className="text-gray-400">Select a layer to edit</p>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Editor;

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Editor.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { Rnd } from "react-rnd";
// import { ReactSortable } from "react-sortablejs";
// import { useParams } from "react-router-dom";
// import { getProductById } from "../../api/product.api";

// function Editor() {
//   const [mockup, setMockup] = useState(null);
//   const [layers, setLayers] = useState([]);
//   const [showPrintareaSelect, setShowPrintareaSelect] = useState(false);
//   const [printAreas, setPrintAreas] = useState([]); // API se aane wala array

//   const [selectedLayerId, setSelectedLayerId] = useState(null);
//   const fileInputRef = useRef(null);
//   const canvasRef = useRef(null);

//   const { editId } = useParams(); // 👈 yahin se sab decide hoga

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



//   useEffect(() => {
//     const savedMockup = localStorage.getItem("mockupToEdit");
//     if (savedMockup) {
//       const parsed = JSON.parse(savedMockup);
//       setMockup(parsed);

//       setLayers([
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
//         {
//           id: "layer-1",
//           type: "image",           // <-- editable
//           src: parsed.url,
//           x: 80,                   // starting position (tweak if needed)
//           y: 80,
//           width: 640,
//           height: 640,
//           rotation: 0,
//           opacity: 1,
//           visible: true,
//         },
//       ]);
//       setSelectedLayerId("layer-1");
//     }
//   }, []);

//   // Helpers
//   const addNewTextLayer = () => {
//     const newLayer = {
//       id: `layer-${Date.now()}`,
//       type: "text",
//       text: "New Text",
//       x: 100,
//       y: 100,
//       width: 200,
//       height: 60,
//       rotation: 0,
//       fontSize: 22,
//       color: "#ffffff",
//       opacity: 1,
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
//       x: 120,
//       y: 120,
//       width: 300,
//       height: 200,
//       rotation: 0,
//       opacity: 1,
//     };
//     setLayers((prev) => [...prev, newLayer]);
//     setSelectedLayerId(newLayer.id);
//   };

//   const handleFileInputChange = (e) => {
//     const file = e.target.files && e.target.files[0];
//     if (file) {
//       addImageLayerFromFile(file);
//     }
//     // reset input so same file can be re-selected if needed
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
//     // revoke objectURL if created from file
//     const layer = layers.find((l) => l.id === id);
//     if (layer && layer.src && layer.src.startsWith("blob:")) {
//       try {
//         URL.revokeObjectURL(layer.src);
//       } catch (e) { }
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

//   const moveLayerUp = (id) => bringForward(id);
//   const moveLayerDown = (id) => sendBackward(id);

//   const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);

//   const onSave = () => {
//     // example: save layers to localStorage or send to backend
//     const serializable = layers.map((l) => {
//       const copy = { ...l };
//       // do not keep large blobs in localStorage if you don't want; here we save src as is
//       return copy;
//     });
//     localStorage.setItem("mockupEditedLayers", JSON.stringify(serializable));
//     console.log("Saved layers:", serializable);
//     alert("Saved to localStorage (mockupEditedLayers). Check console.");
//   };

//   // utility to get canvas bounds for better default sizing
//   const getCanvasSize = () => {
//     // default fallback
//     return { width: 800, height: 800 };
//   };

//   const duplicateLayer = () => {
//     if (!selectedLayerId) return;

//     const layerToCopy = layers.find(l => l.id === selectedLayerId);
//     if (!layerToCopy) return;

//     const duplicatedLayer = {
//       ...layerToCopy,
//       id: `layer-${Date.now()}`,   // ✅ unique id
//       x: layerToCopy.x + 20,       // ✅ little offset
//       y: layerToCopy.y + 20,
//     };

//     setLayers(prev => [...prev, duplicatedLayer]);
//     setSelectedLayerId(duplicatedLayer.id);
//   };

//   const toggleLayerVisibility = (id) => {
//     setLayers((prev) =>
//       prev.map((layer) =>
//         layer.id === id ? { ...layer, visible: !layer.visible } : layer
//       )
//     );
//   };

//   // add near other helpers inside component
//   const innerCanvasRef = useRef(null); // add this near canvasRef at top

//   // call innerCanvasRef on the div that holds the canvas (see next step)

//   // startRotation: mouse-driven rotate
//   const startRotation = (e, layerId) => {
//     e.stopPropagation();
//     const layer = layers.find(l => l.id === layerId);
//     if (!layer) return;

//     const canvasEl = innerCanvasRef.current;
//     if (!canvasEl) return;

//     // center of the layer relative to viewport
//     const canvasRect = canvasEl.getBoundingClientRect();
//     const centerX = canvasRect.left + layer.x + layer.width / 2;
//     const centerY = canvasRect.top + layer.y + layer.height / 2;

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

//   const addPrintAreaToCanvas = (printArea) => {
//     const newLayer = {
//       id: `printarea-${Date.now()}`,
//       type: "printarea",
//       name: printArea.displayName,
//       x: 100,
//       y: 100,
//       width: printArea.width,
//       height: printArea.height,
//       rotation: 0,
//       opacity: 0.8,
//       border: true,
//     };

//     setLayers(prev => [...prev, newLayer]);
//     setSelectedLayerId(newLayer.id);
//   };




//   return (
//     <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
//       {/* Header */}
//       <header className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
//         <h1 className="text-2xl font-bold text-blue-400">Mockup Editor</h1>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setShowPrintareaSelect(prev => !prev)}
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
//                   const selected = printAreas.find(p => p._id === e.target.value);
//                   if (selected) addPrintAreaToCanvas(selected);
//                   setShowPrintareaSelect(false);
//                 }}
//               >
//                 <option value="">-- Select --</option>

//                 {printAreas.map(pa => (
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
//             setList={setLayers}
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
//                 {/* <span className="drag-handle truncate cursor-move">{layer.type === "text" ? layer.text : "Image Layer"}</span> */}
//                 <span
//                   className="drag-handle truncate cursor-move"
//                   onDoubleClick={() => {
//                     const newName = prompt("Enter new layer name", layer.type === "text" ? layer.text : "Image Layer");
//                     if (newName !== null) updateLayer(layer.id, { name: newName });
//                   }}
//                 >
//                   {layer.name || (layer.type === "text" ? layer.text : "Image Layer")}

//                 </span>

//                 <div className="flex gap-2">
//                   {/* Duplicate Layer Icon */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setSelectedLayerId(layer.id);
//                       duplicateLayer();
//                     }}
//                     className="text-gray-300 hover:text-yellow-400 transition cursor-pointer"
//                     title="Duplicate Layer"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-files" viewBox="0 0 16 16">
//                       <path d="M13 1H5a1 1 0 0 0-1 1v1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM5 2h8v1H5V2zm-3 2h2v9H2V4zm3 9v-9h6v9H5zm7-1h-2v-1h2v1z" />
//                     </svg>
//                   </button>

//                   {/* ✅ YEH NAYA EYE ICON ADD KARO: */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleLayerVisibility(layer.id);
//                     }}
//                     className="text-gray-300 hover:text-green-400 transition cursor-pointer"
//                     title={layer.visible ? "Hide Layer" : "Show Layer"}
//                   >
//                     {layer.visible ? (
//                       // Eye Open Icon
//                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
//                         <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
//                         <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
//                       </svg>
//                     ) : (
//                       // Eye Closed Icon
//                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
//                         <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
//                         <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
//                         <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
//                       </svg>
//                     )}
//                   </button>

//                   {/* Delete Layer Icon */}
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
//               {/* Render layers in order */}
//               <div
//                 ref={innerCanvasRef}
//                 className="relative"
//                 style={{
//                   width: getCanvasSize().width,
//                   height: getCanvasSize().height,
//                   display: "inline-block",
//                   position: "relative",
//                 }}
//               >

//                 {layers.map((layer, index) => {
//                   if (layer.visible === false) return null;
//                   const zIndex = index + 1; // stacking by array order
//                   // background layer: render as static img filling canvas
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
//                         }}
//                       />
//                     );
//                   }

//                   return (
//                     <Rnd
//                       key={layer.id}
//                       size={{ width: layer.width, height: layer.height }}
//                       position={{ x: layer.x, y: layer.y }}
//                       bounds="parent"
//                       onDragStop={(e, d) =>
//                         updateLayer(layer.id, { x: d.x, y: d.y })
//                       }
//                       onResizeStop={(e, direction, ref, delta, position) =>
//                         updateLayer(layer.id, {
//                           width: parseInt(ref.style.width, 10),
//                           height: parseInt(ref.style.height, 10),
//                           ...position,
//                         })
//                       }
//                       onClick={() => setSelectedLayerId(layer.id)}
//                       enableResizing={layer.type !== "background"}
//                       disableDragging={false}
//                       style={{
//                         zIndex,
//                         border:
//                           selectedLayerId === layer.id
//                             ? "2px solid #3b82f6"
//                             : "1px dashed rgba(255,255,255,0.05)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "move",
//                         transform: `rotate(${layer.rotation || 0}deg)`,
//                         transformOrigin: "center center",
//                         opacity: layer.opacity !== undefined ? layer.opacity : 1,
//                         background: layer.type === "text" ? "transparent" : "none",
//                         pointerEvents: "auto",
//                         willChange: "transform"
//                       }}
//                     >
//                       {layer.type !== "background" && (
//                         <div
//                           onMouseDown={(e) => startRotation(e, layer.id)}
//                           className="absolute top-0 right-0 w-4 h-4 bg-blue-500 cursor-crosshair"
//                         />
//                       )}

//                       {/* {layer.type === "text" ? (
//                         <div
//                           style={{
//                             fontSize: layer.fontSize,
//                             color: layer.color,
//                             fontWeight: "700",
//                             textAlign: "center",
//                             width: "100%",
//                             height: "100%",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             userSelect: "none",
//                             whiteSpace: "pre-wrap",
//                           }}
//                         >
//                           {layer.text}
//                         </div>
//                       ) : (
//                         <img
//                           src={layer.src}
//                           alt="layer"
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "contain",
//                             pointerEvents: "none",
//                           }}
//                         />
//                       )} */}

//                       {/* {layer.type === "printarea" && (
//                         <div
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             border: "2px dashed #22c55e",
//                             background: "rgba(34,197,94,0.08)",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: 14,
//                             color: "#22c55e",
//                             fontWeight: 600,
//                             userSelect: "none",
//                           }}
//                         >
//                           {layer.name} <br />
//                           {layer.width} x {layer.height}
//                         </div>
//                       )} */}

//                       {layer.type === "text" && (
//                         <div
//                           style={{
//                             fontSize: layer.fontSize,
//                             color: layer.color,
//                             fontWeight: "700",
//                             width: "100%",
//                             height: "100%",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             userSelect: "none",
//                             whiteSpace: "pre-wrap",
//                           }}
//                         >
//                           {layer.text}
//                         </div>
//                       )}

//                       {layer.type === "image" && (
//                         <img
//                           src={layer.src}
//                           alt="layer"
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: layer.fit || "contain",
//                             pointerEvents: "none",
//                           }}
//                         />
//                       )}

//                       {layer.type === "printarea" && (
//                         <div
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             border: "2px dashed #22c55e",
//                             background: "rgba(34,197,94,0.08)",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: 14,
//                             color: "#22c55e",
//                             fontWeight: 600,
//                             userSelect: "none",
//                             textAlign: "center",
//                           }}
//                         >
//                           {layer.name}
//                           <br />
//                           {layer.width} × {layer.height}
//                         </div>
//                       )}

//                       {/* Rotation Handle */}
//                       <div
//                         onMouseDown={(e) => startRotation(e, layer.id)}
//                         className="absolute top-0 right-0 w-4 h-4 bg-blue-500 cursor-crosshair"
//                       ></div>

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

//           {/* Add buttons duplicated here for quick access */}
//           <div className="flex gap-2 mb-3">
//             <button
//               onClick={addNewTextLayer}
//               className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded shadow"
//             >
//               + Text
//             </button>
//             <button
//               onClick={addImageLayerButton}
//               className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded shadow"
//             >
//               + Image
//             </button>


//           </div>
//           <button
//             onClick={duplicateLayer}
//             disabled={!selectedLayer}
//             className={`w-full py-2 rounded shadow mb-4 ${selectedLayer
//               ? "bg-yellow-600 hover:bg-yellow-700"
//               : "bg-gray-600 cursor-not-allowed"
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
//                       : "Background"}
//                 </div>
                
//                 <div className="text-sm text-gray-400">{selectedLayer.id}</div>
//               </div>

//               <div>
//                 <p className="text-gray-400 font-medium">Layer Name</p>
//                 <input
//                   type="text"
//                   className="w-full p-2 rounded bg-gray-700 text-white"
//                   value={selectedLayer.name || (selectedLayer.type === "text" ? selectedLayer.text : "Image Layer")}
//                   onChange={(e) =>
//                     updateLayer(selectedLayer.id, {
//                       name: e.target.value,
//                       ...(selectedLayer.type === "text" ? { text: e.target.value } : {})
//                     })
//                   }
//                 />
//               </div>

//               {/* Common properties */}
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

//               {/* Text specific */}
//               {selectedLayer.type === "text" && (
//                 <>
//                   <div>
//                     <p className="text-gray-400 font-medium">Text</p>
//                     <input
//                       className="w-full p-2 rounded bg-gray-700 text-white"
//                       value={selectedLayer.text}
//                       onChange={(e) =>
//                         updateLayer(selectedLayer.id, { text: e.target.value })
//                       }
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
//                       onChange={(e) =>
//                         updateLayer(selectedLayer.id, { color: e.target.value })
//                       }
//                     />
//                   </div>
//                 </>
//               )}

//               {/* Image specific */}
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
//                         // revoke previous if blob
//                         if (selectedLayer.src && selectedLayer.src.startsWith("blob:")) {
//                           try {
//                             URL.revokeObjectURL(selectedLayer.src);
//                           } catch (err) { }
//                         }
//                         const url = URL.createObjectURL(file);
//                         updateLayer(selectedLayer.id, { src: url });
//                       }}
//                       className="w-full mt-1"
//                     />
//                   </div>

//                   <div>
//                     <p className="text-gray-400 font-medium">Fit Mode</p>
//                     <select
//                       value={selectedLayer.fit || "contain"}
//                       onChange={(e) =>
//                         updateLayer(selectedLayer.id, { fit: e.target.value })
//                       }
//                       className="w-full p-2 rounded bg-gray-700 text-white"
//                     >
//                       <option value="contain">Contain</option>
//                       <option value="cover">Cover</option>
//                     </select>
//                   </div>
//                 </>
//               )}

//               <div className="flex gap-2 pt-2">
//                 <button
//                   onClick={() => bringForward(selectedLayer.id)}
//                   className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded"
//                 >
//                   Bring Forward
//                 </button>
//                 <button
//                   onClick={() => sendBackward(selectedLayer.id)}
//                   className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded"
//                 >
//                   Send Backward
//                 </button>
//               </div>

//               <div className="pt-2">
//                 <button
//                   onClick={() => removeLayer(selectedLayer.id)}
//                   className="w-full py-2 bg-red-600 hover:bg-red-700 rounded"
//                 >
//                   Delete Layer
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <p className="text-gray-400">Select a layer to edit</p>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Editor;


// ====================================================================================================================

// Editor.jsx
import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { ReactSortable } from "react-sortablejs";
import { useParams } from "react-router-dom";
import { getProductById } from "../../api/product.api";

function Editor() {
  const [mockup, setMockup] = useState(null);
  const [layers, setLayers] = useState([]);
  const [showPrintareaSelect, setShowPrintareaSelect] = useState(false);
  const [printAreas, setPrintAreas] = useState([]);

  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const fileInputRef = useRef(null);
  const printAreaFileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const { editId } = useParams();

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

  useEffect(() => {
    const savedMockup = localStorage.getItem("mockupToEdit");
    if (savedMockup) {
      const parsed = JSON.parse(savedMockup);
      setMockup(parsed);

      setLayers([
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
      ]);
      setSelectedLayerId("layer-1");
    }
  }, []);

  // Helper Functions
  const addNewTextLayer = () => {
    const newLayer = {
      id: `layer-${Date.now()}`,
      type: "text",
      text: "New Text",
      x: 100,
      y: 100,
      width: 200,
      height: 60,
      rotation: 0,
      fontSize: 22,
      color: "#ffffff",
      opacity: 1,
      visible: true,
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
      x: 120,
      y: 120,
      width: 300,
      height: 200,
      rotation: 0,
      opacity: 1,
      visible: true,
      fit: "contain",
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
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  };

  const removeLayer = (id) => {
    const layer = layers.find((l) => l.id === id);
    if (layer) {
      // Cleanup blob URLs
      if (layer.src && layer.src.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(layer.src);
        } catch (e) {}
      }
      if (layer.imageSrc && layer.imageSrc.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(layer.imageSrc);
        } catch (e) {}
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
    const layerToCopy = layers.find(l => l.id === selectedLayerId);
    if (!layerToCopy) return;

    const duplicatedLayer = {
      ...layerToCopy,
      id: `layer-${Date.now()}`,
      x: layerToCopy.x + 20,
      y: layerToCopy.y + 20,
    };

    setLayers(prev => [...prev, duplicatedLayer]);
    setSelectedLayerId(duplicatedLayer.id);
  };

  const toggleLayerVisibility = (id) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const innerCanvasRef = useRef(null);

  const startRotation = (e, layerId) => {
    e.stopPropagation();
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const canvasEl = innerCanvasRef.current;
    if (!canvasEl) return;

    const canvasRect = canvasEl.getBoundingClientRect();
    const centerX = canvasRect.left + layer.x + layer.width / 2;
    const centerY = canvasRect.top + layer.y + layer.height / 2;

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
      name: printArea.displayName,
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
    };

    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handlePrintAreaImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !selectedLayer) return;

    // Cleanup previous image if exists
    if (selectedLayer.imageSrc && selectedLayer.imageSrc.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(selectedLayer.imageSrc);
      } catch (err) {}
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
      } catch (err) {}
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

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-blue-400">Mockup Editor</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPrintareaSelect(prev => !prev)}
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
                  const selected = printAreas.find(p => p._id === e.target.value);
                  if (selected) addPrintAreaToCanvas(selected);
                  setShowPrintareaSelect(false);
                }}
              >
                <option value="">-- Select --</option>
                {printAreas.map(pa => (
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
            setList={setLayers}
            animation={200}
            ghostClass="bg-gray-500/50"
            handle=".drag-handle"
          >
            {layers.map((layer) => (
              <div
                key={layer.id}
                onClick={() => setSelectedLayerId(layer.id)}
                className={`w-full flex items-center justify-between py-2 px-2 rounded shadow cursor-pointer transition ${
                  selectedLayerId === layer.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
              >
                <span
                  className="drag-handle truncate cursor-move"
                  onDoubleClick={() => {
                    const newName = prompt(
                      "Enter new layer name",
                      layer.type === "text" ? layer.text : "Image Layer"
                    );
                    if (newName !== null) updateLayer(layer.id, { name: newName });
                  }}
                >
                  {layer.name || (layer.type === "text" ? layer.text : layer.type === "printarea" ? layer.name : "Image Layer")}
                </span>

                <div className="flex gap-2">
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
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
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
                    title="Duplicate Layer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-files" viewBox="0 0 16 16">
                      <path d="M13 1H5a1 1 0 0 0-1 1v1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM5 2h8v1H5V2zm-3 2h2v9H2V4zm3 9v-9h6v9H5zm7-1h-2v-1h2v1z"/>
                    </svg>
                  </button>

                  {/* Delete Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLayer(layer.id);
                    }}
                    className="text-gray-300 hover:text-red-500 transition cursor-pointer"
                    title="Delete Layer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1z"/>
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
                }}
              >
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
                        }}
                      />
                    );
                  }

                  return (
                    <Rnd
                      key={layer.id}
                      size={{ width: layer.width, height: layer.height }}
                      position={{ x: layer.x, y: layer.y }}
                      bounds="parent"
                      onDragStop={(e, d) =>
                        updateLayer(layer.id, { x: d.x, y: d.y })
                      }
                      onResizeStop={(e, direction, ref, delta, position) =>
                        updateLayer(layer.id, {
                          width: parseInt(ref.style.width, 10),
                          height: parseInt(ref.style.height, 10),
                          ...position,
                        })
                      }
                      onClick={() => setSelectedLayerId(layer.id)}
                      enableResizing={layer.type !== "background"}
                      disableDragging={false}
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
                        cursor: "move",
                        transform: `rotate(${layer.rotation || 0}deg)`,
                        transformOrigin: "center center",
                        opacity: layer.opacity !== undefined ? layer.opacity : 1,
                        background: layer.type === "text" ? "transparent" : "none",
                        pointerEvents: "auto",
                        willChange: "transform",
                      }}
                    >
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
                        <img
                          src={layer.src}
                          alt="layer"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: layer.fit || "contain",
                            pointerEvents: "none",
                          }}
                        />
                      )}

                      {layer.type === "printarea" && (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: layer.hasImage ? "transparent" : "rgba(34,197,94,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            color: "#22c55e",
                            fontWeight: 600,
                            userSelect: "none",
                            textAlign: "center",
                            overflow: "hidden",
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
                              }}
                            />
                          ) : (
                            <div>
                              {layer.name}
                              <br />
                              {layer.width} × {layer.height}
                              <br />
                              <span style={{ fontSize: 10, color: "#888", fontWeight: "normal" }}>
                                Upload image from properties panel
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {layer.type !== "background" && (
                        <div
                          onMouseDown={(e) => startRotation(e, layer.id)}
                          className="absolute top-0 right-0 w-4 h-4 bg-blue-500 cursor-crosshair rounded-full"
                        />
                      )}
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
            className={`w-full py-2 rounded shadow mb-4 transition ${
              selectedLayer
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-gray-600 cursor-not-allowed"
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

              <div>
                <p className="text-gray-400 font-medium">Layer Name</p>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={
                    selectedLayer.name ||
                    (selectedLayer.type === "text"
                      ? selectedLayer.text
                      : selectedLayer.type === "printarea"
                      ? selectedLayer.name
                      : "Image Layer")
                  }
                  onChange={(e) =>
                    updateLayer(selectedLayer.id, {
                      name: e.target.value,
                      ...(selectedLayer.type === "text" ? { text: e.target.value } : {}),
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
                  <div className="w-12 text-right">
                    {Math.round((selectedLayer.opacity ?? 1) * 100)}%
                  </div>
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
                      onChange={(e) =>
                        updateLayer(selectedLayer.id, { text: e.target.value })
                      }
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
                      onChange={(e) =>
                        updateLayer(selectedLayer.id, { color: e.target.value })
                      }
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
                          } catch (err) {}
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
                      onChange={(e) =>
                        updateLayer(selectedLayer.id, { fit: e.target.value })
                      }
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    >
                      <option value="contain">Contain</option>
                      <option value="cover">Cover</option>
                      <option value="fill">Fill</option>
                    </select>
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z"/>
                          </svg>
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
                            onChange={(e) =>
                              updateLayer(selectedLayer.id, { fit: e.target.value })
                            }
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