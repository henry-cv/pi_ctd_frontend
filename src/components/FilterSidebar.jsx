import React from 'react';
import SearchFilter from './filters/SearchFilter';
import DateRangeFilter from './filters/DateRangeFilter';
import CategoryFilter from './filters/CategoryFilter';
import PriceRangeFilter from './filters/PriceRangeFilter';
import RatingFilter from './filters/RatingFilter';
import DurationFilter from './filters/DurationFilter';
import LanguageFilter from './filters/LanguageFilter';

const FilterSidebar = ({
  searchTerm,
  handleSearchChange,
  searchOptions,
  dateRange,
  setDateRange,
  categories,
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  ratingFilters,
  handleRatingFilterChange,
  durationFilters,
  handleDurationFilterChange,
  languageFilters,
  handleLanguageFilterChange,
  handleResetFilters
}) => {
  return (
    <div className="filter-sidebar">
      <div className="filter-header-section">
        <h3>Filtrar por</h3>
        <button
          className="reset-filters-btn"
          onClick={handleResetFilters}
        >
          Limpiar
        </button>
      </div>

      <SearchFilter 
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        searchOptions={searchOptions}
      />

        <DateRangeFilter 
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <CategoryFilter 
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
      />

      <PriceRangeFilter 
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      <RatingFilter 
        ratingFilters={ratingFilters}
        handleRatingFilterChange={handleRatingFilterChange}
      />

      <DurationFilter 
        durationFilters={durationFilters}
        handleDurationFilterChange={handleDurationFilterChange}
      />

      <LanguageFilter 
        languageFilters={languageFilters}
        handleLanguageFilterChange={handleLanguageFilterChange}
      />
    </div>
  );
};

export default FilterSidebar;