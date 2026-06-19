import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'rai_companion_super_secret_key';

export const register = async (req: Request, res: Response) => {
  const { email, password, name, role, major } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'STUDENT',
        major,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
      }
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        major: user.major,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        major: user.major,
        avatarUrl: user.avatarUrl,
        level: user.level,
        xp: user.xp,
        careerReadinessScore: user.careerReadinessScore,
        skillMasteryScore: user.skillMasteryScore
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        goals: true,
        tasks: true,
        achievements: true,
        studyGroups: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            icon: true
          }
        },
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            title: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Omit password from output
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch user data' });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Google credential token is required' });
  }

  try {
    // 1. Verify the Google token using Google's tokeninfo API
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!response.ok) {
      return res.status(400).json({ error: 'Invalid Google credential token' });
    }

    const payload = (await response.json()) as any;

    if (!payload.email) {
      return res.status(400).json({ error: 'Google token does not contain email' });
    }

    const email = payload.email;
    const name = payload.name || payload.given_name || 'Google User';
    const avatarUrl = payload.picture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

    // 2. Find or create the user in the database
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create user with a dummy hashed password since they log in via Google
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await prisma.user.create({
        data: {
          email,
          password: dummyPassword,
          name,
          role: 'STUDENT',
          avatarUrl,
          level: 1,
          xp: 0
        }
      });
    }

    // 3. Issue JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        major: user.major,
        avatarUrl: user.avatarUrl,
        level: user.level,
        xp: user.xp,
        careerReadinessScore: user.careerReadinessScore,
        skillMasteryScore: user.skillMasteryScore
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Google login failed' });
  }
};
