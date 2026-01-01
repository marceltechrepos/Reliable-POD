// import React from "react";
// import { Rnd } from "react-rnd";

// const EditorCanvas = ({
//   mockup,
//   layers,
//   selectedLayerId,
//   setSelectedLayerId,
//   scale,
//   showGrid,
//   gridSize,
//   getCanvasSize,
//   canvasRef,
//   innerCanvasRef,
//   draggingCorner,
//   operations,
//   activePanel,
//   mobileMenuOpen,
// }) => {
//   const drawGrid = () => {
//     if (!showGrid || !innerCanvasRef.current) return null;

//     const gridStyle = {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       pointerEvents: "none",
//       zIndex: 0,
//     };

//       // Add responsive check
//   const isMobile = window.innerWidth < 1024;
//   const shouldShowCanvas = !isMobile || (isMobile && activePanel === 'canvas');

//   if (!shouldShowCanvas) return null;

//     return (
//       <div style={gridStyle}>
//         <svg width="100%" height="100%">
//           {Array.from({ length: Math.ceil(getCanvasSize().width / gridSize) + 1 }).map((_, i) => (
//             <line
//               key={`v-${i}`}
//               x1={i * gridSize}
//               y1="0"
//               x2={i * gridSize}
//               y2={getCanvasSize().height}
//               stroke="rgba(255, 255, 255, 0.15)"
//               strokeWidth="1"
//             />
//           ))}
//           {Array.from({ length: Math.ceil(getCanvasSize().height / gridSize) + 1 }).map((_, i) => (
//             <line
//               key={`h-${i}`}
//               x1="0"
//               y1={i * gridSize}
//               x2={getCanvasSize().width}
//               y2={i * gridSize}
//               stroke="rgba(255, 255, 255, 0.15)"
//               strokeWidth="1"
//             />
//           ))}
//         </svg>
//       </div>
//     );
//   };

//   return (
//     <div className={`flex-1 flex items-center justify-center bg-gray-700 p-2 lg:p-4`}>
//       <div
//         ref={canvasRef}
//         className="relative w-full h-full rounded-xl relative overflow-hidden flex items-center justify-center"
//       >
//         {mockup ? (
//           <div
//             className="relative bg-black/0"
//             style={{
//               width: "90%",
//               height: "90%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <div
//               ref={innerCanvasRef}
//               className="relative"
//               style={{
//                 width: getCanvasSize().width,
//                 height: getCanvasSize().height,
//                 display: "inline-block",
//                 position: "relative",
//                 transform: `scale(${scale})`,
//                 transformOrigin: "center center",
//               }}
//             >
//               {drawGrid()}

//               {layers.map((layer, index) => {
//                 if (layer.visible === false) return null;
//                 const zIndex = index + 1;

//                 if (layer.type === "background") {
//                   return (
//                     <img
//                       key={layer.id}
//                       src={layer.src}
//                       alt="background"
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "contain",
//                         display: "block",
//                         borderRadius: 8,
//                         boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
//                         position: "absolute",
//                         left: 0,
//                         top: 0,
//                       }}
//                     />
//                   );
//                 }

//                 const showRotationHandle = selectedLayerId === layer.id && layer.type !== "background" && !layer.locked;
//                 const showPerspectiveHandles = selectedLayerId === layer.id &&
//                   (layer.type === "image" || layer.type === "printarea") &&
//                   layer.enablePerspective;

//                 return (
//                   <Rnd
//                     key={layer.id}
//                     size={{ width: layer.width, height: layer.height }}
//                     position={{ x: layer.x, y: layer.y }}
//                     bounds="parent"
//                     onDragStop={(e, d) => operations.updateLayer(layer.id, { x: d.x, y: d.y })}
//                     onResizeStop={(e, direction, ref, delta, position) =>
//                       operations.updateLayer(layer.id, {
//                         width: parseInt(ref.style.width, 10),
//                         height: parseInt(ref.style.height, 10),
//                         ...position,
//                       })
//                     }
//                     onClick={() => setSelectedLayerId(layer.id)}
//                     enableResizing={layer.type !== "background" && !layer.locked &&
//                       !(layer.enablePerspective && (layer.type === "image" || layer.type === "printarea"))}
//                     disableDragging={!!layer.locked}
//                     scale={1}
//                     style={{
//                       zIndex,
//                       border:
//                         selectedLayerId === layer.id
//                           ? "2px solid #3b82f6"
//                           : layer.type === "printarea" && layer.border
//                             ? "2px dashed #22c55e"
//                             : "1px dashed rgba(255,255,255,0.05)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: layer.locked ? "not-allowed" : "move",
//                       pointerEvents: "auto",
//                       position: "absolute",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         transform: `rotate(${layer.rotation || 0}deg) scale(${scale})`,
//                         transformOrigin: "center center",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         opacity: layer.opacity !== undefined ? layer.opacity : 1,
//                         background: layer.type === "text" ? "transparent" : "none",
//                       }}
//                     >
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
//                         <div
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             perspective: `${layer.perspective || 0}px`,
//                             transformStyle: "preserve-3d",
//                           }}
//                         >
//                           <img
//                             src={layer.src}
//                             alt="layer"
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: layer.fit || "contain",
//                               pointerEvents: "none",
//                               transform: `
//                                 rotateX(${layer.rotateX || 0}deg)
//                                 rotateY(${layer.rotateY || 0}deg)
//                                 rotateZ(${layer.rotateZ || 0}deg)
//                                 skewX(${layer.skewX || 0}deg)
//                                 skewY(${layer.skewY || 0}deg)
//                               `,
//                               transformOrigin: layer.transformOrigin || "center center",
//                             }}
//                           />
//                         </div>
//                       )}

