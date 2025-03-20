// src/pages/FilterProducts.jsx
// Asegurar que el caché global está configurado
if (!window.apiCache) {
  window.apiCache = {
    categories: null,
    products: null,
    suggestions: {},
    lastApiCall: {},
    minCallInterval: 500,
    // Agregamos un conjunto para términos sin resultados, compartido entre hooks
    noResultsTerms: new Set()
  };
}
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../css/pages/FilterProducts.css";
import NavDash from "../components/NavDash";
import FilterHeader from "../components/FilterHeader";
import FilterSidebar from "../components/FilterSidebar";
import ProductsGrid from "../components/ProductsGrid";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useActivitiesData } from "../hooks/useActivitiesData";
import { useActivitiesFilter } from "../hooks/useActivitiesFilter";

const FilterProducts = () => {
  const [searchParams] = useSearchParams();
  const searchTermFromURL = searchParams.get("searchTerm") || "";
  const categoryParam = searchParams.get("categoria");
  const initialCategories = categoryParam ? categoryParam.split(",") : [];
  
  // MUI theme
  const theme = createTheme({
    palette: {
      primary: {
        main: "#3E10DA",
      },
      secondary: {
        main: "#EEC52D",
      },
    },
  });

  // Get data from custom hook
  const {
    activities,
    categories,
    searchOptions,
    loading: dataLoading,
    dataLoaded,
    fetchSearchSuggestions,
  } = useActivitiesData(searchTermFromURL);

  // Filter state management
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const [sortType, setSortType] = useState("relevance");
  const [searchTerm, setSearchTerm] = useState(searchTermFromURL);
  const [selectedDate, setSelectedDate] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [ratingFilters, setRatingFilters] = useState({
    five: false,
    four: false,
    three: false,
  });
  const [durationFilters, setDurationFilters] = useState({
    upToOneHour: false,
    oneToFourHours: false,
    fourHoursToOneDay: false,
    oneDayToThreeDays: false,
    moreThanThreeDays: false,
  });
  const [languageFilters, setLanguageFilters] = useState({
    spanish: false,
    english: false,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Use custom filter hook
  const {
    filteredActivities,
    totalPages,
    loading: filterLoading,
  } = useActivitiesFilter({
    activities,
    searchTerm,
    selectedCategories,
    selectedDate,
    priceRange,
    ratingFilters,
    durationFilters,
    languageFilters,
    sortType,
    itemsPerPage,
    dataLoaded,
  });

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle search change with debouncing
  const handleSearchChange = (event, newValue) => {
    if (searchTerm === newValue) return;
    setSearchTerm(newValue);
    
    if (newValue && newValue.trim().length >= 2) {
      fetchSearchSuggestions(newValue);
    }
  };

  // Toggle category selection
  const toggleCategory = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  // Remove a single category
  const removeCategory = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.filter((cat) => cat !== categoryName)
    );
  };

  // Handle rating filter change
  const handleRatingFilterChange = (filterName) => {
    setRatingFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Handle duration filter change
  const handleDurationFilterChange = (filterName) => {
    setDurationFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Handle language filter change
  const handleLanguageFilterChange = (filterName) => {
    setLanguageFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDate(null);
    setPriceRange([0, 10000]);
    setRatingFilters({
      five: false,
      four: false,
      three: false,
    });
    setDurationFilters({
      upToOneHour: false,
      oneToFourHours: false,
      fourHoursToOneDay: false,
      oneDayToThreeDays: false,
      moreThanThreeDays: false,
    });
    setLanguageFilters({
      spanish: false,
      english: false,
    });
    setSelectedCategories([]);
    setSortType("relevance");
    setCurrentPage(1);
  };

  // Calculate activities for current page
  const currentActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, selectedDate, priceRange, ratingFilters, durationFilters, languageFilters, sortType]);

  return (
    <ThemeProvider theme={theme}>
      <div className="filter-products-page">
        <header className="header-filter">
          <NavDash variant="standard" isLoggedIn={false} />
        </header>

        <div className="filter-container">
          <FilterHeader 
            filteredActivities={filteredActivities}
            selectedCategories={selectedCategories}
            removeCategory={removeCategory}
            sortType={sortType}
            setSortType={setSortType}
          />

          <div className="filter-content">
            <FilterSidebar
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              searchOptions={searchOptions}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              ratingFilters={ratingFilters}
              handleRatingFilterChange={handleRatingFilterChange}
              durationFilters={durationFilters}
              handleDurationFilterChange={handleDurationFilterChange}
              languageFilters={languageFilters}
              handleLanguageFilterChange={handleLanguageFilterChange}
              handleResetFilters={handleResetFilters}
            />

            <ProductsGrid
              loading={dataLoading || filterLoading}
              dataLoaded={dataLoaded}
              currentActivities={currentActivities}
              filteredActivities={filteredActivities}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default FilterProducts;