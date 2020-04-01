const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;
var userschema = new Schema({
	email: String,
	url: Array,
	hash: String,
	salt: String,
	
});

var users = mongoose.model('userModel', userschema);
module.exports = users;