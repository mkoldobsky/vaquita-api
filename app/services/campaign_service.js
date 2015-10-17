var Campaign     = require('../../app/models/campaign');

var baseUrl = "http://vaquita.com.ar/payCampaign/";

var addCampaign = function(campaign, callback){

  campaign.url = baseUrl + campaign.ownerId + campaign.ownerName + campaign.name;

  campaign.save(function(err) {
        if (!err){
          campaign.url = baseUrl + campaign._id
        }
        campaign.save(function(err){
          return callback(err, { message: 'Campaign created! ' + campaign.name, campaign_url: campaign.url });
        });
  });

};

var getCampaign = function(campaignId, callback){

  Campaign.findById(campaignId, function(err, campaign) {
      return callback(err, campaign);
  });

};

var addPayment = function(campaignId, payment, callback){
  Campaign.findById(campaignId, function(err, campaign) {

      if (err){
        return callback(err, null);
      }

      campaign.payments.push(payment);

      campaign.save(function(err) {
          return callback(err, campaign);
      });

  });

};

exports.addCampaign = addCampaign;
exports.getCampaign = getCampaign;
exports.addPayment = addPayment;
