var currentRoundScores = getCookie('currentRoundScores');

function scorecard() {
	console.log(JSON.parse(currentRoundScores));
	$('course-container').append(currentRoundScores);
}