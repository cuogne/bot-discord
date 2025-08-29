import schema from "../../db/schema.js";

export async function removeConfig(guildId) {
    try {
        await schema.deleteOne({ guildId });
        return true;
    } catch (err) {
        console.error("❌ removeConfig error:", err);
        return false;
    }
}