var currentRoundScores = getCookie('currentRoundScores');

function scorecard() {
	console.log(currentRoundScores);
	currentRoundScores = JSON.parse(currentRoundScores);
	console.log(currentRoundScores);
	console.log(currentRoundScores.playedAt);
}