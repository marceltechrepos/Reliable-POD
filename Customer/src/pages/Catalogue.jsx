import React, { useState, useMemo, useEffect } from "react";
import { Box } from "@mui/material";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllCategory } from "../api/category.api";

export default function Catalogue() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCategory = async () => {
    try {
      setLoading(true);
      const res = await getAllCategory();

      console.log("API RESULT:", res); // confirm it's an array
      setCategories(res || []);

    } catch (error) {
      console.log(error, "<<<<< error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const filtered = useMemo(() => {
    let arr = categories;

    if (search) {
      arr = arr.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return arr;
  }, [search, categories]);

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <h1 className="text-4xl font-[900] mb-[20px] text-gray-900 tracking-tight">
        Product Catalogue
      </h1>

      {/* Search */}
      <div className="w-full flex flex-col mb-10 md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-[#f8f8f8] border border-transparent py-4 pl-12 pr-6 rounded-[20px] text-[13px] font-medium text-gray-900 outline-none
            focus:bg-white focus:border-[#f05a28]/20"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.map((c) => (
            <Link
              to={`/user/sub-catalogue/${c._id}`}
              key={c._id}
              className="group relative w-full block no-underline cursor-pointer"
            >
              <div className="relative bg-white overflow-hidden border border-gray-100/50 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-1">

                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-[#f9f9f9]">
                  <img
                    src={c?.thumbnail?.url || "https://via.placeholder.com/400"}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="p-3 bg-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-[1.5px] w-3 bg-[#f05a28] rounded-full"></span>
                    <span className="text-[8px] font-black text-[#f05a28] uppercase tracking-widest opacity-80">
                      {"Collection"}
                    </span>
                  </div>

                  <h3 className="text-[12px] font-[800] text-gray-900 tracking-tight leading-tight group-hover:text-[#f05a28] transition-colors duration-300 truncate">
                    {c.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-400 text-sm italic">
          No categories found.
        </div>
      )}
    </Box>
  );
}