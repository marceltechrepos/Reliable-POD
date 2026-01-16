// import React, { useState, useMemo } from "react";
// import { Box, Typography, Grid, Paper, Fade } from "@mui/material";
// import StoreFilters from "../components/Stores/StoreFilters";
// import StoreCard from "../components/Stores/StoreCard";
// import StoreListRow from "../components/Stores/StoreListRow";
// import CreateStoreModal from "../components/Stores/CreateStoreModal";
// import { STORES } from "../components/Stores/dummyStores";

// export default function Stores() {
//   const [search, setSearch] = useState("");
//   const [type, setType] = useState("All");
//   const [view, setView] = useState("card");
//   const [openModal, setOpenModal] = useState(false);

//   const filtered = useMemo(() => {
//     let arr = STORES;
//     if (search) arr = arr.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
//     if (type !== "All") arr = arr.filter(s => s.type === type);
//     return arr;
//   }, [search, type]);

//   return (
//     <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#F5F7FA" }}>
//       <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
//         Stores
//       </Typography>

//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           borderRadius: 3,
//           mb: 4,
//           bgcolor: "#fff",
//           border: "1px solid #E3E7EF",
//           boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
//         }}
//       >
//         <StoreFilters
//           search={search}
//           setSearch={setSearch}
//           type={type}
//           setType={setType}
//           view={view}
//           setView={setView}
//           onCreate={() => setOpenModal(true)}
//         />
//       </Paper>

//       {/* Content */}
//       {filtered.length === 0 && (
//         <Box sx={{ textAlign: "center", color: "gray", mt: 10, fontSize: 16 }}>
//           No stores found.
//         </Box>
//       )}

//       <Fade in>
//         <Box>
//           {view === "card" ? (
//             <Grid container spacing={3}>
//               {filtered.map(store => (
//                 <Grid item xs={12} sm={6} md={4} lg={3} key={store.id}>
//                   <Box sx={{ height: 260, display: "flex" }}>
//                     <StoreCard store={store} />
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//           ) : (
//             <Paper
//               elevation={0}
//               sx={{
//                 borderRadius: 2,
//                 border: "1px solid #E3E7EF",
//                 overflow: "hidden",
//                 bgcolor: "#fff",
//               }}
//             >
//               {filtered.map(store => (
//                 <StoreListRow key={store.id} store={store} />
//               ))}
//             </Paper>
//           )}
//         </Box>
//       </Fade>

//       <CreateStoreModal open={openModal} onClose={() => setOpenModal(false)} />
//     </Box>
//   );
// }


// ======

import React, { useState, useMemo } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Fade,
  Breadcrumbs,
  Link,
  Button,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StoreFilters from "../components/Stores/StoreFilters";
import StoreCard from "../components/Stores/StoreCard";
import StoreListRow from "../components/Stores/StoreListRow";
import CreateStoreModal from "../components/Stores/CreateStoreModal";
import { STORES } from "../components/Stores/dummyStores";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";

export default function Stores() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [view, setView] = useState("card");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    let arr = STORES;
    if (search) arr = arr.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    if (type !== "All") arr = arr.filter(s => s.type === type);
    return arr;
  }, [search, type]);

  const handleStoreClick = (store) => {
    navigate(`/user/stores/${store.id}`, { state: { store } });
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#F5F7FA" }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          href="/user/dashboard"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Dashboard
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <StoreIcon sx={{ mr: 0.5 }} fontSize="small" />
          Stores
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Stores Management
        </Typography>
        <Chip 
          label={`${filtered.length} stores`} 
          color="primary" 
          variant="outlined"
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 4,
          bgcolor: "#fff",
          border: "1px solid #E3E7EF",
          boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
        }}
      >
        <StoreFilters
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
          view={view}
          setView={setView}
          onCreate={() => setOpenModal(true)}
        />
      </Paper>

      {/* Content */}
      {filtered.length === 0 && (
        <Paper sx={{ 
          p: 8, 
          textAlign: "center", 
          borderRadius: 3,
          bgcolor: "#fff",
          border: "1px dashed #E3E7EF"
        }}>
          <StoreIcon sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No stores found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search or create a new store
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setOpenModal(true)}
            startIcon={<StoreIcon />}
          >
            Create Your First Store
          </Button>
        </Paper>
      )}

      <Fade in>
        <Box>
          {view === "card" ? (
            <Grid container spacing={3}>
              {filtered.map(store => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={store.id}>
                  <Box sx={{ height: 300, display: "flex" }}>
                    <StoreCard store={store} onClick={() => handleStoreClick(store)} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: "1px solid #E3E7EF",
                overflow: "hidden",
                bgcolor: "#fff",
              }}
            >
              {filtered.map(store => (
                <StoreListRow 
                  key={store.id} 
                  store={store} 
                  onClick={() => handleStoreClick(store)}
                />
              ))}
            </Paper>
          )}
        </Box>
      </Fade>

      <CreateStoreModal open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  );
}