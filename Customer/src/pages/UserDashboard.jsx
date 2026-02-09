// import React, { useMemo, useState } from "react";
// import {
//   Box,
//   Container,
//   Grid,
//   Paper,
//   Typography,
//   Button,
//   LinearProgress,
//   Chip,
//   Stack,
//   Divider,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   List,
//   ListItem,
//   ListItemText,
//   Snackbar,
//   Alert,
//   TextField,
// } from "@mui/material";
// import {
//   // ... existing imports
//   // Article as ArticleIcon,
//   // ShoppingBag as ShoppingBagIcon,
//   ReceiptLong as ReceiptLongIcon,
//   Add as AddIcon,
//   Visibility as VisibilityIcon,
//   // ChevronRight as ChevronRightIcon,
//   // ... other imports
// } from "@mui/icons-material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
// import SettingsIcon from "@mui/icons-material/Settings";
// import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
// import ArticleIcon from "@mui/icons-material/Article";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import BoltIcon from "@mui/icons-material/Bolt";

// export default function Dashboard() {
//   // -- Dummy onboarding tasks (user can toggle complete)
//   const initialTasks = [
//     { id: 1, label: "Confirm your email", done: false, hint: "We sent a confirmation link to your email" },
//     { id: 2, label: "Set up your Address", done: false, hint: "Used for invoices & shipping" },
//     { id: 3, label: "Create a Product", done: false, hint: "Add your first product" },
//     { id: 4, label: "Connect your store", done: false, hint: "Connect Shopify / Etsy / WooCommerce" },
//     { id: 5, label: "Add your product to your store", done: false, hint: "Publish product to storefront" },
//     { id: 6, label: "Add a payment method", done: false, hint: "Enable order processing" },
//   ];
//   const [tasks, setTasks] = useState(initialTasks);
//   const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

//   const toggleTask = (id) => {
//     setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
//   };

//   // -- Dummy orders & stats
//   const monthlyOrders = [2, 5, 8, 6, 12, 18, 22, 19, 14, 9, 11, 16]; // sample per month
//   const [recentOrders] = useState([
//     { id: "ORD-1001", customer: "Ali Khan", total: "$32.00", status: "Fulfilled", date: "2026-01-05" },
//     { id: "ORD-1002", customer: "Sara Q", total: "$18.50", status: "Pending", date: "2026-01-11" },
//     { id: "ORD-1003", customer: "Zain", total: "$45.00", status: "In production", date: "2026-01-14" },
//   ]);

//   const currentMonth = monthlyOrders[new Date().getMonth()] || 0;
//   const lastMonth = monthlyOrders[(new Date().getMonth() - 1 + 12) % 12] || 0;
//   const yearToDate = monthlyOrders.reduce((a, b) => a + b, 0);

//   // -- Progress of onboarding:
//   const doneCount = tasks.filter(t => t.done).length;
//   const progressPct = Math.round((doneCount / tasks.length) * 100);

//   // -- Dialog state for Manage Payment / Guide etc
//   const [openDialog, setOpenDialog] = useState(null); // "payment" | "guide" | "settings" | null

//   // -- mini SVG bar chart for monthly orders
//   const BarChart = ({ data = [] }) => {
//     const max = Math.max(...data, 1);
//     return (
//       <Box sx={{ width: "100%", height: 96, display: "flex", gap: 6, alignItems: "end", px: 1 }}>
//         {data.map((v, i) => {
//           const h = Math.round((v / max) * 80) + 6;
//           const isThisMonth = i === (new Date().getMonth());
//           return (
//             <Box key={i} sx={{ textAlign: "center", width: 18 }}>
//               <Box
//                 sx={{
//                   height: h,
//                   bgcolor: isThisMonth ? "primary.main" : "#dbeafe",
//                   borderRadius: 1.5,
//                   transition: "0.2s",
//                   mx: "auto",
//                 }}
//                 title={`${v} orders`}
//               />
//               <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>{["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}</Typography>
//             </Box>
//           );
//         })}
//       </Box>
//     );
//   };

