import React from 'react';
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const PriceRangeFilter = ({ priceRange, setPriceRange }) => {
  return (
    <div className="filter-section">
      <h4>Precio</h4>
      <Box className="price-slider-container">
        <Slider
          value={priceRange}
          onChange={(event, newValue) => setPriceRange(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          step={100}
          color="primary"
        />
        <div className="price-range-labels">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </Box>
    </div>
  );
};

export default PriceRangeFilter;
