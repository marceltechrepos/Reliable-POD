// import React, { useState } from "react";
// import {
//   Box,
//   Container,
//   Typography,
//   Grid,
//   Paper,
//   TextField,
//   Button,
//   Divider,
//   Switch,
//   FormControlLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Snackbar,
//   Alert,
//   Avatar,
//   Tooltip,
// } from "@mui/material";
// import SaveIcon from "@mui/icons-material/Save";
// import LockIcon from "@mui/icons-material/Lock";
// import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// import RestartAltIcon from "@mui/icons-material/RestartAlt";
// import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
// import EmailIcon from "@mui/icons-material/Email";
// import PersonIcon from "@mui/icons-material/Person";
// import HomeWorkIcon from "@mui/icons-material/HomeWork";

// export default function Settings() {
//   // ---------- state ----------
//   const [userEmail, setUserEmail] = useState("rufik0254@gmail.com");
//   const [username, setUsername] = useState("rufik_user");
//   const [contactName, setContactName] = useState("Rufik");
//   const [contactEmail, setContactEmail] = useState("rufik0254@gmail.com");
//   const [contactPhone, setContactPhone] = useState("+92 300 0000000");

//   const [companyName, setCompanyName] = useState("My Company");
//   const [address1, setAddress1] = useState("123 Street");
//   const [address2, setAddress2] = useState("");
//   const [town, setTown] = useState("Karachi");
//   const [region, setRegion] = useState("Sindh");
//   const [country, setCountry] = useState("Pakistan");
//   const [postcode, setPostcode] = useState("74000");

//   const [vatNumber, setVatNumber] = useState("");
//   const [reference, setReference] = useState("");

//   // preferences
//   const [pref_imageLibraryOnUpload, setPref_imageLibraryOnUpload] = useState(true);
//   const [pref_imageLibraryOnDrop, setPref_imageLibraryOnDrop] = useState(false);
//   const [pref_emailNotifications, setPref_emailNotifications] = useState(true);
//   const [pref_resellerEmails, setPref_resellerEmails] = useState(false);
//   const [pref_stockNotifications, setPref_stockNotifications] = useState(true);
//   const [pref_newsOffers, setPref_newsOffers] = useState(true);

//   // modals + snack
//   const [pwdOpen, setPwdOpen] = useState(false);
//   const [closeOpen, setCloseOpen] = useState(false);
//   const [platformModalOpen, setPlatformModalOpen] = useState(false); // reserved
//   const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

//   // change password
//   const [currentPwd, setCurrentPwd] = useState("");
//   const [newPwd, setNewPwd] = useState("");
//   const [confirmPwd, setConfirmPwd] = useState("");
//   const [pwdError, setPwdError] = useState("");

//   // ---------- handlers ----------
//   const handleSaveAll = () => {
//     // Simulate save
//     setSnack({ open: true, severity: "success", message: "All changes saved." });
//     // In real app: call API to save settings
//   };

//   const handleClearCache = () => {
//     // simulate clear cache
//     setSnack({ open: true, severity: "info", message: "App cache cleared." });
//   };

//   const handleOpenChangePwd = () => {
//     setPwdOpen(true);
//     setPwdError("");
//     setCurrentPwd("");
//     setNewPwd("");
//     setConfirmPwd("");
//   };

//   const handleChangePassword = () => {
//     if (!currentPwd || !newPwd || !confirmPwd) {
//       setPwdError("Please fill all fields.");
//       return;
//     }
//     if (newPwd !== confirmPwd) {
//       setPwdError("New password and confirmation do not match.");
//       return;
//     }
//     // simulate change
//     setPwdOpen(false);
//     setSnack({ open: true, severity: "success", message: "Password changed. Please log in again." });
//     // In real app: call API then log out user
//   };

//   const handleCloseAccount = () => {
//     // simulate close account
//     setCloseOpen(false);
//     setSnack({ open: true, severity: "warning", message: "Account closure requested (simulated)." });
//   };

//   // ---------- small components (local) ----------
//   const SectionPaper = ({ title, subtitle, children, actions }) => (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 3,
//         borderRadius: 2,
//         bgcolor: "#fff",
//         border: "1px solid #e8eef6",
//       }}
//     >
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
//         <Box>
//           <Typography variant="subtitle1" fontWeight={700}>
//             {title}
//           </Typography>
//           {subtitle && (
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//               {subtitle}
//             </Typography>
//           )}
//         </Box>

//         {actions && <Box>{actions}</Box>}
//       </Box>

//       <Divider sx={{ mb: 2 }} />
//       <Box>{children}</Box>
//     </Paper>
//   );

