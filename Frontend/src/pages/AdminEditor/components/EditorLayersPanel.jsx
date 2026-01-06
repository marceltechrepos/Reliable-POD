import React from "react";
import { ReactSortable } from "react-sortablejs";
import EditorLayerItem from "./EditorLayerItem";

const EditorLayersPanel = ({
  layers,
  selectedLayerId,
  setSelectedLayerId,
  activePanel,
  setActivePanel,
  operations,
}) => {
  // ✅ DIRECT FUNCTION FOR DRAG-DROP
  const handleSortableChange = (newLayers) => {
    // Direct state update for drag-drop
    operations.setLayers(newLayers, { recordHistory: false });
  };

  return (
    <div className={`${activePanel === 'layers' ? 'block' : 'hidden'} lg:block w-full lg:w-64 bg-gray-800 p-4 space-y-4 overflow-auto`}>
      <h2 className="text-lg font-semibold text-gray-300 mb-2">Layers</h2>

      {layers.length === 0 && (
        <div className="text-gray-400">No layers yet. Add text or image.</div>
      )}

      <ReactSortable
        list={layers}
        setList={handleSortableChange} // ✅ USE LOCAL FUNCTION
        animation={200}
        ghostClass="bg-gray-500/50"
        handle=".drag-handle"
      >
        {layers.map((layer) => (
          <EditorLayerItem
            key={layer.id}
            layer={layer}
            isSelected={selectedLayerId === layer.id}
            onSelect={() => {
              setSelectedLayerId(layer.id);
              if (window.innerWidth < 1024) setActivePanel('properties');
            }}
            onUpdateName={(newName) => operations.updateLayer(layer.id, { name: newName })}
            onToggleLock={() => operations.toggleLockById(layer.id)}
            onToggleVisibility={() => operations.toggleLayerVisibility(layer.id)}
            onDuplicate={() => {
              setSelectedLayerId(layer.id);
              operations.duplicateLayer();
            }}
            onDelete={() => operations.removeLayer(layer.id)}
          />
        ))}
      </ReactSortable>

      <div className="flex gap-2 mt-4">
        <button onClick={operations.addNewTextLayer} className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded shadow transition">
          + Text
        </button>
        <button onClick={operations.addImageLayerButton} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded shadow transition">
          + Image
        </button>
      </div>
    </div>
  );
};

export default EditorLayersPanel;