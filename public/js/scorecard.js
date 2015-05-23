var currentRoundScores = getCookie('currentRoundScores');

function scorecard() {
	//console.log(currentRoundScores);
	currentRoundScores = JSON.parse(currentRoundScores);
	//onsole.log(currentRoundScores);
	//console.log(currentRoundScores.playedAt);
	printScorecard(currentRoundScores);
}

function printScorecard(round) {
	// count course par and create printed string
	var course = round.course;
	var par = 0;
	var coursePrint = course.name;
	for (var i = 0; i < course.holes.length; i++) {
		par += course.holes[i].par;
	}
	if (coursePrint.length > 21) {
		coursePrint = coursePrint.substring(0, 19) + '.. ';
	}
	coursePrint += ' (par ' + par + ')';

	$('#course-container').append(
		'<h4 id="courseprint">' + coursePrint + '</h4>'
		+ '<h4 id="courseprint">' + round.playedAt + '</h4>'
	);

	$('#scorecard-container').append(
		'<table id="scorecard-table" class="table table-responsive">'
		+ '<tbody id="scorecard-tbody">'
		+ '</tbody>'
		+ '</table>'
	);
	// Headers for scorecard
	$('#scorecard-tbody').append(
		'<tr id="headers">'
		+ '<th>Hole (par)</th>'
		+ '</tr>'
	);
	for (var i = 0; i < round.players.length; i++) {
		var playerName = round.players[i].player.name;
		if (playerName.length > 12) {
			playerName = playerName.substring(0, 9) + '..';
		}
		$('#headers').append(
			'<th>' + playerName + '</th>'
		);
	}
	// PlayerScores
	for (var i = 0; i < round.course.holes.length; i++) {
		$('#scorecard-tbody').append(
			'<tr id="hole' + i + '">'
			+ '<th>' + (i + 1) + '(' + round.course.holes[i].par + ')</th>'
			+ '</tr>'
		);
		for (var j = 0; j < round.players.length; j++) {
			$('#hole' + i).append(
				'<td>'
				+ round.players[j].scores[i]
				+ '</td>'
			);
		}
		
	}
	// Results
}