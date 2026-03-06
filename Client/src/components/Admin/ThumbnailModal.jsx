import { Upload, Trash2, Pencil, X } from "lucide-react";
import { useState } from "react";

const ThumbnailModal = ({
  open,
  onClose,
  thumbnail,
  setThumbnail,
  preview,
  setPreview,
  productId,
  isEditMode,
  onUpdateThumbnail, // Parent se function receive karein
  onRemoveThumbnail, // Parent se function receive karein
  existingThumbnailUrl // Existing thumbnail URL for edit mode
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleFile = (file) => {
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdateThumbnail = async () => {
    if (!thumbnail && !preview) {
      alert("Please select an image first");
      return;
    }

    setIsLoading(true);
    try {
      if (onUpdateThumbnail) {
        await onUpdateThumbnail();
      }
    } catch (error) {
      console.error("Error in thumbnail modal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveThumbnail = () => {
    if (window.confirm("Are you sure you want to remove this thumbnail?")) {
      if (onRemoveThumbnail) {
        onRemoveThumbnail();
      }
      onClose();
    }
  };

  const handleClearSelection = () => {
    setThumbnail(null);
    setPreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {isEditMode ? (preview ? 'Edit Thumbnail' : 'Add Thumbnail') : 'Preview Thumbnail'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview Area */}
        {preview ? (
          <div className="mb-6">
            <div className="relative border-2 border-dashed rounded-lg p-4 bg-gray-50">
              <img
                src={preview}
                alt="thumbnail"
                className="w-full h-48 object-contain rounded-lg"
              />
              
              {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-2">
                  {/* Edit Button */}
                  <label className="bg-blue-500 text-white p-2 rounded-full shadow cursor-pointer hover:bg-blue-600">
                    <Pencil size={16} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFile(e.target.files[0])}
                    />
                  </label>
                  
                  {/* Clear Selection Button */}
                  <button
                    onClick={handleClearSelection}
                    className="bg-gray-500 text-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            
            {thumbnail && (
              <div className="mt-2 text-sm text-gray-600">
                <p>File: {thumbnail.name}</p>
                <p>Size: {(thumbnail.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
          </div>
        ) : existingThumbnailUrl && !isEditMode ? (
          // View only mode
          <div className="mb-6">
            <div className="border-2 border-dashed rounded-lg p-4 bg-gray-50">
              <img
                src={existingThumbnailUrl}
                alt="current thumbnail"
                className="w-full h-48 object-contain rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              Current thumbnail (view only)
            </p>
          </div>
        ) : (
          // Upload area for new thumbnail
          <div className="mb-6">
            <label
              className="border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:border-orange-400 hover:bg-orange-50 transition"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files[0]);
              }}
            >
              <Upload size={32} className="mb-2" />
              <p className="text-sm font-medium">Click or drag image here</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </label>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          {isEditMode && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              
              {/* Remove Button - only show if there's a thumbnail to remove */}
              {existingThumbnailUrl && (
                <button
                  onClick={handleRemoveThumbnail}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  disabled={isLoading}
                >
                  Remove
                </button>
              )}
              
              {/* Update/Save Button */}
              <button
                onClick={handleUpdateThumbnail}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition flex items-center gap-2"
                disabled={isLoading || (!thumbnail && !preview)}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  'Save Thumbnail'
                )}
              </button>
            </>
          )}
          
          {!isEditMode && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Close
            </button>
          )}
        </div>

        {/* Help Text */}
        {isEditMode && (
          <p className="text-xs text-gray-500 mt-4">
            Note: After saving, the thumbnail will be updated for this product.
          </p>
        )}
      </div>
    </div>
  );
};

export default ThumbnailModal;