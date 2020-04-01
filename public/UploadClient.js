var form = document.querySelector('.img-form');
var div = document.querySelector('.image');

var API_URL = 'http://localHost:3000';

form.addEventListener('submit', event => {
	event.preventDefault();
	const input = document.querySelector('.img-url');
	const img = document.createElement('img');
	img.src = input.value;
	div.appendChild(img);

	fetch(API_URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({url: input.value})

	})
	.then(response => response.json())
	.then(image => {
		console.log(image);
});
});