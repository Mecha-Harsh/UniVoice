import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit"; // ✅ Rate limiter import
import mongoSanitize from 'express-mongo-sanitize';



// Routes
import login from "./routes/login.js";
import News from "./routes/News.js";
import AdminNews from "./routes/AdminNews.js";
import PostNews from "./routes/postNews.js";
import AdminStatusUpdate from "./routes/AdminStatusUpdate.js";
import ViewNews from "./routes/viewNews.js";
import logout from "./routes/logout.js";
//import authenticateToken from "./middlewares/autoLogin.js";
import navbarUpdate from "./routes/navbarUpdate.js";

dotenv.config();

const app = express();
const port = 3000;
const murl = process.env.Mongo_URI;


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});

app.use(mongoSanitize());


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: {
    status: 429,
    error: "Too many login attempts. Please try again after 15 minutes.",
  },
});


app.use(globalLimiter); 
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(murl);
  console.log("Connected successfully");
}

app.use("/navbarUpdate",navbarUpdate)
app.use("/logout", logout);
app.use("/login", loginLimiter, login); // Login with stricter limiter
app.use("/", News);
app.use("/admin", AdminNews);
app.use("/admin", AdminStatusUpdate);
app.use("/postNews", PostNews);
app.use("/viewNews", ViewNews);

// ✅ Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
