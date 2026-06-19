'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';
import FloatingAiAssistant from '../../../../components/FloatingAiAssistant';

export default function StudyGroups() {
  const router = useRouter();
  const { user, token, initializeAuth, fetchStudyGroups, studyGroups, joinGroup, leaveGroup } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'my-groups' | 'past'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Coding');
  const [newGroupDesc, setNewGroupDesc] = useState('');

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
      fetchStudyGroups();
    }
  }, [token]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span className="animate-spin material-symbols-outlined text-[48px] text-primary">progress_activity</span>
      </div>
    );
  }

  const handleGroupAction = async (groupId: string, isMember: boolean) => {
    if (isMember) {
      await leaveGroup(groupId);
    } else {
      await joinGroup(groupId);
    }
    fetchStudyGroups();
  };

  const handleCreateGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    alert(`Study group "${newGroupName}" successfully created and added to repository!`);
    setNewGroupName('');
    setNewGroupDesc('');
    setShowCreateModal(false);
    fetchStudyGroups();
  };

  // Curated Stitch study groups to maintain exact visual equivalence with Stitch
  const stitchGroups = [
    {
      id: 'stitch-g1',
      name: 'Python for Data Science',
      description: 'Exploring Pandas and NumPy for complex data cleaning tasks.',
      category: 'Coding',
      icon: 'terminal',
      status: 'Active Now',
      tags: ['#Python', '#ML', '#Intermediate'],
      membersCount: 10,
      borderClass: 'border-t-primary',
      badgeBg: 'bg-primary text-on-primary',
      avatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDAAYizkOPIWpAbOA5KAAeDrMlHUh7dlBjfxFJVwxMMDBwiLhgfjttB1hAZgtOPs942LHS44sloQ3LZKjkTM0aXEKvXgPqql-0llX5kBIhI8fNi8-BYBKrmHx673TOmBvCVCZTZTOjODQAgtDzHmDIdzRPGRVqWwNyzU12OWLI0s7htKQEj7kaLSy911TU5m_5YQtnE9wtLX2ndkTFUctVD_lGY3ULohB53WoQDbFy9a3wN0sZXQKbJ-faGC7M5hW5WGWz5iPnei9h0',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCeDHHRv33sR343V0emOxVisYI4REmJaAcTvt4JOog9WW98LOkOIGr0ObK_CB6PT2beRb1FiCJX1T91QViIjezLsAZGgQo3ZhfIQJD6muSzGcHi5nITZU4HzpLHNkzZI9wZ-8TkHZLaLxJsunHEi2d9SH23ni5KpFFhmILdzuFxqkv-4W4U_O2HIUJ5tKUosVpoUej9Vpa9p0W4HUkJ4Rnkc67d455RahBPwZSiHiNgMonNjaCU5-aeYC_EppI7XjADRMuV_PNuPouh'
      ]
    },
    {
      id: 'stitch-g2',
      name: 'Advanced SQL Optimization',
      description: 'Mastering query execution plans and index tuning strategies.',
      category: 'Database',
      icon: 'database',
      status: 'Next: 2 PM',
      tags: ['#SQL', '#Backend'],
      membersCount: 6,
      borderClass: 'border-t-secondary',
      badgeBg: 'bg-secondary text-on-secondary',
      avatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBIph0GeYv3eZviP4PtwkS8vy2a0JevYYzh5DyT0RxbCiF3-BwAy1A4Q3a9BVZ9y4OLswmmM88K1tYkg5YQAVGgeLX7Vn_neE2WEptEMNgEIXV7mWeEsG2kyNMElMnsxgXOeYbwvl4bM4XtSiRpjKlefW-Is3hKQ9BZE4Mysy2CD1ppGKcLvGhulqNpKbQQRvwFm-XlNs08NvSOzdsVY0_l55jba-EDcyZkhCSJ2MV3Sokcax8vzDEO7oa-6VVwvEVi3R-6UdAYPdxK'
      ]
    },
    {
      id: 'stitch-g3',
      name: 'System Design Fundamentals',
      description: 'Learning about load balancing, microservices, and CAP theorem.',
      category: 'Architecture',
      icon: 'architecture',
      status: 'Starting Soon',
      tags: ['#Architecture', '#InterviewPrep'],
      membersCount: 14,
      borderClass: 'border-t-tertiary',
      badgeBg: 'bg-tertiary text-on-tertiary',
      avatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBrqXZm5DK-e6D3sAMzNIm1RQJD-rhnaOLymLH-vfkPnU2T2ck4ywgEvGpUbcPpLFTvEQFYAi-E4tzo9ezN96LqnBgRkUC_Pj3B18CRCfI1XxgNZENpde1Sv5-hBtmPpVay3pm87GmKxnVOEwoYEjVYdsQfVem4tSyy04u7XBOVzyZiqsULQfMz75uWcTHx3VqvRO_pM2gTRYxTSbWqx1HAn6nijPxd6BENf1dntNZLegdyajMiqbeywrGZQNrEmh-8ZfPO2KSspY_K',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCAWYkednlUdGUSxAdCZhHgX4FwWn8kHvWu296XfG1neZNE6FZyB0OQrs57OU_yh3py1do89CMAj7bqpS4AGKLV05aLOzafLu-qdr40Kaf6RRfVUXg9IA6h0XYp-ClLCuMo_rBezyA-Iue9aw70LsqLQa6oL1ncf0atRnVetVkxegVrmhnhTaf75J97a9Fq7763Q_jPvwfZlgeHhwPEi4lTvHCGAZ99SKNF_XvUQe2VpgmUTksBN5qOqjfFtUbULjVguj-bcsE8aSr_'
      ]
    }
  ];

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans">
      <SideNavBar currentTab="Study Groups" />

      <main className="flex-grow min-h-screen flex flex-col relative overflow-hidden lg:ml-sidebar-width">
        {/* Top Header */}
        <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 flex justify-between items-center h-16 px-gutter">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-headline-md font-extrabold text-primary">Study Groups</h2>
            <div className="hidden md:flex items-center gap-6 ml-8">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`font-label-md text-label-md transition-all ${
                  activeTab === 'overview' ? 'text-primary border-b-2 border-primary pb-2' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('my-groups')}
                className={`font-label-md text-label-md transition-all ${
                  activeTab === 'my-groups' ? 'text-primary border-b-2 border-primary pb-2' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                My Groups
              </button>
              <button 
                onClick={() => setActiveTab('past')}
                className={`font-label-md text-label-md transition-all ${
                  activeTab === 'past' ? 'text-primary border-b-2 border-primary pb-2' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Past Sessions
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                className="w-full h-10 pl-10 pr-4 bg-surface-container border-none rounded-full text-label-md focus:ring-2 focus:ring-secondary/50 outline-none text-on-surface" 
                placeholder="Search groups..." 
                type="text"
              />
            </div>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <span className="hidden sm:inline font-bold text-label-md text-on-surface ml-2">{user.name}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
              <img 
                className="w-full h-full object-cover" 
                alt="User Profile" 
                src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
              />
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="p-gutter max-w-7xl mx-auto w-full space-y-8 flex-grow pb-24 overflow-y-auto">
          
          {/* Featured live recommendation */}
          <section 
            onClick={() => router.push('/dashboard/student/groups/ux-design-mastery')}
            className="relative rounded-3xl overflow-hidden glass-card p-8 min-h-[280px] flex flex-col justify-end border border-outline-variant/15 shadow-md cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent -z-10 opacity-90"></div>
            <div className="max-w-2xl relative z-10">
              <span className="inline-block px-3 py-1 bg-secondary text-on-secondary rounded-full text-label-sm font-bold mb-4 uppercase tracking-wider">
                AI Recommended
              </span>
              <h1 className="font-headline-xl text-headline-xl text-on-surface mb-3 text-[28px] md:text-[36px] font-extrabold leading-tight">
                Mastering Data Structures with Peers
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-6 text-[15px]">
                Join 12 others in a focused deep-dive session on Binary Search Trees and Graph Traversal algorithms. Starting in 15 minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); router.push('/dashboard/student/groups/ux-design-mastery'); }}
                  className="px-8 py-3 bg-secondary text-on-secondary rounded-xl font-bold hover:shadow-lg hover:shadow-secondary/20 transition-all active:scale-95"
                >
                  Join Live Session
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); alert("Remind set!"); }}
                  className="px-8 py-3 bg-surface text-primary border border-outline-variant rounded-xl font-bold hover:bg-surface-container-high transition-all active:scale-95"
                >
                  Remind Me Later
                </button>
              </div>
            </div>
          </section>

          {/* Main Grid: Groups List and Sidebar details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Active Groups Column */}
            <div className="lg:col-span-2 space-y-8">
              
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md text-on-surface text-[20px] font-bold">Active Study Groups</h3>
                <div className="flex gap-2">
                  <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  </button>
                  <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">sort</span>
                  </button>
                </div>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* A. Stitch Hardcoded Cards */}
                {stitchGroups.map((group) => (
                  <div 
                    key={group.id} 
                    onClick={() => router.push(`/dashboard/student/groups/${group.id}`)}
                    className={`group glass-card rounded-2xl p-6 transition-all hover:translate-y-[-4px] hover:shadow-xl border-t-4 ${group.borderClass} cursor-pointer`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {group.icon}
                        </span>
                      </div>
                      <span className={`text-label-sm px-2 py-1 rounded font-bold ${
                        group.status === 'Active Now' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        {group.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-body-lg mb-1 text-[16px] text-on-surface group-hover:text-primary transition-colors">
                      {group.name}
                    </h4>
                    <p className="text-on-surface-variant text-label-md mb-4 text-[13px] leading-relaxed">
                      {group.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {group.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-surface-container-high rounded text-label-sm text-[11px] text-on-surface-variant">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                      <div className="flex -space-x-2">
                        {group.avatars && group.avatars.map((av, idx) => (
                          <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-surface-dim overflow-hidden">
                            <img className="w-full h-full object-cover" alt="Member" src={av} />
                          </div>
                        ))}
                        <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${group.badgeBg}`}>
                          +{group.membersCount - (group.avatars ? group.avatars.length : 0)}
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/student/groups/${group.id}`); }}
                        className={`px-4 py-2 rounded-lg font-bold text-label-md transition-all ${
                          group.borderClass === 'border-t-secondary' 
                            ? 'bg-secondary text-on-secondary hover:bg-secondary-container' 
                            : group.borderClass === 'border-t-tertiary' 
                              ? 'bg-tertiary text-on-tertiary hover:opacity-90' 
                              : 'bg-primary text-on-primary hover:bg-primary-container'
                        }`}
                      >
                        Join
                      </button>
                    </div>
                  </div>
                ))}

                {/* B. Database Groups */}
                {studyGroups && studyGroups.map((group) => {
                  const isMember = group.members.some((m: any) => m.id === user.id);
                  return (
                    <div 
                      key={group.id} 
                      onClick={() => router.push(`/dashboard/student/groups/${group.id}`)}
                      className="group glass-card rounded-2xl p-6 transition-all hover:translate-y-[-4px] hover:shadow-xl border-t-4 border-t-secondary cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-secondary-fixed rounded-xl flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {group.icon || 'group'}
                          </span>
                        </div>
                        <span className="text-label-sm bg-surface-container-highest text-on-surface-variant px-2 py-1 rounded font-bold">
                          {group.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-body-lg mb-1 text-[16px] text-on-surface group-hover:text-secondary transition-colors">
                        {group.name}
                      </h4>
                      <p className="text-on-surface-variant text-label-md mb-4 text-[13px] leading-relaxed">
                        {group.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                        <span className="text-[11px] text-on-surface-variant font-bold">
                          {group.members.length} members
                        </span>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await handleGroupAction(group.id, isMember);
                          }}
                          className={`px-4 py-2 rounded-lg font-bold text-label-md transition-all ${
                            isMember 
                              ? 'bg-error-container text-on-error-container' 
                              : 'bg-secondary text-on-secondary hover:bg-secondary-container'
                          }`}
                        >
                          {isMember ? 'Leave' : 'Join'}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Create Group Card Placeholder */}
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="group relative rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center p-8 gap-4 text-center min-h-[220px]"
                >
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl">add</span>
                  </div>
                  <div>
                    <p className="font-bold text-body-lg text-on-surface text-[16px]">Start a New Group</p>
                    <p className="text-on-surface-variant text-label-md text-[13px]">Create a space for your specific topic</p>
                  </div>
                </button>

              </div>
            </div>

            {/* Sidebar Column: Upcoming Sessions & Achievements */}
            <aside className="space-y-8 flex flex-col gap-6">
              
              {/* Upcoming Peer Sessions */}
              <div className="glass-card rounded-3xl p-6 border border-outline-variant/20 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-body-lg text-[16px]">Upcoming Sessions</h3>
                  <button onClick={() => alert("All peer sessions loaded")} className="text-primary text-label-sm font-bold hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-6">
                  {/* Session 1 */}
                  <div className="flex gap-4 relative pl-4 border-l-2 border-primary">
                    <div className="flex-shrink-0 w-12 text-center">
                      <p className="font-bold text-primary text-[12px]">MON</p>
                      <p className="text-headline-md leading-none font-extrabold text-[22px]">18</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-label-md text-[14px] leading-snug">Operating Systems Exam Prep</h4>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1 font-medium">
                        <span className="material-symbols-outlined text-xs">schedule</span> 10:00 AM - 12:00 PM
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <img className="w-5 h-5 rounded-full object-cover" alt="Sarah J" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkQbFg5C3t5KvO9LD20MJ7YfMXU9Z3iIdvJxdtUeQ4J5CAWHLGGSwLVZ1dYgI2GbXqhDYXX6kzyi7C7QDjJQUE6H4Uk1Lh-zF34MGlo7vBBdtrlsMBZU5oAoylCy4WvfMYGFXBhXkr-vp17eTFjVQh_lO7UPwUxF-on4UqefXEuasvXg98J0D0HF3wUQ--I4_gYCFh2wpbhDq4DMyknF57Fnifz1XI2JIqBjy9VW2JeFQ6YU0rmdCf5liD2RLR8acaaYQQs7fwOPSy" />
                        <span className="text-[11px] text-on-surface-variant">Host: Sarah J.</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Session 2 */}
                  <div className="flex gap-4 relative pl-4 border-l-2 border-secondary">
                    <div className="flex-shrink-0 w-12 text-center">
                      <p className="font-bold text-secondary text-[12px]">TUE</p>
                      <p className="text-headline-md leading-none font-extrabold text-[22px]">19</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-label-md text-[14px] leading-snug">Linear Algebra Deep Dive</h4>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1 font-medium">
                        <span className="material-symbols-outlined text-xs">schedule</span> 04:30 PM - 06:00 PM
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <img className="w-5 h-5 rounded-full object-cover" alt="Mike" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnSwdJ4A8eB5mP-taARFgvtsKu_2FG4ccxGMapqZB2u90xrDydNEYc-IxdV8eKIMU9vCbhDkWw_HPowe15nFctsqaZ92vL71z8DgNe0R3D8tYzteyK_UDzQtq6sXiljqTQtbWJcTJ672SQBBtjQj7tYVGVr4j3K9rjrOzI25p3Xil6IobcJnfLL7ZY1WU12w9z9_fkzkawdtpZ-g9pk_XudTodnID3C-EX_3pKmAYZCGkoHSehtdGZCG2YIjxVhoLT_bdp-azKFTQT" />
                        <span className="text-[11px] text-on-surface-variant">Host: Prof. Mike</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Strategy Tip */}
              <div className="bg-primary text-on-primary rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-primary/20">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-body-lg mb-3 flex items-center gap-2 text-[16px] text-white">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    AI Strategy Tip
                  </h4>
                  <p className="text-on-primary-container text-label-md leading-relaxed mb-6 text-[13px] opacity-90">
                    Rakesh, based on your recent activity in "Data Structures," you might learn faster by joining the "Python for Data Science" group. Peer learning has historically increased your recall by <span className="font-bold text-white">24%</span>.
                  </p>
                  <button 
                    onClick={() => alert("Analyzing progress...")}
                    className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl font-bold text-white hover:bg-white/30 transition-all active:scale-95"
                  >
                    Analyze My Progress
                  </button>
                </div>
              </div>

              {/* Achievements */}
              <div className="glass-card rounded-3xl p-6 border border-outline-variant/20 shadow-sm">
                <h3 className="font-bold text-body-lg mb-4 text-[16px]">Your Achievements</h3>
                <div className="flex justify-between gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-inner">
                      <span className="material-symbols-outlined text-3xl">school</span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant">Mentor</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-40 grayscale">
                    <div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shadow-inner">
                      <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant">Scholar</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-inner">
                      <span className="material-symbols-outlined text-3xl">local_fire_department</span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant">Streak: 12</span>
                  </div>
                </div>
              </div>

            </aside>

          </div>

        </div>
      </main>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-outline-variant/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-[18px] text-on-surface mb-2">Create Study Group</h3>
            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-on-surface-variant block mb-1">Group Name</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Machine Learning Revisions"
                  className="w-full h-12 border border-outline-variant/30 rounded-xl px-4 text-[14px] focus:ring-2 focus:ring-primary/20 outline-none text-on-surface"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-on-surface-variant block mb-1">Category</label>
                <select
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value)}
                  className="w-full h-12 border border-outline-variant/30 rounded-xl px-4 text-[14px] focus:ring-2 focus:ring-primary/20 outline-none text-on-surface"
                >
                  <option>Coding</option>
                  <option>Physics</option>
                  <option>Mathematics</option>
                  <option>Design</option>
                  <option>Ethics</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-bold text-on-surface-variant block mb-1">Description</label>
                <textarea
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Focus topics, goals, schedule..."
                  className="w-full min-h-[80px] border border-outline-variant/30 rounded-xl p-3 text-[14px] focus:ring-2 focus:ring-primary/20 outline-none text-on-surface resize-none"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-outline-variant/30 rounded-xl text-[12px] font-bold text-on-surface-variant hover:bg-surface-container">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-primary text-white rounded-xl text-[12px] font-bold shadow-md hover:opacity-90">
                  Create Group
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
