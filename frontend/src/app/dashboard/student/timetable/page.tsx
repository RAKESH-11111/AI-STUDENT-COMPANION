'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';
import FloatingAiAssistant from '../../../../components/FloatingAiAssistant';

export default function Timetable() {
  const router = useRouter();
  const { user, token, initializeAuth, fetchStudentData } = useStore();

  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'list'>('weekly');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');

  // Local state for today's focus items
  const [focusTasks, setFocusTasks] = useState([
    { id: '1', title: 'Thesis Proposal', dueInfo: 'Due in 4 hours', isUrgent: true },
    { id: '2', title: 'Reading Assignment', dueInfo: 'Philosophy Ch. 4-6', isUrgent: false }
  ]);

  useEffect(() => {
    const checkAuth = async () => {
      await initializeAuth();
      if (!localStorage.getItem('rai_token')) {
        router.push('/login');
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (token) {
      fetchStudentData();
    }
  }, [token]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span className="animate-spin material-symbols-outlined text-[48px] text-primary">progress_activity</span>
      </div>
    );
  }

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setFocusTasks([
      ...focusTasks,
      { id: Date.now().toString(), title: newTaskInput, dueInfo: 'Just added', isUrgent: false }
    ]);
    setNewTaskInput('');
    setShowAddTaskModal(false);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans">
      <SideNavBar currentTab="Timetable" />

      <main className="flex-1 lg:ml-sidebar-width min-h-screen flex flex-col overflow-hidden">
        {/* Custom Header with Views */}
        <header className="sticky top-0 z-40 w-full bg-surface/85 backdrop-blur-md border-b border-outline-variant/10 flex justify-between items-center h-16 px-gutter">
          <div className="flex items-center gap-8">
            <h2 className="font-headline-md text-headline-md font-extrabold text-primary">EduAI</h2>
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={() => setActiveTab('weekly')}
                className={`font-label-md text-label-md transition-all ${
                  activeTab === 'weekly' ? 'text-primary border-b-2 border-primary pb-2' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Weekly View
              </button>
              <button 
                onClick={() => setActiveTab('monthly')}
                className={`font-label-md text-label-md transition-all ${
                  activeTab === 'monthly' ? 'text-primary border-b-2 border-primary pb-2' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Monthly View
              </button>
              <button 
                onClick={() => setActiveTab('list')}
                className={`font-label-md text-label-md transition-all ${
                  activeTab === 'list' ? 'text-primary border-b-2 border-primary pb-2' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                List
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
              <input 
                className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-secondary/30 w-64 transition-all outline-none text-on-surface" 
                placeholder="Search events..." 
                type="text"
              />
            </div>
            <button className="p-2 rounded-full hover:bg-surface-container transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            <span className="text-label-md text-on-surface-variant mr-2 hidden sm:inline">{user.name.split(' ')[0]}</span>
            <div className="w-8 h-8 rounded-full bg-primary-fixed overflow-hidden border border-outline-variant/30 cursor-pointer">
              <img 
                className="w-full h-full object-cover" 
                alt="User Profile" 
                src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
              />
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="flex-1 p-gutter overflow-y-auto custom-scrollbar flex flex-col xl:flex-row gap-gutter">
          
          {/* Calendar Grid Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">September 11 – 17, 2026</h3>
                <p className="text-body-md text-on-surface-variant">Your peak focus time is usually 10:00 AM.</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="px-4 py-2 rounded-lg bg-surface-container font-label-md hover:bg-surface-container-high transition-colors">Today</button>
                <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Bento Grid Calendar */}
            <div className="grid grid-cols-8 gap-1 bg-outline-variant/10 rounded-2xl overflow-hidden glass-card shadow-sm border border-outline-variant/10 p-1 min-w-[700px]">
              
              {/* Time Column */}
              <div className="col-span-1 grid grid-rows-10 gap-1 pt-12 text-center text-label-sm text-on-surface-variant">
                <div className="h-20">08:00</div>
                <div className="h-20">09:00</div>
                <div className="h-20">10:00</div>
                <div className="h-20">11:00</div>
                <div className="h-20">12:00</div>
                <div className="h-20">13:00</div>
                <div className="h-20">14:00</div>
                <div className="h-20">15:00</div>
                <div className="h-20">16:00</div>
                <div className="h-20">17:00</div>
              </div>

              {/* Mon */}
              <div className="col-span-1 flex flex-col gap-1">
                <div className="h-12 flex flex-col items-center justify-center font-label-md text-on-surface-variant">Mon <span className="text-on-surface">11</span></div>
                <div className="relative flex-1 bg-surface-container-lowest/30 rounded-lg min-h-[800px]">
                  <div className="absolute top-4 left-0 right-0 h-40 m-1 p-2 rounded-xl bg-secondary-container/20 border-l-4 border-secondary text-on-secondary-fixed-variant group transition-all hover:scale-[1.02] cursor-pointer">
                    <p className="text-label-sm font-bold">Advanced Calculus</p>
                    <p className="text-[10px] opacity-70">08:30 - 10:30</p>
                    <div className="mt-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">Room 402B • Prof. Henderson</div>
                  </div>
                  <div className="absolute top-[280px] left-0 right-0 h-24 m-1 p-2 rounded-xl bg-primary-container/10 border-l-4 border-primary text-primary group transition-all hover:scale-[1.02] cursor-pointer">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">psychology</span>
                      <p className="text-label-sm font-bold">AI Review</p>
                    </div>
                    <p className="text-[10px] opacity-70">14:00 - 15:30</p>
                  </div>
                </div>
              </div>

              {/* Tue */}
              <div className="col-span-1 flex flex-col gap-1">
                <div className="h-12 flex flex-col items-center justify-center font-label-md text-on-surface-variant">Tue <span className="text-on-surface">12</span></div>
                <div className="relative flex-1 bg-surface-container-lowest/30 rounded-lg">
                  <div className="absolute top-[120px] left-0 right-0 h-32 m-1 p-2 rounded-xl bg-tertiary-fixed/30 border-l-4 border-tertiary text-on-tertiary-fixed-variant group transition-all hover:scale-[1.02] cursor-pointer">
                    <p className="text-label-sm font-bold">Lab: Organic Chem</p>
                    <p className="text-[10px] opacity-70">10:00 - 12:00</p>
                  </div>
                  <div className="absolute top-[320px] left-0 right-0 h-32 m-1 p-2 rounded-xl bg-primary-container/10 border-l-4 border-primary text-primary group transition-all hover:scale-[1.02] cursor-pointer">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      <p className="text-label-sm font-bold">Deep Focus</p>
                    </div>
                    <p className="text-[10px] opacity-70">15:00 - 17:00</p>
                  </div>
                </div>
              </div>

              {/* Wed */}
              <div className="col-span-1 flex flex-col gap-1 bg-primary/5">
                <div className="h-12 flex flex-col items-center justify-center font-label-md text-primary bg-primary/10 rounded-t-xl">Wed <span className="text-[18px] font-bold">13</span></div>
                <div className="relative flex-1 bg-surface-container-lowest/50 rounded-b-xl border-x border-primary/20">
                  <div className="absolute top-2 left-0 right-0 h-16 m-1 p-2 rounded-xl bg-secondary-container/20 border-l-4 border-secondary text-on-secondary-fixed-variant group transition-all hover:scale-[1.02] cursor-pointer">
                    <p className="text-label-sm font-bold">Seminar: Ethics</p>
                    <p className="text-[10px] opacity-70">08:00 - 09:30</p>
                  </div>
                  <div className="absolute top-[160px] left-0 right-0 h-48 m-1 p-2 rounded-xl bg-secondary-container/20 border-l-4 border-secondary text-on-secondary-fixed-variant group transition-all hover:scale-[1.02] cursor-pointer">
                    <p className="text-label-sm font-bold">Neuroscience 101</p>
                    <p className="text-[10px] opacity-70">11:00 - 14:00</p>
                  </div>
                  {/* Current Time Indicator Simulation */}
                  <div className="absolute top-[280px] w-full border-t-2 border-error/50 z-10 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-error -ml-1"></span>
                  </div>
                </div>
              </div>

              {/* Thu */}
              <div className="col-span-1 flex flex-col gap-1">
                <div className="h-12 flex flex-col items-center justify-center font-label-md text-on-surface-variant">Thu <span className="text-on-surface">14</span></div>
                <div className="relative flex-1 bg-surface-container-lowest/30 rounded-lg">
                  <div className="absolute top-[80px] left-0 right-0 h-24 m-1 p-2 rounded-xl bg-primary-container/10 border-l-4 border-primary text-primary group transition-all hover:scale-[1.02] cursor-pointer">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      <p className="text-label-sm font-bold">Practice Quiz</p>
                    </div>
                    <p className="text-[10px] opacity-70">09:00 - 10:30</p>
                  </div>
                </div>
              </div>

              {/* Fri */}
              <div className="col-span-1 flex flex-col gap-1">
                <div className="h-12 flex flex-col items-center justify-center font-label-md text-on-surface-variant">Fri <span className="text-on-surface">15</span></div>
                <div className="relative flex-1 bg-surface-container-lowest/30 rounded-lg">
                  <div className="absolute top-4 left-0 right-0 h-40 m-1 p-2 rounded-xl bg-secondary-container/20 border-l-4 border-secondary text-on-secondary-fixed-variant">
                    <p className="text-label-sm font-bold">History of Art</p>
                    <p className="text-[10px] opacity-70">08:30 - 11:30</p>
                  </div>
                </div>
              </div>

              {/* Sat */}
              <div className="col-span-1 flex flex-col gap-1 opacity-60">
                <div className="h-12 flex flex-col items-center justify-center font-label-md text-on-surface-variant">Sat <span className="text-on-surface">16</span></div>
                <div className="relative flex-1 bg-surface-container-lowest/20 rounded-lg"></div>
              </div>

              {/* Sun */}
              <div className="col-span-1 flex flex-col gap-1 opacity-60">
                <div className="h-12 flex flex-col items-center justify-center font-label-md text-on-surface-variant">Sun <span className="text-on-surface">17</span></div>
                <div className="relative flex-1 bg-surface-container-lowest/20 rounded-lg"></div>
              </div>

            </div>
          </div>

          {/* Sidebar Section */}
          <aside className="w-full xl:w-80 space-y-6 flex flex-col">
            
            {/* Today's Focus Card */}
            <div className="glass-card rounded-2xl p-6 ai-gradient-border shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <span className="material-symbols-outlined text-secondary">stars</span>
                </div>
                <h4 className="font-headline-md text-on-surface text-[18px]">Today's Focus</h4>
              </div>
              <div className="space-y-4">
                {focusTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-surface rounded-xl border border-outline-variant/30 flex gap-3">
                    <div className={`h-full w-1 rounded-full ${task.isUrgent ? 'bg-error' : 'bg-secondary'}`} style={{ minHeight: '36px' }}></div>
                    <div>
                      <p className="text-label-md text-on-surface">{task.title}</p>
                      <p className={`text-label-sm ${task.isUrgent ? 'text-error' : 'text-on-surface-variant'}`}>{task.dueInfo}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowAddTaskModal(true)} 
                className="w-full mt-6 py-2 px-4 rounded-xl bg-secondary-container text-on-secondary-container font-label-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_task</span>
                Add New Task
              </button>
            </div>

            {/* AI Learning Insights */}
            <div className="glass-card rounded-2xl p-6 shadow-sm border border-outline-variant/10 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-label-md text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  EduAI Insight
                </h4>
                <p className="text-body-md text-on-surface leading-snug mb-4">
                  You've mastered 85% of "Neural Architectures". I've cleared your afternoon for a specialized practice quiz to bridge the remaining gap.
                </p>
                <div className="flex justify-between items-center text-label-sm text-on-surface-variant">
                  <span>Predicted Grade Boost</span>
                  <span className="text-tertiary font-bold">+4.2%</span>
                </div>
                <div className="mt-2 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full w-[85%]"></div>
                </div>
              </div>
            </div>

            {/* Active Courses Binders */}
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <h4 className="font-label-md text-on-surface-variant mb-4">Active Courses</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-label-sm font-semibold">Calculus III</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-label-sm font-semibold">Neuroscience</span>
                <span className="px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-label-sm font-semibold">Organic Chem</span>
                <span className="px-3 py-1 bg-outline-variant/20 text-on-surface-variant rounded-full text-label-sm font-semibold">Art History</span>
                <span className="px-3 py-1 bg-outline-variant/20 text-on-surface-variant rounded-full text-label-sm font-semibold">Ethics</span>
              </div>
            </div>

          </aside>

        </div>
      </main>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-outline-variant/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-[18px] text-on-surface mb-2">Add New Focus Task</h3>
            <form onSubmit={handleAddNewTask} className="space-y-4">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="e.g. Study Organic Chemistry"
                className="w-full h-12 border border-outline-variant/30 rounded-xl px-4 text-[14px] focus:ring-2 focus:ring-primary/20 outline-none text-on-surface"
                required
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowAddTaskModal(false)} className="px-4 py-2 border border-outline-variant/30 rounded-xl text-[12px] font-bold text-on-surface-variant hover:bg-surface-container">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-primary text-white rounded-xl text-[12px] font-bold shadow-md hover:opacity-90">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FloatingAiAssistant />
    </div>
  );
}
