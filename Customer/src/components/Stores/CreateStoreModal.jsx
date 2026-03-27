// import React, { useState } from 'react';

// const PLATFORMS = [
//   { id: 'Shopify', name: 'Shopify Store', color: 'bg-[#96BF48]' },
//   { id: 'Etsy', name: 'Etsy Shop', color: 'bg-[#F16521]' },
//   { id: 'WooCommerce', name: 'WooCommerce', color: 'bg-[#96588A]' },
//   { id: 'Manual Order', name: 'Manual Order', color: 'bg-[#6B7280]' },
// ];

// export default function CreateStoreModal({ open, onClose }) {
//   const [selectedPlatform, setSelectedPlatform] = useState(null);
//   const [storeName, setStoreName] = useState("");

//   if (!open) return null;

//   const handleClose = () => {
//     setSelectedPlatform(null);
//     setStoreName("");
//     onClose();
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("New Store:", { name: storeName, type: selectedPlatform.id });
//     handleClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
//       <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-200">

//         {/* Header */}
//         <div className="p-8 pb-4 flex justify-between items-center">
//           <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
//             {selectedPlatform ? "Store Details" : "Select Platform"}
//           </h2>
//           <button onClick={handleClose} className="text-gray-400 hover:text-gray-900 font-bold">✕</button>
//         </div>

//         <div className="p-8 pt-0">
//           {!selectedPlatform ? (
//             /* --- LIST VIEW --- */
//             <div className="space-y-3">
//               {PLATFORMS.map((p) => (
//                 <div 
//                   key={p.id}
//                   onClick={() => setSelectedPlatform(p)}
//                   className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-900 transition-all duration-300"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className={`w-10 h-10 ${p.color} rounded-xl flex items-center justify-center text-white font-black`}>
//                       {p.id[0]}
//                     </div>
//                     <span className="font-bold text-gray-700 group-hover:text-white transition-colors">{p.name}</span>
//                   </div>
//                   <span className="text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             /* --- INPUT VIEW --- */
//             <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
//               <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100">
//                 <div className={`w-10 h-10 ${selectedPlatform.color} rounded-xl flex items-center justify-center text-white font-black`}>
//                   {selectedPlatform.id[0]}
//                 </div>
//                 <span className="font-bold text-gray-800">{selectedPlatform.name}</span>
//                 <button 
//                   type="button"
//                   onClick={() => setSelectedPlatform(null)} 
//                   className="ml-auto text-[10px] font-black text-[#f05a28] uppercase border-b border-[#f05a28]"
//                 >
//                   Change
//                 </button>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Name</label>
//                 <input 
//                   autoFocus
//                   required
//                   type="text" 
//                   value={storeName}
//                   onChange={(e) => setStoreName(e.target.value)}
//                   placeholder="e.g. My Awesome Shop"
//                   className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f05a28] focus:ring-4 focus:ring-[#f05a28]/5 transition-all"
//                 />
//               </div>

//               <button 
//                 type="submit"
//                 className="w-full bg-[#f05a28] text-white py-4 rounded-xl font-black uppercase tracking-widest text-[12px] shadow-lg shadow-[#f05a28]/20 hover:bg-black transition-all"
//               >
//                 Create Store
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// ==========================================================================

import React, { useState } from 'react';
import { createShopifyStore, createManualStore } from '../../api/store.api';
import { toast } from 'react-toastify';

const PLATFORMS = [
  { id: 'Shopify', name: 'Shopify Store', color: 'bg-[#96BF48]', needsDomain: true },
  { id: 'Etsy', name: 'Etsy Shop', color: 'bg-[#F16521]', needsDomain: false },
  { id: 'WooCommerce', name: 'WooCommerce', color: 'bg-[#96588A]', needsDomain: false },
  { id: 'Manual Order', name: 'Manual Order', color: 'bg-[#6B7280]', needsDomain: false },
];

export default function CreateStoreModal({ open, onClose, onStoreCreated }) {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [storeName, setStoreName] = useState('');
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [generatedApiKey, setGeneratedApiKey] = useState(null);
  const [connecting, setConnecting] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setSelectedPlatform(null);
    setStoreName('');
    setShopifyDomain('');
    setGeneratedApiKey(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedPlatform.id === 'Shopify') {
      // Create Shopify store and generate API key
      try {
        setConnecting(true);
        const response = await createShopifyStore(shopifyDomain);
        
        if (response.success) {
          setGeneratedApiKey(response.data.apiKey);
          toast.success('Store created! Share this API key with your Shopify app');
        } else {
          toast.error(response.message || 'Failed to create store');
        }
      } catch (error) {
        toast.error('Failed to create store');
      } finally {
        setConnecting(false);
      }
    } else {
      // Manual store creation
      try {
        setConnecting(true);
        const response = await createManualStore({ 
          name: storeName, 
          type: selectedPlatform.id 
        });
        
        if (response.success) {
          toast.success(`${selectedPlatform.name} created successfully!`);
          onStoreCreated?.();
          handleClose();
        } else {
          toast.error(response.message || 'Failed to create store');
        }
      } catch (error) {
        toast.error('Failed to create store');
      } finally {
        setConnecting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        
        <div className="p-8 pb-4 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
            {generatedApiKey ? "Store API Key" : (selectedPlatform ? "Store Details" : "Select Platform")}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-900 font-bold">✕</button>
        </div>

        <div className="p-8 pt-0">
          {!selectedPlatform ? (
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
          ) : generatedApiKey ? (
            // Show generated API key
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
                <p className="text-sm font-semibold text-green-800 mb-2">Store Created Successfully!</p>
                <p className="text-xs text-gray-600 mb-3">Share this API key with your Shopify app to complete connection:</p>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <code className="text-sm font-mono text-gray-800 break-all">{generatedApiKey}</code>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedApiKey);
                    toast.success('API Key copied!');
                  }}
                  className="mt-3 text-xs text-[#f05a28] font-semibold"
                >
                  Copy API Key
                </button>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[12px] hover:bg-[#f05a28] transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {selectedPlatform.id === 'Shopify' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Shopify Store Domain
                    </label>
                    <input
                      type="text"
                      required
                      value={shopifyDomain}
                      onChange={(e) => setShopifyDomain(e.target.value)}
                      placeholder="mystore.myshopify.com"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f05a28]"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter your store domain
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Name</label>
                  <input
                    autoFocus
                    required
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. My Awesome Shop"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f05a28]"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={connecting}
                className="w-full bg-[#f05a28] text-white py-4 rounded-xl font-black uppercase tracking-widest text-[12px] shadow-lg hover:bg-black transition-all disabled:opacity-50"
              >
                {connecting ? 'Creating...' : (selectedPlatform.id === 'Shopify' ? 'Generate API Key' : 'Create Store')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}