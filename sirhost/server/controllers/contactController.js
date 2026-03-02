const Contact = require('../models/Contact');

exports.submit = async (req, res) => {
  try {
    const { name, email, service, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ message: 'Name, email and message are required' });

    const contact = await Contact.create({ name, email, service, message });
    res.status(201).json({ message: 'Message received! We will get back to you soon.', id: contact._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ message: 'Message not found' });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.reply = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: 'Reply text is required' });

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { reply, status: 'replied' },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Message not found' });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
