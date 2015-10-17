var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CategorySchema   = new Schema({
	id: String,
	name: String,
	description
});

module.exports = mongoose.model('Category', CategorySchema);