import { EmbedBuilder } from 'discord.js';
import * as fs from 'fs';

export async function dictionaryCommand(interaction) {
    await interaction.deferReply();

    const text = interaction.options.getString('text');
    const link = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`;

    try {
        const response = await fetch(link);
        if (!response.ok) {
            await interaction.editReply(
                {
                    content: `Không tìm thấy từ này. Kiểm tra lại chính tả \n${response.status} ${response.statusText}`
                }
            );
            return;
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            await interaction.editReply({ content: 'Không có dữ liệu cho từ này.' });
            return;
        }

        // fs.writeFileSync('output.json', JSON.stringify(data, null, 2)); // debug

        const word = data[0]?.word || text; // từ do user nhập vào
        const firstPhonetic =
            data.find(e => typeof e.phonetic === 'string' &&
                e.phonetic.trim())?.phonetic ||
            data.find(e => Array.isArray(e.phonetics) &&
                e.phonetics.some(p => p.text))?.phonetics?.find(p => p.text)?.text || '';

        const partOfSpeechToInfo = new Map(); // tạo map để lưu từng loại

        for (const entry of data) {
            const meanings = Array.isArray(entry.meanings) ? entry.meanings : []; // truy cập vào meanings
            for (const meaning of meanings) {
                const pos = meaning.partOfSpeech || 'other'; // lấy từ loại (verb, noun, ...)
                const info = partOfSpeechToInfo.get(pos) ||
                {
                    definitions: [],
                    synonyms: new Set(),
                    antonyms: new Set()
                };

                const defs = Array.isArray(meaning.definitions) ? meaning.definitions : []; // lấy các định nghĩa

                for (const def of defs) {
                    if (def && typeof def.definition === 'string' && def.definition.trim()) {
                        info.definitions.push(def.definition.trim()); // lưu định nghĩa
                    }
                    if (Array.isArray(def.synonyms)) {
                        def.synonyms.forEach(s => s && info.synonyms.add(s)); // lưu đồng nghĩa
                    }
                    if (Array.isArray(def.antonyms)) {
                        def.antonyms.forEach(a => a && info.antonyms.add(a)); // lưu trái nghĩa
                    }
                }

                if (Array.isArray(meaning.synonyms)) {
                    meaning.synonyms.forEach(s => s && info.synonyms.add(s));
                }
                if (Array.isArray(meaning.antonyms)) {
                    meaning.antonyms.forEach(a => a && info.antonyms.add(a));
                }

                partOfSpeechToInfo.set(pos, info);
            }
        }

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(word)
            .setDescription(firstPhonetic ? `**Phiên âm:** ${firstPhonetic}` : null)
            .setTimestamp();

        const MAX_FIELD_VALUE = 1024;

        for (const [pos, info] of partOfSpeechToInfo.entries()) {
            const definitions = info.definitions.slice(0, 10);
            const synonyms = Array.from(info.synonyms).slice(0, 20);
            const antonyms = Array.from(info.antonyms).slice(0, 20);

            const chunks = []

            if (definitions.length > 0) {
                const defsText = definitions.map((d, i) => `${i + 1}. ${d}`).join('\n');
                chunks.push(`\n${defsText}`);
            }

            if (synonyms.length > 0) {
                chunks.push(`**Đồng nghĩa:** ${synonyms.join(', ')}`);
            }

            if (antonyms.length > 0) {
                chunks.push(`**Trái nghĩa:** ${antonyms.join(', ')}`);
            }

            if (chunks.length === 0) continue;

            let value = chunks.join('\n\n');
            if (value.length > MAX_FIELD_VALUE) {
                value = value.slice(0, MAX_FIELD_VALUE - 3) + '...';
            }

            embed.addFields(
                {
                    name: pos, value,
                    inline: false
                }
            );
        }

        // Nếu không có fields nào (không có định nghĩa hợp lệ)
        if ((embed.data.fields?.length || 0) === 0) {
            await interaction.editReply({ content: 'Không có nội dung phù hợp để hiển thị.' });
            return;
        }

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Lỗi khi lấy từ điển:', error);
        await interaction.editReply({ content: 'Đã xảy ra lỗi khi tra từ điển.' });
    }
}