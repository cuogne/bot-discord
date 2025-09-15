import OpenAI from "openai";
import { EmbedBuilder } from "discord.js";

export async function groqCommand(interaction) {
    await interaction.deferReply();

    if (!process.env.GROQ_API_KEY) {
        await interaction.editReply("Vui lòng cung cấp API_KEY của Groq trong .env để sử dụng lệnh này");
        return;
    }

    const client = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1"
    });

    const prompt = interaction.options.getString("prompt");

    try {
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        let reply = completion.choices[0]?.message?.content || "⚠️ Không có nội dung trả về.";

        const chunks = reply.match(/[\s\S]{1,4000}/g);
        const embeds = chunks.slice(0, 10).map((chunk, i) => {
            if (i === 0) {
                return new EmbedBuilder()
                    .setColor(0x00AE86)
                    .setTitle(" ")
                    .setDescription(`❓ **Câu hỏi:**\n${prompt}\n\n🤖 **Trả lời:**\n${chunk}`);
            } else {
                return new EmbedBuilder()
                    .setColor(0x00AE86)
                    .setTitle(`Tiếp theo (${i + 1})`)
                    .setDescription(chunk);
            }
        });

        await interaction.editReply({ embeds: embeds });

        if (chunks.length > 10) {
            let batch = [];
            for (let i = 10; i < chunks.length; i++) {
                batch.push(
                    new EmbedBuilder()
                        .setColor(0x00AE86)
                        .setTitle(`Tiếp theo (${i+1})`)
                        .setDescription(chunks[i])
                );
                if (batch.length === 10 || i === chunks.length - 1) {
                    await interaction.followUp({ embeds: batch });
                    batch = [];
                }
            }
        }

    } catch (error) {
        console.error("Error from Groq API:", error);
        await interaction.editReply("🚨 Đã xảy ra lỗi khi kết nối với Groq API hoặc model không tồn tại.");
    }
}