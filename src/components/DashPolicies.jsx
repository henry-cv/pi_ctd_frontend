import "../css/pages/dashboard.css";
import "../css/components/DashPolicies.css"
import Article from "./Article.jsx";
import { articles } from "../constants/data/policiesInfo.js";
import { useRef, useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa';
import PropTypes from "prop-types";


const DashPolicies = ({ selectedPolicy, setSelectedPolicy }) => {
  console.log("selectedPolicy: -->", selectedPolicy);
  const article = articles?.[selectedPolicy] || null;
  // Operador existencia opcional y de coalescencia
  //console.log("article: -->", article);
  const handleBackButton = (articleTitle) => {
    console.log("articleTitle: -->", articleTitle);
    switch (articleTitle) {
      case "pagoInmediato" | "reserveAhora":
        setArticulo(articles?.pagos);
        break;
      case "reembolso7dias" | "reembolso24horas" | "noReembolsable":
        setArticulo(articles?.cancelaciones);
        break;
      default:
        break;
    }
  }
  const [articulo, setArticulo] = useState(null);
  console.log("articulo: -->", articulo);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  const handleSearch = (term) => {
    console.log(`Se envió a buscar: ${term}`);
  }

  useEffect(() => {
    if (selectedPolicy) {
      const policy = articles?.[selectedPolicy] || null;
      setArticulo(policy);
      console.log("seteado articulo: ", articulo);
    } else {
      setArticulo(null);
      console.log("articulo en null: ", articulo);
    }
  }, [selectedPolicy]);

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
      {articulo &&
        <Article title={articulo?.title} content={articulo?.content} width={840}>

          {Object.keys(articulo).map((key) => {
            if (key.startsWith('link')) {
              return (
                <div className="anchor" key={key}>
                  <p onClick={() =>
                    setSelectedPolicy(articulo[key].value)
                  }>
                    {articulo[key].title}
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