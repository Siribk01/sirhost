const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  type:      { type: String, enum: ['web', 'vps', 'dedicated'], required: true },
  price:     { type: Number, required: true, min: 0 },
  period:    { type: String, default: 'monthly' },
  features:  [{ type: String }],
  popular:   { type: Boolean, default: false },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', planSchema);
