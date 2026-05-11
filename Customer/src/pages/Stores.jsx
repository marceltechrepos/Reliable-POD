import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import StoreCard from "../components/Stores/StoreCard";
import CreateStoreModal from "../components/Stores/CreateStoreModal";
import { getUserStores, disconnectStore } from "../api/store.api";
import { getOrders } from "../api/order.api";

export default function Stores() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [stores, setStores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shopifySuccess = params.get('shopify_success');
    const shopifyError = params.get('shopify_error');

    if (shopifySuccess) {
      toast.success(`Store ${shopifySuccess} connected successfully!`);
      fetchStores();
      navigate('/user/stores', { replace: true });
    }
    if (shopifyError) {
      toast.error('Failed to connect Shopify store');
      navigate('/user/stores', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const [storesRes, ordersRes] = await Promise.all([
        getUserStores(),
        getOrders().catch(() => ({ success: false, data: [] }))
      ]);
      
      if (storesRes.success) setStores(storesRes.data);
      else toast.error('Failed to load stores');
      
      if (ordersRes.success) setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return stores;
    return stores.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, stores]);

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
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#3B6D92]/20 border-t-[#3B6D92] rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-bold tracking-wide animate-pulse">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans relative overflow-hidden">

      <div className="max-w-7xl mx-auto py-12 px-6 md:px-10 relative z-10">
        
        {/* FROSTED GLASS HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6 bg-white/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)]">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-white/50 backdrop-blur-md rounded-2xl shadow-sm text-[#3B6D92] border border-white/80">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              Stores & Orders
            </h1>
            <p className="text-slate-600 mt-2 font-semibold text-sm ml-1">Manage connected channels and seamlessly track incoming Shopify orders.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                type="text"
                placeholder="Search stores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-sm font-bold text-slate-800 placeholder-slate-500 outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white/80 transition-all shadow-sm"
              />
            </div>

            {/* Create Button */}
            <button
              onClick={() => setOpenModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#3B6D92]/90 backdrop-blur-xl text-white px-7 py-3.5 rounded-2xl text-sm font-black tracking-wide hover:bg-[#2c526d] shadow-[0_8px_32px_rgba(59,109,146,0.3)] border border-white/20 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
              New Store
            </button>
          </div>
        </div>

        {/* STORE GRID */}
        {filtered.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(31,38,135,0.05)]">
            <div className="w-24 h-24 bg-white/60 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-white/80">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">No Stores Found</h3>
            <p className="text-slate-600 mt-2 font-semibold">Connect a new sales channel to begin syncing orders automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(store => (
              <StoreCard
                key={store.id}
                store={store}
                onClick={() => handleStoreClick(store)}
                onDisconnect={(e) => handleDisconnectStore(store.id, e)}
              />
            ))} 
          </div>
        )}

        {/* FROSTED GLASS ORDER LEDGERS */}
        {filtered.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center gap-4 mb-8 pl-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                Order Ledgers
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300/50 to-transparent"></div>
            </div>

            <div className="space-y-12">
              {filtered.map(store => {
                const storeOrders = orders.filter(o => o.shopify_store_id === store.shopDomain || o.shopify_store_id === store.name);
                
                if (storeOrders.length === 0) return null;

                return (
                  <div key={`orders-${store.id}`} className="bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)] overflow-hidden transition-all hover:shadow-[0_15px_40px_rgba(31,38,135,0.08)]">
                    
                    {/* Glass Ledger Header */}
                    <div className="bg-white/50 backdrop-blur-md px-8 py-6 border-b border-white/60 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/60 text-[#3B6D92] flex items-center justify-center shadow-sm border border-white/80">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight">{store.name}</h3>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{storeOrders.length} Pending Orders</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleStoreClick(store)}
                        className="text-xs font-black text-white bg-[#3B6D92]/90 backdrop-blur-md shadow-md hover:bg-[#2c526d] px-6 py-2.5 rounded-xl transition-all active:scale-95 border border-white/20"
                      >
                        View Store
                      </button>
                    </div>
                    
                    {/* Orders Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                          <tr className="bg-white/30 backdrop-blur-sm">
                            <th className="p-5 pl-8 font-black text-slate-500 text-[10px] uppercase tracking-widest border-b border-white/60">Order</th>
                            <th className="p-5 font-black text-slate-500 text-[10px] uppercase tracking-widest border-b border-white/60">Date</th>
                            <th className="p-5 font-black text-slate-500 text-[10px] uppercase tracking-widest border-b border-white/60">Customer</th>
                            <th className="p-5 font-black text-slate-500 text-[10px] uppercase tracking-widest border-b border-white/60">Total</th>
                            <th className="p-5 pr-8 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right border-b border-white/60">Payment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/40">
                          {storeOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-white/50 transition-colors group">
                              <td className="p-5 pl-8">
                                <span className="font-black text-[#3B6D92] group-hover:text-blue-700 transition-colors cursor-pointer">
                                  {order.order_name || `#${order.order_number}`}
                                </span>
                              </td>
                              <td className="p-5 text-xs font-bold text-slate-600">
                                {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                              <td className="p-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-white/80 text-slate-700 flex items-center justify-center text-xs font-black shadow-sm border border-white/80">
                                    {order.customer?.first_name?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-slate-800">{order.customer?.first_name} {order.customer?.last_name}</p>
                                    <p className="text-[10px] font-bold text-slate-500">{order.customer?.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-5">
                                <span className="text-sm font-black text-slate-800">${parseFloat(order.total_price).toFixed(2)}</span>
                                <span className="text-[9px] font-black text-slate-500 ml-1 uppercase">{order.currency}</span>
                              </td>
                              <td className="p-5 pr-8 text-right">
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] shadow-sm border border-white/50 ${
                                  (order.payment_status || 'pending').toLowerCase() === 'paid' 
                                    ? 'bg-emerald-400/20 text-emerald-700' 
                                    : 'bg-amber-400/20 text-amber-700'
                                }`}>
                                  {order.payment_status || 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {/* Empty State */}
              {filtered.every(store => orders.filter(o => o.shopify_store_id === store.shopDomain || o.shopify_store_id === store.name).length === 0) && (
                <div className="bg-white/30 backdrop-blur-xl border-2 border-dashed border-white/60 rounded-[3rem] py-20 flex flex-col items-center text-center shadow-[0_8px_32px_rgba(31,38,135,0.03)]">
                  <div className="w-20 h-20 bg-white/50 backdrop-blur-md rounded-3xl flex items-center justify-center mb-5 text-slate-400 rotate-12 shadow-sm border border-white/60">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">No Store Orders</h3>
                  <p className="text-slate-600 font-semibold text-sm mt-2">There are no recent Shopify orders synced for your active stores.</p>
                </div>
              )}
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