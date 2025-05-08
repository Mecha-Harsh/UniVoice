import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Card from "./components/card";
import axios from "axios";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext"; // Import the context hook

const Home = () => {
  const [cardData, setCardData] = useState([]);
  const [category, setCategory] = useState(null);
  const [currImage, setcurrImage] = useState(0);
  const { userType, setUserType,setUserRoll } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/", {
        params: {
          category,
        },
        withCredentials: true 
      })
      .then((result) => {
        console.log(result.data);
        setCardData(result.data.newsData);
        setUserRoll(result.data.User.roll)
        setUserType(result.data.User.type)
      })
      .catch((err) => {
        alert("error fetching data");
      });
  }, [category]);

  useEffect(() => {
    if (cardData.length > 0) {
      const interval = setInterval(() => {
        setcurrImage((prevIndex) =>
          prevIndex < cardData.length - 1 ? prevIndex + 1 : 0
        );
      }, 5000); // Change image every 5 seconds
      return () => clearInterval(interval);
    }
  }, [cardData, currImage]);

  return (
    <>
      <Navbar setCategory={setCategory}/>
      <div className="image-container">
        {cardData.length > 0 && (
          <>
            <img
              key={`image-${currImage}`} // Fixed: unique key
              className="Clg_Image_cards"
              src={cardData[currImage]?.Thumbnail}
              alt={cardData[currImage]?.Description || "IIIT KOTTAYAM"}
              onClick={() => navigate(`/ViewNews/${cardData[currImage]._id}`)}
            />
            <div className="image-description" key={`desc-${currImage}`}> {/* Fixed: unique key */}
              {cardData[currImage]?.Description || "No description available"}
            </div>
          </>
        )}
        {cardData.length === 0 && (
          <img className="Clg_Image" src="images.jpeg" alt="IIIT KOTTAYAM" />
        )}
      </div>
      <hr />
      <div className="cards">
        {cardData.map((item) => (
          <Card
            key={item._id}
            thumbnail={item.Thumbnail}
            description={item.Description}
            article={item.Article}
            EditorId={item.EditorId}
            Date={new Date(item.Date).toLocaleDateString()}
            id={item._id}
          />
        ))}
      </div>
    </>
  );
};

export default Home;