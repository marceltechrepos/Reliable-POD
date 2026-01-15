// import { Box, Typography, Divider, Chip, Button } from "@mui/material";

// export default function StoreListRow({ store }) {
//   return (
//     <>
//       <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", p: 2, alignItems: "center" }}>
//         <Typography fontWeight={600}>{store.name}</Typography>

//         <Chip label={store.type} size="small" sx={{ bgcolor: "#EEF2FF", color: "#4F46E5" }} />

//         <Typography fontSize={13} color="green">Connected</Typography>
//         <Typography fontSize={13}>{store.products || 0}</Typography>
//         <Typography fontSize={13}>{store.orders || 0}</Typography>
//         <Button size="small">View</Button>
//       </Box>
//       <Divider />
//     </>
//   );
// }

import { Box, Typography, Divider, Chip, Button, Avatar } from "@mui/material";

const getStoreIcon = (type) => {
  switch (type) {
    case 'Shopify': return 'S';
    case 'Etsy': return 'E';
    case 'WooCommerce': return 'WC';
    case 'Anywhere POD': return 'POD';
    case 'Manual Order': return 'MO';
    default: return 'ST';
  }
};

const getStoreColor = (type) => {
  switch (type) {
    case 'Shopify': return '#96BF48';
    case 'Etsy': return '#F16521';
    case 'WooCommerce': return '#96588A';
    case 'Anywhere POD': return '#3B82F6';
    case 'Manual Order': return '#6B7280';
    default: return '#4F46E5';
  }
};

export default function StoreListRow({ store, onClick }) {
  const storeColor = getStoreColor(store.type);
  
  return (
    <>
      <Box 
        onClick={onClick}
        sx={{ 
          display: "grid", 
          gridTemplateColumns: "auto 2fr 1fr 1fr 1fr 1fr auto", 
          p: 2, 
          alignItems: "center",
          cursor: 'pointer',
          transition: '0.2s',
          '&:hover': {
            bgcolor: '#F8FAFC'
          }
        }}
      >
        {/* Logo */}
        <Avatar
          sx={{
            bgcolor: storeColor,
            color: '#fff',
            width: 36,
            height: 36,
            fontSize: '0.875rem',
            mr: 2
          }}
        >
          {getStoreIcon(store.type)}
        </Avatar>

        <Typography fontWeight={600}>{store.name}</Typography>

        <Chip 
          label={store.type} 
          size="small" 
          sx={{ 
            bgcolor: `${storeColor}15`, 
            color: storeColor,
            fontWeight: 500 
          }} 
        />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: '#22C55E', 
            mr: 1 
          }} />
          <Typography fontSize={13} color="text.secondary">Connected</Typography>
        </Box>
        
        <Typography fontSize={13} fontWeight={500}>{store.products || 0}</Typography>
        <Typography fontSize={13} fontWeight={500}>{store.orders || 0}</Typography>
        
        {/* Revenue and View button combined in last column */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography fontSize={13} fontWeight={500} color="#10B981">
            ${store.revenue || '0'}
          </Typography>
          <Button 
            size="small" 
            variant="outlined"
            sx={{ 
              borderRadius: 1.5,
              textTransform: 'none',
              minWidth: 'auto',
              px: 1.5
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            View
          </Button>
        </Box>
      </Box>
      <Divider />
    </>
  );
}


// import { Box, Typography, Divider, Chip, Button, Avatar } from "@mui/material";

// const getStoreIcon = (type) => {
//   switch (type) {
//     case 'Shopify': return 'S';
//     case 'Etsy': return 'E';
//     case 'WooCommerce': return 'WC';
//     case 'Anywhere POD': return 'POD';
//     case 'Manual Order': return 'MO';
//     default: return 'ST';
//   }
// };

// const getStoreColor = (type) => {
//   switch (type) {
//     case 'Shopify': return '#96BF48';
//     case 'Etsy': return '#F16521';
//     case 'WooCommerce': return '#96588A';
//     case 'Anywhere POD': return '#3B82F6';
//     case 'Manual Order': return '#6B7280';
//     default: return '#4F46E5';
//   }
// };

// export default function StoreListRow({ store, onClick }) {
//   const storeColor = getStoreColor(store.type);
  
//   return (
//     <>
//       <Box 
//         onClick={onClick}
//         sx={{ 
//           display: "grid", 
//           gridTemplateColumns: "auto 2fr 1fr 1fr 1fr 1fr auto", 
//           p: 2, 
//           alignItems: "center",
//           cursor: 'pointer',
//           transition: '0.2s',
//           '&:hover': {
//             bgcolor: '#F8FAFC'
//           }
//         }}
//       >
//         {/* Logo */}
//         <Avatar
//           sx={{
//             bgcolor: storeColor,
//             color: '#fff',
//             width: 36,
//             height: 36,
//             fontSize: '0.875rem',
//             mr: 2
//           }}
//         >
//           {getStoreIcon(store.type)}
//         </Avatar>

//         <Typography fontWeight={600}>{store.name}</Typography>

//         <Chip 
//           label={store.type} 
//           size="small" 
//           sx={{ 
//             bgcolor: `${storeColor}15`, 
//             color: storeColor,
//             fontWeight: 500 
//           }} 
//         />

//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Box sx={{ 
//             width: 8, 
//             height: 8, 
//             borderRadius: '50%', 
//             bgcolor: '#22C55E', 
//             mr: 1 
//           }} />
//           <Typography fontSize={13} color="text.secondary">Connected</Typography>
//         </Box>
        
//         <Typography fontSize={13} fontWeight={500}>{store.products || 0}</Typography>
//         <Typography fontSize={13} fontWeight={500}>{store.orders || 0}</Typography>
//         <Typography fontSize={13} fontWeight={500} color="#10B981">${store.revenue || '0'}</Typography>
        
//         <Button 
//           size="small" 
//           variant="outlined"
//           sx={{ 
//             borderRadius: 1.5,
//             textTransform: 'none'
//           }}
//         >
//           View
//         </Button>
//       </Box>
//       <Divider />
//     </>
//   );
// }