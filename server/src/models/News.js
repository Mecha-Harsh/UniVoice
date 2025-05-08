import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
    Thumbnail: { type: String, required: true },
    Description: { type: String, required: true },
    Article: { type: String, required: true },
    Images: [
        {
            url: { type: String },
        },
    ],
    Date: { type: Date, required: true },
    Category: [
        {
            Tags: { type: String },
        },
    ],
    EditorId: { type: String, required: true },
    Status: { type: String, enum: ["accepted", "rejected", "pending"], default: "pending" },
});

NewsSchema.pre("findOneAndUpdate", function (next) {
    console.log("🔄 Mongoose: Updating News with ID:", this.getQuery());
    console.log("📝 Update Data:", this.getUpdate());
    next();
});

const NewsStatusLogSchema = new mongoose.Schema({
    newsId: { type: mongoose.Schema.Types.ObjectId, ref: "NewsData", required: true },
    changedBy: { type: String, required: true, default: "admin" },
    reason: { type: String, default: "" },
    changedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["accepted", "rejected"], required: true },
});

const NewsData = mongoose.model("NewsData", NewsSchema);
const NewsStatusLog = mongoose.model("NewsStatusLog", NewsStatusLogSchema, "newsStatusLog");

export { NewsStatusLog };
export default NewsData;
