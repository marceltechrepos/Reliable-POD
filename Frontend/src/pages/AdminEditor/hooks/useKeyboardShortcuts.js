import { useEffect } from "react";

export const useKeyboardShortcuts = ({
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
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const cmd = e.ctrlKey || e.metaKey;

      // allow undo/redo even when typing (makes sense)
      if (cmd && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }
      if (cmd && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
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
          e.preventDefault();
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
  }, [selectedLayerId, layers, updateLayer, removeLayer, duplicateLayer, exportAsImage, toggleLockSelected, handleZoomIn, handleZoomOut, handleZoomReset, handleUndo, handleRedo]);
};