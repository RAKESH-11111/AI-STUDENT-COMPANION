'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';
import FloatingAiAssistant from '../../../../components/FloatingAiAssistant';
import Link from 'next/link';

export default function CareerPath() {
  const router = useRouter();
  const { user, token, initializeAuth, fetchStudentData } = useStore();

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

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans">
      <SideNavBar currentTab="Career Path" />

      <main className="flex-1 lg:ml-sidebar-width min-h-screen pb-24 flex flex-col overflow-x-hidden">
        <TopNavBar placeholder="Search roadmaps, careers, skills..." />

        {/* Page Content Container */}
        <div className="p-container-padding-mobile md:p-container-padding-desktop max-w-7xl mx-auto w-full space-y-gutter flex-grow">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            
            {/* Top Section: Assessments & Current Fit */}
            <section className="lg:col-span-8 flex flex-col md:flex-row gap-gutter">
              
              {/* Assessment CTA Card */}
              <div className="flex-1 glass-card p-6 rounded-2xl relative overflow-hidden group border-none shadow-md">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-[80px]">psychology</span>
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-primary mb-2">Refine Your Future</h2>
                    <p className="text-on-surface-variant mb-6 text-body-md max-w-[280px]">
                      Take our 10-minute AI Assessment to unlock deeper career insights and personalized path updates.
                    </p>
                  </div>
                  <button 
                    onClick={() => router.push('/dashboard/student/decision')}
                    className="px-6 py-3 bg-secondary text-on-secondary rounded-xl font-label-md flex items-center gap-2 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all self-start"
                  >
                    Career Interest Assessment
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Current Fit Card */}
              <div className="flex-1 glass-card p-6 rounded-2xl border-none shadow-md flex flex-col items-center justify-center text-center ai-gradient-border">
                
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="12"></circle>
                    <circle className="text-secondary" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset="54.6" strokeWidth="12"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold text-[28px]">85%</span>
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface text-[20px] font-bold">Software Engineer</h3>
                <p className="text-on-surface-variant text-body-md">Current Career Fit</p>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-md font-label-sm">High Growth</span>
                  <span className="px-2 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-md font-label-sm">Skill Match</span>
                </div>
              </div>

            </section>

            {/* Sidebar Content: Trends & Salary */}
            <aside className="lg:col-span-4 flex flex-col gap-gutter">
              
              {/* Industry Trends */}
              <div className="glass-card p-6 rounded-2xl shadow-sm">
                <h3 className="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2 text-[18px]">
                  <span className="material-symbols-outlined">trending_up</span>
                  Industry Trends
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-surface-container rounded-xl">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-label-md text-label-md text-on-surface">AI Specialization</span>
                      <span className="text-tertiary font-bold">+24%</span>
                    </div>
                    <p className="text-label-sm text-on-surface-variant">Rising demand for engineers with LLM integration experience.</p>
                  </div>
                  <div className="p-4 bg-surface-container rounded-xl">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-label-md text-label-md text-on-surface">Remote Infrastructure</span>
                      <span className="text-tertiary font-bold">+12%</span>
                    </div>
                    <p className="text-label-sm text-on-surface-variant">Growth in distributed systems and cloud security roles.</p>
                  </div>
                </div>
              </div>

              {/* Salary Insights */}
              <div className="glass-card p-6 rounded-2xl shadow-sm">
                <h3 className="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2 text-[18px]">
                  <span className="material-symbols-outlined">payments</span>
                  Salary Insights
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-label-md">Entry Level</span>
                    <span className="text-on-surface font-bold">$85k - $110k</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-1/3"></div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-on-surface-variant font-label-md">Mid Career</span>
                    <span className="text-on-surface font-bold">$140k - $190k</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3"></div>
                  </div>
                </div>
                <p className="mt-4 text-label-sm text-on-surface-variant italic">Based on 2026 regional average for Software Engineering.</p>
              </div>

            </aside>

            {/* Main Roadmap Content */}
            <section className="lg:col-span-12 mt-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-headline-xl text-headline-xl text-primary mb-2">4-Year Growth Roadmap</h2>
                  <p className="text-body-lg text-on-surface-variant">Your personalized path from student to industry leader.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => router.push('/dashboard/student/resume')}
                    className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container-high rounded-xl font-label-md flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">edit_note</span>
                    Resume Builder
                  </button>
                  <button onClick={() => alert("Roadmap shared successfully!")} className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all">
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </div>
              </div>

              {/* Horizontal Timeline for Desktop / Stacked for Mobile */}
              <div className="relative grid grid-cols-1 md:grid-cols-4 gap-gutter overflow-visible pb-12">
                
                {/* Connector Line (Desktop Only) */}
                <div className="hidden md:block absolute top-12 left-gutter right-gutter h-1 bg-surface-container-highest z-0">
                  <div className="absolute top-0 left-0 h-full bg-primary w-[37.5%]"></div>
                </div>

                {/* Year 1: Foundations */}
                <div className="relative z-10">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="w-24 h-24 mb-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center border-4 border-surface shadow-xl">
                      <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl w-full border-l-4 border-l-tertiary">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-label-sm text-label-sm text-tertiary font-bold uppercase tracking-wider">Completed</span>
                        <span className="font-headline-md text-headline-md text-on-surface-variant opacity-20">Y1</span>
                      </div>
                      <h4 className="font-headline-md text-headline-md text-on-surface mb-2 text-[18px]">Foundations</h4>
                      <ul className="space-y-2 text-body-md text-on-surface-variant text-[13px]">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-tertiary text-sm">check</span> Computer Science 101</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-tertiary text-sm">check</span> Effective Communication</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-tertiary text-sm">check</span> Data Structures Basics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Year 2: Specialization */}
                <div className="relative z-10 animate-pulse-soft">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="w-24 h-24 mb-6 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center border-4 border-surface shadow-xl">
                      <span className="material-symbols-outlined text-[40px]">architecture</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl w-full border-l-4 border-l-secondary ai-gradient-border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">In-Progress</span>
                        <span className="font-headline-md text-headline-md text-on-surface-variant opacity-20">Y2</span>
                      </div>
                      <h4 className="font-headline-md text-headline-md text-on-surface mb-2 text-[18px]">Specialization</h4>
                      <ul className="space-y-2 text-body-md text-on-surface-variant text-[13px]">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">rotate_right</span> Full-Stack Web App</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-outline text-sm">radio_button_unchecked</span> Cloud Computing elective</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-outline text-sm">radio_button_unchecked</span> Open Source Contribs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Year 3: Experience */}
                <div className="relative z-10 opacity-75">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="w-24 h-24 mb-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center border-4 border-surface shadow-md">
                      <span className="material-symbols-outlined text-[40px]">lock</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl w-full border-l-4 border-l-outline-variant">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Locked</span>
                        <span className="font-headline-md text-headline-md text-on-surface-variant opacity-20">Y3</span>
                      </div>
                      <h4 className="font-headline-md text-headline-md text-on-surface mb-2 text-[18px]">Experience</h4>
                      <p className="text-body-md text-on-surface-variant mb-4 text-[13px]">Complete 3 more Y2 modules to unlock this stage.</p>
                      <ul className="space-y-2 text-body-md text-on-surface-variant opacity-50 text-[13px]">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">lock</span> Industry Internships</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">lock</span> Advanced Algorithms</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Year 4: Launch */}
                <div className="relative z-10 opacity-50">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="w-24 h-24 mb-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center border-4 border-surface shadow-md">
                      <span className="material-symbols-outlined text-[40px]">rocket_launch</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl w-full border-l-4 border-l-outline-variant">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Locked</span>
                        <span className="font-headline-md text-headline-md text-on-surface-variant opacity-20">Y4</span>
                      </div>
                      <h4 className="font-headline-md text-headline-md text-on-surface mb-2 text-[18px]">Launch</h4>
                      <ul className="space-y-2 text-body-md text-on-surface-variant opacity-50 text-[13px]">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">lock</span> Final Placement Prep</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">lock</span> Technical Interviews</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">lock</span> Graduation</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </section>

          </div>

        </div>
      </main>
      <FloatingAiAssistant />
    </div>
  );
}
