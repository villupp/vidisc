var currentRoundScores;

function getScoreCard(roundId) {
	var xhr = createCORSRequest('GET', 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/round?id=' + roundId);
	if (!xhr) {
		throw new Error('CORS not supported');
	}
	xhr.onload = function () {
		var jsonData = JSON.parse(xhr.responseText);
		currentRoundScores = jsonData;
		// parse to currentRoundScores

		printScorecard(currentRoundScores);
	};
	xhr.onerror = function () {
		console.log('There was an error!');
	};
	xhr.send();
}

function scorecard() {
	var roundId = getUrlParameter('id');
	getScoreCard(roundId);
}

function printScorecard(round) {
	// count course par and create printed string
	var course = round.course;
	var coursePar = 0;
	var coursePrint = course.name;
	var playedAt = new Date(round.playedAt).addHours(4);
	playedAt = playedAt.toLocaleString();
 	for (var i = 0; i < course.holes.length; i++) {
		coursePar += course.holes[i].par;
	}
	if (coursePrint.length > 30) {
		coursePrint = coursePrint.substring(0, 27) + '.. ';
	}
	coursePrint += '<br/>(par ' + coursePar + ')';

	$('#course-container').append(
		'<h4 id="courseprint">' + coursePrint + '</h4>'
		+ '<h4 id="courseprint">' + playedAt + '</h4>'
		);

	$('#scorecard-container').append(
		'<div id="scrollwrapper">'
		+ '<div id="tablescroll">'
		+ '<table id="scorecard-table" class="table table-responsive">'
		+ '<tbody id="scorecard-tbody">'
		+ '</tbody>'
		+ '</table>'
		+ '</div>'
		+ '</div>'
		);
	// Headers for scorecard
	$('#scorecard-tbody').append(
		'<tr id="headers">'
		+ '<th>Hole<br/>(par)</th>'
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
		var holePar = round.course.holes[i].par;
		$('#scorecard-tbody').append(
			'<tr id="hole' + i + '">'
			+ '<th>' + (i + 1) + '(' + holePar + ')</th>'
			+ '</tr>'
			);
		for (var j = 0; j < round.players.length; j++) {
			var score = round.players[j].scores[i];
			var bgcolor = getScoreColor(score, holePar, true);
			$('#hole' + i).append(
				'<td style="background-color: ' + bgcolor + '">'
				+ score
				+ '</td>'
				);
		}

	}
	// Results
	$('#scorecard-tbody').append(
		'<tr id="totals">'
		+ '<th>par ' + coursePar + '</th>'
		+ '</tr>'
		);
	for (var i = 0; i < round.players.length; i++) {
		var playerTotalScore = 0;
		var prefix = "";
		for (var j = 0; j < round.players[i].scores.length; j++) {
			playerTotalScore += round.players[i].scores[j];
		}
		if (playerTotalScore < coursePar) prefix = "-";
		else if (playerTotalScore > coursePar) prefix = "+";

		$('#totals').append(
			'<th>' + playerTotalScore + '(' + prefix + Math.abs(playerTotalScore - coursePar) + ')</th>'
			);
	}
}