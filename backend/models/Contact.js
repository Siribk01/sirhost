const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true },
  service:   { type: String, default: '' },
  message:   { type: String, required: true },
  status:    { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  reply:     { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
