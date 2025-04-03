import React, { useState, useEffect } from "react";
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
  // Estado para seguir el modo oscuro
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  // Efecto para detectar cambios en el tema del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Colores con alto contraste para ambos modos - ahora con valores específicos
  const backgroundColor = isDarkMode ? 'var(--BackgroundColor)' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#101828';
  const starColor = '#6749D9'; // Color estándar para estrellas (igual que reviews)
  
  return (
    <div 
      className={`review-filter-sidebar ${isOpen ? "open" : ""} ${isMobile ? "mobile" : ""}`} 
      style={{ 
        borderRadius: '0',
        backgroundColor: backgroundColor + " !important", // Añadir !important para mayor especificidad
        minHeight: '450px',
        height: 'auto', 
        display: 'flex',
        flexDirection: 'column',
        color: textColor,
        borderRight: isDarkMode ? '1px solid #333' : '1px solid #E5E7EB'
      }}
    >
      <div className="filter-sidebar-header">
        <h3 style={{ color: textColor }}>Filtros</h3>
        <button className="close-button" onClick={onClose} style={{ color: textColor }}>
          <CloseIcon />
        </button>
      </div>
      
      <div className="filter-section" style={{ flex: 1 }}>
        <h4 style={{ color: textColor }}>Calificación</h4>
        <div className="rating-filters">
          {/* Aquí están los checkboxes con estrellas - ajustados cada uno */}
          <FormControlLabel
            control={
              <Checkbox
                checked={ratingFilters.five}
                onChange={() => onRatingFilterChange("five")}
                name="five-stars"
                sx={{
                  color: "#9E9E9E", // Checkbox gris
                  '&.Mui-checked': {
                    color: "#6749D9", // Cuando está marcado, morado
                  },
                  '& .MuiSvgIcon-root': { 
                    border: '1px solid #FFFFFF',
                    borderRadius: '3px'
                  }
                }}
              />
            }
            label={
              <div className="rating-label">
                <Rating 
                  value={5} 
                  readOnly 
                  size="small" 
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: starColor
                    },
                    "& .MuiRating-iconEmpty": {
                      color: starColor,
                      opacity: 0.4
                    }
                  }}
                />
              </div>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={ratingFilters.four}
                onChange={() => onRatingFilterChange("four")}
                name="four-stars"
                sx={{
                  color: "#9E9E9E", // Checkbox gris
                  '&.Mui-checked': {
                    color: "#6749D9", // Cuando está marcado, morado
                  },
                  '& .MuiSvgIcon-root': { 
                    border: '1px solid #FFFFFF',
                    borderRadius: '3px'
                  }
                }}
              />
            }
            label={
              <div className="rating-label">
                <Rating 
                  value={4} 
                  readOnly 
                  size="small" 
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: starColor
                    },
                    "& .MuiRating-iconEmpty": {
                      color: starColor,
                      opacity: 0.4
                    }
                  }}
                />
              </div>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={ratingFilters.three}
                onChange={() => onRatingFilterChange("three")}
                name="three-stars"
                sx={{
                  color: "#9E9E9E", // Checkbox gris
                  '&.Mui-checked': {
                    color: "#6749D9", // Cuando está marcado, morado
                  },
                  '& .MuiSvgIcon-root': { 
                    border: '1px solid #FFFFFF',
                    borderRadius: '3px'
                  }
                }}
              />
            }
            label={
              <div className="rating-label">
                <Rating 
                  value={3} 
                  readOnly 
                  size="small" 
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: starColor
                    },
                    "& .MuiRating-iconEmpty": {
                      color: starColor,
                      opacity: 0.4
                    }
                  }}
                />
              </div>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={ratingFilters.two}
                onChange={() => onRatingFilterChange("two")}
                name="two-stars"
                sx={{
                  color: "#9E9E9E", // Checkbox gris
                  '&.Mui-checked': {
                    color: "#6749D9", // Cuando está marcado, morado
                  },
                  '& .MuiSvgIcon-root': { 
                    border: '1px solid #FFFFFF',
                    borderRadius: '3px'
                  }
                }}
              />
            }
            label={
              <div className="rating-label">
                <Rating 
                  value={2} 
                  readOnly 
                  size="small" 
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: starColor
                    },
                    "& .MuiRating-iconEmpty": {
                      color: starColor,
                      opacity: 0.4
                    }
                  }}
                />
              </div>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={ratingFilters.one}
                onChange={() => onRatingFilterChange("one")}
                name="one-star"
                sx={{
                  color: "#9E9E9E", // Checkbox gris
                  '&.Mui-checked': {
                    color: "#6749D9", // Cuando está marcado, morado
                  },
                  '& .MuiSvgIcon-root': { 
                    border: '1px solid #FFFFFF',
                    borderRadius: '3px'
                  }
                }}
              />
            }
            label={
              <div className="rating-label">
                <Rating 
                  value={1} 
                  readOnly 
                  size="small" 
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: starColor
                    },
                    "& .MuiRating-iconEmpty": {
                      color: starColor,
                      opacity: 0.4
                    }
                  }}
                />
              </div>
            }
          />
        </div>
      </div>
      
      <div className="filter-actions" style={{ marginTop: 'auto', padding: '20px' }}>
        <Button 
          variant="outlined" 
          onClick={onResetFilters}
          sx={{ 
            borderRadius: "30px", 
            textTransform: "none",
            backgroundColor: "#FFFFFF", // Fondo blanco
            borderColor: "#000000", // Contorno negro  
            color: "#000000", // Texto negro
            "&:hover": {
              backgroundColor: "#F5F5F5",
              borderColor: "#000000",
              opacity: 0.9
            }
          }}
        >
          Limpiar
        </Button>
        <Button 
          variant="contained" 
          onClick={onApplyFilters}
          sx={{ 
            borderRadius: "30px", 
            textTransform: "none", 
            backgroundColor: "#EEC52D", // Amarillo
            color: "#000000", // Texto negro
            fontWeight: "700", // Negrita
            "&:hover": {
              backgroundColor: "#d9b429",
              opacity: 0.95
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