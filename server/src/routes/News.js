import express from 'express';
import authenticateToken from '../middlewares/autoLogin.js';
import NewsData,{NewsStatusLog} from "../models/News.js"

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const category = req.query.category;
        let newsData;

        if (category) {
            newsData = await NewsData.find({
                "Category.Tags": category, 
                "Status": "accepted"
            }).sort({ Date: -1 });
        } else {
            newsData = await NewsData.find({ "Status": "accepted" }).sort({ Date: -1 });
        }

        const responseData = {
            newsData: newsData,
            User: { 
                roll: req.user.roll || null, 
                type: req.user.type || "user"
            } 
        };

        res.status(200).json(responseData);
    } catch (err) {
        console.error(err);
        res.status(404).json({ "error": "Could not find data" });
    }
});

router.get('/user-news', async (req, res) => {
    const { editorId } = req.query;

    if (!editorId) {
        return res.status(400).json({ error: "Editor ID is required" });
    }

    try {
        const userNews = await NewsData.find({ EditorId: editorId }).sort({ Date: -1 }).lean(); // ✅ Use .lean()

        if (userNews.length === 0) {
            return res.status(404).json({ message: "No news found for this user" });
        }

        // Fetch all status logs in parallel
        const statusLogs = await Promise.all(
            userNews.map(newsItem =>
                NewsStatusLog.findOne({ newsId: newsItem._id })
                    .sort({ changedAt: -1 })
                    .lean()
            )
        );

        // Attach status logs
        userNews.forEach((newsItem, index) => {
            if (statusLogs[index]) {
                newsItem.latestStatus = statusLogs[index]; // ✅ No `_doc` issue
            }
        });

        res.status(200).json(userNews);
    } catch (error) {
        console.error("🔥 Error fetching user news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



export default router;