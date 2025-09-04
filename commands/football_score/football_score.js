import { getTodayAndYesterday } from "./getTodayAndYesterday.js";

const TOURNAMENTS = {
    'eng.1': { name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    'esp.1': { name: 'La Liga', flag: '🇪🇸' },
    'ger.1': { name: 'Bundesliga', flag: '🇩🇪' },
    'ita.1': { name: 'Serie A', flag: '🇮🇹' },
    'fra.1': { name: 'Ligue 1', flag: '🇫🇷' },
    'uefa.champions': { name: 'UEFA Champions League', flag: '🏆' },
    'uefa.europa': { name: 'UEFA Europa League', flag: '🏆' }
};

function formatDate(date) {
    const newDate = new Date(date);
    const dayObj = newDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }).split('/');
    const day = `${dayObj[0].padStart(2, '0')}/${dayObj[1].padStart(2, '0')}/${dayObj[2]}`;

    const hour = newDate.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh'
    }); // hh:mm

    return { day, hour };
}

function formatMatchScore(homeTeam, scoreHome, scoreAway, awayTeam) {
    const teamMaxLength = 22; // độ dài tối đa tên đội
    const scoreLength = 7;

    const homeShort = homeTeam.length > teamMaxLength
        ? homeTeam.substring(0, teamMaxLength - 2) + '..'
        : homeTeam;

    const awayShort = awayTeam.length > teamMaxLength
        ? awayTeam.substring(0, teamMaxLength - 2) + '..'
        : awayTeam;

    const homePadded = homeShort.padEnd(teamMaxLength);

    const rawScore = `${scoreHome} - ${scoreAway}`;
    const score = rawScore
        .padStart(Math.floor((scoreLength + rawScore.length) / 2))
        .padEnd(scoreLength);

    const awayPadded = awayShort.padEnd(teamMaxLength);

    return `\`${homePadded} ${score} ${awayPadded}\``;
}

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
                // Thời gian của trận đấu theo giờ VN
                const { day: dayMatchVN, hour: hourMatchVN } = formatDate(event.date);

                // thời gian kết thúc của trận đấu (giờ đá + 2h)
                const endMatchDate = new Date(event.date);
                endMatchDate.setHours(endMatchDate.getHours() + 2);

                // thời gian hiện tại
                const now = new Date();

                if (now < endMatchDate) {
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
                formatMatchScore(match.homeTeam, match.scoreHome, match.scoreAway, match.awayTeam)
            );
        }

        if (Object.keys(matchesByTournament).length === 0) {
            await interaction.editReply('Không có trận đấu nào trong tối qua hoặc rạng sáng nay.');
            return;
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
                    title: `⚽ Tỉ số các trận đấu đêm qua và rạng sáng nay ⚽`,
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