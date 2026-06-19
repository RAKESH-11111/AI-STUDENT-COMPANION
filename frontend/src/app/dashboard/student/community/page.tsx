'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';

export default function Community() {
  const router = useRouter();
  const { user, token, initializeAuth, fetchStudentData } = useStore();

  // Local Study Chat Messages
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Rajesh Sharma', text: 'Hey guys, anyone up for a Quantum Physics study session later today?', time: '2:14 PM' },
    { id: 2, sender: 'Amit Verma', text: 'I am in! Let’s meet in the virtual study room at 5 PM.', time: '2:16 PM' },
    { id: 3, sender: 'Madhusree Sen', text: 'Count me in too. Need to clarify some vector calculus equations.', time: '2:17 PM' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // New Forum Post Input
  const [posts, setPosts] = useState([
    { id: 1, category: 'Computer Science', title: 'Tips for fine-tuning LLMs with limited resources?', author: 'Rahul Gupta', replies: 14, likes: 25 },
    { id: 2, category: 'UX Design', title: 'Why Next.js Server Components are a game changer', author: 'Preeti Patel', replies: 8, likes: 19 },
    { id: 3, category: 'Career Prep', title: 'How to manage time with 3 CS courses and an internship?', author: 'David Miller', replies: 22, likes: 45 }
  ]);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Computer Science');

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span className="animate-spin material-symbols-outlined text-[48px] text-primary">progress_activity</span>
      </div>
    );
  }

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: chatMessages.length + 1,
      sender: user.name,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    const newPost = {
      id: posts.length + 1,
      category: newPostCategory,
      title: newPostTitle,
      author: user.name,
      replies: 0,
      likes: 0
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setShowNewPostModal(false);
  };

  // Mock student rankings + current user ranking
  const leaderboardData = [
    { rank: 1, name: 'Rajesh Sharma', level: 12, xp: 11400, avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Rajesh' },
    { rank: 2, name: 'Amit Verma', level: 10, xp: 9800, avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Amit' },
    { rank: 3, name: 'Madhusree Sen', level: 9, xp: 8750, avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Madhusree' },
    { rank: 4, name: 'Preeti Patel', level: 8, xp: 7900, avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Preeti' },
    { rank: 5, name: `${user.name} (You)`, level: user.level, xp: user.xp, avatar: user.avatarUrl || 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Rakesh' }
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans">
      <SideNavBar currentTab="Community" />

      <main className="flex-1 lg:ml-sidebar-width min-h-screen flex flex-col overflow-x-hidden pb-12">
        <TopNavBar placeholder="Search community, mentors, or topics..." />

        {/* Content Canvas */}
        <div className="p-container-padding-mobile md:p-container-padding-desktop max-w-7xl mx-auto w-full space-y-gutter flex-grow">
          
          {/* Hero / Header Section */}
          <div className="relative overflow-hidden rounded-3xl p-8 bg-surface-container-high shadow-sm border border-outline-variant/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-transparent"></div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="font-headline-xl text-headline-xl text-primary font-black mb-2 text-[28px] md:text-[36px] leading-tight">
                Welcome to the Hub, {user.name.split(' ')[0]}.
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-[15px]">
                Connect with peers, find industry mentors, and grow your career with AI-enhanced networking.
              </p>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setShowNewPostModal(true)}
                  className="bg-primary text-white font-label-md text-label-md px-6 py-2.5 rounded-full hover:shadow-lg transition-all font-bold active:scale-95"
                >
                  Create New Post
                </button>
                <button 
                  onClick={() => alert("Redirecting to Mentorship Circles Directory...")}
                  className="bg-white text-primary border border-outline-variant font-label-md text-label-md px-6 py-2.5 rounded-full hover:bg-surface-container transition-all font-bold active:scale-95"
                >
                  Find a Circle
                </button>
              </div>
            </div>
          </div>

          {/* Bento Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            
            {/* Left Column: Feed & Forums */}
            <div className="lg:col-span-8 space-y-gutter">
              
              {/* Student Spotlight */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-md text-headline-md text-on-surface text-[20px] font-bold">Student Spotlight</h3>
                  <button onClick={() => alert("Opening Spotlights directory...")} className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
                    View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Card 1 */}
                  <div className="glass-card p-6 rounded-2xl relative group cursor-pointer hover:shadow-xl transition-all border border-outline-variant/10">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-secondary">verified</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-secondary/20" 
                        alt="Sarah J." 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk1ahWltSpTxZldEKPTnyI5w7AJ0Omyd-J9d_UPyinaLZ1IUsB-_P122Duody9FIJ-nL4H76vgmh9rTWRHdP1q3idmmB42gi_JPUHdCR2ks5pQ3G_UcKz4UYg61Z7yfjvlpt3adXmnFK4ERkukzl1kwnnunhqlRZgowL_TOJ7nu34iBcHWOBplPQ8cfk2aj73Yoy7iNImviz75W_PDB0BqU9K2xEb2ZrJZmYUWuCJCpAECKlpytJLXNSlZBttoPTXfDOQ33pLmJdrz"
                      />
                      <div>
                        <h4 className="font-label-md text-label-md text-on-surface font-bold text-[14px]">Sarah J.</h4>
                        <p className="text-[11px] text-on-surface-variant font-medium">Landed internship at TechCorp</p>
                      </div>
                    </div>
                    <p className="text-body-md font-body-md text-on-surface-variant italic mb-4 text-[13px] leading-relaxed">
                      "The Career Prep forum here helped me polish my portfolio in just two weeks. Highly recommended!"
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold">UX Design</span>
                      <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold">Portfolio</span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="glass-card p-6 rounded-2xl relative group cursor-pointer hover:shadow-xl transition-all border border-outline-variant/10">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20" 
                        alt="Leo Chen" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZRFFn0KvjYRxdwjL2pJcE2VrqY4c-TBvLOLzaYUdBRtu6qL8bx1BhNuCut7HKXrHVAfBsdaW5WAVJG1_Rk8DXEMVH8CEyyKUVjAU5WeNaEsxIdIQZl36VvNVXW3sT3v6c-EBGXCR5Y-5Phb8YyWAgQcWTKIzqfGM8kWb2bltPSfBZpvzw-HuEgdOERsqGQiNrb-UCQgxKuJMElGXVIa4digiZZNBIB4I4Ux_cTEQ7s5JuRVWkHaws1yIlDi6Dgp-_b-cabZmw2noQ"
                      />
                      <div>
                        <h4 className="font-label-md text-label-md text-on-surface font-bold text-[14px]">Leo Chen</h4>
                        <p className="text-[11px] text-on-surface-variant font-medium">Published AI Research Paper</p>
                      </div>
                    </div>
                    <p className="text-body-md font-body-md text-on-surface-variant italic mb-4 text-[13px] leading-relaxed">
                      "Found my co-author through the CS forum. We collaborated entirely within this platform's AI workspace."
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">Computer Science</span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">AI Ethics</span>
                    </div>
                  </div>

                </div>
              </section>

              {/* Peer Forums */}
              <section className="space-y-4">
                <h3 className="font-headline-md text-headline-md text-on-surface text-[20px] font-bold">Peer Forums</h3>
                <div className="space-y-3">
                  
                  {/* Forum 1: Computer Science */}
                  <div className="flex items-center justify-between p-5 bg-surface rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[28px]">code</span>
                      </div>
                      <div>
                        <h4 className="font-label-md text-label-md text-on-surface font-bold text-[14px]">Computer Science</h4>
                        <p className="text-xs text-on-surface-variant font-medium">2.4k active discussions today</p>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container overflow-hidden">
                        <img className="w-full h-full object-cover" alt="user" src="https://api.dicebear.com/7.x/open-peeps/svg?seed=user1" />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container overflow-hidden">
                        <img className="w-full h-full object-cover" alt="user" src="https://api.dicebear.com/7.x/open-peeps/svg?seed=user2" />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary text-white text-[10px] flex items-center justify-center font-bold">+12</div>
                    </div>
                  </div>

                  {/* Forum 2: UX Design */}
                  <div className="flex items-center justify-between p-5 bg-surface rounded-2xl border border-outline-variant/10 hover:border-secondary/30 transition-all cursor-pointer shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[28px]">palette</span>
                      </div>
                      <div>
                        <h4 className="font-label-md text-label-md text-on-surface font-bold text-[14px]">UX Design</h4>
                        <p className="text-xs text-on-surface-variant font-medium">Case study reviews and feedback</p>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container overflow-hidden">
                        <img className="w-full h-full object-cover" alt="user" src="https://api.dicebear.com/7.x/open-peeps/svg?seed=user3" />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container overflow-hidden">
                        <img className="w-full h-full object-cover" alt="user" src="https://api.dicebear.com/7.x/open-peeps/svg?seed=user4" />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-surface bg-secondary text-white text-[10px] flex items-center justify-center font-bold">+4</div>
                    </div>
                  </div>

                  {/* Forum 3: Career Prep */}
                  <div className="flex items-center justify-between p-5 bg-surface rounded-2xl border border-outline-variant/10 hover:border-tertiary/30 transition-all cursor-pointer shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                        <span className="material-symbols-outlined text-[28px]">work_outline</span>
                      </div>
                      <div>
                        <h4 className="font-label-md text-label-md text-on-surface font-bold text-[14px]">Career Prep</h4>
                        <p className="text-xs text-on-surface-variant font-medium">Mock interviews & resume swaps</p>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container overflow-hidden">
                        <img className="w-full h-full object-cover" alt="user" src="https://api.dicebear.com/7.x/open-peeps/svg?seed=user5" />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container overflow-hidden">
                        <img className="w-full h-full object-cover" alt="user" src="https://api.dicebear.com/7.x/open-peeps/svg?seed=user6" />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-surface bg-tertiary text-white text-[10px] flex items-center justify-center font-bold">+9</div>
                    </div>
                  </div>

                </div>
              </section>

              {/* Dynamic Forum Post List */}
              <div className="glass-card rounded-[24px] p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-bold text-[16px] text-on-surface mb-4">Latest Discussion Activity</h3>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 bg-white/40 border border-outline-variant/10 hover:border-outline-variant/30 rounded-2xl transition-all flex justify-between items-start gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-secondary tracking-wider bg-secondary-container/20 px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                        <h4 className="font-bold text-[14px] text-on-surface pt-1 hover:text-primary cursor-pointer transition-colors leading-tight">
                          {post.title}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant">Posted by {post.author}</p>
                      </div>

                      <div className="flex items-center gap-4 text-on-surface-variant text-[12px] font-bold">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">comment</span>
                          <span>{post.replies}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">favorite</span>
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Chatroom */}
              <div className="glass-card rounded-[24px] p-6 shadow-sm border border-outline-variant/10 flex flex-col h-[400px]">
                <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">chat</span>
                    <h3 className="font-bold text-[16px] text-on-surface">Global Study Chat</h3>
                  </div>
                  <span className="text-[11px] font-bold text-tertiary bg-tertiary/10 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Online Study Room
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-1 mb-4">
                  {chatMessages.map((msg) => {
                    const isMe = msg.sender === user.name;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="text-[11px] font-bold text-on-surface">{msg.sender}</span>
                          <span className="text-[9px] text-on-surface-variant">{msg.time}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-[13px] max-w-[80%] shadow-sm ${
                          isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-container text-on-surface rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendChatMessage} className="relative mt-auto">
                  <input
                    type="text"
                    placeholder="Type message to the study group..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 pr-10 text-[13px] text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-primary hover:scale-110 transition-transform"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </form>
              </div>

              {/* Live Networking Feed */}
              <section className="space-y-4">
                <h3 className="font-headline-md text-headline-md text-on-surface text-[20px] font-bold">Live Networking Feed</h3>
                <div className="space-y-4">
                  
                  {/* Feed 1 */}
                  <div className="p-4 bg-white border border-outline-variant/10 rounded-2xl shadow-sm">
                    <div className="flex gap-3">
                      <img 
                        className="w-10 h-10 rounded-full object-cover" 
                        alt="Elena Rodriguez" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4LLRC3zoo1BQzeEZb_A-PXLuyyW3IxOwbjVOCuYPyDHfGErNT_0wYMjkWzNksLJI-XQSjbliy_hlFPY-XaCzX6l9ro1NDcN8-plMsRkLsshiEsG381dssDIgEZhEsVOk6OVqQuHnKo697Kd43osxWepcYy12ktGqPGhVUDh9HOmGjDC4vSVNRHa5yGUaqUseyDHBRGIg9xpckKAgGkvEc5Eo2pwC6A3rizCLm-VmwZ0TBlSSjiQO0cuSfEgjWlbzcnvXWwYASxojN"
                      />
                      <div className="flex-grow">
                        <p className="text-[13px] text-on-surface"><span className="font-bold">Elena Rodriguez</span> is inviting you to a study group.</p>
                        <p className="text-[11px] text-on-surface-variant mb-3">2 minutes ago • Midterms Prep (Discrete Math)</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => alert("Joining Elena's Session...")}
                            className="bg-primary/10 text-primary font-label-sm text-label-sm px-4 py-1.5 rounded-full hover:bg-primary/20 transition-all text-[12px] font-bold"
                          >
                            Join Session
                          </button>
                          <button 
                            onClick={() => alert("Invite Ignored")}
                            className="text-on-surface-variant font-label-sm text-label-sm px-4 py-1.5 rounded-full hover:bg-surface-container transition-all text-[12px]"
                          >
                            Ignore
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feed 2 */}
                  <div className="p-4 bg-white border border-outline-variant/10 rounded-2xl shadow-sm">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">auto_awesome</span>
                      </div>
                      <div className="flex-grow">
                        <p className="text-[13px] text-on-surface">
                          <span className="font-bold">AI Companion</span> matched you with 3 new potential mentors based on your UX interests.
                        </p>
                        <p className="text-[11px] text-on-surface-variant mb-2">15 minutes ago</p>
                        <button 
                          onClick={() => alert("Loading matched mentors...")}
                          className="text-secondary font-label-sm text-label-sm flex items-center gap-1 hover:underline text-[12px] font-bold"
                        >
                          Show Matches <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

            </div>

            {/* Right Column: Mentorship Circles & Live Events */}
            <div className="lg:col-span-4 space-y-gutter">
              
              {/* Mentorship Circles */}
              <section className="glass-card p-6 rounded-3xl shadow-lg border border-outline-variant/10">
                <h3 className="font-headline-md text-headline-md text-on-surface text-[18px] font-bold mb-4">Mentorship Circles</h3>
                <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-4 text-[11px] font-bold">Ongoing Sessions</p>
                <div className="space-y-6">
                  
                  {/* Circle 1 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          className="w-12 h-12 rounded-full object-cover" 
                          alt="Marcus Thorne" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3JKPiEjCiRu2fenTh_sxi0oqsHufZj0esAnYTlkfp8-6554o8a2VTp8nRigJOXdi-7-ybl_bS91PK80DHE2S1jyfP22QclNpletWAcC2k5txcekAuFVoA0tPDdXanjgg73sqhQ944fmYZNdrbWyV5BAdh5LNlMgLxlk08XRvV5oeJCIMOgWi3ssjsnTpHua84Xpo53CH-XfOCdDbFOL9VDSC0Q1EvuVGt-kPd5PIMWVioLIKpC-9ua1kCwZ_SqKOCC5JZlyvjLit2"
                        />
                        <div>
                          <h5 className="font-label-md text-label-md text-on-surface font-bold text-[14px]">Marcus Thorne</h5>
                          <p className="text-[11px] text-on-surface-variant">Lead Designer at Apex</p>
                        </div>
                      </div>
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <div className="p-3 bg-secondary-container/10 border border-secondary/20 rounded-xl">
                      <p className="text-[12px] font-bold text-secondary mb-1">LIVE Q&A: Systems Thinking</p>
                      <p className="text-[10px] text-on-surface-variant mb-2">Happening now. 42 peers attending.</p>
                      <button 
                        onClick={() => alert("Joining Marcus Thorne's Q&A Live Circle...")}
                        className="w-full bg-secondary text-white py-2 rounded-lg text-xs font-bold active:scale-95 transition-transform"
                      >
                        Enter Circle
                      </button>
                    </div>
                  </div>

                  {/* Circle 2 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img 
                        className="w-12 h-12 rounded-full object-cover" 
                        alt="Dr. Linda Vo" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjvHPFhFhy8rn_fsBU1kO7toAesyzqmXfQgIpHQYtACDrNRevWFbGuNFzdQfwXzjgPDKXRZU7K7PyHAuA_WvE3xuIkDZA1WEmqqGvk91g6ojhtemq0KKg-KKmtPej26Ne0rWR8dZSWHU5-1YVFlHRLFsZFAxuu8pPl1ruIqv3nQSV7jxXyFT85q_zJCYNKgmxvGTOltsHL6zxPRNWjfJfqVBvNq-J4xljwJ3tSKCsouT66taz0Vx5bljFoz05MsNze7dMHcmMeWh4S"
                      />
                      <div>
                        <h5 className="font-label-md text-label-md text-on-surface font-bold text-[14px]">Dr. Linda Vo</h5>
                        <p className="text-[11px] text-on-surface-variant">Senior AI Researcher</p>
                      </div>
                    </div>
                    <div className="p-3 bg-surface-container rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-[14px] text-on-surface-variant">schedule</span>
                        <p className="text-xs font-bold text-on-surface">Ethical AI Frameworks</p>
                      </div>
                      <p className="text-[10px] text-on-surface-variant">Tomorrow, 10:00 AM</p>
                      <button 
                        onClick={() => alert("Reminder set for Dr. Linda Vo's session!")}
                        className="mt-2 text-primary text-xs font-bold hover:underline"
                      >
                        Remind Me
                      </button>
                    </div>
                  </div>

                </div>

                {/* Community Pulse / Mini Stats */}
                <div className="mt-8 pt-6 border-t border-outline-variant/10">
                  <h4 className="font-label-md text-label-md text-on-surface font-bold mb-4 text-[14px]">Community Pulse</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-container-low p-3 rounded-xl text-center">
                      <p className="text-xl font-bold text-primary">12</p>
                      <p className="text-[9px] text-on-surface-variant uppercase font-bold">New Connections</p>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-xl text-center">
                      <p className="text-xl font-bold text-secondary">5</p>
                      <p className="text-[9px] text-on-surface-variant uppercase font-bold">Active Invites</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Weekly Leaderboard */}
              <div className="glass-card rounded-[24px] p-6 shadow-sm border border-outline-variant/10">
                <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4 mb-4">
                  <span className="material-symbols-outlined text-secondary">military_tech</span>
                  <h3 className="font-bold text-[16px] text-on-surface">Weekly Leaderboard</h3>
                </div>

                <div className="space-y-4">
                  {leaderboardData.map((student, idx) => {
                    const rank = idx + 1;
                    const isCurrentUser = student.name.includes('(You)');
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isCurrentUser
                            ? 'bg-secondary/10 border-secondary'
                            : 'bg-white/40 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-[14px] font-black w-5 text-center ${
                            rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-amber-700' : 'text-on-surface-variant'
                          }`}>
                            #{rank}
                          </span>
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-9 h-9 rounded-full object-cover border border-outline-variant/30"
                          />
                          <div>
                            <h4 className="text-[13px] font-bold text-on-surface leading-tight">{student.name}</h4>
                            <p className="text-[11px] text-on-surface-variant">L{student.level} • {student.xp} XP</p>
                          </div>
                        </div>

                        {rank <= 3 && (
                          <span className="material-symbols-outlined text-[20px] text-amber-500 font-bold">
                            trophy
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="font-bold text-[20px] mb-4 text-on-surface">Create Forum Post</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Category</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2.5 text-[13px] text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="UX Design">UX Design</option>
                  <option value="Career Prep">Career Prep</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Topic / Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Help needed with Python lists"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[13px] text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 border border-outline-variant/30 rounded-xl text-[12px] font-bold text-on-surface hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-xl text-[12px] font-bold hover:opacity-90 shadow-sm"
                >
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
