var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ContentSchema = new Schema({
	url: Array,
	details: String
});

var Content = mongoose.model('Content', ContentSchema);

module.exports = Content;