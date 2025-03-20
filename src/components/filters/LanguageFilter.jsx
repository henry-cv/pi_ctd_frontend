import React from 'react';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const LanguageFilter = ({ languageFilters, handleLanguageFilterChange }) => {
  return (
    <div className="filter-section">
      <h4>Idioma</h4>
      <div className="language-filters">
        <FormControlLabel
          control={
            <Checkbox
              checked={languageFilters.spanish}
              onChange={() => handleLanguageFilterChange("spanish")}
              name="spanish"
              color="primary"
            />
          }
          label="Español"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={languageFilters.english}
              onChange={() => handleLanguageFilterChange("english")}
              name="english"
              color="primary"
            />
          }
          label="Inglés"
        />
      </div>
    </div>
  );
};

export default LanguageFilter;