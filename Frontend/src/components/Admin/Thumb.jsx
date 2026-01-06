export default function Thumb({ color, image }) {
    return (
        <div className="w-8 h-6 rounded overflow-hidden flex items-center justify-center" style={{ background: image ? "transparent" : color }}>
            {image ? <img src={image} alt="thumb" className="w-full h-full object-cover" /> : null}
        </div>
    );
}