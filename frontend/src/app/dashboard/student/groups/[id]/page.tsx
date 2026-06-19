'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '../../../../../store/useStore';
import SideNavBar from '../../../../../components/SideNavBar';
import TopNavBar from '../../../../../components/TopNavBar';
import FloatingAiAssistant from '../../../../../components/FloatingAiAssistant';

export default function GroupDetails() {
  const router = useRouter();
  const params = useParams();
  const { user, token, initializeAuth, fetchStudentData } = useStore();

  const groupId = params.id as string;
  const groupName = groupId === 'ux-design-mastery' || groupId === 'ux'
    ? 'UX Design Mastery'
    : decodeURIComponent(groupId)
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

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
    <div className="bg-background text-on-surface min-h-screen flex font-sans">
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(225, 227, 228, 0.5);
        }
        .ai-gradient-border {
          position: relative;
        }
        .ai-gradient-border::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #632ce5, #7c4dff);
          border-radius: 3px 3px 0 0;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c5c5d4;
          border-radius: 10px;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }
      `}</style>

      <SideNavBar currentTab="Study Groups" />

      <main className="flex-grow lg:ml-sidebar-width min-h-screen pb-gutter relative">
        <TopNavBar placeholder="Search resources, peers, or insights..." />

        {/* Content Area */}
        <div className="pt-24 px-gutter max-w-6xl mx-auto w-full">
          {/* Welcome Alert */}
          <div className="mb-6 p-4 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center gap-3 animate-pulse">
            <span className="material-symbols-outlined text-secondary">celebration</span>
            <p className="font-label-md text-on-surface font-bold text-[14px]">
              Welcome to the Group, {user.name || 'Rakesh'}! You're now part of {groupName}.
            </p>
          </div>

          {/* Group Hero Section */}
          <section className="relative rounded-3xl overflow-hidden glass-card mb-gutter shadow-sm border-none transition-all duration-700 opacity-100 translate-y-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-transparent"></div>
            <div className="relative flex flex-col md:flex-row items-center gap-gutter p-container-padding-desktop">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white shrink-0 bg-surface-container-high flex items-center justify-center">
                <img 
                  className="w-full h-full object-cover" 
                  alt="UX Design tools"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYimFL1diFyRF5iaTQ6HTcRTTicqbqEwt9ZYGvZ_jnew2ArwsM49zvXFD6H-Ty__7WlSwxDhJTfYmIsQ3WcgFIc5Mu8Pp4nKGPXeBKynAY53X55YK398_yd1Nxqb9AFMcP8H2k3Md6OPu2XZpQnMriPD-sB5pbOoTVVmSG1E_rzdMTgRqKGF9XqNI-Nv_qOqJoLTvly8ZluxhRfonPHDhxDKwQoQ7-ekFwbEy57jSz6gk0uW4hySK4Fjoa3BVAYe_ZN652KgkYKKBM"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-label-sm font-bold tracking-tight text-[12px]">DESIGN SPECIALIZATION</span>
                  <span className="flex items-center gap-1 text-on-surface-variant text-label-sm font-medium text-[12px]">
                    <span className="material-symbols-outlined text-[16px]">group</span> 128 Active Members
                  </span>
                </div>
                <h2 className="font-headline-xl text-headline-xl text-primary mb-4 leading-tight">{groupName}</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-6">
                  Preparing for junior designer roles through collaborative case study reviews and tool practice. Join a community dedicated to shipping high-quality portfolio pieces.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <button 
                    onClick={() => alert(`Entering ${groupName} Shared Workspace...`)}
                    className="bg-secondary text-white px-8 py-3 rounded-full font-label-md font-bold hover:shadow-[0_8px_30px_rgb(99,44,229,0.3)] transition-all duration-300 active:scale-95 flex items-center gap-2 text-[14px]"
                  >
                    Enter Workspace <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                  <button 
                    onClick={() => alert("Loading complete member list...")}
                    className="bg-white border border-outline-variant text-on-surface-variant px-8 py-3 rounded-full font-label-md font-bold hover:bg-surface-container-low transition-all text-[14px]"
                  >
                    View Member List
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Grid Layout for Benefits and Sidecards */}
          <div className="grid grid-cols-12 gap-gutter">
            {/* Main Content Column */}
            <div className="col-span-12 lg:col-span-8 space-y-gutter">
              {/* Top Features Section (Bento Style) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 group hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">psychology</span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-on-surface font-extrabold mb-1 text-[14px]">AI-Driven Study Sessions</h3>
                    <p className="text-label-md text-on-surface-variant opacity-80 text-[14px]">Scheduled collaborative deep-dives with an AI facilitator to break down complex heuristic evaluations.</p>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 group hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[28px]">folder_open</span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-on-surface font-extrabold mb-1 text-[14px]">Shared Academic Repository</h3>
                    <p className="text-label-md text-on-surface-variant opacity-80 text-[14px]">Access to a collective library of curated UX resources, Figma components, and shared case study notes.</p>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 group hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[28px]">rate_review</span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-on-surface font-extrabold mb-1 text-[14px]">Peer Review Circles</h3>
                    <p className="text-label-md text-on-surface-variant opacity-80 text-[14px]">Weekly live sessions for giving and receiving constructive feedback on portfolio wireframes and flows.</p>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 group hover:shadow-md transition-shadow bg-gradient-to-br from-white to-secondary/5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-secondary/20 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-on-surface font-extrabold mb-1 text-[14px]">Group Learning Streak</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-black text-secondary">14</span>
                      <span className="text-label-sm font-bold text-on-surface-variant uppercase text-[12px]">Days Active</span>
                    </div>
                    <p className="text-label-md text-on-surface-variant opacity-80 text-[14px]">A gamified tracker showing the group's collective progress and achievements.</p>
                  </div>
                </div>
              </div>

              {/* Group Roadmap */}
              <section className="glass-card rounded-2xl p-6">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="font-headline-md text-on-surface mb-1">Curriculum Roadmap</h3>
                    <p className="text-label-md text-on-surface-variant text-[14px]">The path to becoming a Junior UX Designer</p>
                  </div>
                  <span className="text-label-sm font-bold bg-surface-container px-3 py-1 rounded-full text-on-surface-variant text-[12px]">4 STAGES TOTAL</span>
                </div>

                <div className="relative space-y-8 pl-4">
                  {/* Timeline line */}
                  <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-outline-variant opacity-30"></div>

                  {/* Item 1: Complete */}
                  <div className="relative flex gap-6 items-start">
                    <div className="relative z-10 w-4 h-4 rounded-full bg-tertiary-container mt-2 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[10px]" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                    </div>
                    <div className="flex-1 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-label-md text-on-surface font-bold text-[14px]">Module 1: Design Systems</h4>
                        <span className="text-[10px] text-tertiary font-black uppercase tracking-wider">Completed</span>
                      </div>
                      <p className="text-label-md text-on-surface-variant text-[14px]">Establishing atomic design principles and color theory.</p>
                    </div>
                  </div>

                  {/* Item 2: Active */}
                  <div className="relative flex gap-6 items-start">
                    <div className="relative z-10 w-4 h-4 rounded-full bg-secondary ring-4 ring-secondary/20 mt-2"></div>
                    <div className="flex-1 bg-white p-4 rounded-xl border-2 border-secondary shadow-sm">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-label-md text-secondary font-black text-[14px]">Module 2: User Testing Phase</h4>
                        <span className="text-[10px] text-secondary font-black animate-pulse uppercase tracking-wider">In Progress</span>
                      </div>
                      <p className="text-label-md text-on-surface-variant mb-3 text-[14px]">Conducting moderated usability tests on our current case studies.</p>
                      <div className="h-2 w-full bg-secondary/10 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-3/4 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Item 3: Upcoming */}
                  <div className="relative flex gap-6 items-start opacity-60">
                    <div className="relative z-10 w-4 h-4 rounded-full bg-outline-variant mt-2"></div>
                    <div className="flex-1 bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/10">
                      <h4 className="font-label-md text-on-surface font-bold mb-1 text-[14px]">Module 3: Visual Prototyping</h4>
                      <p className="text-label-md text-on-surface-variant text-[14px]">High-fidelity mocks and advanced micro-interactions.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column (Insights & Spotlight) */}
            <div className="col-span-12 lg:col-span-4 space-y-gutter">
              {/* AI Mentor Insight */}
              <section className="glass-card rounded-2xl p-6 ai-gradient-border shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <h3 className="font-label-md text-on-surface font-bold text-[14px]">AI Mentor Insight</h3>
                </div>
                <div className="space-y-4">
                  <p className="font-body-md text-on-surface italic leading-relaxed text-[15px]">
                    "{user.name || 'Rakesh'}, based on your progress in 'Information Architecture', this group's focus on **Module 2: User Testing** is the perfect next step. They need someone with your analytical strengths for the upcoming peer review session on Tuesday."
                  </p>
                  <div className="flex items-center gap-3 p-3 bg-secondary-fixed/30 rounded-xl">
                    <span className="material-symbols-outlined text-on-secondary-fixed">trending_up</span>
                    <p className="text-label-sm text-on-secondary-fixed text-[12px]">Join now to increase your 'Collab-Score' by 15%</p>
                  </div>
                </div>
              </section>

              {/* Member Spotlight */}
              <section className="glass-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-label-md text-on-surface font-bold text-[14px]">Active Members</h3>
                  <button 
                    onClick={() => alert("Open active members directory...")}
                    className="text-primary font-label-sm hover:underline text-[12px]"
                  >
                    See all 128
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Current User Row */}
                  <div className="flex items-center gap-3 group">
                    <div className="relative">
                      <img 
                        className="w-10 h-10 rounded-full border-2 border-secondary object-cover" 
                        alt="Your profile"
                        src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name || 'Rakesh')}`}
                      />
                      <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-secondary rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-label-md text-secondary font-bold text-[14px]">{user.name || 'Rakesh'} (You)</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">Gold Tier Learner</p>
                    </div>
                  </div>

                  {/* Member 1 */}
                  <div className="flex items-center gap-3 group">
                    <div className="relative">
                      <img 
                        className="w-10 h-10 rounded-full border border-outline-variant object-cover" 
                        alt="Sarah K."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlaqW3-qN3u7lNPr9PRFDDjhbs1ywMECfC-t-xAjQTMtqhqupxRVTrC5bidTCkv4FY_zBCL-wWKUp9vZPFGfMvvmjGL_RiA78rOs6woNyL5Ebw3Wj0Rk6B3-uuFJTQExgfVzPPH5NJ1EOz6OAXFzrXtEpRPVlUF4BnoWV98uo7ZjkzVvkpiWx0FPdGIi7VLGnEPKgGsyXR6HoaNXwr6G_X2Uc9ii2Rz19D65qAjQtPPH420iTcRrVgPMKGMLxyVjkocGn1Xl0s_0nD"
                      />
                      <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-tertiary-fixed rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-tertiary rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-label-md text-on-surface font-bold group-hover:text-primary transition-colors text-[14px]">Sarah K.</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">Case Study Lead</p>
                    </div>
                    <button 
                      onClick={() => alert("Initiating chat with Sarah K...")}
                      className="material-symbols-outlined text-on-surface-variant hover:text-secondary opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      chat_bubble
                    </button>
                  </div>

                  {/* Member 2 */}
                  <div className="flex items-center gap-3 group">
                    <div className="relative">
                      <img 
                        className="w-10 h-10 rounded-full border border-outline-variant object-cover" 
                        alt="Marcus Chen"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuATJwt4dpefsQuVn1tUY2t2PMoAraeHqRYZV4cmKN9MqS712hVtffCP-eq_r36Gk6NxWs3xCBggSgzSfJJLGq4M2_JZ7fYZh73lrXJiCWhx1iVwDGwqmyvKlfPL19uYiW07wIfTeB6O_ccdn0sr0_ViDavxvxlwoE0nqi6mw8oiLEIv6NfFV1drp3gxvVGzsSI-ZqQg24bjKF8krdMtBj6VDyQib1aNBOIPCju7Rgf6R8DikHH7FTuEiBZ81O3hYMlwgQg1VJt2Gd6L"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-label-md text-on-surface font-bold group-hover:text-primary transition-colors text-[14px]">Marcus Chen</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">Tool Specialist (Figma)</p>
                    </div>
                    <button 
                      onClick={() => alert("Initiating chat with Marcus Chen...")}
                      className="material-symbols-outlined text-on-surface-variant hover:text-secondary opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      chat_bubble
                    </button>
                  </div>

                  {/* Member 3 */}
                  <div className="flex items-center gap-3 group">
                    <div className="relative">
                      <img 
                        className="w-10 h-10 rounded-full border border-outline-variant object-cover" 
                        alt="Aisha M."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuClNtjglKz_HEDf7BcF4vS4cGE3D0r7ZGOqv8KRkl8Uq_1MBYj8nNGqaXRv8NuNo7lNiES5jmyL1CiuCbztYw9WYkbCRiE2Y-W9Nli5bGpLbQiUvv3krtwwimafVHQuuQa-ASpWM62ZvLo27Ct1X91rR49hPnK8W3n3-4HDO9Kr0PRzTGR1SgonjKmL9OZsz88bnNSLntvTXjh7S_hzOq84SWMRU6Izh0grV2ewKmdLjPRO4N_TnaBx4xCb_Ou-PJpyA8MwSFO64IEW"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-label-md text-on-surface font-bold group-hover:text-primary transition-colors text-[14px]">Aisha M.</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">Research Analyst</p>
                    </div>
                    <button 
                      onClick={() => alert("Initiating chat with Aisha M...")}
                      className="material-symbols-outlined text-on-surface-variant hover:text-secondary opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      chat_bubble
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <div className="flex -space-x-3 overflow-hidden">
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface-variant border border-outline-variant/30">
                      +125
                    </div>
                  </div>
                </div>
              </section>

              {/* Group Stats Snapshot */}
              <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Weekly Meetings</p>
                    <p className="text-xl font-black text-on-surface">3</p>
                  </div>
                  <div className="text-center border-l border-outline-variant/50">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Avg. Attendance</p>
                    <p className="text-xl font-black text-on-surface">94%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingAiAssistant />
    </div>
  );
}
