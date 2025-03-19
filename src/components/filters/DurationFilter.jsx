import React from 'react';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const DurationFilter = ({ durationFilters, handleDurationFilterChange }) => {
  return (
    <div className="filter-section">
      <h4>Duración</h4>
      <div className="duration-filters">
        <FormControlLabel
          control={
            <Checkbox
              checked={durationFilters.upToOneHour}
              onChange={() =>
                handleDurationFilterChange("upToOneHour")
              }
              name="up-to-one-hour"
              color="primary"
            />
          }
          label="Hasta 1 hora"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={durationFilters.oneToFourHours}
              onChange={() =>
                handleDurationFilterChange("oneToFourHours")
              }
              name="one-to-four-hours"
              color="primary"
            />
          }
          label="1 a 4 horas"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={durationFilters.fourHoursToOneDay}
              onChange={() =>
                handleDurationFilterChange("fourHoursToOneDay")
              }
              name="four-hours-to-one-day"
              color="primary"
            />
          }
          label="4 horas a 1 día"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={durationFilters.oneDayToThreeDays}
              onChange={() =>
                handleDurationFilterChange("oneDayToThreeDays")
              }
              name="one-day-to-three-days"
              color="primary"
            />
          }
          label="1 día a 3 días"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={durationFilters.moreThanThreeDays}
              onChange={() =>
                handleDurationFilterChange("moreThanThreeDays")
              }
              name="more-than-three-days"
              color="primary"
            />
          }
          label="+3 días"
        />
      </div>
    </div>
  );
};

export default DurationFilter;