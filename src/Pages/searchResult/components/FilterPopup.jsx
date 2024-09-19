import React, { useState } from "react";
import './FilterPopup.css'; // Add your CSS here for styling

const FilterPopup = ({ closePopup }) => {
  const [showTextAvailability, setShowTextAvailability] = useState(false);
  const [showArticleType, setShowArticleType] = useState(false);
  const [showPublicationDate, setShowPublicationDate] = useState(false);

  return (
    <div className="filter-popup">
      <div className="filter-header">
        <h4>Filters</h4>
        <a onClick={closePopup}>Reset all</a>
      </div>
      <div className="filter-options">
        {/* Text availability section */}
        <div className="filter-section">
          <h5 onClick={() => setShowTextAvailability(!showTextAvailability)}>
            Text availability {showTextAvailability ? "▲" : "▼"}
          </h5>
          {showTextAvailability && (
            <div className="filter-options-dropdown">
              <label>
                <input type="checkbox" /> Abstract
              </label>
              <label>
                <input type="checkbox" /> Free full text
              </label>
              <label>
                <input type="checkbox" /> Full text
              </label>
            </div>
          )}
        </div>

        {/* Article type section */}
        <div className="filter-section">
          <h5 onClick={() => setShowArticleType(!showArticleType)}>
            Article type {showArticleType ? "▲" : "▼"}
          </h5>
          {showArticleType && (
            <div className="filter-options-dropdown">
              <label>
                <input type="checkbox" /> Books & Documents
              </label>
              <label>
                <input type="checkbox" /> Clinical Trials
              </label>
              <label>
                <input type="checkbox" /> Meta Analysis
              </label>
            </div>
          )}
        </div>

        {/* Publication date section */}
        <div className="filter-section">
          <h5 onClick={() => setShowPublicationDate(!showPublicationDate)}>
            Publication date {showPublicationDate ? "▲" : "▼"}
          </h5>
          {showPublicationDate && (
            <div className="filter-options-dropdown">
              <label>
                <input type="radio" name="date" /> 1 year
              </label>
              <label>
                <input type="radio" name="date" /> 5 years
              </label>
              <label>
                <input type="radio" name="date" /> Custom range
              </label>
            </div>
          )}
        </div>
      </div>
      <div >
        <button className="filter-footer" onClick={closePopup}>Apply Filters</button>
      </div>
    </div>
  );
};

export default FilterPopup;
