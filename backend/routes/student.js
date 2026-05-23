const express = require('express');
const studentController = require('../controllers/studentController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes protected - student role required
router.get('/dashboard', authMiddleware, roleMiddleware('student'), studentController.getStudentDashboard);
router.get('/profile', authMiddleware, roleMiddleware('student'), studentController.getStudentProfile);

// Daily Updates
router.post('/daily-update', authMiddleware, roleMiddleware('student'), studentController.submitDailyUpdate);
router.get('/daily-updates', authMiddleware, roleMiddleware('student'), studentController.getDailyUpdates);

// Weekly Updates
router.post('/weekly-update', authMiddleware, roleMiddleware('student'), studentController.submitWeeklyUpdate);
router.get('/weekly-updates', authMiddleware, roleMiddleware('student'), studentController.getWeeklyUpdates);

// Attendance
router.get('/attendance', authMiddleware, roleMiddleware('student'), studentController.getAttendance);

// Marks
router.get('/marks', authMiddleware, roleMiddleware('student'), studentController.getMarks);

module.exports = router;
