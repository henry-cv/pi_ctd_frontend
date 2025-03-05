import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendarDays,
  faTicket,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "../css/components/SearchBox.css";
import SelectCategoryBox from "./SelectCategoryBox";

const SearchBox = () => {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="search-box-container">
      <div className="search-box-wrapper">
        <div className="search-fields">
          {/* Campo de Destino */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faLocationDot} />
              <div className="title-input-search">
                <span>Destino</span>
                <input type="text" placeholder="Buscar por lugar" />
              </div>
            </div>
          </div>

          {/* Campo de Categoría */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faTicket} rotation={90} />
              <div className="title-input-search">
                <span>Categoría</span>
                <SelectCategoryBox />
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
        <button className="search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
