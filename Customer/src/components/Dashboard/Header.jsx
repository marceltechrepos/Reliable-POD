import React from 'react';
import { Calendar, TrendingUp, Bell, HelpCircle } from 'lucide-react';

const Header = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        {/* Left Section - Welcome Message */}
        <div className="mb-6 md:mb-0 md:mr-8">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back, John!</h1>
            <div className="hidden sm:inline-block bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full">
              <span className="text-xs font-medium">Pro Plan</span>
            </div>
          </div>
          <p className="text-blue-100 mb-4">
            Here's what's happening with your store today.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-blue-100">{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-blue-100">+12% from last week</span>
            </div>
          </div>
        </div>

        {/* Right Section - Stats & Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Today's Orders */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-sm text-blue-100 mb-1">Today's Orders</p>
            <p className="text-2xl font-bold">24</p>
            <div className="text-xs text-green-300 mt-1 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3 from yesterday
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-sm text-blue-100 mb-1">Revenue</p>
            <p className="text-2xl font-bold">$1,245</p>
            <div className="text-xs text-green-300 mt-1 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2%
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center space-x-2">
            <button className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </button>
            <button className="bg-transparent border border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar for Daily Goals */}
      <div className="mt-6 pt-6 border-t border-blue-500 border-opacity-30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Daily goal progress</span>
          <span className="text-sm font-bold">75%</span>
        </div>
        <div className="w-full bg-blue-500 bg-opacity-30 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500 ease-out"
            style={{ width: '75%' }}
          ></div>
        </div>
        <p className="text-xs text-blue-200 mt-2">
          You've completed 15 of 20 daily orders target
        </p>
      </div>
    </div>
  );
};

export default Header;