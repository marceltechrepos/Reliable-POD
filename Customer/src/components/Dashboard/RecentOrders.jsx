import React, { useState } from 'react';
import { MoreVertical, Eye, Download } from 'lucide-react';

const RecentOrders = () => {
    const [orders] = useState([
        {
            id: 'ORD-1001',
            customer: 'John Smith',
            email: 'john@example.com',
            total: '$125.00',
            status: 'Completed',
            date: '2026-01-15',
            items: 3
        },
        {
            id: 'ORD-1002',
            customer: 'Sarah Johnson',
            email: 'sarah@example.com',
            total: '$89.50',
            status: 'Processing',
            date: '2026-01-14',
            items: 2
        },
        {
            id: 'ORD-1003',
            customer: 'Mike Wilson',
            email: 'mike@example.com',
            total: '$234.00',
            status: 'Shipped',
            date: '2026-01-13',
            items: 5
        },
        {
            id: 'ORD-1004',
            customer: 'Emily Davis',
            email: 'emily@example.com',
            total: '$67.25',
            status: 'Pending',
            date: '2026-01-12',
            items: 1
        }
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Processing':
                return 'bg-blue-100 text-blue-800';
            case 'Shipped':
                return 'bg-purple-100 text-purple-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                    <p className="text-sm text-gray-600">Latest customer orders</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <Download className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                        View All
                    </button>
                </div>
            </div>

            <div className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Order</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Customer</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Date</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Total</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{order.id}</p>
                                            <p className="text-sm text-gray-500">{order.items} items</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{order.customer}</p>
                                            <p className="text-sm text-gray-500">{order.email}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-sm text-gray-900">
                                            {new Date(order.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="font-medium text-gray-900">{order.total}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center space-x-2">
                                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RecentOrders;