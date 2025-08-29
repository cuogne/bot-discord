import schema from "../../db/schema.js";

export async function loadConfig(guildId) {
    try {
        return await schema.findOne({ guildId }).lean();
    } catch (err) {
        console.error("❌ loadConfig error:", err);
        return null;
    }
}