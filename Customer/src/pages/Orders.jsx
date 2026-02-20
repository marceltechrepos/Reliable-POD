import React, { useState, useMemo } from "react";
import OrdersFilters from "../components/Orders/OrdersFilters";
import OrdersTable from "../components/Orders/OrdersTable";

const dummyOrders = [
  { id: 1, orderId: "ORD-001", customer: "John Doe", status: "Pending", date: "2025-01-05", total: 240 },
  { id: 2, orderId: "ORD-002", customer: "Sarah Smith", status: "In production", date: "2025-01-06", total: 520 },
  { id: 3, orderId: "ORD-003", customer: "Michael Brown", status: "Held", date: "2025-01-07", total: 120 },
  { id: 4, orderId: "ORD-004", customer: "Emma Wilson", status: "Completed", date: "2025-01-09", total: 940 },
  { id: 5, orderId: "ORD-005", customer: "David Carter", status: "Rejected", date: "2025-01-10", total: 310 },
];

const Orders = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  // 🗑️ status state yahan se hatayi gayi hai
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const tabStatusMapping = ["All", "Pending", "In production", "Completed", "Cancelled", "Rejected"];

  const filteredData = useMemo(() => {
    return dummyOrders.filter((o) => {
      const currentTabStatus = tabStatusMapping[tab];
      
      // Filter by Tab (Status)
      const matchesTab = currentTabStatus === "All" || o.status === currentTabStatus;
      
      // Filter by Search
      const matchesSearch =
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.orderId.toLowerCase().includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [tab, search]); // 🗑️ status dependency hatayi

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-8 px-4 md:py-12 md:px-8" 
         style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      
      {/* 🛠️ MUI Specific Style Injection to hide dropdown ghost */}
      <style dangerouslySetInnerHTML={{ __html: `
        .css-j75a4v-MuiFormControl-root-MuiTextField-root {
          display: none !important;
        }
      `}} />

      <div className="max-w-7xl mx-auto">
        
        {/* 🔥 Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-[900] text-gray-900 tracking-tight">
              Orders Management
            </h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Viewing <span className="text-[#f05a28] font-bold">{filteredData.length}</span> total orders across your store
            </p>
          </div>
          <div className="h-1.5 w-16 bg-[#f05a28] rounded-full mb-1 hidden md:block" />
        </div>

        {/* 🔥 Modern Tabs (Status Pills) */}
        <div className="inline-flex p-1.5 bg-gray-100/50 border border-gray-200 rounded-2xl mb-8 space-x-1 overflow-x-auto no-scrollbar">
          {tabStatusMapping.map((label, index) => (
            <button
              key={label}
              onClick={() => { setTab(index); setPage(0); }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                tab === index 
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200" 
                : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 🔥 Main Content Card */}
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Filters Component - 🗑️ Status prop hata diya gaya hai */}
            <OrdersFilters
              search={search}
              setSearch={setSearch}
            />

            <div className="h-px bg-gray-100 my-8" />

            {/* Table Component */}
            <OrdersTable
              data={filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
              count={filteredData.length}
              page={page}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;