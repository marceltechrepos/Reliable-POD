import React from 'react';

const getStoreMeta = (type) => {
  switch (type) {
    case 'Shopify': return { bg: 'from-[#96BF48] to-[#79a336]', color: '#fff', icon: 'S' };
    case 'Etsy': return { bg: 'from-[#F16521] to-[#d35400]', color: '#fff', icon: 'E' };
    case 'WooCommerce': return { bg: 'from-[#96588A] to-[#7a426e]', color: '#fff', icon: 'WC' };
    case 'Anywhere POD': return { bg: 'from-[#3B82F6] to-[#1d4ed8]', color: '#fff', icon: 'A' };
    case 'Manual Order': return { bg: 'from-[#6B7280] to-[#374151]', color: '#fff', icon: 'M' };
    default: return { bg: 'from-[#f05a28] to-[#d04a1e]', color: '#fff', icon: 'ST' };
  }
};

export default function StoreCard({ store, onClick }) {
  const meta = getStoreMeta(store.type);

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-[40px] p-1 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all duration-700 cursor-pointer overflow-hidden flex flex-col h-full min-h-[340px]"
    >
      {/* 🔮 Glass Inner Container */}
      <div className="relative z-10 bg-white rounded-[38px] p-7 h-full flex flex-col">
        
        {/* 🚀 Header: Floating Icon & Stats */}
        <div className="flex justify-between items-start mb-8">
          <div className={`w-16 h-16 bg-gradient-to-br ${meta.bg} rounded-[22px] flex items-center justify-center text-white font-[1000] text-2xl shadow-2xl shadow-inner transform group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500`}>
            {meta.icon}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-mono">Live Sync</span>
            </div>
            <p className="text-[11px] font-bold text-gray-300 mt-1 font-mono italic">{store.lastSync || "Just now"}</p>
          </div>
        </div>

        {/* 📝 Name & Type */}
        <div className="mb-8">
          <h3 className="text-2xl font-[1000] text-gray-900 tracking-tighter leading-none mb-2 group-hover:translate-x-1 transition-transform">
            {store.name}
          </h3>
          <div className="flex gap-2">
             <span className="px-3 py-1 bg-gray-50 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest border border-gray-100">
              ID: #{store.id.toString().padStart(3, '0')}
            </span>
             <span className={`px-3 py-1 bg-gradient-to-r ${meta.bg} bg-opacity-10 text-white rounded-full text-[9px] font-black uppercase tracking-widest`}>
              {store.type}
            </span>
          </div>
        </div>

        {/* 📊 Stats Section (The Apple Look) */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
          <div className="bg-[#fcfcfc] border border-gray-50 rounded-[20px] p-3 text-center group-hover:bg-white transition-colors">
            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Items</p>
            <p className="text-sm font-[1000] text-gray-900 font-mono tracking-tighter">{store.products || '0'}</p>
          </div>
          <div className="bg-[#fcfcfc] border border-gray-50 rounded-[20px] p-3 text-center group-hover:bg-white transition-colors">
            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Orders</p>
            <p className="text-sm font-[1000] text-gray-900 font-mono tracking-tighter">{store.orders || '0'}</p>
          </div>
          <div className="bg-[#fcfcfc] border border-gray-50 rounded-[20px] p-3 text-center group-hover:bg-white transition-colors">
            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Sales</p>
            <p className="text-sm font-[1000] text-[#f05a28] font-mono tracking-tighter">${store.revenue || '0'}</p>
          </div>
        </div>

        {/* 🖱️ Interaction Line */}
        <div className="mt-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#f05a28]">Deep Analytics</span>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-[#f05a28] to-transparent rounded-full" />
        </div>
      </div>

      {/* 🎨 Creative Watermark Background */}
      <div className="absolute -right-4 -bottom-4 text-[120px] font-black text-gray-50/50 leading-none select-none italic tracking-tighter group-hover:text-gray-100 transition-colors duration-700">
        {meta.icon}
      </div>

      {/* Background Gradient Blur */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${meta.bg} opacity-[0.03] blur-3xl group-hover:opacity-[0.1] transition-opacity`} />
    </div>
  );
}