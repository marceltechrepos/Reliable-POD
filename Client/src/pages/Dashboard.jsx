// Dashboard.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Layers,
  Settings,
  Plus,
  TrendingUp,
  ChevronRight,
  Server,
  Cloud,
  Activity,
  Search,
  Filter,
  Zap,
  Eye,
  Edit2,
  Trash2,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Grid,
  List,
  DollarSign,
  Users
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

/* -------------------------
  Advanced Tabbed Dashboard w/ working CRUD, search & filters (dummy state)
  - Modal UI for add/edit/view
  - Search + Filter within Products & Orders
  - Delete confirmations
  ------------------------- */

const COLORS = ["#6366f1", "#fb923c", "#10b981", "#ef4444", "#8b5cf6"];

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Reliable POD — Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Insightful dashboard for orders, products & categories</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition">
            <Search size={16} className="text-slate-400" />
            <input
              className="outline-none text-sm bg-transparent w-48"
              placeholder="Quick search..."
            />
          </div>

          {/* <button
            onClick={() => setShowAddProductModal(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition active:scale-95 shadow-sm hover:shadow"
          >
            <Plus size={16} /> Add Product
          </button> */}
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TabButton active={tab === "overview"} onClick={() => setTab("overview")}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                Overview
              </div>
            </TabButton>
            <TabButton active={tab === "products"} onClick={() => setTab("products")}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                Products
              </div>
            </TabButton>
            <TabButton active={tab === "orders"} onClick={() => setTab("orders")}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                Orders
              </div>
            </TabButton>
            <TabButton active={tab === "categories"} onClick={() => setTab("categories")}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Categories
              </div>
            </TabButton>
          </div>
          <div className="text-sm text-slate-500 italic">Live snapshot · {new Date().toLocaleDateString()}</div>
        </div>

        <div className="mt-5">
          {tab === "overview" && <OverviewTab />}
          {tab === "products" && <ProductsTab showAddModal={showAddProductModal} setShowAddModal={setShowAddProductModal} />}
          {tab === "orders" && <OrdersTab />}
          {tab === "categories" && <CategoriesTab />}
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   UI small bits
   ------------------------- */
