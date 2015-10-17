var MP = require ("mercadopago");

var authenticateUser = function(code, appClientSecret, callbackFunction) {

    var result = '',
        mp = new MP(appClientSecret),
        authenticationData = {"code": code,
            "grant_type":"authorization_code",
            "redirect_uri":"https://www.vaquita.com.ar/my",
            "client_secret": appClientSecret};

    mp.post("/oauth/token", authenticationData, {})
        .then(
            function(jsonSuccess){
                callbackFunction(undefined, jsonSuccess.response);
            },
            function (error) {
                callbackFunction(error);
            }
        );

    return result;
};

exports.authenticateUser = authenticateUser;