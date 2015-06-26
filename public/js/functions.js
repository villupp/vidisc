var version = '1.1b'
var rlsdt = '14.06.2015'

$(document).ready(function() {
    $('#version').append('v' + version)
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function about() {
    alert('Vidisc\nv' + version + ' (' + rlsdt + ')\n©Ville Piirainen 2015')
}

/*
function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}
*/

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

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}


function countSum(arr) {
    var sum = 0;
    for (var i= 0; i < arr.length; i++)
        sum += arr[i];
    return sum;
}

function countAvg(arr) {
    var avg = 0;
    var sum = 0;
    for (var i= 0; i < arr.length; i++)
        sum += arr[i];
    return sum / arr.length;
}

function getCoursePar(holes) {
    var parSum = 0;
    for (var i = 0; i < holes.length; i++) {
        parSum += holes[i].par;
    };
    return parSum;
}