//                       {layer.type === "printarea" && (
//                         <div
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             perspective: `${layer.perspective || 0}px`,
//                             transformStyle: "preserve-3d",
//                           }}
//                         >
//                           {layer.hasImage ? (
//                             <img
//                               src={layer.imageSrc}
//                               alt="Print area"
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: layer.fit || "cover",
//                                 pointerEvents: "none",
//                                 transform: `
//                                   rotateX(${layer.rotateX || 0}deg)
//                                   rotateY(${layer.rotateY || 0}deg)
//                                   rotateZ(${layer.rotateZ || 0}deg)
//                                   skewX(${layer.skewX || 0}deg)
//                                   skewY(${layer.skewY || 0}deg)
//                                 `,
//                                 transformOrigin: layer.transformOrigin || "center center",
//                               }}
//                             />
//                           ) : (
//                             <div
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 background: "rgba(34,197,94,0.08)",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 fontSize: 14,
//                                 color: "#22c55e",
//                                 fontWeight: 600,
//                                 userSelect: "none",
//                                 textAlign: "center",
//                                 overflow: "hidden",
//                                 transform: `
//                                   rotateX(${layer.rotateX || 0}deg)
//                                   rotateY(${layer.rotateY || 0}deg)
//                                   rotateZ(${layer.rotateZ || 0}deg)
//                                   skewX(${layer.skewX || 0}deg)
//                                   skewY(${layer.skewY || 0}deg)
//                                 `,
//                                 transformOrigin: layer.transformOrigin || "center center",
//                               }}
//                             >
//                               {layer.name || "Print Area"}
//                               <br />
//                               {layer.width} × {layer.height}
//                               <br />
//                               <span style={{ fontSize: 10, color: "#888", fontWeight: "normal" }}>
//                                 Upload image from properties panel
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       )}

//                       {/* Perspective Handles - 8 points */}
//                       {showPerspectiveHandles && layer.corners && (
//                         <>
//                           {layer.corners.map((corner, index) => (
//                             <div
//                               key={`corner-${index}`}
//                               onMouseDown={(e) => operations.startCornerDrag(e, layer.id, index)}
//                               style={{
//                                 position: "absolute",
//                                 left: corner.x - 4,
//                                 top: corner.y - 4,
//                                 width: 8,
//                                 height: 8,
//                                 backgroundColor: "#f59e0b",
//                                 borderRadius: "50%",
//                                 border: "2px solid white",
//                                 cursor: "move",
//                                 zIndex: 9999,
//                               }}
//                               title={`Drag to adjust perspective (Point ${index + 1})`}
//                             />
//                           ))}
//                         </>
//                       )}

//                       {/* Rotation Handle */}
//                       {showRotationHandle && (
//                         <div
//                           onMouseDown={(e) => operations.startRotation(e, layer.id)}
//                           className="absolute top-0 right-0 w-4 h-4 rounded-full bg-blue-500 cursor-crosshair"
//                           style={{ zIndex: 9999 }}
//                         />
//                       )}
//                     </div>
//                   </Rnd>
//                 );
//               })}
//             </div>
//           </div>
//         ) : (
//           <span className="text-gray-400 text-lg">No mockup selected</span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditorCanvas;


import React from "react";
import { Rnd } from "react-rnd";

const EditorCanvas = ({
  mockup,
  layers,
  selectedLayerId,
  setSelectedLayerId,
  scale,
  showGrid,
  gridSize,
  getCanvasSize,
  canvasRef,
  innerCanvasRef,
  draggingCorner,
  operations,
  activePanel, // ADDED BACK
}) => {
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

    // ✅ ADD BACK THE RESPONSIVE CHECK
    const isMobile = window.innerWidth < 1024;
    const shouldShowCanvas = !isMobile || (isMobile && activePanel === 'canvas');

    if (!shouldShowCanvas) return null;

    return (
      <div style={gridStyle}>
        <svg width="100%" height="100%">
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

  // ✅ ADD RESPONSIVE CHECK FOR ENTIRE COMPONENT
  const isMobile = window.innerWidth < 1024;
  const shouldShowCanvas = !isMobile || (isMobile && activePanel === 'canvas');

  if (!shouldShowCanvas) return null;

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full rounded-xl relative overflow-hidden flex items-center justify-center"
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
              const showPerspectiveHandles = selectedLayerId === layer.id &&
                (layer.type === "image" || layer.type === "printarea") &&
                layer.enablePerspective;

              return (
                <Rnd
                  key={layer.id}
                  size={{ width: layer.width, height: layer.height }}
                  position={{ x: layer.x, y: layer.y }}
                  // bounds="parent"
                  onDragStop={(e, d) => operations.updateLayer(layer.id, { x: d.x, y: d.y })}
                  onResizeStop={(e, direction, ref, delta, position) =>
                    operations.updateLayer(layer.id, {
                      width: parseInt(ref.style.width, 10),
                      height: parseInt(ref.style.height, 10),
                      ...position,
                    })
                  }
                  onClick={() => setSelectedLayerId(layer.id)}
                  enableResizing={layer.type !== "background" && !layer.locked &&
                    !(layer.enablePerspective && (layer.type === "image" || layer.type === "printarea"))}
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
                            <span style={{ fontSize: 10, color: "#888", fontWeight: "normal" }}>
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
                            onMouseDown={(e) => operations.startCornerDrag(e, layer.id, index)}
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
                        onMouseDown={(e) => operations.startRotation(e, layer.id)}
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
  );
};

export default EditorCanvas;