import React, { useEffect, useState } from "react";
import { getProductsByCategory, deleteProductById } from "../api/product.api";
import { Link, useParams } from "react-router-dom";

/** Small placeholder when image is missing */
const PlaceholderImage = ({ className = "" }) => (
  <div
    className={`w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 ${className}`}
  >
    No image
  </div>
);

const SubCategoryProduct = () => {
  const { subCategoryId } = useParams();

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!subCategoryId) return;

    let mounted = true;
    setLoading(true);
    setError("");
    setProducts([]);




    const fetchProducts = async () => {
      try {
        const result = await getProductsByCategory(subCategoryId);
        // result might be { success: true, data: [...] } if your API returns full response
        const arrRaw = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];

        // Normalize each product: create lowercase `printareas` and `variants`
        const normalized = arrRaw.map((r) => {
          return {
            ...r,
            // normalize print areas (handle different casing coming from backend)
            printareas: Array.isArray(r.Printareas)
              ? r.Printareas
              : Array.isArray(r.printareas)
                ? r.printareas
                : [],
            // normalize variants (handle different casing coming from backend)
            variants: Array.isArray(r.Variants)
              ? r.Variants
              : Array.isArray(r.variants)
                ? r.variants
                : [],
          };
        });

        if (!mounted) return;
        setProducts(normalized);
      } catch (err) {
        console.error("Products fetch error:", err);
        if (!mounted) return;
        setError("Failed to load products. Try again later.");
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [subCategoryId]);

  console.log(products, "<<<<< normalized products");

  const handleDeleteProduct = async (productId) => {
    if (!productId) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProductById(productId);

      // modal band
      setSelected(null);

      // UI se product remove (no refetch needed)
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Delete product error:", err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Status */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading products…</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No products found.</div>
      ) : null}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((p) => {
          // NOW we rely on normalized fields:
          const variantsArr = Array.isArray(p?.variants) ? p?.variants : [];
          const printareasArr = Array.isArray(p?.printareas) ? p?.printareas : [];
          const firstVariant = variantsArr[0] || null;

          return (
            <div
              key={p?._id}
              onClick={() => setSelected(p)}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition cursor-pointer overflow-hidden"
            >
              {/* CATEGORY THUMB */}
              <div className="h-40 bg-gray-200">
                {p?.category && p?.category?.thumbnail && p?.category?.thumbnail?.url ? (
                  <img
                    src={p?.category?.thumbnail?.url}
                    alt={p?.category?.name || "category thumbnail"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlaceholderImage />
                )}
              </div>

              <div className="p-5 space-y-2">
                <h2 className="text-lg font-semibold line-clamp-1">
                  {p?.productTitle || "Untitled product"}
                </h2>

                <p className="text-sm text-gray-500">Internal: {p?.internalName || "—"}</p>

                <p className="text-sm text-gray-600 line-clamp-2">{p?.description || "No description"}</p>

                {/* TAGS */}
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                    {p?.category?.name || "—"}
                  </span>

                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                    {p?.fulfilmentProvider?.provider || "—"}
                  </span>
                </div>

                {/* VARIANT PREVIEW */}
                {firstVariant ? (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-lg font-bold text-indigo-600">${firstVariant?.basePrice}</span>

                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: firstVariant?.colorHex || "#fff" }}
                    />

                    <span
                      className={`ml-auto text-xs px-2 py-1 rounded ${firstVariant?.available === "available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                    >
                      {firstVariant?.available || "unknown"}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs italic text-gray-400 mt-3">No variants added</p>
                )}

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{printareasArr?.length} Print Areas</span>
                  <span>ID #{p?.fulfilmentCatalogID || "—"}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{variantsArr?.length} Variant</span>
                  {/* <span>ID #{p.fulfilmentCatalogID || "—"}</span> */}
                  <span>base Price #{firstVariant?.basePrice || "—"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer">
              ✕
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* LEFT */}
              <div className="lg:w-1/2">
                <div className="rounded-xl w-full h-64 overflow-hidden bg-gray-100">
                  {selected.category?.thumbnail?.url ? (
                    <img src={selected.category.thumbnail.url} alt={selected.category?.category || "category"} className="w-full h-full object-cover" />
                  ) : (
                    <PlaceholderImage className="h-64" />
                  )}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div><b>Category:</b> {selected.category?.name || "—"}</div>
                  <div><b>Provider:</b> {selected.fulfilmentProvider?.provider || "—"}</div>
                  <div><b>Catalog ID:</b> {selected.fulfilmentCatalogID || "—"}</div>
                  <div><b>Created:</b> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}</div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-bold">{selected.productTitle || "Untitled"}</h2>

                <p className="text-sm text-gray-500 mt-1">{selected.internalName || "—"}</p>

                <p className="mt-4 text-gray-700">{selected.description || "No description"}</p>

                {/* PRINT AREAS */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Print Areas</h3>
                  <div className="space-y-2">
                    {(Array.isArray(selected.printareas) ? selected.printareas : []).length === 0 ? (
                      <p className="text-sm italic text-gray-400">No print areas available</p>
                    ) : (
                      (selected.printareas || []).map((pa, i) => (
                        <div key={i} className="flex justify-between border rounded-lg p-2 text-sm">
                          <span>{pa.displayName || `Area ${i + 1}`}</span>
                          <span>{pa.width ?? "—"} × {pa.height ?? "—"}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* VARIANTS */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Variants</h3>

                  {(Array.isArray(selected.variants) ? selected.variants : []).length === 0 ? (
                    <p className="text-sm italic text-gray-400">No variants available</p>
                  ) : (
                    (selected.variants || []).map((v) => (
                      <div key={v._id || `${v.sku}-${Math.random()}`} className="border rounded-xl p-3 text-sm bg-gray-50 mb-3">
                        <div className="flex justify-between mb-2">
                          <span>SKU: {v.sku || "—"}</span>
                          <span className="font-bold text-indigo-600">${v.basePrice ?? "—"}</span>
                        </div>

                        {/* <div className="grid grid-cols-2 gap-2 text-gray-600">
                          <span>Size: {v.size ?? "—"}</span>
                          <span>Weight: {v.weight ?? "—"}</span>
                        </div> */}

                        <div className="flex items-center gap-2 mt-3">
                          <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: v.colorHex || "#fff" }} />
                          <span>{v.color || "—"}</span>

                          <span className={`ml-auto text-xs px-2 py-1 rounded ${v.available === "available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {v.available || "unknown"}
                          </span>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">Campaign: {v.addToCampaigns ? "Included" : "Not included"}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-6 flex gap-3">
                  <Link to={`/admin/product/${selected._id}`}>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer">Edit</button>
                  </Link>
                  <button onClick={() => handleDeleteProduct(selected?._id)} className="border text-red-600 px-4 py-2 rounded-lg cursor-pointer">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoryProduct;