import React, { useEffect } from 'react';
import './navbar.css';
import Dropdown from './Dropdown';
import ResourcesDropdown from './ResourcesDropdown';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const Navbar = ({ setCategory }) => {
  const navigate = useNavigate();
  const { userType, setUserType } = useUser();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Change this URL to match your backend route
        const res = await axios.get("http://localhost:3000/navbarUpdate", {
          withCredentials: true
        });
        
        if (res.data?.type) {
          setUserType(res.data.type); // Updates with "User", "Admin", or "Guest"
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    
    fetchUser();
  }, []);
  
  return (
    <div className="NavContainer">
      <nav>
        <div className="logo-container">
          <img src="/chrome_xb1xWiWoWg.png" alt="Logo" style={{ width: "9rem" }} onClick={() => navigate("/")} />
        </div>
        <ul className="nav-links">
          <li>
            <button className="home" onClick={() => { navigate('/'); setCategory(null); }}>
              Home
            </button>
          </li>
          <li>
            <ResourcesDropdown setCategory={setCategory} />
          </li>
          {userType === "Admin" && (
            <li>
              <button className="admin" onClick={() => navigate('/admin')}>
                Admin
              </button>
            </li>
          )}
          {(userType === "User" || userType === "Admin") && (
            <li>
              <button className="postNews" onClick={() => navigate('/post')}>
                Post
              </button>
            </li>
          )}
          <li>
            <button className="contact-Us" onClick={() => navigate('/contact')}>
              Contact Us
            </button>
          </li>
          <li>
            <Dropdown setUserType={setUserType} />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;