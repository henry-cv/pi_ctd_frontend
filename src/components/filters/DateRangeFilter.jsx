import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

const DateRangeFilter = ({ dateRange, setDateRange }) => {
  const [startDate, endDate] = dateRange;

  const handleStartDateChange = (newStartDate) => {
    console.log("Nueva fecha inicio:", newStartDate);
    // Si la fecha de inicio es posterior a la fecha de fin, actualizamos también la fecha de fin
    if (endDate && newStartDate && dayjs(newStartDate).isAfter(endDate)) {
      setDateRange([newStartDate, newStartDate]);
    } else {
      setDateRange([newStartDate, endDate]);
    }
  };

  const handleEndDateChange = (newEndDate) => {
    console.log("Nueva fecha fin:", newEndDate);
    // Si la fecha de fin es anterior a la fecha de inicio, actualizamos también la fecha de inicio
    if (startDate && newEndDate && dayjs(newEndDate).isBefore(startDate)) {
      setDateRange([newEndDate, newEndDate]);
    } else {
      setDateRange([startDate, newEndDate]);
    }
  };

  return (
    <div className="filter-section">
      <h4>Fechas</h4>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>Desde</Typography>
            <DatePicker
              value={startDate}
              onChange={handleStartDateChange}
              disablePast
              slotProps={{ 
                textField: { 
                  size: 'small',
                  fullWidth: true,
                  placeholder: 'Fecha inicio'
                } 
              }}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>Hasta</Typography>
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              disablePast
              slotProps={{ 
                textField: { 
                  size: 'small', 
                  fullWidth: true,
                  placeholder: 'Fecha fin'
                } 
              }}
            />
          </Box>
        </Box>
      </LocalizationProvider>
    </div>
  );
};

export default DateRangeFilter;