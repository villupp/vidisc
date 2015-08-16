var players = [];

function getPlayers() {
  var getPlayersRequest = DGAPIService.getPlayers();
	getPlayersRequest.done(function (resPlayers) {
    players = resPlayers;
    printPlayerSelection();
	});
	getPlayersRequest.fail(onRESTError)
}

function printPlayerSelection() {
  $('#players-list-container').empty();
  for (var i = 0; i < players.length; i++) {
    $('#players-list-container').append(
      '<button class="btn btn-primary btn-block" onClick="javascript:window.location.href=\'stats/player?id='
      + players[i].id + '\'">' + players[i].name + '</button>'
      );
  };
}

function goToPlayerStats(playerId) {
  window.location.href = '/stats/player?id=' + playerId;
}

$(document).ready(function () {
  getPlayers();
});