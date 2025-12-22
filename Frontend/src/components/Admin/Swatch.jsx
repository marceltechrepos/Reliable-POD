export default function Swatch({ color, label }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ background: color }} />
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    );
}