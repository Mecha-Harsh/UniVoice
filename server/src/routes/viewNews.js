import express from 'express';
const router = express.Router();
import NewsData from "../models/News.js";

// Correct route to capture slug
router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    //console.log(`Slug is: ${slug}`);

    if (slug) {
        try {
            const data = await NewsData.findById(slug);
            
            if (data) {
                //console.log(data);
                res.status(200).json(data);
            } else {
                res.status(404).json({ "error": "Could not find data" });
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ "error": "Internal server error" });
        }
    } else {
        console.log("Couldn't fetch data");
        res.status(400).json({ "error": "Slug is missing" });
    }
});

export default router;
