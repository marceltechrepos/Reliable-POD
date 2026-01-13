import React from "react";

const AddSubCategoryModal = ({
  open,
  onClose,
  title,
  setTitle,
  description,
  setDescription,
  setThumbnail,
  thumbnailPreview,
  setThumbnailPreview,
  onAdd,
}) => {
  if (!open) return null; // 🔥 SIMPLE & LIGHT (same as your Category modal)

  const thumbnailChangeHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Add Sub Category
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Sub Category Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md px-3 py-2 outline-none"
          />

          <textarea
            rows="3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md px-3 py-2 outline-none"
          />

          <input className="border-1 w-full p-2 rounded-md cursor-pointer" type="file" onChange={thumbnailChangeHandler} />

          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="preview"
              className="h-32 w-full object-cover rounded-md"
            />
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onAdd}
            className="cursor-pointer px-4 py-2 bg-ocean text-white rounded-md hover:bg-hoverTiger"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryModal;
