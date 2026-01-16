// components/StatusChip.jsx
import { Chip } from "@mui/material";

const statusColors = {
  Pending: "warning",
  "In production": "info",
  Held: "secondary",
  Completed: "success",
  Rejected: "error",
  Cancelled: "default",
};

export default function StatusChip({ status }) {
  return (
    <Chip
      label={status}
      color={statusColors[status] || "default"}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
}
