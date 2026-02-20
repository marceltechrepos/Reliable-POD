import React, { useState, useMemo } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";

import PriceListFilters from "../components/PriceLists/PriceListFilters";
import ProductPricesTable from "../components/PriceLists/ProductPricesTable";
import ShippingPricesTable from "../components/PriceLists/ShippingPricesTable";

// Dummy Data
import { PRODUCT_PRICES, SHIPPING_PRICES, JUMP_OPTIONS } from "../components/PriceLists/dummyData";

export default function PriceLists() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [jumpTo, setJumpTo] = useState("");

  const filteredProductData = useMemo(() => {
    return PRODUCT_PRICES.filter(row =>
      (row.product.toLowerCase().includes(search.toLowerCase()) ||
        row.variant.toLowerCase().includes(search.toLowerCase()) ||
        row.shippingBand.toLowerCase().includes(search.toLowerCase())) &&
      (jumpTo ? row.product.includes(jumpTo) : true)
    );
  }, [search, jumpTo]);

  const filteredShippingData = useMemo(() => {
    return SHIPPING_PRICES.filter(row =>
      row.method.toLowerCase().includes(search.toLowerCase()) ||
      row.countryGroup.toLowerCase().includes(search.toLowerCase()) ||
      row.shippingBand.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5" }}>
      {/* <Typography variant="h4" mb={3}>Price Lists</Typography> */}
       <h1 className="text-4xl mb-5 font-[900] text-gray-900 tracking-tight">
             Price Lists
            </h1>

 <div className="inline-flex p-1.5 bg-gray-100/60 border border-gray-200 rounded-[22px] mb-10 space-x-1 overflow-x-auto no-scrollbar shadow-inner">
  {[
    { id: 0, label: "Product Prices", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { id: 1, label: "Shipping Prices", icon: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" }
  ].map((t) => (
    <button
      key={t.id}
      onClick={() => setActiveTab(t.id)}
      className={`flex items-center gap-2.5 px-6 py-3 rounded-[18px] transition-all duration-300 whitespace-nowrap ${
        activeTab === t.id 
        ? "bg-white text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-gray-200/50" 
        : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
      }`}
    >
      {/* Native SVG Icon */}
      <svg 
        className={`w-4 h-4 transition-colors duration-300 ${activeTab === t.id ? 'text-[#f05a28]' : 'text-gray-400 group-hover:text-gray-600'}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={t.icon} />
      </svg>

      <span className={`text-[12px] font-black uppercase tracking-widest font-mono`}>
        {t.label}
      </span>
    </button>
  ))}
</div>
      <PriceListFilters search={search} setSearch={setSearch} jumpTo={jumpTo} setJumpTo={setJumpTo} jumpOptions={JUMP_OPTIONS} />

      {activeTab === 0 &&
      
     <div className="w-full bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            <th className="px-8 py-5 text-[10px] font-[900] uppercase tracking-[0.2em] text-gray-400">
              Product & Description
            </th>
            <th className="px-8 py-5 text-[10px] font-[900] uppercase tracking-[0.2em] text-gray-400">
              Variant
            </th>
            <th className="px-8 py-5 text-[10px] font-[900] font-mono uppercase tracking-[0.2em] text-gray-400 text-center">
              Shipping Band
            </th>
            <th className="px-8 py-5 text-[10px] font-[900] uppercase tracking-[0.2em] text-gray-400 text-right">
              Unit Price
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {filteredProductData && filteredProductData.length > 0 ? (
            filteredProductData.map((row, i) => (
              <tr 
                key={row.id || i} 
                className="group hover:bg-[#f05a28]/[0.02] transition-all duration-300 cursor-default"
              >
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-[15px] font-[800] text-gray-900 tracking-tight group-hover:text-[#f05a28] transition-colors">
                      {row.product}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                      Catalog Item #{100 + i}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-bold uppercase tracking-tighter font-mono">
                    {row.variant}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="text-[13px] font-black text-gray-700 tabular-nums font-mono">
                    {row.shippingBand}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-[1000] text-gray-900  font-mono">
                      ${row.price}
                    </span>
                    <span className="text-[9px] font-black text-[#f05a28] uppercase mt-1 font-mono">
                      USD
                    </span>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-8 py-24 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-gray-50 rounded-full">
                    <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <span className="text-gray-400 text-sm font-bold uppercase tracking-widest italic">No Data Found</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
      
      
      }
      {activeTab === 1 && (
  <div className="w-full bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            <th className="px-8 py-5 text-[10px] font-[900] font-mono uppercase tracking-[0.2em] text-gray-400">
              Shipping Method
            </th>
            <th className="px-8 py-5 text-[10px] font-[900] font-mono uppercase tracking-[0.2em] text-gray-400">
              Region / Group
            </th>
            <th className="px-8 py-5 text-[10px] font-[900] font-mono uppercase tracking-[0.2em] text-gray-400 text-center">
              Band
            </th>
            <th className="px-8 py-5 text-[10px] font-[900] font-mono uppercase tracking-[0.2em] text-gray-400 text-right">
              Delivery Cost
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {filteredShippingData && filteredShippingData.length > 0 ? (
            filteredShippingData.map((row, i) => (
              <tr 
                key={i} 
                className="group hover:bg-[#f05a28]/[0.02] transition-all duration-300 cursor-default"
              >
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-[15px] font-[800] text-gray-900 tracking-tight group-hover:text-[#f05a28] transition-colors">
                      {row.method}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium uppercase tracking-[0.1em] mt-0.5 font-mono">
                      LOGISTICS-ID: {500 + i}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-tighter font-mono border border-blue-100/50">
                    {row.countryGroup}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="text-[13px] font-black text-gray-700 tabular-nums font-mono">
                    {row.shippingBand}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-[1000] text-gray-900 font-mono  tracking-tighter leading-none group-hover:scale-105 transition-transform">
                      ${row.cost}
                    </span>
                    <span className="text-[9px] font-black text-[#f05a28] uppercase mt-1 font-mono tracking-widest">
                      FIXED RATE
                    </span>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-8 py-24 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-gray-50 rounded-full">
                    <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-400 text-sm font-bold uppercase tracking-widest italic font-mono">No Logistics Found</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}
    </Box>
  );
}
