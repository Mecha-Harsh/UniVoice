import "react";
import Navbar from "./components/navbar";
import "./admin.css";
import { useUser } from "./context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import AcceptCard from "./components/approvedNewCard";
import RejectCard from "./components/rejectedNewsCard";
import PendingCard from "./components/pendingNewsCard"; // Don't forget this import!

const Admin = () => {

  const { userType,access } = useUser();
  const [status, setStatus] = useState("pending");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  // Add this function in Admin.jsx1

  const updateLocalStatus = (id, newStatus) => {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, Status: newStatus } : item
      )
    );
  };


  function SelectCard(props) {
    const { status, description, article, id, onStatusUpdate , thumbnail } = props;
  
    if (status === "accepted") {
      return (
        <AcceptCard
          description={description}
          article={article}
          id={id}
          status={status}
          onStatusUpdate={onStatusUpdate}
          thumbnail={thumbnail}
        />
      );
    } else if (status === "rejected") {
      return (
        <RejectCard
          description={description}
          article={article}
          id={id}
          status={status}
          onStatusUpdate={onStatusUpdate}
          thumbnail={thumbnail}
        />
      );
    } else {
      return (
        <PendingCard
          description={description}
          article={article}
          id={id}
          status={status}
          onStatusUpdate={onStatusUpdate}
          thumbnail={thumbnail}
        />
      );
    }
  }
  

  // 👉 Fetch data based on current selected status
  useEffect(() => {
    axios
      .get("http://localhost:3000/admin", {
        params: { status },
        headers: {
          Authorization: `Bearer ${access}`
        },
        withCredentials: true
      })
      .then((result) => {
        console.log("Fetched data:", result.data);
        setData(result.data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Could not fetch data or access denied");
        
        // Check if error status is 401, 403, or 404 and navigate to login
        if (error.response && (error.response.status === 401 || 
                               error.response.status === 403 || 
                               error.response.status === 404)) {
          navigate("/login");
        }
      });
  }, [status, access]);
  return (
    <>
      <Navbar/>
      <div className="admin-container">
        <div className="admin-header">
          <h1>News Article Management</h1>
          <p>Manage and review article submissions</p>
        </div>
        
        <div className="status-tabs">
          <button 
            className={`status-tab ${status === "accepted" ? "active" : ""}`}
            onClick={() => setStatus("accepted")}
          >
            <span className="status-icon">✓</span>
            <div className="status-info">
              <h2>Accepted</h2>
              <p>Approved articles</p>
            </div>
          </button>
          
          <button 
            className={`status-tab ${status === "pending" ? "active" : ""}`}
            onClick={() => setStatus("pending")}
          >
            <span className="status-icon">⌛</span>
            <div className="status-info">
              <h2>Pending</h2>
              <p>Articles awaiting review</p>
            </div>
          </button>
          
          <button 
            className={`status-tab ${status === "rejected" ? "active" : ""}`}
            onClick={() => setStatus("rejected")}
          >
            <span className="status-icon">✕</span>
            <div className="status-info">
              <h2>Rejected</h2>
              <p>Declined articles</p>
            </div>
          </button>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>{status.charAt(0).toUpperCase() + status.slice(1)} Articles</h2>
            <div className="article-count">{data.length} articles</div>
          </div>

          <div className="cards-grid">
            {data && data.length > 0 ? (
              data.map((item) => (
                <SelectCard
                  key={item._id}
                  id={item._id}
                  description={item.Description}
                  article={item.article}
                  status={item.Status}
                  thumbnail={item.Thumbnail}
                  onStatusUpdate={updateLocalStatus}
                />
              ))
            ) : (
              <div className="no-articles">
                <span className="empty-icon">📝</span>
                <h3>No Articles Found</h3>
                <p>There are no articles in this category at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
