var currentRoundScores = getCookie('currentRoundScores');

function scorecard() {
	console.log(JSON.parse(currentRoundScores));
	console.log(currentRoundScores.playedAt);
	$('course-container').append(currentRoundScores);
}