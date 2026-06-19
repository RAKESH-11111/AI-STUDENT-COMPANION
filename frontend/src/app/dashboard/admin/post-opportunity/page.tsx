'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';

export default function PostOpportunity() {
  const router = useRouter();
  const {
    user,
    token,
    initializeAuth,
    opportunities,
    fetchOpportunities,
    addOpportunity,
    deleteOpportunity,
    isLoading
  } = useStore();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Internship');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      fetchOpportunities();
    }
  }, [token, fetchOpportunities]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-spin material-symbols-outlined text-[48px] text-primary">progress_activity</span>
          <p className="font-semibold text-on-surface-variant font-sans">Loading Opportunity Manager...</p>
        </div>
      </div>
    );
  }

  // Restrict to admins only
  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-6 text-center">
        <span className="material-symbols-outlined text-[64px] text-error mb-4">gpp_maybe</span>
        <h2 className="text-headline-md font-bold text-on-surface mb-2 font-sans">Unauthorized Access</h2>
        <p className="text-body-md text-on-surface-variant max-w-sm">Only system administrators can access this content management panel.</p>
        <button onClick={() => router.push('/dashboard/student')} className="mt-6 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold">Back to Home</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;

    setIsSubmitting(true);
    try {
      await addOpportunity({
        title,
        description: `${category}s • ${desc}`,
        category
      });
      alert('Opportunity published successfully!');
      setTitle('');
      setDesc('');
      fetchOpportunities();
    } catch (err) {
      console.error(err);
      alert('Failed to publish opportunity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the opportunity: "${name}"?`)) {
      try {
        await deleteOpportunity(id);
        alert('Opportunity deleted.');
        fetchOpportunities();
      } catch (err) {
        console.error(err);
        alert('Failed to delete opportunity.');
      }
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans">
      <SideNavBar currentTab="Admin Panel" />

      <main className="flex-grow lg:ml-sidebar-width flex flex-col min-h-screen">
        <TopNavBar placeholder="Search opportunities..." />

        {/* Dashboard Content */}
        <div className="p-container-padding-mobile md:p-container-padding-desktop max-w-[1400px] mx-auto space-y-gutter w-full flex-grow">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-headline-lg font-headline-lg text-on-surface">Opportunities &amp; Content Creator</h2>
              <p className="text-body-md text-on-surface-variant">Post, monitor, or remove global student opportunities from the database</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/admin')}
              className="px-5 py-2.5 bg-surface-container border border-outline-variant/30 text-on-surface rounded-xl font-semibold text-[14px] flex items-center gap-2 hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Console
            </button>
          </div>

          {/* Bento Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left Column: Form to Post Opportunity */}
            <div className="lg:col-span-5 glass-card p-6 rounded-3xl flex flex-col justify-between h-fit ai-gradient-border">
              <div>
                <h3 className="font-bold text-[18px] mb-4 text-on-surface">Publish New Opportunity</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-on-surface-variant block">Opportunity Title</label>
                    <input
                      type="text"
                      className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="E.g. Senior Software Analyst"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-on-surface-variant block">Category</label>
                    <select
                      className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Internship">Internship</option>
                      <option value="Job">Full-time Job</option>
                      <option value="Event">Event/Webinar</option>
                      <option value="Course">Certification Course</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-on-surface-variant block">Details / Descriptions</label>
                    <textarea
                      rows={3}
                      className="w-full p-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 outline-none resize-none font-sans"
                      placeholder="E.g. 3-month summer internship with publication and stipend details..."
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">{isSubmitting ? 'progress_activity' : 'send'}</span>
                    {isSubmitting ? 'Publishing...' : 'Publish to Student App'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Opportunities List Table */}
            <div className="lg:col-span-7 glass-card rounded-3xl overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-6 border-b border-outline-variant/10">
                  <h3 className="font-bold text-[18px] text-on-surface">Active Opportunities List</h3>
                  <p className="text-[12px] text-on-surface-variant font-medium">Currently visible to all student portfolios</p>
                </div>

                <div className="overflow-x-auto max-h-[480px] overflow-y-auto custom-scrollbar">
                  <table className="w-full border-collapse text-left">
                    <thead className="bg-surface-container-low text-on-surface-variant text-[12px] font-bold border-b border-outline-variant/15 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Details</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-[14px]">
                      {opportunities && opportunities.length > 0 ? (
                        opportunities.map((opp) => (
                          <tr key={opp.id} className="hover:bg-white/40 transition-all">
                            <td className="px-6 py-4 font-bold text-on-surface max-w-[150px] truncate">{opp.title}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold ${
                                opp.category === 'Job' ? 'bg-primary/10 text-primary' :
                                opp.category === 'Internship' ? 'bg-secondary/10 text-secondary' :
                                opp.category === 'Course' ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
                                'bg-surface-container-high text-on-surface'
                              }`}>
                                {opp.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-on-surface-variant font-medium text-[12px] max-w-[200px] truncate">{opp.description}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDelete(opp.id, opp.title)}
                                className="p-2 hover:bg-error-container/20 rounded-full text-error transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-on-surface-variant">No active opportunities found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low border-t border-outline-variant/10 flex justify-between items-center text-[12px] text-outline">
                <span>Total visible: {opportunities ? opportunities.length : 0} items</span>
                <span>Security level: Enterprise Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-surface-container py-gutter px-container-padding-desktop flex flex-col md:flex-row justify-between items-center border-t border-outline-variant/10 mt-auto">
          <div className="mb-4 md:mb-0">
            <p className="text-label-md font-bold text-on-surface mb-1">AI COMPANION Admin</p>
            <p className="text-label-sm text-on-surface-variant font-medium">© 2024 AI Companion. Empowering Academic Excellence.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[12px] font-medium text-on-surface-variant">
            <a className="text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all font-semibold" href="#">Institutional Partners</a>
            <a className="text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all font-semibold" href="#">Terms of Service</a>
            <a className="text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all font-semibold" href="#">Privacy Policy</a>
            <a className="text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all font-semibold" href="#">Contact Us</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
