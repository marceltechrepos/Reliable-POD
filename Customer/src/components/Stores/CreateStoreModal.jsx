import React, { useState } from 'react';

const PLATFORMS = [
  { id: 'Shopify', name: 'Shopify Store', color: 'bg-[#96BF48]' },
  { id: 'Etsy', name: 'Etsy Shop', color: 'bg-[#F16521]' },
  { id: 'WooCommerce', name: 'WooCommerce', color: 'bg-[#96588A]' },
  { id: 'Manual Order', name: 'Manual Order', color: 'bg-[#6B7280]' },
];

export default function CreateStoreModal({ open, onClose }) {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [storeName, setStoreName] = useState("");

  if (!open) return null;

  const handleClose = () => {
    setSelectedPlatform(null);
    setStoreName("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Store:", { name: storeName, type: selectedPlatform.id });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
            {selectedPlatform ? "Store Details" : "Select Platform"}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-900 font-bold">✕</button>
        </div>

        <div className="p-8 pt-0">
          {!selectedPlatform ? (
            /* --- LIST VIEW --- */
            <div className="space-y-3">
              {PLATFORMS.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPlatform(p)}
                  className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-900 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${p.color} rounded-xl flex items-center justify-center text-white font-black`}>
                      {p.id[0]}
                    </div>
                    <span className="font-bold text-gray-700 group-hover:text-white transition-colors">{p.name}</span>
                  </div>
                  <span className="text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
                </div>
              ))}
            </div>
          ) : (
            /* --- INPUT VIEW --- */
            <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100">
                <div className={`w-10 h-10 ${selectedPlatform.color} rounded-xl flex items-center justify-center text-white font-black`}>
                  {selectedPlatform.id[0]}
                </div>
                <span className="font-bold text-gray-800">{selectedPlatform.name}</span>
                <button 
                  type="button"
                  onClick={() => setSelectedPlatform(null)} 
                  className="ml-auto text-[10px] font-black text-[#f05a28] uppercase border-b border-[#f05a28]"
                >
                  Change
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Name</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. My Awesome Shop"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f05a28] focus:ring-4 focus:ring-[#f05a28]/5 transition-all"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#f05a28] text-white py-4 rounded-xl font-black uppercase tracking-widest text-[12px] shadow-lg shadow-[#f05a28]/20 hover:bg-black transition-all"
              >
                Create Store
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}