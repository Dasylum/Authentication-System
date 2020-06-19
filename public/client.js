var API_URL = 'http://localHost:3000';

const container_div = document.querySelector('.container');
const row = document.querySelector('.row');

function DeleteContent(id) {
	
	fetch( 'http://localHost:3000/delete', {
		method: 'POST',
		headers: {
			'content-type' : 'application/json'
		},
		body: JSON.stringify({id})
	})
	.then(response => {
		console.log(response.json());
		window.location = "The Website.html";
	})

}

fetch(API_URL, {
	method: 'GET'
})
.then( response => response.json())
.then(response => {

	response.forEach(function(item) {

		var images = item.content;

		images.forEach((image) => {

			const span = document.createElement('span');
			const col = document.createElement('div'); 
			const button = document.createElement('button');

			button.setAttribute("id", image._id);
			button.innerHTML = "Delete";
			button.addEventListener( 'click', event => {

				DeleteContent(event.target.id);

			} );

			col.classList.add('col-lg-4', 'col-md-6', 'col-xs-12');

			const img = document.createElement('img');
			img.src = image.url;
			
			span.innerHTML = image.details;
			span.classList.add('caption');
			
			col.appendChild(img);
			col.appendChild(span);
			col.appendChild(button);

			row.appendChild(col);
			container_div.appendChild(row);
		})
		
	console.log(item);
	});
});


