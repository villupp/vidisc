var rounds = [];

function scorecards() {
	initScorecardList()
}

function initScorecardList() {
	var xhr = createCORSRequest('GET', 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/rounds');
	if (!xhr) {
		throw new Error('CORS not supported');
	}
	xhr.onload = function () {
		//console.log(xhr.responseText);
		var jsonData = JSON.parse(xhr.responseText);
		//console.log(jsonData);
		rounds = jsonData;
		printScorecardsList();
	};
	xhr.onerror = function () {
		console.log('There was an error!');
	};
	xhr.send();
}

function printScorecardsList() {
	$('#scorecards-list').empty();
	for (var i = 0; i < rounds.length; i++) {
		var totalsString = countTotals(rounds[i]);
		var playedAt = new Date(rounds[i].playedAt).addHours(4).toLocaleString();
		//console.log(totalsString);
		$('#scorecards-list').append(
			'<a class="list-group-item list-group-item-info" href="javascript:void(0)" onClick="goToScoreCard(' + rounds[i].id + ')">'
			+ '<h5 class="list-title">' + rounds[i].course.name
			+ '<br/><small>'
			+ playedAt
			+ '</small><br/>'
			+ '<small>'
			+ totalsString
			+ '</small></h5>'
			+ '</a>'
			);
	}
}

function goToScoreCard(roundId) {
	//setCookie('currentRoundScores', JSON.stringify(rounds[roundIndex]));
	window.location.href = "/scores/scorecard?id=" + roundId;
}

function countTotals(round) {
	var courseTotalPar = 0;
	var totalsString = "";
	// counting rounds course total par
	for (var i = 0; i < round.course.holes.length; i++) {
		courseTotalPar += round.course.holes[i].par;
	}
	// creating totalscores string using each players total
	if (round.players != null) {
		for (var i = 0; i < round.players.length; i++) {
			var prefix = "";
			var playerTotal = "";
			var playerTotalScore = 0;
			// players total score
			for (var j = 0; j < round.players[i].scores.length; j++) {
				playerTotalScore += round.players[i].scores[j];
			}
			// prefix +/-
			if (playerTotalScore > courseTotalPar) prefix = "+";
			else if (playerTotalScore < courseTotalPar) prefix = "-";
			// "<name> <prefix><Math.abs(playerscore-coursepar)>(, )"
			playerTotal = round.players[i].player.name
			playerTotal += " ";
			playerTotal += prefix
			playerTotal += Math.abs(playerTotalScore - courseTotalPar)
			playerTotal += (i == (round.players.length - 1)) ? "" : ", ";
			totalsString += playerTotal;
		}
	}
	return totalsString;
}