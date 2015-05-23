var currentRoundScores = getCookie('currentRoundScores');

function scorecard() {
	currentRoundScores = JSON.parse(currentRoundScores);
	console.log(currentRoundScores);
	console.log(currentRoundScores.playedAt);
	$('course-container').append(currentRoundScores);
}