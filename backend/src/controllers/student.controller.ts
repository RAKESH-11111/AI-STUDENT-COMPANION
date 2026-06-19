import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// --- GOALS ---
export const getGoals = async (req: AuthRequest, res: Response) => {
  const studentId = req.user?.id;
  try {
    const goals = await prisma.goal.findMany({ where: { studentId } });
    res.json(goals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  const studentId = req.user?.id;
  const { title, progress } = req.body;
  try {
    const goal = await prisma.goal.create({
      data: {
        title,
        progress: progress || 0.0,
        studentId: studentId!
      }
    });
    res.status(201).json(goal);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { progress, title } = req.body;
  try {
    const goal = await prisma.goal.update({
      where: { id },
      data: { progress, title }
    });
    res.json(goal);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// --- TASKS ---
export const getTasks = async (req: AuthRequest, res: Response) => {
  const studentId = req.user?.id;
  try {
    const tasks = await prisma.task.findMany({ where: { studentId } });
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const studentId = req.user?.id;
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { isCompleted: !task.isCompleted }
    });

    // Award XP if completed
    if (updatedTask.isCompleted && studentId) {
      const user = await prisma.user.findUnique({ where: { id: studentId } });
      if (user) {
        let newXp = user.xp + task.xpReward;
        let newLevel = user.level;
        const xpThreshold = newLevel * 1000;
        if (newXp >= xpThreshold) {
          newXp -= xpThreshold;
          newLevel += 1;
        }

        // Boost Career Readiness Score & Mastery Score slightly
        const careerReadinessScore = Math.min(100.0, user.careerReadinessScore + 2.5);
        const skillMasteryScore = Math.min(100.0, user.skillMasteryScore + 3.0);

        await prisma.user.update({
          where: { id: studentId },
          data: {
            xp: newXp,
            level: newLevel,
            careerReadinessScore,
            skillMasteryScore
          }
        });
      }
    }

    res.json(updatedTask);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// --- CHAT WITH AI TUTOR / MENTOR ---
export const getChatHistory = async (req: AuthRequest, res: Response) => {
  const studentId = req.user?.id;
  try {
    const history = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: studentId, receiverId: null, isAiSender: false }, // Sent to AI
          { senderId: null, receiverId: studentId, isAiSender: true }  // Received from AI
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const sendMessageToAi = async (req: AuthRequest, res: Response) => {
  const studentId = req.user?.id;
  const { message } = req.body;

  try {
    // 1. Save user message
    const userMsg = await prisma.chatMessage.create({
      data: {
        message,
        isAiSender: false,
        senderId: studentId
      }
    });

    // 2. Generate a creative AI response based on message keywords
    let aiResponseText = `I hear you! As your AI Companion, I recommend staying consistent. Try focusing on the recommended tasks above to earn XP and level up!`;
    const lower = message.toLowerCase();
    if (lower.includes('python') || lower.includes('code') || lower.includes('coding')) {
      aiResponseText = `Python is a great technical skill to master. You've earned some XP recently. Try working on conditional statements or functional programming next!`;
    } else if (lower.includes('resume') || lower.includes('cv') || lower.includes('portfolio')) {
      aiResponseText = `Your Career Readiness Score is currently being boosted. Try drafting your resume using our AI Builder tool to push it past 80!`;
    } else if (lower.includes('internship') || lower.includes('job') || lower.includes('career')) {
      aiResponseText = `I suggest checking out the Opportunities Explorer tab! There are fresh Fintech and Data Science positions open for applications.`;
    } else if (lower.includes('quiz') || lower.includes('exam') || lower.includes('test')) {
      aiResponseText = `Quizzes are excellent check-in points! Keep a cool head, review the Module 3 Prompt Engineering summary first, and you will do great.`;
    } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
      aiResponseText = `Hello! I am your Empathetic Expert AI Companion. How can I help you optimize your study goals or career track today?`;
    }

    const aiMsg = await prisma.chatMessage.create({
      data: {
        message: aiResponseText,
        isAiSender: true,
        receiverId: studentId
      }
    });

    res.json({
      userMessage: userMsg,
      aiMessage: aiMsg
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// --- STUDY GROUPS ---
export const getStudyGroups = async (req: AuthRequest, res: Response) => {
  try {
    const groups = await prisma.studyGroup.findMany({
      include: {
        members: {
          select: { id: true, name: true, role: true }
        }
      }
    });
    res.json(groups);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const joinStudyGroup = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const studentId = req.user?.id;

  try {
    const group = await prisma.studyGroup.update({
      where: { id },
      data: {
        members: {
          connect: { id: studentId }
        }
      },
      include: {
        members: {
          select: { id: true, name: true }
        }
      }
    });
    res.json(group);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const leaveStudyGroup = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const studentId = req.user?.id;

  try {
    const group = await prisma.studyGroup.update({
      where: { id },
      data: {
        members: {
          disconnect: { id: studentId }
        }
      },
      include: {
        members: {
          select: { id: true, name: true }
        }
      }
    });
    res.json(group);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// --- OPPORTUNITIES ---
export const getOpportunities = async (req: AuthRequest, res: Response) => {
  try {
    const opportunities = await prisma.opportunity.findMany();
    res.json(opportunities);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// --- XP REWARDS FOR NEW GAME FEATURES ---
export const addStudentXp = async (req: AuthRequest, res: Response) => {
  const studentId = req.user?.id;
  const { xpReward } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: studentId } });
    if (!user) return res.status(404).json({ error: 'Student profile not found' });

    let newXp = user.xp + (xpReward || 50);
    let newLevel = user.level;
    const xpThreshold = newLevel * 1000;
    
    if (newXp >= xpThreshold) {
      newXp -= xpThreshold;
      newLevel += 1;
    }

    // Boost stats slightly as a reward
    const careerReadinessScore = Math.min(100.0, user.careerReadinessScore + 1.5);
    const skillMasteryScore = Math.min(100.0, user.skillMasteryScore + 2.0);

    const updated = await prisma.user.update({
      where: { id: studentId },
      data: {
        xp: newXp,
        level: newLevel,
        careerReadinessScore,
        skillMasteryScore
      }
    });

    res.json({
      success: true,
      xp: updated.xp,
      level: updated.level,
      careerReadinessScore: updated.careerReadinessScore,
      skillMasteryScore: updated.skillMasteryScore
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
