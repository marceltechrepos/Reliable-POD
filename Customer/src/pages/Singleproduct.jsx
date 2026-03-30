import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ShoppingBag, Edit3, Copy, Archive, RefreshCw, Download, Plus, X, Layout
} from "lucide-react";
import { getCustomProductById } from "../api/customerProduct.api";
import image from "../assets/image/dummy.jpg";

const SingleProduct = () => {
  const navigate = useNavigate();
  const { customProductId } = useParams(); // ✅ Get ID from URL
  const [customProduct, setCustomProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedTab, setSelectedTab] = useState("PRODUCT");


  console.log(customProduct, "<<<<<<customProduct")

  const stripHtml = (html) => {
    if (!html) return "";
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isConfiguratorModalOpen, setIsConfiguratorModalOpen] = useState(false);
  const [selectedConfigColor, setSelectedConfigColor] = useState("Black");
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);

  const fontStack = 'ui-sans-serif, system-ui, -apple-system, sans-serif';

  // ✅ Fetch custom product by ID
  useEffect(() => {
    const fetchCustomProduct = async () => {
      try {
        setLoading(true);
        const res = await getCustomProductById(customProductId);
        if (res.success) {
          setCustomProduct(res.data);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (customProductId) {
      fetchCustomProduct();
    }
  }, [customProductId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#f05a28] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Product not found
  if (!customProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-[#f05a28] font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ✅ Extract product data
  const p = customProduct.baseProduct || {};
  const customVariant = customProduct.customVariant || {};
  const selectedMockup = customProduct.selectedMockup || {};
  const customerLayers = customProduct.customerLayers || [];

  // Display image: custom variant image > mockup image > product thumbnail
  const displayImage = selectedMockup.imageUrl ||
    selectedMockup?.mockupImage?.url ||
    p?.thumbnail?.url ||
    image;

  // Pehle colors array define karo (jo aapne upar diya hai)
  const colors = [
    { name: "Black", bg: "bg-black", hex: "#000000" },
    { name: "Red", bg: "bg-red-600", hex: "#dc2626" },
    { name: "Royal Blue", bg: "bg-blue-700", hex: "#1d4ed8" },
    { name: "Coral", bg: "bg-orange-400", hex: "#fb923c" },
    { name: "Teal", bg: "bg-teal-500", hex: "#14b8a6" },
    { name: "White", bg: "bg-white border", hex: "#ffffff" }
  ];

  // Variants se unique colors nikalain (colorHex ke basis par)
  const productColors = p?.Variants?.reduce((acc, variant) => {
    // Skip agar colorHex nahi hai
    if (!variant.colorHex || variant.colorHex === "") return acc;

    const hex = variant.colorHex.toLowerCase();
    const existingColor = acc.find(c => c.hex === hex);

    if (!existingColor) {
      // colors array mein matching color dhundho
      const matchedColor = colors.find(c => c.hex.toLowerCase() === hex);

      if (matchedColor) {
        // Agar predefined color mil gaya
        acc.push({
          name: matchedColor.name,
          hex: hex,
          bg: matchedColor.bg,
          variants: [variant]
        });
      } else {
        // Agar custom color hai
        acc.push({
          name: `Color ${hex}`,
          hex: hex,
          bg: "", // No predefined bg class
          variants: [variant]
        });
      }
    } else {
      existingColor.variants.push(variant);
    }

    return acc;
  }, []) || [];

  // 🔥 NEW: Variants se unique sizes nikalain
  const productSizes = p?.Variants?.reduce((acc, variant) => {
    if (!variant.size || variant.size === "") return acc;

    if (!acc.includes(variant.size)) {
      acc.push(variant.size);
    }

    return acc;
  }, []) || [];

  // Agar koi color nahi mila to default show karo
  const displayColors = productColors.length > 0 ? productColors : colors;
  const displaySizes = productSizes.length > 0 ? productSizes : [];

  // Sort sizes properly (S, M, L, XL, 2XL, 3XL)
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  const sortedSizes = [...displaySizes].sort((a, b) => {
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const sizes = ["Small", "Medium", "Large", "XL", "2XL", "3XL"];

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-6 px-4 md:px-8" style={{ fontFamily: fontStack }}>
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-[#f05a28] transition-colors"
          >
            ← Back to Products
          </button>
        </div>

        {/* Top Action Bar */}
        <div className="flex flex-wrap gap-2 mb-8 items-center justify-start pb-6">
          <button
            onClick={() => setIsAddStoreModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#f05a28] text-white text-[13px] font-bold rounded hover:opacity-90 transition-all"
          >
            <Plus size={14} /> Add to Store
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] rounded hover:bg-gray-50"
            onClick={() => setIsModalOpen(true)}
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] rounded hover:bg-gray-50"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit3 size={14} /> Edit Product
          </button>

          <button
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] rounded hover:bg-gray-50"
            onClick={() => setIsConfiguratorModalOpen(true)}
          >
            <Layout size={14} /> Preview Configurator
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] rounded hover:bg-gray-50">
            <Download size={14} /> Download CSV
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] rounded hover:bg-gray-50"
            onClick={() => setIsDuplicateModalOpen(true)}
          >
            <Copy size={14} /> Duplicate
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] rounded hover:bg-gray-50"
            onClick={() => setIsArchiveModalOpen(true)}
          >
            <Archive size={14} /> Archive
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] rounded hover:bg-gray-50"
            onClick={() => setIsRegenerateModalOpen(true)}
          >
            <RefreshCw size={14} /> Regenerate Mockups
          </button>
          <Link to={`/user/edit/${p?._id}`}>
            <button
              className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] rounded hover:bg-gray-50"
            // onClick={() => navigate(`/user/edit/${p?._id}`, {
            //   state: {
            //     product: customProduct
            //   }
            // })}
            >

              <Layout size={14} /> Edit Design
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-white border border-gray-100 overflow-hidden shadow-sm">
              <img
                src={displayImage}
                alt={customVariant.name || p?.productTitle}
                className="w-full h-full object-cover"
              />

              {/* Custom Variant Badge */}
              {customVariant.enabled && (
                <div className="absolute top-4 left-4 bg-[#f05a28] text-white text-xs font-bold px-3 py-1.5 rounded">
                  Custom Design
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {/* Main image thumbnail */}
              <div className="aspect-square bg-white border border-gray-200 overflow-hidden cursor-pointer hover:border-[#f05a28] transition-all">
                <img src={displayImage} className="w-full h-full object-cover" />
              </div>

              {/* Layer thumbnails */}
              {customerLayers.slice(0, 3).map((layer, idx) => (
                <div key={idx} className="aspect-square bg-white border border-gray-200 overflow-hidden cursor-pointer hover:border-[#f05a28] transition-all">
                  <img src={layer.imageUrl} className="w-full h-full object-cover" />
                </div>
              ))}

              {/* If less than 3 layers, show placeholder */}
              {customerLayers.length === 0 && (
                <>
                  <div className="aspect-square bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                  <div className="aspect-square bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                  <div className="aspect-square bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-gray-400">
                {p?.fulfilmentCatalogID || "SKU: " + customProduct._id.slice(-8)}
              </p>
              <h1 className="text-3xl font-black text-gray-900">
                {customVariant.name || p?.productTitle}
              </h1>
              <p className="text-[11px] text-gray-400">
                Created at {new Date(customProduct.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Custom Variant Details */}
            {customVariant.description && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">{stripHtml(customVariant.description)}</p>
              </div>
            )}

            {/* Tags */}
            {customVariant.tags && customVariant.tags.length > 0 && (
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {customVariant.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Color Swatches */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                Available Colors ({displayColors.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {displayColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-2 border transition-all
          ${selectedColor === c.name
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    {/* Color swatch */}
                    <div
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                  </button>
                ))}

                {/* If no colors available */}
                {displayColors.length === 0 && (
                  <p className="text-xs text-gray-400">No colors available</p>
                )}
              </div>
            </div>

            {/* Sizes Section - From Variants */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                Available Sizes ({sortedSizes.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {sortedSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-1.5 rounded text-[12px] font-medium border transition-all
          ${selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    {size}
                  </button>
                ))}

                {/* If no sizes available */}
                {sortedSizes.length === 0 && (
                  <p className="text-xs text-gray-400">No sizes available</p>
                )}
              </div>
            </div>

            {/* Selected Variants Info */}
            {customProduct.selectedDefaultVariants?.length > 0 && (
              <div className="grid grid-cols-2 gap-8 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Selected Variants</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">
                    {customProduct.selectedDefaultVariants.length} variant(s)
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Layers</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">
                    {customerLayers.length} layer(s)
                  </p>
                </div>
              </div>
            )}

            {/* Base Product Description */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase text-gray-400">Description</h4>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                {p?.description?.replace(/<[^>]*>/g, '') || "No description available"}
              </p>
            </div>

            {/* Mockup Info */}
            {selectedMockup && (
              <div className="text-xs text-gray-500">
                <span className="font-semibold">Mockup:</span> {selectedMockup.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL SECTION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded shadow-2xl flex flex-col md:flex-row overflow-hidden relative animate-in fade-in zoom-in duration-200">

            {/* Modal Left: Product Preview */}
            <div className="w-full md:w-1/3 bg-[#f9fafb] p-8 flex flex-col items-center border-r border-gray-100">
              <img src={p.image} alt="modal-preview" className="w-full h-auto mb-6" />
              <div className="text-center">
                <h2 className="text-[16px] font-bold text-gray-800 uppercase italic">Test</h2>
                <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-tight leading-tight">
                  DTF GILDAN 6400 SOFTSTYLE <br /> UNISEX T-SHIRT FRONT PRINT
                </h3>
                <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-tighter">CREATED AT 1/12/25 15:55</p>
              </div>
            </div>

            {/* Modal Right: Selection Details */}
            <div className="w-full md:w-2/3 p-10 space-y-6 overflow-y-auto max-h-[90vh]">

              {/* --- COLOR SECTION (Updated as per your image) --- */}
              <div>
                <label className="text-[14px] font-bold text-gray-800 uppercase block mb-3">Color</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Black", bg: "#000000", text: "white" },
                    { name: "White", bg: "#ffffff", text: "black" },
                    { name: "Sports Gray", bg: "#d1d5db", text: "black" },
                    { name: "Dark Heather", bg: "#374151", text: "white" },
                    { name: "Light Pink", bg: "#fbcfe8", text: "black" },
                    { name: "Azalea", bg: "#f472b6", text: "white" },
                    { name: "Light Blue", bg: "#bfdbfe", text: "black" },
                    { name: "Forest Green", bg: "#064e3b", text: "white" },
                    { name: "Sand", bg: "#d2b48c", text: "black" },
                    { name: "Maroon", bg: "#800000", text: "white" },
                    { name: "Irish Green", bg: "#22c55e", text: "white" },
                  ].map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      style={{ backgroundColor: c.bg, color: c.text }}
                      className={`px-3 py-1.5 rounded border text-[12px] font-bold transition-all shadow-sm
                  ${selectedColor === c.name ? "ring-2 ring-offset-2 ring-black scale-105" : "border-gray-300 hover:border-gray-500"}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* --- SIZE SECTION --- */}
              <div>
                <label className="text-[14px] font-bold text-gray-800 uppercase block mb-3">Size</label>
                <div className="flex flex-wrap gap-2">
                  {["Small", "Medium", "Large", "XL", "2XL", "3XL"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-5 py-2 rounded border text-[13px] font-semibold transition-all
                  ${selectedSize === s ? "border-black bg-gray-50 ring-1 ring-black" : "border-gray-200 bg-[#f9fafb] text-gray-400 hover:border-gray-400"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button className="text-[14px] font-bold text-[#1fb684] underline mt-2">
                Show Advanced Quantity Selection
              </button>

              {/* --- MODAL FOOTER BUTTONS --- */}
              <div className="pt-6 flex items-center gap-4 border-t border-gray-100">
                <button className="flex items-center gap-2 px-8 py-2.5 bg-[#f05a28] text-white text-[14px] font-bold rounded hover:bg-[#199d71] transition-all shadow-md">
                  <ShoppingBag size={18} /> Add Product
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-2.5 text-[14px] font-semibold text-gray-500 border border-gray-300 rounded hover:bg-gray-50 ml-auto"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Close Icon */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          {/* Max-height set to 85vh for a shorter modal */}
          <div className="bg-white w-full max-w-5xl rounded-sm shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white">
              <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">Edit Product</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

              {/* Left: Product Image Preview (Fixed width, non-scrollable) */}
              <div className="w-full md:w-1/2 p-6 flex justify-center items-start bg-white border-r border-gray-50">
                <img
                  src={p.image}
                  alt="edit-preview"
                  className="w-full max-w-[320px] h-auto object-contain"
                />
              </div>

              {/* Right: Form Fields (Scrollable area) */}
              <div className="w-full md:w-1/2 p-6 flex flex-col">

                {/* Tabs Section */}
                <div className="flex gap-6 border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setSelectedTab("PRODUCT")}
                    className={`pb-2 text-[12px] font-bold tracking-tight uppercase ${(typeof selectedTab === 'undefined' ? "PRODUCT" : selectedTab) === "PRODUCT"
                      ? "text-black border-b-2 border-black"
                      : "text-[#1fb684]"
                      }`}
                  >
                    PRODUCT
                  </button>
                  <button className="pb-2 text-[12px] font-bold tracking-tight text-[#1fb684] opacity-50 cursor-not-allowed">VARIANTS</button>
                  <button
                    onClick={() => setSelectedTab("SETTINGS")}
                    className={`pb-2 text-[12px] font-bold tracking-tight uppercase ${selectedTab === "SETTINGS"
                      ? "text-black border-b-2 border-black"
                      : "text-[#1fb684]"
                      }`}
                  >
                    Settings
                  </button>
                </div>

                {/* Tab Content Area */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {/* PRODUCT TAB */}
                  {(!selectedTab || selectedTab === "PRODUCT") && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Name</label>
                        <input type="text" defaultValue={p.title} className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] focus:outline-none focus:border-[#1fb684]" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Tags</label>
                        <input type="text" placeholder="Add a tag" className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] focus:outline-none focus:border-[#1fb684]" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase">Description</label>
                        <textarea rows="5" className="w-full border border-gray-300 rounded px-3 py-3 text-[13px] text-gray-600 leading-relaxed focus:outline-none" defaultValue={p.description} />
                      </div>
                    </div>
                  )}

                  {/* SETTINGS TAB */}
                  {selectedTab === "SETTINGS" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center gap-3 pt-2">
                        <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-gray-300 cursor-pointer">
                          <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white translate-x-1" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-700">Hold Orders</span>
                      </div>
                      <div className="space-y-4 text-[13px] text-gray-500 leading-snug">
                        <p>If selected, Orders containing this item will be placed in a held state for review.</p>
                        <p className="font-medium text-gray-600">NOTE: This will only apply if the Hold Option settings for a shop is set to 'Per Product'.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Warning Footer Note */}
            <div className="bg-[#fffbeb] p-3 border-t border-gray-100">
              <p className="text-[11px] text-gray-600 text-center">
                These changes will only take effect on the product within your app. To update ecommerce store products, you need to sync the product within the Stores screen.
              </p>
            </div>

            {/* Modal Footer Buttons */}
            <div className="flex justify-between items-center p-3 bg-white border-t border-gray-100">
              <button className="px-6 py-2 bg-[#f05a28] text-white text-[13px] font-bold rounded hover:bg-[#199d71] transition-all">
                Update
              </button>
              <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 border border-gray-200 text-gray-500 text-[13px] rounded hover:bg-gray-50 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDuplicateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-5xl rounded shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-[#f9fafb]">
              <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">Duplicate Product</h2>
              <button onClick={() => setIsDuplicateModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

              {/* Left Side: Product Image */}
              <div className="w-full md:w-1/2 p-8 flex justify-center items-start bg-white">
                <img
                  src={p.image}
                  alt="duplicate-preview"
                  className="w-full max-w-[380px] h-auto object-contain"
                />
              </div>

              {/* Right Side: Rich Text Editor Area */}
              <div className="w-full md:w-1/2 p-8 overflow-y-auto custom-scrollbar bg-white">

                {/* Editor Toolbar Icons */}
                <div className="flex items-center gap-4 mb-4 text-gray-500 border-b border-gray-50 pb-2">
                  <span className="font-serif font-bold cursor-pointer hover:text-black">B</span>
                  <span className="italic cursor-pointer hover:text-black">I</span>
                  <span className="underline cursor-pointer hover:text-black">U</span>
                  <Edit3 size={16} className="cursor-pointer hover:text-black" />
                  <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
                  <List size={16} className="cursor-pointer hover:text-black" />
                  <ListOrdered size={16} className="cursor-pointer hover:text-black" />
                  <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
                  <Code size={16} className="cursor-pointer hover:text-black" />
                  <ImageIcon size={16} className="cursor-pointer hover:text-black" />
                  <Link size={16} className="cursor-pointer hover:text-black" />
                  <RefreshCw size={14} className="cursor-pointer hover:text-black" />
                  <Undo size={16} className="cursor-pointer hover:text-black" />
                </div>

                {/* Description Text Area */}
                <div className="space-y-4 text-[13px] text-gray-600 leading-relaxed outline-none border border-gray-100 p-4 rounded-sm min-h-[300px]">
                  <p>The Gildan 6400 Unisex T-Shirt, crafted from 100% premium cotton, offers the perfect blend of comfort, style, and personal expression for everyone.</p>
                  <p>This unisex tee features a crew neck and short sleeves, making it a versatile choice for any event or as a thoughtful thank you gift. Its smooth fabric not only ensures a cozy fit for all body types.</p>
                  <p>Available in a wide range of sizes and an array of colors—from solid shades that boast 100% cotton to heather colors with a soft cotton-poly blend—there's a Gildan 6400 T-Shirt for everyone's taste and preference, transcending gender norms and embracing individuality.</p>

                  <div className="mt-6">
                    <p className="font-bold text-gray-800 mb-2">Key Features:</p>
                    <ul className="list-disc ml-5 space-y-2">
                      <li><strong>Soft Touch:</strong> Ringspun pre-shrunk cotton and a 30 single yarn for a softer feel, designed to comfort every body.</li>
                      <li><strong>Durability:</strong> Features a seamless double-needle collar, taped neck & shoulders, and double-needle sleeves & bottom hem, crafted to endure daily wear and tear.</li>
                      <li><strong>Sleek Design:</strong> Quarter-turned to eliminate the center crease, ensuring a smooth, unblemished surface for printing.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-4 bg-white border-t border-gray-100">
              <button className="px-6 py-2 bg-[#1fb684] text-white text-[13px] font-bold rounded shadow-sm hover:bg-[#199d71] transition-all">
                Duplicate
              </button>
              <button
                onClick={() => setIsDuplicateModalOpen(false)}
                className="px-8 py-2 border border-gray-200 text-gray-500 text-[13px] rounded hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white">
              <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">Archive Product</h2>
              <button onClick={() => setIsArchiveModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body - Confirmation Message */}
            <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-[15px] text-gray-600">
                You have requested to archive <span className="font-bold text-gray-800">{p.title || "hgdghdhgc"}</span>.
              </p>
              <p className="text-[15px] text-gray-600">
                Please confirm your intention.
              </p>
            </div>

            {/* Modal Footer - Buttons */}
            <div className="flex justify-end items-center gap-3 p-4 bg-white border-t border-gray-100">
              <button
                onClick={() => {
                  console.log("Product Archived");
                  setIsArchiveModalOpen(false);
                }}
                className="px-6 py-2 bg-[#F05828] text-white text-[13px] font-bold rounded shadow-sm hover:bg-[#199d71] transition-all"
              >
                OK
              </button>
              <button
                onClick={() => setIsArchiveModalOpen(false)}
                className="px-6 py-2 border border-gray-200 text-gray-500 text-[13px] rounded hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {isConfiguratorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white">
              <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">Select Variant for Configurator</h2>
              <button
                onClick={() => setIsConfiguratorModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-light px-2"
              >
                ×
              </button>
            </div>

            {/* Modal Body - Color Selection */}
            <div className="p-6 space-y-4">
              <label className="block text-[14px] font-bold text-gray-600">Color</label>

              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Black", bg: "bg-[#1a1a1a]" },
                  { name: "Red", bg: "bg-[#be1e2d]" },
                  { name: "Royal Blue", bg: "bg-[#4a77b5]" },
                  { name: "Coral", bg: "bg-[#f16d63]" },
                  { name: "Dark Gray", bg: "bg-[#6d6e71]" },
                  { name: "Green", bg: "bg-[#1d6b41]" },
                  { name: "Light Blue", bg: "bg-[#92cedf]" },
                  { name: "Light Purple", bg: "bg-[#db8ab6]" },
                  { name: "Maroon", bg: "bg-[#7b111a]" },
                  { name: "Navy Blue", bg: "bg-[#2c3544]" },
                  { name: "Orange", bg: "bg-[#e46d1b]" },
                  { name: "Pink", bg: "bg-[#e586b3]" },
                  { name: "Purple", bg: "bg-[#4e3694]" },
                  { name: "Teal", bg: "bg-[#7bc8bb]" },
                  { name: "White", bg: "bg-white border border-gray-200 text-black" },
                  { name: "Yellow", bg: "bg-[#fdb933]" }
                ].map((color) => {
                  // Safety check: agar state na ho toh 'Black' ko default maano
                  const isSelected = (typeof selectedConfigColor !== 'undefined' ? selectedConfigColor : "Black") === color.name;

                  return (
                    <div
                      key={color.name}
                      onClick={() => typeof setSelectedConfigColor !== 'undefined' && setSelectedConfigColor(color.name)}
                      className={`
                  ${color.bg} 
                  ${color.name === 'White' && !isSelected ? 'text-black' : 'text-white'} 
                  px-3 py-1 rounded-sm text-[13px] font-medium cursor-pointer flex items-center gap-1 transition-all
                  ${isSelected ? 'ring-2 ring-offset-1 ring-gray-400' : 'hover:opacity-90'}
                `}
                    >
                      {/* ✓ mark logic */}
                      {isSelected && <span className="font-bold">✓</span>}
                      {color.name}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer - Buttons */}
            <div className="flex justify-between items-center p-4 bg-white border-t border-gray-100 mt-4">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-[#F05828] text-white text-[13px] font-bold rounded shadow-sm hover:bg-[#199d71]">
                  Launch Configurator
                </button>
                <button className="px-4 py-2 border border-gray-200 text-gray-500 text-[13px] rounded hover:bg-gray-50">
                  Launch In New Tab
                </button>
              </div>

              <button
                onClick={() => setIsConfiguratorModalOpen(false)}
                className="px-6 py-2 border border-gray-200 text-gray-500 text-[13px] rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isRegenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white">
              <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">Regenerate Mockups</h2>
              <button
                onClick={() => setIsRegenerateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-light px-2"
              >
                ×
              </button>
            </div>

            {/* Modal Body - Confirmation Text */}
            <div className="p-6 pt-8 pb-10 space-y-4 text-[14px] text-gray-600 leading-relaxed">
              <p>
                You have requested to regenerate mockups for this product. The existing mockups will be replaced once the new mockups are produced.
              </p>
              <p>
                Mockups are generated in the background and can take a few minutes to produce.
              </p>
              <p>
                Please confirm your intention.
              </p>
            </div>

            {/* Modal Footer - Action Buttons */}
            <div className="flex justify-between items-center p-4 bg-white border-t border-gray-100">
              <button
                onClick={() => {
                  console.log("Regenerating...");
                  setIsRegenerateModalOpen(false);
                }}
                className="px-6 py-2 bg-[#F05828] text-white text-[13px] font-bold rounded shadow-sm hover:bg-[#199d71] transition-all"
              >
                Regenerate
              </button>

              <button
                onClick={() => setIsRegenerateModalOpen(false)}
                className="px-8 py-2 border border-gray-200 text-gray-500 text-[13px] rounded hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddStoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-5xl rounded shadow-2xl flex flex-col min-h-[500px] max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white">
              <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">Add Product to Store</h2>
              <button
                onClick={() => setIsAddStoreModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-light px-2 leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 flex flex-col bg-white">
              {/* Step Title */}
              <h3 className="text-[15px] font-bold text-gray-600 mb-6">Step 1 - Store</h3>

              {/* Full Width Filters Row */}
              <div className="flex flex-col md:flex-row gap-6 mb-8 w-full">
                {/* Full Width Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search for Store"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-[14px] focus:outline-none focus:border-gray-400 placeholder:text-gray-300 shadow-sm"
                  />
                  {/* Search Icon Placeholder */}
                  <span className="absolute right-3 top-2.5 text-gray-400 font-bold transform scale-x-[-1]">Q</span>
                </div>

                {/* Full Width Dropdown */}
                <div className="flex-1">
                  <select className="w-full border border-gray-200 rounded px-3 py-2 text-[14px] text-gray-600 focus:outline-none bg-white shadow-sm appearance-none cursor-pointer">
                    <option>Shopify</option>
                    <option>WooCommerce</option>
                    <option>Etsy</option>
                  </select>
                </div>
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-2 border-b border-gray-200 pb-3 px-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Name</span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</span>
              </div>

              {/* Empty State Area */}
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-300 text-[14px]">No stores connected yet.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 bg-white border-t border-gray-100">
              <button
                onClick={() => setIsAddStoreModalOpen(false)}
                className="px-6 py-1.5 border border-gray-300 text-gray-600 text-[13px] rounded hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SingleProduct;
