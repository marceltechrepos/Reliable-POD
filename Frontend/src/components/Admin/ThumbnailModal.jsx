import { Upload, Trash2, Pencil } from "lucide-react";

const ThumbnailModal = ({
  open,
  onClose,
  thumbnail,
  setThumbnail,
  preview,
  setPreview,
}) => {
  if (!open) return null;

  const handleFile = (file) => {
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[360px] rounded-xl p-5 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Add Thumbnail</h3>

        {!preview ? (
          <label
            className="border-2 border-dashed rounded-lg h-40 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:border-orange-400 transition"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files[0]);
            }}
          >
            <Upload size={28} />
            <p className="text-sm mt-2">Click or drag image here</p>
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="thumbnail"
              className="w-full h-40 object-cover rounded-lg"
            />

            {/* remove */}
            <button
              onClick={() => {
                setThumbnail(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow cursor-pointer"
            >
              <Trash2 size={16} />
            </button>

            {/* edit */}
            <label className="absolute top-2 left-2 bg-blue-500 text-white p-2 rounded-full shadow cursor-pointer">
              <Pencil size={16} />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </label>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-orange-500 text-white rounded-md cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailModal;
