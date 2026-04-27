import React, { Suspense, useEffect, useMemo, useState } from "react";
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
    X,
    Trash2
} from "lucide-react";

import { getProductById } from "../../api/category.api";
import { uploadCustomerImage } from "../../api/customerDesign.api";
import { createCustomProduct, updateCustomProduct } from "../../api/customerProduct.api";
import RichTextEditor from "./RichTextEditor";

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

                {/* <div className="grid grid-cols-2 gap-2">
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
                </div> */}

                <div className="mt-4 flex items-center justify-between gap-2">
                    {/* <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold ${variant.available === "available"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                            }`}
                    >
                        {variant.available === "available" ? "In stock" : "Pre-order"}
                    </span> */}

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

// Custom Variant Preview Component
const CustomVariantPreview = ({ variant, onRemove, isSelected, onToggleSelect }) => {
    return (
        <div className={`border p-3 ${isSelected ? 'border-[#f05a28] bg-orange-50/20' : 'border-gray-200'}`}>
            <div className="flex gap-3">
                <img
                    src={variant.image}
                    alt={variant.fileName}
                    className="h-16 w-16 object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                        {variant.fileName || "Custom variant"}
                    </p>
                    <p className="text-xs text-gray-500">
                        ID: {variant._id.slice(-8)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <button
                            onClick={() => onToggleSelect(variant._id)}
                            className={`text-xs px-2 py-1 ${isSelected
                                ? 'bg-[#f05a28] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {isSelected ? 'Selected' : 'Select'}
                        </button>
                        <button
                            onClick={() => onRemove(variant._id)}
                            className="text-xs text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
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
    const [sellingPrice, setSellingPrice] = useState("");

    const [step, setStep] = useState("list");
    const [selectedVariantIds, setSelectedVariantIds] = useState([]);
    const [currentTag, setCurrentTag] = useState("");

    // Custom variants array - multiple variants
    const [customVariants, setCustomVariants] = useState([]);

    // Common details for all custom variants
    const [customVariantDetails, setCustomVariantDetails] = useState({
        name: "",
        description: "",
        tags: "",
    });

    // Editing mode
    const isEditing = state?.isEditing || false;
    const existingCustomProduct = state?.existingCustomProduct || null;

    const defaultSelectedCount = selectedVariantIds.filter(
        (id) => !String(id).startsWith("custom-")
    ).length;

    const customSelectedCount = selectedVariantIds.filter((id) =>
        String(id).startsWith("custom-")
    ).length;

    // =========================================================
    // Inside component, before return
    const hasCustomVariants = customVariants.length > 0;

    // Main button click handler for list step
    const handleMainButtonClick = () => {
        if (!hasCustomVariants) {
            // No custom variants -> direct create
            handleCreate();
        } else {
            // Show details step
            handleNext();
        }
    };

    // Disable main button if no variant is selected (only when custom variants exist)
    const mainButtonDisabled = hasCustomVariants
        ? selectedVariantIds.length === 0
        : false; // when no custom variants, allow creation even without selection
    // =========================================================

    // Load existing data if editing
    useEffect(() => {
        if (isEditing && existingCustomProduct) {
            // Load selected variant IDs
            // if (existingCustomProduct.selectedDefaultVariants) {
            //     setSelectedVariantIds(existingCustomProduct.selectedDefaultVariants);
            // }

            // Load custom variants array
            if (existingCustomProduct.customVariants?.length > 0) {
                const loadedCustomVariants = existingCustomProduct.customVariants.map((cv, index) => ({
                    _id: cv.id || `custom-${Date.now()}-${index}`,
                    image: cv.imageUrl,
                    publicId: cv.publicId,
                    fileName: cv.fileName || `Custom variant ${index + 1}`,
                    isCustom: true,
                    // Include other fields if needed
                }));
                setCustomVariants(loadedCustomVariants);
            }

            if (existingCustomProduct?.sellingPrice) {
                setSellingPrice(existingCustomProduct.sellingPrice);
            }

            // Load common details
            if (existingCustomProduct.customVariant) {
                setCustomVariantDetails({
                    name: existingCustomProduct.customVariant.name || "",
                    description: existingCustomProduct.customVariant.description || "",
                    tags: existingCustomProduct.customVariant.tags?.join(", ") || "",
                });
            }
        }
    }, [isEditing, existingCustomProduct]);

    // Fetch product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoadingProduct(true);
                const data = await getProductById(productId);
                setProduct(data || null);

                // New mode: select all variants by default
                if (!isEditing) {
                    const defaultIds = data?.Variants?.map((v) => v._id) || [];
                    setSelectedVariantIds(defaultIds);
                }
            } catch (error) {
                console.error(error);
                toast.error("Unable to load product");
            } finally {
                setLoadingProduct(false);
            }
        };

        if (productId) fetchProduct();
    }, [productId, isEditing]);

    const allVariants = useMemo(() => {
        // const base = product?.Variants || [];
        // return [...base, ...customVariants];
        return [...customVariants];
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

    // Handle image upload for custom variant
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
                image: res.data.imageUrl,
                publicId: res.data.publicId,
                fileName: file.name,
                isCustom: true,
                // Default selected
            };

            setCustomVariants((prev) => [...prev, newCustomVariant]);

            // Auto-select the new variant
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

    // Remove custom variant
    const handleRemoveCustomVariant = (variantId) => {
        setCustomVariants(prev => prev.filter(v => v._id !== variantId));
        setSelectedVariantIds(prev => prev.filter(id => id !== variantId));
        toast.success("Custom variant removed");
    };

    // Toggle custom variant selection
    const handleToggleCustomVariant = (variantId) => {
        toggleVariant(variantId);
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

            // ✅ Build customVariants array with ALL variants + enabled flag
            const allCustomVariants = customVariants.map(variant => ({
                enabled: selectedVariantIds.includes(variant._id), // true if selected
                imageUrl: variant.image || "",
                publicId: variant.publicId || "",
                fileName: variant.fileName || "",
                name: customVariantDetails.name || "",
                description: customVariantDetails.description || "",
                tags: (customVariantDetails.tags || "")
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            }));

            // ✅ selectedDefaultVariants should contain ONLY default variant IDs (not custom)
            const defaultVariantIds = selectedVariantIds.filter(
                id => !String(id).startsWith("custom-")
            );

            const payload = {
                productId,
                selectedDefaultVariants: defaultVariantIds,
                customVariants: allCustomVariants, // send ALL custom variants (selected + unselected)
                // For backward compatibility – keep first selected custom variant
                customVariant: allCustomVariants.find(v => v.enabled) || {
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
                sellingPrice: sellingPrice ? parseFloat(sellingPrice) : 0,
            };

            console.log("Update Payload:", payload); // Debug

            let data;
            if (isEditing && existingCustomProduct?._id) {
                data = await updateCustomProduct(existingCustomProduct._id, payload);
                if (data.success) toast.success("Custom product updated successfully");
            } else {
                data = await createCustomProduct(payload);
                if (data.success) toast.success("Custom product created");
            }

            if (data?.success) {
                navigate("/user/products");
            } else {
                toast.error(data?.message || (isEditing ? "Update failed" : "Create failed"));
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
                            <span className="font-semibold text-[#f05a28]">Mockups</span>
                        </div>
                    </div>

                    <button
                        onClick={step === "list" ? handleMainButtonClick : handleCreate}
                        disabled={step === "list" ? mainButtonDisabled : creating}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f05a28] text-white text-sm font-bold rounded-none transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        {step === "list"
                            ? (customVariants.length === 0 ? "Create Product" : "Next")
                            : (creating ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Product" : "Create Product"))
                        }
                    </button>
                    {/* 
                    <button
                        onClick={step === "list" ? handleNext : handleCreate}
                        disabled={step === "list" ? selectedVariantIds.length === 0 : creating}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f05a28] text-white text-sm font-bold rounded-none transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        {step === "list"
                            ? "Next"
                            : (creating
                                ? (isEditing ? "Updating..." : "Creating...")
                                : (isEditing ? "Update Product" : "Create Product")
                            )
                        }
                    </button> */}
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
                                            Select one or more Mockups and continue to add your custom Mockups details.
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {/* <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700">
                                                {product?.Variants?.length || 0} admin variants available
                                            </span> */}
                                            <span className="px-3 py-1 text-xs font-semibold bg-orange-50 text-[#f05a28]">
                                                {selectedVariantIds.length} selected
                                            </span>
                                            {/* <span className="px-3 py-1 text-xs font-semibold bg-purple-50 text-purple-700">
                                                {customSelectedCount} custom selected
                                            </span> */}
                                        </div>

                                        {/* // add the input field to enter the price of custom product. */}
                                        <div className="mt-3">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Selling Price
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={sellingPrice}
                                                onChange={(e) => setSellingPrice(e.target.value)}
                                                placeholder="e.g. 24.99"
                                                className="w-full max-w-xs border border-gray-300 px-4 py-2.5 outline-none placeholder:text-gray-400 focus:border-[#f05a28] cursor-text"
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="border border-gray-200 bg-white p-5">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900">
                                            Select Mockups
                                        </h2>

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

                                {/* Unselected custom variants */}
                                {customVariants.filter(v => !selectedVariantIds.includes(v._id)).length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-semibold text-gray-500 mb-2">Unselected Mockups</p>
                                        <div className="space-y-2">
                                            {customVariants
                                                .filter(v => !selectedVariantIds.includes(v._id))
                                                .map(variant => (
                                                    <div key={variant._id} className="flex items-center gap-3 border border-gray-200 p-2 bg-gray-50">
                                                        <img src={variant.image} alt="" className="h-10 w-10 object-cover" />
                                                        <span className="text-sm text-gray-600 truncate flex-1">{variant.fileName}</span>
                                                        <button
                                                            onClick={() => toggleVariant(variant._id)}
                                                            className="text-xs bg-gray-200 px-2 py-1 hover:bg-gray-300"
                                                        >
                                                            Select
                                                        </button>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* {(!product?.Variants || product.Variants.length === 0) && */}
                                {
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
                                            Add Mockups
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Upload multiple custom Mockups images.
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
                                    Every upload becomes a new selectable custom Mockups.
                                </p>

                                {customVariants.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        <p className="text-sm font-semibold text-gray-700">
                                            Uploaded custom variants ({customVariants.length})
                                        </p>

                                        <div className="space-y-2 max-h-80 overflow-y-auto">
                                            {customVariants.map((variant) => {
                                                const isSelected = selectedVariantIds.includes(variant._id);

                                                return (
                                                    <CustomVariantPreview
                                                        key={variant._id}
                                                        variant={variant}
                                                        isSelected={isSelected}
                                                        onToggleSelect={handleToggleCustomVariant}
                                                        onRemove={handleRemoveCustomVariant}
                                                    />
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
                                            Mockups Details
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            These details will apply to all selected Mockups ({selectedCustomVariants.length}).
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
                                                value={customVariantDetails.name}
                                                onChange={(e) =>
                                                    setCustomVariantDetails(prev => ({
                                                        ...prev,
                                                        name: e.target.value,
                                                    }))
                                                }
                                                placeholder="11oz Dishwasher Proof Photo Mug"
                                                className="w-full border border-gray-300 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#f05a28] cursor-text"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Tags
                                                <span className="ml-1 text-xs font-normal text-gray-400">(Optional)</span>
                                            </label>

                                            {/* Input Field */}
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={currentTag}
                                                    onChange={(e) => setCurrentTag(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && currentTag.trim()) {
                                                            e.preventDefault();
                                                            const newTag = currentTag.trim();

                                                            // Get current tags as array
                                                            const currentTags = customVariantDetails.tags
                                                                .split(",")
                                                                .map(t => t.trim())
                                                                .filter(t => t.length > 0);

                                                            // Check if tag already exists (case-insensitive)
                                                            if (!currentTags.some(t => t.toLowerCase() === newTag.toLowerCase())) {
                                                                // Add new tag
                                                                const updatedTagsArray = [...currentTags, newTag];
                                                                setCustomVariantDetails(prev => ({
                                                                    ...prev,
                                                                    tags: updatedTagsArray.join(", "),
                                                                }));
                                                            }

                                                            // Clear input
                                                            setCurrentTag("");
                                                        } else if (e.key === "Backspace" && !currentTag) {
                                                            // Remove last tag when input is empty
                                                            e.preventDefault();
                                                            const currentTags = customVariantDetails.tags
                                                                .split(",")
                                                                .map(t => t.trim())
                                                                .filter(t => t.length > 0);

                                                            if (currentTags.length > 0) {
                                                                currentTags.pop();
                                                                setCustomVariantDetails(prev => ({
                                                                    ...prev,
                                                                    tags: currentTags.join(", "),
                                                                }));
                                                            }
                                                        }
                                                    }}
                                                    placeholder="Type a tag and press Enter"
                                                    className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#f05a28] focus:ring-1 focus:ring-[#f05a28]/20 transition-all cursor-text"
                                                />

                                                {/* Input Icon */}
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M12 5v14M5 12h14" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Tags Display Area */}
                                            {customVariantDetails.tags && customVariantDetails.tags.split(",").filter(t => t.trim()).length > 0 && (
                                                <div className="border border-gray-200 bg-gray-50/50 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Added Tags
                                                        </h4>
                                                        <span className="text-xs text-gray-400 font-medium">
                                                            {customVariantDetails.tags.split(",").filter(t => t.trim()).length} tag(s)
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {customVariantDetails.tags
                                                            .split(",")
                                                            .map(t => t.trim())
                                                            .filter(t => t.length > 0)
                                                            .map((tag, index) => (
                                                                <span
                                                                    key={`${tag}-${index}`}
                                                                    className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700 font-medium shadow-sm hover:shadow-md hover:border-[#f05a28]/30 transition-all duration-200 group"
                                                                >
                                                                    {/* Tag Icon */}
                                                                    <svg
                                                                        width="12"
                                                                        height="12"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="#f05a28"
                                                                        strokeWidth="2.5"
                                                                        className="flex-shrink-0"
                                                                    >
                                                                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                                                        <line x1="7" y1="7" x2="7.01" y2="7" />
                                                                    </svg>

                                                                    <span>{tag}</span>

                                                                    {/* Remove Button */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const currentTags = customVariantDetails.tags
                                                                                .split(",")
                                                                                .map(t => t.trim())
                                                                                .filter(t => t.length > 0);

                                                                            const updatedTags = currentTags.filter((_, i) => i !== index);

                                                                            setCustomVariantDetails(prev => ({
                                                                                ...prev,
                                                                                tags: updatedTags.join(", "),
                                                                            }));
                                                                        }}
                                                                        className="ml-1 p-0.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                                        title="Remove tag"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </span>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Empty State */}
                                            {(!customVariantDetails.tags || customVariantDetails.tags.split(",").filter(t => t.trim()).length === 0) && (
                                                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                    <svg
                                                        className="mx-auto mb-2 text-gray-300"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                                        <line x1="7" y1="7" x2="7.01" y2="7" />
                                                    </svg>
                                                    <p className="text-xs text-gray-400">
                                                        No tags added yet. Type above and press Enter to add.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Helper Text */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-px bg-gray-200"></div>
                                                <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                                                    <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-[10px] font-mono text-gray-500">
                                                        Enter ↵
                                                    </kbd>
                                                    to add tag
                                                    <span className="mx-1 text-gray-300">•</span>
                                                    <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-[10px] font-mono text-gray-500">
                                                        Backspace ⌫
                                                    </kbd>
                                                    to remove
                                                </p>
                                                <div className="flex-1 h-px bg-gray-200"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Description
                                        </label>
                                        <Suspense fallback={<div className="border p-4 text-gray-400">Loading editor...</div>}>
                                            <RichTextEditor
                                                value={customVariantDetails.description}
                                                onChange={(htmlContent) =>
                                                    setCustomVariantDetails(prev => ({
                                                        ...prev,
                                                        description: htmlContent,
                                                    }))
                                                }
                                            />
                                        </Suspense>
                                        <p className="mt-2 text-xs text-gray-500">
                                            You can format text with bold, italic, lists, images, and links.
                                        </p>
                                        {/* <textarea
                                            rows={12}
                                            value={customVariantDetails.description}
                                            onChange={(e) =>
                                                setCustomVariantDetails(prev => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            placeholder="Brighten someone's day with our custom photo mugs..."
                                            className="w-full resize-none border border-gray-300 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#f05a28] cursor-text"
                                        /> */}
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
                                        {creating
                                            ? (isEditing ? "Updating..." : "Creating...")
                                            : (isEditing ? "Update Custom Product" : "Create Custom Product")
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="border border-gray-200 bg-white p-5">
                                <h3 className="text-lg font-black text-gray-900">Selected Mockups</h3>

                                {selectedCustomVariants.length > 0 ? (
                                    <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                                        {selectedCustomVariants.map((variant) => (
                                            <div
                                                key={variant._id}
                                                className="overflow-hidden border border-gray-200"
                                            >
                                                <img
                                                    src={variant.image}
                                                    alt={variant.fileName}
                                                    className="h-32 w-full object-cover"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="truncate text-sm font-semibold text-gray-900">
                                                        {variant.fileName || "Custom variant"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Will use: {customVariantDetails.name || "Name not set"}
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
                                                No Mockups Selected
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                        <span className="text-gray-500">Total Mockups selected</span>
                                        <span className="font-semibold text-gray-900">
                                            {selectedVariantIds.length}
                                        </span>
                                    </div>
                                    {/* <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                        <span className="text-gray-500">Default variants</span>
                                        <span className="font-semibold text-gray-900">
                                            {defaultSelectedCount}
                                        </span>
                                    </div> */}
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                        <span className="text-gray-500">Mockups</span>
                                        <span className="font-semibold text-gray-900">
                                            {customSelectedCount}
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