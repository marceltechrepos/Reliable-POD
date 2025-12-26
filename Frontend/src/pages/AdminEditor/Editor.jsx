// import React, { useState, useEffect } from 'react';

// function Editor() {
//     const [mockup, setMockup] = useState(null);

//     useEffect(() => {
//         const savedMockup = localStorage.getItem('mockupToEdit');
//         if (savedMockup) {
//             setMockup(JSON.parse(savedMockup));
//         }
//     }, []);

//     return (
//         <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
//             {/* Header */}
//             <header className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
//                 <h1 className="text-2xl font-bold text-blue-400">Mockup Editor</h1>
//                 <button
//                     className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium shadow-md transition duration-200"
//                     onClick={() => console.log('Save clicked')}
//                 >
//                     Save
//                 </button>
//             </header>

//             {/* Main Editor Area */}
//             <main className="flex flex-1 flex-col lg:flex-row">
//                 {/* Left Toolbar */}
//                 <div className="w-full lg:w-64 bg-gray-800 p-6 space-y-6 flex-shrink-0">
//                     <h2 className="text-xl font-semibold text-gray-300 mb-4">Tools</h2>
//                     <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-200 shadow">
//                         Add Text
//                     </button>
//                     <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-200 shadow">
//                         Rotate
//                     </button>
//                     <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-200 shadow">
//                         Scale
//                     </button>
//                     <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-200 shadow">
//                         Filters
//                     </button>
//                 </div>

//                 {/* Editor Canvas */}
//                 <div className="flex-1 flex items-center justify-center bg-gray-700 mx-4 my-4 lg:my-0 rounded-xl relative overflow-hidden">
//                     {mockup ? (
//                         <img
//                             src={mockup.url}
//                             alt={mockup.title}
//                             className="max-w-full max-h-full object-contain rounded-xl shadow-lg border border-gray-600"
//                         />
//                     ) : (
//                         <span className="text-gray-400 text-lg">No mockup selected</span>
//                     )}
//                 </div>

//                 {/* Right Properties Sidebar */}
//                 <div className="w-full lg:w-64 bg-gray-800 p-6 space-y-6 flex-shrink-0">
//                     <h2 className="text-xl font-semibold text-gray-300 mb-4">Properties</h2>
//                     {mockup ? (
//                         <div className="space-y-4">
//                             <div>
//                                 <p className="text-gray-400 font-medium">Title:</p>
//                                 <p className="text-white font-semibold">{mockup.title}</p>
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 font-medium">Dimensions:</p>
//                                 <p className="text-white font-semibold">{mockup.dimensions}</p>
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 font-medium">Category:</p>
//                                 <p className="text-white font-semibold">{mockup.category}</p>
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 font-medium">Preview:</p>
//                                 <div className="bg-gray-600 rounded p-2">
//                                     <img
//                                         src={mockup.url}
//                                         alt={mockup.title}
//                                         className="w-full h-32 object-cover rounded"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     ) : (
//                         <p className="text-gray-400">Select a mockup to edit</p>
//                     )}
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default Editor;



// ==========================================================================================================

// import React, { useState, useEffect } from "react";
// import { Rnd } from "react-rnd";

// function Editor() {
//     const [mockup, setMockup] = useState(null);
//     const [layers, setLayers] = useState([]);
//     const [selectedLayerId, setSelectedLayerId] = useState(null);

//     useEffect(() => {
//         const savedMockup = localStorage.getItem("mockupToEdit");
//         if (savedMockup) {
//             const parsed = JSON.parse(savedMockup);
//             setMockup(parsed);
//             setLayers([
//                 {
//                     id: "layer-1",
//                     type: "image",
//                     src: parsed.url,
//                     x: 50,
//                     y: 50,
//                     width: 300,
//                     height: 300,
//                     rotation: 0,
//                 },
//             ]);
//         }
//     }, []);

//     const addTextLayer = () => {
//         const newLayer = {
//             id: `layer-${Date.now()}`,
//             type: "text",
//             text: "New Text",
//             x: 100,
//             y: 100,
//             width: 150,
//             height: 50,
//             rotation: 0,
//             fontSize: 18,
//             color: "#ffffff",
//         };
//         setLayers((prev) => [...prev, newLayer]);
//         setSelectedLayerId(newLayer.id);
//     };

//     const updateLayer = (id, updates) => {
//         setLayers((prev) =>
//             prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
//         );
//     };

//     const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);

