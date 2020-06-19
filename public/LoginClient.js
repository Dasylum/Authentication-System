const API_URL = 'http://localHost:3000/login';

var form = document.querySelector('.input-form');

	form.onsubmit = async (e) => {
    e.preventDefault();

    var formData = new FormData(form);
    
	var username = formData.get('username');
	var password = formData.get('password');

	const user = {
		username,
		password
	}

	fetch(API_URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'

		},
		body: JSON.stringify(user)
	})
	.then(response => response.json())
	.then(response => {
		localStorage.setItem('token', response);
		window.location = "The Website.html";
	});

}
