import { create } from 'zustand';

interface Goal {
  id: string;
  title: string;
  progress: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
}

interface Badge {
  id: string;
  title: string;
  icon: string;
  color: string;
}

interface ChatMessage {
  id: string;
  message: string;
  isAiSender: boolean;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'FACULTY' | 'MENTOR' | 'ADMIN';
  avatarUrl?: string;
  title?: string;
  level: number;
  xp: number;
  careerReadinessScore: number;
  skillMasteryScore: number;
  major?: string;
  goals: Goal[];
  tasks: Task[];
  achievements: Badge[];
}

interface StoreState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  chatMessages: ChatMessage[];
  studyGroups: any[];
  opportunities: any[];
  
  // Faculty specific data
  batchInsights: any | null;
  monitoredStudents: any[];
  
  // Mentor specific data
  mentees: any[];
  mentorshipRequests: any[];

  // Admin specific data
  adminStats: any | null;
  allUsers: any[];

  // Actions
  initializeAuth: () => Promise<void>;
  login: (credentials: any) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  
  // Student Actions
  fetchStudentData: () => Promise<void>;
  addGoal: (title: string) => Promise<void>;
  updateGoalProgress: (id: string, progress: number) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  fetchChatHistory: () => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  fetchStudyGroups: () => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  fetchOpportunities: () => Promise<void>;
  awardXp: (xpReward: number) => Promise<void>;

  // Faculty Actions
  fetchFacultyData: () => Promise<void>;
  triggerIntervention: (studentId: string, message: string) => Promise<void>;

  // Mentor Actions
  fetchMentorData: () => Promise<void>;
  acceptMentee: (studentId: string) => Promise<void>;

  // Admin Actions
  fetchAdminData: () => Promise<void>;
  addOpportunity: (data: any) => Promise<void>;
  deleteUserAccount: (userId: string) => Promise<void>;
  deleteOpportunity: (oppId: string) => Promise<void>;
}

const API_BASE = 'http://localhost:5000/api';

export const useStore = create<StoreState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  chatMessages: [],
  studyGroups: [],
  opportunities: [],
  
  batchInsights: null,
  monitoredStudents: [],
  
  mentees: [],
  mentorshipRequests: [],

  adminStats: null,
  allUsers: [],

  initializeAuth: async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('rai_token');
    if (!token) return;

    set({ token, isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const user = await res.json();
        set({ user, isAuthenticated: true, error: null });
      } else {
        localStorage.removeItem('rai_token');
        set({ token: null, user: null, isAuthenticated: false });
      }
    } catch (err) {
      set({ error: 'Auth connection failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error || 'Login failed' });
        return false;
      }
      localStorage.setItem('rai_token', data.token);
      set({ token: data.token, user: data.user, isAuthenticated: true, error: null });
      return true;
    } catch (err) {
      set({ error: 'Server connection failed' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (registerData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error || 'Registration failed' });
        return false;
      }
      localStorage.setItem('rai_token', data.token);
      set({ token: data.token, user: data.user, isAuthenticated: true, error: null });
      return true;
    } catch (err) {
      set({ error: 'Server connection failed' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('rai_token');
    set({ token: null, user: null, isAuthenticated: false, chatMessages: [] });
  },

  fetchStudentData: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const user = await res.json();
        set({ user });
      }
    } catch (err) {
      console.error(err);
    }
  },

  addGoal: async (title) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/student/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, progress: 0 })
      });
      if (res.ok) {
        await get().fetchStudentData();
      }
    } catch (err) {
      console.error(err);
    }
  },

  updateGoalProgress: async (id, progress) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/student/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ progress })
      });
      if (res.ok) {
        await get().fetchStudentData();
      }
    } catch (err) {
      console.error(err);
    }
  },

  toggleTaskCompletion: async (id) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/student/tasks/${id}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await get().fetchStudentData();
      }
    } catch (err) {
      console.error(err);
    }
  },

  fetchChatHistory: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/student/chat`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const chatMessages = await res.json();
        set({ chatMessages });
      }
    } catch (err) {
      console.error(err);
    }
  },

  sendChatMessage: async (message) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/student/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });
      if (res.ok) {
        await get().fetchChatHistory();
        await get().fetchStudentData(); // Update XP / Levels if AI triggered rewards
      }
    } catch (err) {
      console.error(err);
    }
  },

  fetchStudyGroups: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/student/groups`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const studyGroups = await res.json();
        set({ studyGroups });
      }
    } catch (err) {
      console.error(err);
    }
  },

  joinGroup: async (groupId) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/student/groups/${groupId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await get().fetchStudyGroups();
        await get().fetchStudentData();
      }
    } catch (err) {
      console.error(err);
    }
  },

  leaveGroup: async (groupId) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/student/groups/${groupId}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await get().fetchStudyGroups();
        await get().fetchStudentData();
      }
    } catch (err) {
      console.error(err);
    }
  },

  fetchOpportunities: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/student/opportunities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const opportunities = await res.json();
        set({ opportunities });
      }
    } catch (err) {
      console.error(err);
    }
  },

  awardXp: async (xpReward) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/student/add-xp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ xpReward })
      });
      if (res.ok) {
        const data = await res.json();
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              xp: data.xp,
              level: data.level,
              careerReadinessScore: data.careerReadinessScore,
              skillMasteryScore: data.skillMasteryScore
            }
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
  fetchFacultyData: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const insightsRes = await fetch(`${API_BASE}/faculty/insights`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const monitoringRes = await fetch(`${API_BASE}/faculty/monitoring`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (insightsRes.ok && monitoringRes.ok) {
        set({
          batchInsights: await insightsRes.json(),
          monitoredStudents: await monitoringRes.json()
        });
      }
    } catch (err) {
      console.error(err);
    }
  },

  triggerIntervention: async (studentId, message) => {
    const { token } = get();
    if (!token) return;
    try {
      await fetch(`${API_BASE}/faculty/intervention`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ studentId, message })
      });
    } catch (err) {
      console.error(err);
    }
  },

  // Mentor Actions
  fetchMentorData: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const menteesRes = await fetch(`${API_BASE}/mentor/mentees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const requestsRes = await fetch(`${API_BASE}/mentor/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (menteesRes.ok && requestsRes.ok) {
        set({
          mentees: await menteesRes.json(),
          mentorshipRequests: await requestsRes.json()
        });
      }
    } catch (err) {
      console.error(err);
    }
  },

  acceptMentee: async (studentId) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/mentor/requests/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ studentId })
      });
      if (res.ok) {
        await get().fetchMentorData();
      }
    } catch (err) {
      console.error(err);
    }
  },

  // Admin Actions
  fetchAdminData: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const statsRes = await fetch(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersRes = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok && usersRes.ok) {
        set({
          adminStats: await statsRes.json(),
          allUsers: await usersRes.json()
        });
      }
    } catch (err) {
      console.error(err);
    }
  },

  addOpportunity: async (oppData) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/opportunity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(oppData)
      });
      if (res.ok) {
        await get().fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  },

  deleteUserAccount: async (userId) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await get().fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  },

  deleteOpportunity: async (oppId) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/opportunity/${oppId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await get().fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  }
}));
