const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan:      { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  amount:    { type: Number, required: true },
  status:    { type: String, enum: ['pending', 'active', 'cancelled', 'expired'], default: 'pending' },
  startDate: { type: Date, default: Date.now },
  endDate:   { type: Date },
  notes:     { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
