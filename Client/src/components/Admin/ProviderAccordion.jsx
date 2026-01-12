export default function ProviderAccordion({ open, onToggle, title, subtitle, children }) {
    return (
         <div className="border-none rounded-xl overflow-hidden bg-white">
            {/* Header */}
            <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition">
                {/* LEFT CONTENT */}
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-800">{title}</span>
                    <span className="text-xs text-gray-500">{subtitle}</span>
                </div>

                {/* RIGHT ICON */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {/* BODY (SMOOTH OPEN) */}
            <div className={`transition-all duration-300 ease-in-out ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                <div className="px-5 pb-5 pt-2">{children}</div>
            </div>
        </div>
    );
}