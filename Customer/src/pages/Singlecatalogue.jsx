import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import image from "../assets/image/dummy.jpg";
import { ShoppingBag, Plus } from "lucide-react";
import { getProductById } from "../api/category.api";
import { getLayersByProductId } from "../api/layer.api"; // 🔥 ADD THIS IMPORT

const Singlecatalogue = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();
  const productFromState = location.state?.product;

  const [productData, setProductData] = useState(productFromState || null);
  const [loading, setLoading] = useState(!productFromState);
  const [mockupLayers, setMockupLayers] = useState([]); // 🔥 ADD THIS STATE

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


  console.log(productData, "<<< productData")

  // 🔥 ADD THIS useEffect - Fetch mockup layers
useEffect(() => {
    const fetchLayers = async () => {
        if (!productData?.mockupIds?.length) return;
        try {
            const firstMockup = productData.mockupIds[0];
            console.log(firstMockup ,  "<<<< firstMockup")
            const mockupId = firstMockup?._id || firstMockup; // ✅ String ID lo
            
            console.log("Mockup ID:", mockupId); // Debug ke liye
            
            const res = await getLayersByProductId(productData._id, mockupId);
            if (res.data) {
                setMockupLayers(res.data);
            }
        } catch (error) {
            console.error("Error fetching mockup layers:", error);
        }
    };
    if (productData) {
        fetchLayers();
    }
}, [productData]);

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

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-8 items-center justify-start pb-6">
          <button
            onClick={() => navigate(`/user/edit/${productId}`)}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#f05a28] text-white text-[13px] font-bold rounded hover:opacity-90 transition-all"
          >
            <Plus size={14} /> Create Print On Demand Product
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-4">
            {/* 🔥 UPDATE THIS DIV - Add relative positioning and mask layers */}
            <div className="relative aspect-square bg-white border border-gray-100 overflow-hidden shadow-sm">
              {/* Base product thumbnail */}
              <img
                src={productData?.thumbnail?.url || productData?.image || image}
                alt={productData?.productTitle || productData?.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = image;
                }}
              />

              {/* 🔥 ADD THIS BLOCK - Render mask/overlay images */}
              {mockupLayers
                .filter(layer => layer.type === "image" && layer.visible !== false)
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map((imageLayer) => (
                  <div
                    key={imageLayer._id}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${imageLayer.x_percent || 0}%`,
                      top: `${imageLayer.y_percent || 0}%`,
                      width: `${imageLayer.width_percent || 100}%`,
                      height: `${imageLayer.height_percent || 100}%`,
                      transform: `rotate(${imageLayer.rotation || 0}deg)`,
                      opacity: imageLayer.opacity ?? 1,
                    }}
                  >
                    <img
                      src={imageLayer.src}
                      alt=""
                      className="w-full h-full object-contain"
                      style={{
                        transform: `scaleX(${imageLayer.flipX ? -1 : 1}) scaleY(${imageLayer.flipY ? -1 : 1})`,
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8">
            {/* ... rest of your existing code (unchanged) ... */}
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-gray-400">
                fulfilmentCatalogID: {productData?.fulfilmentCatalogID || "N/A"}
              </p>
              <h1 className="text-3xl font-black text-gray-900">
                {productData?.productTitle || productData?.title}
              </h1>
              <p className="text-[11px] text-gray-400">
                Created at{" "}
                {productData?.createdAt
                  ? new Date(productData.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="text-2xl font-black text-gray-900">
              ${productData?.Variants?.[0]?.basePrice || productData?.price || "0.00"}
            </div>

            <div className="grid grid-cols-2 gap-8 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  Production Costs
                </p>
                <button className="text-[#00a185] text-[12px] font-bold underline">
                  View our production costs
                </button>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  Production Location
                </p>
                <div className="mt-1">
                  <img src="https://flagcdn.com/w40/us.png" className="w-7 shadow-sm" alt="USA" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase text-gray-400">
                Description
              </h4>
              <div
                className="text-[14px] text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: productData?.description || "No description available",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Singlecatalogue;