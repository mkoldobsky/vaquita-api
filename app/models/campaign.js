var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CampaignSchema   = new Schema({
	id: String,
	name: String,
	ownerId: String,
	ownerName: String,
	startDate: Date,
	endDate: Date,
	targetAmount: Number,
	category: String,
	imageId: String,
	imageUrl: String,
	insterestRate: {type:Number, default:0},
	url: String,
	pref1: Schema.Types.Mixed,
	pref2: Schema.Types.Mixed,
	pref3: Schema.Types.Mixed,
	payments: [Schema.Types.Mixed]
});

module.exports = mongoose.model('Campaign', CampaignSchema);
