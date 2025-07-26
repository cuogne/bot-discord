function formatDayWithoutSeperator() {
    const today = new Date();
    const todayStr = today.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh'
    }).split(" ")[1];

    const [day, month, year] = todayStr.split('/')

    return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`
}

export async function footballCommand(interaction) {
    await interaction.deferReply();

    let date = formatDayWithoutSeperator();

    if (date !== '20250815') {
        date = '20250815'
    }

    const api = `http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=${date}`
    const response = await fetch(api);
    const dataMatch = await response.json();

    if (!dataMatch.events || !dataMatch.events.length) {
        console.log("Không có trận nào trong ngày này.");
        return;
    }

    const listMatch = [];
    dataMatch.events.forEach(event => {
        const matchDate = new Date(event.date);
        matchDate.setHours(matchDate.getHours());
        const matchTimeVN = matchDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Ho_Chi_Minh'
        });

        const competitors = event.competitions[0].competitors;
        const homeTeam = competitors.find(c => c.homeAway === 'home').team.displayName;
        const awayTeam = competitors.find(c => c.homeAway === 'away').team.displayName;

        listMatch.push(`${matchTimeVN} VN | ${homeTeam} vs ${awayTeam}`);
    });
    interaction.editReply(`Ngày: ${date} \n${listMatch.join('\n')}`);
}