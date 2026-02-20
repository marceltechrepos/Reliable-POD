import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, Calendar } from 'lucide-react';

const OrdersChart = () => {
  const themeColor = "#f05a28";
  const [view, setView] = useState('monthly'); // 'monthly' or 'quarterly'

  // Data Definitions
  const monthlyData = [
    { label: 'Jan', orders: 12 }, { label: 'Feb', orders: 19 },
    { label: 'Mar', orders: 15 }, { label: 'Apr', orders: 25 },
    { label: 'May', orders: 22 }, { label: 'Jun', orders: 30 },
    { label: 'Jul', orders: 28 }, { label: 'Aug', orders: 35 },
    { label: 'Sep', orders: 32 }, { label: 'Oct', orders: 40 },
    { label: 'Nov', orders: 38 }, { label: 'Dec', orders: 45 }
  ];

  const quarterlyData = [
    { label: 'Q1', orders: 46 },
    { label: 'Q2', orders: 77 },
    { label: 'Q3', orders: 95 },
    { label: 'Q4', orders: 123 }
  ];

  const currentData = view === 'monthly' ? monthlyData : quarterlyData;
  const maxOrders = Math.max(...currentData.map(d => d.orders));
  const totalOrders = currentData.reduce((acc, curr) => acc + curr.orders, 0);

  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 mt-10 overflow-hidden relative">
      {/* Background Decor */}
      <div 
        className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: themeColor }}
      ></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div 
            className="p-3 rounded-2xl shadow-lg"
            style={{ backgroundColor: themeColor, boxShadow: `0 10px 20px ${themeColor}40` }}
          >
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Orders Performance</h3>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-sm text-gray-500 font-medium tracking-tight">Analytics for 2026</p>
            </div>
          </div>
        </div>

        {/* Working Toggle Buttons */}
        <div className="mt-4 md:mt-0 flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
          <button 
            onClick={() => setView('monthly')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              view === 'monthly' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
            style={view === 'monthly' ? { color: themeColor } : {}}
          >
            Monthly
          </button>
          <button 
            onClick={() => setView('quarterly')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              view === 'quarterly' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
            style={view === 'quarterly' ? { color: themeColor } : {}}
          >
            Quarterly
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="relative h-64 flex items-end justify-between gap-1 md:gap-2 mb-8 px-2">
        {/* Y-Axis Guidelines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full border-t border-gray-50 border-dashed"></div>
          ))}
        </div>

        {currentData.map((data, index) => {
          const barHeight = (data.orders / maxOrders) * 100;
          const isLast = index === currentData.length - 1;

          return (
            <div key={data.label} className="relative flex-1 flex flex-col items-center group h-full justify-end">
              {/* Tooltip */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                <div className="bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded shadow-xl whitespace-nowrap">
                  {data.orders} Orders
                </div>
              </div>

              {/* Bar */}
              <div 
                className="w-full transition-all duration-500 ease-out relative z-10 group-hover:brightness-110"
                style={{ 
                  height: `${barHeight}%`,
                  maxWidth: view === 'monthly' ? '28px' : '70px',
                  backgroundColor: isLast ? themeColor : `${themeColor}20`,
                  borderRadius: '8px 8px 0 0',
                  background: isLast ? `linear-gradient(to top, ${themeColor}, #ff8c66)` : ''
                }}
              >
                {isLast && (
                   <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-lg"></div>
                )}
              </div>

              {/* Label */}
              <span 
                className="mt-3 text-[10px] font-bold uppercase tracking-tighter transition-colors"
                style={{ color: isLast ? themeColor : '#9ca3af' }}
              >
                {data.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Original Bottom Stats Cards (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-gray-100 relative z-10">
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-gray-50 flex flex-col items-center justify-center hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all">
          <p className="text-3xl font-black text-gray-900">{totalOrders}</p>
          <p className="text-[11px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Total Orders</p>
        </div>

        <div 
          className="p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden group"
          style={{ backgroundColor: themeColor, boxShadow: `0 15px 30px ${themeColor}40` }}
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <p className="text-3xl font-black text-white relative z-10">{currentData[currentData.length - 1].orders}</p>
          <p className="text-[11px] font-bold text-white/80 uppercase mt-1 tracking-widest relative z-10">Latest {view === 'monthly' ? 'Month' : 'Quarter'}</p>
        </div>

        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50 flex flex-col items-center justify-center hover:bg-white hover:shadow-xl hover:shadow-emerald-200/40 transition-all">
          <div className="flex items-center gap-1">
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            <p className="text-3xl font-black text-emerald-600">24%</p>
          </div>
          <p className="text-[11px] font-bold text-emerald-600/60 uppercase mt-1 tracking-widest">Growth vs LY</p>
        </div>
      </div>
    </div>
  );
};

export default OrdersChart;