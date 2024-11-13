import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import { Link } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    min_price: 10,
    max_price: 100,
    category: "",
    start_date: null,
    end_date: null,
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      const { min_price, max_price, category, start_date, end_date } = filters;

      const response = await fetch(
        `http://127.0.0.1:8001/api/products?min_price=${min_price}&max_price=${max_price}&category=${category}&start_date=${start_date}&end_date=${end_date}&page=${page}`
      );
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        if (data.data.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...data.data]);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setProducts([]);
  }, [filters]);

  useEffect(() => {
    if (hasMore) {
      fetchProducts(page);
    }
  }, [page, filters]);

  useEffect(() => {
    const onScroll = () => {
      const bottom =
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight;
      if (bottom && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [loading, hasMore]);

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string) => (newValue: Date | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: newValue,
    }));
  };

  if (loading && page === 1) {
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Ürün Listesi
        </Typography>

        <Box mb={4}>
          <Box display="flex" flexWrap="wrap" gap={3}>
            <Box flex={1} minWidth={250}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Kategori</InputLabel>
                <Select
                  labelId="category-label"
                  value={filters.category}
                  onChange={handleFilterChange}
                  name="category"
                >
                  <MenuItem value="electronics">Elektronik</MenuItem>
                  <MenuItem value="fashion">Moda</MenuItem>
                  <MenuItem value="home">Ev & Yaşam</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box flex={1} minWidth={250}>
              <TextField
                fullWidth
                label="Minimum Fiyat"
                type="number"
                name="min_price"
                value={filters.min_price}
                onChange={(event) => {
                  const value = event.target.value
                    ? Number(event.target.value)
                    : 0;
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    min_price: value,
                  }));
                }}
              />
            </Box>

            <Box flex={1} minWidth={250}>
              <TextField
                fullWidth
                label="Maksimum Fiyat"
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={(event) => {
                  const value = event.target.value
                    ? Number(event.target.value)
                    : 0;
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    max_price: value,
                  }));
                }}
              />
            </Box>

            <Box flex={1} minWidth={250}>
              <DesktopDatePicker
                label="Başlangıç Tarihi"
                value={filters.start_date}
                onChange={handleDateChange("start_date")}
                slots={{
                  textField: TextField,
                }}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                  },
                }}
              />
            </Box>

            <Box flex={1} minWidth={250}>
              <DesktopDatePicker
                label="Bitiş Tarihi"
                value={filters.end_date}
                onChange={handleDateChange("end_date")}
                slots={{
                  textField: TextField,
                }}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                  },
                }}
              />
            </Box>
          </Box>
          <Divider style={{ margin: "20px 0" }} />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setPage(1)}
          >
            Filtreleri Uygula
          </Button>
        </Box>

        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          {products.map((product) => (
            <Box
              key={product.id}
              flex={1}
              minWidth={300}
              maxWidth={300}
              minHeight={200}
              marginBottom={4}
            >
              <Card>
                <CardMedia
                  component="img"
                  image={product.thumbnail}
                  alt={product.title}
                />
                <CardContent>
                  <Typography variant="h6">{product.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.price} TL
                  </Typography>
                </CardContent>
                <Button
                  component={Link}
                  to={`/product/${product.id}`}
                  variant="contained"
                  color="primary"
                  style={{ margin: "16px" }}
                >
                  Detayları Gör
                </Button>
              </Card>
            </Box>
          ))}
        </Box>

        {loading && page > 1 && (
          <Container
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px",
            }}
          >
            <CircularProgress />
          </Container>
        )}

        {!hasMore && (
          <Typography align="center" variant="body2">
            Daha fazla ürün yok.
          </Typography>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default HomePage;
