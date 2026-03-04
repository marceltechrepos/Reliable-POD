import React from "react";
import { createMockup } from "../../../api/product.api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditorHeader = ({
  showPrintareaSelect,
  setShowPrintareaSelect,
  printAreas,
  mobileMenuOpen,
  setMobileMenuOpen,
  activePanel,
  setActivePanel,
  scale,
  showGrid,
  setShowGrid,
  fileInputRef,
  operations,
}) => {

  const { editId: productId } = useParams();


  const mockupImage = JSON.parse(localStorage.getItem("mockupToEdit"));
  const navigate = useNavigate();

  const mockupCreate = async () => {
    try {
      localStorage.removeItem("selectedMockups");
      sessionStorage.removeItem("reloaded")
      const response = await createMockup(productId, { mockupImage: mockupImage.url });
       operations.onSave();

      // toast.success("Mockup created successfully");

      // Explicitly navigate
      // navigate(`/admin/product/${productId}`);
    } catch (error) {
      toast.error("Failed to create mockup")
      console.log(error, "<<<< error");
    }
  }
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="flex items-center justify-between p-3 lg:p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          <h1 className="text-xl lg:text-2xl font-bold text-blue-400">Mockup Editor</h1>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setShowPrintareaSelect((prev) => !prev)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium shadow-md transition"
          >
            + Add Printarea
          </button>

          <button
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium shadow-md transition"
            onClick={operations.addImageLayerButton}
          >
            + Add Image
          </button>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={operations.handleFileInputChange} className="hidden" />

          <button
            className={`bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium shadow-md transition ${operations?.isSaving ? "opacity-50 cursor-not-allowed" : ""} cursor-pointer`}
            // onClick={operations.onSave}
            onClick={mockupCreate}
            disabled={operations?.isSaving}
          >
            {operations?.isSaving ? "Saving..." : "Save Changes"}
          </button>

          {/* <button 
  onClick={operations.zoomToFitAllImages}
  className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700"
  title="Fit All Images to Screen"
>
  Fit All
</button> */}
        </div>

        <div className="flex items-center gap-2">
          <button
            // onClick={operations.onSave}
            onClick={mockupCreate}
            className="lg:hidden p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            title="Save"
          >
            {operations?.isSaving ? "⏳" : "💾"}
          </button>

          <div className="flex items-center bg-gray-700 rounded-lg p-1">
            <button onClick={operations.handleUndo} className="p-2 rounded hover:bg-gray-600" title="Undo (Ctrl+Z)">⤺</button>
            <button onClick={operations.handleRedo} className="p-2 rounded hover:bg-gray-600" title="Redo (Ctrl+Y)">⤻</button>
          </div>

          <button onClick={() => operations.exportAsImage("png")} className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700" title="Export PNG (Ctrl+E)">
            PNG
          </button>
          <button onClick={() => operations.exportAsImage("jpg")} className="px-3 py-2 rounded bg-amber-600 hover:bg-amber-700" title="Export JPG">
            JPG
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-2 rounded ${showGrid ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}
            title="Toggle Grid"
          >
            Grid
          </button>

          <div className="hidden sm:flex items-center bg-gray-700 p-1 rounded">
            <button onClick={operations.handleZoomOut} className="px-2 py-1 rounded hover:bg-gray-600" title="Zoom out (Ctrl+-)">−</button>
            <div className="px-2 text-sm">{Math.round(scale * 100)}%</div>
            <button onClick={operations.handleZoomIn} className="px-2 py-1 rounded hover:bg-gray-600" title="Zoom in (Ctrl+= / Ctrl++)">+</button>
            <button onClick={operations.handleZoomReset} className="px-2 py-1 rounded hover:bg-gray-600" title="Reset zoom (Ctrl+0)">Reset</button>
          </div>
        </div>
      </div>

      {showPrintareaSelect && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 lg:top-16 lg:right-6 lg:left-auto lg:transform-none bg-gray-800 rounded-lg shadow-lg p-3 w-11/12 lg:w-64 z-50">
          <p className="text-gray-300 text-sm mb-2">Select Print Area</p>
          <select
            className="w-full p-2 rounded bg-gray-700 text-white"
            onChange={(e) => {
              const selected = printAreas.find((p) => p._id === e.target.value);
              if (selected) operations.addPrintAreaToCanvas(selected);
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

      <div className="lg:hidden flex border-t border-gray-700">
        <button onClick={() => setActivePanel('layers')} className={`flex-1 py-3 ${activePanel === 'layers' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'}`}>
          Layers
        </button>
        <button onClick={() => setActivePanel('canvas')} className={`flex-1 py-3 ${activePanel === 'canvas' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'}`}>
          Canvas
        </button>
        <button onClick={() => setActivePanel('properties')} className={`flex-1 py-3 ${activePanel === 'properties' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'}`}>
          Properties
        </button>
      </div>
    </header>
  );
};

export default EditorHeader;
