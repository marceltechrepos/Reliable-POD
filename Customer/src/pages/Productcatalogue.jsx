import React, { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Masonry from "react-masonry-css";

import { CATALOGUES } from "../components/Catalogue/data";
import CatalogueFilters from "../components/Catalogue/CatalogueFilters";
import CatalogueCard from "../components/Catalogue/CatalogueCard";
import { Search, Percent, SlidersHorizontal } from 'lucide-react';
import { Link } from "react-router-dom";

export default function Productcatalogue() {
  const [search, setSearch] = useState("");
  const [discountOnly, setDiscountOnly] = useState(false);


  const filtered = useMemo(() => {
    let arr = CATALOGUES;
    if (search) arr = arr.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    if (discountOnly) arr = arr.filter(c => c.discount);
    return arr;
  }, [search, discountOnly]);

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5" }}>
      <h1 className="text-4xl font-[900] mb-[20px] text-gray-900 tracking-tight">
        Product Catalogue
      </h1>

      <div className="w-full flex flex-col mb-10 md:flex-row items-center gap-4">
        {/* Search Input Group */}
        <div className="relative w-full md:flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
            <Search size={18} className="text-gray-400 group-focus-within:text-[#f05a28]" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items, collections..."
            className="w-full bg-[#f8f8f8] border border-transparent py-4 pl-12 pr-6 rounded-[20px] text-[13px] font-medium text-gray-900 outline-none transition-all duration-300
            placeholder:text-gray-400
            focus:bg-white focus:border-[#f05a28]/20 focus:shadow-[0_0_0_4px_rgba(240,90,40,0.05)]"
          />
        </div>

        {/* Filter Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setDiscountOnly(!discountOnly)}
            className={`flex items-center gap-2 px-6 py-4 rounded-[20px] transition-all duration-300 border
            ${discountOnly
                ? "bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-200"
                : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200"
              }`}
          >
            <Percent size={14} className={discountOnly ? "text-[#f05a28]" : "text-gray-400"} />
            <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
              Offers Only
            </span>
            <div className={`w-1.5 h-1.5 rounded-full transition-all ${discountOnly ? "bg-[#f05a28] scale-125 shadow-[0_0_8px_#f05a28]" : "bg-gray-200"}`} />
          </button>

          <button
            type="button"
            className="p-4 bg-white border border-gray-100 rounded-[0px] text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all shadow-sm active:scale-95"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Grid Section: Columns badha diye taaki width kam ho jaye */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.map((c) => (
            <Link
              to={c.link || `/user/products`}
              key={c.id}
              className="group relative font-sans w-full block no-underline cursor-pointer"
            >
              <div className="relative bg-white rounded-[0px] overflow-hidden border border-gray-100/50 
    shadow-[0_4px_15px_rgb(0,0,0,0.03)] 
    transition-all duration-500 ease-out
    hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] 
    hover:-translate-y-1">

                {/* Square Image Wrapper */}
                <div className="relative aspect-square overflow-hidden bg-[#f9f9f9]">
                  <img
                    src={c.image || "https://via.placeholder.com/400x400"}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>

                {/* Compact Content Area */}
                <div className="p-3 bg-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-[1.5px] w-3 bg-[#f05a28] rounded-full"></span>
                    <span className="text-[8px] font-black text-[#f05a28] uppercase tracking-widest opacity-80">
                      {c.category || "Collection"}
                    </span>
                  </div>

                  <h3 className="text-[12px] font-[800] text-gray-900 tracking-tight leading-tight group-hover:text-[#f05a28] transition-colors duration-300 truncate">
                    {c.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center font-sans tracking-tight text-gray-400 text-sm font-medium italic">
          No catalogue found.
        </div>
      )}
    </Box>
  );
}
