import express from "express";
import NewsData, { NewsStatusLog } from "../models/News.js";

const router = express.Router();

router.patch("/update-status/:id", async (req, res) => {
    const { id } = req.params;
    const { status, rejectionReason, changedBy } = req.body; // Use changedBy directly

    console.log("📩 Incoming Request Body:", req.body); // Debugging log

    if (!status || !changedBy) { // Ensure changedBy is present
        return res.status(400).json({ error: "Missing required fields: status or changedBy" });
    }

    try {
        // Update the news article's status
        const updatedNews = await NewsData.findByIdAndUpdate(
            id,
            { Status: status },
            { new: true }
        );

        if (!updatedNews) {
            return res.status(404).json({ error: "Article not found" });
        }

        console.log("🔄 Updated News Data:", updatedNews); // Debugging log

        console.log("📝 Creating NewsStatusLog Entry...");
        console.log("🔍 Changed By:", changedBy);

        // Create log entry
        const logEntry = new NewsStatusLog({
            newsId: id,
            changedBy: changedBy, // Use passed admin roll number
            reason: status === "rejected" ? rejectionReason || "No reason provided" : "",
            status,
            changedAt: new Date(),
        });

        console.log("🟢 Log Entry Before Saving:", logEntry); // Debugging log

        await logEntry.save();

        console.log("✅ Log Entry Saved Successfully:", logEntry); // Debugging log

        res.status(200).json({ message: "Status updated successfully", data: updatedNews });
    } catch (err) {
        console.error("❌ Error updating status:", err);
        res.status(500).json({ error: "Failed to update status", details: err.message });
    }
});

export default router;