function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${active
        ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 shadow-sm"
        : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
        }`}
    >
      {children}
    </button>
  );
}

/* -------------------------
   Overview Tab (charts remain static)
   ------------------------- */
function OverviewTab() {
  const salesData = useMemo(() => [
    { month: "Jan", sales: 4000, orders: 120 },
    { month: "Feb", sales: 3200, orders: 98 },
    { month: "Mar", sales: 4500, orders: 140 },
    { month: "Apr", sales: 5200, orders: 170 },
    { month: "May", sales: 6100, orders: 190 },
    { month: "Jun", sales: 7000, orders: 220 },
  ], []);

  const productsByCategory = useMemo(() => [
    { name: "Tees", value: 24 },
    { name: "Hats", value: 12 },
    { name: "Mugs", value: 9 },
    { name: "Stickers", value: 13 },
    { name: "Hoodies", value: 8 },
  ], []);

  const total = productsByCategory.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percent = ((value / total) * 100).toFixed(0);

      return (
        <div className="bg-white px-3 py-2 rounded shadow text-xs text-slate-800">
          <p className="font-semibold">{name}</p>
          <p>{percent}%</p>
        </div>
      );
    }

    return null;
  };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value="1,240" change="+12%" icon={<ShoppingCart size={18} />} color="indigo" />
        <StatCard title="Total Products" value="58" change="+4%" icon={<Package size={18} />} color="orange" />
        <StatCard title="Active Categories" value="12" change="+1%" icon={<Layers size={18} />} color="emerald" />
        <StatCard title="Total Revenue" value="$29.5K" change="+18%" icon={<DollarSign size={18} />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">Sales (last 6 months)</h3>
              <p className="text-xs text-slate-500 mt-1">Revenue & orders trend</p>
            </div>
            <div className="text-xs text-slate-500">Total: $29,500</div>
          </div>

          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm font-semibold text-slate-800">Orders Trend</h3>
            <div className="h-28 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#fb923c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Products by Category
            </h3>

            {/* height barhai */}
            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    className="cursor-pointer"
                    data={productsByCategory}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={4}
                    label={false}
                  >
                    {productsByCategory.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  {/* 🔥 Hover Tooltip */}
                  <Tooltip content={<CustomTooltip />} />

                  {/* Legend WITHOUT percentage */}
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{
                      fontSize: "12px",
                      marginTop: "10px",
                    }}
                  />
                </PieChart>


              </ResponsiveContainer>
            </div>
          </div>


          {/* <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm font-semibold text-slate-800">Products by Category</h3>
            <div className="h-28 flex items-center justify-center mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productsByCategory}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={28}
                    outerRadius={48}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {productsByCategory.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={24} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div> */}

          {/* <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm font-semibold text-slate-800">Quick System</h3>
            <div className="space-y-3 mt-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-slate-600"><Server size={15} /> API Server</div>
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Online
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-slate-600"><Cloud size={15} /> Cloud Storage</div>
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Connected
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-slate-600"><Activity size={15} /> Provider Sync</div>
                <div className="flex items-center gap-1 text-amber-600 font-medium">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  Active
                </div>
              </div>
            </div>
          </div> */}

        </div>
      </div>
    </div>
  );
}

/* ==========================
   PRODUCTS TAB
   - Working: add / edit / delete / view / search / filter
   ========================== */
function ProductsTab({ showAddModal, setShowAddModal }) {
  // initial dummy data state
  const [products, setProducts] = useState(() => [
    { id: "P-1001", title: "Classic Tee", sku: "CT-001", stock: 120, price: 18.5, variants: 4, category: "Tees", desc: "Soft cotton tee", status: "Active", createdAt: "2024-01-15" },
    { id: "P-1002", title: "Logo Mug", sku: "MG-021", stock: 50, price: 9.99, variants: 2, category: "Mugs", desc: "Ceramic mug with print", status: "Active", createdAt: "2024-01-14" },
    { id: "P-1003", title: "Snapback Hat", sku: "HT-007", stock: 75, price: 22.0, variants: 3, category: "Hats", desc: "Adjustable snapback", status: "Low Stock", createdAt: "2024-01-13" },
    { id: "P-1004", title: "Premium Hoodie", sku: "HD-045", stock: 35, price: 45.99, variants: 5, category: "Hoodies", desc: "Premium quality hoodie", status: "Active", createdAt: "2024-01-12" },
    { id: "P-1005", title: "Sticker Pack", sku: "ST-112", stock: 200, price: 4.99, variants: 8, category: "Stickers", desc: "Premium vinyl stickers", status: "Active", createdAt: "2024-01-11" },
  ]);

  const categories = ["All", "Tees", "Hats", "Mugs", "Stickers", "Hoodies"];
  const statuses = ["All", "Active", "Low Stock", "Out of Stock"];

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewType, setViewType] = useState("list");

  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase()) ||
        product.desc.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, query, categoryFilter, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock < 50).length;
    const activeProducts = products.filter(p => p.status === "Active").length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return { totalProducts, lowStock, activeProducts, totalValue };
  }, [products]);

  // Add product function
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: `P-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: productData.stock > 50 ? "Active" : "Low Stock"
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  // Update product function
  const updateProduct = (id, productData) => {
    setProducts(prev => prev.map(p =>
      p.id === id
        ? {
          ...p,
          ...productData,
          status: productData.stock > 50 ? "Active" : "Low Stock"
        }
        : p
    ));
  };

  // Delete product function
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Total Products</div>
              <div className="text-2xl font-semibold text-slate-800 mt-1">{stats.totalProducts}</div>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Package className="text-indigo-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Low Stock</div>
              <div className="text-2xl font-semibold text-slate-800 mt-1">{stats.lowStock}</div>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertCircle className="text-orange-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Active Products</div>
              <div className="text-2xl font-semibold text-slate-800 mt-1">{stats.activeProducts}</div>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="text-emerald-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Inventory Value</div>
              <div className="text-2xl font-semibold text-slate-800 mt-1">${stats.totalValue.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <DollarSign className="text-purple-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-800">Product Inventory</h3>
            <p className="text-sm text-slate-500 mt-1">Manage your print-on-demand products</p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg">
              <button
                onClick={() => setViewType("grid")}
                className={`p-2 rounded ${viewType === "grid" ? "bg-white shadow" : "hover:bg-slate-100"}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`p-2 rounded ${viewType === "list" ? "bg-white shadow" : "hover:bg-slate-100"}`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-48"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Add Product Button */}
            <button
              onClick={() => {
                setEditItem(null);
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition active:scale-95 shadow-sm hover:shadow"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Products List/Grid */}
        {viewType === "list" ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">SKU</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{product.title}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">{product.desc}</div>
                    </td>
                    <td className="py-3 px-4">
                      <code className="bg-slate-50 px-2 py-1 rounded text-sm">{product.sku}</code>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{product.stock}</div>
                        <div className="w-24 bg-slate-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${product.stock > 100 ? 'bg-emerald-500' :
                              product.stock > 50 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                            style={{ width: `${Math.min(100, (product.stock / 200) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      ${product.price ? Number(product.price).toFixed(2) : '0.00'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                        product.status === 'Low Stock' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                        {product.status === 'Active' && <CheckCircle size={12} className="mr-1" />}
                        {product.status === 'Low Stock' && <AlertCircle size={12} className="mr-1" />}
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewItem(product)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditItem(product);
                            setShowAddModal(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ open: true, id: product.id })}
                          className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto text-slate-300 mb-3" size={48} />
                <div className="text-lg font-medium text-slate-700">No products found</div>
                <div className="text-sm text-slate-500 mt-1">Try changing your search or filters</div>
              </div>
            )}
          </div>
        ) : (
          // Grid View
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-800">{product.title}</h4>
                    <div className="text-xs text-slate-500 mt-1">{product.sku}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                    product.status === 'Low Stock' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                    {product.status}
                  </span>
                </div>

                <div className="text-sm text-slate-600 mb-4 line-clamp-2">{product.desc}</div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Stock</span>
                    <span className="font-medium">{product.stock} units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Price</span>
                    <span className="font-medium text-slate-800">${product.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setViewItem(product)}
                    className="flex-1 text-center py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      setEditItem(product);
                      setShowAddModal(true);
                    }}
                    className="flex-1 text-center py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ open: true, id: product.id })}
                    className="flex-1 text-center py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <ProductFormModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditItem(null);
          }}
          onSubmit={(data) => {
            if (editItem) {
              updateProduct(editItem.id, data);
            } else {
              addProduct(data);
            }
            setShowAddModal(false);
            setEditItem(null);
          }}
          product={editItem}
          categories={categories.filter(c => c !== "All")}
        />
      )}

      {viewItem && (
        <ViewProductModal
          isOpen={!!viewItem}
          onClose={() => setViewItem(null)}
          product={viewItem}
        />
      )}

      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={() => {
          deleteProduct(confirmDelete.id);
          setConfirmDelete({ open: false, id: null });
        }}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}

