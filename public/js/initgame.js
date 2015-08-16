function initGame() {
  if (getCookie('currentSavedScores') != '') {
    if (confirm('Saved scores were found, do you want to continue saved game?')) {
      window.location.href = '/game/play';
    } else {
      setCookie('currentSavedScores', '', 30);
      setCookie('currentHole', '', 30);
      setCookie('currentPlayers', '', 30);
    }
  }
  initCourseSelect();
  initPlayerSelect();
}

function initPlayerSelect() {
  var getPlayersRequest = DGAPIService.getPlayers();
	getPlayersRequest.done(function (resPlayers) {
		printInitPlayerSelection(resPlayers);
	});
	getPlayersRequest.fail(onRESTError);
}

function initCourseSelect() {
  var getCoursesRequest = DGAPIService.getCourses();
	getCoursesRequest.done(function (resCourses) {
		printCourseSelection(resCourses);
	});
	getCoursesRequest.fail(onRESTError);
}

function printCourseSelection(json) {
  $('#course-select-div').append(
    '<select id="course-select" class="selectpicker center-x center-y show-tick" size="2" data-width="100%"  data-style="btn-primary">'
    + '</select>'
    );
  for (var i = 0; i < json.length; i++) {
    $('#course-select').append(
      '<option class="course-option" value="'
      + json[i].id + '">'
      + json[i].name
      + '</option>'
      );
  }

  $('.selectpicker').selectpicker();
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    $('.selectpicker').selectpicker('mobile');
  }
  $('.filter-option').removeClass('pull-left').addClass('center-y').addClass('center-x');
}

function printInitPlayerSelection(json) {
  $('#players-check-div').append(
    '<form id="players-check-form" role="form">'
    + '</form>'
    );

  for (var i = 0; i < json.length; i++) {
    var maxNameLength = 30;
    if (json[i].name.length > maxNameLength) {
      json[i].name = json[i].name.substring(0, (maxNameLength - 1)) + "...";
    }
    $('#players-check-form').append(
      '<span class="button-checkbox">'
      + '<button type="button" class="btn btn-inverse btn-block playercheckbtn" data-color="primary">'
      + '<i class="state-icon glyphicon glyphicon-unchecked pull-left"></i>&nbsp;<b>' + json[i].name + '</b></button>'
      + '<input type="checkbox" class="hidden player-input" value="' + json[i].id + '">'
      + '</span>'
      );
  }
}

function startGame() {
  var playerIDs = [];
  var courseID = -1;
  var checkCount = 0;
  $('.player-input').each(function () {
    if ($(this).is(":checked")) {
      playerIDs[checkCount] = $(this).val();
      checkCount++;
    }
  });
  courseID = $('#course-select').val();
  if (checkCount < 1) {
    alert("Select at least one player.");
  } else {
    setCookie('currentCourse', courseID, 30);
    setCookie('currentPlayers', playerIDs, 30);
    console.log("Redirecting...");
    window.location.href = '/game/play';
  }

}

$(document).ready(function () {
  $('body').on('click', '.playercheckbtn', function () {
    $(this).blur();
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
      $(this).find('.state-icon').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
      $(this).removeClass('btn-success').addClass('btn-inverse');
      $(this).next('input').attr('checked', "false");
    } else {
      $(this).addClass('active');
      $(this).find('.state-icon').removeClass('glyphicon-unchecked').addClass('glyphicon-check');
      $(this).removeClass('btn-inverse').addClass('btn-success');
      $(this).next('input').attr('checked', "true");
    }
  });
});