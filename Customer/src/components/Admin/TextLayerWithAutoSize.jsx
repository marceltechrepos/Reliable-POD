import React, { useRef, useEffect } from 'react';

const TextLayerWithAutoSize = ({ 
  layer, 
  pixelValues, 
  printAreaId, 
  containerSizes, 
  updateLayerLocalAndMaybeServer, 
  globalIndex, 
  selectedLayerIndex 
}) => {
  const textRef = useRef(null);
  const prevText = useRef(layer.text);
  const prevFontSize = useRef(layer.fontSize);
  const prevWrapMode = useRef(layer.wrapMode);
  const round2 = (v) => Math.round((v + Number.EPSILON) * 100) / 100;


  useEffect(() => {
    const container = containerSizes[printAreaId];
    if (!container || !textRef.current) return;

    const el = textRef.current;
    const cw = container.width;
    const ch = container.height;

    // Avoid re‑size while user is dragging (selectedLayerIndex check)
    if (globalIndex !== selectedLayerIndex) return;

    // Measure real size of the text
    const scrollWidth = el.scrollWidth;
    const scrollHeight = el.scrollHeight;

    // Convert to percentages (based on print‑area size)
    const newWidthPct = Math.min(100, (scrollWidth / cw) * 100);
    const newHeightPct = Math.min(100, (scrollHeight / ch) * 100);

    // Only update if dimensions really changed
    if (
      Math.abs(layer.width - newWidthPct) > 0.5 ||
      Math.abs(layer.height - newHeightPct) > 0.5
    ) {
      updateLayerLocalAndMaybeServer(globalIndex, {
        width: round2(newWidthPct),
        height: round2(newHeightPct),
      }, true);
    }
  }, [
    layer.text, 
    layer.fontSize, 
    layer.wrapMode, 
    layer.fontFamily, 
    layer.fontWeight, 
    layer.fontStyle, 
    containerSizes[printAreaId],
    globalIndex,
    selectedLayerIndex
  ]);

  return (
    <div
      ref={textRef}
      className="w-full h-full flex items-center justify-center pointer-events-auto"
      style={{
        transform: `rotate(${layer.rotation || 0}deg)`,
        color: layer.fill || "#000000",
        fontSize: `${layer.fontSize || 24}px`,
        fontFamily: layer.fontFamily || "Arial",
        fontWeight: layer.fontWeight || "normal",
        fontStyle: layer.fontStyle || "normal",
        textAlign: layer.align || "center",
        lineHeight: layer.lineHeight || 1.2,
        whiteSpace: layer.wrapMode === 'single' ? 'nowrap' : 'pre-wrap',
        wordBreak: layer.wrapMode === 'single' ? 'normal' : 'break-word',
        overflow: layer.wrapMode === 'single' ? 'hidden' : 'visible',
        textDecoration: layer.textDecoration || "none",
        letterSpacing: `${layer.letterSpacing || 0}px`,
        // ensure width/height are flexible for measurement
        width: 'auto',      // IMPORTANT: override Rnd's fixed width
        height: 'auto',     // so the text can expand
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    >
      {layer.text || "Your Text"}
    </div>
  );
};

export default TextLayerWithAutoSize;