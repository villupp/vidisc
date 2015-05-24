function addPlayer() {
	var playerName = $('#new-player-name').val();
	if ( confirm('Are you sure you want to add new player "' + playerName + '"') ) {
		var requestURL = 'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/addplayer?name=' + playerName;
		console.log(requestURL);
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
	    xhr.send();
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
	}
}