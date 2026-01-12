export default function TabButton({ active, onClick, label, icon }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-shadow ${active ? "shadow-md" : "hover:shadow-sm"} cursor-pointer`}
            style={{ background: active ? "rgba(59,109,146,0.06)" : "transparent" }}
        >
            <div className="w-8 h-8 flex items-center justify-center rounded-md" style={{ background: "rgba(0,0,0,0.03)" }}>
                {icon}
            </div>
            <div className="text-sm font-medium" style={{ color: active ? "#3b6d92" : "#374151" }}>
                {label}
            </div>
        </button>
    );
}