//     return (
//         <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
//             {/* Header */}
//             <header className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
//                 <h1 className="text-2xl font-bold text-blue-400">Mockup Editor</h1>
//                 <button
//                     className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium shadow-md transition duration-200"
//                     onClick={() => console.log({ layers })}
//                 >
//                     Save
//                 </button>
//             </header>

//             {/* Main Editor Area */}
//             <main className="flex flex-1 flex-col lg:flex-row">
//                 {/* Left Toolbar */}
//                 <div className="w-full lg:w-64 bg-gray-800 p-6 space-y-6 flex-shrink-0">
//                     <h2 className="text-xl font-semibold text-gray-300 mb-4">Tools</h2>
//                     <button
//                         onClick={addTextLayer}
//                         className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-200 shadow"
//                     >
//                         Add Text
//                     </button>
//                 </div>

//                 {/* Editor Canvas */}
//                 <div className="flex-1 flex items-center justify-center bg-gray-700 mx-4 my-4 lg:my-0 rounded-xl relative overflow-hidden">
//                     {mockup ? (
//                         <div className="relative w-full h-full flex items-center justify-center">
//                             {/* Mockup Image */}
//                             <img
//                                 src={mockup.url}
//                                 alt={mockup.title}
//                                 className="max-w-full max-h-full object-contain rounded-xl shadow-lg border border-gray-600"
//                             />

//                             {/* Layers */}
//                             {layers.map((layer) => (
//                                 <Rnd
//                                     key={layer.id}
//                                     size={{ width: layer.width, height: layer.height }}
//                                     position={{ x: layer.x, y: layer.y }}
//                                     onDragStop={(e, d) => updateLayer(layer.id, { x: d.x, y: d.y })}
//                                     onResizeStop={(e, direction, ref, delta, position) =>
//                                         updateLayer(layer.id, {
//                                             width: parseInt(ref.style.width),
//                                             height: parseInt(ref.style.height),
//                                             ...position,
//                                         })
//                                     }
//                                     style={{
//                                         border:
//                                             selectedLayerId === layer.id ? "2px solid #3b82f6" : "1px dashed #ccc",
//                                         display: "flex",
//                                         alignItems: "center",
//                                         justifyContent: "center",
//                                         background:
//                                             layer.type === "text" ? "transparent" : "transparent",
//                                     }}
//                                     onClick={() => setSelectedLayerId(layer.id)}
//                                 >
//                                     {layer.type === "text" ? (
//                                         <span
//                                             style={{
//                                                 fontSize: layer.fontSize,
//                                                 color: layer.color,
//                                                 fontWeight: "bold",
//                                             }}
//                                         >
//                                             {layer.text}
//                                         </span>
//                                     ) : (
//                                         <img
//                                             src={layer.src}
//                                             alt="layer"
//                                             className="w-full h-full object-contain"
//                                         />
//                                     )}
//                                 </Rnd>
//                             ))}
//                         </div>
//                     ) : (
//                         <span className="text-gray-400 text-lg">No mockup selected</span>
//                     )}
//                 </div>

