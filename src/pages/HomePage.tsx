import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { typeofFilters } from "../types/filter";
import Filters from "../components/Filters";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { getProducts } from "../api/products";
import IconButton from "@mui/material/IconButton";
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
}

function debounce<T extends (...args: string[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => func(...args), delay);
  };
}

const HomePage: React.FC = () => {
  const filters = useSelector((state: typeofFilters) => state.filters);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      const response = await getProducts(filters, page, title);

      const data = await response.data;
      if (data.length === 0) {
        setHasMore(false);
        setProducts([]);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data.data]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSetTitle = useCallback(
    debounce((value: string) => {
      setTitle(value);
      setPage(1);
      setProducts([]);
    }, 500),
    []
  );
  const filterClick: () => void = () => {
    setPage(1);
    setProducts([]);
    fetchProducts(1);
  };

  useEffect(() => {
    const onScroll = () => {
      const bottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1;
      if (bottom && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchData = async () => {
      if (hasMore) {
        await fetchProducts(page);
      }
    };
    fetchData();
  }, [page]);
  useEffect(() => {
    const fetchData = async () => {
      if (title) {
        await fetchProducts(page);
      }
    };
    fetchData();
  }, [title]);
  return (
    <>
      <Container>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search"
          inputProps={{ "aria-label": "search" }}
          onChange={(event) => {
            debouncedSetTitle(event.target.value);
          }}
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <Typography variant="h4" component="h1" gutterBottom>
          Ürün Listesi
        </Typography>

        <Filters clickFilter={filterClick} />
        {products.length ? (
          <Box display="flex" flexWrap="wrap" gap={12} justifyContent="center">
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
        ) : (
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
        {loading && products.length ? (
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
        ) : (
          ""
        )}

        {!hasMore && (
          <Typography align="center" variant="body2">
            Daha fazla ürün yok.
          </Typography>
        )}
      </Container>
    </>
  );
};

export default HomePage;
