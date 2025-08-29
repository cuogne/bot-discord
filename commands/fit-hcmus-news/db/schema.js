import mongoose from "mongoose";

const schema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    }, // id server

    channelId: String, // id kênh
    channelName: String, // tên kênh
    guildName: String, // tên server
    setupBy: String, // người setup
    setupAt: String, // thời gian setup
    isActive: Boolean, // trạng thái
});

export default mongoose.model("ServerConfig", schema);
