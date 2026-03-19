import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List } from "lucide-react";
import { getcustomerDesignByuserId } from "../api/customerDesign.api";
import { getCustomProductByUserId } from "../api/customerProduct.api";

export default function MyProducts() {
  const navigate = useNavigate();
  // const [products, setProducts] = useState([]);
  const [customProducts, setCustomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("card");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  console.log(customProducts, "<<<<< customProducts")

  const fontStack = 'ui-sans-serif, system-ui, -apple-system, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

  // useEffect(() => {
  //   const fetchProductsByUserId = async () => {
  //     try {
  //       setLoading(true);
  //       if (user?._id) {
  //         const data = await getcustomerDesignByuserId(user?._id);
  //         setProducts(data);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //       console.log(error, "<<<< error")
  //     }
  //   }

  //   fetchProductsByUserId();
  // }, [user?._id]);
  useEffect(() => {
    const fetchProductsByUserId = async () => {
      try {
        setLoading(true);
        if (user?._id) {
          const data = await getCustomProductByUserId(user?._id);
          setCustomProducts(data.data || []);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error, "<<<< error")
      }
    }

    fetchProductsByUserId();
  }, [user?._id]);

  // const productList = useMemo(() => {
  //   return products
  //     ?.map(d => d.product)
  //     .filter(Boolean) || [];
  // }, [products]);

  const productList = useMemo(() => {
    return customProducts || [];
  }, [customProducts]);

  const filtered = productList;

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }

  const toggleSelect = (id, e) => {
    e.stopPropagation(); // Click ko card tak jane se rokega
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-8 px-4 md:py-12 md:px-8" style={{ fontFamily: fontStack }}>
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-[900] text-gray-900 tracking-tight">Products</h1>
          </div>

          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setView("card")}
              className={`p-2 rounded-lg transition-all ${view === "card" ? "bg-white shadow-sm text-[#f05a28]" : "text-gray-400"}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white shadow-sm text-[#f05a28]" : "text-gray-400"}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}

        {
          filtered?.length === 0 && (
            <div className="flex justify-center items-center h-64">
              No Product Found
              </div>
          )
        }
        {view === "card" ? (
          // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          //   {filtered?.map((item) => {
          //     const p = item.baseProduct;
          //     const isSelected = selectedProducts.includes(item?._id);
          //     return (
          //       <div key={item._id} className="group relative font-sans">

          //         <div
          //           onClick={() => navigate(`/user/single-catalogue/${p?._id}`, {
          //             state: { product: item }
          //           })}
          //           className={`relative aspect-square bg-white rounded-none overflow-hidden border transition-all duration-500 cursor-pointer
          //           ${isSelected ? "border-[#f05a28] ring-1 ring-[#f05a28]" : "border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1"}`}
          //         >
          //           <div className="relative h-[65%] overflow-hidden bg-[#f3f4f6]">
          //             <img src={item?.selectedMockup?.mockupImage.url || p?.thumbnail?.url || "https://via.placeholder.com"} alt={p?.productTitle} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          //           </div>

          //           <div className="h-[38%] p-3 flex flex-col justify-between bg-white border-t border-gray-50">
          //             <div>
          //               <h3 className="text-[13px] font-bold text-gray-900 leading-tight">{item?.customVariant?.name || p?.productTitle}</h3>
          //             </div>
          //             <div className="flex items-end justify-between">
          //               {/* <span className="text-sm font-black text-gray-900">${p?.Variants?.[0]?.basePrice || '0.00'}</span> */}
          //               <span className="text-start font-black text-gray-700">${item?.customVariant?.description
          //               }</span>
          //               <button
          //                 onClick={(e) => toggleSelect(item._id, e)} // Select logic
          //                 className={`p-1.5 rounded-md transition-all ${isSelected ? "bg-[#f05a28] text-white" : "bg-gray-100 text-gray-400"}`}
          //               >
          //                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          //               </button>
          //             </div>
          //           </div>
          //         </div>
          //       </div>
          //     );
          //   })}
          // </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered?.map((item) => {
              const p = item.baseProduct;
              const isSelected = selectedProducts.includes(item?._id);

              // Custom variant data
              const customName = item?.customVariant?.name || p?.productTitle;
              const customDescription = item?.customVariant?.description;
              const customTags = item?.customVariant?.tags || [];

              // Product image
              const displayImage = item?.selectedMockup?.mockupImage?.url ||
                p?.thumbnail?.url ||
                "https://via.placeholder.com/400x400?text=No+Image";

              return (
                <div
                  key={item._id}
                  className="group relative font-sans"
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-[#f05a28] text-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  {/* Main Card */}
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
                    {/* Image Container - 3:4 Aspect Ratio */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={displayImage}
                        alt={customName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Custom Variant Badge */}
                      {item?.customVariant?.enabled && (
                        <div className="absolute top-2 left-2 bg-[#f05a28] text-white text-[10px] font-bold px-2 py-1 rounded">
                          Custom
                        </div>
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="p-3 space-y-2">
                      {/* Name */}
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2">
                        {customName}
                      </h3>

                      {/* Description */}
                      {customDescription && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {customDescription}
                        </p>
                      )}

                      {/* Tags */}
                      {customTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {customTags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                            >
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

                    {/* Select Button - Small and Subtle */}
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
        ) : (
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-4">
            {/* List View logic */}
            <table className="w-full">
              <tbody>
                {filtered.map(item => (
                  <tr key={item_id} onClick={() => navigate("/user/detail-product")} className="cursor-pointer">

                    <ProductListRow
                      product={p}
                      selected={selectedProducts.includes(item.id)}
                      toggleSelect={(e) => toggleSelect(item.id, e)}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}