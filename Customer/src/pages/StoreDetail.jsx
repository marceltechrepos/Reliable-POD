import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchStoreProducts, syncStoreProducts, exportProducts } from "../api/storeProducts.api";

export default function StoreDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const store = location.state?.store;
  const [activeTab, setActiveTab] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [syncFilter, setSyncFilter] = useState('');

  useEffect(() => {
    const storeId = store?.id || store?._id;
    if (storeId) {
      fetchProducts(storeId);
    } else {
      setLoading(false);
    }
  }, [store]);

  const fetchProducts = async (storeId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStoreProducts(storeId);

      if (data.success && data.data) {
        const transformedProducts = data.data.map(product => ({
          id: product._id,
          name: product.customVariant?.name || product.baseProduct?.productTitle || "Unnamed Product",
          price: product.baseProduct?.Variants?.length
            ? `$${product.baseProduct.Variants[0].basePrice}`
            : "$0",
          image: product.customerDesign?.finalDesignImage,
          description: product.customVariant?.description || product.baseProduct?.description || "No description available",
          variants: product.selectedDefaultVariants || [],
          imported: product.importedToShopify,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          storeId: product.storeId,
          customVariant: product.customVariant,
          baseProduct: product.baseProduct
        }));

        setProducts(transformedProducts);
      } else {
        setError(data.message || "Failed to fetch products");
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error loading products. Please try again.");
      toast.error("Error loading products.");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    const storeId = store?.id || store?._id;
    if (!storeId) return;

    try {
      setLoading(true);
      await syncStoreProducts(storeId);
      await fetchProducts(storeId);
      toast.success('Products synced successfully!');
    } catch (error) {
      toast.error('Failed to sync products');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const storeId = store?.id || store?._id;
    if (!storeId) return;

    try {
      await exportProducts(storeId, filteredProducts);
      toast.success('Products exported successfully!');
    } catch (error) {
      toast.error('Failed to export products');
    }
  };

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
        <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2rem] text-center border border-white/80 shadow-lg">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Store Not Found</h2>
          <button 
            onClick={() => navigate('/user/stores')}
            className="bg-[#3B6D92] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#2c526d] transition-all"
          >
            Back to Stores
          </button>
        </div>
      </div>
    );
  }

  const getStoreMeta = (type) => {
    switch (type) {
      case 'Shopify': return { color: '#96BF48', icon: 'S' };
      case 'Etsy': return { color: '#F16521', icon: 'E' };
      case 'WooCommerce': return { color: '#96588A', icon: 'WC' };
      case 'Anywhere POD': return { color: '#3B82F6', icon: 'A' };
      case 'Manual Order': return { color: '#6B7280', icon: 'M' };
      default: return { color: '#4F46E5', icon: 'ST' };
    }
  };

  const storeMeta = getStoreMeta(store.type);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = !stateFilter ||
      (stateFilter === 'published' && product.imported) ||
      (stateFilter === 'draft' && !product.imported);
    const matchesSync = !syncFilter || syncFilter === 'synced';
    return matchesSearch && matchesState && matchesSync;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? (a.name || '').localeCompare(b.name || '')
        : (b.name || '').localeCompare(a.name || '');
    }
    if (sortBy === 'created') {
      return sortOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'updated') {
      return sortOrder === 'asc'
        ? new Date(a.updatedAt) - new Date(b.updatedAt)
        : new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    return 0;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans relative overflow-hidden">

      <div className="max-w-7xl mx-auto py-12 px-6 md:px-10 relative z-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
          <Link to="/user/dashboard" className="hover:text-[#3B6D92] flex items-center gap-1 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Dashboard
          </Link>
          <span>/</span>
          <Link to="/user/stores" className="hover:text-[#3B6D92] flex items-center gap-1 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Stores
          </Link>
          <span>/</span>
          <span className="text-slate-800">{store.name}</span>
        </nav>

        {/* Header Profile Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 bg-white/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)]">
          <div className="flex items-center gap-6">
            <div 
              className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl shadow-lg border border-white/40 transform hover:scale-105 transition-all"
              style={{ background: `linear-gradient(135deg, ${storeMeta.color}, ${storeMeta.color}dd)` }}
            >
              {storeMeta.icon}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">{store.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-white/60" style={{ backgroundColor: `${storeMeta.color}20`, color: storeMeta.color }}>
                  {store.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-white/60 ${store.validated ? 'bg-emerald-400/20 text-emerald-700' : 'bg-amber-400/20 text-amber-700'}`}>
                  {store.validated ? 'Connected' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button 
              onClick={handleSync}
              disabled={loading}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white/60 hover:bg-white/90 text-[#3B6D92] px-6 py-3 rounded-2xl text-sm font-black tracking-wider transition-all shadow-sm border border-white/80 active:scale-95 disabled:opacity-50"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              {loading ? 'Syncing...' : 'Sync Data'}
            </button>
            <button className="flex items-center justify-center bg-white/60 hover:bg-white/90 text-slate-600 w-12 h-12 rounded-2xl transition-all shadow-sm border border-white/80 active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-indigo-400/20 text-indigo-600 rounded-2xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-800">{products.length}</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Products</p>
          </div>

          <div className="bg-white/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-emerald-400/20 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-800">{store.orders || 0}</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Orders</p>
          </div>

          <div className="bg-white/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-amber-400/20 text-amber-600 rounded-2xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-800">${store.revenue || 0}</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Revenue</p>
          </div>

          <div className="bg-white/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)] flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Last Sync</p>
            <h2 className="text-xl font-black text-slate-800 mb-4">{products.length > 0 ? new Date(products[0]?.updatedAt).toLocaleDateString() : 'Never'}</h2>
            <button onClick={handleSync} disabled={loading} className="text-xs font-black text-[#3B6D92] bg-[#3B6D92]/10 hover:bg-[#3B6D92]/20 px-4 py-2 rounded-xl transition-all">
              Sync Now
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white/40 backdrop-blur-2xl p-2 rounded-2xl border border-white/60 shadow-sm w-fit">
          <button onClick={() => setActiveTab(0)} className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 0 ? 'bg-white text-[#3B6D92] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Products</button>
          <button onClick={() => setActiveTab(1)} className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 1 ? 'bg-white text-[#3B6D92] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Orders</button>
          <button onClick={() => setActiveTab(2)} className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 2 ? 'bg-white text-[#3B6D92] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Analytics</button>
        </div>

        {/* Products Section */}
        {activeTab === 0 && (
          <div className="bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)] p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Products</h2>
                <p className="text-sm font-bold text-slate-500">{products.length} imported products</p>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm font-bold text-slate-800 placeholder-slate-500 outline-none focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                </div>

                <select 
                  value={stateFilter} 
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/20 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="">All States</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>

                <button
                  onClick={handleExport}
                  disabled={products.length === 0}
                  className="flex items-center gap-2 bg-white/60 hover:bg-white/90 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border border-white/80 active:scale-95 disabled:opacity-50 ml-auto md:ml-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Export
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-[#3B6D92]/20 border-t-[#3B6D92] rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/60 bg-white/30 backdrop-blur-md">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-white/40 border-b border-white/60">
                      <th className="p-4 pl-6 font-black text-slate-500 text-[10px] uppercase tracking-widest">Image</th>
                      <th className="p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest cursor-pointer hover:text-slate-800" onClick={() => handleSort('name')}>
                        Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Price</th>
                      <th className="p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">State</th>
                      <th className="p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Sync</th>
                      <th className="p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest cursor-pointer hover:text-slate-800" onClick={() => handleSort('updated')}>
                        Updated {sortBy === 'updated' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-4 pr-6 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {sortedProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">No products found</td>
                      </tr>
                    ) : (
                      sortedProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-white/50 transition-colors group">
                          <td className="p-4 pl-6">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/80 shadow-sm border border-white/80">
                              <img 
                                src={product.image || 'https://via.placeholder.com/50'} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'; }}
                              />
                            </div>
                          </td>
                          <td className="p-4 font-black text-slate-800 max-w-[200px] truncate">{product.name}</td>
                          <td className="p-4 font-black text-slate-700">{product.price}</td>
                          <td className="p-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border border-white/50 shadow-sm ${
                              product.imported ? 'bg-emerald-400/20 text-emerald-700' : 'bg-amber-400/20 text-amber-700'
                            }`}>
                              {product.imported ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-600">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                              Synced
                            </div>
                          </td>
                          <td className="p-4 text-xs font-bold text-slate-500">{formatDate(product.updatedAt)}</td>
                          <td className="p-4 pr-6 text-right">
                            <button className="text-[10px] font-black uppercase tracking-widest text-[#3B6D92] bg-white/60 hover:bg-white border border-white/80 px-4 py-1.5 rounded-lg transition-all shadow-sm">
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Table Footer */}
            {!loading && sortedProducts.length > 0 && (
              <div className="mt-6 flex justify-between items-center text-sm font-bold text-slate-500">
                <span>Showing {sortedProducts.length} of {products.length} products</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}