//   // -- KPI Card small component
//   const Kpi = ({ label, value, hint, icon }) => (
//     <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}>
//       <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//         <Box sx={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#eef2ff", borderRadius: 1.5 }}>
//           {icon}
//         </Box>
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="caption" color="text.secondary">{label}</Typography>
//           <Typography variant="h6" fontWeight={700}>{value}</Typography>
//           {hint && <Typography variant="caption" color="text.secondary">{hint}</Typography>}
//         </Box>
//       </Box>
//     </Paper>
//   );

//   // -- Onboarding Task Row
//   const TaskRow = ({ t }) => (
//     <Box sx={{ display: "flex", gap: 2, alignItems: "center", py: 1 }}>
//       <IconButton size="small" onClick={() => toggleTask(t.id)} color={t.done ? "success" : "default"}>
//         {t.done ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
//       </IconButton>
//       <Box sx={{ flex: 1 }}>
//         <Typography fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           {t.label}
//           {t.done && <Chip label="Done" size="small" color="success" sx={{ ml: 1 }} />}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">{t.hint}</Typography>
//       </Box>
//       <Button variant="text" endIcon={<ChevronRightIcon />} onClick={() => alert(`Open flow for: ${t.label}`)}>Do</Button>
//     </Box>
//   );

//   // -- Shortcuts card
//   const ShortcutCard = ({ title, subtitle, icon, onClick }) => (
//     <Paper sx={{ p: 2, borderRadius: 2, display: "flex", gap: 2, alignItems: "center", cursor: "pointer", "&:hover": { boxShadow: 6 } }} onClick={onClick}>
//       <Box sx={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f1f5f9", borderRadius: 1.5 }}>
//         {icon}
//       </Box>
//       <Box>
//         <Typography fontWeight={700}>{title}</Typography>
//         <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
//       </Box>
//     </Paper>
//   );

//   // -- A bit longer content area for Guides / Videos
//   const ResourceCard = ({ title, children, action }) => (
//     <Paper sx={{ p: 2.5, borderRadius: 2 }}>
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//         <Typography fontWeight={800}>{title}</Typography>
//         {action}
//       </Box>
//       <Divider sx={{ mb: 1 }} />
//       {children}
//     </Paper>
//   );

//   // memoize some KPI values
//   const kpis = useMemo(() => ([
//     { label: "Orders (this month)", value: currentMonth, icon: <ShoppingBagIcon color="primary" /> },
//     { label: "Orders (last month)", value: lastMonth, icon: <AccessTimeIcon color="primary" /> },
//     { label: "Year to date", value: yearToDate, icon: <BoltIcon color="primary" /> },
//   ]), [currentMonth, lastMonth, yearToDate]);

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Grid container spacing={3} sx={{ width: "100%" }}>
//         {/* Header / Welcome */}
//         <Grid item xs={12} sx={{ width: "100%" }}>
//           <Paper sx={{ p: 3, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
//             <Box>
//               <Typography variant="h5" fontWeight={900}>My Dashboard</Typography>
//             </Box>

//             <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//               <Button variant="outlined" onClick={() => setOpenDialog("guide")}>View Getting Started Guide</Button>
//               <Button variant="contained" onClick={() => setOpenDialog("settings")}>General Settings</Button>
//             </Box>
//           </Paper>
//         </Grid>

//         {/* Onboarding + KPIs */}
//         <Grid container spacing={3} sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
//           <Grid item xs={12} md={4} sx={{ width: "80%" }}>
//             <Paper sx={{ p: 2.5, borderRadius: 2 }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Box>
//                   <Typography fontWeight={400}>Let's get you started.</Typography>
//                   <Typography variant="body2" color="text.secondary">Finish these steps to go live</Typography>
//                 </Box>
//                 <Chip label={`${progressPct}%`} color={progressPct >= 100 ? "success" : "primary"} />
//               </Box>

//               <LinearProgress variant="determinate" value={progressPct} sx={{ height: 8, borderRadius: 2, mb: 2 }} />

