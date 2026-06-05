const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, getAllPayments } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin); // Restrict entire router to Admins

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/payments', getAllPayments);

module.exports = router;
