import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StoreFilters from "../components/Stores/StoreFilters";
import StoreCard from "../components/Stores/StoreCard";
import StoreListRow from "../components/Stores/StoreListRow";
import CreateStoreModal from "../components/Stores/CreateStoreModal";
import { STORES } from "../components/Stores/dummyStores";

export default function Stores() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [view, setView] = useState("card");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    let arr = STORES;
    if (search) arr = arr.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    if (type !== "All") arr = arr.filter(s => s.type === type);
    return arr;
  }, [search, type]);

  const handleStoreClick = (store) => {
    navigate(`/user/stores/${store.id}`, { state: { store } });
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-8 px-4 md:py-12 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* 🧭 Breadcrumbs & Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="space-y-2">
            <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              <span className="hover:text-[#f05a28] cursor-pointer transition-colors" onClick={() => navigate('/user/dashboard')}>Dashboard</span>
              <span>/</span>
              <span className="text-gray-900">Stores</span>
            </nav>
            <h1 className="text-4xl font-[1000] text-gray-900 tracking-tight">
              Stores Management
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              You have <span className="text-[#f05a28] font-bold">{filtered.length} active stores</span> in your network
            </p>
          </div>

          <button 
            onClick={() => setOpenModal(true)}
            className="bg-gray-900 text-white px-8 py-4 rounded-[20px] text-[13px] font-black uppercase tracking-widest hover:bg-[#f05a28] transition-all duration-500 shadow-xl shadow-gray-200 hover:shadow-[#f05a28]/20 group flex items-center gap-3"
          >
            <span>Create New Store</span>
            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* 🔍 Premium Filter Section */}
       <div className="flex flex-col md:flex-row items-center gap-4 p-2 bg-white rounded-[28px]">
      
      {/* 🔍 Dynamic Search Bar */}
      <div className="relative flex-1 w-full group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400 group-focus-within:text-[#f05a28] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search your stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-50/50 border-none focus:ring-2 focus:ring-[#f05a28]/10 rounded-[22px] py-3.5 pl-12 pr-4 text-sm font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-bold transition-all"
        />
      </div>

      {/* 📂 Type Filter Dropdown */}
      <div className="relative w-full md:w-48">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full appearance-none bg-gray-50/50 border-none focus:ring-2 focus:ring-[#f05a28]/10 rounded-[22px] py-3.5 px-6 text-[11px] font-[1000] uppercase tracking-widest text-gray-700 cursor-pointer transition-all"
        >
          <option value="All">All Platforms</option>
          <option value="Shopify">Shopify</option>
          <option value="Etsy">Etsy</option>
          <option value="WooCommerce">WooCommerce</option>
          <option value="Manual Order">Manual</option>
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

     
      <div className="flex bg-gray-100/80 p-1.5 rounded-[22px] gap-1 shadow-inner">
        <button
          onClick={() => setView('card')}
          className={`p-2.5 rounded-[18px] transition-all duration-300 ${
            view === 'card' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          onClick={() => setView('list')}
          className={`p-2.5 rounded-[18px] transition-all duration-300 ${
            view === 'list' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

        {/* 📦 Main Content Area */}
        {filtered.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[40px] py-32 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No Stores Found</h3>
            <p className="text-gray-400 mt-2 max-w-xs font-medium">Try adjusting your filters or create a new store to get started.</p>
          </div>
        ) : (
          <div className={`transition-all duration-700 ${view === "card" ? "opacity-100" : "opacity-100"}`}>
            {view === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map(store => (
                  <div key={store.id} className="h-full mt-[20px]">
                    <StoreCard store={store} onClick={() => handleStoreClick(store)} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {filtered.map(store => (
                    <StoreListRow 
                      key={store.id} 
                      store={store} 
                      onClick={() => handleStoreClick(store)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <CreateStoreModal open={openModal} onClose={() => setOpenModal(false)} />
      </div>
    </div>
  );
}