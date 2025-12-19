import React, { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import AddCategoryModal from "../components/Admin/AddCategoryModal";
import IMG from "../assets/images/download.png"

function CategoryPage() {
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [categoryThumbnail, setCategoryThumbnail] = useState(null);
    const [categoryThumbnailPreview, setCategoryThumbnailPreview] = useState("");

    const [categories, setCategories] = useState([
        {
            label: "T-Shirt",
            value: "t-shirt",
            thumbnail: { IMG },
            createdAt: "2024-10-01",
        },
        {
            label: "T-Shirt",
            value: "t-shirt",
            thumbnail: { IMG },
            createdAt: "2024-10-01",
        },
    ]);

    const addCategoryHandler = () => {
        if (!newCategory.trim()) return;

        const value = newCategory
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        setCategories((prev) => [
            ...prev,
            {
                label: newCategory.trim(),
                value,
                thumbnail: categoryThumbnailPreview,
                createdAt: new Date().toISOString().split("T")[0],
            },
        ]);

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
                <div className="flex justify-between items-center mt-6">
                    <h1 className="text-2xl font-bold text-gray-800">Categories</h1>

                    <button
                        onClick={() => setOpenCategoryModal(true)}
                        className="cursor-pointer flex items-center gap-2 text-sm shadow-lg bg-ocean hover:bg-hoverTiger rounded-md text-white py-2 px-4"
                    >
                        + Add Category
                    </button>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border"
                        >
                            {/* Thumbnail */}
                            <div className="h-40 bg-gray-100">
                                {cat.thumbnail ? (
                                    <img
                                        src={IMG}
                                        alt={cat.label}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {cat.label}
                                </h3>

                                <p className="text-xs text-gray-500 mt-1">
                                    Slug: {cat.value}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    Created: {cat.createdAt}
                                </p>

                                {/* Actions */}
                                <div className="flex justify-between items-center mt-4">
                                    <button className="cursor-pointer text-sm text-ocean hover:underline">
                                        Edit
                                    </button>
                                    <button className="cursor-pointer text-sm text-red-500 hover:underline">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Category Modal */}
            <AddCategoryModal
                open={openCategoryModal}
                onClose={() => setOpenCategoryModal(false)}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                categoryThumbnailPreview={categoryThumbnailPreview}
                setCategoryThumbnail={setCategoryThumbnail}
                setCategoryThumbnailPreview={setCategoryThumbnailPreview}
                onAdd={addCategoryHandler}
            />
        </div>
    );
}

export default CategoryPage;