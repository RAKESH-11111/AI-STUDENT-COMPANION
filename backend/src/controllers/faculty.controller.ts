import { Request, Response } from 'express';
import prisma from '../prisma';

export const getBatchInsights = async (req: Request, res: Response) => {
  try {
    const students = await prisma.user.findMany({ where: { role: 'STUDENT' } });

    // Calculate averages based on seed data
    const totalStudents = students.length;
    const avgSkillMastery = totalStudents
      ? students.reduce((acc, s) => acc + s.skillMasteryScore, 0) / totalStudents
      : 75;
    const avgReadiness = totalStudents
      ? students.reduce((acc, s) => acc + s.careerReadinessScore, 0) / totalStudents
      : 72;

    // Hardcode some mock week-over-week skill categorization values matching Stitch Faculty Dashboard visual
    res.json({
      totalStudents,
      avgSkillMastery: Math.round(avgSkillMastery),
      avgReadiness: Math.round(avgReadiness),
      skills: {
        logic: { current: 65, last: 40 },
        coding: { current: 80, last: 55 },
        ethics: { current: 45, last: 30 },
        softSkills: { current: 95, last: 70 },
        research: { current: 75, last: 50 }
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudentsMonitoring = async (req: Request, res: Response) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        major: true,
        skillMasteryScore: true,
        careerReadinessScore: true,
        level: true,
        xp: true,
        createdAt: true
      },
      orderBy: { skillMasteryScore: 'desc' }
    });
    res.json(students);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const scheduleIntervention = async (req: Request, res: Response) => {
  const { studentId, message } = req.body;
  try {
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Send a message from Faculty to Student in ChatMessage db
    const chatMsg = await prisma.chatMessage.create({
      data: {
        message: `Intervention scheduled by Faculty: "${message}"`,
        isAiSender: true, // Will show up in chat
        receiverId: studentId
      }
    });

    res.json({ success: true, message: 'Intervention scheduled and message sent', chatMsg });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
