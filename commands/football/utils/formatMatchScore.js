export function formatMatchScore(homeTeam, scoreHome, scoreAway, awayTeam) {
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