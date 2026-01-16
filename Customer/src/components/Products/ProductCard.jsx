import { Card, CardMedia, CardContent, Typography, Checkbox, Stack, Chip } from "@mui/material";

export default function ProductCard({ product, selected, toggleSelect }) {
  return (
    <Card sx={{ width: 220, borderRadius: 2, p: 1 }}>
      <Stack direction="row" justifyContent="space-between">
        <Checkbox checked={selected} onChange={toggleSelect} />
        {product.discount && <Chip label="Discount" size="small" color="success" />}
      </Stack>
      <CardMedia component="img" height="120" image={product.image} />
      <CardContent>
        <Typography fontWeight={600}>{product.title}</Typography>
        <Typography color="primary">${product.price}</Typography>
      </CardContent>
    </Card>
  );
}
