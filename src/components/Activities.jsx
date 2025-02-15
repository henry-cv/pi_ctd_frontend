import { useState } from "react";
import Categories from "../Routes/Categories"; // Asegúrate de que la ruta sea correcta

const Activities = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown">
      <button
        onClick={toggleDropdown}
        className="dropdown-button button-transparent"
      >
        Actividades <span className="dropdown-arrow">&#9662;</span>
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
