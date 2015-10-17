var MP = require("mercadopago");
var campaignService = require('./campaign_service');

var createPayment = function(campaignId, preferenceId, paymentType, authCode, accessToken, callback) {

	campaignService.getCampaign(campaignId, function(error, campaign) {
		if (error) {

			var error = {
				code: 'get_campaign_error',
				message: 'ERROR buscando campaña'
			};
			return callback(error, undefined);

		} else {

			return _createFromCampaign(campaign, preferenceId, paymentType, authCode, accessToken, callback);
		}
	});
};

var _createFromCampaign = function(campaign, preferenceId, paymentType, authCode, accessToken, callback) {

	var pref = JSON.parse(campaign[preferenceId]);
	var paymentData = {
		"collector_id":campaign.ownerId,
		"reason":campaign.name,
		"marketplace":"NONE",
		"currency_id":"ARS",
		"payment_method_id":"account_money",
		"transaction_amount":pref.amount,
		"operation_type":"money_transfer"
	};

	if (paymentType === 'credit_card') {
		paymentData.token = authCode;
	} else {
		paymentData.auth_code = authCode;
	}

	var mp = new MP(accessToken);

	mp.post ("/v1/payments", paymentData)
		.then(
		function(paymentResponse) {
			var payment = {
				id: paymentResponse.id,
				amount: paymentResponse.transaction_amount
			};
			campaignService.addPayment(campaignId, payment, callback);
		},
		function(error) {

			var error = {
				code: 'create_payment_error',
				message: 'ERROR creando payment con data'
			};
			return callback(error, undefined);
		}
	);
};

exports.createPayment = createPayment;