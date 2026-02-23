import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DynamicDesignTool = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProduct = location.state?.product;

  const [layers, setLayers] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [draggingId, setDraggingId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Initial Product Layer Setup
  useEffect(() => {
    if (selectedProduct) {
      const initialLayer = {
        id: 'base-product',
        type: 'image',
        name: `BASE: ${selectedProduct.title.toUpperCase()}`,
        url: selectedProduct.image,
        x: 100, y: 100,
        isBase: true,
        width: 250 // Base product thoda bada dikhega
      };
      setLayers([initialLayer]);
    }
  }, [selectedProduct]);

  // --- Drag & Drop Logic Start ---
  const handleMouseDown = (e, id) => {
    const layer = layers.find(l => l.id === id);
    if (!layer) return;

    setDraggingId(id);
    setOffset({
      x: e.clientX - layer.x,
      y: e.clientY - layer.y
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingId) return;

    setLayers(prevLayers => prevLayers.map(layer => {
      if (layer.id === draggingId) {
        return {
          ...layer,
          x: e.clientX - offset.x,
          y: e.clientY - offset.y
        };
      }
      return layer;
    }));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };
  // --- Drag & Drop Logic End ---

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newLayer = {
          id: Date.now(),
          type: 'image',
          name: `UPLOADED IMAGE - ${layers.length}`,
          url: event.target.result,
          x: 150, y: 150,
          width: 120
        };
        setLayers(prev => [...prev, newLayer]); // Nayi image upar aayegi
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextLayer = () => {
    const text = prompt("Enter your text:", "New Text");
    if (text) {
      const newLayer = {
        id: Date.now(),
        type: 'text',
        name: `TEXT LAYER - ${layers.length}`,
        content: text,
        x: 150, y: 150,
      };
      setLayers(prev => [...prev, newLayer]);
    }
  };

  const deleteLayer = (id) => {
    setLayers(layers.filter(l => l.id !== id));
  };

  return (
    <div 
      className="flex flex-col lg:flex-row gap-6 p-6 bg-[#F8FAFC] min-h-screen font-sans select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      
      {/* LEFT: Controls */}
      <div className="w-full lg:w-[420px] space-y-4">
        <button 
          onClick={() => navigate(-1)} 
          className="text-[10px] font-bold text-gray-400 mb-2 uppercase hover:text-black transition-colors"
        >
          ← Back to Products
        </button>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-[11px] font-black text-gray-400 uppercase mb-4 tracking-widest">Design Tools</h4>
          
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center p-3 border-2 border-[#199d71] rounded-xl hover:bg-green-50 transition-colors">
              <span className="text-lg mb-1">🖼️</span>
              <span className="text-[9px] font-bold text-[#199d71] uppercase">Add Image</span>
            </button>
            <button onClick={addTextLayer} className="flex flex-col items-center p-3 border-2 border-[#199d71] rounded-xl hover:bg-green-50 transition-colors">
              <span className="text-lg mb-1 font-serif">A</span>
              <span className="text-[9px] font-bold text-[#199d71] uppercase">Add Text</span>
            </button>
            <label className="flex flex-col items-center p-3 border-2 border-[#199d71] rounded-xl hover:bg-green-50 cursor-pointer transition-colors">
              <span className="text-lg mb-1">🖌️</span>
              <span className="text-[9px] font-bold text-[#199d71] uppercase">BG Color</span>
              <input type="color" className="hidden" onChange={(e) => setBgColor(e.target.value)} />
            </label>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
        </div>

        {/* Layer List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#199d71] p-3 text-white text-[10px] font-bold uppercase tracking-widest">Manage Layers</div>
          <div className="max-h-[350px] overflow-y-auto divide-y divide-gray-50">
            {layers.slice().reverse().map((layer) => ( // Reverse taaki top layer upar dikhe list mein
              <div key={layer.id} className={`p-3 flex items-center justify-between hover:bg-gray-50 transition-all ${draggingId === layer.id ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center gap-3">
                   <div className={`w-1 h-6 rounded-full ${layer.isBase ? 'bg-orange-500' : 'bg-blue-500'}`} />
                   <span className="text-[10px] font-bold text-gray-700 uppercase truncate w-40">{layer.name}</span>
                </div>
                {!layer.isBase && (
                  <button onClick={() => deleteLayer(layer.id)} className="text-[9px] font-black text-red-400 hover:text-red-600 uppercase">Delete</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Canvas Area */}
      <div className="flex-1 bg-white border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden">
        <div 
          ref={canvasRef}
          className="w-full max-w-[500px] aspect-square border-2 border-red-500 relative bg-white shadow-2xl overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          {layers.map((layer) => (
            <div 
              key={layer.id}
              onMouseDown={(e) => handleMouseDown(e, layer.id)}
              style={{ 
                position: 'absolute', 
                left: `${layer.x}px`, 
                top: `${layer.y}px`, 
                cursor: draggingId === layer.id ? 'grabbing' : 'grab',
                zIndex: layer.isBase ? 1 : 10 
              }}
              className={`group transition-shadow ${draggingId === layer.id ? 'ring-2 ring-blue-400 ring-offset-2' : 'hover:outline hover:outline-1 hover:outline-blue-300'}`}
            >
              {layer.type === 'image' ? (
                <img 
                  src={layer.url} 
                  alt="layer" 
                  style={{ width: layer.width ? `${layer.width}px` : '120px' }}
                  className="block h-auto pointer-events-none" 
                />
              ) : (
                <span className="text-2xl font-black uppercase whitespace-nowrap px-2 pointer-events-none">
                  {layer.content}
                </span>
              )}
            </div>
          ))}

          {/* Canvas Labels */}
          <div className="absolute bottom-4 w-full text-center px-6 pointer-events-none">
            <p className="text-[9px] font-black text-gray-800 uppercase bg-white/80 py-1 inline-block px-2 shadow-sm border border-gray-100">
              {selectedProduct ? `Editing: ${selectedProduct.title}` : "Custom Design Mode"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicDesignTool;