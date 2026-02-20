import React from "react";

const getStoreMeta = (type) => {
  switch (type) {
    case "Shopify":
      return { bg: "from-[#95BF47] to-[#5E8E3E]", icon: "S" };
    case "Etsy":
      return { bg: "from-[#F16521] to-[#C94E0E]", icon: "E" };
    case "WooCommerce":
      return { bg: "from-[#96588A] to-[#6E3E66]", icon: "WC" };
    case "Anywhere POD":
      return { bg: "from-[#3B82F6] to-[#1D4ED8]", icon: "A" };
    case "Manual Order":
      return { bg: "from-[#6B7280] to-[#374151]", icon: "M" };
    default:
      return { bg: "from-[#f05a28] to-[#d04a1e]", icon: "ST" };
  }
};

export default function StoreCard({ store, onClick }) {
  const meta = getStoreMeta(store.type);

  return (
    <div
      onClick={onClick}
      className="group relative rounded-3xl bg-white border border-gray-100 p-[1px]
      shadow-[0_8px_30px_rgba(0,0,0,0.05)]
      hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]
      transition-all duration-500 cursor-pointer overflow-hidden"
    >
      {/* Gradient Hover Border */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br ${meta.bg}`}
      />

      {/* Inner */}
      <div className="relative bg-white rounded-3xl p-6 flex flex-col h-full min-h-[320px]">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.bg}
            flex items-center justify-center text-white font-bold text-xl
            shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition`}
          >
            {meta.icon}
          </div>

          {/* Sync */}
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Live
              </span>
            </div>
            <p className="text-[11px] text-gray-300 mt-1">
              {store.lastSync || "Just now"}
            </p>
          </div>
        </div>

        {/* Store Info */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:translate-x-1 transition">
            {store.name}
          </h3>

          <div className="flex gap-2 flex-wrap">
            <span className="text-[10px] px-2 py-1 rounded-full bg-gray-50 border text-gray-500 font-medium">
              ID #{store.id?.toString().padStart(3, "0")}
            </span>

            <span
              className={`text-[10px] px-2 py-1 rounded-full text-white bg-gradient-to-r ${meta.bg}`}
            >
              {store.type}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-auto">
          <Stat label="Products" value={store.products || 0} />
          <Stat label="Orders" value={store.orders || 0} />
          <Stat
            label="Revenue"
            value={`$${store.revenue || 0}`}
            highlight
          />
        </div>

        {/* Footer */}
        <div className="mt-5 opacity-0 group-hover:opacity-100 transition flex items-center gap-2">
          <span className="text-xs font-semibold text-orange-500">
            View Analytics
          </span>
          <div className="flex-1 h-[2px] bg-gradient-to-r from-orange-400 to-transparent rounded-full" />
        </div>
      </div>

      {/* Background Glow */}
      <div
        className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${meta.bg}
        opacity-10 blur-3xl group-hover:opacity-20 transition`}
      />
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div
      className={`rounded-2xl p-3 text-center border transition
      ${highlight
          ? "bg-orange-50 border-orange-100"
          : "bg-gray-50 border-gray-100"}
      `}
    >
      <p className="text-[10px] uppercase text-gray-400 font-semibold mb-1">
        {label}
      </p>
      <p
        className={`text-sm font-bold ${
          highlight ? "text-orange-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}