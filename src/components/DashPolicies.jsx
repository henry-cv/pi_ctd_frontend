import "../css/pages/dashboard.css";
import "../css/components/DashPolicies.css"
//import DashSearch from "./DashSearch";
import Article from "./Article.jsx";
import { articles } from "../constants/data/policiesInfo.js";
import { useRef, useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa';


const DashPolicies = () => {

  const payments = articles.pagos;
  const handleSearch = (term) => {
    console.log(`Se envió a buscar: ${term}`);
  }
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const inputSearch = searchRef.current;
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        // Aquí puedes agregar la lógica para buscar cuando se presiona la tecla Enter
        console.log('Se presionó la tecla Enter');
        handleSearch(searchQuery);
      }
    };

    searchRef.current.addEventListener('keypress', handleKeyPress);

    return () => {
      inputSearch.removeEventListener('keypress', handleKeyPress);
    };
  }, [searchQuery]);
  return (
    <div className="policies-container">
      {/* <header className="header_policies">
        <div className="policieRight activitieRight">
          <div className="searchFilter">
            <DashSearch onSearch={handleSearch} />
          </div>
        </div>
      </header> */}
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

      <Article title={payments.title} content={payments.content} width="840">
        <div className="anchor">
          <a href="http://">{payments.link1.title}</a>
        </div>
        <a href="http://">{payments.link2.title}</a>
        <div className="anchor"></div>
      </Article >
    </div >
  )
}

export default DashPolicies