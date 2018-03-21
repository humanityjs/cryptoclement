const mongoose = require('mongoose');

const { Schema } = mongoose;

const TfaSchema = new Schema({
  email: {
    type: String, required: true, max: 100
  },
  secret: {
    type: String, default: null
  },
  tempSecret: {
    type: String
  },
  dataUrl: {
    type: String
  },
  optUrl: {
    type: String
  }
});

module.exports = mongoose.model('Tfa', TfaSchema);
