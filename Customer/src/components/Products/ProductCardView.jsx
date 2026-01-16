import React from "react";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";

const ProductCardView = ({ data }) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {data.map((item) => (
        <Grid item key={item.id}>
          <Card sx={{ width: 200, boxShadow: 3, borderRadius: 2, cursor: "pointer" }}>
            <CardMedia component="img" height="140" image={item.image} />
            <CardContent>
              <Typography fontWeight={600}>{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">${item.price}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductCardView;
