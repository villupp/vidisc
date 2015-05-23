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

function game() {
	console.log("initializing game...");
	playerIDs = getCookie('currentPlayers').split(',');
	console.log(playerIDs);
	if (playerIDs == "" ) {
		console.log("No current players, redirecting to initgame.html");
		window.location.href='/initgame.html';
	}
	courseID = getCookie('currentCourse');
	if (courseID == "") {
		console.log("No current course, redirecting to initgame.html");
		window.location.href='/initgame.html';
	}
	initCourse();
}

function initCourse() {
	var requestURL = 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/course?id=' + courseID;
    var xhr = createCORSRequest('GET',  requestURL);
    if (!xhr) {
        throw new Error('CORS not supported');
    }
    xhr.onload = function() {
        var jsonData = JSON.parse(xhr.responseText);
        //console.log(jsonData);
        course = jsonData;
        printCourse();
        initPlayers();
        printPlayerTable();
    };
    xhr.onerror = function() {
        console.log('There was an error!');
    };
    xhr.send();
}

function initPlayers() {
	var f = (function(){
        var xhr = [];
        for (i = 0; i < playerIDs.length; i++) {
            (function (i) {
            	var requestURL = 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/player?id=' + playerIDs[i];
                xhr[i] = createCORSRequest('GET',  requestURL);
			    if (!xhr) {
			        throw new Error('CORS not supported');
			    } 
			    xhr[i].onreadystatechange = function() {
    				if (xhr[i].readyState == 4 && xhr[i].status == 200) {
        				var jsonData = JSON.parse(xhr[i].responseText);
        				//console.log(jsonData);
	        			players[i] = jsonData;
	        			//console.log("players l : " + players.length + ", ids l : " + playerIDs.length);

						var id = -1;
						var scores = [];
						for (var j = 0; j < course.holes.length; j++) {
							scores[j] = course.holes[j].par;
						}
						playerScores[i] = { id : players[i].id, pscores : scores };
						//console.log(playerScores[i].pscores);
						refreshTable();
    				}
				};
        	    /*xhr[i].onload = function() {
	       			var jsonData = JSON.parse(xhr[i].responseText);
        			//console.log(jsonData);
	        		players[i] = jsonData;
	        		//console.log("players [i] : " + players[i]);
	        		if ( i == (playerIDs.length-1) )
	        			printPlayers();
	    		};*/
                xhr.onerror = function() {
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
		+ '<button id="minus" class="btn btn-primary right" onClick="changeHole(-1)"><span class="glyphicon glyphicon-chevron-left"></span></button>'
		+ '<button id="plus" class="btn btn-primary right" onClick="changeHole(1)"><span class="glyphicon glyphicon-chevron-right"></span></button>'
		+ '</div>'
	);
	refreshHole();
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
		//console.log("json : " + JSON.stringify(players[i]));
		//console.log("player ID : " + players[i].id + ", i : " + i);
		//console.log("holes length : " + course.holes.length);
		//console.log("playerscores : " + JSON.stringify(playerScores[i]));

		$('#scoretable').append(
			'<tr id="' + playerIDs[i] + '">'
			+ '<td id="namecell" class="center-y">'
			+ 'loading'
			+ '</td>'
			+ '<td id="scorecell" class="center-x">'
			+ 'loading'
			+ '</td>'
			+ '<td id="minuscell">'
			+ '<button id="pminusbtn" class="btn btn-primary" onClick="changeScore(' + playerIDs[i] + ', -1)"><span class="glyphicon glyphicon-chevron-left"></span></button>'
			+ '</td>'
			+ '<td id="pluscell">'
			+ '<button id="pplusbtn" class="btn btn-primary" onClick="changeScore(' + playerIDs[i] + ', 1)"><span class="glyphicon glyphicon-chevron-right"></span></button>'
			+ '</td>'
			+ '</tr>'
		);
	}
}

function refreshTable() {
	for (var i = 0; i < players.length; i++) {
		if (players[i] != null) {
			var playerScoreRes = $.grep(playerScores, function(e){ if (e != null) return e.id == players[i].id; });
			var playerScore = playerScoreRes[0].pscores[(currentHole-1)];
			var currentPar = course.holes[currentHole-1].par;
			if ( playerScore == 1 ) {
				$('#' + players[i].id).find('#pminusbtn').attr("disabled", true);
			} else {
				$('#' + players[i].id).find('#pminusbtn').attr("disabled", false);
			}

			var printName = players[i].name;
			if (printName.length > 20) printName = printName.substring(0, 18) + '..';
			$('#' + players[i].id).find('#namecell').empty().append(
				'<h4 id="name">'
				+ printName
				+ '</h4>'
			);
			if (playerScoreRes[0] != null) {
				var color = "#00FF00"; //green (par)
				if ( playerScore == 1 ) {
					color = "#FF1493"; //holeinone
				} else if ( playerScore < currentPar ) {
					color = "#0000FF"; //blue ( < 0 )
				} else if ( playerScore == (currentPar + 1) ) {
					color = "#FFA500"; //primary ( +1 )
				} else if ( playerScore > (currentPar + 1) ) {
					color = "#FF0000"; //red ( > +1 )
				}
				$('#' + players[i].id).find('#scorecell').empty().append(
					'<h3 style="color: ' + color + ';">'
					+ playerScoreRes[0].pscores[(currentHole-1)]
					+ '</h3>'
				);
			}
		}
	}
}

function refreshHole() {
	//console.log(currentHole);
	if ( currentHole == 1 ) {
		$('#minus').attr("disabled", true);
	} else {
		$('#minus').attr("disabled", false);
	}
	if ( currentHole == course.holes.length ) {
		$("#plus").html('<span class="glyphicon glyphicon-align-justify"></span>');
		$("#plus").attr('onclick', 'submitScores()');
	} else {
		$("#plus").html('<span class="glyphicon glyphicon-chevron-right"></span>');
		$("#plus").attr('onclick', 'changeHole(1)');
	}

	$('#hole').empty()
		.append(
			'Hole ' 
			+ currentHole 
			+ ' (' 
			+ course.holes[currentHole-1].lengthm 
			+ 'm)'
		);
	$('#par').empty()
		.append(
			'par ' 
			+ course.holes[currentHole-1].par
		);
}

function changeScore(playerid, dir) {
	//console.log("changing score")
	var result = $.grep(playerScores, function(e){ if (e != null) return e.id == playerid; });
	if (dir == -1) {
		result[0].pscores[(currentHole-1)] -= 1;
	} else if (dir == 1) {
		result[0].pscores[(currentHole-1)] += 1;
	}
	$('#pplusbtn').blur();
	$('#pminusbtn').blur();
	refreshTable();
}

function changeHole(dir) {
	if (dir == -1) {
		currentHole -= 1;
	} else if (dir == 1) {
		currentHole += 1;
	}
	$('#plus').blur();
	$('#minus').blur();
	refreshHole();
	refreshTable();
}

// pID:1,2,3,4,5,6,7,8,9;pID:1,2,3,4,5,6,7,8,9;pID:1,2,3,4,5,6,7,8,9;

function submitScores() {
	if ( confirm('Are you sure you want to submit these scores?') ) {
    	console.log(playerScores);
    	var playerScoreStr = "";
    	for (var i = 0; i < playerScores.length; i++) {
    		playerScoreStr += playerScores[i].id + ":";
    		for (var j = 0; j < playerScores[i].pscores.length; j++) {
    			playerScoreStr += playerScores[i].pscores[j];
    			if (j != ( playerScores[i].pscores.length -1 ) ) {
    				playerScoreStr += ",";
    			}
    		}
    		playerScoreStr += ";";
    	}
    	console.log("Sending scores, score string : \"" + playerScoreStr + "\"");
    	var data = { scores : playerScoreStr, courseID : courseID};
    	var url = 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/addroundscore';
    	$.ajax({
  			type: 'POST',
			url: url,
		    data: data,
			success: function(roundObject) {
				//var roundJSON = JSON.parse(roundObject);
				console.log(roundObject);
				setCookie('currentRoundScores', roundObject, 30);
				alert("Scores sent succesfully.");
				window.location.href = '/scorecard.html';
			},
			error: function(error) {
				console.log("Error occured when sending scores: " + error.responseText);
				//console.log("Scores saved in cookie");
				//setCookie('currentRoundScores', result, 30);
			},
			async: true
		});

		/*
	    var xhr = createCORSRequest('POST',  url);
	    if (!xhr) {
	        throw new Error('CORS not supported');
	    }
	    xhr.onload = function() {
	        var jsonData = JSON.parse(xhr.responseText);
	        console.log(jsonData);
	    };
	    xhr.onerror = function() {
	        console.log('There was an error!');
	    };
	    xhr.send();
	    */
	} else {
   		alert("Scores were not sent.");
	}
}

$(document).ready(function() {

});