import "../css/pages/dashboard.css";
import "../css/components/DashPolicies.css"
import Article from "./Article.jsx";
import { articles } from "../constants/data/policiesInfo.js";
import { useRef, useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa';
import PropTypes from "prop-types";


const DashPolicies = ({ selectedPolicy, setSelectedPolicy }) => {

  const article = articles?.[selectedPolicy] || null;
  console.log("articulo", article);
  // Operador existencia opcional y de coalescencia
  const [searchQuery, setSearchQuery] = useState("");
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
      {selectedPolicy && article &&
        <Article title={article?.title} content={article?.content} width={840} setSelectedPolicy={setSelectedPolicy}>

          {Object.keys(article).map((key) => {
            if (key.startsWith('link')) {
              return (
                <div className="anchor" key={key}>
                  <p onClick={() => setSelectedPolicy(article[key].title)}>
                    {article[key].title}
                  </p>
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