import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import the context hook
import axios from "axios";
import { cache } from "react";

const Dropdown = () => {
  const navigate = useNavigate();
  const { userType,setUserType } = useUser(); // Get userType and setUserType from context
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


  console.log("dropdown",userType);
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setUserType("Guest"); // Ensure the state updates before navigation
        navigate("/"); // Navigate after updating state
      } else {
        console.log("Logout failed on server");
      }
    } catch (error) {
      console.log("Logout request failed:", error);
    }
  };

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

  return (
    <div className={`dropdown-container ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
      <button onClick={toggleDropdown}>Profile</button>
      {isOpen && (
        <>
          <div className="dropDown">
            <button onClick={() => {
              navigate("/login");
              setIsOpen(false);
            }}>
              Sign In
            </button>
            
            {/* Only show View Profile button when userType is not "Guest" */}
            {userType !== "Guest" && (
              <button onClick={() => {
                navigate("/profile");
                setIsOpen(false);
              }}>
                View Profile
              </button>
            )}
            
            <button onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}>
              Log Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;