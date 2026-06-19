import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAssignedMentees = async (req: AuthRequest, res: Response) => {
  const mentorId = req.user?.id;

  try {
    const mentees = await prisma.user.findMany({
      where: { mentorId },
      select: {
        id: true,
        name: true,
        email: true,
        major: true,
        level: true,
        xp: true,
        skillMasteryScore: true,
        careerReadinessScore: true,
        avatarUrl: true,
        goals: {
          select: {
            id: true,
            title: true,
            progress: true
          }
        }
      }
    });

    // Format output with goal completion percentage
    const formatted = mentees.map((mentee) => {
      const goalsCount = mentee.goals.length;
      const avgGoalProgress = goalsCount
        ? mentee.goals.reduce((acc, g) => acc + g.progress, 0) / goalsCount
        : 0;
      return {
        ...mentee,
        goalCompletionRate: Math.round(avgGoalProgress)
      };
    });

    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMentorshipRequests = async (req: AuthRequest, res: Response) => {
  // Mock requests (students who do not have a mentor, available for connection)
  try {
    const requests = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        mentorId: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        major: true,
        avatarUrl: true
      },
      take: 5
    });
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const acceptMenteeRequest = async (req: AuthRequest, res: Response) => {
  const mentorId = req.user?.id;
  const { studentId } = req.body;

  try {
    const student = await prisma.user.update({
      where: { id: studentId },
      data: { mentorId }
    });

    res.json({ success: true, message: 'Mentee accepted successfully', student });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
