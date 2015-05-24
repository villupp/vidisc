function addPlayer() {
	var playerName = $('#new-player-name').val();
	//if ( confirm('Are you sure you want to add new player "' + playerName + '"') ) {
	
	var requestURL = 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/addplayer';
	var data = { name : playerName };
	console.log(requestURL);
	$.ajax({
		type: 'POST',
		url: requestURL,
	    data: data,
		success: function(response) {
			console.log(response.responseText);
			console.log(response);
		},
		error: function(error) {
			console.log("Error occured when adding player : " + JSON.stringify(error) + " : " + error.responseText);
		},
	});


		/*
		$.get(requestURL, function(data) {
  			console.log("DATA : " + data);
		});

		var jqxhr = $.get(requestURL, function() {
	    	alert("success" + JSON.stringify(data));
	  	})
	    .done(function(data) {
	      	alert("second success" + JSON.stringify(data));
	    })
	    .fail(function(data) {
	      	alert("error" + JSON.stringify(data));
	    })
	    .always(function(data) {
	      	alert("finished" + JSON.stringify(data));
	    });

	    */
		/*console.log(requestURL);
	    var xhr = createCORSRequest('GET',  requestURL);
	    if (!xhr) {
	        throw new Error('CORS not supported');
	    }
	    xhr.onload = function(response) {
	    	console.log(response);
	        console.log(xhr.responseText);
			alert(xhr.responseText);
			window.location.href = '/players.html';
	    };
	    xhr.onerror = function(error) {
	    	console.log(error);
	        console.log('There was an error!');
	    };
	    xhr.send();*/
		/*
	    $.ajax({
  			type: 'GET',
			url: requestURL,
			data: { name : playerName },
			success: function(response) {
				console.log(response);
				alert(response);
				window.location.href = '/players.html';
			},
			error: function(xhr, status) {
				console.log("Error occured while adding player: " + status);
				window.location.href = '/players.html';
			}
		});
		*/
	//}
}