import React from "react";

const ConfirmDesignModal = ({ open, onClose, onConfirm, customerDesignId ,saving}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-2xl bg-white border border-gray-200 shadow-2xl rounded-none">
                <div className="p-5 border-b border-gray-200">
                    <h2 className="text-xl font-black text-gray-900">
                        Confirm the following statement
                    </h2>
                </div>

                <div className="p-5 space-y-4 text-sm text-gray-700 leading-6">
                    <p>I have adjusted each product size separately.</p>

                    <p>
                        I have fully filled the template area with my images or colour and I understand if I have not this will result in white areas on my product.
                    </p>

                    <p>
                        Any text is spelt correctly and within the safe print area.
                    </p>
                </div>

                <div className="p-5 border-t border-gray-200 flex items-center justify-end gap-3">
                    {/* <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                    >
                        Makes Changes
                    </button> */}

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-[#f05a28] text-white text-sm font-semibold hover:opacity-90 transition cursor-pointer"
                    >
                       {saving ? "Saving..."  : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDesignModal;