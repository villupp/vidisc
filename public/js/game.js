// id's from cookies
var playerIDs = [];
var courseID = -1;

// printables
var course = {};
var players = [];

// player scores ("id" : [ scores ])
var playerScores = [{}];

// current hole
var currentHole = 1;

// current coursepar
var coursePar = 0;

function game() {
	playerIDs = getCookie('currentPlayers').split(',');
	if (playerIDs.length == 0) {
		console.log("No current players, redirecting to initgame.html");
		window.location.href = '/initgame.html';
	}
	var courseID = getCookie('currentCourse');
	if (courseID.length == 0) {
		console.log("No current course, redirecting to initgame.html");
		window.location.href = '/initgame.html';
	}
	initCourse();
}

function initCourse() {
	var requestURL = 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/course?id=' + courseID;
	var xhr = createCORSRequest('GET', requestURL);
	if (!xhr) {
		throw new Error('CORS not supported');
	}
	xhr.onload = function () {
		var jsonData = JSON.parse(xhr.responseText);
		course = jsonData;
		for (var i = 0; i < course.holes.length; i++) {
			coursePar += course.holes[i].par;
		}
		var curHoleTmp = getCookie('currentHole');
		if (curHoleTmp != '') {
			currentHole = parseInt(curHoleTmp);
		} else {
			currentHole = 1;
		}
		printCourse();
		initPlayers();
		printPlayerTable();
	};
	xhr.onerror = function () {
		console.log('There was an error!');
	};
	xhr.send();
}

function initPlayers() {
	(function () {
    var xhr = [];
    for (var i = 0; i < playerIDs.length; i++) {
      (function (i) {
				var requestURL = 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/player?id=' + playerIDs[i];
        xhr[i] = createCORSRequest('GET', requestURL);

				if (!xhr) {
		        throw new Error('CORS not supported');
				}

				xhr[i].onreadystatechange = function () {
					if (xhr[i].readyState == 4 && xhr[i].status == 200) {
						var jsonData = JSON.parse(xhr[i].responseText);
						players[i] = jsonData;
	  				
						// init player scores
						var scores = [];

						// if no save game
						var curSavedScoresTmp = getCookie('currentSavedScores');
						if (curSavedScoresTmp == '') {
							console.log('No save game found, starting new game...');
							for (var j = 0; j < course.holes.length; j++) {
								scores[j] = course.holes[j].par;
							}
						} else { // save game found
							console.log('Save game found, loading...');
							var savedScores = JSON.parse(curSavedScoresTmp);
							scores = savedScores[i].pscores;
						}
						playerScores[i] = { id: players[i].id, pscores: scores };

						refreshTable();
					}
				};

        xhr.onerror = function () {
					console.log('There was an error!');
				};

				xhr[i].send();

			})(i);
    }
	})();
}

function printCourse() {
	// count course par and create printed string
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
		+ '<div id="leftdiv">'
		+ '<h4 id="hole">Loading...</h4>'
		+ '<h4 id="par">Loading...</h4>'
		+ '</div>'
		+ '<div id="rightdiv">'
		+ '<button id="plus" class="btn btn-lg btn-primary right" onClick="changeGameHole(1)"><span class="glyphicon glyphicon-chevron-right"></span></button>'
		+ '<button id="minus" class="btn btn-lg btn-primary right" onClick="changeGameHole(-1)"><span class="glyphicon glyphicon-chevron-left"></span></button>'
		+ '</div>'
		);
	refreshGameHole();
}

function printPlayerTable() {
	$('#playerscores-container').append(
		'<div id="scrollwrapper">'
		+ '<div id="tablescroll">'
		+ '<table id="scoretable" class="table borderless">'
		+ '</table>'
		+ '</div>'
		+ '</div>'
		);

	for (var i = 0; i < playerIDs.length; i++) {
		$('#scoretable').append(
			'<tr id="' + playerIDs[i] + '">'
			+ '<td id="namecell" class="center-y">'
			+ 'loading'
			+ '</td>'
			+ '<td id="scorecell" class="center-x">'
			+ 'loading'
			+ '</td>'
			+ '<td id="minuscell">'
			+ '<button id="pminusbtn" class="pscore-blur-this btn btn-lg btn-primary" onClick="changeScore(' + playerIDs[i] + ', -1)"><span class="glyphicon glyphicon-chevron-left"></span></button>'
			+ '</td>'
			+ '<td id="pluscell">'
			+ '<button id="pplusbtn" class="pscore-blur-this btn btn-lg btn-primary" onClick="changeScore(' + playerIDs[i] + ', 1)"><span class="glyphicon glyphicon-chevron-right"></span></button>'
			+ '</td>'
			+ '</tr>'
			);
	}
}

function refreshTable() {
	for (var i = 0; i < players.length; i++) {
		if (players[i] != null) {
			var playerScoreRes = $.grep(playerScores, function (e) { if (e != null) return e.id == players[i].id; });
			var playerScore = playerScoreRes[0].pscores[(currentHole - 1)];
			var currentPar = course.holes[currentHole - 1].par;
			// Counting current total score for each player
			var currentTotalScore = 0;
			var prefix = "";
			if (playerScoreRes[0] != null) {
				for (var j = 0; j < playerScoreRes[0].pscores.length; j++) {
					currentTotalScore += playerScoreRes[0].pscores[j];
				}
			}
			if (currentTotalScore < coursePar) prefix = "-";
			else if (currentTotalScore > coursePar) prefix = "+";
			// Disabling + and - when necessary
			if (playerScore == 1) {
				$('#' + players[i].id).find('#pminusbtn').attr("disabled", "true");
			} else {
				$('#' + players[i].id).find('#pminusbtn').attr("disabled", "false");
			}
			// Generating printable player name and score and appending to namecell
			var printName = players[i].name;
			if (printName.length > 20) {
				printName = printName.substring(0, 16) + '..';
			}
			printName += '<br/><h5 style="color: #00FFFF">' + prefix + Math.abs(currentTotalScore - coursePar) + '</h5>';
			$('#' + players[i].id).find('#namecell').empty().append(
				'<h4 id="name">'
				+ printName
				+ '</h4>'
				);
			// Scorecell for hole score
			if (playerScoreRes[0] != null) {
				var color = getScoreColor(playerScore, currentPar, true);
				$('#' + players[i].id).find('#scorecell').empty().append(
					'<font id="score" style="color: ' + color + ';">'
					+ playerScoreRes[0].pscores[(currentHole - 1)]
					+ '</font>'
					);
			}
		}
	}
}

function refreshGameHole() {
	if (currentHole == 1) {
		$('#minus').attr("disabled", "true");
	} else {
		$('#minus').attr("disabled", "false");
	}
	if (currentHole == course.holes.length) {
		$("#plus").html('<span class="glyphicon glyphicon-align-justify"></span>');
		$("#plus").attr('onclick', 'submitScores()');
	} else {
		$("#plus").html('<span class="glyphicon glyphicon-chevron-right"></span>');
		$("#plus").attr('onclick', 'changeGameHole(1)');
	}

	$('#hole').empty()
		.append(
			'Hole '
			+ currentHole
			+ ' ('
			+ course.holes[currentHole - 1].lengthm
			+ 'm)'
			);
	$('#par').empty()
		.append(
			'par '
			+ course.holes[currentHole - 1].par
			);
}

function changeScore(playerid, dir) {
	var result = $.grep(playerScores, function (e) { if (e != null) return e.id == playerid; });
	if (dir == -1) {
		result[0].pscores[(currentHole - 1)] -= 1;
	} else if (dir == 1) {
		result[0].pscores[(currentHole - 1)] += 1;
	}
	$('.pscore-blur-this').each(function () {
		$(this).blur();
	});
	saveScores();
	refreshTable();
}

function saveScores() {
	setCookie('currentSavedScores', JSON.stringify(playerScores), 30);
}

function changeGameHole(dir) {
	if (dir == -1) {
		currentHole -= 1;
	} else if (dir == 1) {
		currentHole += 1;
	}
	$('#plus').blur();
	$('#minus').blur();

	refreshGameHole();
	refreshTable();
	setCookie('currentHole', currentHole, 30);
}

function submitScores() {
	if (confirm('Are you sure you want to submit these scores?')) {
		var playerScoreStr = "";
		for (var i = 0; i < playerScores.length; i++) {
    		playerScoreStr += playerScores[i].id + ":";
    		for (var j = 0; j < playerScores[i].pscores.length; j++) {
				playerScoreStr += playerScores[i].pscores[j];
				if (j != (playerScores[i].pscores.length - 1)) {
					playerScoreStr += ",";
				}
    		}
    		playerScoreStr += ";";
		}
		var data = { scores: playerScoreStr, courseID: courseID };
		var url = 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/addroundscore';
		$.ajax({
			type: 'POST',
			url: url,
		    data: data,
			success: function (roundObject) {
				var roundId = roundObject.id;
				setCookie('currentSavedScores', '', 30);
				setCookie('currentHole', '', 30);
				setCookie('currentPlayers', '', 30);
				window.location.href = "/scorecard.html?id=" + roundId;
			},
			error: function (error) {
				console.log("Error occured when sending scores: " + error.responseText);
			},
		});
	}
}