var players = [];

function getPlayers() {
    var xhr = createCORSRequest('GET', 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/players');
    if (!xhr) {
        throw new Error('CORS not supported');
    }
    xhr.onload = function() {
        players = JSON.parse(xhr.responseText);
        printPlayerSelection();
    };
    xhr.onerror = function() {
        console.log('There was an error!');
    };
    xhr.send();
}

function printPlayerSelection() {
	for (var i = 0; i < players.length; i++) {
		$('#players-list-container').append(
			//'<button class="btn btn-block btn-primary" onClick="javascript:window.location.href=\'player-statistics.html?id=' 
			//+ players[i].id + '\'">' + players[i].name + '</button>'
			'<a class="list-group-item list-group-item-info" href="javascript:window.location.href=\'player-statistics.html?id=' 
			+ players[i].id + '\'">' + players[i].name + '</a'
		);
	};
}

function goToPlayerStats(playerId) {
	window.location.href = '/player-statistics.html?id=' + playerId;
}

$(document).ready(function() {
	getPlayers();
});

//<button class="btn btn-block btn-primary" onClick="javascript:window.location.href='player-statistics.html?id=6'">Players</button>