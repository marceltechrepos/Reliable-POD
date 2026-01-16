import { Stack, TextField, IconButton } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export default function CatalogueFilters({ search, setSearch, discountOnly, setDiscountOnly }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3} alignItems="center" justifyContent="center">
      <TextField
        label="Search Catalogue..."
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <IconButton
        color={discountOnly ? "primary" : "default"}
        onClick={() => setDiscountOnly(!discountOnly)}
      >
        <LocalOfferIcon />
      </IconButton>
    </Stack>
  );
}
