import React, { useEffect, useState } from "react";
import TabButton from "../components/Admin/TabButton";
import IconUser from "../components/Admin/IconUser";
import IconProvider from "../components/Admin/IconProvider";
import IconCategory from "../components/Admin/IconCategory";
import Thumb from "../components/Admin/Thumb";
import Accordion from "../components/Admin/Accordion";
import ProviderAccordion from "../components/Admin/ProviderAccordion";
import CloseIcon from '@mui/icons-material/Close';
import { userInfoApi, getUserDetail } from "../api/auth.api";
import { Link } from "react-router-dom"
import {
    getAllProvider,
    createProvider,
    updateProvider, deleteProvider
} from "../api/provider.api.js"
import {
    getAllCategory, createCategory, updateCategory, deleteCategory
} from "../api/category.api.js"
import {
    BRAND, FIELDS_CONFIG, buildDefaultUser, userInfoSample, providersSample, categoriesSample
} from "../utils/data.js"
import AddProviderModal from "../components/Admin/AddProviderModal.jsx";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("user");
    const [openProvider, setOpenProvider] = useState(null);
    const [openCategory, setOpenCategory] = useState(null);
    const [loading, setLoading] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");

    // User info + profile image & edit state
    const [isEditing, setIsEditing] = useState(false);
    const [isImageEditing, setIsImageEditing] = useState(false);

    // ensure userInfo always contains all keys from FIELDS_CONFIG
    const [userInfo, setUserInfo] = useState(() => ({ ...buildDefaultUser(), ...userInfoSample }));

    const [profileImageFile, setProfileImageFile] = useState(null); // file object
    const [profileImagePreview, setProfileImagePreview] = useState(null); // url


    // Change password inputs
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordMessage, setPasswordMessage] = useState(null);


    // Providers state & editing
    const [providers, setProviders] = useState(providersSample);
    const [provider, setProvider] = useState('');
    const [open, setOpen] = useState(false);
    const [newProvider, setNewProvider] = useState('');
    const [editingProviderId, setEditingProviderId] = useState(null);
    const [editProviderData, setEditProviderData] = useState({
        name: "",
        description: "",
    });


    // Categories state & editing
    const [categories, setCategories] = useState();
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editCategoryData, setEditCategoryData] = useState({
        name: "",
        color: "#3b6d92",
        imageFile: null,
        imagePreview: null,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getAllCategory();

            const mappedCategories = data.map((c) => ({
                id: c._id,
                name: c.name,
                image: c.thumbnail?.url || null,
                slug: c.slug,
                description: c.description,
                parent: c.parent,
                level: c.level,
                isActive: c.isActive,
                createdAt: c.createdAt,
                updatedAt: c.updatedAt,
            }));

            setCategories(mappedCategories);
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProvider = async () => {
            const data = await getAllProvider();
            setProviders(data);
        }


        fetchProvider();
    }, [])



    // --- Effects for profile preview cleanup ---
    useEffect(() => {
        return () => {
            // cleanup object URLs on unmount
            if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
            if (editCategoryData.imagePreview) URL.revokeObjectURL(editCategoryData.imagePreview);
            // also cleanup category images stored in categories
            categories?.forEach((c) => {
                if (c.image && typeof c.image === "string" && c._isObjectURL) {
                    try {
                        URL.revokeObjectURL(c.image);
                    } catch { }
                }
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ------------- USER: image handlers ----------------
    const handleProfileImageChange = (file) => {
        if (!file) return;

        if (
            typeof profileImagePreview === "string" &&
            profileImagePreview.startsWith("blob:")
        ) {
            try {
                URL.revokeObjectURL(profileImagePreview);
            } catch { }
        }

        const url = URL.createObjectURL(file);
        setProfileImageFile(file);
        setProfileImagePreview(url);
    };

    const addProviderHandler = async () => {
        if (!newProvider.trim()) return;

        const payload = { provider: newProvider };
        const res = await createProvider(payload);

        if (res?.success) {
            const newItem = {
                _id: res.data._id,
                provider: res.data.provider
            };
            setProviders(prev => [...prev, newItem]);

            setProvider(res.data._id);
            setNewProvider('');
            setOpen(false);
            alert("Provider Added");
        }
    };


    const handleSaveUserInfo = async () => {
        if (!userInfo) return;

        setLoading(true);
        try {
            // create payload - if there's a file use FormData
            if (profileImageFile) {
                const formData = new FormData();
                // append all configured fields
                FIELDS_CONFIG.forEach((f) => {
                    const val = userInfo[f.key];
                    // convert boolean to string for formdata
                    if (f.type === "boolean") formData.append(f.key, val ? "true" : "false");
                    else formData.append(f.key, val ?? "");

                });
                formData.append("profileImage", profileImageFile);


                const updatedUser = await userInfoApi(formData, setLoading, profileImageFile);
                if (updatedUser) {
                    const getInfo = await getUserDetail(setLoading);
                    // assume API returns full user object
                    setUserInfo((prev) => ({ ...buildDefaultUser(), ...updatedUser }));
                    setProfileImageFile(null);
                    // setProfileImagePreview(null);
                    setIsEditing(false);
                    setPasswordMessage(null);
                }
            } else {
                // send JSON payload
                const payload = {};
                FIELDS_CONFIG.forEach((f) => {
                    payload[f.key] = userInfo[f.key];
                });

                const updatedUser = await userInfoApi(payload, setLoading, profileImageFile);
                if (updatedUser) {
                    setUserInfo((prev) => ({ ...buildDefaultUser(), ...updatedUser }));
                    setProfileImageFile(null);
                    // set preview to new uploaded image URL
                    setProfileImagePreview(updatedUser.profileImage?.url || null);

                    setIsEditing(false);
                    setPasswordMessage(null);
                }

                // if (updatedUser) {
                //     setUserInfo((prev) => ({ ...buildDefaultUser(), ...updatedUser }));
                //     setIsEditing(false);
                //     setPasswordMessage(null);
                // }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    // ------------- PASSWORD: simple validation handler --------------
    const handleChangePassword = () => {
        setPasswordMessage(null);
        const { currentPassword, newPassword, confirmPassword } = passwords;
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMessage({ type: "error", text: "fill all password fields" });
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMessage({ type: "error", text: "new password must be at least 6 characters" });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: "error", text: "new password & confirm password do not match" });
            return;
        }

        // pretend update success (replace with real API)
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordMessage({ type: "success", text: "password changed successfully" });
    };

    // ------------- PROVIDERS: handlers ----------------
    const handleEditClick = (provider) => {
        setEditingProviderId(provider._id);
        setEditProviderData({
            name: provider.provider,
            description: provider.description || "",
        });
    };

    const handleSaveProvider = async (id) => {
        try {
            const payload = {
                provider: editProviderData.name,
                description: editProviderData.description,
            };
            const res = await updateProvider(id, payload);
            if (res.success) {
                setProviders((prev) =>
                    prev.map((p) => (p._id === id ? { ...p, ...payload } : p))
                );
                setEditingProviderId(null);
                setEditProviderData({ name: "", description: "" });
            } else {
                alert("Failed to update provider");
            }
        } catch (err) {
            console.error(err);
        }
    };
    const handleRemoveProvider = async (id) => {
        try {
            const res = await deleteProvider(id);
            if (res.success) {
                setProviders((prev) => prev.filter((p) => p._id !== id));
                if (openProvider === id) setOpenProvider(null);
            } else {
                alert("Failed to delete provider");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // fetch logged-in user details on mount
    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            const res = await getUserDetail(setLoading);
            setLoading(false);
            if (!res) return;

            // API returns { success, message, user } or just user - normalize
            const u = res.user || res;

            // merge with default so missing keys still appear in UI
            const merged = { ...buildDefaultUser(), ...u };

            setUserInfo(merged);

            // if profileImage exists, show its URL as preview (so UI shows avatar)
            if (merged.profileImage && (merged.profileImage.url || merged.profileImage)) {
                const url = merged.profileImage.url ? merged.profileImage.url : merged.profileImage;
                setProfileImagePreview(url);
            } else {
                setProfileImagePreview(null);
            }
        };

        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="min-h-screen p-6 bg-[#f1f5f9]">
            {/* Page header */}

            {/* Tabs + content */}
            <div className="mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left - Tabs */}
                <aside className="col-span-1 bg-white rounded-2xl p-4 shadow">
                    <nav className="space-y-2">
                        <TabButton
                            active={activeTab === "user"}
                            onClick={() => setActiveTab("user")}
                            label="User Info"
                            icon={<IconUser color={BRAND.primary} />}
                        />
                        <TabButton
                            active={activeTab === "provider"}
                            onClick={() => setActiveTab("provider")}
                            label="Provider"
                            icon={<IconProvider color={BRAND.secondary} />}
                        />
                        {/* <TabButton
                            active={activeTab === "category"}
                            onClick={() => setActiveTab("category")}
                            label="Category"
                            icon={<IconCategory color={BRAND.dark} />}
                        /> */}
                    </nav>
                </aside>

                {/* Right - Content area */}
                <main className="col-span-1 lg:col-span-3">
                    <div className="bg-white rounded-2xl p-6 shadow">
                        {/* ---------- USER TAB ---------- */}
                        {activeTab === "user" && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4">User Info</h2>

                                {/* Grid: image field + other fields together */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* IMAGE field placed as a field in the grid (not separate column) */}
                                    <div className="p-4 rounded-lg border flex items-center gap-4" style={{ borderColor: "#eee" }}>
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
                                                {profileImagePreview ? (
                                                    <img
                                                        src={profileImagePreview}
                                                        alt="profile"
                                                        className="w-full h-full object-cover"
                                                    />

                                                ) : (
                                                    <div className="text-gray-400 text-xs">No Image</div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                {/* <div className="flex items-center justify-between">
                                                    <div className="text-xs text-gray-400 uppercase">Profile</div>
                                                    <button style={{ borderRadius: "5px" }} className="bg-blue-600 py-2 px-3 cursor-pointer text-white" onClick={() => setIsImageEditing((pre) => !pre)}>{isImageEditing ? "Cancel" : "Change Profile"}</button>
                                                </div> */}

                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs text-gray-400 uppercase">Profile</div>
                                                    <button
                                                        className="p-2 cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        onClick={() => setIsImageEditing((pre) => !pre)}
                                                        title={isImageEditing ? "Cancel" : "Change Profile"}
                                                        style={{ borderRadius: "50%" }}
                                                    >
                                                        {isImageEditing ? (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>

                                                {isImageEditing ? (
                                                    <div className="mt-2 flex flex-col gap-2">
                                                        <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-blue-600">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const f = e.target.files?.[0];
                                                                    handleProfileImageChange(f);
                                                                    setProfileImageFile(f);
                                                                }}
                                                                className="hidden"
                                                            />
                                                            <span className="px-3 py-1 rounded bg-gray-100 border text-xs">Upload</span>
                                                        </label>

                                                        <div className="flex gap-2 items-center">
                                                            <button
                                                                className="px-3 py-1 rounded-md text-white text-xs cursor-pointer"
                                                                style={{ background: BRAND.primary }}
                                                                onClick={
                                                                    () => handleSaveUserInfo()
                                                                }
                                                            >
                                                                Update
                                                            </button>
                                                            {/* <CloseIcon
                                                                className="cursor-pointer"
                                                                onClick={() => {
                                                                    if (profileImagePreview && profileImagePreview.startsWith("blob:")) {
                                                                        try {
                                                                            URL.revokeObjectURL(profileImagePreview);
                                                                        } catch { }
                                                                    }
                                                                    setProfileImagePreview(null);
                                                                    setProfileImageFile(null);
                                                                }}
                                                            /> */}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 text-sm text-gray-600">profile image (visible with the field)</div>
                                                )}

                                            </div>
                                        </div>
                                    </div>

                                    {/* Other fields (rendered using FIELDS_CONFIG) */}
                                    {FIELDS_CONFIG.map((field) => {
                                        const k = field.key;
                                        const v = userInfo ? userInfo[k] : "";

                                        return (
                                            <div key={k} className="p-4 rounded-lg border" style={{ borderColor: "#eee" }}>
                                                <div className="text-xs text-gray-400 uppercase">{field.label}</div>

                                                {field.type === "boolean" ? (
                                                    <label className="mt-2 flex items-center gap-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            disabled={!isEditing}
                                                            checked={!!v}
                                                            onChange={(e) => setUserInfo({ ...userInfo, [k]: e.target.checked })}
                                                        />
                                                        <span>{v ? "Enabled" : "Disabled"}</span>
                                                    </label>
                                                ) : isEditing ? (
                                                    <input
                                                        className={`mt-2 w-full px-3 py-2 text-sm rounded
                                                                ${field.readOnly
                                                                ? "border-none bg-transparent focus:outline-none focus:ring-0 cursor-default"
                                                                : "border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                                                            }`}
                                                        value={v ?? ""}
                                                        onChange={(e) =>
                                                            !field.readOnly &&
                                                            setUserInfo({ ...userInfo, [k]: e.target.value })
                                                        }
                                                        readOnly={field.readOnly}
                                                    />

                                                ) : (
                                                    <div className="mt-2 text-sm font-medium text-gray-700">{v || "-"}</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* user action buttons (update/save) */}
                                <div className="mt-6 flex items-center gap-3">
                                    {!isEditing ? (
                                        <button
                                            className="cursor-pointer px-5 py-2 rounded-lg text-white font-medium shadow"
                                            style={{ background: BRAND.primary }}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Update Profile
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className="cursor-pointer px-5 py-2 rounded-lg text-white font-medium shadow"
                                                style={{ background: BRAND.primary }}
                                                onClick={() => handleSaveUserInfo()}
                                            >
                                                Update
                                            </button>

                                            <button
                                                className="px-5 py-2 rounded-lg border"
                                                style={{ borderColor: BRAND.light }}
                                                onClick={() => {
                                                    setUserInfo({ ...buildDefaultUser(), ...userInfoSample });
                                                    setIsEditing(false);
                                                    if (profileImagePreview && profileImagePreview.startsWith("blob:")) {
                                                        try {
                                                            URL.revokeObjectURL(profileImagePreview);
                                                        } catch { }
                                                    }
                                                    setProfileImagePreview(null);
                                                    setProfileImageFile(null);
                                                }}
                                            >
                                                Cancel
                                            </button>


                                        </>
                                    )}
                                    <button
                                        className="cursor-pointer flex px-5 py-2 rounded-lg text-white font-medium shadow"
                                        style={{ background: BRAND.primary }}
                                        onClick={() => setShowChangePassword((p) => !p)}
                                    >
                                        {showChangePassword ? "Hide" : "Change Password"}
                                    </button>

                                    <button
                                        className="px-5 py-2 rounded-lg text-white font-medium shadow cursor-pointer"
                                        style={{ background: "#dc2626" }}
                                        onClick={() => setShowOtpModal(true)}
                                    >
                                        Disable Account
                                    </button>
                                </div>

                                {/* --- CHANGE PASSWORD placed under update buttons as requested --- */}
                                {
                                    showChangePassword && (
                                        <div className="mt-6 p-4 rounded-lg border" style={{ borderColor: "#eee" }}>
                                            <h3 className="text-sm font-semibold mb-3">Change Password</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="text-xs text-gray-500">Current Password</label>
                                                    <input
                                                        type="password"
                                                        className="mt-1 w-full border rounded px-3 py-2 text-sm"
                                                        value={passwords.currentPassword}
                                                        onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-xs text-gray-500">New Password</label>
                                                    <input
                                                        type="password"
                                                        className="mt-1 w-full border rounded px-3 py-2 text-sm"
                                                        value={passwords.newPassword}
                                                        onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-xs text-gray-500">Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        className="mt-1 w-full border rounded px-3 py-2 text-sm"
                                                        value={passwords.confirmPassword}
                                                        onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center gap-3">
                                                <button
                                                    className="px-4 py-2 rounded-md text-white"
                                                    style={{ background: BRAND.primary }}
                                                    onClick={handleChangePassword}
                                                >
                                                    Update Password
                                                </button>

                                                <button
                                                    className="px-4 py-2 rounded-md border"
                                                    onClick={() => setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })}
                                                >
                                                    Reset
                                                </button>

                                                {passwordMessage && (
                                                    <div
                                                        className={`ml-auto text-sm ${passwordMessage.type === "error" ? "text-red-500" : "text-green-600"}`}
                                                    >
                                                        {passwordMessage.text}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }

                                {showOtpModal && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                        <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6">

                                            {/* Header */}
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Verify OTP
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Please enter the OTP sent to your registered email.
                                            </p>

                                            {/* OTP input */}
                                            <input
                                                type="text"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="Enter 6-digit OTP"
                                                className="mt-4 w-full text-center tracking-widest text-lg border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />

                                            {/* Actions */}
                                            <div className="mt-6 flex items-center justify-end gap-3">
                                                <button
                                                    className="px-4 py-2 rounded-md border cursor-pointer"
                                                    onClick={() => {
                                                        setShowOtpModal(false);
                                                        setOtp("");
                                                    }}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    className="px-4 py-2 rounded-md text-white cursor-pointer"
                                                    style={{ background: BRAND.primary }}
                                                    onClick={() => {
                                                        // yahan tum OTP verify wali API hit karna
                                                        // success pe:
                                                        // setUserInfo(u => ({ ...u, AccountOpen: false }))
                                                        setShowOtpModal(false)
                                                    }}
                                                >
                                                    Verify & Disable
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {activeTab === "provider" && (
                            <section>
                                <div className="flex items-center justify-between">

                                    <h2 className="text-xl font-semibold mb-4">Providers</h2>

                                    {/* <Link to="/settings/add-provider"> */}
                                    <button onClick={() => setOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4 cursor-pointer" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(true); }}>Add Provider</button>
                                    {/* </Link> */}
                                </div>

                                <AddProviderModal
                                    open={open}
                                    onClose={() => setOpen(false)}
                                    newProvider={newProvider}
                                    setNewProvider={setNewProvider}
                                    onAdd={addProviderHandler}
                                />



                                <div className="space-y-4">
                                    {providers.map((p) => (
                                        <div key={p?._id} className="bg-white border-gray-100 rounded-lg shadow p-4 border flex flex-col md:flex-row md:items-center justify-between">

                                            {/* Provider info / Editable inputs */}
                                            <div className="flex-1 mb-2 md:mb-0 flex flex-col md:flex-row md:items-center gap-2">
                                                {editingProviderId === p._id ? (
                                                    <>
                                                        <input
                                                            className="border rounded-md px-2 py-1 text-sm w-100"
                                                            value={editProviderData.name}
                                                            onChange={(e) =>
                                                                setEditProviderData((prev) => ({ ...prev, name: e.target.value }))
                                                            }
                                                        />

                                                    </>
                                                ) : (
                                                    <>
                                                        <h3 className="font-medium text-gray-800">{p?.provider}</h3>
                                                        {/* <p className="text-sm text-gray-600">{p.description || "No description"}</p> */}
                                                    </>
                                                )}
                                            </div>

                                            {/* Buttons */}
                                            <div className="flex gap-2">
                                                {editingProviderId === p._id ? (
                                                    <>
                                                        <button
                                                            className="px-3 py-1 rounded-md bg-green-600 text-white text-xs"
                                                            onClick={() => handleSaveProvider(p._id)}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="px-3 py-1 rounded-md border text-xs"
                                                            onClick={() => setEditingProviderId(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs cursor-pointer"
                                                            onClick={() => handleEditClick(p)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="px-3 py-1 rounded-md border text-xs text-red-600 cursor-pointer"
                                                            onClick={() => handleRemoveProvider(p._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}



                        {/* ---------- CATEGORY TAB ---------- */}
                        {/* {activeTab === "category" && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                                <div className="space-y-3">
                                    {categories.map((c) => (
                                        <Accordion
                                            key={c.id}
                                            open={openCategory === c.id}
                                            onToggle={() => setOpenCategory(openCategory === c.id ? null : c.id)}
                                            title={c.name.toUpperCase()}
                                            subtitle={
                                                <span className="flex items-center gap-2">
                                                    <Thumb image={c.image} />
                                                </span>
                                            }
                                        >
                                            {editingCategoryId === c.id ? (
                                                <div className="bg-gray-50 p-4 rounded-lg border">
                                                    <label className="text-xs text-gray-500">Category</label>
                                                    <input
                                                        className="w-full mt-1 mb-3 border rounded-md px-3 py-2 text-sm focus:outline-none"
                                                        value={editCategoryData.name}
                                                        onChange={(e) => setEditCategoryData((p) => ({ ...p, name: e.target.value }))}
                                                    />
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="w-20 h-12 rounded overflow-hidden bg-gray-100">
                                                            {editCategoryData.imagePreview ? (
                                                                <img src={editCategoryData.imagePreview} alt="cat" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="text-xs text-gray-400 flex items-center justify-center h-full">NO IMAGE</div>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const f = e.target.files?.[0];
                                                                    handleCategoryImageChange(f);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex gap-2">
                                                        <button
                                                            className="px-4 py-1.5 rounded-md text-white text-xs"
                                                            style={{ background: BRAND.primary }}
                                                            onClick={() => handleSaveCategory(c.id)}
                                                        >
                                                            Update
                                                        </button>

                                                        <button
                                                            className="px-4 py-1.5 rounded-md text-xs border"
                                                            onClick={() => setEditingCategoryId(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-2 text-sm text-gray-700">

                                                    <div className="mt-4 flex gap-2 items-center">
                                                        <button
                                                            className="px-3 py-1 rounded-md"
                                                            style={{ border: `1px solid ${BRAND.light}` }}
                                                            onClick={() => handleEditCategoryClick(c)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="px-3 py-1 rounded-md"
                                                            style={{ border: `1px solid ${BRAND.light}`, color: "red" }}
                                                            onClick={() => handleRemoveCategory(c.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Accordion>
                                    ))}
                                </div>
                            </section>
                        )} */}
                    </div>
                </main>
            </div>
        </div>
    );
}
