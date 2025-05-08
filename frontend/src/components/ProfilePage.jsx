import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Card from "../components/card";
import Navbar from "./navbar";
import "./profile.css";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { userType, userRoll } = useUser();
    const [news, setNews] = useState([]);

    useEffect(() => {
        if (!userRoll || userType === "admin") return;

        const fetchNews = async () => {
            try {
                const url = `http://localhost:3000/user-news?editorId=${userRoll}`;
                const response = await fetch(url);
                const data = await response.json();

                if (response.ok) {
                    setNews(Array.isArray(data) ? data : []);
                } else {
                    console.error("Error fetching news:", data.error);
                }
            } catch (error) {
                console.error("Request failed:", error);
            }
        };

        fetchNews();
    }, [userRoll, userType]);

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <div className="profile-card">
                    <section className="profile-info-section">
                        <h2>👤 Profile</h2>
                        <p><strong>Roll Number:</strong> {userRoll || "N/A"}</p>
                        <p><strong>User Type:</strong> {userType}</p>
                    </section>

                    {userType !== "admin" && (
                        <section className="news-section">
                            <h3>📰 Your Posted News</h3>
                            {news.length > 0 ? (
                                <div className="news-grid">
                                    {news.map((item) => (
                                        <Card
                                            key={item._id}
                                            id={item._id}
                                            thumbnail={item.Thumbnail}
                                            description={item.Description}
                                            Date={new Date(item.Date).toLocaleDateString()}
                                            EditorId={item.EditorId}
                                            status={item.Status}
                                            rejectionReason={
                                                item.Status === "rejected" ? item.latestStatus?.reason : null
                                            }
                                            showStatus={true}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p>No news posted yet.</p>
                            )}
                        </section>
                    )}

                    <button className="back-button" onClick={() => navigate("/")}>
                        Go Back
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
