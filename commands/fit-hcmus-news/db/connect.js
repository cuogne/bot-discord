import mongoose from "mongoose";

// https://www.mongodb.com/products/platform/cloud
// https://www.mongodb.com/developer/languages/javascript/getting-started-with-mongodb-and-mongoose/

export async function connectMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}