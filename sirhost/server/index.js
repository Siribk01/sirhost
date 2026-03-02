const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/plans',    require('./routes/plans'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/users',    require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Sir Host API running' }));

// Connect DB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedAdmin();
    await seedPlans();
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Auto-create admin account on first run
async function seedAdmin() {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const exists = await User.findOne({ role: 'admin' });
  if (!exists) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({
      name: 'Sir Host Admin',
      email: process.env.ADMIN_EMAIL,
      password: hash,
      role: 'admin'
    });
    console.log('👤 Admin account seeded:', process.env.ADMIN_EMAIL);
  }
}

// Seed default hosting plans
async function seedPlans() {
  const Plan = require('./models/Plan');
  const count = await Plan.countDocuments();
  if (count > 0) return;

  const plans = [
    // Web Hosting
    { name: 'Starter', type: 'web', price: 3, features: ['1 Website', '10 GB NVMe SSD', '100 GB Bandwidth', 'Free SSL Certificate', '5 Email Accounts'], popular: false },
    { name: 'Business', type: 'web', price: 9, features: ['Unlimited Websites', '50 GB NVMe SSD', 'Unlimited Bandwidth', 'Free SSL Certificate', 'Unlimited Emails', 'Free Domain (1 Year)', 'Daily Backups'], popular: true },
    { name: 'Enterprise', type: 'web', price: 25, features: ['Unlimited Websites', '200 GB NVMe SSD', 'Unlimited Bandwidth', 'Free SSL + Wildcard', 'Unlimited Emails', 'Free Domain (1 Year)', 'Priority 24/7 Support'], popular: false },
    // VPS
    { name: 'VPS Starter', type: 'vps', price: 15, features: ['2 vCPU Cores', '4 GB RAM', '80 GB NVMe SSD', '2 TB Bandwidth', 'Full Root Access'], popular: false },
    { name: 'VPS Pro', type: 'vps', price: 40, features: ['6 vCPU Cores', '16 GB RAM', '320 GB NVMe SSD', 'Unlimited Bandwidth', 'Full Root Access', 'Free Managed Setup'], popular: true },
    { name: 'VPS Ultra', type: 'vps', price: 80, features: ['12 vCPU Cores', '32 GB RAM', '640 GB NVMe SSD', 'Unlimited Bandwidth', 'Full Root Access', 'Priority Managed Support'], popular: false },
    // Dedicated
    { name: 'DS Basic', type: 'dedicated', price: 120, features: ['Intel Xeon 4-Core', '32 GB DDR4 RAM', '1 TB SSD Storage', '10 TB Bandwidth', '1 Gbps Port'], popular: false },
    { name: 'DS Pro', type: 'dedicated', price: 250, features: ['Intel Xeon 8-Core', '128 GB DDR4 RAM', '2x2 TB NVMe SSD', 'Unlimited Bandwidth', '10 Gbps Port', 'RAID-1 Redundancy'], popular: true },
    { name: 'DS Elite', type: 'dedicated', price: 499, features: ['Dual Xeon 16-Core', '256 GB DDR4 RAM', '4x4 TB NVMe SSD', 'Unlimited Bandwidth', '10 Gbps Redundant', 'Full Managed + SLA'], popular: false },
  ];

  await Plan.insertMany(plans);
  console.log('📦 Default plans seeded');
}
