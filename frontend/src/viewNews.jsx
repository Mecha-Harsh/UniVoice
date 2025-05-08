import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "./context/UserContext";
import "./viewNews.css";

const ViewNews = () => {
  const {userType} = useUser();
  const { slug } = useParams();
  const [newsdata, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState(null);

  // Function to fetch data
  const fetchData = async () => {
    try {
      const result = await axios.get(`http://localhost:3000/viewNews/${slug}`);
      setNewsData(result.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  // Fetch news data when slug changes
  useEffect(() => {
    fetchData();
  }, [slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!newsdata) {
    return <p>No data found!</p>;
  }

  return (
    <>
      <Navbar userType={userType}/>
      <div className="container">
        <img className="thumbnail" src={newsdata.Thumbnail} alt="News image" />
        <h1>{newsdata.Description}</h1>
        <p>{newsdata.Article}</p>

        <div className="imagess">
          {Array.isArray(newsdata.Images) &&
            newsdata.Images.map((item, index) => (
              <img
                src={item.url}
                alt={`news-${index}`}
                key={index}
                className="zoomable"
                onClick={() => setZoomedImage(item.url)}
              />
            ))}
        </div>

        <p>Published on: {new Date(newsdata.Date).toLocaleDateString()}</p>

        {/* Zoomed image modal */}
        {zoomedImage && (
          <div className="modal" onClick={() => setZoomedImage(null)}>
            <img src={zoomedImage} alt="Zoomed" className="modal-image" />
          </div>
        )}
      </div>
    </>
  );
};

export default ViewNews;