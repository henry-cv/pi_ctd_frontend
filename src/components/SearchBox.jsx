import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendarDays,
  faTicket,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "../css/components/SearchBox.css";
import SelectCategoryBox from "./SelectCategoryBox";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const SearchBox = () => {
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await fetch("/api/categoria/listar");
        if (!categoriesResponse.ok)
          throw new Error("Error al obtener categorías");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const activitiesResponse = await fetch("/api/producto/listar");
        if (!activitiesResponse.ok)
          throw new Error("Error al cargar actividades");
        const activitiesData = await activitiesResponse.json();

        const formattedOptions = activitiesData.map((activity) => ({
          label: activity.nombre,
          categorias: activity.categorias || [],
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleActivitySelect = (event, newValue) => {
    if (newValue && typeof newValue === "object") {
      setInputValue(newValue.label);

      setSelectedCategory(
        newValue.categorias.length > 0 ? newValue.categorias[0].nombre : ""
      );
    }
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (inputValue.trim() !== "") {
      searchParams.append("searchTerm", inputValue);
    }
    if (selectedCategory.trim() !== "") {
      searchParams.append("categoria", selectedCategory);
    }
    navigate(`/actividades?${searchParams.toString()}`);
  };

  return (
    <div className="search-box-container">
      <div className="search-box-wrapper">
        <div className="search-fields">
          {/* Campo de Destino con Autocomplete */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faLocationDot} />
              <div className="title-input-search">
                <span>Buscar actividades</span>
                <Autocomplete
                  freeSolo
                  options={options}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) =>
                    setInputValue(newInputValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Ej: Taller de fotografía"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{
                        ml: "-13px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { border: "none" },
                        },
                      }}
                      InputProps={{ ...params.InputProps, endAdornment: null }}
                    />
                  )}
                  onChange={handleActivitySelect}
                />
              </div>
            </div>
          </div>

          {/* Campo de Categoría */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faTicket} rotation={90} />
              <div className="title-input-search">
                <span>Categoría</span>
                <SelectCategoryBox
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>
            </div>
          </div>

          {/* Campo de Fecha */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faCalendarDays} />
              <div className="title-input-search">
                <span>Fecha</span>
                <input type="date" min={today} />
              </div>
            </div>
          </div>
        </div>
        <button
          className="search-button"
          onClick={() => handleSearch(inputValue)}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
