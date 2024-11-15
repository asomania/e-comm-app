import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Button,
  Rating,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { getProductById } from "../api/products";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  images: string[];
  availabilityStatus: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        const data = await response;
        setProduct(data);
      } catch (error) {
        console.error("Ürün yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Typography variant="h5" color="error" align="center">
          Ürün bulunamadı!
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.title || "Ürün Detayı"}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <Box mt={4} mb={4}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Grid container>
            {/* Sol Tarafta Büyük Resim */}
            <Grid size={{ xs: 12, md: 7 }}>
              <img
                src={product.images[0]}
                alt={product.title}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  objectFit: "contain",
                  maxHeight: "600px",
                }}
              />
            </Grid>

            {/* Sağ Tarafta Ürün Bilgileri */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.title}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Marka: {product.brand}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Box mt={2} mb={2}>
                <Typography
                  variant="h5"
                  color="primary"
                  style={{ fontWeight: "bold" }}
                >
                  Fiyat: {product.price} TL
                </Typography>
                <Typography
                  variant="body2"
                  color={product.stock > 0 ? "green" : "red"}
                >
                  Stok Durumu: {product.availabilityStatus}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Rating value={product.rating} readOnly />
                <Typography variant="body2" ml={1}>
                  {product.rating} / 5
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={product.stock <= 0}
              >
                Satın Al
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default ProductDetails;
