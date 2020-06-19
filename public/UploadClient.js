var form = document.querySelector('.img-form');
var div = document.querySelector('.image');

var API_URL = 'http://localHost:3000/upload';

form.onsubmit = async (e) => {
    e.preventDefault();

    var formData = new FormData(form);
    
	var url = formData.get('img-url');
	var details = formData.get('caption');

	form.reset();

	const user = {
		url,
		details
	}

	fetch(API_URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'authorization': 'Bearer ' + localStorage.getItem('token')
		},
		body: JSON.stringify(user)

	})
	.then(response => response.json())
	.then(response => {
		console.log(response);
		window.location = "The Website.html";
	});
};
