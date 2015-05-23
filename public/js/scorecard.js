var currentRoundScores = getCookie('currentRoundScores');

function scorecard() {
	console.log(currentRoundScores);
	$('course-container').append(currentRoundScores);
}