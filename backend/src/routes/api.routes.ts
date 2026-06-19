import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import {
  getGoals,
  createGoal,
  updateGoal,
  getTasks,
  toggleTask,
  getChatHistory,
  sendMessageToAi,
  getStudyGroups,
  joinStudyGroup,
  leaveStudyGroup,
  getOpportunities,
  addStudentXp
} from '../controllers/student.controller';
import {
  getBatchInsights,
  getStudentsMonitoring,
  scheduleIntervention
} from '../controllers/faculty.controller';
import {
  getAssignedMentees,
  getMentorshipRequests,
  acceptMenteeRequest
} from '../controllers/mentor.controller';
import {
  getSystemStats,
  listAllUsers,
  createOpportunity,
  deleteUser,
  deleteOpportunity
} from '../controllers/admin.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// --- Auth Routes ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);

// --- Student Routes ---
router.get('/student/goals', authenticateToken, requireRole(['STUDENT']), getGoals);
router.post('/student/goals', authenticateToken, requireRole(['STUDENT']), createGoal);
router.put('/student/goals/:id', authenticateToken, requireRole(['STUDENT']), updateGoal);
router.get('/student/tasks', authenticateToken, requireRole(['STUDENT']), getTasks);
router.put('/student/tasks/:id/toggle', authenticateToken, requireRole(['STUDENT']), toggleTask);
router.get('/student/chat', authenticateToken, requireRole(['STUDENT']), getChatHistory);
router.post('/student/chat', authenticateToken, requireRole(['STUDENT']), sendMessageToAi);
router.get('/student/groups', authenticateToken, getStudyGroups);
router.post('/student/groups/:id/join', authenticateToken, requireRole(['STUDENT']), joinStudyGroup);
router.post('/student/groups/:id/leave', authenticateToken, requireRole(['STUDENT']), leaveStudyGroup);
router.get('/student/opportunities', authenticateToken, getOpportunities);
router.post('/student/add-xp', authenticateToken, requireRole(['STUDENT']), addStudentXp);

// --- Faculty Routes ---
router.get('/faculty/insights', authenticateToken, requireRole(['FACULTY', 'ADMIN']), getBatchInsights);
router.get('/faculty/monitoring', authenticateToken, requireRole(['FACULTY', 'ADMIN']), getStudentsMonitoring);
router.post('/faculty/intervention', authenticateToken, requireRole(['FACULTY', 'ADMIN']), scheduleIntervention);

// --- Mentor Routes ---
router.get('/mentor/mentees', authenticateToken, requireRole(['MENTOR', 'ADMIN']), getAssignedMentees);
router.get('/mentor/requests', authenticateToken, requireRole(['MENTOR', 'ADMIN']), getMentorshipRequests);
router.post('/mentor/requests/accept', authenticateToken, requireRole(['MENTOR', 'ADMIN']), acceptMenteeRequest);

// --- Admin Routes ---
router.get('/admin/stats', authenticateToken, requireRole(['ADMIN']), getSystemStats);
router.get('/admin/users', authenticateToken, requireRole(['ADMIN']), listAllUsers);
router.post('/admin/opportunity', authenticateToken, requireRole(['ADMIN']), createOpportunity);
router.delete('/admin/opportunity/:id', authenticateToken, requireRole(['ADMIN']), deleteOpportunity);
router.delete('/admin/users/:id', authenticateToken, requireRole(['ADMIN']), deleteUser);

export default router;
