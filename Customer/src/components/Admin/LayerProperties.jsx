import React, { useState, useEffect } from "react";

const LayerProperties = ({ layer, onChange, onAlignHorizontal, onAlignVertical }) => {
    const [width, setWidth] = useState(layer?.width ?? 30);
    const [height, setHeight] = useState(layer?.height ?? 30);
    const [opacity, setOpacity] = useState(layer?.opacity ?? 1);
    const [posX, setPosX] = useState(layer?.positionX ?? 0);
    const [posY, setPosY] = useState(layer?.positionY ?? 0);
    const [rotation, setRotation] = useState(layer?.rotation ?? 0);

    // Update local state when layer prop changes
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

    // Handle keyboard input for number fields
    const handleNumberChange = (setter, value) => {
        setter(value);
    };

    return (
        <div className="space-y-4 text-sm">
            {/* Scale */}
            <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-600 block mb-2">SCALE</label>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-12">Width</span>
                    <input
                        type="range"
                        min="5"
                        max="100"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        onMouseUp={commit}
                        onTouchEnd={commit}
                        className="flex-1"
                    />
                    <span className="text-xs font-medium w-12 text-right">{Math.round(width)}%</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500 w-12">Height</span>
                    <input
                        type="range"
                        min="5"
                        max="100"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        onMouseUp={commit}
                        onTouchEnd={commit}
                        className="flex-1"
                    />
                    <span className="text-xs font-medium w-12 text-right">{Math.round(height)}%</span>
                </div>
            </div>

            {/* Opacity */}
            <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-600 block mb-2">OPACITY</label>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={opacity}
                        onChange={(e) => setOpacity(e.target.value)}
                        onMouseUp={commit}
                        onTouchEnd={commit}
                        className="flex-1"
                    />
                    <span className="text-xs font-medium w-12 text-right">{Math.round(opacity * 100)}%</span>
                </div>
            </div>

            {/* Position X/Y */}
            <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-600 block mb-2">POSITION</label>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">X (%)</label>
                        <input
                            type="number"
                            min="-50"
                            max="150"
                            step="0.5"
                            value={Math.round(posX * 10) / 10}
                            onChange={(e) => handleNumberChange(setPosX, e.target.value)}
                            onBlur={commit}
                            className="w-full border rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Y (%)</label>
                        <input
                            type="number"
                            min="-50"
                            max="150"
                            step="0.5"
                            value={Math.round(posY * 10) / 10}
                            onChange={(e) => handleNumberChange(setPosY, e.target.value)}
                            onBlur={commit}
                            className="w-full border rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Rotation */}
            <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-600 block mb-2">ROTATION</label>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={rotation}
                        onChange={(e) => setRotation(e.target.value)}
                        onMouseUp={commit}
                        onTouchEnd={commit}
                        className="flex-1"
                    />
                    <span className="text-xs font-medium w-12 text-right">{Math.round(rotation)}°</span>
                </div>
            </div>

            {/* Alignment */}
            <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-600 block mb-2">ALIGNMENT</label>

                {/* Horizontal */}
                <div className="mb-3">
                    <label className="text-xs text-gray-500 block mb-1">Horizontal</label>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onAlignHorizontal('left')}
                            className={`flex-1 px-2 py-1.5 border rounded text-xs transition ${layer?.horizontalAlign === 'left'
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            Left
                        </button>
                        <button
                            onClick={() => onAlignHorizontal('center')}
                            className={`flex-1 px-2 py-1.5 border rounded text-xs transition ${layer?.horizontalAlign === 'center'
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            Center
                        </button>
                        <button
                            onClick={() => onAlignHorizontal('right')}
                            className={`flex-1 px-2 py-1.5 border rounded text-xs transition ${layer?.horizontalAlign === 'right'
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            Right
                        </button>
                    </div>
                </div>

                {/* Vertical */}
                <div>
                    <label className="text-xs text-gray-500 block mb-1">Vertical</label>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onAlignVertical('top')}
                            className={`flex-1 px-2 py-1.5 border rounded text-xs transition ${layer?.verticalAlign === 'top'
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            Top
                        </button>
                        <button
                            onClick={() => onAlignVertical('middle')}
                            className={`flex-1 px-2 py-1.5 border rounded text-xs transition ${layer?.verticalAlign === 'middle'
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            Middle
                        </button>
                        <button
                            onClick={() => onAlignVertical('bottom')}
                            className={`flex-1 px-2 py-1.5 border rounded text-xs transition ${layer?.verticalAlign === 'bottom'
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            Bottom
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LayerProperties;