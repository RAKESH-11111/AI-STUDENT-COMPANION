'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';
import SideNavBar from '../../components/SideNavBar';
import TopNavBar from '../../components/TopNavBar';

export default function ProjectOverview() {
  const router = useRouter();
  const { user, initializeAuth, isLoading } = useStore();

  useEffect(() => {
    const checkAuth = async () => {
      await initializeAuth();
      if (!localStorage.getItem('rai_token')) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [initializeAuth, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-spin material-symbols-outlined text-[48px] text-primary">progress_activity</span>
          <p className="font-semibold text-on-surface-variant">Loading Ecosystem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex font-sans relative">
      {/* Shared SideNavBar */}
      <SideNavBar currentTab="Home" />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-sidebar-width min-h-screen flex flex-col relative overflow-hidden">
        {/* TopNavBar */}
        <TopNavBar placeholder="Search insights..." />

        {/* Main Canvas Content */}
        <div className="pt-8 pb-16 px-container-padding-mobile md:px-container-padding-desktop w-full max-w-7xl mx-auto flex flex-col gap-12 flex-grow">
          
          {/* Row 1: Student Ecosystem */}
          <section className="flex flex-col gap-6 mt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Student Learning &amp; Growth Experience</h2>
                  <span className="bg-secondary-container/20 text-secondary px-3 py-1 rounded-full text-label-sm font-label-sm border border-secondary/20">
                    User: {user.name}
                  </span>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  The core personalized platform for {user.name} and other learners.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Student Module Cards */}
              <Link 
                href="/dashboard/student"
                className="glass-card p-6 rounded-2xl group hover:scale-[1.03] transition-all duration-300 border border-outline-variant/10 cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="material-symbols-outlined text-[32px]">dashboard</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Student Dashboard</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  A holistic view of current progress, daily goals, and upcoming sessions.
                </p>
              </Link>

              <Link 
                href="/dashboard/student/learning"
                className="glass-card p-6 rounded-2xl group hover:scale-[1.03] transition-all duration-300 border border-outline-variant/10 cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="material-symbols-outlined text-[32px]">event_note</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Learning Planner</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  AI-curated study schedules that adapt to your learning pace.
                </p>
              </Link>

              <Link 
                href="/dashboard/student/career"
                className="glass-card p-6 rounded-2xl group hover:scale-[1.03] transition-all duration-300 border border-outline-variant/10 cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="material-symbols-outlined text-[32px]">alt_route</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Career Navigator</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Mapping educational pathways to long-term professional aspirations.
                </p>
              </Link>

              <Link 
                href="/dashboard/student/opportunities"
                className="glass-card p-6 rounded-2xl group hover:scale-[1.03] transition-all duration-300 border border-outline-variant/10 cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="material-symbols-outlined text-[32px]">work</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Opportunity Explorer</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Real-time matching with internships, projects, and scholarships.
                </p>
              </Link>

              <Link 
                href="/dashboard/student/community"
                className="glass-card p-6 rounded-2xl group hover:scale-[1.03] transition-all duration-300 border border-outline-variant/10 cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="material-symbols-outlined text-[32px]">groups</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Community Hub</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Connect with peer study groups and collaborative learning circles.
                </p>
              </Link>

              <Link 
                href="/dashboard/student/timetable"
                className="glass-card p-6 rounded-2xl group hover:scale-[1.03] transition-all duration-300 border border-outline-variant/10 cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="material-symbols-outlined text-[32px]">schedule</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">My Timetable</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Unified calendar for lectures, exams, and personal study blocks.
                </p>
              </Link>
            </div>
          </section>

          {/* Row 2: Administrative Control */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Administrative &amp; Faculty Management</h2>
                  <span className="bg-tertiary-container/20 text-tertiary px-3 py-1 rounded-full text-label-sm font-label-sm border border-tertiary/20">
                    Role: System Admin / Faculty
                  </span>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Tools for oversight, institutional partners, and ecosystem health.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Admin Module Cards */}
              <Link 
                href="/dashboard/admin"
                className="glass-card p-6 rounded-2xl group hover:scale-[1.03] transition-all duration-300 border border-outline-variant/10 cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Admin Dashboard</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Comprehensive system overview and high-level student performance metrics.
                </p>
              </Link>

              <Link 
                href="/dashboard/faculty"
                className="glass-card p-6 rounded-2xl group hover:scale-[1.03] transition-all duration-300 border border-outline-variant/10 cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="material-symbols-outlined text-[32px]">supervisor_account</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Faculty Dashboard</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Course management tools and individual student intervention tracking.
                </p>
              </Link>

              <Link 
                href="/dashboard/mentor"
                className="glass-card p-6 rounded-2xl group hover:scale-[1.03] transition-all duration-300 border border-outline-variant/10 cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="material-symbols-outlined text-[32px]">psychology</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Mentor Dashboard</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Connect industry experts with students for real-world guidance.
                </p>
              </Link>

              <div 
                onClick={() => alert("System settings are accessible to administrators only.")}
                className="glass-card p-6 rounded-2xl group hover:scale-[1.03] transition-all duration-300 border border-outline-variant/10 cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="material-symbols-outlined text-[32px]">settings_suggest</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Configuration</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Fine-tune AI parameters, security policies, and system integrations.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full py-8 px-container-padding-mobile md:px-container-padding-desktop flex flex-col md:flex-row justify-between items-center mt-auto bg-surface-container-low border-t border-outline-variant/20">
          <span className="font-label-md text-label-md font-bold mb-4 md:mb-0">
            © 2024 AI Companion Systems. All rights reserved.
          </span>
          <div className="flex gap-6">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-opacity duration-150" href="#">Privacy Policy</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-opacity duration-150" href="#">Terms of Service</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-opacity duration-150" href="#">Security Architecture</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-opacity duration-150" href="#">System Status</a>
          </div>
        </footer>

        {/* AI Mentor Floating Action Button */}
        <button 
          onClick={() => alert("AI Mentor interface initialized. Ask your query in the Chat sidebar!")}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-tr from-secondary to-primary text-white shadow-lg shadow-secondary/30 hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50 group"
        >
          <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
          <span className="absolute -top-12 right-0 bg-secondary text-on-secondary px-3 py-1 rounded-lg text-label-sm font-label-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
            Ask AI Mentor
          </span>
        </button>
      </main>

      {/* Visual Ambient Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
