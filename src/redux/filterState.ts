import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    min_price: 0,
    max_price: 1000,
    category: "",
    start_date: null,
    end_date: null,
  },
  reducers: {
    setFilters: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setFilters } = filterSlice.actions;
export default filterSlice.reducer;