/* ==========================
   MODALS COMPONENTS
   ========================== */

function ProductFormModal({ isOpen, onClose, onSubmit, product, categories }) {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    sku: product?.sku || '',
    category: product?.category || categories[0] || '',
    price: product?.price || '',
    stock: product?.stock || '',
    variants: product?.variants || 1,
    desc: product?.desc || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {product ? 'Update product details' : 'Create a new print-on-demand product'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                SKU *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="e.g., TEE-001"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Price ($) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Initial Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Variants
              </label>
              <input
                type="number"
                min="1"
                value={formData.variants}
                onChange={(e) => setFormData({ ...formData, variants: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Number of variants"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              rows={4}
              placeholder="Describe your product..."
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-700 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition active:scale-95 shadow-sm hover:shadow"
            >
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ViewProductModal({ isOpen, onClose, product }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10">
        {/* Header */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">{product.title}</h2>
              <p className="text-sm text-slate-500 mt-1">Product Details</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-500">SKU</div>
                <div className="font-medium text-slate-800">{product.sku}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Category</div>
                <div className="font-medium text-slate-800">{product.category}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Status</div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                  product.status === 'Low Stock' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                  {product.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-500">Price</div>
                <div className="font-medium text-slate-800">${product.price.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Current Stock</div>
                <div className="font-medium text-slate-800">{product.stock} units</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Variants</div>
                <div className="font-medium text-slate-800">{product.variants}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500 mb-2">Description</div>
            <div className="text-slate-700 bg-slate-50 rounded-lg p-4">
              {product.desc}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-200">
            <div>Created: {product.createdAt}</div>
            <div>ID: {product.id}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-slate-700 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
              <p className="text-sm text-slate-500 mt-1">{message}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-slate-700 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================
   ORDERS TAB (with view, edit & filter)
   ========================== */
function OrdersTab() {
  const [orders, setOrders] = useState([
    { id: "ORD-1010", customer: "Aisha", status: "Processing", amount: 43.2, date: "2026-01-07", items: 2, notes: "Rush delivery" },
    { id: "ORD-1009", customer: "Fahad", status: "Shipped", amount: 120.0, date: "2026-01-06", items: 5, notes: "Gift wrap" },
    { id: "ORD-1008", customer: "Nida", status: "Completed", amount: 18.9, date: "2026-01-05", items: 1, notes: "" },
    { id: "ORD-1007", customer: "Omar", status: "Returned", amount: 32.0, date: "2026-01-04", items: 1, notes: "Wrong size" },
  ]);

  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);

  const statusOptions = ["All", "Processing", "Shipped", "Completed", "Returned", "Cancelled"];

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch =
        o.id.toLowerCase().includes(orderQuery.toLowerCase()) ||
        o.customer.toLowerCase().includes(orderQuery.toLowerCase());

      const matchesStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderQuery, orderStatusFilter]);

  const updateOrder = (id, changes) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, ...changes } : o)));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={orders.length} change="+12%" icon={<ShoppingCart size={18} />} color="indigo" />
        <StatCard title="Processing" value={orders.filter(o => o.status === "Processing").length} change="-2%" icon={<Clock size={18} />} color="orange" />
        <StatCard title="Shipped" value={orders.filter(o => o.status === "Shipped").length} change="+8%" icon={<Package size={18} />} color="emerald" />
        <StatCard title="Revenue" value={`$${orders.reduce((s, o) => s + o.amount, 0).toLocaleString()}`} change="+18%" icon={<DollarSign size={18} />} color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800">Recent Orders</h3>
            <p className="text-sm text-slate-500 mt-1">Latest customer orders</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search orders..."
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-48"
              />
            </div>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-medium text-slate-800">{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{order.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                      order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700' :
                        order.status === 'Processing' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-700'
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">${order.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewOrder(order)}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setEditOrder(order)}
                        className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {viewOrder && (
        <ViewOrderModal
          isOpen={!!viewOrder}
          onClose={() => setViewOrder(null)}
          order={viewOrder}
        />
      )}

      {editOrder && (
        <EditOrderModal
          isOpen={!!editOrder}
          onClose={() => setEditOrder(null)}
          order={editOrder}
          onSave={(changes) => {
            updateOrder(editOrder.id, changes);
            setEditOrder(null);
          }}
        />
      )}
    </div>
  );
}

/* ==========================
   ViewOrderModal
   ========================== */
function ViewOrderModal({ isOpen, onClose, order }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Order {order.id}</h2>
              <p className="text-sm text-slate-500 mt-1">Customer: {order.customer}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-500">Order ID</div>
              <div className="font-medium text-slate-800">{order.id}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Date</div>
              <div className="font-medium text-slate-800">{order.date}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Items</div>
              <div className="font-medium text-slate-800">{order.items}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Amount</div>
              <div className="font-medium text-slate-800">${order.amount.toFixed(2)}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-slate-500">Status</div>
              <div className="font-medium text-slate-800">{order.status}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500 mb-2">Notes</div>
            <div className="text-slate-700 bg-slate-50 rounded-lg p-4">{order.notes || "—"}</div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2.5 text-slate-700 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition">Close</button>
        </div>
      </div>
    </div>
  );
}

