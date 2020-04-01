const API_URL = 'http://localHost:3000/login';

fetch(API_URL, {
	method: 'POST'
})
.then(response => location.replace("The Website.html"));