import api from "./index";

export const getProducts = async (filters?: {
  min_price?: number;
  max_price?: number;
  name?: string;
  category?: string;
}) => {
  try {
    const response = await api.get("/products", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};
