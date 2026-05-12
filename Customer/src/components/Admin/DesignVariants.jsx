import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    ArrowLeft,
    Check,
    ChevronRight,
    UploadCloud,
    Sparkles,
    Package2,
    X,
    Trash2
} from "lucide-react";

import { getProductById } from "../../api/category.api";
import { getCustomerDesignById } from "../../api/customerDesign.api";
import { uploadCustomerImage } from "../../api/customerDesign.api";
import { createCustomProduct, updateCustomProduct, getCustomProductById } from "../../api/customerProduct.api";
import RichTextEditor from "./RichTextEditor";

const createCustomVariantId = () =>
    `custom-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

// ─── Variant Card for Grid Display ───
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
                <div className="mt-4 flex items-center justify-between gap-2">
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

// ─── Custom Variant Preview Component ───
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

// ─── Main Component ───
export default function DesignVariants() {
    const navigate = useNavigate();
    const { productId, customDesignId } = useParams();
    const { state } = useLocation();

    // ─── State Declarations ───
    const [product, setProduct] = useState(null);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [creating, setCreating] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [customDesign, setCustomDesign] = useState(null);
    const [productDetails, setProductDetails] = useState({
        title: "",
        description: "",
        tags: "",
    });
    const [customProduct, setCustomProduct] = useState(null);
    const [variantPrices, setVariantPrices] = useState({});
    const [step, setStep] = useState("list");
    const [selectedVariantIds, setSelectedVariantIds] = useState([]);
    const [currentTag, setCurrentTag] = useState("");
    const [customVariants, setCustomVariants] = useState([]);

    // ─── Mode flags ───
    const isEditing = state?.isEditing || false;
    const existingCustomProduct = state?.existingCustomProduct || null;

    // ─── Fetch Custom Design (for generated mockups) ───
    useEffect(() => {
        const fetchCustomDesign = async () => {
            if (customDesignId) {
                try {
                    const res = await getCustomerDesignById(customDesignId);
                    if (res.success) {
                        setCustomDesign(res.data);
                    }
                } catch (error) {
                    console.error('Error fetching custom design:', error);
                }
            }
        };
        fetchCustomDesign();
    }, [customDesignId]);

    // ─── Fetch Custom Product (if editing) ───
    useEffect(() => {
        const fetchCustomProduct = async () => {
            if (state?.customerProductId) {
                try {
                    const data = await getCustomProductById(state.customerProductId);
                    setCustomProduct(data);
                } catch (error) {
                    console.error('Error fetching custom product:', error);
                }
            }
        };
        fetchCustomProduct();
    }, []);

    // ─── Derived counts ───
    const defaultSelectedCount = selectedVariantIds.filter(
        (id) => !String(id).startsWith("custom-")
    ).length;

    const customSelectedCount = selectedVariantIds.filter((id) =>
        String(id).startsWith("custom-")
    ).length;

    const generatedMockups = (customDesign?.finalDesignImages || []).filter(img => {
        const mockupData = product?.mockupIds?.find(m => m._id === img.mockupId);
        if (!mockupData) return true;
        return !mockupData.name?.toLowerCase().startsWith("config");
    });
    const generatedSelectedCount = generatedMockups.filter(img => selectedVariantIds.includes(img.mockupId)).length;
    // ─── Variant price handler ───
    const handleVariantPriceChange = (variantId, newPrice) => {
        setVariantPrices(prev => ({ ...prev, [variantId]: parseFloat(newPrice) || 0 }));
    };

    // ─── Set initial product details ───
    useEffect(() => {
        if (product && !isEditing) {
            setProductDetails({
                title: product.productTitle || "",
                description: product.description || "",
                tags: "",
            });
        }
    }, [product, isEditing]);

    // ─── Load existing data if editing ───
    useEffect(() => {
        if (isEditing && existingCustomProduct) {
            if (existingCustomProduct.customVariants?.length > 0) {
                const loadedCustomVariants = existingCustomProduct.customVariants.map((cv, index) => ({
                    _id: cv.id || `custom-${Date.now()}-${index}`,
                    image: cv.imageUrl,
                    publicId: cv.publicId,
                    fileName: cv.fileName || `Custom variant ${index + 1}`,
                    isCustom: true,
                }));
                setCustomVariants(loadedCustomVariants);
            }

            if (existingCustomProduct.customVariant) {
                setCustomVariantDetails({
                    name: existingCustomProduct.customVariant.name || "",
                    description: existingCustomProduct.customVariant.description || "",
                    tags: existingCustomProduct.customVariant.tags?.join(", ") || "",
                });
            }
        }
    }, [isEditing, existingCustomProduct]);

    // ─── Fetch product ───
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoadingProduct(true);
                const data = await getProductById(productId);
                setProduct(data || null);

                // Set default variant prices
                if (data?.Variants) {
                    const defaultPrices = {};
                    data.Variants.forEach(v => {
                        defaultPrices[v._id] = v.basePrice || 0;
                    });
                    setVariantPrices(defaultPrices);
                }

                // Select all variants by default (new mode)
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

    // ─── Toggle any item selection ───
    const toggleVariant = (variantId) => {
        setSelectedVariantIds((prev) =>
            prev.includes(variantId)
                ? prev.filter((id) => id !== variantId)
                : [...prev, variantId]
        );
    };

    // ─── Upload custom mockup image ───
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
            };

            setCustomVariants((prev) => [...prev, newCustomVariant]);

            // Auto-select the new variant
            setSelectedVariantIds((prev) =>
                prev.includes(newVariantId) ? prev : [...prev, newVariantId]
            );

            toast.success("Custom mockup added");
            e.target.value = "";
        } catch (error) {
            console.error(error);
            toast.error("Custom image upload failed");
        } finally {
            setUploadingImage(false);
        }
    };

    // ─── Remove custom variant ───
    const handleRemoveCustomVariant = (variantId) => {
        setCustomVariants(prev => prev.filter(v => v._id !== variantId));
        setSelectedVariantIds(prev => prev.filter(id => id !== variantId));
        toast.success("Custom variant removed");
    };

    // ─── Next step ───
    const handleNext = () => {
        setStep("details");
    };

    // ─── Create / Update ───
    const handleCreate = async () => {
        try {
            setCreating(true);

            // Filter selected product variant IDs
            const selectedProductIds = selectedVariantIds.filter(
                id => !String(id).startsWith("custom-") && !generatedMockups.some(m => m.mockupId === id)
            );

            // Filter prices for selected variants only
            const filteredPrices = {};
            selectedProductIds.forEach(id => {
                if (variantPrices[id] !== undefined) {
                    filteredPrices[id] = variantPrices[id];
                }
            });

            // Selected custom uploaded mockups
            const selectedUploaded = customVariants
                .filter(v => selectedVariantIds.includes(v._id))
                .map(v => ({
                    enabled: true,
                    imageUrl: v.image || "",
                    publicId: v.publicId || "",
                    fileName: v.fileName || "",
                    name: productDetails.title || "",
                    description: productDetails.description || "",
                    tags: (productDetails.tags || "").split(",").map(t => t.trim()).filter(Boolean),
                }));

            // Selected generated mockups
            const selectedGenerated = generatedMockups
                .filter(img => selectedVariantIds.includes(img.mockupId))
                .map(img => ({
                    enabled: true,
                    imageUrl: img.imageUrl,
                    publicId: img.publicId || "",
                    fileName: `Generated ${img.mockupId?.slice(-8) || ""}`,
                    name: productDetails.title || "",
                    description: productDetails.description || "",
                    tags: (productDetails.tags || "").split(",").map(t => t.trim()).filter(Boolean),
                }));

            const allCustomVariants = [...selectedUploaded, ...selectedGenerated];

            const payload = {
                productId,
                selectedDefaultVariants: selectedProductIds,
                customVariants: allCustomVariants,
                customVariant: allCustomVariants.length > 0 ? allCustomVariants[0] : {
                    enabled: false,
                    imageUrl: "",
                    publicId: "",
                    name: productDetails.title || "",
                    description: productDetails.description || "",
                    tags: [],
                },
                customerDesignId: state?.customerDesignId || null,
                selectedMockup: state?.selectedMockup?._id || null,
                customerLayers: state?.customerLayers || [],
                variantPrices: filteredPrices,
            };

            let data;
            if (isEditing && existingCustomProduct?._id) {
                data = await updateCustomProduct(existingCustomProduct._id, payload);
                if (data.success) toast.success("Custom product updated successfully");
            } else {
                data = await createCustomProduct(payload);
                if (data.success) toast.success("Custom product created successfully");
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

    // ─── Loading state ───
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

    // ─── Render ───
    return (
        <div className="min-h-screen bg-[#fcfcfc] text-gray-900">
            {/* ── Header ── */}
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
                            <span className="font-semibold text-[#f05a28]">Variants & Mockups</span>
                        </div>
                    </div>

                    <button
                        onClick={step === "list" ? handleNext : handleCreate}
                        disabled={step === "list" ? selectedVariantIds.length === 0 : creating}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f05a28] text-white text-sm font-bold rounded-none transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        {step === "list"
                            ? "Next"
                            : (creating ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Product" : "Create Product"))
                        }
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
                {/* ── STEP 1: Selection List ── */}
                {step === "list" && (
                    <div className="space-y-8">
                        {/* Product Info Card */}
                        <div className="border border-gray-200 bg-white p-5">
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
                                        Select variants, update prices, and add custom mockups.
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="px-3 py-1 text-xs font-semibold bg-orange-50 text-[#f05a28]">
                                            {selectedVariantIds.length} selected
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 1: Product Variants & Pricing Table with Checkbox */}
                        <div className="border border-gray-200 bg-white p-5">
                            <h2 className="text-xl font-black text-gray-900 mb-4">
                                Select Variants & Set Prices
                            </h2>
                            {product?.Variants?.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-gray-500 border-b">
                                                <th className="py-2 w-12">
                                                    <span className="sr-only">Select</span>
                                                </th>
                                                <th className="py-2 font-medium">Variant</th>
                                                <th className="py-2 font-medium">SKU</th>
                                                <th className="py-2 font-medium">Color</th>
                                                <th className="py-2 font-medium">Size</th>
                                                <th className="py-2 font-medium">Base Price</th>
                                                <th className="py-2 font-medium">Custom Price (USD)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.Variants.map(variant => {
                                                const isSelected = selectedVariantIds.includes(variant._id);
                                                return (
                                                    <tr key={variant._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => toggleVariant(variant._id)}
                                                                className="w-4 h-4 text-[#f05a28] focus:ring-[#f05a28] rounded cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="py-2 font-medium">{variant.variantsName}</td>
                                                        <td className="py-2 font-mono text-xs text-gray-600">{variant.sku}</td>
                                                        <td className="py-2">
                                                            {variant.color ? (
                                                                <div className="flex items-center gap-1">
                                                                    <span
                                                                        className="w-4 h-4 rounded-full border"
                                                                        style={{ backgroundColor: variant.colorHex || '#ccc' }}
                                                                    />
                                                                    <span className="text-xs">{variant.color}</span>
                                                                </div>
                                                            ) : "—"}
                                                        </td>
                                                        <td className="py-2">{variant.size || "—"}</td>
                                                        <td className="py-2 text-gray-500">${variant.basePrice?.toFixed(2)}</td>
                                                        <td className="py-2">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={variantPrices[variant._id] || 0}
                                                                onChange={(e) =>
                                                                    handleVariantPriceChange(variant._id, e.target.value)
                                                                }
                                                                disabled={!isSelected}
                                                                className="w-28 border border-gray-300 px-2 py-1.5 text-sm focus:border-[#f05a28] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No variants found for this product.</p>
                            )}
                        </div>

                        {/* SECTION 2: Mockups (Generated + Uploaded) */}
                        <div className="border border-gray-200 bg-white p-5">
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <Sparkles size={18} className="text-[#f05a28]" />
                                Select Mockups
                            </h2>

                            {/* Generated Mockups */}
                            {generatedMockups.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Generated Mockups ({generatedMockups.length})
                                        {generatedSelectedCount > 0 && (
                                            <span className="ml-2 text-[#f05a28]">• {generatedSelectedCount} selected</span>
                                        )}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {generatedMockups.map((img, idx) => {
                                            const isSel = selectedVariantIds.includes(img.mockupId);
                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => toggleVariant(img.mockupId)}
                                                    className={`border-2 p-3 text-center cursor-pointer transition ${isSel
                                                        ? 'border-[#f05a28] bg-orange-50/30 shadow-md'
                                                        : 'border-gray-200 hover:border-gray-400 bg-white hover:shadow-sm'
                                                        }`}
                                                >
                                                    <img
                                                        src={img.imageUrl}
                                                        alt={`Generated Mockup ${idx + 1}`}
                                                        className="w-full h-40 object-cover mb-2 border border-gray-100"
                                                    />
                                                    <p className="text-xs text-gray-600 truncate">
                                                        Mockup {idx + 1}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 truncate">
                                                        {img.mockupId?.slice(-8) || ""}
                                                    </p>
                                                    {isSel && (
                                                        <div className="mt-1 flex justify-center">
                                                            <Check size={14} className="text-[#f05a28]" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Custom Uploaded Mockups Grid + Upload Panel */}
                            <div className="grid gap-8 lg:grid-cols-12">
                                <div className="lg:col-span-8">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Custom Mockups ({customVariants.length})
                                    </h3>

                                    {customVariants.length > 0 ? (
                                        <>
                                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                                {customVariants.map((variant) => (
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
                                                                        className="text-xs bg-gray-200 px-2 py-1 hover:bg-gray-300 cursor-pointer"
                                                                    >
                                                                        Select
                                                                    </button>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="grid place-items-center border border-dashed border-gray-300 bg-gray-50 py-16">
                                            <div className="text-center">
                                                <Package2 className="mx-auto mb-3 text-gray-400" size={28} />
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    No Custom Mockups
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Upload custom mockups from the right panel.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Panel */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="border border-gray-200 bg-white p-5">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center bg-[#f05a28]/10 text-[#f05a28]">
                                                <UploadCloud size={18} />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-black text-gray-900">
                                                    Add Custom Mockups
                                                </h2>
                                                <p className="text-sm text-gray-500">
                                                    Upload multiple mockup images.
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
                                            {uploadingImage ? "Uploading..." : "Choose Mockups"}
                                        </label>

                                        <p className="mt-3 text-xs text-gray-500">
                                            Every upload becomes a new selectable custom mockup.
                                        </p>

                                        {customVariants.length > 0 && (
                                            <div className="mt-4 space-y-3">
                                                <p className="text-sm font-semibold text-gray-700">
                                                    Uploaded Mockups ({customVariants.length})
                                                </p>

                                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                                    {customVariants.map((variant) => {
                                                        const isSelected = selectedVariantIds.includes(variant._id);
                                                        return (
                                                            <CustomVariantPreview
                                                                key={variant._id}
                                                                variant={variant}
                                                                isSelected={isSelected}
                                                                onToggleSelect={toggleVariant}
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
                        </div>
                    </div>
                )}

                {/* ── STEP 2: Details ── */}
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
                                            Products Details
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            These details will apply to the product.
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
                                                value={productDetails.title}
                                                onChange={(e) =>
                                                    setProductDetails(prev => ({
                                                        ...prev,
                                                        title: e.target.value,
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

                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={currentTag}
                                                    onChange={(e) => setCurrentTag(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && currentTag.trim()) {
                                                            e.preventDefault();
                                                            const newTag = currentTag.trim();
                                                            const currentTags = productDetails.tags
                                                                .split(",")
                                                                .map(t => t.trim())
                                                                .filter(t => t.length > 0);

                                                            if (!currentTags.some(t => t.toLowerCase() === newTag.toLowerCase())) {
                                                                const updatedTags = [...currentTags, newTag];
                                                                setProductDetails(prev => ({
                                                                    ...prev,
                                                                    tags: updatedTags.join(", "),
                                                                }));
                                                            }
                                                            setCurrentTag("");
                                                        } else if (e.key === "Backspace" && !currentTag) {
                                                            e.preventDefault();
                                                            const currentTags = productDetails.tags
                                                                .split(",")
                                                                .map(t => t.trim())
                                                                .filter(t => t.length > 0);

                                                            if (currentTags.length > 0) {
                                                                currentTags.pop();
                                                                setProductDetails(prev => ({
                                                                    ...prev,
                                                                    tags: currentTags.join(", "),
                                                                }));
                                                            }
                                                        }
                                                    }}
                                                    placeholder="Type a tag and press Enter"
                                                    className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#f05a28] focus:ring-1 focus:ring-[#f05a28]/20 transition-all cursor-text"
                                                />
                                            </div>

                                            {productDetails.tags && productDetails.tags.split(",").filter(t => t.trim()).length > 0 && (
                                                <div className="border border-gray-200 bg-gray-50/50 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Added Tags
                                                        </h4>
                                                        <span className="text-xs text-gray-400 font-medium">
                                                            {productDetails.tags.split(",").filter(t => t.trim()).length} tag(s)
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {productDetails.tags
                                                            .split(",")
                                                            .map(t => t.trim())
                                                            .filter(t => t.length > 0)
                                                            .map((tag, index) => (
                                                                <span
                                                                    key={`${tag}-${index}`}
                                                                    className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700 font-medium shadow-sm hover:shadow-md hover:border-[#f05a28]/30 transition-all duration-200 group"
                                                                >
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
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const currentTags = productDetails.tags
                                                                                .split(",")
                                                                                .map(t => t.trim())
                                                                                .filter(t => t.length > 0);
                                                                            const updatedTags = currentTags.filter((_, i) => i !== index);
                                                                            setProductDetails(prev => ({
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
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Description
                                        </label>
                                        <Suspense fallback={<div className="border p-4 text-gray-400">Loading editor...</div>}>
                                            <RichTextEditor
                                                value={productDetails.description}
                                                onChange={(htmlContent) =>
                                                    setProductDetails(prev => ({
                                                        ...prev,
                                                        description: htmlContent,
                                                    }))
                                                }
                                            />
                                        </Suspense>
                                        <p className="mt-2 text-xs text-gray-500">
                                            You can format text with bold, italic, lists, images, and links.
                                        </p>
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

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="border border-gray-200 bg-white p-5">
                                <h3 className="text-lg font-black text-gray-900">Selection Summary</h3>

                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                        <span className="text-gray-500">Product variants</span>
                                        <span className="font-semibold text-gray-900">
                                            {defaultSelectedCount}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                        <span className="text-gray-500">Custom mockups</span>
                                        <span className="font-semibold text-gray-900">
                                            {customSelectedCount}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                        <span className="text-gray-500">Generated mockups</span>
                                        <span className="font-semibold text-gray-900">
                                            {generatedSelectedCount}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 font-bold text-gray-900">
                                        <span>Total selected</span>
                                        <span>{selectedVariantIds.length}</span>
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