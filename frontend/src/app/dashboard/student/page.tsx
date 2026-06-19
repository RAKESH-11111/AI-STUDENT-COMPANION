'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import SideNavBar from '../../../components/SideNavBar';
import TopNavBar from '../../../components/TopNavBar';

export default function StudentDashboard() {
  const router = useRouter();
  const {
    user,
    token,
    initializeAuth,
    fetchStudentData,
    fetchChatHistory,
    chatMessages,
    sendChatMessage,
    toggleTaskCompletion,
    addGoal,
    updateGoalProgress,
    awardXp
  } = useStore();

  const [chatInput, setChatInput] = useState('');
  const [newGoalInput, setNewGoalInput] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Pomodoro Timer States
  const [timerMode, setTimerMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
      handleTimerComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft]);

  const handleTimerComplete = async () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {
      console.error(e);
    }

    if (timerMode === 'focus') {
      await awardXp(50);
      setShowXpPopup(true);
      setTimeout(() => setShowXpPopup(false), 4000);
    }
    resetTimer(timerMode);
  };

  const resetTimer = (mode: 'focus' | 'short' | 'long') => {
    setTimerRunning(false);
    if (mode === 'focus') setTimeLeft(25 * 60);
    else if (mode === 'short') setTimeLeft(5 * 60);
    else if (mode === 'long') setTimeLeft(15 * 60);
  };

  const changeMode = (mode: 'focus' | 'short' | 'long') => {
    setTimerMode(mode);
    resetTimer(mode);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
      fetchChatHistory();
    }
  }, [token]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-spin material-symbols-outlined text-[48px] text-primary">progress_activity</span>
          <p className="font-semibold text-on-surface-variant">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    await sendChatMessage(msg);
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    await addGoal(newGoalInput);
    setNewGoalInput('');
    setShowGoalModal(false);
  };

  const handleGoalProgressTick = async (goalId: string, currentProgress: number) => {
    const newProgress = Math.min(100, currentProgress + 10);
    await updateGoalProgress(goalId, newProgress);
  };

  const level = user.level ?? 1;
  const xp = user.xp ?? 0;
  const careerReadinessScore = user.careerReadinessScore ?? 75.0;
  const skillMasteryScore = user.skillMasteryScore ?? 88.0;

  // Level thresholds
  const xpThreshold = level * 1000;
  const xpPercentage = Math.min(100, Math.round((xp / xpThreshold) * 100));

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
      {/* Styles local to page for dashboard layout */}
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(197, 197, 212, 0.2);
          transition: all 0.3s ease;
        }
        .ai-gradient-border {
          border-top: 3px solid transparent;
          background-image: linear-gradient(white, white), linear-gradient(to right, #632ce5, #7c4dff);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }
        .progress-gradient {
          background: linear-gradient(90deg, #24389c 0%, #632ce5 100%);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c5c5d4; border-radius: 10px; }
      `}</style>

      <SideNavBar currentTab="Dashboard" />

      <main className="flex-grow lg:ml-sidebar-width min-h-screen flex flex-col">
        <TopNavBar placeholder="Search courses, mentors..." />

        {/* Dashboard Canvas */}
        <div className="p-container-padding-mobile md:p-container-padding-desktop space-y-gutter flex-grow">
          
          {/* Welcome back header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Welcome back, {user.name.split(' ')[0]}!
              </h2>
              <p className="text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">auto_awesome</span>
                You're on a 5-day learning streak! Keep it up.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Current Rank</p>
                <p className="text-headline-md text-primary font-black">Explorer</p>
              </div>
              <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-3xl">workspace_premium</span>
              </div>
            </div>
          </div>

          {/* Rewards & XP and Milestones Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            
            {/* Rewards & XP Card */}
            <div className="lg:col-span-2 glass-card p-6 rounded-[24px] flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">REWARDS &amp; XP</h3>
                <span className="text-label-sm font-bold text-primary">{xp} / {xpThreshold} XP</span>
              </div>
              <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden mb-6">
                <div className="h-full progress-gradient relative transition-all duration-500" style={{ width: `${xpPercentage}%` }}>
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[pulse_2s_infinite]"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="text-[10px] font-bold text-primary uppercase">Course Finish</p>
                  <p className="text-label-md font-black text-on-surface">+50 XP</p>
                </div>
                <div className="p-3 bg-secondary/5 rounded-xl border border-secondary/10">
                  <p className="text-[10px] font-bold text-secondary uppercase">Daily Quiz</p>
                  <p className="text-label-md font-black text-on-surface">+20 XP</p>
                </div>
                <div className="p-3 bg-tertiary/5 rounded-xl border border-tertiary/10">
                  <p className="text-[10px] font-bold text-tertiary uppercase">Mentorship</p>
                  <p className="text-label-md font-black text-on-surface">+100 XP</p>
                </div>
                <div className="p-3 bg-surface-container-high rounded-xl border border-outline-variant/10">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Weekly Progress Bonus</p>
                  <p className="text-label-md font-black text-on-surface">+15 XP</p>
                </div>
              </div>
            </div>

            {/* Badges & Milestones Card */}
            <div className="glass-card p-6 rounded-[24px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">BADGES &amp; MILESTONES</h3>
                <button className="text-primary text-xs font-bold hover:underline">View All</button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-on-tertiary-fixed text-sm">rocket_launch</span>
                  </div>
                  <div>
                    <p className="text-label-sm font-bold text-on-surface">First Project</p>
                    <p className="text-[10px] text-on-surface-variant">Completed the initial course setup milestone.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-on-secondary-fixed text-sm">work</span>
                  </div>
                  <div>
                    <p className="text-label-sm font-bold text-on-surface">Internship Secured</p>
                    <p className="text-[10px] text-on-surface-variant">Approved for the Summer Fintech Internship.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Row 1: Gauges & Core Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            
            {/* Career Score */}
            <div className="glass-card p-6 rounded-[24px] flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
              <h3 className="text-label-md font-bold text-on-surface-variant mb-6">Career Readiness Score</h3>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="10"></circle>
                  <circle className="text-primary" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * careerReadinessScore) / 100} strokeLinecap="round" strokeWidth="10"></circle>
                </svg>
                <span className="absolute font-headline-md text-headline-md text-primary">
                  {Math.round(careerReadinessScore)}<span className="text-label-sm">/100</span>
                </span>
              </div>
              <p className="mt-4 text-label-sm text-tertiary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span> +5 this week
              </p>
            </div>

            {/* Skill Score */}
            <div className="glass-card p-6 rounded-[24px] flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-all"></div>
              <h3 className="text-label-md font-bold text-on-surface-variant mb-6">SKILL GROWTH ANALYTICS</h3>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="10"></circle>
                  <circle className="text-secondary" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * skillMasteryScore) / 100} strokeLinecap="round" strokeWidth="10"></circle>
                </svg>
                <span className="absolute font-headline-md text-headline-md text-secondary">
                  {Math.round(skillMasteryScore)}<span className="text-label-sm">/100</span>
                </span>
              </div>
              <p className="mt-4 text-label-sm text-on-surface-variant font-medium">Skill growth analytics and learning progress reports based on your goal completion metrics.</p>
            </div>

            {/* Recent Achievements */}
            <div className="glass-card p-6 rounded-[24px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <h3 className="text-label-md font-bold text-on-surface-variant">Recent Achievements</h3>
                <span className="material-symbols-outlined text-primary">military_tech</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center" title="Night Owl">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>dark_mode</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center" title="Fast Learner">
                  <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center" title="Collaborator">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center border-2 border-dashed border-outline-variant text-on-surface-variant">
                  <span className="text-xs font-bold">+4</span>
                </div>
              </div>
              <div className="mt-6">
                <button className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
                  View Badge Gallery <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

          </div>

          {/* Row 2 (Main): Recommended Tasks & AI Chat Sidebar */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter items-start">
            
            {/* Main Task Column */}
            <div className="xl:col-span-2 space-y-gutter">
              <div className="glass-card ai-gradient-border rounded-[24px] p-8 shadow-xl shadow-secondary/5">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">LEARNING PROGRESS ANALYTICS</h3>
                    <p className="text-on-surface-variant text-body-md">Skill growth analytics and learning progress reports based on your goal completion metrics.</p>
                  </div>
                  <span className="px-3 py-1 bg-secondary-container/20 text-secondary text-label-sm font-bold rounded-full">AI Suggested</span>
                </div>
                
                <div className="space-y-4">
                  {user.tasks && user.tasks.length > 0 ? (
                    user.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`group flex items-center gap-4 p-4 rounded-2xl transition-all border cursor-pointer ${
                          task.isCompleted
                            ? 'bg-white/40 border-outline-variant/10 shadow-sm opacity-70'
                            : 'hover:bg-white/60 border-transparent hover:border-outline-variant/20'
                        }`}
                      >
                        <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${
                          task.isCompleted ? 'border-primary bg-primary' : 'border-outline-variant group-hover:border-primary'
                        }`}>
                          <span className={`material-symbols-outlined text-white text-lg ${task.isCompleted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            check
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-label-md text-label-md text-on-surface ${task.isCompleted ? 'line-through text-on-surface-variant' : ''}`}>
                            {task.title}
                          </h4>
                          <p className="text-label-sm text-on-surface-variant">{task.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.isCompleted ? (
                            <span className="material-symbols-outlined text-tertiary">check_circle</span>
                          ) : (
                            <span className="text-label-sm font-bold text-on-secondary-fixed-variant bg-secondary-fixed px-2 py-1 rounded">
                              {task.xpReward} XP
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-body-md text-on-surface-variant text-center py-8">No tasks recommended right now. Keep exploring!</p>
                  )}
                </div>

                <div className="mt-8 flex justify-center">
                  <button className="px-6 py-3 border border-outline-variant/30 rounded-xl text-label-md font-bold text-primary hover:bg-primary/5 transition-all">
                    See All Scheduled Tasks
                  </button>
                </div>
              </div>
            </div>

            {/* AI Mentor Sidebar & Focus Widget */}
            <div className="space-y-gutter">
              
              {/* AI Mentor Sidebar Widget */}
              <div className="glass-card rounded-[24px] overflow-hidden shadow-lg h-[500px] flex flex-col">
                <div className="bg-primary p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                    </div>
                    <span className="text-white font-bold text-label-md">AI Mentor</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                    <span className="text-[10px] text-white/80 font-bold">ACTIVE</span>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                  {chatMessages.length === 0 ? (
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-secondary-container/20 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-secondary text-xs">smart_toy</span>
                      </div>
                      <div className="bg-surface-container-high rounded-2xl rounded-tl-none p-3 text-label-sm text-on-surface max-w-[85%]">
                        Hi {user.name.split(' ')[0]}! I've analyzed your progress. Based on your goal of 'Python Mastery', I've prepared a personalized academic guide for your next semester planning. Ready to review your career counseling insights?
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex items-start gap-3 ${msg.isAiSender ? '' : 'self-end'}`}>
                        {msg.isAiSender && (
                          <div className="w-6 h-6 rounded-full bg-secondary-container/20 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-secondary text-xs">smart_toy</span>
                          </div>
                        )}
                        <div className={`rounded-2xl p-3 text-label-sm max-w-[85%] leading-relaxed ${
                          msg.isAiSender
                            ? 'bg-surface-container-high rounded-tl-none text-on-surface'
                            : 'bg-primary text-white rounded-tr-none shadow-sm'
                        }`}>
                          {msg.message}
                        </div>
                        {!msg.isAiSender && (
                          <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendChat} className="p-4 bg-surface-container-low border-t border-outline-variant/10">
                  <div className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-body-md shadow-sm text-on-surface"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-secondary hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Pomodoro Focus Timer Widget */}
              <div className="glass-card p-6 rounded-[24px] flex flex-col justify-between shadow-sm relative overflow-hidden">
                {showXpPopup && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-secondary to-primary text-white flex flex-col items-center justify-center p-4 z-10 animate-in fade-in duration-300">
                    <span className="material-symbols-outlined text-[36px] animate-bounce">auto_awesome</span>
                    <p className="font-extrabold text-[18px] mt-2">Pomodoro Completed!</p>
                    <p className="text-[13px] text-primary-fixed-dim font-bold">+50 XP Awarded</p>
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Focus Session</h3>
                  <span className="material-symbols-outlined text-secondary animate-pulse">timer</span>
                </div>
                <div className="flex justify-around bg-surface-container/60 p-1.5 rounded-xl mb-4">
                  <button onClick={() => changeMode('focus')} className={`px-2.5 py-1 rounded-lg text-label-sm font-bold transition-all ${timerMode === 'focus' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Focus</button>
                  <button onClick={() => changeMode('short')} className={`px-2.5 py-1 rounded-lg text-label-sm font-bold transition-all ${timerMode === 'short' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Break</button>
                  <button onClick={() => changeMode('long')} className={`px-2.5 py-1 rounded-lg text-label-sm font-bold transition-all ${timerMode === 'long' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Long</button>
                </div>
                <div className="text-center py-2">
                  <p className="text-[36px] font-black text-on-surface font-mono tracking-tight">{formatTime(timeLeft)}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setTimerRunning(!timerRunning)} className="flex-grow py-2 bg-primary text-white rounded-xl text-label-sm font-bold shadow-md hover:opacity-95 transition-all">
                    {timerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button onClick={() => setTimeLeft(5)} className="px-2 py-2 border border-outline-variant/30 text-on-surface-variant rounded-xl text-[10px] font-bold hover:bg-surface-container transition-all" title="Trigger +50 XP (Dev Fast Test)">
                    [Test]
                  </button>
                  <button onClick={() => resetTimer(timerMode)} className="px-3 py-2 border border-outline-variant/30 text-on-surface-variant rounded-xl text-label-sm font-bold hover:bg-surface-container transition-all">
                    Reset
                  </button>
                </div>
              </div>

              {/* Goal List Under AI Chat */}
              <div className="glass-card rounded-[24px] p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">Goal Setting &amp; Tracking</h3>
                  <button onClick={() => setShowGoalModal(true)} className="text-secondary font-bold text-label-sm hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">add_circle</span> Add Goal
                  </button>
                </div>
                <div className="space-y-4">
                  {user.goals && user.goals.length > 0 ? (
                    user.goals.map((goal) => (
                      <div key={goal.id} className="space-y-2 cursor-pointer group" onClick={() => handleGoalProgressTick(goal.id, goal.progress)}>
                        <div className="flex justify-between text-label-sm font-medium">
                          <span className="group-hover:text-primary transition-colors">{goal.title}</span>
                          <span className="text-on-surface-variant font-bold">{goal.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${goal.progress}%` }}></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-label-sm text-on-surface-variant">No active goals. Click above to add one!</p>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Row 3: Weekly Growth Report */}
          <div className="grid grid-cols-1 gap-gutter">
            <div className="glass-card p-8 rounded-[24px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">LEARNING PROGRESS ANALYTICS</h3>
                  <p className="text-on-surface-variant text-body-md">Skill growth analytics and learning progress reports based on your goal completion metrics.</p>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-high/50 p-1 rounded-lg">
                  <button className="px-4 py-1.5 bg-white shadow-sm rounded-md text-label-sm font-bold text-primary">Hours Spent</button>
                  <button className="px-4 py-1.5 text-label-sm font-bold text-on-surface-variant hover:text-primary transition-colors">XP Earned</button>
                </div>
              </div>
              
              {/* Dummy Chart Representation */}
              <div className="h-64 w-full flex items-end justify-between gap-2 md:gap-6 pt-4 border-b border-outline-variant/10">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-surface-container-highest rounded-t-lg transition-all hover:bg-primary-container h-[40%]"></div>
                  <span className="text-label-sm text-on-surface-variant">Mon</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-surface-container-highest rounded-t-lg transition-all hover:bg-primary-container h-[65%]"></div>
                  <span className="text-label-sm text-on-surface-variant">Tue</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-surface-container-highest rounded-t-lg transition-all hover:bg-primary-container h-[55%]"></div>
                  <span className="text-label-sm text-on-surface-variant">Wed</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary-container h-[90%] shadow-lg shadow-primary/20"></div>
                  <span className="text-label-sm text-on-surface-variant font-bold text-primary">Thu</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-surface-container-highest rounded-t-lg transition-all hover:bg-primary-container h-[45%]"></div>
                  <span className="text-label-sm text-on-surface-variant">Fri</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-surface-container-highest rounded-t-lg transition-all hover:bg-primary-container h-[30%]"></div>
                  <span className="text-label-sm text-on-surface-variant">Sat</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-surface-container-highest rounded-t-lg transition-all hover:bg-primary-container h-[20%]"></div>
                  <span className="text-label-sm text-on-surface-variant">Sun</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <p className="text-label-sm text-on-surface-variant font-bold">Skill growth analytics and learning progress reports based on your goal completion metrics.</p>
                  <h4 className="font-headline-md text-headline-md text-primary">24h 15m</h4>
                  <p className="text-[10px] text-tertiary font-bold">+12% from last week</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <p className="text-label-sm text-on-surface-variant font-bold">Skill growth analytics and learning progress reports based on your goal completion metrics.</p>
                  <h4 className="font-headline-md text-headline-md text-secondary">Data structures</h4>
                  <p className="text-[10px] text-on-surface-variant font-bold">Skill growth analytics and learning progress reports based on your goal completion metrics.</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <p className="text-label-sm text-on-surface-variant font-bold">Skill growth analytics and learning progress reports based on your goal completion metrics.</p>
                  <h4 className="font-headline-md text-headline-md text-tertiary">92%</h4>
                  <p className="text-[10px] text-on-surface-variant font-bold">Skill growth analytics and learning progress reports based on your goal completion metrics.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer (Shared Component) */}
        <footer className="w-full py-12 px-container-padding-desktop mt-auto bg-surface-container-highest border-t border-outline-variant/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-7xl mx-auto">
            <div className="space-y-4">
              <div className="font-headline-md text-headline-md font-bold text-primary tracking-tight">AI COMPANION</div>
              <p className="text-body-md text-on-surface-variant">© 2024 AI Companion. Empowering Student Journeys through empathetic intelligence and data-driven insights.</p>
            </div>
            <div className="flex flex-col gap-3">
              <h5 className="text-label-md font-bold text-on-surface uppercase tracking-widest">Platform</h5>
              <a className="text-on-surface-variant hover:text-primary transition-all hover:underline text-body-md" href="#">University Partners</a>
              <a className="text-on-surface-variant hover:text-primary transition-all hover:underline text-body-md" href="#">Faculty Portal</a>
              <a className="text-on-surface-variant hover:text-primary transition-all hover:underline text-body-md" href="#">AI Ethics Code</a>
            </div>
            <div className="flex flex-col gap-3">
              <h5 className="text-label-md font-bold text-on-surface uppercase tracking-widest">Support</h5>
              <a className="text-on-surface-variant hover:text-primary transition-all hover:underline text-body-md" href="#">Privacy Policy</a>
              <a className="text-on-surface-variant hover:text-primary transition-all hover:underline text-body-md" href="#">Terms of Service</a>
              <a className="text-on-surface-variant hover:text-primary transition-all hover:underline text-body-md" href="#">Help Center</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Add Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-outline-variant/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-[18px] text-on-surface mb-2">Create New Goal</h3>
            <p className="text-[12px] text-on-surface-variant mb-4">Enter a study goal or benchmark to track on your dashboard.</p>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <input
                type="text"
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                placeholder="e.g. Finish Python Course"
                className="w-full h-12 border border-outline-variant/30 rounded-xl px-4 text-[14px] focus:ring-2 focus:ring-primary/20 outline-none text-on-surface"
                required
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowGoalModal(false)} className="px-4 py-2 border border-outline-variant/30 rounded-xl text-[12px] font-bold text-on-surface-variant hover:bg-surface-container">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-primary text-white rounded-xl text-[12px] font-bold shadow-md hover:opacity-90">
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

