var rounds = [{}];

function scorecards() {
	initScorecardList()
}

function initScorecardList() {
    var xhr = createCORSRequest('GET', 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/rounds');
    if (!xhr) {
        throw new Error('CORS not supported');
    }
    xhr.onload = function() {
    	//console.log(xhr.responseText);
        var jsonData = JSON.parse(xhr.responseText);
        //console.log(jsonData);
        rounds = jsonData;
        printScorecardsList();
    };
    xhr.onerror = function() {
        console.log('There was an error!');
    };
    xhr.send();
}

function printScorecardsList() {
	for (var i = 0; i < rounds.length; i++) {
		var totalsString = countTotals(rounds[i]);
		var playedAt = new Date(rounds[i].playedAt).addHours(4).toLocaleString();
		console.log(totalsString);
		$('#scorecards-list').append(
			'<a class="list-group-item list-group-item-info" href="javascript:void(0)" onClick="goToScoreCard(' + i + ')">'
			+ '<h4 class="list-title">' + rounds[i].course.name
			+ '<br/><small>'
			+ playedAt
			+ '</small><br/>'
			+ '<small>'
			+ totalsString
			+ '</small></h4>'
			+ '</a>'
		);
	}
}

function goToScoreCard(roundIndex) {
	setCookie('currentRoundScores', JSON.stringify(rounds[roundIndex]));
	window.location.href = "/scorecard.html";
}

function countTotals(round) {
	var courseTotalPar = 0;
	var totalsString = "";
	for (var i = 0; i < round.course.holes.length; i++) {
		courseTotalPar += round.course.holes[i].par;
	}
	console.log("course par : " + courseTotalPar);
	for (var i = 0; i < round.players.length; i++) {
		var playerTotalStr = "";
		var prefix = "";
		var playerTotal = "";
		var playerTotalScore = 0;
		for (var j = 0; j < round.players[i].scores.length; j++) {
			playerTotalScore += round.players[i].scores[j];
		}
		if (playerTotalScore > courseTotalPar) prefix = "+";
		else if (playerTotalScore < courseTotalPar) prefix = "-";
		console.log('prefix : ' + prefix);
		console.log('name : ' + round.players[i].player.name);
		console.log('playertotalscore : ' + playerTotalScore);
		playerTotal = round.players[i].player.name 
		playerTotal += " ";
		playerTotal += prefix 
		playerTotal += Math.abs(playerTotalScore - courseTotalPar)
		playerTotal += (i == (round.players.length-1)) ? "" : ", ";
		totalsString += playerTotal;
		console.log("playerTotal : " + playerTotal);
	}
	return totalsString;
}