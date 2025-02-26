import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLocationDot, 
  faCalendarDays, 
  faTicket,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import '../css/components/SearchBox.css';

const SearchBox = () => {
  return (
    <div className="search-box-container">
      <div className="search-box-wrapper">
        <div className="search-fields">
          {/* Campo de Destino */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>Destino</span>
            </div>
          </div>

          {/* Campo de Categoría */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faTicket} rotation={90} />
              <span>Categoría</span>
            </div>
          </div>
          
          {/* Campo de Fecha */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faCalendarDays} />
              <span>Fecha</span>
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