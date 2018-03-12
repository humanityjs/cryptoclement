const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, max: 100, default: '' },
  last_name: { type: String, max: 100, default: '' },
  email: { type: String, required: true, max: 100, unique: true },
  password: { type: String, required: true, max: 100 },
  role: { type: Number, max: 2, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);