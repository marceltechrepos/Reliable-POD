import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List } from "lucide-react";
import { getcustomerDesignByuserId } from "../api/customerDesign.api";
import { getCustomProductByUserId } from "../api/customerProduct.api";
import { getUserStores } from "../api/store.api";
import { toast } from "react-toastify";

export default function MyProducts() {
  const navigate = useNavigate();
  const [customProducts, setCustomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("card");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [importing, setImporting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const BaseUrl = import.meta.env.VITE_BASE_URL;

  const fetchCustomProducts = async () => {
    try {
      setLoading(true);
      if (user?._id) {
        const data = await getCustomProductByUserId(user._id);
        setCustomProducts(data.data || []);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await getUserStores();
      if (res.success) {
        setStores(res.data);
        if (res.data.length > 0) setSelectedStoreId(res.data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomProducts();
    fetchStores();
  }, [user?._id]);

  const productList = useMemo(() => customProducts || [], [customProducts]);

  console.log(productList , "<<<<<<< productList")

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleImportToShopify = async () => {
    if (selectedProducts.length === 0 || !selectedStoreId) return;
    setImporting(true);
    try {
      const response = await fetch(`${BaseUrl}/api/custom-product/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`

        },

        body: JSON.stringify({
          productIds: selectedProducts,
          storeId: selectedStoreId
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Products imported successfully!")
        setSelectedProducts([]);
        fetchCustomProducts();
      } else {
        toast.error('Import failed: ' + data.message)
      }
    } catch (error) {
      console.error(error);
      toast.error('Error importing products');
    } finally {
      setImporting(false);
    }
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-8 px-4 md:py-12 md:px-8" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-[900] text-gray-900 tracking-tight">Products</h1>
          </div>

          <div className="flex items-center space-x-4">
            {
              stores.length > 0 ? (
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                  disabled={importing}
                >
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-sm text-gray-500">
                  No stores connected
                </span>
              )
            }

            <button
              onClick={handleImportToShopify}
              disabled={selectedProducts.length === 0 || importing || !selectedStoreId}
              className={`px-4 py-2 rounded-lg text-white transition ${selectedProducts.length > 0 && !importing && selectedStoreId
                  ? "bg-[#f05a28] hover:bg-[#e04a18]"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              {importing ? "Importing..." : "Import to Shopify"}
            </button>
          </div>
        </div>

        {productList.length === 0 && (
          <div className="flex justify-center items-center h-64">No Products Found</div>
        )}

        {view === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productList.map((item) => {
              const p = item.baseProduct;
              const isSelected = selectedProducts.includes(item._id);

              const customName = item?.customVariant?.name || p?.productTitle;
              const customDescription = item?.customVariant?.description;
              const customTags = item?.customVariant?.tags || [];

              const displayImage = item?.customerDesign?.finalDesignImage ||
                p?.thumbnail?.url ||
                "https://via.placeholder.com/400x400?text=No+Image";

              return (
                <div key={item._id} className="group relative font-sans">
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-[#f05a28] text-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  {item.importedToShopify && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-3 py-2 rounded z-10">
                      Imported
                    </div>
                  )}

                  <div
                    onClick={() => navigate(`/user/detail-product/${item._id}`, {
                      state: { product: item, fromProducts: true }
                    })}
                    className={`relative bg-white rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer
                      ${isSelected
                        ? "border-[#f05a28] ring-2 ring-[#f05a28]/20"
                        : "border-gray-200 hover:border-[#f05a28]/30 hover:shadow-lg"
                      }`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={displayImage}
                        alt={customName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {item?.customVariant?.enabled && (
                        <div className="absolute top-2 left-2 bg-[#f05a28] text-white text-[10px] font-bold px-2 py-1 rounded">
                          Custom
                        </div>
                      )}
                    </div>

                    <div className="p-3 space-y-2">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2">
                        {customName}
                      </h3>
                      {customDescription && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {stripHtml(customDescription)}
                        </p>
                      )}
                      {customTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {customTags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                          {customTags.length > 3 && (
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              +{customTags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(item._id, e);
                      }}
                      className={`absolute bottom-3 right-3 p-1.5 rounded-full transition-all
                        ${isSelected
                          ? "bg-[#f05a28] text-white"
                          : "bg-white/80 backdrop-blur-sm text-gray-400 hover:bg-[#f05a28] hover:text-white"
                        }`}
                    >
                      {isSelected ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div >
  );
}