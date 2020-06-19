const mongoose = require('mongoose');
var Content = require('./UserContent.js');

var Schema = mongoose.Schema;
var userschema = new Schema({
	email: String,
	content: [{type: Schema.Types.ObjectId, ref: 'Content'}],
	hash: String,
	salt: String,
	
});


var users = mongoose.model('userModel', userschema);
module.exports = users;