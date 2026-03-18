import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    ArrowLeft,
    Check,
    ChevronRight,
    ImagePlus,
    UploadCloud,
    Sparkles,
    Package2,
} from "lucide-react";

import { getProductById } from "../../api/category.api";
import { uploadCustomerImage } from "../../api/customerDesign.api";
import { createCustomProduct } from "../../api/customerProduct.api";

const createCustomVariantId = () =>
    `custom-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const VariantCard = ({ variant, isSelected, onSelect }) => {
    return (
        <button
            type="button"
            onClick={() => onSelect(variant._id)}
            className={`group relative text-left transition-all duration-200 cursor-pointer ${isSelected ? "scale-[1.01]" : "hover:-translate-y-0.5"
                }`}
        >
            <div
                className={`border bg-white p-4 transition-all duration-200 ${isSelected
                        ? "border-[#f05a28] shadow-[0_12px_30px_rgba(240,90,40,0.12)]"
                        : "border-gray-200 hover:border-[#f05a28]/30 hover:shadow-md"
                    }`}
            >
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                            {variant.isCustom ? (
                                <img
                                    src={variant.image}
                                    alt={variant.fileName || variant.sku || "Custom variant"}
                                    className="h-9 w-9 object-cover border border-gray-200"
                                />
                            ) : (
                                <div className="flex h-9 w-9 items-center justify-center bg-[#f05a28]/10 text-[#f05a28]">
                                    <Package2 size={16} />
                                </div>
                            )}

                            <div className="min-w-0">
                                <h3 className="truncate text-sm font-bold text-gray-900">
                                    {variant.sku || variant.fileName || "Variant"}
                                </h3>
                                <p className="truncate text-[11px] text-gray-400">
                                    {variant._id?.slice(-8) || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {isSelected && (
                        <div className="flex h-6 w-6 items-center justify-center bg-[#f05a28] text-white">
                            <Check size={14} />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400">
                            Price
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                            ${variant.basePrice ?? "0.00"}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-2">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400">
                            Weight
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                            {variant.weight ?? "N/A"}g
                        </p>
                    </div>
                    <div className="bg-gray-50 p-2">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400">
                            Size
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                            {variant.size ?? "N/A"}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-2">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400">
                            Color
                        </p>
                        <p className="truncate text-sm font-bold text-gray-900">
                            {variant?.colorHex || "Default"}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                    <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold ${variant.available === "available"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                    >
                        {variant.available === "available" ? "In stock" : "Pre-order"}
                    </span>

                    {variant.isCustom ? (
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700">
                            Custom
                        </span>
                    ) : variant.addToCampaigns ? (
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700">
                            Campaign
                        </span>
                    ) : null}
                </div>
            </div>
        </button>
    );
};

export default function DesignVariants() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { state } = useLocation();

    const [product, setProduct] = useState(null);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [creating, setCreating] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [step, setStep] = useState("list"); // list | details
    const [selectedVariantIds, setSelectedVariantIds] = useState([]);

    const [customVariants, setCustomVariants] = useState([]);
    const [customVariant, setCustomVariant] = useState({
        name: "",
        description: "",
        tags: "",
    });

    const defaultSelectedCount = selectedVariantIds.filter(
        (id) => !String(id).startsWith("custom-")
    ).length;

    const customSelectedCount = selectedVariantIds.filter((id) =>
        String(id).startsWith("custom-")
    ).length;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoadingProduct(true);
                const data = await getProductById(productId);
                setProduct(data || null);

                const defaultIds = data?.Variants?.map((v) => v._id) || [];
                setSelectedVariantIds(defaultIds);
            } catch (error) {
                console.error(error);
                toast.error("Unable to load product");
            } finally {
                setLoadingProduct(false);
            }
        };

        if (productId) fetchProduct();
    }, [productId]);

    const allVariants = useMemo(() => {
        const base = product?.Variants || [];
        return [...base, ...customVariants];
    }, [product, customVariants]);

    const selectedCustomVariants = useMemo(() => {
        return customVariants.filter((variant) =>
            selectedVariantIds.includes(variant._id)
        );
    }, [customVariants, selectedVariantIds]);

    const toggleVariant = (variantId) => {
        setSelectedVariantIds((prev) =>
            prev.includes(variantId)
                ? prev.filter((id) => id !== variantId)
                : [...prev, variantId]
        );
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);

        try {
            const res = await uploadCustomerImage(file);
            if (!res?.success) throw new Error(res?.message || "Image upload failed");

            const newVariantId = createCustomVariantId();

            const newCustomVariant = {
                _id: newVariantId,
                sku: file.name,
                basePrice: 0,
                weight: "N/A",
                size: "Custom",
                color: "Custom",
                available: "available",
                isCustom: true,
                image: res.data.imageUrl,
                publicId: res.data.publicId,
                fileName: file.name,
            };

            setCustomVariants((prev) => [...prev, newCustomVariant]);

            setSelectedVariantIds((prev) =>
                prev.includes(newVariantId) ? prev : [...prev, newVariantId]
            );

            toast.success("Custom variant added");
            e.target.value = "";
        } catch (error) {
            console.error(error);
            toast.error("Custom image upload failed");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleNext = () => {
        if (selectedVariantIds.length === 0) {
            toast.info("Please select at least one variant.");
            return;
        }
        setStep("details");
    };

    const handleCreate = async () => {
        try {
            setCreating(true);

            const selectedCustomIds = selectedVariantIds.filter((id) =>
                String(id).startsWith("custom-")
            );

            const payload = {
                productId,

                // user requested: selected ids should be saved here
                selectedDefaultVariants: selectedVariantIds,

                // useful for backend clarity
                selectedCustomVariantIds: selectedCustomIds,

                // selected custom variants only
                customVariants: selectedCustomVariants.map((variant) => ({
                    id: variant._id,
                    imageUrl: variant.image || "",
                    publicId: variant.publicId || "",
                    fileName: variant.fileName || "",
                    name: customVariant.name || "",
                    description: customVariant.description || "",
                    tags: (customVariant.tags || "")
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                })),

                // backward compatibility (first custom variant only)
                customVariant:
                    selectedCustomVariants[0]
                        ? {
                            enabled: true,
                            imageUrl: selectedCustomVariants[0].image || "",
                            publicId: selectedCustomVariants[0].publicId || "",
                            name: customVariant.name || "",
                            description: customVariant.description || "",
                            tags: (customVariant.tags || "")
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                        }
                        : {
                            enabled: false,
                            imageUrl: "",
                            publicId: "",
                            name: "",
                            description: "",
                            tags: [],
                        },

                customerDesignId: state?.customerDesignId || null,
                selectedMockup: state?.selectedMockup?._id || null,
                customerLayers: state?.customerLayers || [],
            };

            const data = await createCustomProduct(payload);

            if (data.success) {
                toast.success("Custom product created");
                navigate("/user/products");
            } else {
                toast.error(data.message || "Create failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setCreating(false);
        }
    };

    if (loadingProduct && !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-[#f05a28] border-t-transparent" />
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-gray-900">
            <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#f05a28] transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        <div className="hidden min-w-0 items-center gap-2 text-sm text-gray-400 md:flex">
                            <span>Products</span>
                            <ChevronRight size={14} />
                            <span className="truncate text-gray-500">
                                {product?.productTitle || "Product"}
                            </span>
                            <ChevronRight size={14} />
                            <span className="font-semibold text-[#f05a28]">Variants</span>
                        </div>
                    </div>

                    <button
                        onClick={step === "list" ? handleNext : handleCreate}
                        disabled={step === "list" ? selectedVariantIds.length === 0 : creating}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f05a28] text-white text-sm font-bold rounded-none transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        {step === "list" ? "Next" : creating ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
                {step === "list" && (
                    <div className="grid gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-8">
                            <div className="mb-6 border border-gray-200 bg-white p-5">
                                <div className="flex items-start gap-4">
                                    {product?.thumbnail?.url ? (
                                        <img
                                            src={product.thumbnail.url}
                                            alt={product?.productTitle}
                                            className="h-20 w-20 object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="h-20 w-20 bg-gray-100 border border-gray-200" />
                                    )}

                                    <div className="min-w-0">
                                        <h1 className="text-3xl font-black text-gray-900">
                                            {product?.productTitle || "Product Name"}
                                        </h1>
                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                                            Select one or more variants and continue to add your custom design details.
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700">
                                                {product?.Variants?.length || 0} admin variants available
                                            </span>
                                            <span className="px-3 py-1 text-xs font-semibold bg-orange-50 text-[#f05a28]">
                                                {selectedVariantIds.length} selected
                                            </span>
                                            <span className="px-3 py-1 text-xs font-semibold bg-purple-50 text-purple-700">
                                                {customSelectedCount} custom selected
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-gray-200 bg-white p-5">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900">
                                            Select Product Variants
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Admin variants and uploaded custom variants are shown together. You can select multiple variants.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {allVariants?.map((variant) => (
                                        <VariantCard
                                            key={variant._id}
                                            variant={variant}
                                            isSelected={selectedVariantIds.includes(variant._id)}
                                            onSelect={toggleVariant}
                                        />
                                    ))}
                                </div>

                                {(!product?.Variants || product.Variants.length === 0) &&
                                    customVariants.length === 0 && (
                                        <div className="grid place-items-center border border-dashed border-gray-300 bg-gray-50 py-16">
                                            <div className="text-center">
                                                <Package2 className="mx-auto mb-3 text-gray-400" size={28} />
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    No variants found
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    This product does not have variants yet.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="border border-gray-200 bg-white p-5">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center bg-[#f05a28]/10 text-[#f05a28]">
                                        <Sparkles size={18} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-gray-900">
                                            Add custom variants
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Upload as many custom variant images as needed.
                                        </p>
                                    </div>
                                </div>

                                <label className="flex cursor-pointer items-center justify-center gap-2 border-2 border-dashed border-gray-300 px-4 py-4 text-sm font-semibold text-gray-600 hover:border-[#f05a28] hover:text-[#f05a28] transition">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <UploadCloud size={16} />
                                    {uploadingImage ? "Uploading..." : "Choose image"}
                                </label>

                                <p className="mt-3 text-xs text-gray-500">
                                    Every upload becomes a new selectable custom variant.
                                </p>

                                {customVariants.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        <p className="text-sm font-semibold text-gray-700">
                                            Uploaded custom variants ({customVariants.length})
                                        </p>

                                        <div className="space-y-2">
                                            {customVariants.map((variant) => {
                                                const isSelected = selectedVariantIds.includes(variant._id);

                                                return (
                                                    <div
                                                        key={variant._id}
                                                        className={`flex items-center gap-3 border p-3 ${isSelected
                                                                ? "border-[#f05a28] bg-orange-50/40"
                                                                : "border-gray-200 bg-gray-50"
                                                            }`}
                                                    >
                                                        <img
                                                            src={variant.image}
                                                            alt={variant.fileName}
                                                            className="h-11 w-11 object-cover border border-gray-200"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-semibold text-gray-900">
                                                                {variant.fileName || "Custom variant"}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                ID: {variant._id.slice(-10)}
                                                            </p>
                                                        </div>
                                                        <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold bg-purple-50 text-purple-700">
                                                            {isSelected ? "Selected" : "Added"}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === "details" && (
                    <div className="grid gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-8">
                            <div className="border border-gray-200 bg-white p-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center bg-[#f05a28]/10 text-[#f05a28]">
                                        <Sparkles size={18} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">
                                            Custom Variants Details
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            These details will apply to all selected custom variants.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-5 lg:grid-cols-2">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={customVariant.name}
                                                onChange={(e) =>
                                                    setCustomVariant((prev) => ({
                                                        ...prev,
                                                        name: e.target.value,
                                                    }))
                                                }
                                                placeholder="11oz Dishwasher Proof Photo Mug"
                                                className="w-full border border-gray-300 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#f05a28] cursor-text"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Tags
                                            </label>
                                            <input
                                                type="text"
                                                value={customVariant.tags}
                                                onChange={(e) =>
                                                    setCustomVariant((prev) => ({
                                                        ...prev,
                                                        tags: e.target.value,
                                                    }))
                                                }
                                                placeholder="mug, photo mug, gift, dishwasher safe"
                                                className="w-full border border-gray-300 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#f05a28] cursor-text"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Separate tags with commas
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            rows={12}
                                            value={customVariant.description}
                                            onChange={(e) =>
                                                setCustomVariant((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            placeholder="Brighten someone's day with our custom photo mugs..."
                                            className="w-full resize-none border border-gray-300 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#f05a28] cursor-text"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={() => setStep("list")}
                                        className="rounded-none border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        Back
                                    </button>

                                    <button
                                        onClick={handleCreate}
                                        disabled={creating}
                                        className="rounded-none bg-[#f05a28] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
                                    >
                                        {creating ? "Creating..." : "Create Custom Product"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="border border-gray-200 bg-white p-5">
                                <h3 className="text-lg font-black text-gray-900">Preview</h3>

                                {customVariants.length > 0 ? (
                                    <div className="mt-4 space-y-3">
                                        {customVariants.map((variant) => (
                                            <div
                                                key={variant._id}
                                                className="overflow-hidden border border-gray-200 bg-gray-50"
                                            >
                                                <img
                                                    src={variant.image}
                                                    alt={variant.fileName}
                                                    className="h-44 w-full object-cover"
                                                />
                                                <div className="p-3">
                                                    <p className="truncate text-sm font-semibold text-gray-900">
                                                        {variant.fileName || "Custom variant"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {selectedVariantIds.includes(variant._id)
                                                            ? "Selected"
                                                            : "Not selected"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-4 grid place-items-center border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
                                        <div>
                                            <ImagePlus className="mx-auto mb-2 text-gray-400" size={26} />
                                            <p className="text-sm text-gray-500">
                                                No custom image uploaded yet
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                        <span className="text-gray-500">Selected variants</span>
                                        <span className="font-semibold text-gray-900">
                                            {selectedVariantIds.length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                        <span className="text-gray-500">Default variants</span>
                                        <span className="font-semibold text-gray-900">
                                            {defaultSelectedCount}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                        <span className="text-gray-500">Custom variants</span>
                                        <span className="font-semibold text-gray-900">
                                            {customSelectedCount}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                        <span className="text-gray-500">Custom variant meta</span>
                                        <span className="font-semibold text-gray-900">
                                            Ready
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


// ==================================================================================================

// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//     ArrowLeft,
//     Check,
//     ChevronRight,
//     ImagePlus,
//     UploadCloud,
//     Sparkles,
//     Package2,
// } from "lucide-react";

// import { getProductById } from "../../api/category.api";
// import { uploadCustomerImage, createCustomProduct } from "../../api/customerDesign.api";

// const VariantCard = ({ variant, isSelected, onSelect }) => {
//     return (
//         <button
//             type="button"
//             onClick={() => onSelect(variant._id)}
//             className={`group relative text-left transition-all duration-200 cursor-pointer ${isSelected ? "scale-[1.01]" : "hover:-translate-y-0.5"
//                 }`}
//         >
//             <div
//                 className={`border bg-white p-4 transition-all duration-200 ${isSelected
//                     ? "border-[#f05a28] shadow-[0_12px_30px_rgba(240,90,40,0.12)]"
//                     : "border-gray-200 hover:border-[#f05a28]/30 hover:shadow-md"
//                     }`}
//             >
//                 <div className="mb-4 flex items-start justify-between gap-3">
//                     <div className="min-w-0">
//                         <div className="mb-2 flex items-center gap-2">
//                             {/* <div className="flex h-9 w-9 items-center justify-center bg-[#f05a28]/10 text-[#f05a28]">
//                                 <Package2 size={16} />
//                             </div> */}
//                             {variant.isCustom ? (
//                                 <img
//                                     src={variant.image}
//                                     className="h-9 w-9 object-cover border border-gray-200"
//                                 />
//                             ) : (
//                                 <div className="flex h-9 w-9 items-center justify-center bg-[#f05a28]/10 text-[#f05a28]">
//                                     <Package2 size={16} />
//                                 </div>
//                             )}
//                             <div className="min-w-0">
//                                 <h3 className="truncate text-sm font-bold text-gray-900">
//                                     {variant.sku || "Variant"}
//                                 </h3>
//                                 <p className="truncate text-[11px] text-gray-400">
//                                     {variant._id?.slice(-8) || "N/A"}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     {isSelected && (
//                         <div className="flex h-6 w-6 items-center justify-center bg-[#f05a28] text-white">
//                             <Check size={14} />
//                         </div>
//                     )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-2">
//                     <div className="bg-gray-50 p-2">
//                         <p className="text-[10px] uppercase tracking-widest text-gray-400">
//                             Price
//                         </p>
//                         <p className="text-sm font-bold text-gray-900">
//                             ${variant.basePrice ?? "0.00"}
//                         </p>
//                     </div>
//                     <div className="bg-gray-50 p-2">
//                         <p className="text-[10px] uppercase tracking-widest text-gray-400">
//                             Weight
//                         </p>
//                         <p className="text-sm font-bold text-gray-900">
//                             {variant.weight ?? "N/A"}g
//                         </p>
//                     </div>
//                     <div className="bg-gray-50 p-2">
//                         <p className="text-[10px] uppercase tracking-widest text-gray-400">
//                             Size
//                         </p>
//                         <p className="text-sm font-bold text-gray-900">
//                             {variant.size ?? "N/A"}
//                         </p>
//                     </div>
//                     <div className="bg-gray-50 p-2">
//                         <p className="text-[10px] uppercase tracking-widest text-gray-400">
//                             Color
//                         </p>
//                         <p className="truncate text-sm font-bold text-gray-900">
//                             {variant.color || "Default"}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="mt-4 flex items-center justify-between">
//                     <span
//                         className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold ${variant.available === "available"
//                             ? "bg-emerald-50 text-emerald-700"
//                             : "bg-amber-50 text-amber-700"
//                             }`}
//                     >
//                         {variant.available === "available" ? "In stock" : "Pre-order"}
//                     </span>

//                     {variant.addToCampaigns && (
//                         <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700">
//                             Campaign
//                         </span>
//                     )}
//                 </div>
//             </div>
//         </button>
//     );
// };

// export default function DesignVariants() {
//     const navigate = useNavigate();
//     const { productId } = useParams();
//     const { state } = useLocation();

//     const [product, setProduct] = useState(null);
//     const [loadingProduct, setLoadingProduct] = useState(false);
//     const [creating, setCreating] = useState(false);
//     const [uploadingImage, setUploadingImage] = useState(false);

//     const [step, setStep] = useState("list"); // list | details
//     const [selectedVariantIds, setSelectedVariantIds] = useState([]);
//     const [customPreview, setCustomPreview] = useState("");
//     const [customUpload, setCustomUpload] = useState({
//         imageUrl: "",
//         publicId: "",
//         fileName: "",
//     });

//     const defaultSelectedCount = selectedVariantIds.filter(
//         (id) => id !== "custom-variant"
//     ).length;

//     const [customVariant, setCustomVariant] = useState({
//         name: "",
//         description: "",
//         tags: "",
//     });

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 setLoadingProduct(true);
//                 const data = await getProductById(productId);
//                 setProduct(data || null);

//                 // default: all variants selected
//                 const defaultIds = data?.Variants?.map((v) => v._id) || [];
//                 setSelectedVariantIds(defaultIds);
//             } catch (error) {
//                 console.error(error);
//                 toast.error("Unable to load product");
//             } finally {
//                 setLoadingProduct(false);
//             }
//         };

//         if (productId) fetchProduct();
//     }, [productId]);

//     useEffect(() => {
//         return () => {
//             if (customPreview?.startsWith("blob:")) {
//                 URL.revokeObjectURL(customPreview);
//             }
//         };
//     }, [customPreview]);

//     //   const selectedVariants = useMemo(() => {
//     //     const all = product?.Variants || [];
//     //     return all.filter((v) => selectedVariantIds.includes(v._id));
//     //   }, [product, selectedVariantIds]);

//     const allVariants = useMemo(() => {
//         let base = product?.Variants || [];

//         // 👉 custom variant add karo agar image upload hai
//         if (customUpload.imageUrl) {
//             const alreadyExists = base.some(v => v._id === "custom-variant");

//             if (!alreadyExists) {
//                 base = [
//                     ...base,
//                     {
//                         _id: "custom-variant",
//                         sku: customUpload.fileName || "Custom Variant",
//                         basePrice: 0,
//                         weight: "N/A",
//                         size: "Custom",
//                         color: "Custom",
//                         available: "available",
//                         isCustom: true,
//                         image: customUpload.imageUrl,
//                     },
//                 ];
//             }
//         }
//         return base;
//     }, [product, customUpload]);

//     const toggleVariant = (variantId) => {
//         setSelectedVariantIds((prev) =>
//             prev.includes(variantId)
//                 ? prev.filter((id) => id !== variantId)
//                 : [...prev, variantId]
//         );
//     };

//     const handleImageChange = async (e) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         setCustomPreview(URL.createObjectURL(file));
//         setUploadingImage(true);

//         try {
//             const res = await uploadCustomerImage(file);
//             if (!res?.success) throw new Error(res?.message || "Image upload failed");

//             setSelectedVariantIds((prev) => {
//                 if (!prev.includes("custom-variant")) {
//                     return [...prev, "custom-variant"];
//                 }
//                 return prev;
//             });

//             setCustomUpload({
//                 imageUrl: res.data.imageUrl,
//                 publicId: res.data.publicId,
//                 fileName: file.name,
//             });

//             toast.success("Custom image uploaded");
//         } catch (error) {
//             console.error(error);
//             toast.error("Custom image upload failed");
//             setCustomPreview("");
//             setCustomUpload({ imageUrl: "", publicId: "", fileName: "" });
//         } finally {
//             setUploadingImage(false);
//         }
//     };

//     const handleNext = () => {
//         if (selectedVariantIds.length === 0) {
//             toast.info("Please select at least one variant.");
//             return;
//         }
//         setStep("details");
//     };

//     const handleCreate = async () => {
//         try {
//             setCreating(true);

//             const payload = {
//                 productId,
//                 selectedDefaultVariants: selectedVariantIds.filter(
//                     (id) => id !== "custom-variant"
//                 ),
//                 customVariant: {
//                     // enabled: Boolean(customUpload.imageUrl),
//                     enabled: selectedVariantIds.includes("custom-variant"),
//                     imageUrl: customUpload.imageUrl || "",
//                     publicId: customUpload.publicId || "",
//                     name: customVariant.name || "",
//                     description: customVariant.description || "",
//                     tags: (customVariant.tags || "")
//                         .split(",")
//                         .map((t) => t.trim())
//                         .filter(Boolean),
//                 },
//                 customerDesignId: state?.customerDesignId || null,
//                 selectedMockup: state?.selectedMockup?._id || null,
//                 customerLayers: state?.customerLayers || [],
//             };

//             const data = await createCustomProduct(payload);

//             if (data.success) {
//                 toast.success("Custom product created");
//                 navigate("/user/products");
//             } else {
//                 toast.error(data.message || "Create failed");
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error("Something went wrong");
//         } finally {
//             setCreating(false);
//         }
//     };

//     if (loadingProduct && !product) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
//                 <div className="text-center">
//                     <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-[#f05a28] border-t-transparent" />
//                     <p className="text-gray-600">Loading product...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-[#fcfcfc] text-gray-900">
//             <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
//                 <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
//                     <div className="flex items-center gap-3 min-w-0">
//                         <button
//                             onClick={() => navigate(-1)}
//                             className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#f05a28] transition-colors cursor-pointer"
//                         >
//                             <ArrowLeft size={16} />
//                             Back
//                         </button>

//                         <div className="hidden min-w-0 items-center gap-2 text-sm text-gray-400 md:flex">
//                             <span>Products</span>
//                             <ChevronRight size={14} />
//                             <span className="truncate text-gray-500">
//                                 {product?.productTitle || "Product"}
//                             </span>
//                             <ChevronRight size={14} />
//                             <span className="font-semibold text-[#f05a28]">Variants</span>
//                         </div>
//                     </div>

//                     <button
//                         onClick={step === "list" ? handleNext : handleCreate}
//                         disabled={step === "list" ? selectedVariantIds.length === 0 : creating}
//                         className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f05a28] text-white text-sm font-bold rounded-none transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
//                     >
//                         {step === "list" ? "Next" : creating ? "Creating..." : "Create"}
//                     </button>
//                 </div>
//             </div>

//             <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
//                 {step === "list" && (
//                     <div className="grid gap-8 lg:grid-cols-12">
//                         <div className="lg:col-span-8">
//                             <div className="mb-6 border border-gray-200 bg-white p-5">
//                                 <div className="flex items-start gap-4">
//                                     {product?.thumbnail?.url ? (
//                                         <img
//                                             src={product.thumbnail.url}
//                                             alt={product?.productTitle}
//                                             className="h-20 w-20 object-cover border border-gray-200"
//                                         />
//                                     ) : (
//                                         <div className="h-20 w-20 bg-gray-100 border border-gray-200" />
//                                     )}

//                                     <div className="min-w-0">
//                                         <h1 className="text-3xl font-black text-gray-900">
//                                             {product?.productTitle || "Product Name"}
//                                         </h1>
//                                         <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
//                                             Select one or more variants and continue to add your custom design details.
//                                         </p>

//                                         <div className="mt-4 flex flex-wrap gap-2">
//                                             <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700">
//                                                 {product?.Variants?.length || 0} variants available
//                                             </span>
//                                             <span className="px-3 py-1 text-xs font-semibold bg-orange-50 text-[#f05a28]">
//                                                 {defaultSelectedCount} selected
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="border border-gray-200 bg-white p-5">
//                                 <div className="mb-5 flex items-center justify-between">
//                                     <div>
//                                         <h2 className="text-xl font-black text-gray-900">Select Product Variants</h2>
//                                         <p className="text-sm text-gray-500">
//                                             Default variants are preselected. You can keep them or choose fewer.
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//                                     {allVariants?.map((variant) => (
//                                         <VariantCard
//                                             key={variant._id}
//                                             variant={variant}
//                                             isSelected={selectedVariantIds.includes(variant._id)}
//                                             onSelect={toggleVariant}
//                                         />
//                                     ))}
//                                 </div>

//                                 {(!product?.Variants || product.Variants.length === 0) && (
//                                     <div className="grid place-items-center border border-dashed border-gray-300 bg-gray-50 py-16">
//                                         <div className="text-center">
//                                             <Package2 className="mx-auto mb-3 text-gray-400" size={28} />
//                                             <h3 className="text-lg font-semibold text-gray-900">No variants found</h3>
//                                             <p className="mt-1 text-sm text-gray-500">
//                                                 This product does not have variants yet.
//                                             </p>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="lg:col-span-4 space-y-6">
//                             <div className="border border-gray-200 bg-white p-5">
//                                 <div className="mb-4 flex items-center gap-3">
//                                     <div className="flex h-10 w-10 items-center justify-center bg-[#f05a28]/10 text-[#f05a28]">
//                                         <Sparkles size={18} />
//                                     </div>
//                                     <div>
//                                         <h2 className="text-lg font-black text-gray-900">Custom variant</h2>
//                                         <p className="text-sm text-gray-500">
//                                             Optional, but recommended.
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <label className="flex cursor-pointer items-center justify-center gap-2 border-2 border-dashed border-gray-300 px-4 py-4 text-sm font-semibold text-gray-600 hover:border-[#f05a28] hover:text-[#f05a28] transition">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleImageChange}
//                                         className="hidden"
//                                     />
//                                     <UploadCloud size={16} />
//                                     {uploadingImage ? "Uploading..." : "Choose image"}
//                                 </label>

