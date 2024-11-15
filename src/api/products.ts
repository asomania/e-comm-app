import api from "./index";

interface ProductFilters {
  min_price?: number;
  max_price?: number;
  category?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  name?: string;
}

export const getProducts = async (
  filters: ProductFilters = {},
  page: number,
  name: string
) => {
  try {
    const { min_price, max_price, category, start_date, end_date } = filters;

    const queryParams = new URLSearchParams();
    if (min_price !== undefined)
      queryParams.append("min_price", min_price.toString());
    if (max_price !== undefined)
      queryParams.append("max_price", max_price.toString());
    if (category) queryParams.append("category", category);
    if (start_date !== undefined) queryParams.append("start_date", start_date);
    if (end_date !== undefined) queryParams.append("end_date", end_date);
    if (page !== undefined) queryParams.append("page", page.toString());
    if (name !== undefined) queryParams.append("name", name);

    const response = await api.get(`/products?${queryParams}`);
    if (!response) {
      throw new Error(`HTTP error! Status: ${response}`);
    }

    const data = await response;
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id: string | undefined) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};
