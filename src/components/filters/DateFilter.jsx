import React from 'react';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";

const DateFilter = ({ selectedDate, setSelectedDate }) => {
  return (
    <div className="filter-section">
      <h4>Fecha</h4>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Seleccionar fecha"
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          renderInput={(params) => (
            <TextField {...params} size="small" fullWidth />
          )}
          className="date-picker"
        />
      </LocalizationProvider>
    </div>
  );
};

export default DateFilter;