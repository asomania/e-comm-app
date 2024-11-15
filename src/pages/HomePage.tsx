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
      const { min_price, max_price, category, start_date, end_date } = filters;
      let formattedStartDate = start_date;
      let formattedEndDate = end_date;

      if (start_date && start_date !== null) {
        formattedStartDate = new Date(start_date).toISOString();
      }
      if (end_date && end_date !== null) {
        formattedEndDate = new Date(end_date).toISOString();
      }

      const response = await fetch(
        `http://127.0.0.1:8001/api/products?min_price=${min_price}&max_price=${max_price}&category=${category}&start_date=${formattedStartDate}&end_date=${formattedEndDate}&page=${page}&name=${title}`
      );
      const data = await response.json();

      if (data.data.length === 0) {
        setHasMore(false);
        console.log("sildi");
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
      console.log("sildi");
      setProducts([]);
    }, 500),
    []
  );
  /*  */

  const filterClick: () => void = () => {
    setPage(1);
    console.log("sildi");
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
          <Box display="flex" flexWrap="wrap" gap={12}>
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
