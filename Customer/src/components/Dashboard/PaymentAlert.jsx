import React, { useState } from 'react';
import { AlertTriangle, X, CreditCard, ArrowRight } from 'lucide-react';

const PaymentAlert = () => {
    const [isVisible, setIsVisible] = useState(true);
    const themeColor = "#f05a28";

    if (!isVisible) return null;

    return (
        <div 
            className="rounded-2xl p-5 mb-6 mt-6 border relative overflow-hidden transition-all duration-300 shadow-sm"
            style={{ 
                backgroundColor: `${themeColor}05`, // Ultra light tint
                borderColor: `${themeColor}20` 
            }}
        >
            {/* Subtle Left Accent Line */}
            <div 
                className="absolute left-0 top-0 bottom-0 w-1.5"
                style={{ backgroundColor: themeColor }}
            ></div>

            <div className="flex items-start gap-4">
                <div 
                    className="flex-shrink-0 p-2.5 rounded-xl"
                    style={{ backgroundColor: `${themeColor}15` }}
                >
                    <AlertTriangle className="w-5 h-5" style={{ color: themeColor }} />
                </div>

                <div className="flex-1">
                    <h3 className="text-base font-black text-gray-900 tracking-tight">
                        Payment Method Required
                    </h3>
                    <div className="mt-1.5 text-sm text-gray-600 font-medium leading-relaxed max-w-2xl">
                        <p>
                            You need to add a payment method to start processing orders. 
                            <span className="font-bold text-gray-800 ml-1">Orders will be accepted</span> but not processed until your configuration is complete.
                        </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-4">
                        <button 
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                            style={{ 
                                backgroundColor: themeColor,
                                boxShadow: `0 8px 20px ${themeColor}30`
                            }}
                        >
                            <CreditCard className="w-4 h-4" />
                            Add Payment Method
                        </button>
                        
                        <button 
                            className="flex items-center gap-1.5 text-sm font-bold transition-colors group"
                            style={{ color: themeColor }}
                        >
                            Learn More
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default PaymentAlert;