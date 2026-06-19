'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import SideNavBar from '../../../components/SideNavBar';
import TopNavBar from '../../../components/TopNavBar';

export default function FacultyDashboard() {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    initializeAuth,
    fetchFacultyData,
    batchInsights,
    monitoredStudents,
    triggerIntervention
  } = useStore();

  const [interventionStudentId, setInterventionStudentId] = useState<string | null>(null);
  const [interventionMsg, setInterventionMsg] = useState('');
  const [showInterventionModal, setShowInterventionModal] = useState(false);

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
      fetchFacultyData();
    }
  }, [token]);

  const { isLoading } = useStore();

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-spin material-symbols-outlined text-[48px] text-primary">progress_activity</span>
          <p className="font-semibold text-on-surface-variant">Loading Faculty Panel...</p>
        </div>
      </div>
    );
  }

  const handleInterventionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interventionStudentId || !interventionMsg.trim()) return;
    await triggerIntervention(interventionStudentId, interventionMsg);
    setInterventionMsg('');
    setShowInterventionModal(false);
    alert('Intervention scheduled successfully!');
  };

  const openInterventionModal = (studentId: string) => {
    setInterventionStudentId(studentId);
    setShowInterventionModal(true);
  };

  return (
    <div className="bg-surface text-on-surface flex min-h-screen font-sans">
      <SideNavBar currentTab="Dashboard" />

      <main className="flex-1 lg:ml-sidebar-width min-w-0 flex flex-col">
        <TopNavBar placeholder="Search faculty records..." />

        {/* Dashboard Content */}
        <div className="p-container-padding-mobile md:p-container-padding-desktop max-w-[1600px] mx-auto space-y-gutter w-full">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-[28px] md:text-[32px] text-primary tracking-tight">AI COMPANION</h2>
              <p className="text-on-surface-variant font-medium text-[14px] mt-1">
                Student monitoring, Performance analytics, Career readiness tracking, and Mentoring support tools.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center bg-surface-container-high px-4 py-2.5 rounded-xl gap-2 cursor-pointer hover:bg-surface-container-highest transition-all text-[14px] font-semibold border border-outline-variant/10">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                <span>Fall 2024 - Batch A</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </div>
              <button
                onClick={() => alert("Report exported to PDF successfully.")}
                className="bg-primary text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold text-[14px] hover:shadow-lg transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">file_download</span>
                Export Report
              </button>
            </div>
          </div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-12 gap-6 items-start">
            
            {/* Insights & Monitoring Lists (Left column) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              
              {/* Batch insights analytics */}
              <div className="glass-card rounded-2xl p-6 shadow-sm border border-outline-variant/10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-extrabold text-[20px] text-on-surface">Batch Insights</h3>
                    <p className="text-[12px] text-on-surface-variant font-medium">Average skill growth across 124 students</p>
                  </div>
                  <div className="flex gap-4 text-[12px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-on-surface-variant">Current Week</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
                      <span className="text-on-surface-variant">Last Week</span>
                    </div>
                  </div>
                </div>

                {/* Growth Chart Visual mock */}
                <div className="h-60 flex items-end gap-6 px-2 pt-6">
                  {batchInsights ? (
                    Object.entries(batchInsights.skills).map(([skill, val]: any, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full flex items-end gap-2.5 h-40">
                          <div className="flex-1 bg-outline-variant/40 rounded-t-lg transition-all duration-500" style={{ height: `${val.last}%` }}></div>
                          <div className="flex-1 bg-primary rounded-t-lg transition-all duration-500 shadow-sm" style={{ height: `${val.current}%` }}></div>
                        </div>
                        <span className="text-[12px] text-on-surface-variant font-semibold capitalize mt-1">{skill.replace(/([A-Z])/g, ' $1')}</span>
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40">Loading charts...</div>
                  )}
                </div>
              </div>

              {/* Student monitoring table */}
              <div className="glass-card rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
                <div className="p-6 bg-white/30 border-b border-outline-variant/10 flex justify-between items-center">
                  <h3 className="font-bold text-[18px] text-on-surface">Student Monitoring</h3>
                  <button className="text-primary font-bold text-[14px] hover:underline">View All Students</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead className="bg-surface-container-low text-on-surface-variant text-[12px] font-bold border-b border-outline-variant/15">
                      <tr>
                        <th className="px-6 py-4">Student</th>
                        <th className="px-6 py-4">Subject Mastery</th>
                        <th className="px-6 py-4">Readiness Score</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-[14px]">
                      {monitoredStudents && monitoredStudents.length > 0 ? (
                        monitoredStudents.map((student) => {
                          const isCritical = student.skillMasteryScore < 60;
                          return (
                            <tr key={student.id} className="hover:bg-white/40 transition-all">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold text-[14px]">
                                    {student.name.split(' ').map((n: string) => n[0]).join('')}
                                  </div>
                                  <div>
                                    <p className="font-bold text-on-surface leading-tight">{student.name}</p>
                                    <p className="text-[12px] text-on-surface-variant font-medium mt-0.5">{student.major}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-24 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                    <div className={`h-full ${isCritical ? 'bg-error' : 'bg-primary'}`} style={{ width: `${student.skillMasteryScore}%` }}></div>
                                  </div>
                                  <span className="text-[12px] font-bold text-on-surface-variant">{Math.round(student.skillMasteryScore)}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                                  isCritical ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                                }`}>
                                  {isCritical ? `Critical (${Math.round(student.careerReadinessScore)})` : `High (${Math.round(student.careerReadinessScore)})`}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-on-surface-variant text-[12px] font-medium">
                                Active Now
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => openInterventionModal(student.id)}
                                  className="text-primary hover:text-secondary font-bold text-[13px] hover:underline"
                                >
                                  Intervene
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-[14px] text-on-surface-variant">No monitored students.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Sidebar quick stats (Right column) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-2xl border border-outline-variant/10 shadow-sm">
                  <p className="text-label-sm text-on-surface-variant mb-1 text-[12px]">Active Students</p>
                  <h4 className="text-headline-md font-bold text-primary text-[24px]">124</h4>
                  <div className="flex items-center text-emerald-600 gap-1 mt-1 font-bold">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <span className="text-[11px] font-bold">+12%</span>
                  </div>
                </div>
                <div className="glass-card p-4 rounded-2xl border border-outline-variant/10 shadow-sm">
                  <p className="text-label-sm text-on-surface-variant mb-1 text-[12px]">Mentor Hours</p>
                  <h4 className="text-headline-md font-bold text-secondary text-[24px]">42.5</h4>
                  <div className="flex items-center text-on-surface-variant/60 gap-1 mt-1 font-bold">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span className="text-[11px] font-bold">This Month</span>
                  </div>
                </div>
              </div>

              {/* Intervention Suggestions (AI Flagged) */}
              <div className="glass-card rounded-2xl p-6 shadow-sm ai-gradient-border overflow-hidden relative border border-outline-variant/10">
                {/* Atmospheric AI background effect */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-2 mb-6 relative z-10">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface text-[18px] font-bold">Intervention AI</h3>
                </div>
                <div className="space-y-4 relative z-10">
                  
                  {/* Suggestion 1 */}
                  <div className="p-4 rounded-xl bg-white/40 border border-outline-variant/10 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-error/25 flex items-center justify-center text-error">
                          <span className="material-symbols-outlined text-[18px]">warning</span>
                        </div>
                        <span className="font-label-md text-label-md text-[14px] font-bold">Maya Patel</span>
                      </div>
                      <span className="text-label-sm text-error font-extrabold text-[11px] uppercase tracking-wider">Urgent</span>
                    </div>
                    <p className="text-label-sm text-on-surface-variant leading-relaxed text-[12px] font-medium">
                      System detected a 40% drop in coding challenge submissions. Suggesting a 1:1 sync on 'Asynchronous JS'.
                    </p>
                    <button 
                      onClick={() => {
                        const mId = monitoredStudents.find(s => s.name.includes("Maya"))?.id || "maya-patel";
                        openInterventionModal(mId);
                      }}
                      className="mt-4 w-full py-2 bg-secondary text-white rounded-lg font-bold text-label-md text-[12px] active:scale-[0.98] transition-all hover:bg-secondary-container"
                    >
                      Schedule Sync
                    </button>
                  </div>

                  {/* Suggestion 2 */}
                  <div className="p-4 rounded-xl bg-white/40 border border-outline-variant/10 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">psychology</span>
                        </div>
                        <span className="font-label-md text-label-md text-[14px] font-bold">Lucas Thorne</span>
                      </div>
                      <span className="text-label-sm text-primary font-extrabold text-[11px] uppercase tracking-wider">Growth</span>
                    </div>
                    <p className="text-label-sm text-on-surface-variant leading-relaxed text-[12px] font-medium">
                      Lucas has mastered the core curriculum 2 weeks early. Suggest unlocking 'Advanced Systems Arch' path.
                    </p>
                    <button 
                      onClick={() => alert("Lucas Thorne's learning path has been expanded with Advanced Systems Architecture modules.")}
                      className="mt-4 w-full py-2 border-2 border-primary text-primary rounded-lg font-bold text-label-md text-[12px] active:scale-[0.98] transition-all hover:bg-primary/5"
                    >
                      Review Path
                    </button>
                  </div>

                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-center relative z-10">
                  <button 
                    onClick={() => alert("Re-analyzing student records...")}
                    className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 hover:text-primary transition-colors text-[12px] font-bold"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    Refresh AI Analysis
                  </button>
                </div>
              </div>

              {/* Faculty Calendar Preview */}
              <div className="glass-card rounded-2xl p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-label-md text-label-md text-on-surface font-bold mb-4 text-[14px]">Upcoming Mentorship</h3>
                <div className="space-y-4">
                  
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex flex-col items-center justify-center border border-outline-variant/15">
                      <span className="text-label-sm font-black text-primary text-[14px]">24</span>
                      <span className="text-[9px] uppercase font-black text-on-surface-variant">Oct</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-label-md text-label-md text-[13px] font-bold leading-tight">Career Strategy - Batch B</p>
                      <p className="text-label-sm text-on-surface-variant text-[11px] font-medium mt-0.5">10:30 AM - 11:30 AM</p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">chevron_right</span>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex flex-col items-center justify-center border border-outline-variant/15">
                      <span className="text-label-sm font-black text-primary text-[14px]">25</span>
                      <span className="text-[9px] uppercase font-black text-on-surface-variant">Oct</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-label-md text-label-md text-[13px] font-bold leading-tight">1:1 Session: Sam Chen</p>
                      <p className="text-label-sm text-on-surface-variant text-[11px] font-medium mt-0.5">02:00 PM - 02:45 PM</p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">chevron_right</span>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Intervention Scheduler Modal */}
      {showInterventionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="font-bold text-[20px] mb-2 text-on-surface">Schedule Intervention</h3>
            <p className="text-on-surface-variant text-[12px] mb-4 font-medium">Send supportive feedback or alerts directly to the student dashboard.</p>
            <form onSubmit={handleInterventionSubmit} className="space-y-4">
              <textarea
                rows={4}
                className="w-full p-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                placeholder="Type messages e.g. Hi Maya, I noticed you have been struggling on UX Quiz. Let's schedule a mentorship sync."
                value={interventionMsg}
                onChange={(e) => setInterventionMsg(e.target.value)}
                required
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInterventionModal(false)}
                  className="px-4 py-2 border border-outline-variant/30 rounded-xl text-[13px] font-bold text-on-surface hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-xl text-[13px] font-bold hover:opacity-90"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
