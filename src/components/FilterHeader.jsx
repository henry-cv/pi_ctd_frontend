import React from 'react';

const FilterHeader = ({ 
  filteredActivities, 
  selectedCategories, 
  removeCategory, 
  sortType, 
  setSortType 
}) => {
  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  return (
    <div className="filter-header">
      <h1 className="results-title">
        {filteredActivities.length} resultados de
        {selectedCategories.length > 0 ? (
          <div className="selected-categories">
            {selectedCategories.map((cat) => (
              <span key={cat} className="category-tag">
                {cat}{" "}
                <button onClick={() => removeCategory(cat)}>×</button>
              </span>
            ))}
          </div>
        ) : (
          " todas las categorías"
        )}
      </h1>
      <div className="sort-container">
        <select
          value={sortType}
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="relevance">Más relevantes</option>
          <option value="highPrice">Mayor precio</option>
          <option value="lowPrice">Menor precio</option>
        </select>
      </div>
    </div>
  );
};

export default FilterHeader;