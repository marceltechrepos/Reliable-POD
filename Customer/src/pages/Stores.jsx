import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import StoreFilters from "../components/Stores/StoreFilters";
import StoreCard from "../components/Stores/StoreCard";
import StoreListRow from "../components/Stores/StoreListRow";
import CreateStoreModal from "../components/Stores/CreateStoreModal";
import { getUserStores, disconnectStore } from "../api/store.api";

export default function Stores() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [view, setView] = useState("card");
  const [openModal, setOpenModal] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check URL params for Shopify OAuth response
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shopifySuccess = params.get('shopify_success');
    const shopifyError = params.get('shopify_error');

    if (shopifySuccess) {
      toast.success(`Store ${shopifySuccess} connected successfully!`);
      fetchStores();
      // Clean URL
      navigate('/user/stores', { replace: true });
    }
    if (shopifyError) {
      toast.error('Failed to connect Shopify store');
      navigate('/user/stores', { replace: true });
    }
  }, [location]);

  // Fetch stores on mount
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await getUserStores();
      if (response.success) {
        setStores(response.data);
      } else {
        toast.error('Failed to load stores');
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let arr = stores;
    if (search) {
      arr = arr.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (type !== "All") {
      arr = arr.filter(s => s.type === type);
    }
    return arr;
  }, [search, type, stores]);

  const handleStoreClick = (store) => {
    navigate(`/user/stores/${store.id}`, { state: { store } });
  };

  const handleDisconnectStore = async (storeId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to disconnect this store?')) {
      try {
        const response = await disconnectStore(storeId);
        if (response.success) {
          toast.success('Store disconnected successfully');
          fetchStores();
        } else {
          toast.error(response.message || 'Failed to disconnect store');
        }
      } catch (error) {
        toast.error('Failed to disconnect store');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#f05a28] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-8 px-4 md:py-12 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumbs & Header Row */}
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

        {/* Filter Section */}
        <StoreFilters
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
          view={view}
          setView={setView}
        />

        {/* Main Content Area */}
        {filtered.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[40px] py-32 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No Stores Found</h3>
            <p className="text-gray-400 mt-2 max-w-xs font-medium">Click "Create New Store" to get started.</p>
          </div>
        ) : view === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(store => (
              <div key={store.id} className="h-full mt-[20px]">
                <StoreCard
                  store={store}
                  onClick={() => handleStoreClick(store)}
                  onDisconnect={(e) => handleDisconnectStore(store.id, e)}
                />
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
                  onDisconnect={(e) => handleDisconnectStore(store.id, e)}
                />
              ))}
            </div>
          </div>
        )}

        <CreateStoreModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onStoreCreated={fetchStores}
        />
      </div>
    </div>
  );
}