import React, { useState, useMemo, useEffect } from "react";
import { Box } from "@mui/material";
import { Search } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getProductsByCategory, getSubCategoriesByParent } from "../api/category.api";

export default function Subcatalogue() {
  const { subCategoryId } = useParams();

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getChildrenCategory = async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await getSubCategoriesByParent(id);
      setCategories(res || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (id) => {
    try {
      const res = await getProductsByCategory(id);

      // ✅ res already array hai
      // Agar backend poori list deta hai to frontend filter bhi kar lo:
      const filtered = (res || []).filter((p) => {
        const catId = p?.category?._id || p?.category;
        return String(catId) === String(id);
      });

      setProducts(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!subCategoryId) return;

    const loadData = async () => {
      setLoading(true);

      const children = await getSubCategoriesByParent(subCategoryId);
      setCategories(children || []);

      // agar children nahi hain to products load karo
      if (!children || children.length === 0) {
        const prods = await getProductsByCategory(subCategoryId);
        setProducts(prods || []);
      }

      setLoading(false);
    };

    loadData();
  }, [subCategoryId]);

  const filteredCategories = useMemo(() => {
    let arr = categories;

    if (search) {
      arr = arr.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return arr;
  }, [search, categories]);

  const filteredProducts = useMemo(() => {
    let arr = products;

    if (search) {
      arr = arr.filter((p) =>
        p.productTitle?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return arr;
  }, [search, products]);

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <h1 className="text-4xl font-[900] mb-[20px] text-gray-900 tracking-tight">
        Sub Catalogue
      </h1>

      <div className="w-full flex flex-col mb-10 md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-[#f8f8f8] border border-transparent py-4 pl-12 pr-6 rounded-[20px] text-[13px] font-medium text-gray-900 outline-none focus:bg-white focus:border-[#f05a28]/20"
          />
        </div>
      </div>

      {loading && <div className="text-center py-20">Loading...</div>}

      {!loading && filteredCategories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCategories.map((c) => (
            <Link
              to={`/user/sub-catalogue/${c._id}`}
              key={c._id}
              className="group relative w-full block"
            >
              <div className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={c?.thumbnail?.url}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-3">
                  <h3 className="text-[13px] font-bold text-gray-900 truncate">
                    {c.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredCategories.length === 0 && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((p) => (
            <Link
              to={`/user/single-catalogue/${p._id}`}
              key={p._id}
              className="group relative w-full block"
            >
              <div className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={p?.thumbnail?.url || p?.category?.thumbnail?.url}
                    alt={p.productTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-3">
                  <h3 className="text-[13px] font-bold text-gray-900 truncate">
                    {p.productTitle}
                  </h3>

                  <p className="text-xs text-gray-500">
                    ${p?.Variants?.[0]?.basePrice || "0.00"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredCategories.length === 0 && filteredProducts.length === 0 && (
        <div className="py-20 text-center text-gray-400 text-sm italic">
          No data found.
        </div>
      )}
    </Box>
  );
}