// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import image from "../assets/image/dummy.jpg";
// import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
// import { getProductById } from "../api/category.api";
// import { getLayersByProductId } from "../api/layer.api";
// import LayerProperties from "../components/Admin/LayerProperties";
// import {
//     uploadCustomerImage,
//     saveCustomerDesign,
//     getCustomerDesign,
//     deleteCustomerLayer,
//     updateCustomerLayer
// } from "../api/customerDesign.api";
// import AddMockup from "../components/Admin/AddMockup";
// import IMG from "../assets/image/img.svg";
// import { Rnd } from "react-rnd";
// import { Pencil, Copy, Lock, Unlock, Trash2 } from "lucide-react";
// import * as layerHelpers from "../components/Admin/utils/layerHelpers";
// import { toast } from "react-toastify";

// const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
// const toNumber = (v, fallback = 0) => {
//     const n = Number(v);
//     return Number.isFinite(n) ? n : fallback;
// };
// const round2 = (v) => Math.round((v + Number.EPSILON) * 100) / 100;

// const normalizeLayer = (layer) => {
//     // Sirf width/height ko normalize karo, position ko nahi
//     const width = clamp(toNumber(layer.width, 30), 5, 100);
//     const height = clamp(toNumber(layer.height, 30), 5, 100);

//     // Position ko EXACT rahne do, clamp mat karo
//     const positionX = toNumber(layer.positionX, 0);
//     const positionY = toNumber(layer.positionY, 0);

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

// const Editor = () => {
//     const navigate = useNavigate();
//     const { productId } = useParams();
//     const location = useLocation();
//     const productFromState = location.state?.product;

//     // states
//     const [product, setProduct] = useState(productFromState || null);
//     const [loading, setLoading] = useState(!productFromState);
//     const [startDesigning, setStartDesigning] = useState(false);
//     const [openMockupModal, setOpenMockupModal] = useState(false);
//     const [adminLayers, setAdminLayers] = useState([]);
//     const [customerLayers, setCustomerLayers] = useState([]);
//     const [selectedMockup, setSelectedMockup] = useState(null);
//     const [selectedPrintArea, setSelectedPrintArea] = useState(null);
//     const [saving, setSaving] = useState(false);
//     const [selectedLayerIndex, setSelectedLayerIndex] = useState(null);
//     const [windowSize, setWindowSize] = useState(0);
//     const [renderKey, setRenderKey] = useState(0);
//     const [isLoadingDesign, setIsLoadingDesign] = useState(false);
//     const [hasSavedDesign, setHasSavedDesign] = useState(false);
//     const [containersReady, setContainersReady] = useState(false);

//     const fileInputRef = useRef(null);
//     const containerRefs = useRef({});
//     const rndRefs = useRef({});
//     const fontStack = 'ui-sans-serif, system-ui, -apple-system, sans-serif';

//     const colors = [
//         { name: "Black", class: "bg-black" },
//         { name: "White", class: "bg-white border" },
//         { name: "Dark Heather", class: "bg-gray-700" },
//         { name: "Sports Grey", class: "bg-gray-400" },
//         { name: "Light Blue", class: "bg-blue-400" },
//         { name: "Azalea Pink", class: "bg-pink-400" }
//     ];

//     // resize listener (cheap trigger)
//     useEffect(() => {
//         const handleResize = () => setWindowSize(w => w + 1);
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // fetch product
//     useEffect(() => {
//         const fetchProduct = async () => {
//             if (!product && productId) {
//                 try {
//                     setLoading(true);
//                     const res = await getProductById(productId);
//                     setProduct(res);
//                     if (res.mockupIds?.length > 0) setSelectedMockup(res.mockupIds[0]);
//                 } catch (err) {
//                     console.error(err);
//                 } finally {
//                     setLoading(false);
//                 }
//             }
//         };
//         fetchProduct();
//     }, [productId, product]);

//     // fetch admin print areas
//     useEffect(() => {
//         const fetchAdmin = async () => {
//             if (product?._id && selectedMockup?._id) {
//                 try {
//                     const res = await getLayersByProductId(product._id, selectedMockup._id);
//                     if (res.data) {
//                         const areas = res.data.filter(l => l.type === "printarea");
//                         setAdminLayers(areas);
//                     }
//                 } catch (e) {
//                     console.error("admin layers:", e);
//                 }
//             }
//         };
//         fetchAdmin();
//     }, [product?._id, selectedMockup]);

//     useEffect(() => {
//         const fetchCustomerDesign = async () => {
//             if (productId && selectedMockup?._id) {
//                 setIsLoadingDesign(true);
//                 try {
//                     const res = await getCustomerDesign(productId, selectedMockup._id);
//                     if (res.success && res.data) {
//                         const loadedLayers = (res.data.layers || []).map(layer => ({
//                             ...layer,
//                             horizontalAlign: layer.horizontalAlign || 'center',
//                             verticalAlign: layer.verticalAlign || 'middle',
//                             positionX: Number(layer.positionX) || 20,
//                             positionY: Number(layer.positionY) || 20,
//                             width: Number(layer.width) || 30,
//                             height: Number(layer.height) || 30,
//                             rotation: Number(layer.rotation) || 0,
//                             opacity: Number(layer.opacity) || 1
//                         }));

//                         setCustomerLayers(loadedLayers);

//                         // Add this: Wait for next tick then trigger container check
//                         setTimeout(() => {
//                             setRenderKey(prev => prev + 1);
//                             setContainersReady(false); // This will trigger recheck
//                         }, 100);
//                     }
//                 } catch (error) {
//                     console.error("Error loading design:", error);
//                 } finally {
//                     setIsLoadingDesign(false);
//                 }
//             }
//         };
//         fetchCustomerDesign();
//     }, [productId, selectedMockup]);

//     // convert percent -> pixels relative to printArea DOM
//     const getPixelValues = (printAreaId, layer) => {
//         const container = containerRefs.current[printAreaId];
//         if (!container) return { x: 0, y: 0, width: 100, height: 100 };
//         const rect = container.getBoundingClientRect();
//         const cw = rect.width || 300;
//         const ch = rect.height || 300;

//         // ensure normalized layer (safety)
//         const safe = normalizeLayer(layer);
//         return {
//             x: (safe.positionX / 100) * cw,
//             y: (safe.positionY / 100) * ch,
//             width: (safe.width / 100) * cw,
//             height: (safe.height / 100) * ch
//         };
//     };

//     useEffect(() => {
//         if (!startDesigning || adminLayers.length === 0) return;

//         // Directly set containersReady to true after a small delay
//         const timer = setTimeout(() => {
//             setContainersReady(true);
//         }, 200);

//         return () => clearTimeout(timer);
//     }, [startDesigning, adminLayers]);

//     const updateLayerLocalAndMaybeServer = (index, updates, callServer = true) => {
//         setCustomerLayers(prev => {
//             const updated = [...prev];
//             // Normalize mat karo - exact values save karo
//             updated[index] = { ...updated[index], ...updates };

//             if (callServer && hasSavedDesign && updated[index]._id) {
//                 const payload = { ...updated[index] };
//                 updateCustomerLayer(updated[index]._id, payload).catch(err => {
//                     console.error("update layer failed", err);
//                     toast.error("Unable to update layer on server");
//                 });
//             }
//             return updated;
//         });
//         setTimeout(() => setRenderKey(k => k + 1), 5);
//     };

//     // drag start
//     const handleDragStart = (layerIndex) => {
//         setSelectedLayerIndex(layerIndex);
//     };

//     const handleDragStop = (printAreaId, layerIndex, d) => {
//         const container = containerRefs.current[printAreaId];
//         if (!container) return;
//         const rect = container.getBoundingClientRect();
//         const layer = customerLayers[layerIndex];
//         if (!layer) return;

//         // Check if d.x and d.y are valid (not zero when they shouldn't be)
//         let newXPercent, newYPercent;

//         if (d.x === 0 && d.y === 0 && layer.positionX !== 0 && layer.positionY !== 0) {
//             // Rnd bug - use current layer position
//             console.warn("Rnd bug detected - using current position");
//             newXPercent = layer.positionX;
//             newYPercent = layer.positionY;
//         } else {
//             newXPercent = (d.x / rect.width) * 100;
//             newYPercent = (d.y / rect.height) * 100;
//         }

//         // Agar border par hai to exact value lo
//         if (Math.abs(newXPercent - 0) < 0.1 || Math.abs(newXPercent - (100 - layer.width)) < 0.1) {
//             console.log("Border touch detected");
//         }

