import { tournaments } from "../data/tournament.js";
import { separateDate } from "../utils/separateDate.js";
import { formatDayWithoutSeperator } from "../utils/formatDayWithoutSeperate.js";
import { getCalendarFromAPI } from "../utils/getCalendarFromAPI.js";

export async function footballTournamentCommand(interaction) {
    await interaction.deferReply();

    const tournament = interaction.options.getString('tournament'); // get option from user
    const linkImg = tournaments[tournament].img; // get link image
    const link = `http://site.api.espn.com/apis/site/v2/sports/soccer/${tournament}/scoreboard`;

    try {
        const calendar = await getCalendarFromAPI(link); // get calendar

        if (calendar === null) {
            await interaction.editReply('Lỗi lấy lịch đá');
            return;
        }

        const currentDate = formatDayWithoutSeperator();

        // hien thi toi da 3 ngay thoi (20250815 > 20250727)
        const threeDays = calendar.filter(day => day >= currentDate).slice(0, 3); // field max 25

        if (threeDays.length === 0) {
            await interaction.editReply('Không có ngày thi đấu sắp tới nào để hiển thị.');
            return;
        }

        // fetch du lieu cua 3 ngay tren
        const fetchMatchesForDate = async (date) => {
            const api = `http://site.api.espn.com/apis/site/v2/sports/soccer/${tournament}/scoreboard?dates=${date}`;
            const res = await fetch(api);
            if (!res.ok) {
                throw new Error(`API lỗi ngày ${date} với status ${res.status}`);
            }
            return res.json();
        };

        const matchDataArray = await Promise.all(
            threeDays.map(async date => {
                try {
                    const data = await fetchMatchesForDate(date);
                    return { date, data };
                } catch (err) {
                    console.warn(`Lỗi lấy dữ liệu ngày ${date}:`, err);
                    return { date, data: null };
                }
            })
        );

        const listMatch = [];

        matchDataArray.forEach(({ date, data }) => {
            if (!data || !data.events || data.events.length === 0) {
                listMatch.push({ date, match: "Không có trận đấu." });
                return;
            }

            data.events.forEach(event => {
                const matchDateUTC = new Date(event.date);

                // format ngay thanh yyyy-mm-dd theo gio VN
                const yearVN = matchDateUTC.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });

                // format gio thanh => hh:mm
                const matchTimeVN = matchDateUTC.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Ho_Chi_Minh'
                });

                const competitors = event.competitions[0].competitors;
                const homeTeam = competitors.find(c => c.homeAway === 'home').team.displayName; // san nha
                const awayTeam = competitors.find(c => c.homeAway === 'away').team.displayName; // san khach

                listMatch.push({
                    date: separateDate(yearVN),
                    match: `**${matchTimeVN}** | ${homeTeam} vs ${awayTeam}`
                });
            });
        });

        // luu cac tran dau theo ngay
        const matchesByDate = {};
        for (let i = 0; i < listMatch.length; i++) {
            const { date, match } = listMatch[i];
            if (!matchesByDate[date]) {
                matchesByDate[date] = [];
            }
            matchesByDate[date].push(match);
        }

        // tao thanh cac fields de bot reply
        const fields = [];
        for (const date in matchesByDate) {
            if (matchesByDate.hasOwnProperty(date)) {
                fields.push({
                    name: `**📅 Ngày: ${date}**`,
                    value: matchesByDate[date].join('\n'),
                    inline: false
                });
            }
        }

        await interaction.editReply({
            embeds: [
                {
                    title: `⚽ Lịch thi đấu ${tournaments[tournament].name} ⚽`,
                    color: 0x0099ff,
                    fields,
                    thumbnail: {
                        url: linkImg,
                    },
                    footer: {
                        text: 'Giờ hiển thị theo giờ Việt Nam'
                    }
                }
            ]
        });

    } catch (error) {
        console.error('Lỗi khi lấy lịch đá banh:', error);
        await interaction.editReply('Có lỗi xảy ra khi lấy lịch đá banh.');
    }
}