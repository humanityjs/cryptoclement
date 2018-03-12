const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EarningSchema = new Schema({
  email: { type: String, required: true, max: 100 },
  amount: { type: Number, required: true },
  type: { type: String, max: 100, required: true },
  site_type: { type: String, max: 100, default: '' },
  site_name: { type: String, max: 100, default: '' },
  username: { type: String, max: 100, default: '' }
});

module.exports = mongoose.model('Earning', EarningSchema);