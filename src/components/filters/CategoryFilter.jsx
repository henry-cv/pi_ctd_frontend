import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const CategoryFilter = ({ categories, selectedCategories, toggleCategory }) => {
  return (
    <div className="filter-section">
      <h4>Categorías</h4>
      <div className="category-bubbles">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-bubble ${
              selectedCategories.includes(category.nombre)
                ? "selected"
                : ""
            }`}
            onClick={() => toggleCategory(category.nombre)}
          >
            {category.nombre}
            {selectedCategories.includes(category.nombre) ? (
              <FontAwesomeIcon
                icon={faTimes}
                className="category-icon"
              />
            ) : (
              <FontAwesomeIcon
                icon={faPlus}
                className="category-icon"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;