//               <Box>
//                 {tasks.map(t => <TaskRow key={t.id} t={t} />)}
//               </Box>

//               <Divider sx={{ my: 2 }} />
//               <Typography variant="caption" color="text.secondary">Next Steps</Typography>
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
//                 <Button variant="outlined" startIcon={<StorefrontIcon />} onClick={() => setOpenDialog("connect")}>Connect a store</Button>
//                 <Button variant="outlined" startIcon={<CreditCardIcon />} onClick={() => setOpenDialog("payment")}>Add payment method</Button>
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>

//         <Grid item xs={12} md={8}>
//           <Grid container spacing={2}>
//             {kpis.map((k, idx) => (
//               <Grid item xs={12} sm={4} key={idx}>
//                 <Kpi label={k.label} value={k.value} hint={idx === 0 ? "Number of orders received" : ""} icon={k.icon} />
//               </Grid>
//             ))}

//             <Grid item xs={12}>
//               <Paper sx={{ p: 2.5, borderRadius: 2 }}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <Box>
//                     <Typography fontWeight={800}>Orders Received By Month</Typography>
//                     <Typography variant="body2" color="text.secondary">Track monthly volume</Typography>
//                   </Box>
//                   <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//                     <Chip label="Last 12 months" size="small" />
//                   </Box>
//                 </Box>

//                 <Box sx={{ mt: 2 }}>
//                   <BarChart data={monthlyOrders} />
//                 </Box>

//                 <Divider sx={{ my: 2 }} />

//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={3}>
//                     <Typography variant="caption" color="text.secondary">Current Month</Typography>
//                     <Typography fontWeight={700} variant="h6">{currentMonth}</Typography>
//                   </Grid>
//                   <Grid item xs={12} md={3}>
//                     <Typography variant="caption" color="text.secondary">Last Month</Typography>
//                     <Typography fontWeight={700} variant="h6">{lastMonth}</Typography>
//                   </Grid>
//                   <Grid item xs={12} md={3}>
//                     <Typography variant="caption" color="text.secondary">Year To Date</Typography>
//                     <Typography fontWeight={700} variant="h6">{yearToDate}</Typography>
//                   </Grid>
//                   <Grid item xs={12} md={3}>
//                     <Typography variant="caption" color="text.secondary">Total Orders</Typography>
//                     <Typography fontWeight={700} variant="h6">{recentOrders.length}</Typography>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </Grid>
//           </Grid>
//         </Grid>


//         {/* Next Steps Section */}
//         <Grid item xs={12}>
//           <Paper sx={{
//             p: 3,
//             borderRadius: 3,
//             bgcolor: 'background.paper',
//             boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
//             border: '1px solid rgba(0,0,0,0.08)'
//           }}>
//             <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
//               Next Steps
//             </Typography>

//             <Grid container spacing={3}>
//               {/* Box 1: Guide */}
//               <Grid item xs={12} md={4}>
//                 <Paper
//                   onClick={() => setOpenDialog("guide")}
//                   sx={{
//                     p: 3,
//                     height: '100%',
//                     borderRadius: 3,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     textAlign: 'center',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     border: '2px solid',
//                     borderColor: '#e0e7ff',
//                     bgcolor: '#f8fafc',
//                     '&:hover': {
//                       transform: 'translateY(-4px)',
//                       boxShadow: '0 8px 30px rgba(79, 70, 229, 0.2)',
//                       borderColor: '#4f46e5',
//                       bgcolor: '#f1f5f9'
//                     }
//                   }}
//                 >
//                   <Box sx={{
//                     width: 80,
//                     height: 80,
//                     borderRadius: 4,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     bgcolor: 'rgba(79, 70, 229, 0.1)',
//                     mb: 2.5
//                   }}>
//                     <ArticleIcon sx={{ fontSize: 40, color: '#4f46e5' }} />
//                   </Box>

//                   <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: '#1e293b' }}>
//                     Guide
//                   </Typography>

//                   <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, fontSize: '1rem' }}>
//                     View our Getting Started Guide
//                   </Typography>

