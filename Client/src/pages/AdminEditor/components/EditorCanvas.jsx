import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import WarpedImage from "./WarpedImage";
import ThreeWarpedImage from "./WarpedImage";

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
  canvasOffset, // ✅ ADD THIS LINE
  setCanvasOffset, // ✅ ADD THIS LINE
}) => {

  const [resizeData, setResizeData] = useState({
    startWidth: 0,
    startHeight: 0,
    aspectRatio: 1,
    isShiftPressed: false,
    isCtrlPressed: false
  });

  // EditorCanvas component ke top par yeh state variables add karo
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Mouse events for panning
  const handleMouseDown = (e) => {
    if (isPanning && e.button === 0) { // Left mouse button + Alt key
      e.preventDefault();
      setPanStart({
        x: e.clientX - canvasOffset.x,
        y: e.clientY - canvasOffset.y
      });
      document.body.style.cursor = 'grabbing';

      const handleMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - panStart.x;
        const deltaY = moveEvent.clientY - panStart.y;

        setCanvasOffset({
          x: deltaX,
          y: deltaY
        });
      };

      const handleMouseUp = () => {
        document.body.style.cursor = 'grab';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  // Mouse events for tracking Ctrl and Shift
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setResizeData(prev => ({ ...prev, isShiftPressed: true }));
      }
      if (e.key === 'Control') {
        setResizeData(prev => ({ ...prev, isCtrlPressed: true }));
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        setResizeData(prev => ({ ...prev, isShiftPressed: false }));
      }
      if (e.key === 'Control') {
        setResizeData(prev => ({ ...prev, isCtrlPressed: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const drawGrid = () => {
    if (!showGrid || !innerCanvasRef.current) return null;

    const gridStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 999,
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
              stroke="rgba(255, 255, 255, 0.7)"
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
              stroke="rgba(255, 255, 255, 0.7)"
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
      className="relative w-full h-full rounded-xl overflow-auto flex items-center justify-center"
      onMouseDown={handleMouseDown}
      style={{
        cursor: isPanning ? 'grab' : 'default',
        overflow: 'auto',// Photoshop ki tarah scroll nahi, panning hoga
        backgroundColor: '#374151',
      }}
    >
      {mockup ? (
        <div
          className="relative"
          style={{
            minWidth: getCanvasSize().width,
            minHeight: getCanvasSize().height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}

        >
          <div
            ref={innerCanvasRef}
            className="relative bg-gray-800"
            style={{
              width: getCanvasSize().displayWidth,
              height: getCanvasSize().displayHeight,
              display: "inline-block",
              position: "relative",
              // transform: `scale(${1}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
              transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
              transformOrigin: "0 0",
              border: "1px solid rgba(255,255,255,0.1)", // Canvas border for visibility
              background: "rgba(0,0,0,0.3)", // Canvas background
            }}
          >
            {drawGrid()}

            {layers.map((layer, index) => {
              if (layer.visible === false) return null;
              const zIndex = index + 1;
              const isSelected = selectedLayerId === layer.id;

              // Allow pointer events only for selected layer or when no layer is selected
              const shouldHandlePointerEvents = isSelected || selectedLayerId === null;


              if (layer.type === "background") {
                return (
                  <div
                    key={layer.id}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "100%",

                      zIndex: 0,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={layer.src}
                      alt="background"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",  
                        display: "block",
                      }}
                    />
                  </div>
                );
              }
              const showRotationHandle = selectedLayerId === layer.id && layer.type !== "background" && !layer.locked;
              const showPerspectiveHandles = selectedLayerId === layer.id &&
                (layer.type === "image" || layer.type === "printarea") &&
                layer.enablePerspective;

              return (
                <Rnd
                  key={layer.id}
                  // ✅ Original size ke hisaab se dimensions do
                  size={{
                    width: layer.width * (getCanvasSize().displayWidth / getCanvasSize().originalWidth),
                    height: layer.height * (getCanvasSize().displayHeight / getCanvasSize().originalHeight)
                  }}
                  position={{
                    x: layer.x * (getCanvasSize().displayWidth / getCanvasSize().originalWidth),
                    y: layer.y * (getCanvasSize().displayHeight / getCanvasSize().originalHeight)
                  }}
                  onDragStop={(e, d) => {
                    // ✅ Wapas original size mein convert karo
                    const originalX = d.x / (getCanvasSize().displayWidth / getCanvasSize().originalWidth);
                    const originalY = d.y / (getCanvasSize().displayHeight / getCanvasSize().originalHeight);
                    operations.updateLayer(layer.id, { x: originalX, y: originalY });
                  }}

                  // Naya onResizeStart handler
                  onResizeStart={(e, direction, ref, delta) => {
                    setResizeData({
                      startWidth: layer.width,
                      startHeight: layer.height,
                      aspectRatio: layer.width / layer.height,
                      isShiftPressed: e.shiftKey,
                      isCtrlPressed: e.ctrlKey
                    });
                  }}

                  // Naya onResize handler with aspect ratio locking
                  onResize={(e, direction, ref, delta, position) => {
                    let newWidth = parseInt(ref.style.width, 10);
                    let newHeight = parseInt(ref.style.height, 10);
                    let newX = position.x;
                    let newY = position.y;

                    // Shift key pressed - maintain aspect ratio
                    if (resizeData.isShiftPressed) {
                      const aspect = resizeData.aspectRatio;

                      // Determine which direction we're resizing
                      if (direction.includes('right') || direction.includes('left')) {
                        // Horizontal resize - adjust height based on width
                        newHeight = newWidth / aspect;
                      } else if (direction.includes('top') || direction.includes('bottom')) {
                        // Vertical resize - adjust width based on height
                        newWidth = newHeight * aspect;
                      }

                      // For corner resizing, maintain aspect ratio
                      if (direction.includes('bottom') && direction.includes('right')) {
                        newHeight = newWidth / aspect;
                      } else if (direction.includes('bottom') && direction.includes('left')) {
                        newHeight = newWidth / aspect;
                      } else if (direction.includes('top') && direction.includes('right')) {
                        newHeight = newWidth / aspect;
                      } else if (direction.includes('top') && direction.includes('left')) {
                        newHeight = newWidth / aspect;
                      }
                    }

                    // Ctrl key pressed - resize from center
                    if (resizeData.isCtrlPressed) {
                      const widthDelta = newWidth - resizeData.startWidth;
                      const heightDelta = newHeight - resizeData.startHeight;

                      // Adjust position to keep center fixed
                      newX = layer.x - widthDelta / 2;
                      newY = layer.y - heightDelta / 2;
                    }

                    operations.updateLayer(layer.id, {
                      width: newWidth,
                      height: newHeight,
                      x: newX,
                      y: newY,
                    });
                  }}

                  onResizeStop={(e, direction, ref, delta, position) => {
                    // ✅ Wapas original size mein convert karo
                    const displayToOriginalScale = getCanvasSize().originalWidth / getCanvasSize().displayWidth;
                    const newWidth = parseInt(ref.style.width, 10) * displayToOriginalScale;
                    const newHeight = parseInt(ref.style.height, 10) * displayToOriginalScale;
                    const newX = position.x * displayToOriginalScale;
                    const newY = position.y * displayToOriginalScale;

                    operations.updateLayer(layer.id, {
                      width: newWidth,
                      height: newHeight,
                      x: newX,
                      y: newY,
                    });
                  }}


                  // Naya prop add karo for better control
                  lockAspectRatio={resizeData.isShiftPressed} // This will lock aspect when Shift is pressed

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
                    pointerEvents: selectedLayerId === layer.id ? "auto" : "none", // ← ADD THIS LINE
                    position: "absolute",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      transform: `rotate(${layer.rotation || 0}deg)`, // scale(${scale})
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
                      layer.enablePerspective && layer.corners ? (
                        <div style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          // transform: `scaleY(1)`,
                          // transform: `rotate(${layer.rotation || 0}deg)`,
                          // transformOrigin: "center center"
                          //  transform: `scale(${getCanvasSize().scaleFactor})`,
                          // transformOrigin: "0 0"
                        }}>
                          <div style={{
                            width: layer.width,
                            height: layer.height,
                            position: "relative",
                            transform: `scale(${getCanvasSize().displayWidth / getCanvasSize().originalWidth})`,  // ← scaling yahan
                            transformOrigin: "0 0"
                          }}>
                            <ThreeWarpedImage
                              key={`${layer.id}-${JSON.stringify(layer.corners)}`}
                              src={layer.src}
                              corners={layer.corners}
                              width={layer.width}
                              height={layer.height}
                              fit={layer.fit || "contain"}
                            />
                          </div>
                        </div>
                      ) : (
                        // Normal image (no perspective)
                        <div style={{
                          width: "100%",
                          height: "100%",
                          perspective: `${layer.perspective || 0}px`,
                          transformStyle: "preserve-3d",
                        }}>
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
                      )
                    )}


                    {/* // Printarea section (~line 250) UPDATE karo: */}
                    {layer.type === "printarea" && (
                      layer.enablePerspective && layer.corners && layer.hasImage ? (
                        <div style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          // transform: `scaleY(1)`,
                          // transform: `scale(${getCanvasSize().scaleFactor})`,
                          // transform: `rotate(${layer.rotation || 0}deg)`,
                          // transformOrigin: "center center"
                          // transformOrigin: "0 0"
                        }}>
                          <div style={{
                            width: layer.width,
                            height: layer.height,
                            position: "relative",
                            transform: `scale(${getCanvasSize().displayWidth / getCanvasSize().originalWidth})`,
                            transformOrigin: "0 0"
                          }}>
                            <ThreeWarpedImage
                              key={`${layer.id}-${JSON.stringify(layer.corners)}`}
                              src={layer.imageSrc}
                              corners={layer.corners}
                              width={layer.width}
                              height={layer.height}
                              fit={layer.fit || "cover"}
                            />
                          </div>
                        </div>
                      )
                        :
                        (
                          // Normal rendering (no perspective or no image)
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
                                {Math.round(layer.width)} × {Math.round(layer.height)}
                                <br />
                                <span style={{ fontSize: 10, color: "#888", fontWeight: "normal" }}>
                                  Upload image from properties panel
                                </span>
                              </div>
                            )}
                          </div>
                        )
                    )}

                    {/* Perspective Handles - 4 points */}
                    {showPerspectiveHandles && layer.corners && (
                      <>
                        {layer.corners.slice(0, 4).map((corner, index) => {
                          // ✅ Display size ke hisaab se coordinates scale karo
                          const scaleFactor = getCanvasSize().displayWidth / getCanvasSize().originalWidth;
                          const displayX = corner.x * scaleFactor;
                          const displayY = corner.y * scaleFactor;

                          return (
                            <div
                              key={`corner-${index}`}
                              onMouseDown={(e) => operations.startCornerDrag(e, layer.id, index)}
                              style={{
                                position: "absolute",
                                left: displayX - 6,  // ← scaled coordinates
                                top: displayY - 6,   // ← scaled coordinates
                                width: 12,
                                height: 12,
                                backgroundColor: "#f59e0b",
                                borderRadius: "50%",
                                border: "2px solid white",
                                cursor: "move",
                                zIndex: 9999,
                              }}
                            />
                          );
                        })}
                      </>
                    )}
                    {/* {showPerspectiveHandles && layer.corners && (
                      <>
                        {layer.corners.slice(0, 4).map((corner, index) => ( // ✅ Only 4 points
                          <div
                            key={`corner-${index}`}
                            onMouseDown={(e) => operations.startCornerDrag(e, layer.id, index)}
                            style={{
                              position: "absolute",
                              left: corner.x - 6,  // ✅ Bigger handle
                              top: corner.y - 6,
                              width: 12,
                              height: 12,
                              backgroundColor: "#f59e0b",
                              borderRadius: "50%",
                              border: "2px solid white",
                              cursor: "move",
                              zIndex: 9999,
                              // boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                            }}
                            title={`Drag to adjust perspective (Point ${index + 1})`}
                          />
                        ))}
                      </>
                    )} */}

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
      )
      }
    </div >
  );
};

export default EditorCanvas;