/* ==========================
   EditOrderModal (change status)
   ========================== */
function EditOrderModal({ isOpen, onClose, order, onSave }) {
  const [status, setStatus] = useState(order?.status || "Processing");

  useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  if (!isOpen) return null;

  const statusOptions = ["Processing", "Shipped", "Completed", "Returned", "Cancelled"];

  const handleSave = () => {
    onSave({ status });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
        <div className="border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Edit Order {order.id}</h2>
            <p className="text-sm text-slate-500 mt-1">Update order status</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition"><X size={20} className="text-slate-500" /></button>
        </div>

        <div className="p-6">
          <label className="block text-sm text-slate-700 mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button onClick={onClose} className="px-4 py-2.5 text-slate-700 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition active:scale-95">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}




/* ==========================
   CATEGORIES TAB (with add/view/edit)
   ========================== */
function CategoriesTab() {
  const [categories, setCategories] = useState([
    { id: "C1", name: "Tees", count: 24, revenue: "$5,280", desc: "T-shirts collection" },
    { id: "C2", name: "Hats", count: 12, revenue: "$2,640", desc: "Caps & hats" },
    { id: "C3", name: "Mugs", count: 9, revenue: "$1,980", desc: "Ceramic mugs" },
    { id: "C4", name: "Stickers", count: 13, revenue: "$2,860", desc: "Vinyl stickers" },
    { id: "C5", name: "Hoodies", count: 8, revenue: "$3,520", desc: "Warm hoodies" },
  ]);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [viewCategory, setViewCategory] = useState(null);
  const [editCategory, setEditCategory] = useState(null);

  const addCategory = (catData) => {
    const newCat = { ...catData, id: `C-${Date.now()}` };
    setCategories(prev => [newCat, ...prev]);
  };

  const updateCategory = (id, catData) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...catData } : c));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Categories" value={categories.length} change="+1%" icon={<Layers size={18} />} color="indigo" />
        <StatCard title="Active Products" value="58" change="+4%" icon={<Package size={18} />} color="orange" />
        <StatCard title="Top Category" value="Tees" change="+12%" icon={<TrendingUp size={18} />} color="emerald" />
        <StatCard title="Avg. Items" value={(categories.reduce((s, c) => s + c.count, 0) / categories.length).toFixed(1)} change="+3%" icon={<Grid size={18} />} color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800">Categories</h3>
            <p className="text-sm text-slate-500 mt-1">Product categories performance</p>
          </div>
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition active:scale-95"
          >
            <Plus size={16} /> New Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-800">{cat.name}</h4>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                  {cat.count} items
                </span>
              </div>
              <div className="text-sm text-slate-600 mb-3">Revenue: {cat.revenue}</div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-2 bg-indigo-500 rounded-full" style={{ width: `${(cat.count / 30) * 100}%` }} />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => setViewCategory(cat)} className="flex-1 text-center py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition">View</button>
                <button onClick={() => setEditCategory(cat)} className="flex-1 text-center py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit / View Modals */}
      {showAddCategoryModal && (
        <CategoryFormModal
          isOpen={showAddCategoryModal}
          onClose={() => setShowAddCategoryModal(false)}
          onSubmit={(data) => {
            addCategory(data);
            setShowAddCategoryModal(false);
          }}
        />
      )}

      {viewCategory && (
        <ViewCategoryModal isOpen={!!viewCategory} onClose={() => setViewCategory(null)} category={viewCategory} />
      )}

      {editCategory && (
        <CategoryFormModal
          isOpen={!!editCategory}
          onClose={() => setEditCategory(null)}
          category={editCategory}
          onSubmit={(data) => {
            updateCategory(editCategory.id, data);
            setEditCategory(null);
          }}
        />
      )}
    </div>
  );
}


