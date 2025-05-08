// components/ResourcesDropdown.jsx
import React, { useState, useEffect, useRef } from "react";

const ResourcesDropdown = ({ setCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategorySelect = (category) => {
    setCategory(category);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown-container ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
      <button onClick={toggleDropdown}>Resources</button>
      {isOpen && (
        <div className="dropDown">
          <button onClick={() => handleCategorySelect("club")}>
            Club Events
          </button>
          <button onClick={() => handleCategorySelect("events")}>
            Cultural Events
          </button>
          <button onClick={() => handleCategorySelect("college")}>
            College
          </button>
          <button onClick={() => handleCategorySelect("success")}>
            Success Stories
          </button>
          <button onClick={() => handleCategorySelect("alumni")}>
            Alumni
          </button>
          <button onClick={() => handleCategorySelect("live")}>
            Live
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourcesDropdown;