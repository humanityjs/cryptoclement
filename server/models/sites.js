const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SiteSchema = new Schema({
  id: { type: String, max: 100, required: true },
  username: { type: String, max: 100, required: true },
  site_name: { type: String, max: 100, required: true },
  site_type: { type: String, max: 100, required: true },
  email: { type: String, required: true, max: 100 },
  bonus: { type: Number, default: 0 },
  rakeback_one: { type: Number, default: 0 },
  rakeback_two: { type: Number, default: 0 },
  rakeback_three: { type: Number, default: 0 },
  status: { type: Number, max: 3, default: 0 },
  free_rebate: { type: Number, default: 0 },
  betback: { type: Number, default: 0 },
  lossback: { type: Number, default: 0 },
  rewards: { type: Number, default: 0 },
});

module.exports = mongoose.model('Site', SiteSchema);
