import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const SearchFilter = ({ searchTerm, handleSearchChange, searchOptions }) => {
  return (
    <div className="filter-section">
      <h4>Búsqueda</h4>
      <Autocomplete
        freeSolo
        id="search-autocomplete"
        options={searchOptions}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.label
        }
        inputValue={searchTerm}
        onInputChange={handleSearchChange}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Buscar actividades"
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{ marginRight: 8, color: "#3E10DA" }}
                />
              ),
            }}
          />
        )}
        className="search-field"
        openOnFocus={true}
      />
    </div>
  );
};

export default SearchFilter;