//                   <Button
//                     variant="contained"
//                     startIcon={<ChevronRightIcon />}
//                     sx={{
//                       bgcolor: '#4f46e5',
//                       borderRadius: 2,
//                       px: 3,
//                       py: 1,
//                       textTransform: 'none',
//                       fontSize: '0.95rem',
//                       fontWeight: 600,
//                       '&:hover': { bgcolor: '#4338ca' }
//                     }}
//                   >
//                     Open Guide
//                   </Button>
//                 </Paper>
//               </Grid>

//               {/* Box 2: Product */}
//               <Grid item xs={12} md={4}>
//                 <Paper
//                   onClick={() => alert("Create product")}
//                   sx={{
//                     p: 3,
//                     height: '100%',
//                     borderRadius: 3,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     textAlign: 'center',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     border: '2px solid',
//                     borderColor: '#d1fae5',
//                     bgcolor: '#f8fafc',
//                     '&:hover': {
//                       transform: 'translateY(-4px)',
//                       boxShadow: '0 8px 30px rgba(16, 185, 129, 0.2)',
//                       borderColor: '#10b981',
//                       bgcolor: '#f1f5f9'
//                     }
//                   }}
//                 >
//                   <Box sx={{
//                     width: 80,
//                     height: 80,
//                     borderRadius: 4,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     bgcolor: 'rgba(16, 185, 129, 0.1)',
//                     mb: 2.5
//                   }}>
//                     <ShoppingBagIcon sx={{ fontSize: 40, color: '#10b981' }} />
//                   </Box>

//                   <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: '#1e293b' }}>
//                     Product
//                   </Typography>

//                   <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, fontSize: '1rem' }}>
//                     Create a Product
//                   </Typography>

//                   <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     sx={{
//                       bgcolor: '#10b981',
//                       borderRadius: 2,
//                       px: 3,
//                       py: 1,
//                       textTransform: 'none',
//                       fontSize: '0.95rem',
//                       fontWeight: 600,
//                       '&:hover': { bgcolor: '#0da271' }
//                     }}
//                   >
//                     Create New
//                   </Button>
//                 </Paper>
//               </Grid>

//               {/* Box 3: Orders */}
//               <Grid item xs={12} md={4}>
//                 <Paper
//                   onClick={() => setOpenDialog("orders")}
//                   sx={{
//                     p: 3,
//                     height: '100%',
//                     borderRadius: 3,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     textAlign: 'center',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     border: '2px solid',
//                     borderColor: '#fef3c7',
//                     bgcolor: '#f8fafc',
//                     '&:hover': {
//                       transform: 'translateY(-4px)',
//                       boxShadow: '0 8px 30px rgba(245, 158, 11, 0.2)',
//                       borderColor: '#f59e0b',
//                       bgcolor: '#f1f5f9'
//                     }
//                   }}
//                 >
//                   <Box sx={{
//                     width: 80,
//                     height: 80,
//                     borderRadius: 4,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     bgcolor: 'rgba(245, 158, 11, 0.1)',
//                     mb: 2.5
//                   }}>
//                     <ReceiptLongIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
//                   </Box>

//                   <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: '#1e293b' }}>
//                     Orders
//                   </Typography>

//                   <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, fontSize: '1rem' }}>
//                     Check your Orders
//                   </Typography>

//                   <Button
//                     variant="contained"
//                     startIcon={<VisibilityIcon />}
//                     sx={{
//                       bgcolor: '#f59e0b',
//                       borderRadius: 2,
//                       px: 3,
//                       py: 1,
//                       textTransform: 'none',
//                       fontSize: '0.95rem',
//                       fontWeight: 600,
//                       '&:hover': { bgcolor: '#d97706' }
//                     }}
//                   >
//                     View Orders
//                   </Button>
//                 </Paper>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Grid>

//         {/* Account Setup Container */}
//         {/* Account Setup Container */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{
//             p: 3,
//             display: "flex",
//             flexDirection: { xs: "column", sm: "row" },
//             gap: 3,
//             borderRadius: 2,
//             bgcolor: 'background.paper',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//             border: '1px solid rgba(0,0,0,0.06)'
//           }}>

