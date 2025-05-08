import React from 'react';
import './card.css';
import { useNavigate } from 'react-router-dom';

const Card = ({ thumbnail, description, Date, EditorId, id, status, rejectionReason,showStatus = false }) => {
  const navigate = useNavigate();

  return (
    <div className="card" onClick={() => navigate(`/ViewNews/${id}`)}>
      <img src={thumbnail} alt="thumbnail" />
      <hr />
      <h2>{description.length > 60 ? `${description.slice(0, 60)}...` : description}</h2>
      <div className="info">
        {!showStatus && <p>Article By: {EditorId}</p>}
        <p>Submitted on: {Date}</p>
        {/* ✅ Corrected status display */}
        {status === "rejected" && rejectionReason && (
                    <p className="rejection-reason">
                      Rejection Reason: {rejectionReason}
                    </p>
                )}
      </div>
    </div>
  );
};

export default Card;