//         updateLayerLocalAndMaybeServer(layerIndex, {
//             positionX: round2(newXPercent),
//             positionY: round2(newYPercent)
//         }, true);
//     };

//     const handleResizeStop = (printAreaId, layerIndex, ref, position) => {
//         const container = containerRefs.current[printAreaId];
//         if (!container) return;
//         const rect = container.getBoundingClientRect();

//         // Clamping hatao
//         const widthPercent = (parseFloat(ref.style.width) / rect.width) * 100;
//         const heightPercent = (parseFloat(ref.style.height) / rect.height) * 100;
//         const posX = (position.x / rect.width) * 100;
//         const posY = (position.y / rect.height) * 100;

//         updateLayerLocalAndMaybeServer(layerIndex, {
//             width: round2(widthPercent),
//             height: round2(heightPercent),
//             positionX: round2(posX),
//             positionY: round2(posY)
//         }, true);
//     };

//     // duplicate
//     const handleDuplicateLayer = (index) => {
//         const updated = layerHelpers.duplicateLayer(customerLayers, index);
//         setCustomerLayers(updated.map(l => normalizeLayer(l)));
//         setSelectedLayerIndex(updated.length - 1);
//         setRenderKey(k => k + 1);
//     };

//     // toggle lock
//     const handleToggleLock = (index) => {
//         setCustomerLayers(prev => {
//             const updated = layerHelpers.toggleLayerLock(prev, index);
//             return updated;
//         });
//         setTimeout(() => setRenderKey(k => k + 1), 10);
//     };

