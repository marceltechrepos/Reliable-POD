import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 1. Navigate import kiya
import { PRODUCTS } from "../components/Products/productData";
import { LayoutGrid, List } from "lucide-react";

export default function MyProducts() {
  const navigate = useNavigate(); // 2. Hook initialize kiya
  const { ProductId } = useParams();
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [filterName, setFilterName] = useState("");
  const [sort, setSort] = useState("newest");
  const [discountOnly, setDiscountOnly] = useState(false);
  const [view, setView] = useState("card");
  const [productType, setProductType] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const fontStack = 'ui-sans-serif, system-ui, -apple-system, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

  const productNames = useMemo(() => [...new Set(PRODUCTS.map(p => p.title))], []);

  const filtered = useMemo(() => {
    let arr = [...PRODUCTS];
    if (search) arr = arr.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    if (filterName) arr = arr.filter(p => p.title === filterName);
    if (productType) arr = arr.filter(p => p.type.toLowerCase().includes(productType.toLowerCase()));
    if (discountOnly) arr = arr.filter(p => p.discount);

    if (sort === "newest") arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "oldest") arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return arr;
  }, [search, filterName, sort, discountOnly, productType]);

  const toggleSelect = (id, e) => {
    e.stopPropagation(); // Click ko card tak jane se rokega
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedProducts(filtered.map(p => p.id));
  const selectNone = () => setSelectedProducts([]);

  const tabs = [
    { id: 'all', label: 'All Products', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { id: 'featured', label: 'Featured', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { id: 'new', label: 'New Arrivals', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
  ];

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
        {view === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => {
              const isSelected = selectedProducts.includes(p.id);
              return (
                <div key={p.id} className="group relative font-sans">

                  <div
                    onClick={() => navigate("/user/single-catalogue")} // 3. SIMPLE URL BAGAIR ID KE
                    className={`relative aspect-square bg-white rounded-none overflow-hidden border transition-all duration-500 cursor-pointer
                    ${isSelected ? "border-[#f05a28] ring-1 ring-[#f05a28]" : "border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1"}`}
                  >
                    <div className="relative h-[65%] overflow-hidden bg-[#f3f4f6]">
                      <img src={p.image || "https://via.placeholder.com/400"} alt={p.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    </div>

                    <div className="h-[38%] p-3 flex flex-col justify-between bg-white border-t border-gray-50">
                      <div>
                        <h3 className="text-[13px] font-bold text-gray-900 leading-tight">{p.title}</h3>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-sm font-black text-gray-900">${p.price || '0.00'}</span>
                        <button
                          onClick={(e) => toggleSelect(p.id, e)} // Select logic
                          className={`p-1.5 rounded-md transition-all ${isSelected ? "bg-[#f05a28] text-white" : "bg-gray-100 text-gray-400"}`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                    </div>
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
                {filtered.map(p => (
                  <tr key={p.id} onClick={() => navigate("/user/detail-product")} className="cursor-pointer">
                    <ProductListRow
                      product={p}
                      selected={selectedProducts.includes(p.id)}
                      toggleSelect={(e) => toggleSelect(p.id, e)}
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