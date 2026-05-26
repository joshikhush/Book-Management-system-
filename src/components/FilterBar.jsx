import React from "react";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import "../styles/FilterBar.css";

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy,
  onAddClick,
  genres = []
}) => {
  return (
    <div className="filter-bar-container animate-fade-in">
      {/* Row 1: Search Input, Sorting, Add Button */}
      <div className="controls-row">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sort-wrapper">
          <span className="sort-label">
            <SlidersHorizontal size={14} style={{ marginRight: "4px" }} />
            Sort By:
          </span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="year-desc">Newest First</option>
            <option value="year-asc">Oldest First</option>
            <option value="rating-desc">Highest Rated</option>
          </select>
        </div>

        <button className="btn-primary add-book-btn" onClick={onAddClick}>
          <Plus size={18} />
          Add Book
        </button>
      </div>

      {/* Row 2: Horizontal Genre Category Chips */}
      <div className="genre-row">
        <button
          className={`genre-chip ${selectedGenre === "All" ? "active" : ""}`}
          onClick={() => setSelectedGenre("All")}
        >
          All Genres
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            className={`genre-chip ${selectedGenre === genre ? "active" : ""}`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};
export default FilterBar;
