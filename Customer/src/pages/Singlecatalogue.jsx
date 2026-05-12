import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ShoppingBag, Plus, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { getProductById } from "../api/category.api";


const Singlecatalogue = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();
  const productFromState = location.state?.product;

  const [productData, setProductData] = useState(productFromState || null);
  const [loading, setLoading] = useState(!productFromState);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState(new Set());

  // Gather all display images: thumbnail + mockup images
  const allImages = React.useMemo(() => {
    if (!productData) return [];
    const images = [];

    // Thumbnail first
    if (productData.thumbnail?.url) {
      images.push({ url: productData.thumbnail.url, name: "Main" });
    }

    // All mockup images (deduplicated by url)
    const seen = new Set();
    productData.mockupIds?.forEach((mockup) => {
      const url = mockup.mockupImage?.url;
      if (url && !seen.has(url)) {
        seen.add(url);
        images.push({ url, name: mockup.name || "Mockup" });
      }
    });

    // Filter out broken images
    return images.filter(img => !brokenImages.has(img.url));
  }, [productData, brokenImages]);

  const handleImageError = (url) => {
    setBrokenImages(prev => {
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(productId);
        setProductData(response);
      } catch (error) {
        console.log("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!productFromState && productId) {
      fetchProduct();
    }
  }, [productId]);

  // Reset active image when data changes
  useEffect(() => {
    setActiveImageIndex(0);
    setBrokenImages(new Set());
  }, [productData?._id]);

  // Adjust index if images are removed
  useEffect(() => {
    if (activeImageIndex >= allImages.length && allImages.length > 0) {
      setActiveImageIndex(allImages.length - 1);
    }
  }, [allImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f05a28] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-[#f05a28] font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentImage = allImages[activeImageIndex]?.url;

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap gap-2 mb-8 items-center justify-start pb-6">
          <button
            onClick={() => navigate(`/user/edit/${productId}`, { state: { createNew: true } })}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#f05a28] text-white text-[13px] font-bold rounded hover:opacity-90 transition-all"
          >
            <Plus size={14} /> Create Product
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square bg-white border border-gray-100 overflow-hidden shadow-sm rounded-lg group">
              {currentImage && (
                <img
                  src={currentImage}
                  alt={productData.productTitle}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(currentImage)}
                />
              )}
              {!currentImage && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                   <div className="text-sm font-medium">No valid images available</div>
                </div>
              )}
              {/* Navigation Arrows (if more than 1 image) */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? allImages.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === allImages.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              {/* Image Counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {activeImageIndex + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImageIndex
                        ? "border-[#f05a28] shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    <img
                      src={img.url}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(img.url)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="lg:col-span-6 space-y-8">
            {/* Title & Category */}
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-gray-900">
                {productData.productTitle}
              </h1>
              {productData.category?.name && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {productData.category.name}
                </span>
              )}
              <p className="text-[11px] text-gray-400">
                Created:{" "}
                {productData.createdAt
                  ? new Date(productData.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  : "N/A"}
              </p>
            </div>

            {/* Price Summary (first variant) */}
            <div className="flex items-end gap-4">
              <div>
                <p className="text-sm text-gray-500">Starting at</p>
                <div className="text-3xl font-black text-gray-900">
                  ${productData.Variants?.[0]?.basePrice?.toFixed(2) || "0.00"}
                </div>
              </div>
              {productData.Variants?.length > 1 && (
                <span className="text-xs text-gray-400 mb-1">+ more variants</span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                Description
              </h4>
              <div
                className="text-[14px] text-gray-600 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: productData.description || "No description available",
                }}
              />
            </div>

            {/* Variants Table */}
            {productData.Variants && productData.Variants.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                  Variants ({productData.Variants.length})
                </h4>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                          Color
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                          SKU
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">
                          Base Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">
                          Cost Price
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                          Available
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {productData.Variants.map((variant) => (
                        <tr key={variant._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-5 h-5 rounded-full border border-gray-300 inline-block"
                                style={{ backgroundColor: variant.colorHex || "#ccc" }}
                                title={variant.color}
                              />
                              <span className="text-gray-900 font-medium">
                                {variant.color}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                            {variant.sku || variant.variantsName}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">
                            ${variant.basePrice?.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-600">
                            ${variant.baseCost?.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {variant.stock !== undefined && variant.stock !== null
                              ? variant.stock >= 99999
                                ? "∞"
                                : variant.stock
                              : "–"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${variant.available === "available"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                                }`}
                            >
                              {variant.available === "available"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Singlecatalogue;