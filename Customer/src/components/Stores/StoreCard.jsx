// import { Card, CardContent, Box, Typography, Chip, Button } from "@mui/material";

// export default function StoreCard({ store }) {
//   return (
// <Card
//   elevation={0}
//   sx={{
//     borderRadius: 3,
//     p: 2,
//     border: "1px solid #E3E7EF",
//     background: "#fff",
//     cursor: "pointer",
//     transition: "0.25s",
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//     "&:hover": {
//       boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//       transform: "translateY(-2px)",
//     },
//   }}
// >
//   <CardContent sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
//     <Box>
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <Typography fontWeight={700} fontSize={16}>{store.name}</Typography>
//         <Chip label={store.type} size="small" sx={{ bgcolor: "#EEF2FF", color: "#4F46E5", fontWeight: 600 }} />
//       </Box>

//       <Typography fontSize={13} color="text.secondary" sx={{ mt: 0.5 }}>
//         Status: <span style={{ color: "#22C55E" }}>Connected</span>
//       </Typography>

//       <Box sx={{ mt: 1.5, fontSize: 13, color: "text.secondary" }}>
//         Products: {store.products || 0}<br />
//         Orders Synced: {store.orders || 0}<br />
//         Last Sync: {store.lastSync || "N/A"}
//       </Box>
//     </Box>

//     <Button variant="text" sx={{ mt: 2, fontSize: 13, fontWeight: 600, textTransform: "none" }}>
//       Manage Store →
//     </Button>
//   </CardContent>
// </Card>

//   );
// }

import { Card, CardContent, Box, Typography, Chip, Button, Avatar } from "@mui/material";
import {
  Store as StoreIcon,
  ShoppingBag,
  Receipt
} from "@mui/icons-material";

const getStoreIcon = (type) => {
  switch (type) {
    // case 'Shopify': return <Shopify />;
    case 'Etsy': return <span style={{ fontSize: '20px' }}>E</span>;
    case 'WooCommerce': return <span style={{ fontSize: '20px' }}>WC</span>;
    case 'Anywhere POD': return <ShoppingBag />;
    case 'Manual Order': return <Receipt />;
    default: return <StoreIcon />;
  }
};

const getStoreColor = (type) => {
  switch (type) {
    case 'Shopify': return { bg: '#96BF48', color: '#fff' };
    case 'Etsy': return { bg: '#F16521', color: '#fff' };
    case 'WooCommerce': return { bg: '#96588A', color: '#fff' };
    case 'Anywhere POD': return { bg: '#3B82F6', color: '#fff' };
    case 'Manual Order': return { bg: '#6B7280', color: '#fff' };
    default: return { bg: '#4F46E5', color: '#fff' };
  }
};

export default function StoreCard({ store, onClick }) {
  const iconColor = getStoreColor(store.type);

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        borderRadius: 3,
        p: 2,
        border: "1px solid #E3E7EF",
        background: "#fff",
        cursor: "pointer",
        transition: "0.25s",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
          borderColor: iconColor.bg,
        },
      }}
    >
      <CardContent sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: iconColor.bg,
                color: iconColor.color,
                width: 50,
                height: 50,
                fontSize: '1.5rem'
              }}
            >
              {getStoreIcon(store.type)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={700} fontSize={18}>{store.name}</Typography>
              <Chip
                label={store.type}
                size="small"
                sx={{
                  bgcolor: `${iconColor.bg}15`,
                  color: iconColor.bg,
                  fontWeight: 600,
                  mt: 0.5
                }}
              />
            </Box>
          </Box>

          <Typography component="div" fontSize={13} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#22C55E',
              mr: 1
            }} />
            Status: <span style={{ color: "#22C55E", marginLeft: 4 }}>Connected</span>
          </Typography>

          <Box sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: '#F8FAFC',
            border: '1px solid #F1F5F9'
          }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <Box>
                <Typography fontSize={11} color="text.secondary">Products</Typography>
                <Typography fontWeight={600}>{store.products || 0}</Typography>
              </Box>
              <Box>
                <Typography fontSize={11} color="text.secondary">Orders</Typography>
                <Typography fontWeight={600}>{store.orders || 0}</Typography>
              </Box>
              <Box>
                <Typography fontSize={11} color="text.secondary">Revenue</Typography>
                <Typography fontWeight={600}>${store.revenue || '0'}</Typography>
              </Box>
              <Box>
                <Typography fontSize={11} color="text.secondary">Last Sync</Typography>
                <Typography fontSize={12}>{store.lastSync || "N/A"}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Button
          variant="text"
          sx={{
            mt: 2,
            fontSize: 13,
            fontWeight: 600,
            textTransform: "none",
            color: iconColor.bg,
            alignSelf: 'flex-start',
            '&:hover': {
              bgcolor: `${iconColor.bg}10`
            }
          }}
        >
          Manage Store →
        </Button>
      </CardContent>
    </Card>
  );
}