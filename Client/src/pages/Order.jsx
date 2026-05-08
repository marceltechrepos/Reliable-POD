import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { getOrders, updateOrder } from '../api/order.api';
import { toast } from 'react-toastify';

// Elegant SVG Icons
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const PackageIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await getOrders();
            if (res.success) {
                setOrders(res.data);
            } else {
                toast.error(res.message || "Failed to fetch orders");
            }
        } catch (error) {
            toast.error("Error fetching orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await updateOrder(orderId, { fulfillment_status: newStatus });
            if (res.success) {
                toast.success("Order status beautifully updated!");
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, fulfillment_status: newStatus } : o));
            } else {
                toast.error(res.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const getPaymentBadge = (status) => {
        const s = (status || 'pending').toLowerCase();
        if (s === 'paid') return "bg-emerald-100/80 text-emerald-700 ring-1 ring-emerald-600/20";
        if (s === 'pending') return "bg-amber-100/80 text-amber-700 ring-1 ring-amber-600/20";
        if (s === 'failed') return "bg-rose-100/80 text-rose-700 ring-1 ring-rose-600/20";
        return "bg-slate-100/80 text-slate-700 ring-1 ring-slate-600/20";
    };

    return (
        <div className="w-full bg-slate-50 min-h-screen relative font-sans">
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#3B6D92]/10 to-transparent pointer-events-none"></div>

            <div className="p-6 md:p-10 relative z-10">
                <Breadcrumbs />
                
                {/* Premium Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-8 mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200/60 text-[#3B6D92]">
                                <PackageIcon className="w-6 h-6" />
                            </div>
                            Order Management
                        </h1>
                        <p className="text-slate-500 mt-2 ml-1 text-sm font-medium">Track, fulfill, and manage your incoming Shopify orders effortlessly.</p>
                    </div>
                </div>

                {/* Floating Glassmorphic Table Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden transition-all duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100">
                                    <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Order</th>
                                    <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Date</th>
                                    <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Customer</th>
                                    <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Total</th>
                                    <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Payment</th>
                                    <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Fulfillment</th>
                                    <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="p-16 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <div className="w-10 h-10 border-4 border-[#3B6D92]/20 border-t-[#3B6D92] rounded-full animate-spin"></div>
                                                <p className="text-slate-400 font-semibold tracking-wide animate-pulse">Syncing orders...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-16 text-center">
                                            <div className="bg-slate-50 rounded-3xl p-10 max-w-sm mx-auto border border-dashed border-slate-200">
                                                <PackageIcon className="mx-auto text-slate-300 w-16 h-16 mb-4" />
                                                <p className="text-slate-600 font-bold text-lg">No orders found</p>
                                                <p className="text-slate-400 text-sm mt-2 font-medium">Incoming Shopify orders will automatically securely appear here.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                                            <td className="p-5">
                                                <span 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="font-extrabold text-[#3B6D92] hover:text-[#2c526d] cursor-pointer transition-colors"
                                                >
                                                    {order.order_name || `#${order.order_number}`}
                                                </span>
                                            </td>
                                            <td className="p-5 text-sm text-slate-600 font-semibold">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3B6D92] to-blue-400 flex items-center justify-center text-white font-extrabold text-sm shadow-sm ring-2 ring-white">
                                                        {order.customer?.first_name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{order.customer?.first_name} {order.customer?.last_name}</p>
                                                        <p className="text-xs text-slate-500 font-medium mt-0.5">{order.customer?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="text-sm font-extrabold text-slate-700">${parseFloat(order.total_price).toFixed(2)} <span className="text-[10px] font-bold text-slate-400 uppercase">{order.currency}</span></span>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide shadow-sm ${getPaymentBadge(order.payment_status)}`}>
                                                    {(order.payment_status || 'Pending').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="relative group/select">
                                                    <select 
                                                        value={order.fulfillment_status || 'unfulfilled'}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        className="appearance-none bg-white border border-slate-200 hover:border-[#3B6D92] text-slate-700 text-xs font-bold rounded-xl px-4 py-2.5 pr-9 outline-none cursor-pointer transition-all focus:ring-4 focus:ring-[#3B6D92]/10 shadow-sm"
                                                    >
                                                        <option value="unfulfilled">Unfulfilled</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="fulfilled">Fulfilled</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400 group-hover/select:text-[#3B6D92] transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-center">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="inline-flex items-center justify-center gap-2 bg-white text-[#3B6D92] border border-slate-200 hover:border-[#3B6D92] hover:bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wide transition-all duration-200 shadow-sm hover:shadow active:scale-95"
                                                >
                                                    <EyeIcon />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* DETAILS MODAL - Glassmorphic Premium Design */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity duration-300">
                    {/* Dark Backdrop with Blur */}
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedOrder(null)}
                    ></div>
                    
                    {/* Premium Modal Content */}
                    <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all scale-100 opacity-100 border border-white/60">
                        
                        {/* Header Gradient */}
                        <div className="px-8 py-7 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                            <div>
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-1.5">Order Overview</p>
                                <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
                                    {selectedOrder.order_name || `#${selectedOrder.order_number}`}
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-widest ${getPaymentBadge(selectedOrder.payment_status)}`}>
                                        {(selectedOrder.payment_status || 'Pending').toUpperCase()}
                                    </span>
                                </h2>
                            </div>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all focus:outline-none hover:rotate-90"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                            
                            {/* Grid Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Customer Details Card */}
                                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center ring-1 ring-blue-500/20">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        </div>
                                        <h3 className="font-extrabold text-slate-800 tracking-wide">Customer Details</h3>
                                    </div>
                                    <div className="space-y-1.5 pl-1">
                                        <p className="text-slate-800 font-bold text-lg">{selectedOrder.customer?.first_name} {selectedOrder.customer?.last_name}</p>
                                        <p className="text-slate-500 font-medium text-sm">{selectedOrder.customer?.email}</p>
                                        {selectedOrder.customer?.phone && <p className="text-slate-500 font-medium text-sm">{selectedOrder.customer.phone}</p>}
                                    </div>
                                </div>

                                {/* Shipping Address Card */}
                                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center ring-1 ring-emerald-500/20">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                        </div>
                                        <h3 className="font-extrabold text-slate-800 tracking-wide">Shipping Address</h3>
                                    </div>
                                    <div className="space-y-1 pl-1">
                                        <p className="text-slate-800 font-bold">{selectedOrder.shipping_address?.name || `${selectedOrder.customer?.first_name} ${selectedOrder.customer?.last_name}`}</p>
                                        <p className="text-slate-500 font-medium text-sm mt-1">{selectedOrder.shipping_address?.address1}</p>
                                        {selectedOrder.shipping_address?.address2 && <p className="text-slate-500 font-medium text-sm">{selectedOrder.shipping_address.address2}</p>}
                                        <p className="text-slate-500 font-medium text-sm">{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.province} {selectedOrder.shipping_address?.zip}</p>
                                        <p className="text-slate-500 font-medium text-sm">{selectedOrder.shipping_address?.country}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Line Items Structured List */}
                            <div className="mb-8">
                                <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2 tracking-wide">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                    Purchased Items 
                                    <span className="bg-[#3B6D92]/10 text-[#3B6D92] text-xs font-bold px-2.5 py-0.5 rounded-full ml-1">
                                        {selectedOrder.line_items?.length || 0}
                                    </span>
                                </h3>
                                <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
                                    {selectedOrder.line_items?.map((item, idx) => (
                                        <div key={idx} className={`p-5 flex justify-between items-center hover:bg-slate-50/80 transition-colors ${idx !== 0 ? 'border-t border-slate-100' : ''}`}>
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 border border-slate-200/50">
                                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-slate-800">{item.name || item.title}</p>
                                                    <div className="flex gap-2.5 mt-1.5">
                                                        <span className="text-[10px] font-bold tracking-widest text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase">SKU: {item.sku}</span>
                                                        <span className="text-[10px] font-bold tracking-widest text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase">QTY: {item.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="font-black text-slate-800 text-lg tracking-tight">
                                                ${parseFloat(item.price).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-7 border border-slate-200 shadow-inner">
                                <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2 tracking-wide">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Financial Summary
                                </h3>
                                <div className="space-y-3.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-bold">Subtotal</span>
                                        <span className="font-extrabold text-slate-700">${parseFloat(selectedOrder.subtotal_price).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-bold">Tax</span>
                                        <span className="font-extrabold text-slate-700">${parseFloat(selectedOrder.total_tax).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-bold">Discount</span>
                                        <span className="font-extrabold text-emerald-600">-${parseFloat(selectedOrder.total_discounts || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-end mt-5 pt-5 border-t-2 border-slate-200/60">
                                        <span className="text-lg font-black text-slate-800 uppercase tracking-wider">Total</span>
                                        <div className="text-right">
                                            <span className="text-3xl font-black text-[#3B6D92] tracking-tighter">${parseFloat(selectedOrder.total_price).toFixed(2)}</span>
                                            <span className="text-xs font-black text-slate-400 ml-1.5 tracking-widest">{selectedOrder.currency}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Footer Button Group */}
                        <div className="px-8 py-5 border-t border-slate-200/80 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2.5 rounded-xl text-xs font-extrabold tracking-widest uppercase text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                            >
                                Close
                            </button>
                            <button 
                                onClick={() => {
                                    toast.info("Invoice generation coming soon!");
                                }}
                                className="px-6 py-2.5 rounded-xl text-xs font-extrabold tracking-widest uppercase text-white bg-[#3B6D92] hover:bg-[#2c526d] shadow-[0_4px_14px_0_rgba(59,109,146,0.39)] hover:shadow-[0_6px_20px_rgba(59,109,146,0.23)] transition-all active:scale-95"
                            >
                                Download Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Order;