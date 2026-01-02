import React, { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import AddCategoryModal from "../components/Admin/AddCategoryModal";
import {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory,
} from "../api/category.api";

function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [categoryThumbnail, setCategoryThumbnail] = useState(null);
    const [categoryThumbnailPreview, setCategoryThumbnailPreview] = useState("");

    const [isEdit, setIsEdit] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);

    // Fetch all categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategory();
                const formattedCategories = data.map((item) => ({
                    id: item._id,
                    label: item.category,
                    value: item.category.toLowerCase().replace(/\s+/g, "-"),
                    thumbnail: item.thumbnail.url,
                    createdAt: item.createdAt,
                }));
                setCategories(formattedCategories);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    // Open Add Modal
    const openAddModal = () => {
        setIsEdit(false);
        setEditCategoryId(null);
        setNewCategory("");
        setCategoryThumbnail(null);
        setCategoryThumbnailPreview("");
        setOpenCategoryModal(true);
    };

    // Open Edit Modal
    const openEditModal = (cat) => {
        setIsEdit(true);
        setEditCategoryId(cat.id);
        setNewCategory(cat.label);
        setCategoryThumbnail(null); // optional: new thumbnail upload
        setCategoryThumbnailPreview(cat.thumbnail);
        setOpenCategoryModal(true);
    };

    // Delete Category
    const deleteCategoryHandler = async (id) => {
        const confirmDelete = window.confirm("Are you sure?");
        if (!confirmDelete) return;

        const res = await deleteCategory(id);
        if (!res.success) {
            alert(res.message || "Failed to delete category");
            return;
        }

        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    // Submit handler → Add or Edit
    const submitCategoryHandler = async () => {
        if (!newCategory.trim()) {
            alert("Category name required!");
            return;
        }

        const formData = new FormData();
        formData.append("category", newCategory.trim());
        if (categoryThumbnail) formData.append("thumbnail", categoryThumbnail);

        let res;
        if (isEdit) {
            res = await updateCategory(editCategoryId, formData);
        } else {
            if (!categoryThumbnail) {
                alert("Thumbnail required for new category!");
                return;
            }
            res = await createCategory(formData);
        }

        if (!res.success) {
            alert(res.message || "Something went wrong");
            return;
        }

        // Update local state
        if (isEdit) {
            setCategories((prev) =>
                prev.map((cat) =>
                    cat.id === editCategoryId
                        ? { ...cat, label: res.data.category, thumbnail: res.data.thumbnail.url }
                        : cat
                )
            );
        } else {
            setCategories((prev) => [
                ...prev,
                {
                    id: res.data._id,
                    label: res.data.category,
                    value: res.data.category.toLowerCase().replace(/\s+/g, "-"),
                    thumbnail: res.data.thumbnail.url,
                    createdAt: res.data.createdAt,
                },
            ]);
        }

        // Reset modal
        setIsEdit(false);
        setEditCategoryId(null);
        setNewCategory("");
        setCategoryThumbnail(null);
        setCategoryThumbnailPreview("");
        setOpenCategoryModal(false);
    };

    return (
        <div className="w-full bg-slate-100 min-h-screen">
            <div className="p-10">
                <Breadcrumbs />

                {/* Header */}
                <div className="flex justify-between items-center mt-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                    <button
                        onClick={openAddModal}
                        className="cursor-pointer flex items-center gap-2 text-sm shadow-lg bg-ocean hover:bg-hoverTiger rounded-md text-white py-2 px-4"
                    >
                        + Add Category
                    </button>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 cursor-pointer">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border"
                        >
                            <div className="relative h-56 bg-gray-100 group overflow-hidden">
                                {cat.thumbnail ? (
                                    <img src={cat.thumbnail} alt={cat.label} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute bottom-0 left-0 w-full h-[35%] bg-black/80 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out flex flex-col justify-between p-4">
                                    <h3 className="text-md font-bold text-center">{cat.label}</h3>
                                    <div className="flex justify-between text-sm">
                                        <button onClick={() => openEditModal(cat)} className="hover:underline cursor-pointer">
                                            Edit
                                        </button>
                                        <button onClick={() => deleteCategoryHandler(cat.id)} className="text-red-400 hover:underline cursor-pointer">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Category Modal */}
            <AddCategoryModal
                open={openCategoryModal}
                onClose={() => setOpenCategoryModal(false)}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                categoryThumbnailPreview={categoryThumbnailPreview}
                setCategoryThumbnail={setCategoryThumbnail}
                setCategoryThumbnailPreview={setCategoryThumbnailPreview}
                onAdd={submitCategoryHandler} // ✅ combined Add/Edit
                isEdit={isEdit}
            />
        </div>
    );
}

export default CategoryPage;
