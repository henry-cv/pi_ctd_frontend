import { useState } from 'react';
import { 
  MenuItem, 
  FormControl,
  Select,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLocationDot, faCalendarDays, faListUl } from '@fortawesome/free-solid-svg-icons';
import '../css/SearchBar.css';

const SearchBar = () => {
  const [destino, setDestino] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fecha, setFecha] = useState('');

  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper">
        <div className="search-inputs">
          <FormControl className="search-input">
            <div className="search-field">
              <div className="field-title">
                <FontAwesomeIcon icon={faLocationDot} className="input-icon" />
                <span>Destino</span>
              </div>
              <Select
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                displayEmpty
                className="select-custom"
                variant="outlined"
                disableUnderline
                MenuProps={{
                  PaperProps: {
                    sx: {
                      marginTop: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }
                  }
                }}
              >
                <MenuItem value="" disabled>
                  <span className="placeholder-text">Buscar por lugar</span>
                </MenuItem>
                <MenuItem value="montevideo">Montevideo</MenuItem>
                <MenuItem value="buenos-aires">Buenos Aires</MenuItem>
                <MenuItem value="santiago">Santiago</MenuItem>
              </Select>
            </div>
          </FormControl>

          <div className="divider" />

          <FormControl className="search-input">
            <div className="search-field">
              <div className="field-title">
                <FontAwesomeIcon icon={faListUl} className="input-icon" />
                <span>Categoría</span>
              </div>
              <Select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                displayEmpty
                className="select-custom"
              >
                <MenuItem value="" disabled>
                  <span className="placeholder-text">Todos</span>
                </MenuItem>
                <MenuItem value="hoteles">Hoteles</MenuItem>
                <MenuItem value="restaurantes">Restaurantes</MenuItem>
                <MenuItem value="actividades">Actividades</MenuItem>
              </Select>
            </div>
          </FormControl>

          <div className="divider" />

          <FormControl className="search-input">
            <div className="search-field">
              <div className="field-title">
                <FontAwesomeIcon icon={faCalendarDays} className="input-icon" />
                <span>Fecha</span>
              </div>
              <Select
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                displayEmpty
                className="select-custom"
              >
                <MenuItem value="" disabled>
                  <span className="placeholder-text">Seleccionar fecha</span>
                </MenuItem>
                <MenuItem value="hoy">Hoy</MenuItem>
                <MenuItem value="mañana">Mañana</MenuItem>
                <MenuItem value="proxima-semana">Próxima semana</MenuItem>
              </Select>
            </div>
          </FormControl>
        </div>

        <div className="search-button">
          <button className="search-button-round">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;