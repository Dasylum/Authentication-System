var API_URL = 'http://localHost:3000';
const div = document.querySelector('.content-div');
fetch(API_URL, {
	method: 'GET',
})
.then(function(response) {
	return response.json();
})
.then(function(response) {

	console.log(response);

	response.forEach(function(item) {
		const p = document.createElement('div');
		const img = document.createElement('img');
		img.src = item.url;
		p.innerHTML = item.name;
		p.classList.add('content')
		div.appendChild(p);
		div.appendChild(img);

	})
})

