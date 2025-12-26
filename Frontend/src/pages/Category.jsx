import React, { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import AddCategoryModal from "../components/Admin/AddCategoryModal";
import IMG from "../assets/images/download.png"
import { createCategory, getAllCategory } from "../api/category.api";

function CategoryPage() {
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [categoryThumbnail, setCategoryThumbnail] = useState(null);
    const [categoryThumbnailPreview, setCategoryThumbnailPreview] = useState("");

    const [categories, setCategories] = useState([]);

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



    const addCategoryHandler = async () => {
        if (!newCategory.trim() || !categoryThumbnail) return;

        const formData = new FormData();
        formData.append("category", newCategory.trim());
        formData.append("thumbnail", categoryThumbnail);

        try {
            const res = await createCategory(formData);

            if (!res.success) return;

            setCategories((prev) => [
                ...prev,
                {
                    id: res.data._id,
                    label: res.data.category,
                    value: res.data.category.toLowerCase().replace(/\s+/g, "-"),
                    thumbnail: res.data.thumbnail.url,
                    createdAt: new Date(res.data.createdAt).toLocaleDateString(),
                },
            ]);

            setNewCategory("");
            setCategoryThumbnail(null);
            setCategoryThumbnailPreview("");
            setOpenCategoryModal(false);
        } catch (error) {
            console.error("Add category failed:", error);
        }
    };

    return (
        <div className="w-full bg-slate-100 min-h-screen">
            <div className="p-10">
                <Breadcrumbs />

                {/* Header */}
                <div className="flex justify-between items-center mt-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Categories</h1>

                    <button
                        onClick={() => setOpenCategoryModal(true)}
                        className="cursor-pointer flex items-center gap-2 text-sm shadow-lg bg-ocean hover:bg-hoverTiger rounded-md text-white py-2 px-4"
                    >
                        + Add Category
                    </button>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt- cursor-pointer">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border"
                        >
                            {/* Image wrapper */}
                            <div className="relative h-56 bg-gray-100 group overflow-hidden">
                                {cat.thumbnail ? (
                                    <img
                                        src={cat.thumbnail}
                                        alt={cat.label}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="
          absolute bottom-0 left-0 w-full h-[35%]
          bg-black/80 text-white
          translate-y-full group-hover:translate-y-0
          transition-transform duration-300 ease-in-out
          flex flex-col justify-between p-4
        ">
                                    <h3 className="text-md font-bold  text-center">
                                        {cat.label}
                                    </h3>

                                    <div className="flex justify-between text-sm">
                                        <button className="hover:underline">
                                            Edit
                                        </button>
                                        <button className="text-red-400 hover:underline">
                                            Delete
                                        </button>
                                    </div>
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