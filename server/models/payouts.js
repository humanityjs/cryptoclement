const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PayoutSchema = new Schema({
  id: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  amount: { type: Number, required: true },
  type: { type: String, max: 100, required: true },
  address: { type: String, required: true },
  status: { type: Number, max: 3, default: 0 }
});

module.exports = mongoose.model('Payout', PayoutSchema);
