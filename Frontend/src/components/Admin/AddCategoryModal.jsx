import React from 'react';
import { Modal, Box, TextField } from '@mui/material';

function AddCategoryModal({
  open,
  onClose,
  newCategory,
  setNewCategory,
  categoryThumbnailPreview,
  setCategoryThumbnail,
  setCategoryThumbnailPreview,
  onAdd,
  isEdit,
}) {
  const handleFile = (file) => {
    if (!file) return;
    setCategoryThumbnail(file);
    setCategoryThumbnailPreview(URL.createObjectURL(file));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 420,
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 2,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Add Category</h2>

        <TextField
          label="Category Name"
          fullWidth
          size="small"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />

        {/* Thumbnail Upload */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Category Thumbnail
          </label>

          {!categoryThumbnailPreview ? (
            <div
              className="flex items-center justify-center h-32 border-2 border-dashed rounded-md cursor-pointer hover:border-ocean transition text-gray-500"
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() =>
                document.getElementById('categoryThumbInput').click()
              }
            >
              <span>Click or Drag & Drop to upload image</span>

              <input
                id="categoryThumbInput"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="relative w-full h-32 border rounded-md overflow-hidden">
              <img
                src={categoryThumbnailPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => {
                  setCategoryThumbnail(null);
                  setCategoryThumbnailPreview('');
                }}
                className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onAdd}
            className="px-4 py-2 text-sm bg-ocean text-white rounded-md cursor-pointer"
          >
            {isEdit ? "Update Category" : "Add Category"} {/* ✅ now works */}
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default AddCategoryModal;
