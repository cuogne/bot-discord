import { schema } from "../../db/newSchema.js";

export async function saveConfig(guildId, config) {
    try {
        const saved = await schema.findOneAndUpdate(
            { guildId },
            { guildId, ...config },
            { upsert: true, new: true }
        ).lean();
        return saved;
    } catch (err) {
        console.error("❌ saveConfig error:", err);
        return null;
    }
}