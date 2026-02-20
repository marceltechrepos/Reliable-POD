import React from 'react';
import { Plus, Eye, Settings, BookOpen, Play, CreditCard, ChevronRight } from 'lucide-react';

const QuickActions = () => {
  const themeColor = "#f05a28";
  
  const actions = [
    { title: 'Create Product', description: 'Add new item to catalog', icon: Plus },
    { title: 'View Orders', description: 'Check recent orders', icon: Eye },
    { title: 'Settings', description: 'Configure your store', icon: Settings },
    { title: 'Guide', description: 'Getting started help', icon: BookOpen },
    { title: 'Video Tutorials', description: 'Watch how-to videos', icon: Play },
    { title: 'Payment Setup', description: 'Configure payments', icon: CreditCard }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 mt-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Quick Actions</h3>
          <p className="text-sm text-gray-500 font-medium mt-1">Common tasks for your daily operations</p>
        </div>
        <div 
          className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
          style={{ backgroundColor: themeColor }}
        >
          Priority
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className="group p-5 rounded-2xl border border-gray-50 bg-slate-50/30 hover:bg-white hover:border-transparent hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 text-left relative overflow-hidden"
            >
              {/* Subtle Background Glow on Hover */}
              <div 
                className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: themeColor }}
              ></div>

              <div className="flex items-center gap-4 relative z-10">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm"
                  style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-black text-gray-900 group-hover:text-gray-900 transition-colors">
                      {action.title}
                    </p>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: themeColor }} />
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5 leading-tight">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;