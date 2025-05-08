import express from 'express';
const router = express.Router();
import NewsData from "../models/News.js";
import authenticateToken from '../middlewares/authAdmin.js';

router.get('/',authenticateToken, async (req, res) => {
  const status = req.query.status;
  console.log("Requested status:", status);

  try {
    const data = await NewsData.find({ Status: status });
    res.status(200).send(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(404).json({ error: "Could not fetch data" });
  }
});

export default router;