//                                 {customUpload.imageUrl && (
//                                     <div className="mt-4 flex items-center gap-3 border border-gray-200 bg-gray-50 p-3">
//                                         <img
//                                             src={customPreview || customUpload.imageUrl}
//                                             alt="Custom preview"
//                                             className="h-12 w-12 object-cover border border-gray-200"
//                                         />
//                                         <div className="min-w-0">
//                                             <p className="truncate text-sm font-semibold text-gray-900">
//                                                 {customUpload.fileName || "Uploaded image"}
//                                             </p>
//                                             <p className="text-xs text-gray-500">Preview ready</p>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {step === "details" && (
//                     <div className="grid gap-8 lg:grid-cols-12">
//                         <div className="lg:col-span-8">
//                             <div className="border border-gray-200 bg-white p-6">
//                                 <div className="mb-6 flex items-center gap-3">
//                                     <div className="flex h-11 w-11 items-center justify-center bg-[#f05a28]/10 text-[#f05a28]">
//                                         <Sparkles size={18} />
//                                     </div>
//                                     <div>
//                                         <h2 className="text-2xl font-black text-gray-900">Custom Variant Details</h2>
//                                         <p className="text-sm text-gray-500">
//                                             Fill the details for your custom variant.
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="grid gap-5 lg:grid-cols-2">
//                                     <div className="space-y-5">
//                                         <div>
//                                             <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                                 Name
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={customVariant.name}
//                                                 onChange={(e) =>
//                                                     setCustomVariant((prev) => ({ ...prev, name: e.target.value }))
//                                                 }
//                                                 placeholder="11oz Dishwasher Proof Photo Mug"
//                                                 className="w-full border border-gray-300 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#f05a28] cursor-text"
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                                 Tags
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={customVariant.tags}
//                                                 onChange={(e) =>
//                                                     setCustomVariant((prev) => ({ ...prev, tags: e.target.value }))
//                                                 }
//                                                 placeholder="mug, photo mug, gift, dishwasher safe"
//                                                 className="w-full border border-gray-300 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#f05a28] cursor-text"
//                                             />
//                                             <p className="mt-1 text-xs text-gray-500">
//                                                 Separate tags with commas
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                             Description
//                                         </label>
//                                         <textarea
//                                             rows={12}
//                                             value={customVariant.description}
//                                             onChange={(e) =>
//                                                 setCustomVariant((prev) => ({
//                                                     ...prev,
//                                                     description: e.target.value,
//                                                 }))
//                                             }
//                                             placeholder="Brighten someone's day with our custom photo mugs..."
//                                             className="w-full resize-none border border-gray-300 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#f05a28] cursor-text"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="mt-6 flex flex-wrap items-center gap-3">
//                                     <button
//                                         onClick={() => setStep("list")}
//                                         className="rounded-none border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
//                                     >
//                                         Back
//                                     </button>