//   // ---------- UI ----------
//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       {/* header bar with actions */}
//       <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
//         <Box>
//           <Typography variant="h4" fontWeight={800}>
//             Settings
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Manage your account, contact information and app preferences.
//           </Typography>
//         </Box>

//         <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
//           <Button
//             startIcon={<LockIcon />}
//             variant="outlined"
//             color="inherit"
//             onClick={handleOpenChangePwd}
//             sx={{ borderRadius: 2 }}
//           >
//             Change password
//           </Button>

//           <Button
//             startIcon={<DeleteForeverIcon />}
//             variant="outlined"
//             color="error"
//             onClick={() => setCloseOpen(true)}
//             sx={{ borderRadius: 2 }}
//           >
//             Close your account
//           </Button>

//           <Button
//             startIcon={<SaveIcon />}
//             variant="contained"
//             color="primary"
//             onClick={handleSaveAll}
//             sx={{ borderRadius: 2 }}
//           >
//             Save all changes
//           </Button>
//         </Box>
//       </Box>

//       <Grid container spacing={3}>
//         {/* Left column: forms */}
//         <Grid item xs={12} md={8}>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <SectionPaper
//                 title="Your user information"
//                 subtitle="The following is the user you registered to our App with."
//               >
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Email"
//                       value={userEmail}
//                       onChange={(e) => setUserEmail(e.target.value)}
//                       helperText="If you update your email address you will be asked to log in again."
//                     />
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <Box sx={{ mt: 1 }}>
//                       <Button variant="outlined" onClick={handleOpenChangePwd} startIcon={<LockIcon />}>
//                         Change password
//                       </Button>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </SectionPaper>
//             </Grid>

//             <Grid item xs={12}>
//               <SectionPaper title="Your contact information" subtitle="We will use your contact details on orders that do not contain a customer email and phone. This is needed to assist with customs processing.">
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={4}>
//                     <TextField fullWidth label="Name" value={contactName} onChange={(e) => setContactName(e.target.value)} InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1 }} /> }} />
//                   </Grid>
//                   <Grid item xs={12} sm={4}>
//                     <TextField fullWidth label="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1 }} /> }} />
//                   </Grid>
//                   <Grid item xs={12} sm={4}>
//                     <TextField fullWidth label="Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
//                   </Grid>
//                 </Grid>
//               </SectionPaper>
//             </Grid>

//             <Grid item xs={12}>
//               <SectionPaper title="Your address" subtitle="We will only use your store's address to setup your payment options and invoices.">
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth label="Address 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth label="Address 2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth label="Town" value={town} onChange={(e) => setTown(e.target.value)} />
//                   </Grid>
//                   <Grid item xs={12} sm={4}>
//                     <TextField fullWidth label="County / Region" value={region} onChange={(e) => setRegion(e.target.value)} />
//                   </Grid>
//                   <Grid item xs={12} sm={4}>
//                     <TextField fullWidth label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
//                   </Grid>
//                   <Grid item xs={12} sm={4}>
//                     <TextField fullWidth label="Postcode / ZIP code" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
//                   </Grid>
//                 </Grid>
//               </SectionPaper>
//             </Grid>

//             <Grid item xs={12}>
//               <SectionPaper title="Your invoice fields" subtitle="We will use your invoice settings to generate your invoices.">
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth label="VAT / Tax Number" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField fullWidth label="Reference" value={reference} onChange={(e) => setReference(e.target.value)} />
//                   </Grid>
//                 </Grid>
//               </SectionPaper>
//             </Grid>

//             <Grid item xs={12}>
//               <SectionPaper
//                 title="Your preferences"
//                 subtitle="Set your preferences for the app."
//               >
//                 <Grid container spacing={1}>
//                   <Grid item xs={12} sm={6}>
//                     <FormControlLabel
//                       control={<Switch checked={pref_imageLibraryOnUpload} onChange={(e) => setPref_imageLibraryOnUpload(e.target.checked)} />}
//                       label="Add uploaded images to Image Library when creating Manual Orders."
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <FormControlLabel
//                       control={<Switch checked={pref_imageLibraryOnDrop} onChange={(e) => setPref_imageLibraryOnDrop(e.target.checked)} />}
//                       label="Add uploaded images to Image Library when dropping images within the product editor."
//                     />
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <FormControlLabel
//                       control={<Switch checked={pref_emailNotifications} onChange={(e) => setPref_emailNotifications(e.target.checked)} />}
//                       label="Receive emails for important notifications."
//                     />
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <FormControlLabel
//                       control={<Switch checked={pref_resellerEmails} onChange={(e) => setPref_resellerEmails(e.target.checked)} />}
//                       label="Receive emails for Reseller Pending orders that require attention."
//                     />
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <FormControlLabel
//                       control={<Switch checked={pref_stockNotifications} onChange={(e) => setPref_stockNotifications(e.target.checked)} />}
//                       label="Receive notifications when created Products become Low Stock or Out of Stock."
//                     />
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <FormControlLabel
//                       control={<Switch checked={pref_newsOffers} onChange={(e) => setPref_newsOffers(e.target.checked)} />}
//                       label="Keep me updated on News and Offers"
//                     />
//                   </Grid>
//                 </Grid>
//               </SectionPaper>
//             </Grid>
//           </Grid>
//         </Grid>