//             {/* First Box - Account Setup & Payment Method */}
//             <Box sx={{
//               flex: 1,
//               p: 2.5,
//               display: "flex",
//               flexDirection: "column",
//               borderRadius: 2,
//               bgcolor: '#f8fafc',
//               border: '1px solid #e2e8f0',
//               minHeight: 280
//             }}>
//               <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
//                 Account Setup
//               </Typography>

//               <Box sx={{
//                 flex: 1,
//                 p: 2,
//                 borderRadius: 1.5,
//                 bgcolor: '#fee2e2',
//                 border: '1px solid #fecaca',
//                 display: "flex",
//                 flexDirection: "column"
//               }}>
//                 <Typography variant="body2" fontWeight={600} color="#dc2626" sx={{ mb: 0.5 }}>
//                   No Payment Method Configured
//                 </Typography>
//                 <Typography variant="body2" color="#64748b" sx={{ fontSize: '0.875rem', mb: 2, flex: 1 }}>
//                   We will accept orders but not process them until a valid payment method has been setup.
//                 </Typography>

//                 <Box sx={{ mt: "auto" }}>
//                   <Typography variant="body1" fontWeight={600} sx={{ mb: 1.5 }}>
//                     Payment Method
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     size="small"
//                     fullWidth
//                     sx={{
//                       bgcolor: '#4f46e5',
//                       textTransform: 'none',
//                       fontSize: '0.875rem',
//                       py: 1,
//                       borderRadius: 1,
//                       '&:hover': { bgcolor: '#4338ca' }
//                     }}
//                     onClick={() => setOpenDialog('payment')}
//                   >
//                     Manage your Payment Method
//                   </Button>
//                 </Box>
//               </Box>
//             </Box>

//             {/* Second Box - General Settings */}
//             <Box sx={{
//               flex: 1,
//               p: 2.5,
//               display: "flex",
//               flexDirection: "column",
//               borderRadius: 2,
//               bgcolor: '#f8fafc',
//               border: '1px solid #e2e8f0',
//               minHeight: 280
//             }}>
//               <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
//                 General Settings
//               </Typography>

//               <Box sx={{
//                 flex: 1,
//                 p: 2,
//                 borderRadius: 1.5,
//                 bgcolor: 'white',
//                 border: '1px solid #e2e8f0',
//                 display: "flex",
//                 flexDirection: "column"
//               }}>
//                 <Typography variant="body2" color="#64748b" sx={{ fontSize: '0.875rem', mb: 2, flex: 1 }}>
//                   Configure Settings such as name and address for your business profile and account management.
//                 </Typography>

//                 <Box sx={{ mt: "auto" }}>
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     fullWidth
//                     sx={{
//                       textTransform: 'none',
//                       fontSize: '0.875rem',
//                       py: 1,
//                       borderRadius: 1,
//                       borderColor: '#cbd5e1',
//                       color: '#475569',
//                       '&:hover': {
//                         borderColor: '#94a3b8',
//                         bgcolor: '#f1f5f9'
//                       }
//                     }}
//                     onClick={() => setOpenDialog('settings')}
//                   >
//                     Configure General Settings
//                   </Button>
//                 </Box>
//               </Box>
//             </Box>
//           </Paper>
//         </Grid>

