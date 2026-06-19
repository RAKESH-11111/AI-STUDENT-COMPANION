'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';
import FloatingAiAssistant from '../../../../components/FloatingAiAssistant';

export default function Opportunities() {
  const router = useRouter();
  const { user, token, initializeAuth, fetchOpportunities, opportunities } = useStore();

  const [activeCategory, setActiveCategory] = useState('All');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedOppTitle, setSelectedOppTitle] = useState('');

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
      fetchOpportunities();
    }
  }, [token]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span className="animate-spin material-symbols-outlined text-[48px] text-primary">progress_activity</span>
      </div>
    );
  }

  const handleApplyClick = (title: string) => {
    setSelectedOppTitle(title);
    setShowApplyModal(true);
  };

  const handleConfirmApply = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Applied successfully to "${selectedOppTitle}"! Your profile has been sent to recruiters.`);
    setShowApplyModal(false);
  };

  // Hardcoded Stitch opportunities to ensure layout matches Stitch exactly
  const stitchOpps = [
    {
      id: 'stitch-1',
      title: 'Global AI Ethics Summer Program',
      description: 'Participate in cutting-edge research on large language model safety and societal impact at a world-class R&D lab.',
      category: 'Internship',
      tags: ['Remote', 'Paid ($45/hr)'],
      deadlineInfo: '3 Days left',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeNzCaqJL9wZPuo20r9CnVXs974Ea90URo7Y0dLKICRAnFgKMoUHbQ3R8Oek-yxiL9BomcYGCHMa-G1pXEghoQ4r_QQvY3MNJJrYt1Pm__xfQ0ua9cNCoNekzFBmpLX-e3HmguO-xEcjmwUsZCOJuSB15n8OKTmGE5tFmpH3FII90UXtgyNGXvkKyG_nBVYD26E0rYKGAAnNYyNMM4P4NJ4zbgi9a0UlKWXEC2hIoNgjz85FaCv8RkFS-czKIjIMUKU6xlidqbCOn8',
      badgeColor: 'bg-secondary/10 text-secondary',
      isHot: true
    },
    {
      id: 'stitch-2',
      title: 'Future Innovators Grant',
      description: 'A $10,000 scholarship awarded to students demonstrating excellence in interdisciplinary studies and leadership.',
      category: 'Scholarship',
      tags: ['Undergraduate', 'STEM'],
      deadlineInfo: 'Due: Oct 15',
      logoIcon: 'workspace_premium',
      badgeColor: 'bg-tertiary-fixed text-tertiary',
      isHot: false
    },
    {
      id: 'stitch-3',
      title: 'HealthTech Global Jam',
      description: 'Join 5,000 developers worldwide to build digital health solutions using open-source AI frameworks and wearable data.',
      category: 'Hackathon',
      tags: ['Online', '$50k Prize Pool'],
      deadlineInfo: 'Next Week',
      logoIcon: 'code',
      badgeColor: 'bg-secondary-fixed text-on-secondary-fixed-variant',
      isHot: false
    },
    {
      id: 'stitch-4',
      title: 'Quantum Computing Assistantship',
      description: 'Assisting senior researchers in simulating molecular dynamics using superconducting quantum processors.',
      category: 'Research',
      tags: ['Hybrid', 'Publication Credit'],
      deadlineInfo: 'Deadline Tomorrow',
      logoIcon: 'biotech',
      badgeColor: 'bg-primary-fixed text-primary',
      isHot: true
    }
  ];

  // Map category filter buttons
  const categories = ['All', 'Internship', 'Hackathon', 'Scholarship', 'Research', 'Event', 'Course'];

  // Filter combined opportunities
  const filteredOppsFromDb = opportunities.filter(opp => {
    if (activeCategory === 'All') return true;
    return opp.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const filteredStitchOpps = stitchOpps.filter(opp => {
    if (activeCategory === 'All') return true;
    return opp.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans">
      <SideNavBar currentTab="Opportunities" />

      <main className="flex-1 lg:ml-sidebar-width min-h-screen pb-24 flex flex-col overflow-x-hidden">
        <TopNavBar placeholder="Search opportunities, categories..." />

        {/* Content Canvas */}
        <div className="p-container-desktop max-w-7xl mx-auto w-full space-y-gutter flex-grow">
          
          {/* Header Section */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-headline-xl font-headline-xl text-primary mb-2">Opportunity Explorer</h2>
              <p className="text-body-lg text-on-surface-variant max-w-2xl mt-2">
                Curated global opportunities matched specifically to your academic profile and career aspirations.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col items-center justify-center bg-white/60 backdrop-blur px-6 py-3 rounded-2xl border border-white shadow-sm">
                <span className="text-headline-md font-bold text-secondary text-[24px]">24</span>
                <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">New Matches</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-white/60 backdrop-blur px-6 py-3 rounded-2xl border border-white shadow-sm">
                <span className="text-headline-md font-bold text-primary text-[24px]">8</span>
                <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Deadlines Soon</span>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <section className="relative z-10 glass-card p-4 rounded-3xl shadow-sm flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl text-primary border border-outline-variant/30">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
              <span className="font-label-md">Filter by Interest</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-label-sm font-bold transition-all ${
                    (cat === 'All' && activeCategory === 'All') || activeCategory === cat
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat === 'All' ? 'All Types' : cat + 's'}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2 text-on-surface-variant">
              <span className="text-label-md">Sort by:</span>
              <select className="bg-transparent border-none font-bold text-primary focus:ring-0 cursor-pointer outline-none">
                <option>Upcoming Deadline</option>
                <option>Recommended</option>
                <option>Recently Added</option>
              </select>
            </div>
          </section>

          {/* Opportunity Bento Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            
            {/* 1. Curated Stitch Opportunities */}
            {filteredStitchOpps.map((opp) => (
              <div 
                key={opp.id} 
                className={`glass-card rounded-3xl p-6 flex flex-col group hover:shadow-xl transition-all duration-300 ${
                  opp.isHot ? 'ai-gradient-border' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant/20">
                    {opp.logoUrl ? (
                      <img className="w-10 h-10 object-contain" src={opp.logoUrl} alt="Logo" />
                    ) : (
                      <span className={`material-symbols-outlined text-[32px] ${
                        opp.logoIcon === 'workspace_premium' ? 'text-tertiary-container' : 'text-secondary'
                      }`}>{opp.logoIcon}</span>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-label-sm font-bold uppercase tracking-tight ${opp.badgeColor}`}>
                      {opp.category}
                    </span>
                    <span className={`text-label-sm mt-2 flex items-center gap-1 font-bold ${opp.isHot ? 'text-error animate-pulse' : 'text-on-surface-variant'}`}>
                      {opp.isHot && <span className="material-symbols-outlined text-[16px]">alarm</span>}
                      {opp.deadlineInfo}
                    </span>
                  </div>
                </div>

                <h3 className="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors text-[20px] font-bold">
                  {opp.title}
                </h3>
                <p className="text-body-md text-on-surface-variant mt-3 flex-1 text-[14px]">
                  {opp.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {opp.tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-lg text-label-sm">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <button 
                    onClick={() => handleApplyClick(opp.title)}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-md hover:bg-primary-container transition-colors"
                  >
                    Quick Apply
                  </button>
                  <button className="w-12 h-12 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-secondary hover:border-secondary transition-all">
                    <span className="material-symbols-outlined">bookmark</span>
                  </button>
                </div>
              </div>
            ))}

            {/* 2. Database Opportunities */}
            {filteredOppsFromDb.map((opp) => (
              <div key={opp.id} className="glass-card rounded-3xl p-6 flex flex-col group hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-[32px]">school</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-label-sm font-bold uppercase tracking-tight">
                      {opp.category}
                    </span>
                    <span className="text-on-surface-variant text-label-sm mt-2 font-medium">
                      {opp.applicantsCount} applicants
                    </span>
                  </div>
                </div>

                <h3 className="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors text-[20px] font-bold">
                  {opp.title}
                </h3>
                <p className="text-body-md text-on-surface-variant mt-3 flex-1 text-[14px]">
                  {opp.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-lg text-label-sm">Active Match</span>
                  <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-lg text-label-sm">University Portal</span>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <button 
                    onClick={() => handleApplyClick(opp.title)}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-md hover:bg-primary-container transition-colors"
                  >
                    Quick Apply
                  </button>
                  <button className="w-12 h-12 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all">
                    <span className="material-symbols-outlined">bookmark</span>
                  </button>
                </div>
              </div>
            ))}

            {/* 3. Deadline Alert Special Widget Card */}
            <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-primary-container to-secondary-container text-white flex flex-col relative overflow-hidden shadow-xl lg:col-span-1 md:col-span-2">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <h3 className="text-headline-md font-headline-md relative z-10 text-[20px] font-bold">Application Deadlines</h3>
              <p className="text-body-md text-on-primary-container relative z-10 mt-2 text-[14px]">
                Manage your active applications and never miss a critical submission window.
              </p>
              
              <div className="mt-6 space-y-4 relative z-10">
                <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="w-10 h-10 bg-error/85 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">warning</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-label-md">Google STEP</p>
                    <p className="text-label-sm opacity-80">Final materials due in 12h</p>
                  </div>
                  <button onClick={() => router.push('/dashboard/student/resume')} className="text-label-sm font-bold bg-white text-primary px-3 py-1 rounded-lg">
                    Resume
                  </button>
                </div>
                
                <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="w-10 h-10 bg-tertiary-container rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">check_circle</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-label-md">Major League Hacking</p>
                    <p className="text-label-sm opacity-80">Application submitted</p>
                  </div>
                  <span className="material-symbols-outlined text-white opacity-60">more_vert</span>
                </div>
              </div>

              <button 
                onClick={() => alert("Loading full applications tracker...")}
                className="mt-auto pt-6 text-white font-bold flex items-center justify-center gap-2 hover:underline transition-all"
              >
                View All Application Tracking
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            {/* 4. New Opportunity Placeholder Card */}
            <div 
              onClick={() => alert("Opportunity post modal initialized.")}
              className="border-2 border-dashed border-outline-variant rounded-3xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all min-h-[300px]"
            >
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all mb-4">
                <span className="material-symbols-outlined text-[32px]">add</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface-variant font-bold text-[18px]">Post Opportunity</h3>
              <p className="text-body-md text-on-surface-variant mt-2 text-[14px]">
                Have a role or scholarship to share with the community?
              </p>
            </div>

          </div>

          {/* Footer */}
          <footer className="mt-12 bg-surface-container flex flex-col md:flex-row justify-between items-center p-6 border-t border-outline-variant/10 rounded-2xl">
            <div className="mb-4 md:mb-0">
              <p className="text-label-md font-bold text-on-surface">AI Companion</p>
              <p className="text-body-md text-on-surface-variant text-[12px]">© 2024 AI Companion. Empowering Academic Excellence.</p>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-8 justify-center">
              <a className="text-label-sm text-on-surface-variant hover:underline transition-all hover:text-primary text-[12px]" href="#">Institutional Partners</a>
              <a className="text-label-sm text-on-surface-variant hover:underline transition-all hover:text-primary text-[12px]" href="#">Terms of Service</a>
              <a className="text-label-sm text-on-surface-variant hover:underline transition-all hover:text-primary text-[12px]" href="#">Privacy Policy</a>
              <a className="text-label-sm text-on-surface-variant hover:underline transition-all hover:text-primary text-[12px]" href="#">Contact Us</a>
            </div>
          </footer>

        </div>
      </main>

      {/* Quick Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-outline-variant/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-[18px] text-on-surface mb-2">Apply for Opportunity</h3>
            <p className="text-[12px] text-on-surface-variant mb-4">
              Apply to <strong>{selectedOppTitle}</strong>. We will automatically attach your AI Readiness Score card and current resume.
            </p>
            <form onSubmit={handleConfirmApply} className="space-y-4">
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowApplyModal(false)} className="px-4 py-2 border border-outline-variant/30 rounded-xl text-[12px] font-bold text-on-surface-variant hover:bg-surface-container">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-primary text-white rounded-xl text-[12px] font-bold shadow-md hover:opacity-90">
                  Confirm & Apply
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
