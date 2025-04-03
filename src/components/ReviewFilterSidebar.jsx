import React from "react";
import { Rating, FormControlLabel, Checkbox, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ReviewFilterSidebar = ({ 
  isOpen, 
  onClose, 
  ratingFilters, 
  onRatingFilterChange,
  onApplyFilters,
  onResetFilters,
  isMobile
}) => {
  return (
    <div 
      className={`review-filter-sidebar ${isOpen ? "open" : ""} ${isMobile ? "mobile" : ""}`} 
      style={{ 
        borderRadius: '0',
        backgroundColor: 'var(--Background-components)',
        minHeight: '450px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="filter-sidebar-header">
        <h3>Filtros</h3>
        <button className="close-button" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      
      <div className="filter-section" style={{ flex: 1 }}>
        <h4>Calificación</h4>
        <div className="rating-filters">
          <FormControlLabel
            control={
              <Checkbox
                checked={ratingFilters.five}
                onChange={() => onRatingFilterChange("five")}
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
                onChange={() => onRatingFilterChange("four")}
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
                onChange={() => onRatingFilterChange("three")}
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
          <FormControlLabel
            control={
              <Checkbox
                checked={ratingFilters.two}
                onChange={() => onRatingFilterChange("two")}
                name="two-stars"
                color="primary"
              />
            }
            label={
              <div className="rating-label">
                <Rating value={2} readOnly size="small" />
              </div>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={ratingFilters.one}
                onChange={() => onRatingFilterChange("one")}
                name="one-star"
                color="primary"
              />
            }
            label={
              <div className="rating-label">
                <Rating value={1} readOnly size="small" />
              </div>
            }
          />
        </div>
      </div>
      
      <div className="filter-actions" style={{ marginTop: 'auto' }}>
        <Button 
          variant="outlined" 
          onClick={onResetFilters}
          sx={{ borderRadius: "30px", textTransform: "none" }}
        >
          Limpiar
        </Button>
        <Button 
          variant="contained" 
          onClick={onApplyFilters}
          sx={{ 
            borderRadius: "30px", 
            textTransform: "none", 
            backgroundColor: "#6749D9",
            "&:hover": {
              backgroundColor: "#5438C0"
            }
          }}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
};

export default ReviewFilterSidebar;