//         {/* Middle: Resources and Shortcuts */}
//         <Grid item xs={12} md={4}>
//           <ResourceCard title="Shortcuts" action={<Button size="small" endIcon={<ChevronRightIcon />}>Manage</Button>}>
//             <Stack spacing={1}>
//               <ShortcutCard title="Create a Product" subtitle="Add new item to catalog" icon={<ShoppingBagIcon />} onClick={() => alert("Create product")} />
//               <ShortcutCard title="Orders" subtitle="View and manage orders" icon={<ShoppingBagIcon />} onClick={() => setOpenDialog("orders")} />
//               <ShortcutCard title="How To Videos" subtitle="Quick video guides" icon={<PlayCircleOutlineIcon />} onClick={() => setOpenDialog("videos")} />
//             </Stack>
//           </ResourceCard>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <ResourceCard title="Guides" action={<Button size="small">Open Guide</Button>}>
//             <List dense>
//               <ListItem secondaryAction={<Button size="small">Open</Button>}><ListItemText primary="Getting Started" secondary="Step-by-step onboarding" /></ListItem>
//               <ListItem secondaryAction={<Button size="small">Open</Button>}><ListItemText primary="Publishing to Etsy" secondary="Quick publish flow" /></ListItem>
//               <ListItem secondaryAction={<Button size="small">Open</Button>}><ListItemText primary="Payment setup" secondary="Enable payments" /></ListItem>
//             </List>
//           </ResourceCard>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <ResourceCard title="Tips & Guides" action={<Button size="small">More</Button>}>
//             <Stack spacing={1}>
//               <Box>
//                 <Typography fontWeight={700}>Sell faster with bundles</Typography>
//                 <Typography variant="body2" color="text.secondary">Combine items to increase average order value.</Typography>
//               </Box>
//               <Divider />
//               <Box>
//                 <Typography fontWeight={700}>Optimize product titles</Typography>
//                 <Typography variant="body2" color="text.secondary">Use keywords customers search for.</Typography>
//               </Box>
//             </Stack>
//           </ResourceCard>
//         </Grid>

//         {/* Recent Orders - Enhanced */}
//         <Grid item xs={12}>
//           <Paper sx={{
//             p: 3,
//             borderRadius: 3,
//             bgcolor: 'background.paper',
//             boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
//             border: '1px solid rgba(0,0,0,0.08)'
//           }}>
//             <Box sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 2.5
//             }}>
//               <Box>
//                 <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
//                   Recent Orders
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Latest transactions and order status
//                 </Typography>
//               </Box>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 endIcon={<ChevronRightIcon />}
//                 sx={{
//                   borderRadius: 2,
//                   textTransform: 'none',
//                   '&:hover': {
//                     bgcolor: 'primary.light',
//                     color: 'white'
//                   }
//                 }}
//                 onClick={() => setOpenDialog("orders")}
//               >
//                 View All Orders
//               </Button>
//             </Box>

//             <Divider sx={{ mb: 2 }} />

//             <Box sx={{ overflow: 'auto' }}>
//               <Box sx={{
//                 display: 'grid',
//                 gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
//                 gap: 2,
//                 mb: 2
//               }}>
//                 {[
//                   { label: 'Total Orders', value: recentOrders.length, icon: <ShoppingBagIcon />, color: '#4f46e5' },
//                   { label: 'Pending', value: recentOrders.filter(o => o.status === 'Pending').length, icon: <AccessTimeIcon />, color: '#f59e0b' },
//                   { label: 'Fulfilled', value: recentOrders.filter(o => o.status === 'Fulfilled').length, icon: <CheckCircleIcon />, color: '#10b981' },
//                 ].map((stat, index) => (
//                   <Paper key={index} sx={{
//                     p: 2,
//                     borderRadius: 2,
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 2,
//                     bgcolor: 'grey.50',
//                     border: '1px solid',
//                     borderColor: 'grey.200'
//                   }}>
//                     <Box sx={{
//                       width: 48,
//                       height: 48,
//                       borderRadius: 2,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       bgcolor: `${stat.color}15`
//                     }}>
//                       {React.cloneElement(stat.icon, { sx: { color: stat.color, fontSize: 24 } })}
//                     </Box>
//                     <Box>
//                       <Typography variant="body2" color="text.secondary">
//                         {stat.label}
//                       </Typography>
//                       <Typography variant="h5" fontWeight={700} color={stat.color}>
//                         {stat.value}
//                       </Typography>
//                     </Box>
//                   </Paper>
//                 ))}
//               </Box>

