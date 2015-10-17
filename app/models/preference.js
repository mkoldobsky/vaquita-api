var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PreferenceSchema   = new Schema({
	id: String,
	description: String,
	amount: Number
});

module.exports = mongoose.model('Preference', PreferenceSchema);
