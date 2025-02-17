import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLocationDot, 
  faCalendarDays, 
  faTicket,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import "react-datepicker/dist/react-datepicker.css";
import '../css/SearchBox.css';

// Configura el token de Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoicGVkcm9wdiIsImEiOiJjbTc2b2FqdHQwOXB6MmlweTNuaDRlemk1In0.YjdUDMdea-myXaqGBwh1Zg';

const SearchBox = () => {
  const [values, setValues] = useState({
    destino: null,
    categoria: '',
    fecha: null
  });
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Definir las categorías
  const categorias = [
    { value: 'hoteles', label: 'Hoteles' },
    { value: 'restaurantes', label: 'Restaurantes' },
    { value: 'actividades', label: 'Actividades' }
  ];

  const searchPlaces = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&types=place&language=es`
      );
      
      const data = await response.json();
      console.log('Mapbox response:', data);
      
      if (data.features) {
        setSuggestions(data.features.map(place => ({
          value: place.id,
          label: place.place_name,
          coordinates: place.center
        })));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchPlaces(searchQuery);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleDestinationInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      setSearchQuery(inputValue);
    }
    return inputValue;
  };

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="search-box-container">
      <div className="search-box-wrapper">
        <div className="search-fields">
          {/* Campo de Destino con Mapbox */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>Destino</span>
            </div>
            <Select
              value={values.destino}
              onChange={(value) => handleChange('destino', value)}
              onInputChange={handleDestinationInputChange}
              options={suggestions}
              placeholder="¿A dónde vamos?"
              className="react-select-container"
              classNamePrefix="react-select"
              isSearchable={true}
              noOptionsMessage={() => "Escribe para buscar lugares"}
              loadingMessage={() => "Buscando..."}
              isClearable={true}
              backspaceRemovesValue={true}
            />
          </div>

          <div className="divider" />

          {/* Campo de Categoría */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faTicket} rotation={90} />
              <span>Categoría</span>
            </div>
            <Select
              value={values.categoria}
              onChange={(value) => handleChange('categoria', value)}
              options={categorias}
              placeholder="Seleccionar categoría"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="divider" />
          
          {/* Campo de Fecha */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faCalendarDays} />
              <span>Fecha</span>
            </div>
            <div className="datepicker-container">
              <DatePicker
                selected={values.fecha}
                onChange={(date) => handleChange('fecha', date)}
                className="react-datepicker-input"
                placeholderText="Seleccionar fecha"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        </div>
        <button className="search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;