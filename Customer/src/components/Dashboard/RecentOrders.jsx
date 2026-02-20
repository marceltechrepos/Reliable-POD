import React, { useState, useMemo } from 'react';
import { MoreVertical, Eye, Download, Search, Filter, ArrowUpRight } from 'lucide-react';

const RecentOrders = () => {

    const primaryColor = "#f05a28";
    const ordersPerPage = 3;

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const [orders] = useState([
        { id: 'ORD-1001', customer: 'John Smith', initials: 'JS', email: 'john@example.com', total: '$125.00', status: 'Completed', date: '2026-01-15', items: 3 },
        { id: 'ORD-1002', customer: 'Sarah Johnson', initials: 'SJ', email: 'sarah@example.com', total: '$89.50', status: 'Processing', date: '2026-01-14', items: 2 },
        { id: 'ORD-1003', customer: 'Mike Wilson', initials: 'MW', email: 'mike@example.com', total: '$234.00', status: 'Shipped', date: '2026-01-13', items: 5 },
        { id: 'ORD-1004', customer: 'Emily Davis', initials: 'ED', email: 'emily@example.com', total: '$67.25', status: 'Pending', date: '2026-01-12', items: 1 },
        { id: 'ORD-1005', customer: 'Chris Brown', initials: 'CB', email: 'chris@example.com', total: '$99.00', status: 'Processing', date: '2026-01-11', items: 4 },
    ]);

    // 🔎 Filter + Search Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'All' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, orders]);

    // 📄 Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8">

            {/* Header */}
            <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-white to-[#f05a28]/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div>
                        <h3 className="text-xl font-black text-gray-900">Recent Orders</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage and track your latest store transactions
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        {/* Search */}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search order..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#f05a28]/30 outline-none"
                            />
                        </div>

                        {/* Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f05a28]/30 outline-none"
                        >
                            <option value="All">All</option>
                            <option value="Completed">Completed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Pending">Pending</option>
                        </select>

                        {/* Export */}
                        <button
                            className="px-4 py-2 text-white rounded-xl text-sm font-bold"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Download className="w-4 h-4 inline mr-1" />
                            Export
                        </button>

                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-xs uppercase text-gray-400">
                        <tr>
                            <th className="py-4 px-6">Order ID</th>
                            <th className="py-4 px-6">Customer</th>
                            <th className="py-4 px-6">Date</th>
                            <th className="py-4 px-6">Total</th>
                            <th className="py-4 px-6">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {paginatedOrders.map(order => (
                            <tr key={order.id} className="hover:bg-[#f05a28]/5 transition">
                                <td className="py-4 px-6 font-bold text-sm">{order.id}</td>
                                <td className="py-4 px-6 text-sm">{order.customer}</td>
                                <td className="py-4 px-6 text-sm">
                                    {new Date(order.date).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 font-black text-sm">{order.total}</td>
                                <td className="py-4 px-6">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f05a28]/10 text-[#f05a28]">
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {paginatedOrders.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-400">
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Pagination */}
            <div className="p-5 border-t border-gray-50 bg-slate-50/30 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400">
                    Showing {paginatedOrders.length} of {filteredOrders.length} Orders
                </p>

                <div className="flex gap-2">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-xs font-bold bg-white border rounded-lg disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-4 py-2 text-xs font-bold text-white rounded-lg"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecentOrders;
