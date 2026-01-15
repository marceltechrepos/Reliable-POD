import { Stack, TextField, MenuItem, IconButton, ToggleButton, ToggleButtonGroup, Checkbox } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";

export default function ProductFilters({
  search, setSearch,
  sort, setSort,
  filterName, setFilterName,
  discountOnly, setDiscountOnly,
  view, setView,
  productNames,
  productType, setProductType,
  selectAll, selectNone
}) {
  return (
    <Stack spacing={2} alignItems="center" mb={2}>
      {/* TOP FILTERS */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField label="Search Products..." size="small" value={search} onChange={(e) => setSearch(e.target.value)} />

        <TextField label="Filter Name" size="small" select value={filterName} onChange={(e) => setFilterName(e.target.value)} sx={{ minWidth: 150 }}>
          <MenuItem value="">All</MenuItem>
          {productNames.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
        </TextField>

        <TextField label="Sort" size="small" select value={sort} onChange={(e) => setSort(e.target.value)} sx={{ minWidth: 150 }}>
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="oldest">Oldest First</MenuItem>
        </TextField>

        <IconButton color={discountOnly ? "primary" : "default"} onClick={() => setDiscountOnly(!discountOnly)}>
          <LocalOfferIcon />
        </IconButton>

        <ToggleButtonGroup value={view} exclusive onChange={(e, v) => v && setView(v)}>
          <ToggleButton value="card"><ViewModuleIcon /></ToggleButton>
          <ToggleButton value="list"><ViewListIcon /></ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* BOTTOM FILTERS */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
        <TextField label="Filter by Type" size="small" value={productType} onChange={(e) => setProductType(e.target.value)} sx={{ minWidth: 150 }} />

        <Stack direction="row" alignItems="center" spacing={1}>
          <Checkbox onChange={selectAll} /> Select All
          <Checkbox onChange={selectNone} /> Select None
        </Stack>
      </Stack>
    </Stack>
  );
}
