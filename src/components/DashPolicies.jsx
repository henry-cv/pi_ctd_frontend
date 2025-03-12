import "../css/pages/dashboard.css";

import DashSearch from "./DashSearch";
import { LuListFilter } from "react-icons/lu";
import Article from "./Article.jsx";
import { articles } from "../constants/data/policiesInfo.js";
const DashPolicies = () => {

  const payments = articles.pagos;
  const handleSearch = (term) => {
    console.log(term);
  }
  return (
    <div className="policies-container">
      <header className="header_policies">
        <h2 className="dark_activities">
          Políticas de uso
        </h2>
        <div className="policieRight activitieRight">
          <div className="searchFilter">
            <DashSearch onSearch={handleSearch} />
            <button className="btnIconFilter">
              <LuListFilter size={"2rem"} />
            </button>
          </div>
        </div>
      </header>
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