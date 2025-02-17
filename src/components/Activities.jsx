import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import Categories from "../Routes/Categories";

const Activities = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown">
      <button
        onClick={toggleDropdown}
        className="dropdown-button"
      >
        Actividades
        <FontAwesomeIcon 
          icon={faAngleDown} 
          className={`dropdown-arrow ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <Categories />
        </div>
      )}
    </div>
  );
};

export default Activities;
