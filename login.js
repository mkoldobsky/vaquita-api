var MP = require ("mercadopago");
var mp = new MP ("TEST-4258487110302883-101613-641de860083f378213a242b1b187e830__LB_LD__-194761911");

router.route('/authenticateUser')
    .post(function(req, res) {
        var code = req.body.code;

        var pst = mp.post("/oauth/token",
                {"grant_type":"authorization_code",
                "code": req.body.code,
                "redirect_uri":"https%3A%2F%2Fwww.vaquita.com.ar%2Fmy"},
                null);

        pst.then(function(json){
            console.log(json);
        });
    });
