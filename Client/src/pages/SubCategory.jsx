

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AddSubCategoryModal from "../components/Admin/AddSubCategoryModal";
import { createSubCategory, getSubCategoriesByParent } from "../api/subCategory.api";
import { toast } from "react-toastify";

const SubCategoryPage = () => {
  const { categoryId } = useParams();

  const [subCategories, setSubCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const openAddModal = () => {
    setTitle("");
    setDescription("");
    setThumbnail(null);
    setThumbnailPreview("");
    setOpenModal(true);
  };

  useEffect(() => {
    if (!categoryId) return;

    const fetchSubCategories = async () => {
      const data = await getSubCategoriesByParent(categoryId);

      const formatted = data.map((item) => ({
        id: item._id,
        title: item.name,
        description: item.description,
        thumbnail: item.thumbnail?.url,
      }));

      setSubCategories(formatted);
    };

    fetchSubCategories();
  }, [categoryId]);


  const addSubCategoryHandler = async () => {
    if (!title.trim()) {
      toast.error("Title required");
      return;
    }

    const res = await createSubCategory({
      name: title,
      description,
      thumbnail,
      parent: categoryId,
    });

    if (res.success) {
      const updated = await getSubCategoriesByParent(categoryId);

      setSubCategories(
        updated.map((item) => ({
          id: item._id,
          title: item.name,
          description: item.description,
          thumbnail: item.thumbnail?.url,
        }))
      );

      setOpenModal(false);
    } else {
      toast.error("Failed to create sub category");
    }
  };


  return (
    <div className="w-full bg-slate-100 min-h-screen p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sub Categories</h1>
        </div>

        <button
          onClick={openAddModal}
          className="cursor-pointer text-sm shadow-lg bg-ocean hover:bg-hoverTiger rounded-md text-white py-2 px-4"
        >
          + Add Sub Category
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {subCategories.map((sub) => (
          <Link to={`/admin/sub-category/${sub.id}`}>
            <div
              key={sub.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border cursor-pointer"
            >
              <div className="h-52 bg-gray-100">
                {sub.thumbnail ? (
                  <img
                    src={sub.thumbnail}
                    alt={sub.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{sub.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {sub.description}
                </p>
              </div>
            </div>
          </Link>

        ))}
      </div>

      {/* Modal */}
      <AddSubCategoryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        setThumbnail={setThumbnail}
        thumbnailPreview={thumbnailPreview}
        setThumbnailPreview={setThumbnailPreview}
        onAdd={addSubCategoryHandler}
      />
    </div>
  );
};

export default SubCategoryPage;

