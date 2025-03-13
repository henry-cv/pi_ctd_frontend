import "../css/pages/dashboard.css";
import "../css/components/DashPolicies.css"
import Article from "./Article.jsx";
import { articles } from "../constants/data/policiesInfo.js";
import { useRef, useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa';
import PropTypes from "prop-types";


const DashPolicies = ({ selectedPolicy }) => {

  const payments = articles?.[selectedPolicy] ?? null;
  // Operador existencia opcional y de coalescencia
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticleTitle, setSelectedArticleTitle] = useState(null);
  const searchRef = useRef(null);
  const handleSearch = (term) => {
    console.log(`Se envió a buscar: ${term}`);
  }


  //UseEffect para controlar el estado que guarda el criterio de búsqueda
  useEffect(() => {
    const inputSearch = searchRef.current;
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        // Aquí puedes agregar la lógica para buscar cuando se presiona la tecla Enter
        console.log('Se presionó la tecla Enter');
        handleSearch(searchQuery);
      }
    };
    if (!inputSearch) return;

    inputSearch.addEventListener('keypress', handleKeyPress);

    return () => {
      inputSearch.removeEventListener('keypress', handleKeyPress);
    };
  }, [searchQuery]);

  return (
    <div className="policies-container">
      <div className="search-container">
        <FaSearch />
        <input
          className="input-search"
          type="search"
          placeholder="Ingrese política a buscar y presione Enter"
          value={searchQuery}
          ref={searchRef}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {selectedPolicy &&
        <Article title={payments.title} content={payments.content} width="840">

          {Object.keys(payments).map((key) => {
            if (key.startsWith('link')) {
              return (
                <div className="anchor" key={key}>
                  <a href="http://">{payments[key].title}</a>
                </div>
              );
            }
            return null;
          })}
        </Article >
      }
    </div >
  )
}
DashPolicies.propTypes = {
  selectedPolicy: PropTypes.string.isRequired,
  setSelectedPolicy: PropTypes.func
}

export default DashPolicies