var rounds = [];
var courses = [];
var players = [];
var playerRounds = [];
var playerId = getUrlParameter('id');

function getRounds() {
    var xhr = createCORSRequest('GET', 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/rounds');
    if (!xhr) {
        throw new Error('CORS not supported');
    }
    xhr.onload = function() {
        rounds = JSON.parse(xhr.responseText);
        fillStats();
    };
    xhr.onerror = function() {
        console.log('There was an error!');
    };
    xhr.send();
}

function fillStats() {
	parsePlayerRounds();
	parsePlayerRoundCourses();


}

function parsePlayerRoundCourses() {
	for (var i = 0; i < playerRounds.length; i++) {
		// adds courses in round to courses var
		var found = false;
		for(var j = 0; j < courses.length; j++) {
		    if (courses[j].id == playerRounds[i].course.id) {
		        found = true;
		        break;
		    }
		}
		if (found == false || courses.length == 0) {
			courses.push(playerRounds[i].course);
		}
	}
	for (var i = 0; i < courses.length; i++) {
		$('#main-container').append(
			'<div id="' + courses[i].id + '" class="course"></div>'
		);
	}
	printStats();
}

function parsePlayerRounds() {
	var spliceTheseRounds = [];
	for (var i = 0; i < rounds.length; i++) {
		var spliceThese = [];
		for (var j = 0; j < rounds[i].players.length; j++) {
			//log("---------------- playercount: " + rounds[i].players.length+  " ----------------");
			//log("index: " + i + " playerid: " + parseInt(playerId) + " roundsplayerid: " + rounds[i].players[j].player.id);
			if (parseInt(playerId) != rounds[i].players[j].player.id) {
				spliceThese.push(j);
			}
			//log("i: " + i + " player count: " + rounds[i].players.length);
		}
		for (var j = (spliceThese.length-1); j >= 0; j--) {
 			rounds[i].players.splice(spliceThese[j], 1);
		}
		log(rounds[i].course.name);
		if (rounds[i].players.length == 0) {
			spliceTheseRounds.push(i);
		}
		
	}
	for (var i = (spliceTheseRounds.length-1); i >= 0; i--) {
		rounds.splice(spliceTheseRounds[i], 1);
	}
	for (var i = 0; i < rounds.length; i++) {
		playerRounds.push(new Object({
			course: rounds[i].course,
			playedAt: rounds[i].playedAt,
			scores: rounds[i].players[0].scores
			})
		);
	}
	log('splicing done');
}

function printStats() {
	for (var i = 0; i < courses.length; i++) {
		// for every course
		var coursePar = getCoursePar(courses[i].holes);
		$('#' + courses[i].id + '.course').append(
			'<div class="course-title"><h5>' + courses[i].name + '</h5></div>'
		);
		// total round scores for a single playerround
		var courseTotals = [];
		for (var j = 0; j < playerRounds.length; j++) {
			if (playerRounds[j].course.id == courses[i].id) {
				courseTotals.push(countSum(playerRounds[j].scores));
			}
		};
		//log ('Totals for course: ' + courseTotals.length + ' scores; ' + courses[i].name + ': ' + JSON.stringify(courseTotals));
		//log(countAvg(courseTotals));
		var avgCourseScore = countAvg(courseTotals);
		var roundedAvgCourseScore = Math.round( avgCourseScore * 100 ) / 100;
		var prefix = '';
		var avgCourseScoreDiff = Math.abs(avgCourseScore - coursePar);
		var roundedAvgCourseScoreDiff = Math.round( avgCourseScoreDiff * 100 ) / 100;
		if (avgCourseScore < coursePar) prefix = '-';
		else if (avgCourseScore > coursePar) prefix = '+';
		$('#' + courses[i].id + '.course').append(
			'<div class="course-totalavg">Average score for course: ' + roundedAvgCourseScore + ' (' + prefix + roundedAvgCourseScoreDiff + ')</div>'
		);

	};
}

function getPlayerRound() {
}



function log(msg) {
	console.log(msg);
}

$(document).ready(function () {
	getRounds();
});