//                                     <button
//                                         onClick={handleCreate}
//                                         disabled={creating}
//                                         className="rounded-none bg-[#f05a28] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
//                                     >
//                                         {creating ? "Creating..." : "Create Custom Product"}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="lg:col-span-4">
//                             <div className="border border-gray-200 bg-white p-5">
//                                 <h3 className="text-lg font-black text-gray-900">Preview</h3>

//                                 {customUpload.imageUrl ? (
//                                     <div className="mt-4 overflow-hidden border border-gray-200 bg-gray-50">
//                                         <img
//                                             src={customPreview || customUpload.imageUrl}
//                                             alt="Custom"
//                                             className="h-56 w-full object-cover"
//                                         />
//                                     </div>
//                                 ) : (
//                                     <div className="mt-4 grid place-items-center border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
//                                         <div>
//                                             <ImagePlus className="mx-auto mb-2 text-gray-400" size={26} />
//                                             <p className="text-sm text-gray-500">No custom image uploaded yet</p>
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div className="mt-4 space-y-3 text-sm">
//                                     <div className="flex items-center justify-between border-b border-gray-200 pb-3">
//                                         <span className="text-gray-500">Default variants</span>
//                                         <span className="font-semibold text-gray-900">{selectedVariantIds.filter(id => id !== "custom-variant").length}</span>
//                                     </div>
//                                     <div className="flex items-center justify-between border-b border-gray-200 pb-3">
//                                         <span className="text-gray-500">Custom variant</span>
//                                         <span className="font-semibold text-gray-900">
//                                             {customUpload.imageUrl ? "Ready" : "Optional"}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }