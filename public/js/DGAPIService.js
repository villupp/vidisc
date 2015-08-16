var DGAPIService = (function () {
	return {
		getRounds: function () {
			return sendRequest(
				'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/rounds',
				'GET');
		},
		getRound: function (roundId) {
			return sendRequest(
				'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/round?id=' + roundId,
				'GET');
		},
		getPlayers: function () {
			return sendRequest(
				'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/players',
				'GET');
		},
		getPlayer: function (playerId) {
			return sendRequest(
				'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/player?id=' + playerId,
				'GET');
		},
		getCourses: function () {
			return sendRequest(
				'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/courses',
				'GET');
		},
		getCourse: function (courseId) {
			return sendRequest(
				'http://discgolfapi-vpii.rhcloud.com/discgolfapi/disc/api/course?id=' + courseId,
				'GET');
		}	
	};

	function sendRequest(requestUrl, method, headers) {
		var d = $.Deferred();
		var xhr = createCORSRequest(method, requestUrl);
		if (!xhr) {
			throw new Error('CORS not supported.');
		}
		xhr.onload = function () {
			var res = JSON.parse(xhr.responseText);
			d.resolve(res);
		};
		xhr.onerror = function () {
			var err = JSON.parse(xhr.responseText)
			d.reject(err);
		};
		xhr.send();
		return d.promise();
	}

	function createCORSRequest(method, url) {
		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr) {
			// Check if the XMLHttpRequest object has a "withCredentials" property.
			// "withCredentials" only exists on XMLHTTPRequest2 objects.
			xhr.open(method, url, true);
		} else if (typeof XDomainRequest != "undefined") {
			// Otherwise, check if XDomainRequest.
			// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} else {
			// Otherwise, CORS is not supported by the browser.
			xhr = null;
		}
		return xhr;
	}
})();

function onRESTError(err) {
	console.log('Error:' + err);
}