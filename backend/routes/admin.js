const express = require('express');
const adminController = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes protected - admin role required

// Dashboard
router.get('/dashboard', authMiddleware, roleMiddleware('admin'), adminController.getAdminDashboard);
router.get('/analytics', authMiddleware, roleMiddleware('admin'), adminController.getAnalytics);

// Batches
router.post('/batches', authMiddleware, roleMiddleware('admin'), adminController.createBatch);
router.get('/batches', authMiddleware, roleMiddleware('admin'), adminController.getAllBatches);
router.put('/batches/:batchId', authMiddleware, roleMiddleware('admin'), adminController.updateBatch);
router.delete('/batches/:batchId', authMiddleware, roleMiddleware('admin'), adminController.deleteBatch);

// Groups
router.post('/groups', authMiddleware, roleMiddleware('admin'), adminController.createGroup);
router.get('/groups', authMiddleware, roleMiddleware('admin'), adminController.getAllGroups);
router.put('/groups/:groupId', authMiddleware, roleMiddleware('admin'), adminController.updateGroup);
router.delete('/groups/:groupId', authMiddleware, roleMiddleware('admin'), adminController.deleteGroup);

// Mentors
router.post('/mentors', authMiddleware, roleMiddleware('admin'), adminController.createMentor);
router.get('/mentors', authMiddleware, roleMiddleware('admin'), adminController.getAllMentors);
router.put('/mentors/:mentorId', authMiddleware, roleMiddleware('admin'), adminController.updateMentor);
router.delete('/mentors/:mentorId', authMiddleware, roleMiddleware('admin'), adminController.deleteMentor);
router.post('/mentors/:mentorId/assign-batches', authMiddleware, roleMiddleware('admin'), adminController.assignMentorToBatches);

// Students
router.post('/students', authMiddleware, roleMiddleware('admin'), adminController.addStudent);
router.get('/students', authMiddleware, roleMiddleware('admin'), adminController.getAllStudents);
router.put('/students/:studentId', authMiddleware, roleMiddleware('admin'), adminController.updateStudent);
router.delete('/students/:studentId', authMiddleware, roleMiddleware('admin'), adminController.deleteStudent);

module.exports = router;