//     // save design (first time or update whole)
//     const handleSave = async () => {
//         try {
//             setSaving(true);
//             // normalize all layers before saving
//             const normalized = customerLayers.map(l => normalizeLayer(l));
//             const res = await saveCustomerDesign({
//                 productId: product._id,
//                 mockupId: selectedMockup._id,
//                 layers: normalized
//             });
//             if (res.success) {
//                 setHasSavedDesign(true); // now subsequent changes call updateCustomerLayer
//                 // refresh from server (to get _id fields and canonical values)
//                 try {
//                     const fresh = await getCustomerDesign(product._id, selectedMockup._id);
//                     if (fresh.success && fresh.data) {
//                         const loaded = (fresh.data.layers || []).map(l => normalizeLayer({
//                             ...l,
//                             horizontalAlign: l.horizontalAlign || 'center',
//                             verticalAlign: l.verticalAlign || 'middle'
//                         }));
//                         setCustomerLayers(loaded);
//                         setRenderKey(k => k + 1);
//                     }
//                 } catch (e) {
//                     console.error("fetch fresh after save", e);
//                 }
//                 toast.success("Design saved successfully!");
//             } else {
//                 toast.error("Save failed");
//             }
//         } catch (e) {
//             console.error("save error", e);
//             toast.error("Save failed");
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleAlignHorizontal = (align) => {
//         if (selectedLayerIndex === null) return;
//         const layer = customerLayers[selectedLayerIndex];
//         if (!layer) return;

//         let newX;
//         if (align === 'left') newX = 0;
//         else if (align === 'center') newX = 50 - (toNumber(layer.width, 30) / 2);
//         else newX = 100 - toNumber(layer.width, 30);

//         // Direct value bhejo - clamp mat karo
//         updateLayerLocalAndMaybeServer(selectedLayerIndex, {
//             positionX: round2(newX),
//             horizontalAlign: align
//         }, true);
//     };

//     const handleAlignVertical = (align) => {
//         if (selectedLayerIndex === null) return;
//         const layer = customerLayers[selectedLayerIndex];
//         if (!layer) return;

//         let newY;
//         if (align === 'top') newY = 0;
//         else if (align === 'middle') newY = 50 - (toNumber(layer.height, 30) / 2);
//         else newY = 100 - toNumber(layer.height, 30);

//         // Direct value bhejo - clamp mat karo
//         updateLayerLocalAndMaybeServer(selectedLayerIndex, {
//             positionY: round2(newY),
//             verticalAlign: align
//         }, true);
//     };

//     // properties change from LayerProperties component
//     const handleLayerPropertiesChange = (updates) => {
//         if (selectedLayerIndex === null) return;
//         updateLayerLocalAndMaybeServer(selectedLayerIndex, updates, true);
//     };

//     // upload handler from input or modal
//     const handlePrintAreaImageUpload = async (printAreaLayer, file) => {
//         if (!file) return;
//         try {
//             setSaving(true);
//             const uploadRes = await uploadCustomerImage(file);
//             if (!uploadRes.success) throw new Error(uploadRes.message);
//             const { imageUrl, publicId } = uploadRes.data;

//             const newLayer = {
//                 printArea: printAreaLayer._id,
//                 imageUrl,
//                 publicId,
//                 positionX: printAreaLayer.x_percent || 20,
//                 positionY: printAreaLayer.y_percent || 20,
//                 width: printAreaLayer.width_percent || 30,
//                 height: printAreaLayer.height_percent || 30,
//                 rotation: 0,
//                 opacity: 1,
//                 visible: true,
//                 zIndex: customerLayers.length + 1,
//                 locked: false,
//                 horizontalAlign: 'center',
//                 verticalAlign: 'middle'
//             };

//             setCustomerLayers(prev => [...prev, normalizeLayer(newLayer)]);
//             setSelectedLayerIndex(customerLayers.length);
//             setTimeout(() => setRenderKey(k => k + 1), 10);
//             toast.success("Image uploaded");
//         } catch (e) {
//             console.error("upload err", e);
//             toast.error("Upload failed");
//         } finally {
//             setSaving(false);
//         }
//     };

//     // modal image select
//     const handleImageFromModal = (image) => {
//         const defaultPrintArea = selectedPrintArea || adminLayers[0];
//         if (!defaultPrintArea) {
//             toast.error("No print area found");
//             return;
//         }
//         const newLayerData = {
//             printArea: defaultPrintArea._id,
//             imageUrl: image.url,
//             publicId: image.id || null,
//             positionX: defaultPrintArea.x_percent || 20,
//             positionY: defaultPrintArea.y_percent || 20,
//             width: defaultPrintArea.width_percent || 30,
//             height: defaultPrintArea.height_percent || 30,
//             rotation: 0,
//             opacity: 1,
//             visible: true,
//             zIndex: customerLayers.length + 1,
//             locked: false,
//             horizontalAlign: 'center',
//             verticalAlign: 'middle'
//         };
//         setCustomerLayers(prev => [...prev, normalizeLayer(newLayerData)]);
//         setSelectedLayerIndex(customerLayers.length);
//         setOpenMockupModal(false);
//         setTimeout(() => setRenderKey(k => k + 1), 10);
//     };

//     // remove via top-right button
//     const handleRemoveLayer = async (index) => {
//         const layer = customerLayers[index];
//         if (layer && layer._id) {
//             try {
//                 await deleteCustomerLayer(layer._id);
//             } catch (e) {
//                 console.error("delete err", e);
//             }
//         }
//         setCustomerLayers(prev => prev.filter((_, i) => i !== index));
//         setSelectedLayerIndex(null);
//         setTimeout(() => setRenderKey(k => k + 1), 10);
//     };

//     if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
//     if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

//     return (
//         <div className="min-h-screen bg-[#fcfcfc] py-8 px-4 md:px-8" style={{ fontFamily: fontStack }}>
//             <div className="max-w-7xl mx-auto">
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="flex items-center gap-2 text-gray-500 text-sm mb-8 hover:text-[#f05a28] cursor-pointer"
//                 >
//                     <ArrowLeft size={16} />
//                     Back to Products
//                 </button>

//                 {/* hidden file input */}
//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     className="hidden"
//                     accept="image/*"
//                     onChange={(e) => {
//                         const file = e.target.files?.[0];
//                         if (file && selectedPrintArea) handlePrintAreaImageUpload(selectedPrintArea, file);
//                         e.target.value = '';
//                     }}
//                 />

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
//                     {/* canvas */}
//                     <div className="lg:col-span-6">
//                         <div style={{ marginTop: "185px" }} className="relative aspect-square bg-white border border-gray-100 overflow-hidden shadow-sm">
//                             <img
//                                 src={selectedMockup?.mockupImage?.url || product?.thumbnail?.url || image}
//                                 alt={product?.productTitle}
//                                 className="w-full h-full object-cover absolute inset-0"
//                             />

//                             {startDesigning && adminLayers.map((printAreaLayer) => {
//                                 const areaLayers = customerLayers.filter(
//                                     l => (l.printArea?._id || l.printArea) === printAreaLayer._id
//                                 );

//                                 return (
//                                     <div
//                                         key={printAreaLayer._id}
//                                         ref={el => {
//                                             if (el) {
//                                                 containerRefs.current[printAreaLayer._id] = el;
//                                             }
//                                         }}
//                                         className="absolute"
//                                         style={{
//                                             left: `${printAreaLayer.x_percent || 20}%`,
//                                             top: `${printAreaLayer.y_percent || 20}%`,
//                                             width: `${printAreaLayer.width_percent || 30}%`,
//                                             height: `${printAreaLayer.height_percent || 30}%`,
//                                             border: "2px dashed #f05a28",
//                                             overflow: "hidden"
//                                         }}
//                                     >
//                                         {isLoadingDesign ? (
//                                             <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50">
//                                                 <Loader2 className="animate-spin text-[#f05a28]" size={40} />
//                                             </div>
//                                         ) : (
//                                             areaLayers.map(layer => {
//                                                 const globalIndex = customerLayers.findIndex(
//                                                     l => (l._id ? String(l._id) : null) === (layer._id ? String(layer._id) : null)
//                                                 );
//                                                 if (globalIndex === -1) return null;

//                                                 const pixelValues = getPixelValues(printAreaLayer._id, layer);

//                                                 return (
//                                                     <Rnd
//                                                         dragAxis="both"
//                                                         // bounds prop hata do
//                                                         key={`${layer._id || globalIndex}-${renderKey}`}
//                                                         size={{ width: pixelValues.width, height: pixelValues.height }}
//                                                         position={{ x: pixelValues.x, y: pixelValues.y }}
//                                                         disableDragging={layer.locked}
//                                                         enableResizing={!layer.locked}
//                                                         onDragStart={() => handleDragStart(globalIndex)}
//                                                         onDrag={(e, d) => {
//                                                             console.log("Dragging:", {
//                                                                 x: d.x,
//                                                                 y: d.y,
//                                                                 containerWidth: containerRefs.current[printAreaLayer._id]?.getBoundingClientRect().width,
//                                                                 percentageX: (d.x / containerRefs.current[printAreaLayer._id]?.getBoundingClientRect().width) * 100
//                                                             });
//                                                         }}
//                                                         onDragStop={(e, d) => handleDragStop(printAreaLayer._id, globalIndex, d)}
//                                                         onResizeStop={(e, dir, ref, delta, pos) =>
//                                                             handleResizeStop(printAreaLayer._id, globalIndex, ref, pos)
//                                                         }
//                                                         onMouseDown={() => setSelectedLayerIndex(globalIndex)}
//                                                     >
//                                                         <div className={`relative group w-full h-full ${selectedLayerIndex === globalIndex ? 'ring-2 ring-blue-500 ring-inset' : ''}`}>
//                                                             <img
//                                                                 src={layer.imageUrl}
//                                                                 alt=""
//                                                                 className="w-full h-full object-cover pointer-events-none"
//                                                                 style={{ transform: `rotate(${layer.rotation || 0}deg)`, opacity: layer.opacity ?? 1 }}
//                                                             />
//                                                             {selectedLayerIndex === globalIndex && (
//                                                                 <button
//                                                                     onClick={(e) => { e.stopPropagation(); handleRemoveLayer(globalIndex); }}
//                                                                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
//                                                                 >
//                                                                     <X size={14} />
//                                                                 </button>
//                                                             )}
//                                                         </div>
//                                                     </Rnd>
//                                                 );
//                                             })
//                                         )}
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     {/* right panel */}
//                     <div className="lg:col-span-6">
//                         {!startDesigning ? (
//                             <div className="space-y-8">
//                                 <div>
//                                     <div className="flex justify-between">
//                                         <h1 className="text-3xl font-black text-gray-900 leading-tight">{product?.productTitle || product?.title}</h1>
//                                         <button onClick={() => setStartDesigning(true)} className="px-6 py-2 bg-[#f05a28] text-white font-bold text-sm rounded hover:opacity-90 transition cursor-pointer">
//                                             Start Design
//                                         </button>
//                                     </div>
//                                     <p className="text-gray-500 text-sm mt-2">{product?.description || "No description available"}</p>
//                                 </div>
//                                 <div className="text-2xl font-black text-gray-900">${product?.Variants?.[0]?.basePrice || "0.00"}</div>

//                                 <div>
//                                     <h4 className="text-[12px] font-black uppercase text-gray-400 mb-3">Available Colors</h4>
//                                     <div className="flex flex-wrap gap-3">
//                                         {colors.map((c, i) => (
//                                             <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
//                                                 <div className={`w-6 h-6 rounded-full ${c.class}`}></div>
//                                                 {c.name}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <button className="cursor-pointer mt-6 px-8 py-3 bg-[#146e3a] text-white font-bold text-sm rounded hover:opacity-90 transition mr-1.5">Product</button>
//                                     <button onClick={() => setStartDesigning(true)} className="cursor-pointer mt-6 px-8 py-3 bg-[#f05a28] text-white font-bold text-sm rounded hover:opacity-90 transition">Design</button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="space-y-6">
//                                 <div className="flex justify-between items-center">
//                                     <h2 className="text-xl font-bold">Click on print areas to add images</h2>
//                                     <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white text-sm rounded hover:opacity-90 transition disabled:opacity-50">
//                                         {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
//                                         {saving ? 'Saving...' : 'Save Design'}
//                                     </button>
//                                 </div>

//                                 {/* Layers list */}
//                                 <div className="space-y-3">
//                                     <div className="flex justify-between items-center">
//                                         <h3 className="font-bold">Layers:</h3>
//                                     </div>

//                                     {customerLayers.map((layer, index) => (
//                                         <div key={layer._id || index} className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${selectedLayerIndex === index ? 'border-blue-500 bg-blue-50' : ''}`} onClick={() => setSelectedLayerIndex(index)}>
//                                             <div className="flex items-center gap-3">
//                                                 <img src={layer.imageUrl} className="w-10 h-10 object-cover rounded" alt="" />
//                                                 <span>Layer {index + 1} {layer.locked && '(Locked)'}</span>
//                                             </div>

//                                             <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
//                                                 <button onClick={() => setSelectedLayerIndex(index)} className="cursor-pointer p-1 text-blue-500 hover:bg-blue-50 rounded" title="Edit"><Pencil size={16} /></button>
//                                                 <button onClick={() => handleDuplicateLayer(index)} className="cursor-pointer p-1 text-green-600 hover:bg-green-50 rounded" title="Duplicate"><Copy size={16} /></button>
//                                                 <button onClick={() => handleToggleLock(index)} className="cursor-pointer p-1 text-yellow-600 hover:bg-yellow-50 rounded" title={layer.locked ? "Unlock" : "Lock"}>{layer.locked ? <Unlock size={16} /> : <Lock size={16} />}</button>
//                                                 <button onClick={() => handleRemoveLayer(index)} className="cursor-pointer p-1 text-red-500 hover:bg-red-50 rounded" title="Delete"><Trash2 size={16} /></button>
//                                             </div>
//                                         </div>
//                                     ))}

//                                 </div>

//                                 {/* Layer properties */}
//                                 {selectedLayerIndex !== null && customerLayers[selectedLayerIndex] && (
//                                     <div className="bg-white border rounded p-4 mt-4">
//                                         <h3 className="font-bold mb-3">Properties</h3>
//                                         <LayerProperties
//                                             layer={customerLayers[selectedLayerIndex]}
//                                             onChange={handleLayerPropertiesChange}
//                                             onAlignHorizontal={handleAlignHorizontal}
//                                             onAlignVertical={handleAlignVertical}
//                                         />
//                                     </div>
//                                 )}

//                                 <button onClick={() => {
//                                     if (!adminLayers.length) { toast.info("No print area available"); return; }
//                                     setOpenMockupModal(true);
//                                 }} className="cursor-pointer px-6 py-3 border border-gray-200 rounded hover:bg-gray-50 font-medium w-full flex justify-center items-center gap-2">
//                                     <img width={20} height={20} src={IMG} alt="" />
//                                     Add Image from Library
//                                 </button>

//                                 <div className="bg-white border p-6 rounded">
//                                     <h3 className="font-bold mb-3">RelaiblePOD Need help?</h3>
//                                     <p className="text-sm text-gray-600 mb-3">We have some further information on our website. You can access it by clicking on the links below.</p>
//                                     <div className="flex gap-6 text-[#f05a28] text-sm font-medium">
//                                         <button>Watch our help tutorial</button>
//                                         <button>Email our support team</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <AddMockup
//                 open={openMockupModal}
//                 onClose={() => setOpenMockupModal(false)}
//                 productId={product?._id || productId}
//                 onImageSelect={handleImageFromModal}
//             />

//         </div>
//     );
// };

// export default Editor;


// =======================================================================================

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import image from "../assets/image/dummy.jpg";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { getProductById } from "../api/category.api";
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
import ConfirmDesignModal from "../components/Admin/ConfirmDesignModal";

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const toNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};
const round2 = (v) => Math.round((v + Number.EPSILON) * 100) / 100;

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
    const [showConfirmModal, setShowConfirmModal] = useState(false);

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

    const handleNext = () => {
        setShowConfirmModal(true);
    };

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

    // Editor.jsx (partial – only JSX changes shown; state and logic remain the same)

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
                            <button
                                onClick={handleNext}
                                className="px-5 py-2 border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                            >
                                Next
                            </button>

                            {/* <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-5 py-2 bg-[#146e3a] text-white text-sm font-semibold hover:bg-[#0f5a2f] transition disabled:opacity-50 cursor-pointer"
                            >
                                {saving ? 'Saving...' : 'Save Design'}
                            </button> */}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Canvas Column */}

                    <div className="lg:col-span-8">
                        <div className="relative bg-white shadow-xl border border-gray-200 overflow-hidden">
                            <div className="aspect-square relative">
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
                                            ref={el => {
                                                if (el) containerRefs.current[printAreaLayer._id] = el;
                                            }}
                                            className="absolute border-2 border-dashed border-[#f05a28] bg-white/10"
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
                                                            disableDragging={layer.locked}
                                                            enableResizing={!layer.locked}
                                                            onDragStart={() => handleDragStart(globalIndex)}
                                                            onDragStop={(e, d) => handleDragStop(printAreaLayer._id, globalIndex, d)}
                                                            onResizeStop={(e, dir, ref, delta, pos) =>
                                                                handleResizeStop(printAreaLayer._id, globalIndex, ref, pos)
                                                            }
                                                            onMouseDown={() => setSelectedLayerIndex(globalIndex)}
                                                        >
                                                            <div className={`relative group w-full h-full overflow-hidden ${selectedLayerIndex === globalIndex ? 'ring-2 ring-blue-500 ring-inset' : ''}`}>
                                                                <img
                                                                    src={layer.imageUrl}
                                                                    alt=""
                                                                    className="w-full h-full object-cover pointer-events-none"
                                                                    style={{ transform: `rotate(${layer.rotation || 0}deg)`, opacity: layer.opacity ?? 1 }}
                                                                />
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
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 lg:sticky lg:top-6 self-start">
                        <div className="bg-white border border-gray-200 shadow-xl overflow-hidden">
                            <div className="p-4 border-b border-gray-200 flex justify-between ">
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
                                                {product?.description || "No description available"}
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
                                                Available Colors
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {colors.map((c, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-2 py-2">
                                                        <div className={`w-5 h-5 ${c.class}`}></div>
                                                        <span className="truncate">{c.name}</span>
                                                    </div>
                                                ))}
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
                                                                    <img src={layer.imageUrl} alt="" className="w-full h-full object-cover" />
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
                                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 font-medium hover:border-[#f05a28] hover:text-[#f05a28] transition-colors cursor-pointer rounded "
                                        >
                                            Add Image from Library
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AddMockup Modal */}
                <AddMockup
                    open={openMockupModal}
                    onClose={() => setOpenMockupModal(false)}
                    productId={product?._id || productId}
                    onImageSelect={handleImageFromModal}
                />

                {/* Confirmation Modal */}

                <ConfirmDesignModal
                    handleSave={handleSave}
                    open={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={async () => {
                        handleSave()
                        setShowConfirmModal(false);
                        navigate(`/user/design-variants/${productId}`, {
                            state: {
                                product,
                                selectedMockup,
                                customerLayers,
                                adminLayers
                            }
                        });
                    }}
                />
            </div>
        </div>
    );
};

export default Editor;