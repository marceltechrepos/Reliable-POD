import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItemButton, Typography } from "@mui/material";

const PLATFORMS = ["Shopify", "Etsy", "WooCommerce", "Anywhere POD", "Manual Order"];

export default function CreateStoreModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select Store Platform</DialogTitle>
      <DialogContent dividers>
        <List>
          {PLATFORMS.map((p) => (
            <ListItemButton
              key={p}
              sx={{ borderRadius: 1, mb: 1, border: "1px solid #e6e9f0" }}
              onClick={() => alert(`Create flow for ${p}`)}
            >
              <Typography>{p}</Typography>
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
