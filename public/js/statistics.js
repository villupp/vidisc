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
        parseData();
    };
    xhr.onerror = function() {
        console.log('There was an error!');
    };
    xhr.send();
}

function parseData() {
	
}

function printScorecardsList() {
	for (var i = 0; i < rounds.length; i++) {
		var totalsString = countTotals(rounds[i]);
		var playedAt = new Date(rounds[i].playedAt).addHours(4).toLocaleString();
		//console.log(totalsString);
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