/* ==========================
   CategoryFormModal (used for add & edit)
   Props:
     - isOpen, onClose, onSubmit, category (optional)
   ========================== */
function CategoryFormModal({ isOpen, onClose, onSubmit, category }) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    count: category?.count || 0,
    revenue: category?.revenue || "$0",
    desc: category?.desc || ""
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        count: category.count || 0,
        revenue: category.revenue || "$0",
        desc: category.desc || ""
      });
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10">
        <div className="border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{category ? "Edit Category" : "New Category"}</h2>
            <p className="text-sm text-slate-500 mt-1">{category ? "Update category details" : "Create a new category"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition"><X size={20} className="text-slate-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Category Name</label>
            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Items Count</label>
              <input type="number" value={formData.count} onChange={e => setFormData({ ...formData, count: Number(e.target.value) })} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Revenue</label>
              <input value={formData.revenue} onChange={e => setFormData({ ...formData, revenue: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-slate-700 rounded-lg hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{category ? "Save" : "Add Category"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================
   ViewCategoryModal
   ========================== */
function ViewCategoryModal({ isOpen, onClose, category }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
        <div className="border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{category.name}</h2>
            <p className="text-sm text-slate-500 mt-1">Category details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition"><X size={20} className="text-slate-500" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-slate-500">Items</div>
            <div className="font-medium text-slate-800">{category.count}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Revenue</div>
            <div className="font-medium text-slate-800">{category.revenue}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Description</div>
            <div className="text-slate-700 bg-slate-50 rounded-lg p-4">{category.desc || "—"}</div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2.5 text-slate-700 rounded-lg hover:bg-slate-100">Close</button>
        </div>
      </div>
    </div>
  );
}


/* ==========================
   REUSABLE COMPONENTS
   ========================== */

function StatCard({ title, value, change, icon, color = "indigo" }) {
  const colorClass = {
    indigo: "bg-indigo-50 text-indigo-600",
    orange: "bg-orange-50 text-orange-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    slate: "bg-slate-100 text-slate-700"
  }[color];

  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4 hover:shadow-md transition">
      <div className={`p-3 rounded-lg ${colorClass}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs text-slate-500">{title}</div>
        <div className="text-lg font-semibold text-slate-800">{value}</div>
        {change && (
          <div className="text-xs text-emerald-600 mt-1 inline-flex items-center gap-1">
            <TrendingUp size={12} /> {change}
          </div>
        )}
      </div>
    </div>
  );
}