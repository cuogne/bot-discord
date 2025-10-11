import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Phonetic, Definition, Meaning, Entry, PartOfSpeechInfo } from "./types/dict.type"; // đường dẫn tương đối

export async function dictionaryCommand(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const text = interaction.options.getString("text", false);
    if (!text) {
        await interaction.editReply({ content: "❗ Vui lòng nhập từ cần tra cứu." });
        return;
    }

    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            await interaction.editReply({
                content: `❌ Không tìm thấy từ này. Kiểm tra lại chính tả.\n> ${response.status} ${response.statusText}`
            });
            return;
        }

        const data: Entry[] = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            await interaction.editReply({ content: "Không có dữ liệu cho từ này." });
            return;
        }

        const word = data[0]?.word || text;

        const firstPhonetic =
            data.find(e => typeof e.phonetic === "string" && e.phonetic.trim())?.phonetic ||
            data.flatMap(e => e.phonetics ?? [])
                .find((p: Phonetic) => p.text)?.text || "";
                
        const partOfSpeechToInfo = new Map<string, PartOfSpeechInfo>();

        for (const entry of data) {
            for (const meaning of entry.meanings ?? []) {
                const pos = meaning.partOfSpeech || "other";

                const info: PartOfSpeechInfo = partOfSpeechToInfo.get(pos) || {
                    definitions: [],
                    synonyms: new Set<string>(),
                    antonyms: new Set<string>()
                };

                for (const def of meaning.definitions ?? []) {
                    if (def.definition?.trim()) info.definitions.push(def.definition.trim());
                    def.synonyms?.forEach(s => info.synonyms.add(s));
                    def.antonyms?.forEach(a => info.antonyms.add(a));
                }

                meaning.synonyms?.forEach(s => info.synonyms.add(s));
                meaning.antonyms?.forEach(a => info.antonyms.add(a));

                partOfSpeechToInfo.set(pos, info);
            }
        }

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(`📚 ${word}`)
            .setDescription(firstPhonetic ? `**🎧 Phonetic:** ${firstPhonetic}` : null)
            .setTimestamp();

        const MAX_FIELD_VALUE = 1024;
        const posNames: Record<string, string> = {
            noun: "**Noun (n.)**",
            verb: "**Verb (v.)**",
            adjective: "**Adjective (adj.)**",
            adverb: "**Adverb (adv.)**",
            pronoun: "**Pronoun (pron.)**",
            preposition: "**Preposition (prep.)**",
            conjunction: "**Conjunction (conj.)**",
            interjection: "**Interjection (interj.)**",
            other: "**Other**"
        };

        for (const [pos, info] of partOfSpeechToInfo.entries()) {
            const defs = info.definitions.slice(0, 10).map((d, i) => `${i + 1}. ${d}`).join("\n");
            const synonyms = Array.from(info.synonyms).slice(0, 20);
            const antonyms = Array.from(info.antonyms).slice(0, 20);

            const related: string[] = [];
            if (synonyms.length) related.push(`• **Synonyms:** ${synonyms.join(", ")}`);
            if (antonyms.length) related.push(`• **Antonyms:** ${antonyms.join(", ")}`);

            let value = [defs, related.join("\n")].filter(Boolean).join("\n");
            if (value.length > MAX_FIELD_VALUE) value = value.slice(0, MAX_FIELD_VALUE - 3) + "...";

            embed.addFields({
                name: posNames[pos] || `**${pos.charAt(0).toUpperCase() + pos.slice(1)}**`,
                value: value || "Không có định nghĩa",
                inline: false
            });
        }

        if (!embed.data.fields?.length) {
            await interaction.editReply({ content: "Không có nội dung phù hợp để hiển thị." });
            return;
        }

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error("Lỗi khi tra từ điển:", error);
        await interaction.editReply({ content: "⚠️ Đã xảy ra lỗi khi tra từ điển." });
    }
}