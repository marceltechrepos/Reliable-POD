import React from 'react';

    const OrdersChart = () => {
      const monthlyData = [
        { month: 'Jan', orders: 12 },
        { month: 'Feb', orders: 19 },
        { month: 'Mar', orders: 15 },
        { month: 'Apr', orders: 25 },
        { month: 'May', orders: 22 },
        { month: 'Jun', orders: 30 },
        { month: 'Jul', orders: 28 },
        { month: 'Aug', orders: 35 },
        { month: 'Sep', orders: 32 },
        { month: 'Oct', orders: 40 },
        { month: 'Nov', orders: 38 },
        { month: 'Dec', orders: 45 }
      ];

      const maxOrders = Math.max(...monthlyData.map(d => d.orders));

      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Orders Overview</h3>
              <p className="text-sm text-gray-600">Monthly order volume</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-600">Orders</span>
            </div>
          </div>

          <div className="flex items-end justify-between h-64 space-x-2">
            {monthlyData.map((data, index) => {
              const height = (data.orders / maxOrders) * 100;
              const isCurrentMonth = index === new Date().getMonth();
              
              return (
                <div key={data.month} className="flex flex-col items-center flex-1">
                  <div className="w-full flex items-end justify-center mb-2" style={{ height: '200px' }}>
                    <div
                      className={`w-full max-w-8 rounded-t-md transition-all duration-500 ease-out hover:opacity-80 cursor-pointer ${
                        isCurrentMonth ? 'bg-blue-600' : 'bg-blue-200'
                      }`}
                      style={{ height: `${height}%` }}
                      title={`${data.orders} orders in ${data.month}`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{data.month}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">45</p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">+18%</p>
              <p className="text-sm text-gray-600">Growth</p>
            </div>
          </div>
        </div>
      );
    };

    export default OrdersChart;