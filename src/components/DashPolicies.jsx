import "../css/pages/dashboard.css";
import "../css/components/DashPolicies.css"
import Article from "./Article.jsx";
import { articles } from "../constants/data/policiesInfo.js";
import { useRef, useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa';
import PropTypes from "prop-types";
import { useParams, Link } from 'react-router-dom';
import { useContextGlobal } from "../gContext/globalContext";

const DashPolicies = ({ selectedPolicy, setSelectedPolicy }) => {
  // console.log("selectedPolicy: -->", selectedPolicy);

  const [articulo, setArticulo] = useState(null);
  // console.log("articulo: -->", articulo);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const { article, subarticle } = useParams();
  const { state } = useContextGlobal();
  const { theme } = state;


  const handleSearch = (term) => {
    console.log(`Se envió a buscar: ${term}`);
  }

  useEffect(() => {
    if (article && subarticle) {
      const policy = articles?.[article]?.[subarticle] || null;
      setArticulo(policy);
    } else if (article) {
      const policy = articles?.[article] || null;
      setArticulo(policy);
    } else {
      setArticulo(null);
    }
  }, [article, subarticle]);

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
    <div className={`policies-container ${theme}`}>
      <div className={`search-container ${theme}`}>
        <FaSearch />
        <input
          className={`input-search ${theme}`}
          type="search"
          placeholder="Ingrese política a buscar y presione Enter"
          value={searchQuery}
          ref={searchRef}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {articulo &&
        <Article title={articulo?.title || `Política de ${article}`} content={articulo?.content || articles[article]?.content} width={840}>
          {Object.keys(articulo || articles[article]).map((key) => {
            if (key.startsWith('link')) {
              return (
                <div className="anchor" key={key}>
                  <Link className={`${theme}`} to={`/politicasdeuso/${article}/${(articulo || articles[article])[key].value}`} onClick={() => setSelectedPolicy((articulo || articles[article])[key].value)}>
                    {(articulo || articles[article])[key].title}
                  </Link>
                </div>
              );
            }
            return null;
          })}
        </Article>
      }

    </div >
  )
}
DashPolicies.propTypes = {
  selectedPolicy: PropTypes.string.isRequired,
  setSelectedPolicy: PropTypes.func
}

export default DashPolicies