//         {/* Right column: about + actions */}
//         <Grid item xs={12} md={4}>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <SectionPaper title="Account summary" subtitle="Quick at-a-glance">
//                 <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//                   <Avatar sx={{ bgcolor: "primary.main" }}>R</Avatar>
//                   <Box>
//                     <Typography fontWeight={700}>{username}</Typography>
//                     <Typography variant="body2" color="text.secondary">{userEmail}</Typography>
//                   </Box>
//                 </Box>

//                 <Divider sx={{ my: 2 }} />

//                 <Box sx={{ display: "flex", gap: 1 }}>
//                   <Button variant="outlined" startIcon={<CloudDownloadIcon />} onClick={() => setSnack({ open: true, severity: "info", message: "Exported (simulated)" })}>
//                     Export data
//                   </Button>
//                   <Button variant="outlined" color="inherit" startIcon={<RestartAltIcon />} onClick={handleClearCache}>
//                     Clear App Cache
//                   </Button>
//                 </Box>
//               </SectionPaper>
//             </Grid>

//             <Grid item xs={12}>
//               <SectionPaper title="About the App" subtitle="Version & legal">
//                 <Typography variant="body2">Version 3.0.770-2.0.525</Typography>
//                 <Box sx={{ mt: 2 }}>
//                   <Button size="small" onClick={() => setSnack({ open: true, severity: "info", message: "Terms accepted (simulated)" })}>Terms & Conditions</Button>
//                   <Button size="small" onClick={() => setSnack({ open: true, severity: "info", message: "Privacy accepted (simulated)" })}>Privacy Policy</Button>
//                 </Box>
//               </SectionPaper>
//             </Grid>

//             <Grid item xs={12}>
//               <Paper sx={{ p: 2, borderRadius: 2, border: "1px dashed #E8EEF6" }}>
//                 <Typography variant="subtitle2" fontWeight={700}>Danger zone</Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                   Closing your account will remove all your store connections and data.
//                 </Typography>
//                 <Button variant="contained" color="error" startIcon={<DeleteForeverIcon />} fullWidth onClick={() => setCloseOpen(true)}>
//                   Close your account
//                 </Button>
//               </Paper>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>

//       {/* Change password dialog */}
//       <Dialog open={pwdOpen} onClose={() => setPwdOpen(false)} maxWidth="xs" fullWidth>
//         <DialogTitle>Change password</DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//             <TextField label="Current password" type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} fullWidth />
//             <TextField label="New password" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} fullWidth />
//             <TextField label="Confirm password" type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} fullWidth />
//             {pwdError && <Typography color="error" variant="body2">{pwdError}</Typography>}
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setPwdOpen(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleChangePassword}>Save password</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Close account confirm */}
//       <Dialog open={closeOpen} onClose={() => setCloseOpen(false)} maxWidth="xs" fullWidth>
//         <DialogTitle>Close your account</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to permanently close your account? This action cannot be undone.</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setCloseOpen(false)}>Cancel</Button>
//           <Button variant="contained" color="error" onClick={handleCloseAccount}>Yes, close my account</Button>
//         </DialogActions>
//       </Dialog>

//       {/* snack */}
//       <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
//         <Alert severity={snack.severity} sx={{ width: "100%" }}>{snack.message}</Alert>
//       </Snackbar>
//     </Container>
//   );
// }

import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Avatar,
  Tooltip,
  IconButton,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import CloseIcon from "@mui/icons-material/Close";

/*
  Professional / "extra-ordinary" Settings page
  - Single-file page, ready to drop in
  - Tracks dirty state and enables "Save all changes"
  - Responsive, nicer spacing, sticky mobile actions
*/

