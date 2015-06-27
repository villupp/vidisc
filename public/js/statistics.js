var rounds = [];
var courses = [];
var players = [];
var playerRounds = [];
var currentHole = {};
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
		// init current hole
		currentHole[courses[i].id] = 1;
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
		var roundedAvgCourseScorePrefix = '';
		var avgCourseScoreDiff = Math.abs(avgCourseScore - coursePar);
		var roundedAvgCourseScoreDiff = Math.round( avgCourseScoreDiff * 100 ) / 100;
		// total times played
		var totalRoundsPlayed = getTotalTimesPlayedOnCourse(courses[i]);
		// best and worst roundscores
		var totalRoundScoresStats = getTotalRoundScoresStats(courses[i]);
		$('#' + courses[i].id + '.course .content').prepend(''
			// total avg
			+ '<div class="course-stat">Rounds played: ' + totalRoundsPlayed + '</div>'
			+ '<div class="course-stat">Best score: ' 
			+ totalRoundScoresStats.best + ' (' + getScoreDiffPrefix(totalRoundScoresStats.best, coursePar) 
				+ Math.abs(totalRoundScoresStats.best-coursePar) + ')'
			+ '</div>'
			+ '<div class="course-stat">Worst score: ' 
			+ totalRoundScoresStats.worst + ' (' + getScoreDiffPrefix(totalRoundScoresStats.worst, coursePar) 
				+ Math.abs(totalRoundScoresStats.worst-coursePar) + ')'
			+ '</div>'
			+ '<div class="course-stat">Avg course score: ' 
			+ roundedAvgCourseScore + ' (' + getScoreDiffPrefix(avgCourseScore, coursePar) + roundedAvgCourseScoreDiff + ')</div>'
			+'<hr/>'
			// hole line (txt and controls)
			+ '<div class="hole-title">'
			+ '<div class="hole-header"></div>'
			+ '<div class="hole-controls">'
			+ '<button id="minus" class="btn btn-lg btn-primary"><span class="glyphicon glyphicon-chevron-left"></span></button>'
			+ '<button id="plus" class="btn btn-lg btn-primary"><span class="glyphicon glyphicon-chevron-right"></span></button>'
			+ '</div></div>'
		);
		// hole stats
		for (var j = 0; j < courses[i].holes.length; j++) {
			var holePar = courses[i].holes[j].par;
			// pie chart for hole scores
			var scoreSet = getHoleScoreChartData(courses[i].holes, courses[i].id, j);
			var data = [];
			var totalHoleScoreCount = getTotalHoleScoreCount(scoreSet);
			for (var scoreKey in scoreSet) {
				var scoreCount = scoreSet[scoreKey];
				var color = getScoreColor(scoreKey, holePar);
				var percentage = Math.round((scoreCount / totalHoleScoreCount)*100);
				data.push(new Object({
			        value: scoreCount,
			        color: color,
			        highlight: "#AAAAFA",
			        label: scoreKey  + ' (' + percentage + '%)'
				}));
			};
			$('#' + courses[i].id + '.course .content .hole-stats-container').append(
				'<div id="' + (j+1) + '" class="hole-stats"><div class="hole-info-container">'
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
			// general hole scores
			var holeScores = getHoleScores(courses[i], (j+1));
			var bestHoleScore = getLowest(holeScores);
			var worstHoleScore = getHighest(holeScores);
			var holeScoreAvg = countAvg(holeScores);
			var holeScoreAvgDiff = Math.round(Math.abs(holeScoreAvg-holePar) * 10 ) / 10;
			$('#' + courses[i].id + '.course').find('#' + (j+1) + '.hole-stats .hole-info-container').append(
				'Best score: ' + getScoreDiffPrefix(bestHoleScore, holePar) + Math.abs(bestHoleScore - holePar)
				+ '<br/>Worst score: ' + getScoreDiffPrefix(worstHoleScore, holePar) + Math.abs(worstHoleScore - holePar)
				+ '<br/>Avg score: ' + getScoreDiffPrefix(holeScoreAvg, holePar) 
				+ holeScoreAvgDiff
			);
		};
		refreshHole(courses[i]);
	};

	$('.content').hide();
}

