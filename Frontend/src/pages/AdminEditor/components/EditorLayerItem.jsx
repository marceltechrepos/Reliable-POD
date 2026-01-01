import React from "react";

const EditorLayerItem = ({
  layer,
  isSelected,
  onSelect,
  onUpdateName,
  onToggleLock,
  onToggleVisibility,
  onDuplicate,
  onDelete,
}) => {
  const handleDoubleClick = () => {
    const prefill =
      layer.name && layer.name !== ""
        ? layer.name
        : layer.type === "text"
          ? layer.text
          : "Image Layer";
    const newName = prompt("Enter new layer name", prefill);
    if (newName !== null) onUpdateName(newName);
  };

  const getDisplayName = () => {
    if (layer.name && layer.name !== "") return layer.name;
    if (layer.type === "text") return layer.text;
    if (layer.type === "printarea") return layer.name || "Print Area";
    return "Image Layer";
  };

  return (
    <div
      onClick={onSelect}
      className={`w-full flex items-center justify-between p-3 rounded cursor-pointer transition ${
        isSelected
          ? "bg-blue-600 text-white"
          : "bg-gray-700 hover:bg-gray-600 text-gray-200"
      }`}
    >
      <span
        className="drag-handle truncate cursor-move flex-1"
        onDoubleClick={handleDoubleClick}
      >
        {getDisplayName()}
      </span>

      <div className="flex gap-2">
        {/* Lock Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
          className="text-gray-300 hover:text-indigo-300 transition cursor-pointer"
          title={layer.locked ? "Unlock layer (Ctrl+L)" : "Lock layer (Ctrl+L)"}
        >
          {layer.locked ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
              <path d="M8 1a3 3 0 0 0-3 3v3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V4a3 3 0 0 0-3-3z" />
            </svg>
          ) : (
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
            onToggleVisibility();
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
            onDuplicate();
          }}
          className="text-gray-300 hover:text-yellow-400 transition cursor-pointer"
          title="Duplicate Layer (Ctrl+D)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-files" viewBox="0 0 16 16">
            <path d="M13 1H5a1 1 0 0 0-1 1v1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM5 2h8v1H5V2zm-3 2h2v9H2V4zm3 9v-9h6v9H5zm7-1h-2v-1h2v1z" />
          </svg>
        </button>

        {/* Delete Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
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
  );
};

export default EditorLayerItem;