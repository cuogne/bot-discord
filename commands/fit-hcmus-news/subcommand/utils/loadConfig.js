import { schema } from "../../db/newSchema.js";

export async function loadConfig(guildId) {
    try {
        return await schema.findOne({ guildId }).lean();
    } catch (err) {
        console.error("❌ loadConfig error:", err);
        return null;
    }
}