function getScoreDiffPrefix(score, par) {
	var prefix = "";
	if (score < par) prefix = '-';
	else if (score > par) prefix = '+';
	return prefix;
}

function getHoleScores(course, hole) {
	var holeScores = [];
	for (var i = 0; i < playerRounds.length; i++) {
		if (playerRounds[i].course.id == course.id) 
			holeScores.push(playerRounds[i].scores[(hole-1)]);
	};
	return holeScores;
}

function refreshHole(course) {
	$('#' + course.id + '.course .hole-header').empty().append(
		'Hole ' + currentHole[course.id]
		+ '<br/>par ' + course.holes[currentHole[course.id]-1].par 
		+ ' (' + course.holes[currentHole[course.id]-1].lengthm + 'm)'
	);
	if (currentHole[course.id] == 1)
		$('#' + course.id).find('button#minus').attr("disabled", true);
	else 
		$('#' + course.id).find('button#minus').attr("disabled", false);
	if (currentHole[course.id] == course.holes.length) 
		$('#' + course.id).find('button#plus').attr("disabled", true);
	else 
		$('#' + course.id).find('button#plus').attr("disabled", false);
	$('#' + course.id + '.course .hole-stats').hide();
	$('#' + course.id + '.course').find('#' + currentHole[course.id] + '.hole-stats').fadeIn(100);
}

function changeHole(dir, courseId) {
	var course = null;
	for (var i = 0; i < courses.length; i++) {
		if (courses[i].id == courseId) {
			course = courses[i];
			break;
		} 
	};
	if (dir == 1) {
		if (currentHole[courseId] < course.holes.length)
			currentHole[courseId]++;
	}
	else if (dir == -1) {
		if (currentHole[courseId] > 1)
			currentHole[courseId]--;
	}
	refreshHole(course);
}

// gets best and worst round scores for course
// returns {best : <best_score>, worst : <worst_score>}
function getTotalRoundScoresStats(course) {
	var best = 1000;
	var worst = -1000;
	for (var i = 0; i < playerRounds.length; i++) {
		if (playerRounds[i].course.id == course.id) {
			var totalRoundScore = 0;
			for (var j = 0; j < playerRounds[i].scores.length; j++) {
				totalRoundScore += playerRounds[i].scores[j];
			};
			log('totalroundscore: ' + totalRoundScore);
			if (totalRoundScore > worst) {
				worst = totalRoundScore;
			}
			if (totalRoundScore < best) {
				best = totalRoundScore;
			}
			log('best: ' + best + ', worst: ' + worst);
		}
	};
	return {best : best, worst : worst};
}

function getHighest(arr) {
	var high = arr[0];
	for (var i = 1; i < arr.length; i++) {
		if (arr[i] > high) high = arr[i];
	};
	return high;
}

function getLowest(arr) {
	var low = arr[0];
	for (var i = 1; i < arr.length; i++) {
		if (arr[i] < low) low = arr[i];
	};
	return low;
}

// counts total count of hole scores from scoreset arr
function getTotalHoleScoreCount(scoreSet) {
	var total = 0;
	for (var scoreKey in scoreSet) {
		total += scoreSet[scoreKey];
	}
	return total;
}

function getTotalTimesPlayedOnCourse(course) {
	var total = 0;
	for (var i = 0; i < playerRounds.length; i++) {
		if (playerRounds[i].course.id == course.id) {
			total++;
		}
	};
	return total;
}

// count of every score (in array)
function getHoleScoreChartData(holes, courseId, holeIndex) {
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

	$('body').on('click', '#minus', function() {
		$(this).blur();
		var courseId = $(this).parents('.course').first().attr('id');
		changeHole(-1, courseId);
	});

	$('body').on('click', '#plus', function() {
		$(this).blur();
		var courseId = $(this).parents('.course').first().attr('id');
		changeHole(1, courseId);
	});
});	