'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';
import FloatingAiAssistant from '../../../../components/FloatingAiAssistant';

interface TimetableEvent {
  id: string;
  title: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  startTime: string; // e.g. "08:30"
  endTime: string;   // e.g. "10:30"
  category: 'class' | 'lab' | 'ai-review' | 'deep-focus' | 'quiz';
  location?: string;
  instructor?: string;
}

export default function Timetable() {
  const router = useRouter();
  const { user, token, initializeAuth, fetchStudentData } = useStore();

  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'list'>('weekly');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Form States for new timetable task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDay, setTaskDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('Mon');
  const [taskStartTime, setTaskStartTime] = useState('09:00');
  const [taskEndTime, setTaskEndTime] = useState('10:30');
  const [taskCategory, setTaskCategory] = useState('class');

  // Timetable Events State
  const [events, setEvents] = useState<TimetableEvent[]>([
    {
      id: '1',
      title: 'Advanced Calculus',
      day: 'Mon',
      startTime: '08:30',
      endTime: '10:30',
      category: 'class',
      location: 'Room 402B',
      instructor: 'Prof. Henderson'
    },
    {
      id: '2',
      title: 'AI Review',
      day: 'Mon',
      startTime: '14:00',
      endTime: '15:30',
      category: 'ai-review'
    },
    {
      id: '3',
      title: 'Lab: Organic Chem',
      day: 'Tue',
      startTime: '10:00',
      endTime: '12:00',
      category: 'lab'
    },
    {
      id: '4',
      title: 'Deep Focus',
      day: 'Tue',
      startTime: '15:00',
      endTime: '17:00',
      category: 'deep-focus'
    },
    {
      id: '5',
      title: 'Seminar: Ethics',
      day: 'Wed',
      startTime: '08:00',
      endTime: '09:30',
      category: 'class'
    },
    {
      id: '6',
      title: 'Neuroscience 101',
      day: 'Wed',
      startTime: '11:00',
      endTime: '14:00',
      category: 'class'
    },
    {
      id: '7',
      title: 'Practice Quiz',
      day: 'Thu',
      startTime: '09:00',
      endTime: '10:30',
      category: 'quiz'
    },
    {
      id: '8',
      title: 'History of Art',
      day: 'Fri',
      startTime: '08:30',
      endTime: '11:30',
      category: 'class'
    }
  ]);

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

  const calculatePosition = (startTime: string, endTime: string) => {
    const parseTimeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    const baseMinutes = 8 * 60; // Grid starts at 08:00

    const top = ((startMinutes - baseMinutes) / 60) * 80;
    const height = ((endMinutes - startMinutes) / 60) * 80;

    return {
      top: `${top}px`,
      height: `${height}px`
    };
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'class':
        return 'bg-secondary-container/20 border-l-4 border-secondary text-on-secondary-fixed-variant';
      case 'lab':
        return 'bg-tertiary-fixed/30 border-l-4 border-tertiary text-on-tertiary-fixed-variant';
      case 'ai-review':
      case 'quiz':
        return 'bg-primary-container/10 border-l-4 border-primary text-primary';
      case 'deep-focus':
        return 'bg-primary-container/10 border-l-4 border-primary text-primary';
      default:
        return 'bg-surface-container border-l-4 border-outline text-on-surface';
    }
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newEvent: TimetableEvent = {
      id: Date.now().toString(),
      title: taskTitle,
      day: taskDay,
      startTime: taskStartTime,
      endTime: taskEndTime,
      category: taskCategory as any
    };

    setEvents([...events, newEvent]);

    // Also add to sidebar focus tasks if it's Wednesday (today in mock data)
    if (taskDay === 'Wed') {
      setFocusTasks([
        ...focusTasks,
        {
          id: Date.now().toString(),
          title: taskTitle,
          dueInfo: `${taskStartTime} - ${taskEndTime}`,
          isUrgent: taskCategory === 'deep-focus' || taskCategory === 'ai-review'
        }
      ]);
    }

    // Reset inputs
    setTaskTitle('');
    setTaskDay('Mon');
    setTaskStartTime('09:00');
    setTaskEndTime('10:30');
    setTaskCategory('class');

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

              {/* Monday to Sunday Day Columns */}
              {([
                { key: 'Mon', label: 'Mon', date: '11', isToday: false, isWeekend: false },
                { key: 'Tue', label: 'Tue', date: '12', isToday: false, isWeekend: false },
                { key: 'Wed', label: 'Wed', date: '13', isToday: true, isWeekend: false },
                { key: 'Thu', label: 'Thu', date: '14', isToday: false, isWeekend: false },
                { key: 'Fri', label: 'Fri', date: '15', isToday: false, isWeekend: false },
                { key: 'Sat', label: 'Sat', date: '16', isToday: false, isWeekend: true },
                { key: 'Sun', label: 'Sun', date: '17', isToday: false, isWeekend: true },
              ]).map((day) => {
                const dayEvents = events.filter((e) => e.day === day.key);
                return (
                  <div key={day.key} className={`col-span-1 flex flex-col gap-1 ${day.isToday ? 'bg-primary/5' : ''} ${day.isWeekend ? 'opacity-60' : ''}`}>
                    <div className={`h-12 flex flex-col items-center justify-center font-label-md ${
                      day.isToday ? 'text-primary bg-primary/10 rounded-t-xl' : 'text-on-surface-variant'
                    }`}>
                      {day.label} <span className={day.isToday ? 'text-[18px] font-bold' : 'text-on-surface'}>{day.date}</span>
                    </div>
                    <div className={`relative flex-1 bg-surface-container-lowest/30 rounded-lg min-h-[800px] ${
                      day.isToday ? 'bg-surface-container-lowest/50 rounded-b-xl border-x border-primary/20' : ''
                    }`}>
                      {dayEvents.map((event) => {
                        const pos = calculatePosition(event.startTime, event.endTime);
                        return (
                          <div
                            key={event.id}
                            style={{ top: pos.top, height: pos.height }}
                            className={`absolute left-0 right-0 m-1 p-2 rounded-xl group transition-all hover:scale-[1.02] cursor-pointer ${getCategoryStyles(event.category)}`}
                          >
                            <div className="flex items-center gap-1">
                              {event.category === 'ai-review' && <span className="material-symbols-outlined text-[14px]">psychology</span>}
                              {event.category === 'deep-focus' && <span className="material-symbols-outlined text-[14px]">bolt</span>}
                              {event.category === 'quiz' && <span className="material-symbols-outlined text-[14px]">auto_awesome</span>}
                              <p className="text-label-sm font-bold truncate">{event.title}</p>
                            </div>
                            <p className="text-[10px] opacity-70">{event.startTime} - {event.endTime}</p>
                            {(event.location || event.instructor) && (
                              <div className="mt-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 truncate">
                                {event.location} {event.instructor && `• ${event.instructor}`}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {day.isToday && (
                        <div className="absolute top-[280px] w-full border-t-2 border-error/50 z-10 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-error -ml-1"></span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

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
          <div className="bg-white dark:bg-[#0c0f1d] rounded-3xl p-6 w-full max-w-sm border border-outline-variant/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-[18px] text-on-surface mb-4">Add Timetable Task</h3>
            <form onSubmit={handleAddNewTask} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Advanced Calculus"
                  className="w-full h-12 border border-outline-variant/30 dark:border-outline-variant/10 bg-surface dark:bg-surface-container-high rounded-xl px-4 text-[14px] outline-none text-on-surface"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Day of Week</label>
                <select
                  value={taskDay}
                  onChange={(e) => setTaskDay(e.target.value as any)}
                  className="w-full h-12 border border-outline-variant/30 dark:border-outline-variant/10 bg-surface dark:bg-surface-container-high rounded-xl px-4 text-[14px] outline-none text-on-surface"
                >
                  <option value="Mon">Monday</option>
                  <option value="Tue">Tuesday</option>
                  <option value="Wed">Wednesday</option>
                  <option value="Thu">Thursday</option>
                  <option value="Fri">Friday</option>
                  <option value="Sat">Saturday</option>
                  <option value="Sun">Sunday</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Start Time</label>
                  <input
                    type="time"
                    value={taskStartTime}
                    onChange={(e) => setTaskStartTime(e.target.value)}
                    className="w-full h-12 border border-outline-variant/30 dark:border-outline-variant/10 bg-surface dark:bg-surface-container-high rounded-xl px-4 text-[14px] outline-none text-on-surface"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">End Time</label>
                  <input
                    type="time"
                    value={taskEndTime}
                    onChange={(e) => setTaskEndTime(e.target.value)}
                    className="w-full h-12 border border-outline-variant/30 dark:border-outline-variant/10 bg-surface dark:bg-surface-container-high rounded-xl px-4 text-[14px] outline-none text-on-surface"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Category</label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full h-12 border border-outline-variant/30 dark:border-outline-variant/10 bg-surface dark:bg-surface-container-high rounded-xl px-4 text-[14px] outline-none text-on-surface"
                >
                  <option value="class">Class (Secondary Color)</option>
                  <option value="lab">Lab (Tertiary Color)</option>
                  <option value="deep-focus">Deep Focus (Primary Color)</option>
                  <option value="ai-review">AI Review (Primary Color)</option>
                  <option value="quiz">Practice Quiz (Primary Color)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowAddTaskModal(false)} className="px-4 py-2.5 border border-outline-variant/30 rounded-xl text-[12px] font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-primary text-white rounded-xl text-[12px] font-bold shadow-md hover:opacity-90 transition-all">
                  Schedule Task
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
