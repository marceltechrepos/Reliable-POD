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
import {
    BRAND, FIELDS_CONFIG, buildDefaultUser, userInfoSample, providersSample, categoriesSample
} from "../utils/data.js"

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
    const [editingProviderId, setEditingProviderId] = useState(null);
    const [editProviderData, setEditProviderData] = useState({
        name: "",
        description: "",
    });

    // Categories state & editing
    const [categories, setCategories] = useState(categoriesSample);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editCategoryData, setEditCategoryData] = useState({
        name: "",
        color: "#3b6d92",
        imageFile: null,
        imagePreview: null,
    });

    // --- Effects for profile preview cleanup ---
    useEffect(() => {
        return () => {
            // cleanup object URLs on unmount
            if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
            if (editCategoryData.imagePreview) URL.revokeObjectURL(editCategoryData.imagePreview);
            // also cleanup category images stored in categories
            categories.forEach((c) => {
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
        setEditingProviderId(provider.id);
        setEditProviderData({
            name: provider.name,
            description: provider.description,
        });
    };

    const handleSaveProvider = (id) => {
        setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, ...editProviderData } : p)));
        setEditingProviderId(null);
        setEditProviderData({ name: "", description: "" });
    };

    const handleRemoveProvider = (id) => {
        setProviders((prev) => prev.filter((p) => p.id !== id));
        if (openProvider === id) setOpenProvider(null);
    };

    // ------------- CATEGORIES: handlers ----------------
    const handleEditCategoryClick = (cat) => {
        setEditingCategoryId(cat.id);
        setEditCategoryData({
            name: cat.name,
            color: cat.color || "#3b6d92",
            imageFile: null,
            imagePreview: cat.image || null,
        });
    };

    const handleCategoryImageChange = (file) => {
        if (!file) return;
        if (editCategoryData.imagePreview && editCategoryData.imagePreview.startsWith("blob:")) {
            try {
                URL.revokeObjectURL(editCategoryData.imagePreview);
            } catch { }
        }
        const url = URL.createObjectURL(file);
        setEditCategoryData((prev) => ({ ...prev, imageFile: file, imagePreview: url }));
    };

    const handleSaveCategory = (id) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === id
                    ? {
                        ...c,
                        name: editCategoryData.name,
                        color: editCategoryData.color,
                        image: editCategoryData.imagePreview,
                        _isObjectURL: !!editCategoryData.imageFile,
                    }
                    : c
            )
        );
        setEditingCategoryId(null);
        setEditCategoryData({ name: "", color: "#3b6d92", imageFile: null, imagePreview: null });
    };

    const handleRemoveCategory = (id) => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        if (openCategory === id) setOpenCategory(null);
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
            <div className="mx-auto mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold" style={{ color: BRAND.dark }}>
                            Settings
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Configure system preferences, manage administrator accounts, providers, categories, and application-wide settings.
                        </p>

                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="cursor-pointer px-4 py-2 text-white rounded-lg shadow-sm font-medium"
                            style={{ background: BRAND.primary }}
                            onClick={() => {
                                alert("local state logged to console (simulate save all)");
                            }}
                        >
                            Save
                        </button>
                        <button
                            className="cursor-pointer px-4 py-2 rounded-lg border font-medium"
                            style={{ borderColor: BRAND.light, color: BRAND.dark }}
                            onClick={() => {
                                setUserInfo({ ...buildDefaultUser(), ...userInfoSample });
                                setProviders(providersSample);
                                setCategories(categoriesSample);
                                setProfileImageFile(null);
                                setProfileImagePreview(null);
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

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
                        <TabButton
                            active={activeTab === "category"}
                            onClick={() => setActiveTab("category")}
                            label="Category"
                            icon={<IconCategory color={BRAND.dark} />}
                        />
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
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs text-gray-400 uppercase">Profile</div>
                                                    <button style={{ borderRadius: "5px" }} className="bg-blue-600 py-2 px-3 cursor-pointer text-white" onClick={() => setIsImageEditing((pre) => !pre)}>{isImageEditing ? "Cancel" : "Change Profile"}</button>
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
                                                            <CloseIcon
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
                                                            />
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

                        {/* ---------- PROVIDER TAB ---------- */}
                        {activeTab === "provider" && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4">providers</h2>
                                <div className="space-y-3">
                                    {providers.map((p) => (
                                        <ProviderAccordion
                                            key={p.id}
                                            open={openProvider === p.id}
                                            onToggle={() => setOpenProvider(openProvider === p.id ? null : p.id)}
                                            title={p.name}
                                            subtitle={p.description}
                                        >
                                            {editingProviderId === p.id ? (
                                                <div className="bg-gray-50 p-4 rounded-lg border">
                                                    <label className="text-xs text-gray-500">Provider</label>
                                                    <input
                                                        className="w-full mt-1 mb-3 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                        value={editProviderData.name}
                                                        onChange={(e) => setEditProviderData({ ...editProviderData, name: e.target.value })}
                                                    />

                                                    <label className="text-xs text-gray-500">Description</label>
                                                    <textarea
                                                        className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                        rows={3}
                                                        value={editProviderData.description}
                                                        onChange={(e) =>
                                                            setEditProviderData({
                                                                ...editProviderData,
                                                                description: e.target.value,
                                                            })
                                                        }
                                                    />

                                                    <div className="mt-4 flex gap-2">
                                                        <button
                                                            className="px-4 py-1.5 rounded-md text-white text-xs"
                                                            style={{ background: BRAND.primary }}
                                                            onClick={() => handleSaveProvider(p.id)}
                                                        >
                                                            Update
                                                        </button>

                                                        <button className="px-4 py-1.5 rounded-md text-xs border" onClick={() => setEditingProviderId(null)}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-3 p-4 rounded-lg bg-white border">
                                                    <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>

                                                    <div className="mt-4 flex items-center gap-2 ">
                                                        <button
                                                            className="px-4 py-1.5 rounded-md text-white text-xs font-medium"
                                                            style={{ background: BRAND.primary }}
                                                            onClick={() => handleEditClick(p)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="px-4 py-1.5 rounded-md text-xs font-medium"
                                                            style={{
                                                                border: `1px solid ${BRAND.light}`,
                                                                color: BRAND.dark,
                                                            }}
                                                            onClick={() => handleRemoveProvider(p.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </ProviderAccordion>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ---------- CATEGORY TAB ---------- */}
                        {activeTab === "category" && (
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
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
