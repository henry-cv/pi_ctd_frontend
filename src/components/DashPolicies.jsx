import "../css/pages/dashboard.css";
import "../css/components/DashPolicies.css"
import Article from "./Article.jsx";
import { articles } from "../constants/data/policiesInfo.js";
import { useRef, useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa';
import PropTypes from "prop-types";


const DashPolicies = ({ selectedPolicy, setSelectedPolicy }) => {

  const payments = selectedPolicy ? articles[selectedPolicy] : null;
  const handleSearch = (term) => {
    console.log(`Se envió a buscar: ${term}`);
  }
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");



  //UseEffect para controlar el estado que guarda el criterio de búsqueda
  useEffect(() => {
    const inputSearch = searchRef.current;
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        // Aquí puedes agregar la lógica para buscar cuando se presiona la tecla Enter
        console.log('Se presionó la tecla Enter');
        setSearchTerm(searchQuery);
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
          <div className="anchor">
            <a href="http://">{payments.link1.title}</a>
          </div>
          <a href="http://">{payments.link2.title}</a>
          <div className="anchor"></div>
        </Article >
      }
    </div >
  )
}
DashPolicies.propTypes = {
  selectedPolicy: PropTypes.string,
  setSelectedPolicy: PropTypes.func
}

export default DashPolicies