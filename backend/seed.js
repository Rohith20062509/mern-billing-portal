const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Plan = require('./models/Plan');
const Subscription = require('./models/Subscription');
const Payment = require('./models/Payment');

dotenv.config();

const plansData = [
  {
    name: 'Basic',
    price: 9,
    billingCycle: 'monthly',
    features: [
      'Access to Basic Dashboard',
      'Up to 5 Active Projects',
      'Standard Email Support',
      'Basic Billing Reports'
    ],
    active: true
  },
  {
    name: 'Pro',
    price: 29,
    billingCycle: 'monthly',
    features: [
      'Access to Premium Dashboard',
      'Unlimited Active Projects',
      'Priority 24/7 Support',
      'PDF Invoice Downloads',
      'Advanced API Integrations'
    ],
    active: true
  },
  {
    name: 'Premium',
    price: 99,
    billingCycle: 'monthly',
    features: [
      'Everything in Pro Plan',
      'Dedicated Account Manager',
      'Custom SLA & Integrations',
      'Up to 10 Team Members',
      'White-label Reports'
    ],
    active: true
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/billing-portal';
    console.log(`Seeding database at: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);

    // Clean current database
    await User.deleteMany();
    await Plan.deleteMany();
    await Subscription.deleteMany();
    await Payment.deleteMany();

    console.log('Database cleaned.');

    // 1. Seed plans
    const createdPlans = await Plan.insertMany(plansData);
    console.log('Subscription plans seeded.');

    const basicPlan = createdPlans.find(p => p.name === 'Basic');
    const proPlan = createdPlans.find(p => p.name === 'Pro');

    // 2. Seed Users
    // Admin
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Standard User 1
    const standardUser1 = await User.create({
      name: 'Sunny User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });

    // Standard User 2
    const standardUser2 = await User.create({
      name: 'Jane Doe',
      email: 'test@example.com',
      password: 'user123',
      role: 'user'
    });

    console.log('Admin and standard users seeded.');

    // 3. Seed active subscription and payment for User 1 (Pro Plan)
    const sub1StartDate = new Date();
    sub1StartDate.setDate(sub1StartDate.getDate() - 10); // 10 days ago
    
    const sub1EndDate = new Date();
    sub1EndDate.setMonth(sub1EndDate.getMonth() + 1);
    sub1EndDate.setDate(sub1EndDate.getDate() - 10); // Ends in 20 days

    const subscription1 = await Subscription.create({
      userId: standardUser1._id,
      planId: proPlan._id,
      status: 'active',
      startDate: sub1StartDate,
      endDate: sub1EndDate
    });

    await Payment.create({
      userId: standardUser1._id,
      subscriptionId: subscription1._id,
      planId: proPlan._id,
      amount: proPlan.price,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'Credit Card (Mock)',
      createdAt: sub1StartDate
    });

    // 4. Seed expired subscription & payment, and active subscription for User 2 (Basic Plan)
    // Expired sub for User 2
    const oldStartDate = new Date();
    oldStartDate.setMonth(oldStartDate.getMonth() - 2);
    const oldEndDate = new Date();
    oldEndDate.setMonth(oldEndDate.getMonth() - 1);

    const oldSubscription = await Subscription.create({
      userId: standardUser2._id,
      planId: basicPlan._id,
      status: 'expired',
      startDate: oldStartDate,
      endDate: oldEndDate
    });

    await Payment.create({
      userId: standardUser2._id,
      subscriptionId: oldSubscription._id,
      planId: basicPlan._id,
      amount: basicPlan.price,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'PayPal (Mock)',
      createdAt: oldStartDate
    });

    // Current active sub for User 2
    const sub2StartDate = new Date();
    sub2StartDate.setDate(sub2StartDate.getDate() - 5); // 5 days ago
    
    const sub2EndDate = new Date();
    sub2EndDate.setMonth(sub2EndDate.getMonth() + 1);
    sub2EndDate.setDate(sub2EndDate.getDate() - 5);

    const subscription2 = await Subscription.create({
      userId: standardUser2._id,
      planId: basicPlan._id,
      status: 'active',
      startDate: sub2StartDate,
      endDate: sub2EndDate
    });

    await Payment.create({
      userId: standardUser2._id,
      subscriptionId: subscription2._id,
      planId: basicPlan._id,
      amount: basicPlan.price,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'Debit Card (Mock)',
      createdAt: sub2StartDate
    });

    console.log('Mock subscriptions and payments seeded successfully.');
    
    mongoose.connection.close();
    console.log('Seeding complete. Connection closed.');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
