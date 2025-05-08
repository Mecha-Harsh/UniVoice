import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./postNews.css";
import axios from "axios";
import Navbar from "./components/navbar";
import { useUser } from "./context/UserContext";

const PostNews = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([]);
  const { userType, setUserType, userRoll, setUserRoll } = useUser();
  const [loading, setLoading] = useState(false); // 🔄 Loading state

  const handleCategories = (value) => {
    setCategories((prevCategories) =>
      prevCategories.includes(value)
        ? prevCategories.filter((item) => item !== value)
        : [...prevCategories, value]
    );
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("userRoll", userRoll);
    formData.append("Description", data.Description);
    formData.append("article", data.article);

    if (data.thumbnail[0]) {
      formData.append("thumbnail", data.thumbnail[0]);
    }
    if (data.images.length > 0) {
      Array.from(data.images).forEach((image) => {
        formData.append("images", image);
      });
    }

    formData.append("categories", JSON.stringify(categories));

    try {
      setLoading(true); // ✅ Start loading

      const response = await axios.post("http://localhost:3000/postNews", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      console.log(response);
      alert("Form submitted successfully!");
      navigate('/');
    } catch (error) {
      console.error("Form submission failed:", error);
      if (
        error.response &&
        (error.response.status === 401 ||
          error.response.status === 403 ||
          error.response.status === 404)
      ) {
        alert("Unauthorized person, please login to post");
        navigate("/login");
      } else {
        alert("Form not submitted!");
      }
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <>
      <Navbar userType={userType} />
      <div className="postNews-Container">
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}>
          Submit News Article
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <input type="text" {...register("Description", { required: true })} placeholder="Enter a Description" />
          {errors.Description && <p>Description is mandatory</p>}

          <input type="file" {...register("thumbnail", { required: true })} />
          {errors.thumbnail && <p>Enter a Thumbnail</p>}

          <textarea {...register("article", { required: true, minLength: 50 })} placeholder="Enter the article here"></textarea>
          {errors.article && <p>Article length should be at least 50 characters</p>}

          <input type="file" {...register("images")} multiple />
          {errors.images && <p>Enter images</p>}

          <div className="categories">
            <h5>Select Categories (one or more)</h5>
            {["club", "college", "alumni", "success", "events"].map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={() => handleCategories(category)}
                />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            ))}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default PostNews;
