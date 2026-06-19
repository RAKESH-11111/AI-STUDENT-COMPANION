import { Request, Response } from 'express';
import prisma from '../prisma';

export const getSystemStats = async (req: Request, res: Response) => {
  try {
    const studentsCount = await prisma.user.count({ where: { role: 'STUDENT' } });
    const facultyCount = await prisma.user.count({ where: { role: 'FACULTY' } });
    const mentorsCount = await prisma.user.count({ where: { role: 'MENTOR' } });

    res.json({
      students: studentsCount,
      faculty: facultyCount,
      mentors: mentorsCount,
      systemStatus: 'Operational',
      growthTrend: [40, 60, 50, 80, 95]
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const listAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        major: true,
        level: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createOpportunity = async (req: Request, res: Response) => {
  const { title, description, category, logoUrl } = req.body;
  try {
    const opp = await prisma.opportunity.create({
      data: {
        title,
        description,
        category, // "Job" | "Internship" | "Event" | "Course"
        logoUrl
      }
    });
    res.status(201).json(opp);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOpportunity = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.opportunity.delete({ where: { id } });
    res.json({ success: true, message: 'Opportunity deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
