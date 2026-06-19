import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seeder]: Cleaning database...');
  await prisma.chatMessage.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.task.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.studyGroup.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.user.deleteMany();

  console.log('[Seeder]: Creating roles password hashes...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Mentor
  const mentor = await prisma.user.create({
    data: {
      email: 'helena.vance@university.edu',
      password: passwordHash,
      name: 'Dr. Helena Vance',
      role: 'MENTOR',
      title: 'Lead Career Mentor',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop'
    }
  });

  // 2. Create Faculty
  const faculty = await prisma.user.create({
    data: {
      email: 'sarah.chen@university.edu',
      password: passwordHash,
      name: 'Dr. Sarah Chen',
      role: 'FACULTY',
      title: 'Senior Faculty Mentor',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop'
    }
  });

  // 3. Create Admin
  await prisma.user.create({
    data: {
      email: 'admin@university.edu',
      password: passwordHash,
      name: 'System Admin',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop'
    }
  });

  // 4. Create Students (assigned to Helena Vance as mentor)
  const rakesh = await prisma.user.create({
    data: {
      email: 'rakesh@university.edu',
      password: passwordHash,
      name: 'Rakesh Kumar',
      role: 'STUDENT',
      major: 'Computer Science',
      level: 3,
      xp: 2450,
      careerReadinessScore: 75.0,
      skillMasteryScore: 88.0,
      mentorId: mentor.id,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=250&auto=format&fit=crop'
    }
  });

  const aria = await prisma.user.create({
    data: {
      email: 'aria@university.edu',
      password: passwordHash,
      name: 'Aria Lawson',
      role: 'STUDENT',
      major: 'Computer Science',
      level: 4,
      xp: 1200,
      careerReadinessScore: 92.0,
      skillMasteryScore: 85.0,
      mentorId: mentor.id,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop'
    }
  });

  const julian = await prisma.user.create({
    data: {
      email: 'julian@university.edu',
      password: passwordHash,
      name: 'Julian Kang',
      role: 'STUDENT',
      major: 'Data Engineering',
      level: 2,
      xp: 500,
      careerReadinessScore: 78.0,
      skillMasteryScore: 72.0,
      mentorId: mentor.id,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop'
    }
  });

  const maya = await prisma.user.create({
    data: {
      email: 'maya@university.edu',
      password: passwordHash,
      name: 'Maya Patel',
      role: 'STUDENT',
      major: 'UI/UX Design',
      level: 1,
      xp: 200,
      careerReadinessScore: 45.0,
      skillMasteryScore: 42.0,
      mentorId: mentor.id,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&auto=format&fit=crop'
    }
  });

  console.log('[Seeder]: Seeding student details for Rakesh Kumar...');
  
  // Goals for Rakesh
  await prisma.goal.createMany({
    data: [
      { title: 'Fintech Internship', progress: 65.0, studentId: rakesh.id },
      { title: 'System Architecture Mastery', progress: 80.0, studentId: rakesh.id }
    ]
  });

  // Recommended tasks
  await prisma.task.createMany({
    data: [
      { title: 'Complete Module 3: Prompt Engineering', description: 'Will boost your Skill Score by +5 points', xpReward: 200, isCompleted: false, studentId: rakesh.id },
      { title: 'Draft Resume with AI Builder', description: 'Completed yesterday', xpReward: 150, isCompleted: true, studentId: rakesh.id },
      { title: 'Watch Mentorship Session: Future of Fintech', description: '45 mins video • High priority', xpReward: 150, isCompleted: false, studentId: rakesh.id },
      { title: 'Participate in UX Design Quiz', description: 'Deadline: Today at 6 PM', xpReward: 300, isCompleted: false, studentId: rakesh.id }
    ]
  });

  // Badges
  await prisma.badge.createMany({
    data: [
      { title: 'Night Owl', icon: 'dark_mode', color: '#632ce5', studentId: rakesh.id },
      { title: 'Fast Learner', icon: 'bolt', color: '#78dc77', studentId: rakesh.id },
      { title: 'Collaborator', icon: 'groups', color: '#24389c', studentId: rakesh.id }
    ]
  });

  // Chat message history for Rakesh
  await prisma.chatMessage.createMany({
    data: [
      { message: 'Hi Alex! I noticed you spent 3 hours on Python yesterday. Would you like to take a quick quiz to cement that knowledge?', isAiSender: true, receiverId: rakesh.id },
      { message: "Sure, let's do it. Keep it brief!", isAiSender: false, senderId: rakesh.id },
      { message: 'Excellent choice. Question 1: What is the main difference between a list and a tuple in Python?', isAiSender: true, receiverId: rakesh.id }
    ]
  });

  console.log('[Seeder]: Seeding global content...');

  // Opportunities
  await prisma.opportunity.createMany({
    data: [
      { title: 'Global Career Fair 2024', description: 'Events • Aug 12', category: 'Event', applicantsCount: 450 },
      { title: 'Data Science Internship', description: 'Opportunities • Applied (240)', category: 'Internship', applicantsCount: 240 },
      { title: 'Advanced Ethics in AI', description: 'Courses • Module 4', category: 'Course', applicantsCount: 89 }
    ]
  });

  // Study Groups
  await prisma.studyGroup.createMany({
    data: [
      { name: 'Quantum Mechanics Deep Dive', description: 'Physics group exploring quantum structures', category: 'Physics', icon: 'science' },
      { name: 'Next.js & React Creators', description: 'Web design and UI coding workshops', category: 'Coding', icon: 'code' },
      { name: 'Ethics in Artificial Intelligence', description: 'AI ethics discussion group', category: 'Ethics', icon: 'psychology' }
    ]
  });

  console.log('[Seeder]: Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
