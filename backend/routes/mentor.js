const express = require('express');
const mentorController = require('../controllers/mentorController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes protected - mentor role required
router.get('/dashboard', authMiddleware, roleMiddleware('mentor'), mentorController.getMentorDashboard);

// Groups
router.get('/groups', authMiddleware, roleMiddleware('mentor'), mentorController.getAssignedGroups);
router.get('/group/:groupId', authMiddleware, roleMiddleware('mentor'), mentorController.getGroupDetails);

// Students
router.get('/students/:studentId', authMiddleware, roleMiddleware('mentor'), mentorController.getStudentDetails);
router.get('/students', authMiddleware, roleMiddleware('mentor'), mentorController.searchStudents);

// Updates
router.get('/students/:studentId/daily-updates', authMiddleware, roleMiddleware('mentor'), mentorController.getStudentDailyUpdates);
router.get('/students/:studentId/weekly-updates', authMiddleware, roleMiddleware('mentor'), mentorController.getStudentWeeklyUpdates);

// Attendance
router.post('/attendance', authMiddleware, roleMiddleware('mentor'), mentorController.addAttendance);
router.get('/group/:groupId/attendance', authMiddleware, roleMiddleware('mentor'), mentorController.getGroupAttendanceSummary);

// Marks
router.post('/marks', authMiddleware, roleMiddleware('mentor'), mentorController.giveMarks);

module.exports = router;
