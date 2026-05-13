import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';

const Section = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center justify-between w-full px-3 py-2 text-left text-[12px] font-bold text-gray-700 hover:text-gray-900"
      >
        {title}
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="px-3 pb-3">
          {children}
        </div>
      )}
    </div>
  );
};

const CompactSlider = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '%',
  onChange,
  onCommit
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-gray-500">{label}</span>
      <span className="text-[11px] font-semibold text-gray-700">
        {Math.round(value)}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      onMouseUp={onCommit}
      onTouchEnd={onCommit}
      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f05a28]"
    />
  </div>
);

const CompactNumber = ({
  label,
  value,
  min,
  max,
  step = 0.5,
  onChange,
  onCommit
}) => (
  <div className="space-y-1">
    <label className="text-[11px] text-gray-500">{label}</label>
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      onBlur={onCommit}
      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f05a28]/20 focus:border-[#f05a28] outline-none transition bg-white"
    />
  </div>
);

const LayerProperties = ({ layer, onChange, onAlignHorizontal, onAlignVertical }) => {
  const [width, setWidth] = useState(layer?.width ?? 30);
  const [height, setHeight] = useState(layer?.height ?? 30);
  const [opacity, setOpacity] = useState(layer?.opacity ?? 1);
  const [posX, setPosX] = useState(layer?.positionX ?? 0);
  const [posY, setPosY] = useState(layer?.positionY ?? 0);
  const [rotation, setRotation] = useState(layer?.rotation ?? 0);

  const isTextLayer = layer?.type === "text";
  useEffect(() => {
    setWidth(layer?.width ?? 30);
    setHeight(layer?.height ?? 30);
    setOpacity(layer?.opacity ?? 1);
    setPosX(layer?.positionX ?? 0);
    setPosY(layer?.positionY ?? 0);
    setRotation(layer?.rotation ?? 0);
  }, [layer]);

  const commit = () => {
    onChange({
      width: Number(width),
      height: Number(height),
      opacity: Number(opacity),
      positionX: Number(posX),
      positionY: Number(posY),
      rotation: Number(rotation)
    });
  };

  return (
    <div className="space-y-3">
      <Section title="Layer Identity" defaultOpen={true}>
        <div>
          <label className="text-[11px] text-gray-500 block mb-1">Layer Name</label>
          <input
            type="text"
            placeholder={layer.type === 'text' ? "Text Layer" : "Image Layer"}
            value={layer.name || ""}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f05a28]/20 focus:border-[#f05a28] outline-none transition bg-white"
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="isPlaceholder"
            checked={layer.isPlaceholder || false}
            onChange={(e) => onChange({ isPlaceholder: e.target.checked })}
            className="w-4 h-4 text-[#f05a28] border-gray-300 rounded focus:ring-[#f05a28]"
          />
          <label htmlFor="isPlaceholder" className="text-xs text-gray-700 cursor-pointer">
            Print Area / Placeholder
          </label>
        </div>
      </Section>
      {isTextLayer && (
        <Section title="Text Settings" defaultOpen={true}>
          <div className="space-y-3">
            {/* Text Content (jo likhna hai) */}
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">Text Content</label>
              <textarea
                value={layer.text || ""}
                onChange={(e) => onChange({ text: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f05a28]/20 focus:border-[#f05a28] outline-none transition bg-white resize-none"
                placeholder="Apna text likhein..."
              />
            </div>

            {/* Font Size */}
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">Font Size (px)</label>
              <input
                type="number"
                min={8}
                max={200}
                value={layer.fontSize || 24}
                onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            {/* Text Color */}
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={layer.fill || "#000000"}
                  onChange={(e) => onChange({ fill: e.target.value })}
                  className="w-10 h-10 p-0.5 border border-gray-200 rounded-lg cursor-pointer"
                />
                <span className="text-xs text-gray-500">{layer.fill || "#000000"}</span>
              </div>
            </div>

            {/* Font Family Selection */}
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">Font</label>
              <select
                value={layer.fontFamily || "Arial"}
                onChange={(e) => onChange({ fontFamily: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Impact">Impact</option>
              </select>
            </div>

            {/* Bold / Italic Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange({ fontWeight: layer.fontWeight === "bold" ? "normal" : "bold" })}
                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg border ${layer.fontWeight === "bold"
                  ? "bg-[#f05a28] text-white border-[#f05a28]"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => onChange({ fontStyle: layer.fontStyle === "italic" ? "normal" : "italic" })}
                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg border ${layer.fontStyle === "italic"
                  ? "bg-[#f05a28] text-white border-[#f05a28]"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Italic
              </button>
            </div>

            {/* Wrap Mode Toggle */}
<div>
  <label className="text-[11px] text-gray-500 block mb-1">Wrap Mode</label>
  <div className="flex gap-2">
    <button
      type="button"
      onClick={() => onChange({ wrapMode: 'single' })}
      className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg border ${
        layer.wrapMode === 'single'
          ? 'bg-[#f05a28] text-white border-[#f05a28]'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      Single Line
    </button>
    <button
      type="button"
      onClick={() => onChange({ wrapMode: 'multi' })}
      className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg border ${
        layer.wrapMode !== 'single'
          ? 'bg-[#f05a28] text-white border-[#f05a28]'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      Multi Line
    </button>
  </div>
</div>
          </div>
        </Section>
      )}
      <Section title="Quick Scale" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-3">
          <CompactSlider
            label="Width"
            value={width}
            min={5}
            max={100}
            onChange={setWidth}
            onCommit={commit}
          />
          <CompactSlider
            label="Height"
            value={height}
            min={5}
            max={100}
            onChange={setHeight}
            onCommit={commit}
          />
        </div>
      </Section>

      <Section title="Position" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-3">
          <CompactNumber
            label="X (%)"
            value={posX}
            min={-50}
            max={150}
            step={0.5}
            onChange={setPosX}
            onCommit={commit}
          />
          <CompactNumber
            label="Y (%)"
            value={posY}
            min={-50}
            max={150}
            step={0.5}
            onChange={setPosY}
            onCommit={commit}
          />
        </div>
      </Section>

      <Section title="Visual" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <CompactSlider
            label="Opacity"
            value={opacity * 100}
            min={0}
            max={100}
            step={5}
            unit="%"
            onChange={(val) => setOpacity(val / 100)}
            onCommit={commit}
          />
          <CompactSlider
            label="Rotation"
            value={rotation}
            min={0}
            max={360}
            step={1}
            unit="°"
            onChange={setRotation}
            onCommit={commit}
          />
        </div>
      </Section>


      <Section title="Alignment" defaultOpen={false}>
        <div className="space-y-3">
          <div>
            <div className="text-[11px] text-gray-500 mb-2">Horizontal</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onAlignHorizontal('left')}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border text-xs font-medium transition ${layer?.horizontalAlign === 'left'
                  ? 'bg-[#f05a28] text-white border-[#f05a28]'
                  : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                  }`}
              >
                <AlignLeft size={14} /> Left
              </button>
              <button
                onClick={() => onAlignHorizontal('center')}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border text-xs font-medium transition ${layer?.horizontalAlign === 'center'
                  ? 'bg-[#f05a28] text-white border-[#f05a28]'
                  : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                  }`}
              >
                <AlignCenter size={14} /> Center
              </button>
              <button
                onClick={() => onAlignHorizontal('right')}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border text-xs font-medium transition ${layer?.horizontalAlign === 'right'
                  ? 'bg-[#f05a28] text-white border-[#f05a28]'
                  : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                  }`}
              >
                <AlignRight size={14} /> Right
              </button>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-gray-500 mb-2">Vertical</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onAlignVertical('top')}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border text-xs font-medium transition ${layer?.verticalAlign === 'top'
                  ? 'bg-[#f05a28] text-white border-[#f05a28]'
                  : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                  }`}
              >
                <AlignJustify size={14} className="rotate-90" /> Top
              </button>
              <button
                onClick={() => onAlignVertical('middle')}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border text-xs font-medium transition ${layer?.verticalAlign === 'middle'
                  ? 'bg-[#f05a28] text-white border-[#f05a28]'
                  : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                  }`}
              >
                <AlignCenter size={14} className="rotate-90" /> Mid
              </button>
              <button
                onClick={() => onAlignVertical('bottom')}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border text-xs font-medium transition ${layer?.verticalAlign === 'bottom'
                  ? 'bg-[#f05a28] text-white border-[#f05a28]'
                  : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                  }`}
              >
                <AlignJustify size={14} /> Bottom
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default LayerProperties;