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
		//log(rounds[i].course.name);
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
}

function printStats() {
	for (var i = 0; i < courses.length; i++) {
		// for every course #courseid.course
		var coursePar = getCoursePar(courses[i].holes);
		$('#' + courses[i].id + '.course').append(
			'<div class="title btn btn-block btn-primary"><h5><b>' + courses[i].name + '</b></h5></div>'
			+ '<div class="content"><div class="hole-stats-container"></div></div>'
		);
		// total round scores for a single playerround
		var courseTotals = [];
		for (var j = 0; j < playerRounds.length; j++) {
			if (playerRounds[j].course.id == courses[i].id) {
				courseTotals.push(countSum(playerRounds[j].scores));
			}
		};
		// avg course scores
		var avgCourseScore = countAvg(courseTotals);
		var roundedAvgCourseScore = Math.round( avgCourseScore * 100 ) / 100;
		var prefix = '';
		var avgCourseScoreDiff = Math.abs(avgCourseScore - coursePar);
		var roundedAvgCourseScoreDiff = Math.round( avgCourseScoreDiff * 100 ) / 100;
		if (avgCourseScore < coursePar) prefix = '-';
		else if (avgCourseScore > coursePar) prefix = '+';
		$('#' + courses[i].id + '.course .content').prepend(
			// total avg
			'<div class="course-totalavg">Avg course score: ' + roundedAvgCourseScore
			// avg + / -
			+ ' (' + prefix + roundedAvgCourseScoreDiff + ')</div><hr/>'
		);
		// hole score charts
		for (var j = 0; j < courses[i].holes.length; j++) {
			var holePar = courses[i].holes[j].par;
			var scoreSet = getHoleScoreSet(courses[i].holes, courses[i].id, j);
			var data = [];
			var totalHoleScoreCount = getTotalHoleScoreCount(scoreSet);
			for (var scoreKey in scoreSet) {
				var scoreCount = scoreSet[scoreKey];
				var color = getScoreColor(scoreKey, holePar);
				var percentage = Math.round((scoreCount / totalHoleScoreCount)*100);
				data.push(new Object({
			        value: scoreCount,
			        color: color,
			        highlight: "#FFC870",
			        label: scoreKey  + ' (' + percentage + '%)'
				}));
			};
			$('#' + courses[i].id + '.course .content .hole-stats-container').append(
				'<div id="' + (j+1) + '" class="hole-stats"><div class="hole-info-container"><h5><b>Hole ' 
				+ (j+1) + '</b></h5>'
				+ '<button id="plus" class="btn btn-lg btn-primary right" onClick="changeHole(1)"><span class="glyphicon glyphicon-chevron-right"></span></button>'
				+ '<button id="minus" class="btn btn-lg btn-primary right" onClick="changeHole(-1)"><span class="glyphicon glyphicon-chevron-left"></span></button>'
				+ '</div>'
				+ '<div class="hole-score-chart-container">'
				+ '<canvas id="' + j +  '" class="hole-score-chart"></canvas></div></div>'
			);
			var ctx = $('#' + courses[i].id + '.course #' + j + '.hole-score-chart').get(0).getContext("2d");
			var holeScoreChart = new Chart(ctx).Pie(data, {
			    segmentShowStroke : true,
			    segmentStrokeColor : "#FFF",
			    segmentStrokeWidth : 1.5,
			});
		};


	};

	$('.content').hide();
	$('.hole-stats').each(function() {
		if ($(this).attr('id') != "1") {
			//$(this).hide();
		}
	})
}

// counts total count of hole scores from scoreset arr
function getTotalHoleScoreCount(scoreSet) {
	var total = 0;
	for (var scoreKey in scoreSet) {
		total += scoreSet[scoreKey];
	}
	return total;
}



// count of every score (in array)
function getHoleScoreSet(holes, courseId, holeIndex) {
	var scoreSet = [];
	for (var i = 0; i < playerRounds.length; i++) {
		if (playerRounds[i].course.id == courseId) {
			var score = playerRounds[i].scores[holeIndex];
			if (scoreSet[score] == null)
				scoreSet[score] = 1;
			else scoreSet[score]++;
		}
	};
	return scoreSet;
}

function log(msg) {
	console.log(msg);
}

$(document).ready(function () {
	getRounds();

	$('body').on('click', '.title', function() {
		$(this).next('.content').slideToggle();
	});


});