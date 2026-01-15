import { Card, CardMedia, CardContent, Typography, Chip } from "@mui/material";

export default function CatalogueCard({ catalogue }) {
  // Randomize height for Pinterest style
  const height = 120 + Math.floor(Math.random() * 60); // 120 - 180px
  return (
    <Card sx={{ borderRadius: 2, p: 1, mb: 2 }}>
      <CardMedia
        component="img"
        height={height}
        image={catalogue.image}
        sx={{ borderRadius: 2 }}
      />
      <CardContent>
        <Typography fontWeight={600}>{catalogue.name}</Typography>
        {catalogue.discount && <Chip label="Discount" color="success" size="small" sx={{ mt: 1 }} />}
      </CardContent>
    </Card>
  );
}
