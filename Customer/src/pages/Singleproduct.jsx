import React, { useState } from "react";
import { LayoutGrid, List, ChevronLeft, ShoppingBag, Star, ShieldCheck, Truck } from "lucide-react";

export default function SingleProduct({ product, onBack }) {
  const [selectedSize, setSelectedSize] = useState("M");
const [mainImage, setMainImage] = useState(product?.image || "/public/dummy.jpg");

  const fontStack = 'ui-sans-serif, system-ui, -apple-system, sans-serif';

  // Placeholder data agar product pass na ho
  const p = product || {
    title: "JACKED JOINTS OVERSIZED TEE",
    price: "73.00",
    discount: "15",
    type: "Premium Apparel",
    description: "Experience ultimate comfort with our signature oversized fit. Crafted from 100% heavy-weight cotton, this tee features dropped shoulders and a structured silhouette.",
    rating: 4.8,
    reviews: 124
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-8 px-4 md:px-8" style={{ fontFamily: fontStack }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Row */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#f05a28] transition-colors mb-8 group"
        >
          {/* <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> */}
          {/* Back to Catalog */}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Image Gallery (Lg: 7 columns) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square bg-white border border-gray-100 rounded-[0px] overflow-hidden shadow-sm">
              <img 
                src={mainImage} 
                alt={p.title} 
                className="w-full h-full object-cover"
              />
              {p.discount && (
                <div className="absolute top-6 left-6 bg-[#f05a28] text-white px-4 py-1.5 rounded-full z-10 shadow-lg shadow-[#f05a28]/20">
                  <span className="text-[11px] font-black italic">SAVE {p.discount}%</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Row */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className="aspect-square bg-white border border-gray-100 rounded-[0px] overflow-hidden cursor-pointer hover:border-[#f05a28] transition-all"
                >
                  <img src={mainImage}  className="w-full h-full object-cover opacity-50 hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Product Details (Lg: 5 columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-6 bg-[#f05a28]" />
                <span className="text-[11px] font-black text-[#f05a28] uppercase tracking-[0.2em]">
                  {p.type}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-[25px] font-[900] text-gray-900 leading-[1.1] tracking-tight">
                {p.title}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-900 text-white px-3 py-1 rounded-lg gap-1.5">
                  <Star size={12} fill="white" />
                  <span className="text-[12px] font-black">{p.rating}</span>
                </div>
                <span className="text-[12px] font-bold text-gray-400 border-l pl-4 border-gray-200">
                  {p.reviews} Verified Reviews
                </span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              {/* Price Section */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-[900] text-gray-900 tracking-tighter">
                  ${p.price}
                </span>
                {p.discount && (
                  <span className="text-xl font-bold text-gray-300 line-through">
                    ${(parseFloat(p.price) * 1.2).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Size Selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Select Size</label>
                  <button className="text-[10px] font-black text-[#f05a28] underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all border-2
                        ${selectedSize === size 
                          ? "bg-gray-900 border-gray-900 text-white shadow-xl scale-110" 
                          : "bg-gray-50 border-transparent text-gray-500 hover:border-gray-200"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button className="w-full bg-[#f05a28] text-white py-5 rounded-2xl font-[900] uppercase tracking-widest text-[13px] shadow-lg shadow-[#f05a28]/20 hover:bg-black hover:shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
                <button className="w-full bg-white border-2 border-gray-100 text-gray-900 py-5 rounded-2xl font-[900] uppercase tracking-widest text-[13px] hover:bg-gray-50 transition-all">
                  Buy it now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-gray-500 leading-tight">Secure<br/>Checkout</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                    <Truck size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-gray-500 leading-tight">Free Express<br/>Shipping</span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="px-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">Product Info</h4>
              <p className="text-[14px] text-gray-600 leading-relaxed font-medium">
                {p.description}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}