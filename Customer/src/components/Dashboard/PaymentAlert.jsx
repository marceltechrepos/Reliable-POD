import React, { useState } from 'react';
import { AlertTriangle, X, CreditCard } from 'lucide-react';

const PaymentAlert = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 mt-6">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                        Payment Method Required
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                        <p>
                            You need to add a payment method to start processing orders.
                            Orders will be accepted but not processed until payment is configured.
                        </p>
                    </div>
                    <div className="mt-4">
                        <div className="flex space-x-3">
                            <button className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                                <CreditCard className="w-4 h-4" />
                                <span>Add Payment Method</span>
                            </button>
                            <button className="text-red-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
                <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentAlert;