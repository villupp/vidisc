var currentRoundScores = getCookie('currentRoundScores');

function scorecard() {
	console.log(JSON.stringify(currentRoundScores));
	console.log(currentRoundScores.playedAt);
	$('course-container').append(currentRoundScores);
}