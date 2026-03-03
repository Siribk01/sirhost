const Order = require('../models/Order');
const Plan  = require('../models/Plan');
const User  = require('../models/User');
const Contact = require('../models/Contact');

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('plan', 'name type price')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalOrders   = await Order.countDocuments();
    const activeOrders  = await Order.countDocuments({ status: 'active' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    const revenueAgg = await Order.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalUsers  = await User.countDocuments({ role: 'user' });
    const totalPlans  = await Plan.countDocuments({ active: true });
    const unreadMsgs  = await Contact.countDocuments({ status: 'unread' });

    // Monthly revenue last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthly = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $in: ['active', 'expired'] } } },
      { $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$amount' },
          count:   { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Plan type distribution
    const planDist = await Order.aggregate([
      { $lookup: { from: 'plans', localField: 'plan', foreignField: '_id', as: 'planData' } },
      { $unwind: '$planData' },
      { $group: { _id: '$planData.type', count: { $sum: 1 } } }
    ]);

    res.json({
      total:    totalOrders,
      active:   activeOrders,
      pending:  pendingOrders,
      revenue:  revenueAgg[0]?.total || 0,
      users:    totalUsers,
      plans:    totalPlans,
      unread:   unreadMsgs,
      monthly,
      planDist
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { userId, planId, notes } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const order = await Order.create({
      user: userId,
      plan: planId,
      amount: plan.price,
      endDate,
      notes: notes || ''
    });

    const populated = await order.populate(['user', 'plan']);
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('user', 'name email').populate('plan', 'name type price');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
