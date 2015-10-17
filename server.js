// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var fs = require('fs');
var https = require('https');
var key = fs.readFileSync('./mtosca-key.pem');
var cert = fs.readFileSync('./mtosca-cert.pem');
var https_options = {
	key: key,
	cert: cert
};
var PORT = process.env.PORT || 8000;
var HOST = 'shrouded-forest-7274.herokuapp.com';

var app        = express();                // define our app using express

var bodyParser = require('body-parser');
var campaignService = require('./app/services/campaign_service');
var paymentService = require('./app/services/payment_service');

var Campaign     = require('./app/models/campaign.js');
var authenticationService = require('./app/services/authentication_service');
var APP_CLIENT_SECRET = "TEST-7062115258981006-101522-a367cb28ffb0c1310b2b1c7e0e3c5ea1__LB_LA__-194761911";

var mongoose   = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/vaquita'); // connect to our database

mongoose.connect('mongodb://master:qatest1234@ds047592.mongolab.com:47592/vaquita');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("h");
});


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8093;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
var MP = require ("mercadopago");
var mp = new MP ("TEST-7062115258981006-101522-a367cb28ffb0c1310b2b1c7e0e3c5ea1__LB_LA__-194761911");

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', true);
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
   res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  next();
 });


router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/campaign')

.get(function(req, res) {
       Campaign.find(function(err, campaign) {
           if (err)
               res.send(err);

           res.json(campaign);
       });
   })
    .post(function(req, res) {
      console.log("post");

        var campaign = new Campaign();
        campaign.name = req.body.name;
        campaign.ownerId = req.body.ownerId;
        campaign.ownerName = req.body.ownerName;
        campaign.startDate = req.body.startDate;
        campaign.endDate = req.body.endDate;
        campaign.targetAmount = req.body.targetAmount;
        campaign.imageId = req.body.imageId;
        campaign.imageUrl = req.body.imageUrl;
        campaign.pref1 = req.body.pref1;
        campaign.pref2 = req.body.pref2;
        campaign.pref3 = req.body.pref3;

        campaignService.addCampaign(campaign, function(err, json) {
            if (err)
                res.send(err);

            res.json(json);
        });

    });

router.route('/campaign/:campaign_id')
	    .get(function(req, res) {
        var campaignId = req.params.campaign_id;
        campaignService.getCampaign(campaignId, function(err, campaign){
          if (err){
            res.send(err);
          }
          res.json(campaign);
        })
	    })
      .put(function(req, res) {
            var payment = req.body.payment;
            var campaignId = req.params.campaign_id;

            campaignService.addPayment(campaignId, payment, function(err, campaign){
              if (err){
                res.send(err);
              }
              res.json(campaign);
            });
         });

// Router for user authentication after being redirected from MP login.
router.route('/authenticateUser')
    .post(function(req, res) {
        authenticationService.authenticateUser(req.body.code, APP_CLIENT_SECRET,
            function(error, success){
                if (error) {
                    res.json(error);
                } else {
                    res.json(success);
                }
            });
    });

// Router to create a new payment asociated to a campaing
router.route('/campaign/:campaign_id/payment')
	.post(function(req, res) {
		paymentService.createPayment(req.params.campaign_id, req.body.preference_id, req.body.payment_method_type, req.body.auth_code, req.body.access_token, function(error, result) {
			if (error) {

				var errorResponse = {
					code: 400,
					error: error
				};
				res.json(errorResponse);
			} else {
				var response = {
					code: 200,
					response: result
				}
			}
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
server = https.createServer(https_options, app).listen(PORT, HOST);
console.log('HTTPS Server listening on %s:%s', HOST, PORT);
//app.listen(port);
//console.log('Magic happens on port ' + port);
