import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

/*
import { getProducts } from './api/products';

const fetchFilteredProducts = async () => {
  try {
    // Example filters
    const filters = {
      min_price: 10,
      max_price: 100,
      name: 'phone',
      category: 'electronics'
    };

    // Call the API with filters
    const products = await getProducts(filters);
    
    // Handle the response
    console.log('Filtered Products:', products);
  } catch (error) {
    console.error('Error fetching filtered products:', error);
  }
};

// Call the function to fetch products
fetchFilteredProducts();
*/

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
