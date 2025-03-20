import React from 'react';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Rating from "@mui/material/Rating";

const RatingFilter = ({ ratingFilters, handleRatingFilterChange }) => {
  return (
    <div className="filter-section">
      <h4>Calificación</h4>
      <div className="rating-filters">
        <FormControlLabel
          control={
            <Checkbox
              checked={ratingFilters.five}
              onChange={() => handleRatingFilterChange("five")}
              name="five-stars"
              color="primary"
            />
          }
          label={
            <div className="rating-label">
              <Rating value={5} readOnly size="small" />
            </div>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={ratingFilters.four}
              onChange={() => handleRatingFilterChange("four")}
              name="four-stars"
              color="primary"
            />
          }
          label={
            <div className="rating-label">
              <Rating value={4} readOnly size="small" />
            </div>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={ratingFilters.three}
              onChange={() => handleRatingFilterChange("three")}
              name="three-stars"
              color="primary"
            />
          }
          label={
            <div className="rating-label">
              <Rating value={3} readOnly size="small" />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default RatingFilter;