'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import SideNavBar from '../../../components/SideNavBar';
import TopNavBar from '../../../components/TopNavBar';

export default function MentorDashboard() {
  const router = useRouter();
  const {
    user,
    token,
    initializeAuth,
    fetchMentorData,
    mentees,
    mentorshipRequests,
    acceptMentee
  } = useStore();

  const [activeRequests, setActiveRequests] = useState([
    { id: 'req-1', name: 'Lana J.', major: 'Data Science', initials: 'LJ' },
    { id: 'req-2', name: 'Tom P.', major: 'Marketing', initials: 'TP' }
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
      fetchMentorData();
    }
  }, [token]);

  const { isLoading } = useStore();

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-spin material-symbols-outlined text-[48px] text-primary">progress_activity</span>
          <p className="font-semibold text-on-surface-variant">Loading Mentor Panel...</p>
        </div>
      </div>
    );
  }

  const handleAcceptRequest = async (id: string, name: string) => {
    if (id.startsWith('req-')) {
      setActiveRequests(activeRequests.filter(r => r.id !== id));
      alert(`Accepted ${name} as mentee!`);
    } else {
      await acceptMentee(id);
      alert(`Accepted ${name} successfully!`);
      fetchMentorData();
    }
  };

  // Hardcoded Stitch Mentees for visual equivalence if store is empty
  const stitchMentees = [
    {
      id: 'stitch-m1',
      name: 'Alex Rivera',
      major: 'Computer Science',
      year: 'Junior',
      status: 'On Track',
      badgeColor: 'text-tertiary-container bg-tertiary-fixed/20',
      progress: 85,
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLFuTqmxwPt234KZitB8fVzjNSwFYr3oktJlX50XddHhcV59NYGoTvqbaBB9v_tmSdXYn7xadF5ebVPmjnXTPFD3xdZH6p4TB24ORAooKdN9RCPJWQNR8JUqdFOPxXLbVMund8InEEhvSpNj26PGAu5fE4ugqzdBXA94A-8-2xoTO853J1io0pu9oYEDcs2CyJNTkJuDgKnWCAPogVmD9rcTCAqTEEAI2VIkS0XjPDxrtCQ4kXoPoPEYX0WDIJSlvkvQ3p3yEswMKi'
    },
    {
      id: 'stitch-m2',
      name: 'Sarah Chen',
      major: 'UX Design',
      year: 'Senior',
      status: 'Needs Sync',
      badgeColor: 'text-secondary bg-secondary-fixed/30',
      progress: 62,
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBHG28hjA0_mmiIkeEpKtDn3mfJE6bmOw80__HGGc9J9hvbt4tkLhqmeGPPu6qbKzbbmFTFSgHIgVIUA5Rjs_P0Ce3ZvbG95cN4Ol4tkosrlLhI9qBYhgiZSAynkTaacJ7sUuqgqtV4vgmRhANyjw3-FC_sfaRM7SUGGOE8hD2G4UzCm4slagwaJb-i_KaoL5kr_fKjfjQ2EhyvwPcwPRpGrUuxeoBhkH3I4h1EOaAiV_qMHoN4WCiyz8eWJyyf1aSS2eExphQurq9'
    },
    {
      id: 'stitch-m3',
      name: 'Marcus Thorne',
      major: 'Mechanical Eng',
      year: 'Sophomore',
      status: 'Ahead',
      badgeColor: 'text-tertiary-container bg-tertiary-fixed/20',
      progress: 92,
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRJi09sW36Hpr6pqlnPSKLOUGKt0yOXHXto7CJQGS5MiqLYUTMGHKlCGtI8N-YRpJ9FE5pk_-g1_NkZ_pQN7s-UAIwIy6V_RZ9Yefm3xKwVFubaGimlWmt5o8BPDvw7fVP2S2XqhWWavNKOBF3y-kU6I4SFgjNZAJn9z-ijM5eMf6zLR6gG6ppLsdZGdQibgNx3wke2RE8-8QDfgPkwkEVl26Lf-CRnr9Qg2z9ihu8SpM4vVqui_PKSuBv9UKAUrGr5FrS0ALMFA01'
    }
  ];

  // Combine dynamic mentees with Stitch mentees if none are available from store
  const displayMentees = mentees && mentees.length > 0 ? mentees.map(m => ({
    id: m.id,
    name: m.name,
    major: m.major,
    year: `Level ${m.level}`,
    status: m.goalCompletionRate > 80 ? 'Ahead' : 'On Track',
    badgeColor: 'text-tertiary-container bg-tertiary-fixed/20',
    progress: m.goalCompletionRate,
    avatarUrl: m.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(m.name)}`
  })) : stitchMentees;

  // Combine requests
  const displayRequests = [
    ...activeRequests,
    ...(mentorshipRequests || []).map(r => ({
      id: r.id,
      name: r.name,
      major: r.major,
      initials: r.name.split(' ').map((n: string) => n[0]).join('')
    }))
  ];

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans">
      <SideNavBar currentTab="Mentors" />

      <main className="flex-1 lg:ml-sidebar-width flex flex-col min-h-screen overflow-x-hidden pb-12">
        <TopNavBar placeholder="Search mentees or data..." />

        {/* Dashboard Content */}
        <div className="p-container-padding-mobile md:p-container-padding-desktop max-w-7xl mx-auto space-y-gutter w-full flex-grow">
          
          {/* Hero Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            
            <div className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/10">
              <p className="text-[12px] text-on-surface-variant font-medium">Active Mentees</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-[28px] font-black text-primary leading-none">{displayMentees.length}</h3>
                <span className="text-tertiary-container text-[11px] font-extrabold bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
                  +2 this mo
                </span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/10">
              <p className="text-[12px] text-on-surface-variant font-medium">Mentorship Requests</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-[28px] font-black text-secondary leading-none">{displayRequests.length}</h3>
                <span className="text-on-surface-variant text-[11px] bg-surface-container px-2 py-0.5 rounded-full font-bold">
                  {displayRequests.length} pending
                </span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/10">
              <p className="text-[12px] text-on-surface-variant font-medium">Hours Mentored</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-[28px] font-black text-on-surface leading-none">42.5</h3>
                <span className="text-on-surface-variant text-[12px] font-bold">YTD Total</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-primary-container text-on-primary-container relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[12px] opacity-80 font-medium">Mentor Score</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-[28px] font-black leading-none">98%</h3>
                  <span className="material-symbols-outlined text-tertiary-fixed font-bold">verified</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-20">
                <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  stars
                </span>
              </div>
            </div>

          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            
            {/* Left Column: Mentees & Requests */}
            <div className="lg:col-span-8 space-y-gutter">
              
              {/* Assigned Mentees */}
              <section className="glass-card rounded-3xl overflow-hidden border border-outline-variant/20 shadow-sm">
                <div className="p-6 bg-white/30 border-b border-outline-variant/10 flex justify-between items-center">
                  <h2 className="text-[18px] font-extrabold text-on-surface">Your Mentees</h2>
                  <button onClick={() => alert("Loading all mentees...")} className="text-primary font-bold text-[14px] hover:underline">View all</button>
                </div>
                <div className="divide-y divide-outline-variant/10">
                  {displayMentees.map((mentee) => (
                    <div key={mentee.id} className="p-6 flex items-center gap-4 hover:bg-surface-container-low/50 transition-colors group">
                      <img
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-surface group-hover:ring-primary/20 transition-all"
                        alt={mentee.name}
                        src={mentee.avatarUrl}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-[16px] text-on-surface group-hover:text-primary transition-colors">{mentee.name}</h4>
                            <p className="text-[12px] text-on-surface-variant font-medium mt-0.5">{mentee.major} • {mentee.year}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${mentee.badgeColor}`}>
                              {mentee.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 bg-surface-container-highest h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${mentee.progress}%` }}></div>
                          </div>
                          <span className="text-[12px] text-on-surface-variant font-semibold">{mentee.progress}% Goal Completion</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Grid requests & sessions */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                
                {/* New Requests */}
                <div className="glass-card p-6 rounded-3xl border border-outline-variant/10 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                      </div>
                      <h3 className="font-bold text-[16px] text-on-surface">New Requests</h3>
                    </div>

                    <div className="space-y-4">
                      {displayRequests.length > 0 ? (
                        displayRequests.map((request) => (
                          <div key={request.id} className="p-4 bg-surface-container-low rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center font-bold text-on-surface-variant text-[13px]">
                                {request.initials}
                              </div>
                              <div>
                                <p className="text-[14px] font-bold text-on-surface leading-tight">{request.name}</p>
                                <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">{request.major}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAcceptRequest(request.id, request.name)}
                              className="bg-primary hover:bg-primary-container text-white px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all"
                            >
                              Accept
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-[12px] text-on-surface-variant py-4">No pending connections.</p>
                      )}
                    </div>
                  </div>
                  
                  <button onClick={() => alert("Application settings modified.")} className="w-full mt-6 py-3 border-2 border-dashed border-outline-variant rounded-2xl text-on-surface-variant text-[13px] font-bold hover:bg-surface-variant/20 transition-all">
                    Manage Application Settings
                  </button>
                </div>

                {/* Next Sessions (Mini Calendar / Schedule) */}
                <div className="glass-card p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-[16px] text-on-surface">Next Sessions</h3>
                    <button onClick={() => alert("Loading full mentorship scheduler calendar...")} className="p-2 hover:bg-surface-variant rounded-full transition-colors">
                      <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    
                    <div className="flex gap-4 items-start">
                      <div className="flex flex-col items-center justify-center w-12 h-14 bg-primary-container/10 rounded-2xl border border-primary/20 shrink-0">
                        <span className="text-[10px] text-primary font-bold">OCT</span>
                        <span className="text-[18px] font-extrabold text-primary leading-none">24</span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-[13px] font-bold text-on-surface leading-tight">Career Path Sync</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">14:00 - 15:00 • with Alex R.</p>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => alert("Joining Mentorship Video Workspace...")} className="px-3 py-1 bg-primary text-white text-[11px] rounded-full font-bold hover:bg-primary-container">Join</button>
                          <button onClick={() => alert("Reschedule requested")} className="px-3 py-1 bg-surface-container text-on-surface-variant text-[11px] rounded-full font-bold hover:bg-surface-container-high">Reschedule</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start opacity-70">
                      <div className="flex flex-col items-center justify-center w-12 h-14 bg-surface-container rounded-2xl shrink-0">
                        <span className="text-[10px] text-on-surface-variant font-bold">OCT</span>
                        <span className="text-[18px] font-extrabold text-on-surface-variant leading-none">26</span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-[13px] font-bold text-on-surface leading-tight">Portfolio Review</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">10:30 - 11:30 • with Sarah C.</p>
                      </div>
                    </div>

                  </div>
                </div>

              </section>

            </div>

            {/* Right Column: AI Insights Panel */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-gutter">
                
                {/* AI Insights Card */}
                <section className="glass-card rounded-3xl border border-outline-variant/20 shadow-xl overflow-hidden ai-gradient-border">
                  <div className="p-6 bg-primary-fixed/20 backdrop-blur-xl">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                      <h3 className="font-label-md text-label-md uppercase tracking-wider text-[11px] font-bold">AI Insights</h3>
                    </div>
                    <h2 className="text-headline-md font-headline-md text-on-surface text-[18px] font-bold">Mentor Guidance</h2>
                    <p className="text-body-md text-on-surface-variant mt-2 text-[12px]">Based on mentee performance data from the last 7 days.</p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    
                    {/* Insight 1 */}
                    <div onClick={() => alert("Suggestion added to Alex's agenda.")} className="p-4 bg-surface-container-low rounded-2xl border-l-4 border-secondary hover:translate-x-1 transition-transform cursor-pointer">
                      <p className="text-label-sm font-bold text-secondary mb-1 text-[11px] uppercase">Topic Suggestion: Alex R.</p>
                      <p className="text-body-md text-on-surface text-[13px] leading-relaxed">
                        Alex has completed 4/5 technical modules early. Suggest discussing <strong>Advanced System Design</strong> in your next sync.
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-[11px] text-secondary font-bold">
                        <span className="material-symbols-outlined text-sm">link</span>
                        <span>Add to Alex's Agenda</span>
                      </div>
                    </div>

                    {/* Insight 2 */}
                    <div onClick={() => alert("Supportive check-in email sent to Sarah C.")} className="p-4 bg-surface-container-low rounded-2xl border-l-4 border-error/50 hover:translate-x-1 transition-transform cursor-pointer">
                      <p className="text-label-sm font-bold text-error mb-1 text-[11px] uppercase">Engagement Alert: Sarah C.</p>
                      <p className="text-body-md text-on-surface text-[13px] leading-relaxed">
                        Sarah's activity in the design lab has dipped by 30%. Consider a <strong>Wellness & Motivation</strong> check-in during your sync.
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-[11px] text-error font-bold">
                        <span className="material-symbols-outlined text-sm">notification_important</span>
                        <span>Send supportive message</span>
                      </div>
                    </div>

                    {/* Insight 3 */}
                    <div className="p-4 bg-surface-container-low rounded-2xl border-l-4 border-tertiary hover:translate-x-1 transition-transform cursor-pointer">
                      <p className="text-label-sm font-bold text-tertiary mb-1 text-[11px] uppercase font-bold">Networking Opportunity</p>
                      <p className="text-body-md text-on-surface text-[13px] leading-relaxed">
                        3 of your mentees expressed interest in <strong>AI Ethics</strong>. Why not host a group roundtable next week?
                      </p>
                      <button onClick={() => alert("Roundtable discussion scheduled for next Friday at 4 PM.")} className="mt-4 w-full py-2 bg-primary text-white rounded-xl font-bold text-[12px] hover:bg-primary-container">
                        Schedule Roundtable
                      </button>
                    </div>

                  </div>
                  
                  <div className="px-6 py-6 border-t border-outline-variant/10 bg-surface-container-low/50">
                    <div className="flex items-center justify-between text-label-sm text-on-surface-variant text-[11px] font-bold">
                      <span>Last analysis: 12 minutes ago</span>
                      <button onClick={() => alert("Analyzing performance data...")} className="material-symbols-outlined hover:rotate-180 transition-transform duration-500">refresh</button>
                    </div>
                  </div>
                </section>

                {/* Capacity Card */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-secondary text-white overflow-hidden relative group shadow-lg">
                  <div className="relative z-10">
                    <h3 className="text-headline-md font-headline-md mb-2 text-[20px] font-bold">Grow your Impact</h3>
                    <p className="text-body-md opacity-90 mb-6 text-[13px] leading-relaxed">
                      Open your schedule to 2 more mentees this month and unlock the "Impact Champion" badge.
                    </p>
                    <button onClick={() => alert("Capacity updated successfully!")} className="bg-white text-primary px-6 py-3 rounded-full font-bold shadow-lg group-hover:scale-105 transition-transform text-[12px]">
                      Update Capacity
                    </button>
                  </div>
                  <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[160px] opacity-10 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                    rocket_launch
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
