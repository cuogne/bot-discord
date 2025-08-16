import { getTodayAndYesterday } from "./getTodayAndYesterday.js";

const TOURNAMENTS = {
    'eng.1': { name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    'esp.1': { name: 'La Liga', flag: '🇪🇸' },
    'ger.1': { name: 'Bundesliga', flag: '🇩🇪' },
    'ita.1': { name: 'Serie A', flag: '🇮🇹' },
    'fra.1': { name: 'Ligue 1', flag: '🇫🇷' },
};

export async function footballScoreCommand(interaction) {
    await interaction.deferReply();

    const listDate = Object.values(getTodayAndYesterday()); // [yesterday, today]
    const tournaments = Object.keys(TOURNAMENTS); // [ 'eng.1', 'esp.1', 'ger.1', 'ita.1', 'fra.1' ]
    const listScoreOfMatch = [];

    try {
        const fetchPromises = [];

        for (const tournament of tournaments) {
            for (const date of listDate) {
                const link = `http://site.api.espn.com/apis/site/v2/sports/soccer/${tournament}/scoreboard?dates=${date}`;
                fetchPromises.push(
                    fetch(link)
                        .then(response => response.json())
                        .then(data => ({ data, tournament, date }))
                );
            }
        }

        const results = await Promise.all(fetchPromises);

        for (const result of results) {
            const { data, tournament } = result;

            if (!data.events || data.events.length === 0) {
                continue;
            }

            for (const event of data.events) {
                const matchDateUTC = new Date(event.date);
                const dayMatchVN = matchDateUTC.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }); // dd/mm/yyyy
                const hourMatchVN = matchDateUTC.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Ho_Chi_Minh'
                }); // hh:mm

                const currentDate = new Date().toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
                const currentHour = new Date().toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Ho_Chi_Minh'
                });

                if (currentDate < dayMatchVN || (currentDate === dayMatchVN && currentHour < hourMatchVN)) {
                    /*
                    Trận cùng ngày chưa diễn ra hoặc trận đấu của ngày hôm sau 
                    (02h00 16/8 và 22h00 16/8 => trận 22h chưa đá nếu hiện tại là 15h00)
                    Do giờ đá trong lịch theo giờ nước anh nên khi chuyển đổi sang giờ VN sẽ có vài trận bị lệch ngày
                    */
                    continue;
                }

                const homeTeam = event.competitions[0].competitors.find(c => c.homeAway === 'home').team.displayName;
                const awayTeam = event.competitions[0].competitors.find(c => c.homeAway === 'away').team.displayName;

                const scoreHome = event.competitions[0].competitors.find(c => c.homeAway === 'home').score;
                const scoreAway = event.competitions[0].competitors.find(c => c.homeAway === 'away').score;

                listScoreOfMatch.push({
                    tournament: TOURNAMENTS[tournament].name,
                    date: dayMatchVN,
                    time: hourMatchVN,
                    homeTeam,
                    scoreHome,
                    awayTeam,
                    scoreAway
                });
            }
        }

        const matchesByTournament = {};
        for (const match of listScoreOfMatch) {
            const tournamentCode = Object.keys(TOURNAMENTS).find(key => TOURNAMENTS[key].name === match.tournament);

            if (!matchesByTournament[tournamentCode]) {
                matchesByTournament[tournamentCode] = [];
            }

            // Format: {Manchester United 1000 - 0 Manchester City}
            matchesByTournament[tournamentCode].push(
                `**${match.homeTeam}** ${match.scoreHome} - ${match.scoreAway} **${match.awayTeam}**`
            );
        }

        const fields = [];
        for (const tournamentCode in matchesByTournament) {
            fields.push({
                name: ` ${TOURNAMENTS[tournamentCode].flag} ${TOURNAMENTS[tournamentCode]?.name}`,
                value: matchesByTournament[tournamentCode].join('\n'),
                inline: false
            });
        }

        await interaction.editReply({
            embeds: [
                {
                    title: '⚽ Tỉ số ⚽',
                    color: 0x0099ff,
                    fields,
                    footer: {
                        text: 'Dữ liệu cập nhật lúc ' + new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
                    }
                }
            ],
            ephemeral: true
        });

    } catch (error) {
        await interaction.editReply('Có lỗi xảy ra khi lấy tỉ số bóng đá.');
        console.error(error);
    }
}