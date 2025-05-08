import React, { useState } from "react";
import axios from "axios";
import "./acceptcard.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import User Context

const AcceptCard = ({ id, description, article, status, onStatusUpdate, thumbnail }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const navigate = useNavigate();
  const { userRoll } = useUser(); // Get user context

  const handleRejectClick = (e) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      alert("Please enter a reason for rejection.");
      return;
    }

    try {
      const res = await axios.patch(`http://localhost:3000/admin/update-status/${id}`, {
        status: "rejected",
        changedBy: userRoll || "Unknown Admin", // Use correct roll number
        rejectionReason,
      });

      if (onStatusUpdate) onStatusUpdate(id, "rejected");
      console.log("✅ Status Updated:", res.data);

      setShowPopup(false);
      setRejectionReason("");
    } catch (err) {
      console.error("❌ Update error:", err.response?.data || err.message);
      alert("Failed to update status");
    }
  };

  return (
    <div className="accept-card" onClick={() => navigate(`/ViewNews/${id}`)}>
      <div className="accept-content">
        <img src={thumbnail} alt="thumbnail" />
        <div className="id">{id}</div>
        <div className="description">{description}</div>
        <div className="article">{article}</div>
        <div className="status">{status}</div>
      </div>
      <div className="accept-button-container">
        <button className="reject-button" onClick={handleRejectClick}>
          Reject News
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h3>Enter Reason for Rejection</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
            />
            <div className="popup-buttons">
              <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
              <button className="submit-btn" onClick={submitRejection}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptCard;
