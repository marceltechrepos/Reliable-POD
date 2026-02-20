import React from 'react';

const StatsCard = ({ title, value, change, icon: Icon, trend }) => {
    const isPositive = trend === 'up';

    return (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
                    {change && (
                        <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            <span className={`inline-block w-0 h-0 mr-1 ${isPositive
                                ? 'border-l-2 border-r-2 border-b-2 border-l-transparent border-r-transparent border-b-green-600'
                                : 'border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-red-600'
                                }`}></span>
                            {change}
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;