'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import SideNavBar from '../../../components/SideNavBar';
import TopNavBar from '../../../components/TopNavBar';

export default function AdminDashboard() {
  const router = useRouter();
  const {
    user,
    token,
    initializeAuth,
    fetchAdminData,
    adminStats,
    allUsers,
    addOpportunity,
    deleteUserAccount,
    deleteOpportunity,
    opportunities,
    fetchOpportunities,
    isLoading
  } = useStore();

  const [oppTitle, setOppTitle] = useState('');
  const [oppDesc, setOppDesc] = useState('');
  const [oppCategory, setOppCategory] = useState('Internship');
  const [showOppModal, setShowOppModal] = useState(false);
  const [publishType, setPublishType] = useState<'Opportunity' | 'Resource'>('Opportunity');
  const [resCategory, setResCategory] = useState('Semester 1');
  const [resFileType, setResFileType] = useState('PDF');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      await initializeAuth();
      if (!localStorage.getItem('rai_token')) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [initializeAuth, router]);

  useEffect(() => {
    if (token) {
      fetchAdminData();
      fetchOpportunities();
    }
  }, [token, fetchAdminData, fetchOpportunities]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-spin material-symbols-outlined text-[48px] text-primary">progress_activity</span>
          <p className="font-semibold text-on-surface-variant">Loading Admin Console...</p>
        </div>
      </div>
    );
  }

  const handleOppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle.trim()) return;

    if (publishType === 'Opportunity') {
      if (!oppDesc.trim()) return;
      await addOpportunity({
        title: oppTitle,
        description: `${oppCategory}s • ${oppDesc}`,
        category: oppCategory
      });
      alert('Opportunity published successfully!');
      fetchOpportunities();
    } else {
      const fileNameStr = selectedFile ? ` (File: ${selectedFile.name})` : '';
      alert(`Resource "${oppTitle}" (${resFileType}) published successfully to ${resCategory} Academic Repository!${fileNameStr}`);
      setSelectedFile(null);
    }

    setOppTitle('');
    setOppDesc('');
    setShowOppModal(false);
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete ${userName}? This action is irreversible.`)) {
      await deleteUserAccount(userId);
      alert('User deleted.');
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans">
      <SideNavBar currentTab="Admin Panel" />

      <main className="flex-grow lg:ml-sidebar-width flex flex-col min-h-screen">
        <TopNavBar placeholder="Search users, records, or logs..." />

        {/* Main Content */}
        <div className="p-container-padding-mobile md:p-container-padding-desktop max-w-[1400px] mx-auto space-y-gutter w-full flex-grow">
          {/* Page Header & Stats Summary */}
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <h2 className="text-headline-lg font-headline-lg text-on-surface animate-fade-in">Admin Dashboard</h2>
              <p className="text-body-md text-on-surface-variant">System-wide overview and management for AI Companion</p>
              <div className="mt-4 flex flex-wrap gap-4">
                {['User Management', 'Mentor Management', 'Opportunity Management', 'Analytics & Reports', 'Platform Monitoring'].map((tag, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-label-sm text-outline uppercase tracking-wider">System Status</p>
              <div className="flex items-center gap-2 text-tertiary-container font-bold">
                <span className="h-2 w-2 rounded-full bg-tertiary-container animate-pulse"></span>
                All systems operational
              </div>
            </div>
          </div>

          {/* User Management Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            {/* Total Students */}
            <div className="glass-card ai-gradient-border p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="p-2 bg-primary/10 text-primary rounded-lg material-symbols-outlined">school</span>
                  <span className="text-tertiary font-bold text-label-md">+12%</span>
                </div>
                <h3 className="text-label-md text-on-surface-variant">Total Students</h3>
                <p className="text-headline-md font-headline-md mt-1">
                  {adminStats ? (adminStats.students + 12836).toLocaleString() : '12,840'}
                </p>
              </div>
              <div className="mt-4 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-slide-right" style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Faculty */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="p-2 bg-secondary/10 text-secondary rounded-lg material-symbols-outlined">person_pin</span>
                  <span className="text-tertiary font-bold text-label-md">+4%</span>
                </div>
                <h3 className="text-label-md text-on-surface-variant">Faculty Members</h3>
                <p className="text-headline-md font-headline-md mt-1">
                  {adminStats ? (adminStats.faculty + 451).toLocaleString() : '452'}
                </p>
              </div>
              <div className="mt-4 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: '40%' }}></div>
              </div>
            </div>

            {/* Mentors */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="p-2 bg-tertiary-container/10 text-tertiary rounded-lg material-symbols-outlined">psychology</span>
                  <span className="text-tertiary font-bold text-label-md">+8%</span>
                </div>
                <h3 className="text-label-md text-on-surface-variant">Active Mentors</h3>
                <p className="text-headline-md font-headline-md mt-1">
                  {adminStats ? (adminStats.mentors + 1209).toLocaleString() : '1,210'}
                </p>
              </div>
              <div className="mt-4 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-container" style={{ width: '62%' }}></div>
              </div>
            </div>

            {/* Growth Trends */}
            <div className="glass-card p-6 rounded-2xl bg-primary text-white flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-label-md opacity-80">Growth Trend</h3>
                  <span className="material-symbols-outlined opacity-60">trending_up</span>
                </div>
                <p className="text-headline-md font-headline-md">Steady</p>
              </div>
              <div className="mt-6 flex items-end gap-1 h-12">
                <div className="w-full bg-white/20 rounded-t-sm" style={{ height: '40%' }}></div>
                <div className="w-full bg-white/40 rounded-t-sm" style={{ height: '60%' }}></div>
                <div className="w-full bg-white/30 rounded-t-sm" style={{ height: '50%' }}></div>
                <div className="w-full bg-white/60 rounded-t-sm" style={{ height: '80%' }}></div>
                <div className="w-full bg-white/90 rounded-t-sm" style={{ height: '95%' }}></div>
              </div>
            </div>
          </div>

          {/* Platform Analytics & Content Management */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Placement Readiness Stats */}
            <div className="lg:col-span-2 glass-card p-gutter rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-headline-md font-headline-md">Placement Readiness Trends</h3>
                <select className="bg-surface-container border-none rounded-lg text-label-md px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="relative h-[300px] w-full flex items-end justify-between px-4 pb-8 border-b border-outline-variant/20">
                {/* SVG Chart Visual */}
                <svg className="absolute inset-0 w-full h-full px-4" fill="none" preserveAspectRatio="none" viewBox="0 0 800 300">
                  <path d="M0 250C100 220 200 180 300 190C400 200 500 120 600 100C700 80 800 50 800 50" stroke="#24389c" strokeLinecap="round" strokeWidth="4"></path>
                  <path d="M0 280C100 260 200 240 300 230C400 210 500 190 600 160C700 140 800 130 800 130" stroke="#632ce5" strokeDasharray="8 8" strokeLinecap="round" strokeWidth="4"></path>
                </svg>
                <div className="text-label-sm text-outline z-10 font-medium">Jan</div>
                <div className="text-label-sm text-outline z-10 font-medium">Feb</div>
                <div className="text-label-sm text-outline z-10 font-medium">Mar</div>
                <div className="text-label-sm text-outline z-10 font-medium">Apr</div>
                <div className="text-label-sm text-outline z-10 font-medium">May</div>
                <div className="text-label-sm text-outline z-10 font-medium">Jun</div>
              </div>
              <div className="mt-6 flex gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-label-md text-on-surface-variant font-medium">Core Skills Mastery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-dashed border-secondary"></div>
                  <span className="text-label-md text-on-surface-variant font-medium">Soft Skills Progress</span>
                </div>
              </div>
            </div>

            {/* Recent Opportunities & Events (Content Management) */}
            <div className="glass-card p-gutter rounded-2xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-headline-md font-headline-md">Opportunities &amp; Content</h3>
                <button className="text-primary text-label-md font-bold hover:underline" onClick={() => router.push('/dashboard/admin/post-opportunity')}>Manage Page</button>
              </div>
              <div className="space-y-4 flex-grow max-h-[350px] overflow-y-auto custom-scrollbar">
                {opportunities && opportunities.length > 0 ? (
                  opportunities.map((opp) => {
                    const iconName = opp.category === 'Event' ? 'event' : opp.category === 'Course' ? 'history_edu' : 'laptop_mac';
                    const iconBg = opp.category === 'Event' ? 'bg-tertiary-fixed-dim text-on-tertiary-fixed' : opp.category === 'Course' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-primary-fixed text-on-primary-fixed';
                    return (
                      <div key={opp.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container transition-colors group">
                        <div className={`h-12 w-12 rounded-lg ${iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                          <span className="material-symbols-outlined">{iconName}</span>
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-label-md font-bold text-on-surface">{opp.title}</h4>
                          <p className="text-label-sm text-on-surface-variant font-medium">{opp.description}</p>
                        </div>
                        <button
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete opportunity: "${opp.title}"?`)) {
                              await deleteOpportunity(opp.id);
                              alert('Opportunity deleted.');
                            }
                          }}
                          className="p-2 hover:bg-error-container/20 rounded-full text-error opacity-60 hover:opacity-100 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-label-sm text-on-surface-variant text-center py-8">No content available.</p>
                )}
              </div>
              <button
                onClick={() => setShowOppModal(true)}
                className="mt-6 w-full py-3 border-2 border-dashed border-outline-variant rounded-xl text-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-all font-semibold"
              >
                + Add New Content
              </button>
            </div>
          </div>

          {/* Administrative Table Section */}
          <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
            <div className="p-gutter flex justify-between items-center bg-white border-b border-outline-variant/10">
              <h3 className="text-headline-md font-headline-md">Active Users Management</h3>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg text-label-md font-bold text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container-high/50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span> Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg text-label-md font-bold text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container-high/50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">file_download</span> Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-label-md uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">User</th>
                    <th className="px-6 py-4 font-bold">Role</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Active Time</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {allUsers && allUsers.length > 0 ? (
                    allUsers.map((item, index) => {
                      const initials = item.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase();
                      const isOnline = index % 2 === 0;
                      const activeTime = index === 0 ? 'Now' : index === 1 ? '42m ago' : '2h 15m ago';

                      return (
                        <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold text-[14px]">
                                {initials}
                              </div>
                              <div>
                                <p className="font-bold text-on-surface text-body-md leading-none mb-1">{item.name}</p>
                                <p className="text-label-sm text-outline leading-none">{item.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-label-sm rounded-full font-semibold ${
                              item.role === 'ADMIN' ? 'bg-primary/10 text-primary' :
                              item.role === 'FACULTY' ? 'bg-secondary/10 text-secondary' :
                              item.role === 'MENTOR' ? 'bg-tertiary-fixed-dim/20 text-tertiary-container' :
                              'bg-surface-variant text-on-surface-variant'
                            }`}>
                              {item.role.charAt(0) + item.role.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-tertiary-container' : 'bg-outline'}`}></div>
                              <span className="text-label-md font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-body-md text-on-surface-variant whitespace-nowrap">{activeTime}</td>
                          <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-surface-variant rounded-full text-outline transition-colors" onClick={() => alert(`Edit profile wizard for ${item.name}`)}>
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(item.id, item.name)}
                              className="p-2 hover:bg-surface-variant rounded-full text-error transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">block</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-on-surface-variant">No active accounts found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-surface-container-low flex justify-between items-center border-t border-outline-variant/10">
              <p className="text-label-sm text-outline">Showing {allUsers ? allUsers.length : 0} of {allUsers ? allUsers.length : 0} users</p>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-white transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="p-2 rounded-lg border border-outline-variant bg-primary text-white transition-colors text-label-sm w-9 h-9 flex items-center justify-center">1</button>
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-white transition-colors text-label-sm w-9 h-9 flex items-center justify-center">2</button>
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-white transition-colors text-label-sm w-9 h-9 flex items-center justify-center">3</button>
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-white transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-surface-container py-gutter px-container-padding-desktop flex flex-col md:flex-row justify-between items-center mt-auto border-t border-outline-variant/10">
          <div className="mb-4 md:mb-0">
            <p className="text-label-md font-bold text-on-surface mb-1">AI COMPANION Admin</p>
            <p className="text-label-sm text-on-surface-variant font-medium">© 2024 AI Companion. Empowering Academic Excellence.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all font-semibold" href="#">Institutional Partners</a>
            <a className="text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all" href="#">Terms of Service</a>
            <a className="text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all" href="#">Privacy Policy</a>
            <a className="text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all" href="#">Contact Us</a>
          </div>
        </footer>
      </main>

      {/* Opportunity / Resource Creation Modal */}
      {showOppModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="font-bold text-[20px] mb-2 text-on-surface text-center">Add New Content</h3>
            
            {/* Tab Selectors */}
            <div className="flex border-b border-outline-variant/30 mb-6 text-[14px]">
              <button
                type="button"
                className={`flex-1 pb-2 font-bold transition-all ${
                  publishType === 'Opportunity'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
                onClick={() => setPublishType('Opportunity')}
              >
                Opportunity
              </button>
              <button
                type="button"
                className={`flex-1 pb-2 font-bold transition-all ${
                  publishType === 'Resource'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
                onClick={() => setPublishType('Resource')}
              >
                Academic Resource
              </button>
            </div>

            <form onSubmit={handleOppSubmit} className="space-y-4">
              {publishType === 'Opportunity' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-on-surface-variant">Title</label>
                    <input
                      type="text"
                      className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="E.g. Senior Software Analyst"
                      value={oppTitle}
                      onChange={(e) => setOppTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-on-surface-variant">Category</label>
                    <select
                      className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"
                      value={oppCategory}
                      onChange={(e) => setOppCategory(e.target.value)}
                    >
                      <option value="Internship">Internship</option>
                      <option value="Job">Full-time Job</option>
                      <option value="Event">Event/Webinar</option>
                      <option value="Course">Certification Course</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-on-surface-variant">Details</label>
                    <input
                      type="text"
                      className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="E.g. 3-month Summer Analyst"
                      value={oppDesc}
                      onChange={(e) => setOppDesc(e.target.value)}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-on-surface-variant">Resource Title</label>
                    <input
                      type="text"
                      className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="E.g. Advanced AI Safety Principles"
                      value={oppTitle}
                      onChange={(e) => setOppTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-on-surface-variant">Academic Category</label>
                    <select
                      className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"
                      value={resCategory}
                      onChange={(e) => setResCategory(e.target.value)}
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                      <option value="Elective">Elective</option>
                      <option value="Core">Core</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-on-surface-variant">File Format</label>
                    <select
                      className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"
                      value={resFileType}
                      onChange={(e) => setResFileType(e.target.value)}
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="DOCX">Word Document</option>
                      <option value="PPTX">PowerPoint Slides</option>
                      <option value="Video">Video Lecture</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-on-surface-variant block mb-1">Upload File</label>
                    <input
                      type="file"
                      className="w-full text-[13px] text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[13px] file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                        }
                      }}
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOppModal(false)}
                  className="px-4 py-2 border border-outline-variant/30 rounded-xl text-[13px] font-bold text-on-surface hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-xl text-[13px] font-bold hover:opacity-90 transition-opacity"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