export default function Settings() {
  // ---------- initial values ----------
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
    pref_imageLibraryOnUpload: true,
    pref_imageLibraryOnDrop: false,
    pref_emailNotifications: true,
    pref_resellerEmails: false,
    pref_stockNotifications: true,
    pref_newsOffers: true,
  };

  // ---------- state ----------
  const [state, setState] = useState(initial);
  const [dirty, setDirty] = useState(false);

  const [pwdOpen, setPwdOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

  // change password fields
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState("");

  // ---------- helpers ----------
  const update = (patch) => {
    setState((s) => {
      const next = { ...s, ...patch };
      setDirty(true);
      return next;
    });
  };

  const resetAll = () => {
    setState(initial);
    setDirty(false);
    setSnack({ open: true, severity: "info", message: "Changes discarded." });
  };

  // ---------- handlers ----------
  const handleSaveAll = () => {
    // call your API to persist `state`
    setDirty(false);
    setSnack({ open: true, severity: "success", message: "All changes saved." });
  };

  const handleClearCache = () => {
    setSnack({ open: true, severity: "info", message: "App cache cleared." });
  };

  const handleOpenChangePwd = () => {
    setPwdOpen(true);
    setPwdError("");
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
  };

  const handleChangePassword = () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdError("Please fill all fields.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("New password and confirmation do not match.");
      return;
    }
    // Call change password API here
    setPwdOpen(false);
    setSnack({ open: true, severity: "success", message: "Password changed — please log in again." });
    setDirty(false);
  };

  const handleCloseAccount = () => {
    // Call close account API here
    setCloseOpen(false);
    setSnack({ open: true, severity: "warning", message: "Account closure requested (simulated)." });
  };

  const closeSnackbar = () => setSnack({ ...snack, open: false });

  // small subcomponents to keep markup tidy
  const SectionCard = ({ title, subtitle, children, actions }) => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && <Box sx={{ ml: 2 }}>{actions}</Box>}
      </Box>

      <Divider sx={{ mb: 2 }} />
      <Box>{children}</Box>
    </Paper>
  );

  const PrefToggle = ({ label, checked, onChange }) => (
    <FormControlLabel control={<Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />} label={label} />
  );

  // responsive columns breakpoints
  const fieldCols = { xs: 12, sm: 6, md: 6 };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* header */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your account, contact details, preferences and app settings.
          </Typography>
        </Box>

        {/* action buttons on the right */}
        <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            startIcon={<LockIcon />}
            variant="outlined"
            onClick={handleOpenChangePwd}
            sx={{ borderRadius: 2, px: 2 }}
          >
            Change password
          </Button>

          <Button
            startIcon={<DeleteForeverIcon />}
            variant="outlined"
            color="error"
            onClick={() => setCloseOpen(true)}
            sx={{ borderRadius: 2, px: 2 }}
          >
            Close your account
          </Button>

          <Tooltip title={dirty ? "Save changes" : "No changes to save"}>
            <span>
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                color="primary"
                onClick={handleSaveAll}
                disabled={!dirty}
                sx={{
                  borderRadius: 2,
                  px: 2.5,
                }}
              >
                Save all changes
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left: forms */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* User info */}
            <SectionCard
              title="Your user information"
              subtitle="The following is the user you registered with. Change email will require re-login."
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    value={state.userEmail}
                    onChange={(e) => update({ userEmail: e.target.value })}
                    helperText="If you update your email address you will be asked to log in again."
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Username"
                    fullWidth
                    value={state.username}
                    onChange={(e) => update({ username: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button variant="outlined" startIcon={<LockIcon />} onClick={handleOpenChangePwd}>
                    Change password
                  </Button>
                </Grid>
              </Grid>
            </SectionCard>

            {/* Contact */}
            <SectionCard
              title="Your contact information"
              subtitle="Used on orders that do not contain a customer email/phone for customs processing."
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={state.contactName}
                    onChange={(e) => update({ contactName: e.target.value })}
                    InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1 }} /> }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={state.contactEmail}
                    onChange={(e) => update({ contactEmail: e.target.value })}
                    InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1 }} /> }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={state.contactPhone}
                    onChange={(e) => update({ contactPhone: e.target.value })}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Address */}
            <SectionCard title="Your address" subtitle="Used for invoices and payment setup.">
              <Grid container spacing={2}>
                <Grid item {...fieldCols}>
                  <TextField fullWidth label="Company Name" value={state.companyName} onChange={(e) => update({ companyName: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Address 1" value={state.address1} onChange={(e) => update({ address1: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Address 2" value={state.address2} onChange={(e) => update({ address2: e.target.value })} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Town" value={state.town} onChange={(e) => update({ town: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth label="County / Region" value={state.region} onChange={(e) => update({ region: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth label="Country" value={state.country} onChange={(e) => update({ country: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth label="Postcode / ZIP" value={state.postcode} onChange={(e) => update({ postcode: e.target.value })} />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Invoice fields */}
            <SectionCard title="Your invoice fields" subtitle="Used to generate invoices.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="VAT / Tax Number" value={state.vatNumber} onChange={(e) => update({ vatNumber: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Reference" value={state.reference} onChange={(e) => update({ reference: e.target.value })} />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Preferences */}
            <SectionCard title="Your preferences" subtitle="Set your app preferences.">
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <PrefToggle label="Add uploaded images to Image Library when creating Manual Orders." checked={state.pref_imageLibraryOnUpload} onChange={(v) => update({ pref_imageLibraryOnUpload: v })} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <PrefToggle label="Add uploaded images to Image Library when dropping images within the product editor." checked={state.pref_imageLibraryOnDrop} onChange={(v) => update({ pref_imageLibraryOnDrop: v })} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <PrefToggle label="Receive emails for important notifications." checked={state.pref_emailNotifications} onChange={(v) => update({ pref_emailNotifications: v })} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <PrefToggle label="Receive emails for Reseller Pending orders that require attention." checked={state.pref_resellerEmails} onChange={(v) => update({ pref_resellerEmails: v })} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <PrefToggle label="Receive notifications when Products become Low / Out of Stock." checked={state.pref_stockNotifications} onChange={(v) => update({ pref_stockNotifications: v })} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <PrefToggle label="Keep me updated on News & Offers." checked={state.pref_newsOffers} onChange={(v) => update({ pref_newsOffers: v })} />
                </Grid>
              </Grid>
            </SectionCard>
          </Stack>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <SectionCard title="Account summary" subtitle="Quick at-a-glance">
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, fontSize: 20 }}>{state.username ? state.username[0]?.toUpperCase() : "U"}</Avatar>
                <Box>
                  <Typography fontWeight={700}>{state.username}</Typography>
                  <Typography variant="body2" color="text.secondary">{state.userEmail}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={1}>
                <Button variant="outlined" startIcon={<CloudDownloadIcon />} onClick={() => setSnack({ open: true, severity: "info", message: "Exported (simulated)" })}>
                  Export data
                </Button>

                <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleClearCache}>
                  Clear App Cache
                </Button>
              </Stack>
            </SectionCard>

            <SectionCard title="About the App" subtitle="Version & legal">
              <Typography variant="body2">Version 3.0.770-2.0.525</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button size="small" onClick={() => setSnack({ open: true, severity: "info", message: "Terms opened (simulated)" })}>Terms & Conditions</Button>
                <Button size="small" onClick={() => setSnack({ open: true, severity: "info", message: "Privacy opened (simulated)" })}>Privacy Policy</Button>
              </Stack>
            </SectionCard>

            <Paper sx={{ p: 2, borderRadius: 2, border: "1px dashed", borderColor: "divider" }}>
              <Typography variant="subtitle2" fontWeight={700}>Danger zone</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Closing your account will remove all your store connections and data. This action is irreversible.
              </Typography>
              <Button variant="contained" color="error" startIcon={<DeleteForeverIcon />} fullWidth onClick={() => setCloseOpen(true)}>
                Close your account
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* sticky mobile action bar */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 12,
          px: 2,
          zIndex: 2000,
          justifyContent: "center",
        }}
      >
        <Paper sx={{ p: 1, width: "min(980px, 96%)", borderRadius: 8, display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between", boxShadow: 6 }}>
          <Button variant="outlined" color="inherit" onClick={resetAll}>Discard</Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveAll} disabled={!dirty}>Save changes</Button>
        </Paper>
      </Box>

      {/* Change password dialog */}
      <Dialog open={pwdOpen} onClose={() => setPwdOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Change password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Current password" type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} fullWidth />
            <TextField label="New password" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} fullWidth />
            <TextField label="Confirm password" type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} fullWidth />
            {pwdError && <Typography color="error" variant="body2">{pwdError}</Typography>}
            <Typography variant="caption" color="text.secondary">Make sure your password is strong (min 8 characters).</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPwdOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleChangePassword}>Save password</Button>
        </DialogActions>
      </Dialog>

      {/* Close account confirm */}
      <Dialog open={closeOpen} onClose={() => setCloseOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Close your account</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to permanently close your account? This action cannot be undone.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            We will remove your store connections, products and order history.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloseOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleCloseAccount}>Yes, close my account</Button>
        </DialogActions>
      </Dialog>

      {/* snack */}
      <Snackbar open={snack.open} autoHideDuration={3500} onClose={closeSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={closeSnackbar} severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
