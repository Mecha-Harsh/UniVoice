import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import "./contactus.css"; // Import CSS for styling
import { useUser } from "../context/UserContext"; // Import the context hook

const ContactUs = () => {
  const navigate = useNavigate();
  const {userType} = useUser(); // Get userType and setUserType from context
  
  return (
    <>
      <Navbar/> {/* Ensure Navbar is included at the top */}
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-header">
            <h1>Contact Us</h1>
            <p className="subtitle">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>

          <div className="contact-cards">
            <div className="contact-card">
              <div className="card-icon">📧</div>
              <h3>Email Us</h3>
              <p>Drop us a line anytime</p>
              <a href="mailto:support@example.com">support@example.com</a>
            </div>

            <div className="contact-card">
              <div className="card-icon">📞</div>
              <h3>Call Us</h3>
              <p>Mon-Fri from 8am to 5pm</p>
              <a href="tel:+1234567890">+1 234 567 890</a>
            </div>
          </div>
                <button type="button" className="back-button" onClick={() => navigate("/")}>
                  Go Back
                </button>
          </div>
        </div>
    </>
  );
};

export default ContactUs;
