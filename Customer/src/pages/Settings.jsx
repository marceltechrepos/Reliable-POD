import React, { useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Snackbar, Alert, Switch 
} from "@mui/material";

// ✅ UI Components ko bahar rakha hai taaki focus/render ka masla na ho
const InputField = ({ label, value, onChange, type = "text", helper }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">
      {label}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50 border border-gray-100 focus:border-[#f05a28] focus:ring-4 focus:ring-[#f05a28]/5 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 transition-all outline-none"
    />
    {helper && <p className="text-[10px] text-gray-400 ml-1 italic">{helper}</p>}
  </div>
);

// ✅ Naya Switch Component
const SwitchField = ({ label, checked, onChange, description }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
    <div className="flex flex-col">
      <span className="text-sm font-bold text-gray-900">{label}</span>
      {description && <span className="text-[10px] text-gray-400 font-medium">{description}</span>}
    </div>
    <Switch 
      checked={checked} 
      onChange={(e) => onChange(e.target.checked)}
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': { color: '#f05a28' },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#f05a28' },
      }}
    />
  </div>
);

const SectionWrapper = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-8 shadow-sm">
    <div className="mb-6">
      <h3 className="text-lg font-black text-gray-900 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-400 font-medium">{subtitle}</p>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

export default function Settings() {
  const initial = {
    userEmail: "rufik0254@gmail.com",
    username: "rufik_user",
    contactName: "Rufik",
    contactEmail: "rufik0254@gmail.com",
    contactPhone: "+92 300 0000000",
    companyName: "My Company",
    address1: "123 Street",
    address2: "",
    town: "Karachi",
    region: "Sindh",
    country: "Pakistan",
    postcode: "74000",
    vatNumber: "",
    reference: "",
    // Preferences fields
    pref_imageLibraryOnUpload: true,
    pref_imageLibraryOnDrop: false,
    pref_emailNotifications: true,
    pref_resellerEmails: false,
    pref_stockNotifications: true,
    pref_newsOffers: true,
  };

  const [state, setState] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const updateState = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSaveAll = () => {
    setDirty(false);
    setSnack({ open: true, severity: "success", message: "Settings updated successfully!" });
  };

  const handleDiscard = () => {
    setState(initial);
    setDirty(false);
    setSnack({ open: true, severity: "info", message: "Changes reverted." });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 font-sans text-gray-900">
      {/* Header Action Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Settings</h1>
            <p className="hidden md:block text-[10px] text-gray-400 font-black uppercase tracking-widest">Profile Configuration</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDiscard}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${dirty ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-200 pointer-events-none'}`}
            >
              Discard
            </button>
            <button
              disabled={!dirty}
              onClick={handleSaveAll}
              className={`px-7 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg ${dirty ? 'bg-[#f05a28] text-white shadow-[#f05a28]/20 hover:scale-[1.02] active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          
          <SectionWrapper title="Authentication" subtitle="Manage your account access.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Email Address" value={state.userEmail} onChange={(v) => updateState("userEmail", v)} />
              <InputField label="Username" value={state.username} onChange={(v) => updateState("username", v)} />
            </div>
            <button onClick={() => setPwdOpen(true)} className="text-[#f05a28] text-[11px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
              Update Password
            </button>
          </SectionWrapper>

          <SectionWrapper title="Contact Details" subtitle="For delivery and support contact.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField label="Full Name" value={state.contactName} onChange={(v) => updateState("contactName", v)} />
              <InputField label="Email" value={state.contactEmail} onChange={(v) => updateState("contactEmail", v)} />
              <InputField label="Phone" value={state.contactPhone} onChange={(v) => updateState("contactPhone", v)} />
            </div>
          </SectionWrapper>

          <SectionWrapper title="Business Address" subtitle="Billing and shipping destination.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputField label="Company Name" value={state.companyName} onChange={(v) => updateState("companyName", v)} />
              </div>
              <InputField label="Address Line 1" value={state.address1} onChange={(v) => updateState("address1", v)} />
              <InputField label="Address Line 2" value={state.address2} onChange={(v) => updateState("address2", v)} />
              <InputField label="City" value={state.town} onChange={(v) => updateState("town", v)} />
              <InputField label="Region" value={state.region} onChange={(v) => updateState("region", v)} />
              <InputField label="Country" value={state.country} onChange={(v) => updateState("country", v)} />
              <InputField label="Postcode" value={state.postcode} onChange={(v) => updateState("postcode", v)} />
              <InputField label="VAT Number" value={state.vatNumber} onChange={(v) => updateState("vatNumber", v)} />
              <InputField label="Internal Reference" value={state.reference} onChange={(v) => updateState("reference", v)} />
            </div>
          </SectionWrapper>

          {/* 🚀 ADDED: Preferences & Notification Section */}
          <SectionWrapper title="User Preferences" subtitle="Customize your experience and alerts.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SwitchField 
                label="Image Library on Upload" 
                checked={state.pref_imageLibraryOnUpload} 
                onChange={(v) => updateState("pref_imageLibraryOnUpload", v)}
                description="Show library when uploading files."
              />
              <SwitchField 
                label="Image Library on Drop" 
                checked={state.pref_imageLibraryOnDrop} 
                onChange={(v) => updateState("pref_imageLibraryOnDrop", v)}
                description="Auto-open library on drag & drop."
              />
              <SwitchField 
                label="Email Notifications" 
                checked={state.pref_emailNotifications} 
                onChange={(v) => updateState("pref_emailNotifications", v)}
              />
              <SwitchField 
                label="Stock Notifications" 
                checked={state.pref_stockNotifications} 
                onChange={(v) => updateState("pref_stockNotifications", v)}
              />
              <SwitchField 
                label="News & Offers" 
                checked={state.pref_newsOffers} 
                onChange={(v) => updateState("pref_newsOffers", v)}
              />
              <SwitchField 
                label="Reseller Emails" 
                checked={state.pref_resellerEmails} 
                onChange={(v) => updateState("pref_resellerEmails", v)}
              />
            </div>
          </SectionWrapper>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-28 space-y-6">
            <div className="bg-gray-900 rounded-[30px] p-8 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-[#f05a28] flex items-center justify-center font-black text-2xl shadow-inner">
                  {state.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">{state.username}</h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">{state.country}</p>
                </div>
              </div>
              <div className="space-y-3">
                 <button className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Export Data</button>
                 <button className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Clear Cache</button>
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-[28px] p-6">
              <h4 className="text-red-600 text-[11px] font-black uppercase tracking-[0.15em] mb-2">Danger Zone</h4>
              <p className="text-[12px] text-red-800/70 mb-5 font-medium italic leading-snug">Warning: Deleting your account is permanent and cannot be undone.</p>
              <button onClick={() => setCloseOpen(true)} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200">
                Terminate Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Dialog */}
      <Dialog open={pwdOpen} onClose={() => setPwdOpen(false)} PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
        <DialogTitle className="font-black text-center">Change Password</DialogTitle>
        <DialogContent className="space-y-4">
          <InputField label="Current Password" type="password" value={currentPwd} onChange={setCurrentPwd} />
          <InputField label="New Password" type="password" value={newPwd} onChange={setNewPwd} />
          <InputField label="Confirm New Password" type="password" value={confirmPwd} onChange={setConfirmPwd} />
        </DialogContent>
        <DialogActions className="p-4">
          <button onClick={() => setPwdOpen(false)} className="px-4 text-xs font-bold text-gray-400 uppercase">Cancel</button>
          <button onClick={() => setPwdOpen(false)} className="px-6 py-2 bg-black text-white rounded-full text-xs font-black uppercase">Save</button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({...snack, open: false})}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: '16px' }}>{snack.message}</Alert>
      </Snackbar>
    </div>
  );
}