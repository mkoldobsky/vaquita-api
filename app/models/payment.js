var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentSchema   = new Schema({
    id: String,
    amount: Number
});

module.exports = mongoose.model('Payment', PaymentSchema);
