import React from "react";

const EditorPropertiesPanel = ({
  selectedLayer,
  activePanel,
  printAreaFileInputRef,
  operations,
  setShowGrid,
}) => {
  return (
    <div className={`${activePanel === 'properties' ? 'block' : 'hidden'} lg:block w-full lg:w-64 bg-gray-800 p-4 lg:p-6 space-y-4 lg:space-y-6 overflow-auto`}>
      <h2 className="text-lg lg:text-xl font-semibold text-gray-300 mb-2">Properties</h2>

      <div className="flex gap-2 mb-3">
        <button onClick={operations.addNewTextLayer} className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded shadow transition">
          + Text
        </button>
        <button onClick={operations.addImageLayerButton} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded shadow transition">
          + Image
        </button>
      </div>

      <button onClick={operations.duplicateLayer} disabled={!selectedLayer} className={`w-full py-2 rounded shadow mb-4 transition ${selectedLayer ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-600 cursor-not-allowed"}`}>
        Duplicate Layer
      </button>

      {selectedLayer ? (
        <div className="space-y-4">
          {/* Layer Info */}
          <div className="flex items-center justify-between">
            <div className="text-gray-300 font-medium">
              {selectedLayer.type === "text" ? "Text Layer" :
                selectedLayer.type === "image" ? "Image Layer" :
                  selectedLayer.type === "printarea" ? "Print Area" : "Background"}
            </div>
            <div className="text-sm text-gray-400">{selectedLayer.id}</div>
          </div>

          {/* Layer Name & Lock */}
          <div className="flex gap-2 items-center">
            <div className="text-gray-400 font-medium">Layer Name</div>
            <button onClick={operations.toggleLockSelected} className={`ml-auto px-2 py-1 rounded ${selectedLayer.locked ? "bg-red-600" : "bg-gray-700 hover:bg-gray-600"}`}>
              {selectedLayer.locked ? "Unlock" : "Lock"}
            </button>
          </div>

          <input type="text" className="w-full p-2 rounded bg-gray-700 text-white" value={selectedLayer.name ?? ""}
            onChange={(e) => operations.updateLayer(selectedLayer.id, { name: e.target.value })} />

          {/* Position */}
          <div>
            <p className="text-gray-400 font-medium">Position (x, y)</p>
            <div className="flex gap-2 mt-1">
              <input type="number" className="w-1/2 p-2 rounded bg-gray-700 text-white" value={Math.round(selectedLayer.x)}
                onChange={(e) => operations.updateLayer(selectedLayer.id, { x: parseInt(e.target.value) || 0 })} />
              <input type="number" className="w-1/2 p-2 rounded bg-gray-700 text-white" value={Math.round(selectedLayer.y)}
                onChange={(e) => operations.updateLayer(selectedLayer.id, { y: parseInt(e.target.value) || 0 })} />
            </div>
          </div>

          {/* Size */}
          <div>
            <p className="text-gray-400 font-medium">Size (w, h)</p>
            <div className="flex gap-2 mt-1">
              <input type="number" className="w-1/2 p-2 rounded bg-gray-700 text-white" value={Math.round(selectedLayer.width)}
                onChange={(e) => operations.updateLayer(selectedLayer.id, { width: parseInt(e.target.value) || 1 })} />
              {console.log(selectedLayer, "<<<<< selectede layer")}
              <input type="number" className="w-1/2 p-2 rounded bg-gray-700 text-white" value={Math.round(selectedLayer.height)}
                onChange={(e) => operations.updateLayer(selectedLayer.id, { height: parseInt(e.target.value) || 1 })} />
            </div>

            {/* ✅ ACTUAL/NATURAL SIZE DISPLAY (New) */}
            {selectedLayer.type === "image" && (
              <div className="mt-2 text-xs text-gray-500">
                <span className="block">Actual: {selectedLayer.naturalWidth || selectedLayer.width} × {selectedLayer.naturalHeight || selectedLayer.height}</span>
                <span className="block">Display: {Math.round(selectedLayer.width)} × {Math.round(selectedLayer.height)}</span>
              </div>
            )}
          </div>

          {/* Rotation */}
          <div>
            <p className="text-gray-400 font-medium">Rotation (deg)</p>
            <input type="number" className="w-full p-2 rounded bg-gray-700 text-white" value={selectedLayer.rotation || 0}
              onChange={(e) => operations.updateLayer(selectedLayer.id, { rotation: parseInt(e.target.value) || 0 })} />
          </div>

          {/* Opacity */}
          <div>
            <p className="text-gray-400 font-medium">Opacity</p>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="1" step="0.01" value={selectedLayer.opacity ?? 1}
                onChange={(e) => operations.updateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })} className="flex-1" />
              <div className="w-12 text-right">{Math.round((selectedLayer.opacity ?? 1) * 100)}%</div>
            </div>
          </div>

          {/* Text Layer Properties */}
          {selectedLayer.type === "text" && (
            <>
              <div>
                <p className="text-gray-400 font-medium">Text</p>
                <input className="w-full p-2 rounded bg-gray-700 text-white" value={selectedLayer.text}
                  onChange={(e) => operations.updateLayer(selectedLayer.id, { text: e.target.value })} />
              </div>
              <div>
                <p className="text-gray-400 font-medium">Font Size</p>
                <input type="number" className="w-full p-2 rounded bg-gray-700 text-white" value={selectedLayer.fontSize}
                  onChange={(e) => operations.updateLayer(selectedLayer.id, { fontSize: parseInt(e.target.value) || 12 })} />
              </div>
              <div>
                <p className="text-gray-400 font-medium">Color</p>
                <input type="color" className="w-full h-10 p-1 rounded" value={selectedLayer.color}
                  onChange={(e) => operations.updateLayer(selectedLayer.id, { color: e.target.value })} />
              </div>
            </>
          )}

          {/* Image Layer Properties */}
          {selectedLayer.type === "image" && (
            <>
              <div>
                <p className="text-gray-400 font-medium">Replace Image</p>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  if (selectedLayer.src && selectedLayer.src.startsWith("blob:")) {
                    try { URL.revokeObjectURL(selectedLayer.src); } catch (err) { }
                  }
                  const url = URL.createObjectURL(file);
                  operations.updateLayer(selectedLayer.id, { src: url });
                }} className="w-full mt-1 p-2 bg-gray-700 rounded" />
              </div>
              <div>
                <p className="text-gray-400 font-medium">Fit Mode</p>
                <select value={selectedLayer.fit || "contain"} onChange={(e) => operations.updateLayer(selectedLayer.id, { fit: e.target.value })}
                  className="w-full p-2 rounded bg-gray-700 text-white">
                  <option value="contain">Contain</option>
                  <option value="cover">Cover</option>
                  <option value="fill">Fill</option>
                </select>
              </div>

              {/* ✅ PERSPECTIVE CONTROLS FOR IMAGE */}
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-300 font-medium">Perspective</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={selectedLayer.enablePerspective || false} onChange={(e) => {
                      const checked = e.target.checked;
                      operations.updateLayer(selectedLayer.id, { enablePerspective: checked });
                      setShowGrid(checked);
                    }} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {selectedLayer.enablePerspective && (
                  <div className="space-y-4">

                    {/* Reset Button */}

                    <button onClick={() => operations.updateLayer(selectedLayer.id, {
                      perspective: 0,
                      rotateX: 0,
                      rotateY: 0,
                      rotateZ: 0,
                      skewX: 0,
                      skewY: 0,
                      transformOrigin: "center center",
                      corners: selectedLayer.corners || [
                        { x: 0, y: 0 },                                  // top-left
                        { x: selectedLayer.width, y: 0 },                // top-right
                        { x: selectedLayer.width, y: selectedLayer.height }, // bottom-right
                        { x: 0, y: selectedLayer.height }                // bottom-left
                      ]
                    })} className="w-full mt-3 py-2 bg-gray-600 hover:bg-gray-500 rounded transition">
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
                <input ref={printAreaFileInputRef} type="file" accept="image/*" onChange={operations.handlePrintAreaImageUpload} className="hidden" />
                {!selectedLayer.hasImage ? (
                  <div className="space-y-3">
                    <button onClick={operations.triggerPrintAreaImageUpload} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition flex items-center justify-center gap-2">
                      Upload Image
                    </button>
                    <p className="text-xs text-gray-400 text-center">Upload image for {selectedLayer.width}×{selectedLayer.height} area</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-gray-900 rounded-lg p-3">
                      <img src={selectedLayer.imageSrc} alt="Print area preview" className="w-full h-40 object-contain rounded" />
                      <div className="flex justify-between mt-3">
                        <button onClick={operations.triggerPrintAreaImageUpload} className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded transition">
                          Replace Image
                        </button>
                        <button onClick={operations.removePrintAreaImage} className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded transition">
                          Remove Image
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Image Fit</p>
                      <select value={selectedLayer.fit || "cover"} onChange={(e) => operations.updateLayer(selectedLayer.id, { fit: e.target.value })}
                        className="w-full p-2 rounded bg-gray-700 text-white">
                        <option value="cover">Cover (Fill entire area)</option>
                        <option value="contain">Contain (Fit inside)</option>
                        <option value="fill">Fill (Stretch)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ PERSPECTIVE CONTROLS FOR PRINT AREA */}
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-300 font-medium">Perspective</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={selectedLayer.enablePerspective || false} onChange={(e) => {
                      const checked = e.target.checked;
                      operations.updateLayer(selectedLayer.id, { enablePerspective: checked });
                      setShowGrid(checked);
                    }} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {selectedLayer.enablePerspective && (
                  <div className="space-y-4">

                    <button
                      onClick={() =>
                        operations.updateLayer(selectedLayer.id, {
                          perspective: 0,
                          rotateX: 0,
                          rotateY: 0,
                          rotateZ: 0,
                          skewX: 0,
                          skewY: 0,
                          transformOrigin: "center center",
                          corners: selectedLayer.corners || [
                            { x: 0, y: 0 },
                            { x: selectedLayer.width, y: 0 },
                            { x: selectedLayer.width, y: selectedLayer.height },
                            { x: 0, y: selectedLayer.height }
                          ]
                        })
                      }
                      className="w-full py-2 bg-gray-600 hover:bg-gray-500 rounded transition"
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
            <button onClick={() => operations.bringForward(selectedLayer.id)} className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded transition">
              Bring Forward
            </button>
            <button onClick={() => operations.sendBackward(selectedLayer.id)} className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded transition">
              Send Backward
            </button>
          </div>

          {/* Delete Layer */}
          <div className="pt-2">
            <button onClick={() => operations.removeLayer(selectedLayer.id)} className="w-full py-2 bg-red-600 hover:bg-red-700 rounded transition">
              Delete Layer
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-center py-4">Select a layer to edit</p>
      )}
    </div>
  );
};

export default EditorPropertiesPanel;