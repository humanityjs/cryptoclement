const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: { type: String, max: 100, default: '' },
  last_name: { type: String, max: 100, default: '' },
  email: {
    type: String, required: true, max: 100, unique: true
  },
  password: { type: String, required: true, max: 100 },
  role: { type: Number, max: 2, default: 0 },
  uuid: { type: String, required: true, max: 200 }
});

module.exports = mongoose.model('User', UserSchema);