//               <Box sx={{
//                 borderRadius: 2,
//                 overflow: 'hidden',
//                 border: '1px solid',
//                 borderColor: 'grey.200'
//               }}>
//                 <Box sx={{
//                   display: 'grid',
//                   gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr auto' },
//                   bgcolor: 'grey.50',
//                   p: 2,
//                   borderBottom: '1px solid',
//                   borderColor: 'grey.200'
//                 }}>
//                   <Typography variant="subtitle2" fontWeight={600}>Order / Customer</Typography>
//                   <Typography variant="subtitle2" fontWeight={600}>Date</Typography>
//                   <Typography variant="subtitle2" fontWeight={600}>Amount</Typography>
//                   <Typography variant="subtitle2" fontWeight={600}>Items</Typography>
//                   <Typography variant="subtitle2" fontWeight={600}>Status</Typography>
//                 </Box>

//                 {recentOrders.map((order) => {
//                   const statusColors = {
//                     'Fulfilled': { bg: '#d1fae5', color: '#065f46', icon: <CheckCircleIcon fontSize="small" /> },
//                     'Pending': { bg: '#fef3c7', color: '#92400e', icon: <AccessTimeIcon fontSize="small" /> },
//                     'In production': { bg: '#dbeafe', color: '#1e40af', icon: <SettingsIcon fontSize="small" /> },
//                   };
//                   const status = statusColors[order.status] || { bg: '#f3f4f6', color: '#374151', icon: null };

//                   return (
//                     <Box
//                       key={order.id}
//                       sx={{
//                         display: 'grid',
//                         gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr auto' },
//                         p: 2,
//                         alignItems: 'center',
//                         borderBottom: '1px solid',
//                         borderColor: 'grey.100',
//                         '&:hover': {
//                           bgcolor: 'grey.50',
//                         },
//                         '&:last-child': {
//                           borderBottom: 'none'
//                         }
//                       }}
//                     >
//                       <Box>
//                         <Typography fontWeight={600} variant="body2">
//                           {order.id}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {order.customer}
//                         </Typography>
//                       </Box>

//                       <Typography variant="body2" color="text.secondary">
//                         {new Date(order.date).toLocaleDateString('en-US', {
//                           month: 'short',
//                           day: 'numeric',
//                           year: 'numeric'
//                         })}
//                       </Typography>

//                       <Typography fontWeight={600} variant="body2">
//                         {order.total}
//                       </Typography>

//                       <Typography variant="body2" color="text.secondary">
//                         3 items
//                       </Typography>

//                       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                         <Chip
//                           label={order.status}
//                           size="small"
//                           icon={status.icon}
//                           sx={{
//                             bgcolor: status.bg,
//                             color: status.color,
//                             fontWeight: 600,
//                             borderRadius: 1.5,
//                             px: 1,
//                             '& .MuiChip-icon': {
//                               color: status.color
//                             }
//                           }}
//                         />
//                       </Box>
//                     </Box>
//                   );
//                 })}
//               </Box>
//             </Box>

