import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../redux/actions";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const Filters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    dispatch(setFilters({ ...filters, [name]: value }));
  };

  const handleDateChange = (name: string) => (newValue: Date | null) => {
    dispatch(setFilters({ ...filters, [name]: newValue }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
        <Button variant="contained" color="primary" onClick={() => setPage(1)}>
          Filtreleri Uygula
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default Filters;