//                 {/* Right Properties Sidebar */}
//                 <div className="w-full lg:w-64 bg-gray-800 p-6 space-y-6 flex-shrink-0">
//                     <h2 className="text-xl font-semibold text-gray-300 mb-4">Properties</h2>
//                     {selectedLayer ? (
//                         <div className="space-y-4">
//                             {selectedLayer.type === "text" && (
//                                 <>
//                                     <div>
//                                         <p className="text-gray-400 font-medium">Text:</p>
//                                         <input
//                                             className="w-full p-2 rounded bg-gray-700 text-white"
//                                             value={selectedLayer.text}
//                                             onChange={(e) =>
//                                                 updateLayer(selectedLayer.id, { text: e.target.value })
//                                             }
//                                         />
//                                     </div>
//                                     <div>
//                                         <p className="text-gray-400 font-medium">Font Size:</p>
//                                         <input
//                                             type="number"
//                                             className="w-full p-2 rounded bg-gray-700 text-white"
//                                             value={selectedLayer.fontSize}
//                                             onChange={(e) =>
//                                                 updateLayer(selectedLayer.id, { fontSize: parseInt(e.target.value) })
//                                             }
//                                         />
//                                     </div>
//                                     <div>
//                                         <p className="text-gray-400 font-medium">Color:</p>
//                                         <input
//                                             type="color"
//                                             className="w-full h-10 p-1 rounded"
//                                             value={selectedLayer.color}
//                                             onChange={(e) =>
//                                                 updateLayer(selectedLayer.id, { color: e.target.value })
//                                             }
//                                         />
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     ) : (
//                         <p className="text-gray-400">Select a layer to edit</p>
//                     )}
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default Editor;


// ====================================================================================

import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

function Editor() {
  const [mockup, setMockup] = useState(null);
  const [layers, setLayers] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState(null);

  useEffect(() => {
    const savedMockup = localStorage.getItem("mockupToEdit");
    if (savedMockup) {
      const parsed = JSON.parse(savedMockup);
      setMockup(parsed);
      setLayers([
        {
          id: "layer-1",
          type: "image",
          src: parsed.url,
          x: 50,
          y: 50,
          width: 300,
          height: 300,
          rotation: 0,
        },
      ]);
      setSelectedLayerId("layer-1");
    }
  }, []);

  // Add new text layer
  const addNewTextLayer = () => {
    const newLayer = {
      id: `layer-${Date.now()}`,
      type: "text",
      text: "New Text",
      x: 100,
      y: 100,
      width: 150,
      height: 50,
      rotation: 0,
      fontSize: 18,
      color: "#ffffff",
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const updateLayer = (id, updates) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  };

  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-blue-400">Mockup Editor</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium shadow-md transition duration-200"
          onClick={() => console.log({ layers })}
        >
          Save
        </button>
      </header>

      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Left Toolbar */}
        <div className="w-full lg:w-64 bg-gray-800 p-6 space-y-4 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">Layers</h2>
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setSelectedLayerId(layer.id)}
              className={`w-full py-2 rounded shadow text-left px-2 transition ${
                selectedLayerId === layer.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
              }`}
            >
              {layer.type === "text" ? layer.text : "Image Layer"}
            </button>
          ))}
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 flex items-center justify-center bg-gray-700 mx-4 my-4 lg:my-0 rounded-xl relative overflow-hidden">
          {mockup ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Mockup Image */}
              <img
                src={mockup.url}
                alt={mockup.title}
                className="max-w-full max-h-full object-contain rounded-xl shadow-lg border border-gray-600"
              />

              {/* Layers */}
              {layers.map((layer) => (
                <Rnd
                  key={layer.id}
                  size={{ width: layer.width, height: layer.height }}
                  position={{ x: layer.x, y: layer.y }}
                  onDragStop={(e, d) =>
                    updateLayer(layer.id, { x: d.x, y: d.y })
                  }
                  onResizeStop={(e, direction, ref, delta, position) =>
                    updateLayer(layer.id, {
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      ...position,
                    })
                  }
                  style={{
                    border:
                      selectedLayerId === layer.id
                        ? "2px solid #3b82f6"
                        : "1px dashed #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "move",
                  }}
                  onClick={() => setSelectedLayerId(layer.id)}
                >
                  {layer.type === "text" ? (
                    <span
                      style={{
                        fontSize: layer.fontSize,
                        color: layer.color,
                        fontWeight: "bold",
                      }}
                    >
                      {layer.text}
                    </span>
                  ) : (
                    <img
                      src={layer.src}
                      alt="layer"
                      className="w-full h-full object-contain"
                    />
                  )}
                </Rnd>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 text-lg">No mockup selected</span>
          )}
        </div>

        {/* Right Properties Sidebar */}
        <div className="w-full lg:w-64 bg-gray-800 p-6 space-y-6 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">Properties</h2>

          {/* New Text Button */}
          <button
            onClick={addNewTextLayer}
            className="w-full py-2 bg-green-600 hover:bg-green-700 rounded shadow mb-4"
          >
            + Add New Text
          </button>

          {/* Selected Layer Properties */}
          {selectedLayer ? (
            <div className="space-y-4">
              {selectedLayer.type === "text" && (
                <>
                  <div>
                    <p className="text-gray-400 font-medium">Text:</p>
                    <input
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      value={selectedLayer.text}
                      onChange={(e) =>
                        updateLayer(selectedLayer.id, { text: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Font Size:</p>
                    <input
                      type="number"
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      value={selectedLayer.fontSize}
                      onChange={(e) =>
                        updateLayer(selectedLayer.id, {
                          fontSize: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Color:</p>
                    <input
                      type="color"
                      className="w-full h-10 p-1 rounded"
                      value={selectedLayer.color}
                      onChange={(e) =>
                        updateLayer(selectedLayer.id, { color: e.target.value })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Select a layer to edit</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Editor;

