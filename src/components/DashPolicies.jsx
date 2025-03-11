import { useState } from "react";
import DashSearch from "./DashSearch";
import { LuListFilter } from "react-icons/lu";
const DashPolicies = () => {
  const [policies, setPolicies] = useState([])
  return (
    <div className="policies-container">
      <header className="header_policies">
        <h2 className="dark_activities">
          Politicas
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
    </div>
  )
}

export default DashPolicies