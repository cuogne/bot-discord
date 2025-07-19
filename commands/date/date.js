import { SolarDate } from "@nghiavuive/lunar_date_vi";
// check this lib calc lunar date: https://github.com/nacana22/lunar-date

export async function dateCommand(interaction) {
    await interaction.deferReply();

    const nowDate = new Date();
    const dateStr = nowDate.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh'
    }).split(" ");

    const timeNow = dateStr[0]; // thoi gian
    const solarDate = dateStr[1]; // duong lich

    const lunar = new SolarDate(nowDate);
    const lunarDate = lunar.toLunarDate().day + '/'
        + lunar.toLunarDate().month + '/' + lunar.toLunarDate().year; // am lich

    await interaction.editReply({
        embeds: [{
            color: 0x4285f4,
            title: "📅 Ngày hiện tại",
            fields: [
                {
                    name: '🌞 Dương lịch',
                    value: solarDate,
                    inline: false
                },
                {
                    name: '🌙 Âm lịch',
                    value: lunarDate,
                    inline: false
                },
                {
                    name: '🕰️ Thời gian',
                    value: timeNow,
                    inline: false
                }
            ],
            footer: {
                text: 'GMT+7 (Việt Nam)'
            }
        }]
    })
}