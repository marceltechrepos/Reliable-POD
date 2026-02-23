import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import ReactQuill from "react-quill"; // Agar use nahi ho raha toh comment rakhein

import image from "../assets/image/dummy.jpg";
import { 
  ShoppingBag, Edit3, Copy, Archive, RefreshCw, Download, Plus, X, Image as ImageIcon, Layout
} from "lucide-react";

const Singlecatalogue = ({ product }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState();

  // --- YE DO LINE ADD KI HAIN ---
  const [selectedColor, setSelectedColor] = useState("Black");
  const colors = [
    { name: "Black", bg: "bg-black" },
    { name: "Navy", bg: "bg-blue-900" },
    { name: "Red", bg: "bg-red-600" },
    { name: "White", bg: "bg-white" }
  ];
  // ------------------------------

  const fontStack = 'ui-sans-serif, system-ui, -apple-system, sans-serif';

  const p = product || {
    id: 1, // ID zaroori hai navigation ke liye
    title: "30oz Laser Engraved Insulated Tumbler",
    price: "73.00",
    sku: "HGDGHDHGC",
    createdAt: "15/12/25 16:50",
    discount: "15",
    type: "Premium Drinkware",
    description: "Experience Unmatched Durability and Temperature Retention with our 30oz Laser Engraved Polar Camel High Endurance Drinkware. Meticulously engineered for those who demand style and functionality.",
    rating: 4.8,
    reviews: 124,
    image: image
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-6 px-4 md:px-8" style={{ fontFamily: fontStack }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Top Action Bar */}
        <div className="flex flex-wrap gap-2 mb-8 items-center justify-start pb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#f05a28] text-white text-[13px] font-bold rounded hover:opacity-90 transition-all">
            <Plus size={14} /> Create Print On Demand Product
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] rounded hover:bg-gray-50">
            <ShoppingBag size={14} /> Create Personalised Product
          </button>

          {/* <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] rounded hover:bg-gray-50">
            <Download size={14} /> Download CSV
          </button> */}

          {/* Edit Design Button jo Dynamic Tool par le jayega */}
          {/* <button 
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] rounded hover:bg-gray-50 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/user/dynamicDesignTool", { 
                state: { 
                  product: {
                    id: p.id,
                    title: p.title,
                    image: p.image,
                    price: p.price
                  } 
                } 
              });
            }}
          >
            <Archive size={14} /> Edit Design
          </button> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-white border border-gray-100 overflow-hidden shadow-sm">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-gray-400">{p.sku}</p>
              <h1 className="text-3xl font-black text-gray-900">{p.title}</h1>
              <p className="text-[11px] text-gray-400">Created at {p.createdAt}</p>
            </div>

            {/* Color Swatches - Fixed Section */}
            {/* <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-2 border transition-all
                      ${selectedColor === c.name ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${c.bg} border border-gray-200`} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Production Costs */}
            <div className="grid grid-cols-2 gap-8 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">Production Costs</p>
                <button className="text-[#00a185] text-[12px] font-bold underline">View our production costs</button>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">Production Location</p>
                <div className="mt-1">
                  <img src="https://flagcdn.com/w40/us.png" className="w-7 shadow-sm" alt="USA" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase text-gray-400">Description</h4>
              <p className="text-[14px] text-gray-600 leading-relaxed">{p.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Singlecatalogue;