//             <Box sx={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               mt: 3,
//               pt: 2,
//               borderTop: '1px solid',
//               borderColor: 'grey.200'
//             }}>
//               <Typography variant="body2" color="text.secondary">
//                 Showing {recentOrders.length} of 24 total orders
//               </Typography>
//               <Box sx={{ display: 'flex', gap: 1 }}>
//                 <IconButton size="small" sx={{ border: '1px solid', borderColor: 'grey.300' }}>
//                   <ChevronRightIcon sx={{ transform: 'rotate(180deg)' }} />
//                 </IconButton>
//                 <IconButton size="small" sx={{ border: '1px solid', borderColor: 'grey.300' }}>
//                   <ChevronRightIcon />
//                 </IconButton>
//               </Box>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Dialogs */}
//       <Dialog open={openDialog === "payment"} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
//         <DialogTitle>Manage Payment Method</DialogTitle>
//         <DialogContent>
//           <Typography sx={{ mb: 2 }}>
//             Select a payment method to enable order processing:
//           </Typography>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//             <Button variant="outlined" onClick={() => {
//               setSnack({ open: true, severity: "success", message: "Credit card added" });
//               setOpenDialog(null);
//             }}>
//               Add Credit/Debit Card
//             </Button>
//             <Button variant="outlined" onClick={() => {
//               setSnack({ open: true, severity: "success", message: "PayPal connected" });
//               setOpenDialog(null);
//             }}>
//               Connect PayPal
//             </Button>
//             <Button variant="outlined" onClick={() => {
//               setSnack({ open: true, severity: "success", message: "Bank account added" });
//               setOpenDialog(null);
//             }}>
//               Add Bank Account
//             </Button>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openDialog === "guide"} onClose={() => setOpenDialog(null)} maxWidth="md" fullWidth>
//         <DialogTitle>Getting Started Guide</DialogTitle>
//         <DialogContent>
//           <Typography sx={{ mb: 2 }}>Follow this short guide to get your store live quickly:</Typography>
//           <List>
//             <ListItem><ListItemText primary="Confirm your email" /></ListItem>
//             <ListItem><ListItemText primary="Add a payment method" /></ListItem>
//             <ListItem><ListItemText primary="Create & publish your first product" /></ListItem>
//             <ListItem><ListItemText primary="Connect your store" /></ListItem>
//           </List>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(null)}>Close</Button>
//           <Button variant="contained" onClick={() => setOpenDialog(null)}>Open Onboarding</Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openDialog === "settings"} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
//         <DialogTitle>General Settings</DialogTitle>
//         <DialogContent>
//           <Typography sx={{ mb: 3 }}>
//             Update your account details:
//           </Typography>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//             <TextField label="Business Name" fullWidth />
//             <TextField label="Email Address" fullWidth />
//             <TextField label="Phone Number" fullWidth />
//             <TextField label="Address" fullWidth multiline rows={3} />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
//           <Button variant="contained" onClick={() => {
//             setSnack({ open: true, severity: "success", message: "Settings updated" });
//             setOpenDialog(null);
//           }}>
//             Save Changes
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openDialog === "connect"} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
//         <DialogTitle>Connect a Store</DialogTitle>
//         <DialogContent>
//           <Typography sx={{ mb: 1 }}>Choose a platform to connect:</Typography>
//           <List>
//             <ListItem><ListItemText primary="Shopify" secondary="Sync products & orders" /></ListItem>
//             <ListItem><ListItemText primary="Etsy" secondary="Connect Etsy store" /></ListItem>
//             <ListItem><ListItemText primary="WooCommerce" secondary="Connect Woo site" /></ListItem>
//           </List>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
//           <Button variant="contained" onClick={() => { setOpenDialog(null); setSnack({ open: true, severity: "success", message: "Store connected (simulated)." }); }}>Connect</Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openDialog === "orders"} onClose={() => setOpenDialog(null)} maxWidth="md" fullWidth>
//         <DialogTitle>Orders</DialogTitle>
//         <DialogContent>
//           <Typography>Open the Orders page to see full details of orders received.</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(null)}>Close</Button>
//           <Button variant="contained" onClick={() => setOpenDialog(null)}>Open Orders</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snack.open}
//         autoHideDuration={3500}
//         onClose={() => setSnack({ ...snack, open: false })}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert severity={snack.severity} sx={{ width: "100%" }}>{snack.message}</Alert>
//       </Snackbar>
//     </Container>
//   );
// }



import React from 'react'
import Header from '../components/Dashboard/Header'
import OnboardingCard from '../components/Dashboard/OnboardingCard'
import OrdersChart from '../components/Dashboard/OrdersChart'
import RecentOrders from '../components/Dashboard/RecentOrders'
import PaymentAlert from '../components/Dashboard/PaymentAlert'
import StatsCard from '../components/Dashboard/StatsCard'
import QuickActions from '../components/Dashboard/QuickActions'

function UserDashboard() {
  return (
    <>
      <OnboardingCard />
      {/* <StatsCard /> */}
      <OrdersChart />
      <RecentOrders />
      <PaymentAlert />
      <QuickActions />

    </>
  )
}

export default UserDashboard