var API_URL = 'http://localHost:3000/SignUp';

var inputs = document.getElementsByTagName('input');
var button = document.querySelector('.btn');

function adduser() {
	for(let input of inputs) {
		if(input.name == 'name') {
			var name = input.value;
		}
		else{
			var password = input.value;
		}
	}

	const user = {
		name,
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
	.then(response => console.log(response));
}

button.addEventListener('click', adduser);




