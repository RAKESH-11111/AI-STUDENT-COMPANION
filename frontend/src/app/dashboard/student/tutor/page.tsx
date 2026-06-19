'use client';
 
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';
import FloatingAiAssistant from '../../../../components/FloatingAiAssistant';
 
export default function AITutor() {
  const router = useRouter();
  const { user, token, initializeAuth, fetchStudentData } = useStore();
 
  const [mentors, setMentors] = useState([
    {
      name: "Dr. Arnab Sen",
      role: "Senior Product Manager at Google",
      badge: "Google Alumni",
      badgeColor: "bg-primary/10 text-primary",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtmG4RPKeJj1Nm8FUF5unVFld41aGtBLEhfaQESkKRF3TXBfik0gTnGrGvs0XwDA535CZUvc1nleW4oKoRXD2qSFSQ72iQICXjXKKU4B9JIgg6h2X6DdZx0aTJR-xRDxqO76_XHp9FSSO73MFRdoha_Nsmipu6wOhx4Ysg7TTVbfRrk7C0K-popL_ZryKlWmditr605-RALekuVsN-PYDS5VhtB0bAflf9nUvSU_pSYWF9aeL3gaXzmNSkSB5zBPn7w8K7jaVprS1Y",
      skills: ["Product Strategy", "AI Ethics", "Tech Leadership"],
      isHot: true
    },
    {
      name: "Sarah Jenkins",
      role: "Principal Engineer at Microsoft",
      badge: "Industry Expert",
      badgeColor: "bg-secondary/10 text-secondary",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG_uJuBjOEMmeqWh62MJxBxt1DzLXcRk0-PclbKt_DHdYE2OLlmnRF4n_5d3pvp9FX7vNfoqzWPt-LR0RZjHD3UV9Wsoc_GxoF8XzEVUdwDn9b45mF7GGQs9G9eZKsJbL8b27K7jXGY_Qn-bQeWMRGjWp8DDA6RbXC6cyiXVTkGwY9nA7lNx-cGSbngDD-T2F_6RTtO8DFoins8Xuufd-Vd2Ny_NaA19UNpeKKfKI8D_vmT2wn0ayCVtUtHMDs2H6NyJQ_8AuN0-XB",
      skills: ["Cloud Architecture", "Distributed Systems"],
      isHot: false
    },
    {
      name: "Michael Chen",
      role: "Design Director at Adobe",
      badge: "Founding Partner",
      badgeColor: "bg-tertiary-container/10 text-tertiary-container",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAa3ENsngOWEm-mnzgnFHJWubXxDibFwdiKikd66yd5hgLpybX1kckz8ht-gMVTOqAsr_yTkuItaCXotCIHm-VZuXdAhUJgxbr_t_uoGr8NYzb5RH_xpFaX3h_HOsVpnUMfwGyodrru3NBe66gJZZ_RcY3E5TF9Cogm034y2Ni0am2gX8vtC_FVCyk_H_lDMSkTPAm2iD-Nn_FkUutHPjPcWIBNF6lniLDvuJav1m6kn4-wYSHfkF5vjLQhXwjPvnsD4nB3JSKC8l46",
      skills: ["UX Design", "Brand Vision"],
      isHot: false,
      isGhostBtn: true
    },
    {
      name: "Elena Rodriguez",
      role: "Lead AI Researcher at DeepMind",
      badge: "Research Head",
      badgeColor: "bg-primary/10 text-primary",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBExjkA2XNOBNgQ_UUOn4iulv8FXlmwvhQoi00SR1UdAULZCpHuaPQSZTnSQ1XlzhUBY2Bb4Xfg9DbBfN4HRgqhJpEcYu-rBDghglalQtthw5CFBJiRRBIRdMkoIVmGGu6a7icizZnF7D4LrDyygIPh6_rcHuWGaBXC1XnN8m-tt-8UUTJNbZy_U1P2_G9zUwnre6zKq_kXqL_p-N7ruCTLXV4KNJZsalhuM5_Bx-rZWegYcSzV0vHqxJ_AEP7qbZGGAPDxIJlnNspG",
      skills: ["Deep Learning", "PyTorch"],
      isHot: true
    }
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
 
  const handleConnect = (mentorName: string) => {
    alert(`Requesting mentorship sync with ${mentorName}. Chat requests sent!`);
  };
 
  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans selection:bg-secondary-container">
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(117, 118, 132, 0.1);
        }
        .ai-gradient-border {
          position: relative;
          border-radius: 1rem;
        }
        .ai-gradient-border::after {
          content: '';
          position: absolute;
          top: -1px; left: -1px; right: -1px; height: 3px;
          background: linear-gradient(90deg, #7c4dff, #24389c);
          border-radius: 1rem 1rem 0 0;
          z-index: 1;
        }
        .mentor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(36, 56, 156, 0.08);
        }
      `}</style>
 
      <SideNavBar currentTab="AI Tutor" />
 
      <main className="flex-grow lg:ml-sidebar-width min-h-screen flex flex-col">
        <TopNavBar placeholder="Search mentors, skills, or alumni..." />
 
        {/* Page Content */}
        <div className="p-container-padding-mobile md:p-container-padding-desktop space-y-gutter flex-grow">
          
          {/* Hero / Welcome Section */}
          <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-primary-container text-on-primary-container">
            <div className="relative z-10 max-w-2xl">
              <h2 className="font-headline-xl text-headline-xl mb-4 text-white">Connect with Success</h2>
              <p className="font-body-lg text-body-lg text-white/80 mb-8">
                Access a global network of alumni and industry leaders. From Microsoft to early-stage startups, find the guidance you need to navigate your career path.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => alert("Searching for mentors...")} className="px-6 py-3 bg-white text-primary rounded-xl font-label-md shadow-lg hover:shadow-xl transition-all">
                  Find a Mentor
                </button>
                <button onClick={() => alert("Browsing career talks...")} className="px-6 py-3 bg-primary/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-label-md hover:bg-primary/30 transition-all">
                  Browse Career Talks
                </button>
              </div>
            </div>
          </section>
 
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            
            {/* Directory Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary">Top Industry Mentors</h3>
                  <p className="text-on-surface-variant text-[14px]">Recommended based on your AI Career Path</p>
                </div>
                <button onClick={() => alert("Loading full directory...")} className="text-secondary font-label-md hover:underline">
                  View All
                </button>
              </div>
 
              {/* Mentors Grid (Bento Style) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mentors.map((mentor, idx) => (
                  <div 
                    key={idx} 
                    className={`mentor-card glass-card rounded-[2rem] p-6 transition-all duration-300 ${
                      mentor.isHot ? 'ai-gradient-border' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/10">
                        <img 
                          className="w-full h-full object-cover" 
                          src={mentor.avatar} 
                          alt={mentor.name} 
                        />
                      </div>
                      <div className={`px-3 py-1 rounded-full font-label-sm ${mentor.badgeColor}`}>
                        {mentor.badge}
                      </div>
                    </div>
 
                    <h4 className="font-headline-md text-[20px] mb-1 text-on-surface font-bold">
                      {mentor.name}
                    </h4>
                    <p className="text-on-surface-variant text-label-md mb-3">
                      {mentor.role}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {mentor.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="px-2.5 py-1 bg-surface-container rounded text-[12px] font-semibold text-on-surface-variant">
                          {skill}
                        </span>
                      ))}
                    </div>
 
                    {mentor.isGhostBtn ? (
                      <button 
                        onClick={() => handleConnect(mentor.name)}
                        className="w-full py-3 border-2 border-primary text-primary rounded-xl font-label-md hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">mail</span>
                        Request Mentorship
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleConnect(mentor.name)}
                        className={`w-full py-3 text-white rounded-xl font-label-md hover:opacity-90 transition-all flex items-center justify-center gap-2 ${
                          mentor.badge.includes("Industry") ? 'bg-secondary' : 'bg-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">mail</span>
                        Request Mentorship
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
 
            {/* Sidebar Content (Webinars & Talks) */}
            <aside className="space-y-gutter">
              
              {/* Upcoming Events */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-headline-md text-primary text-[20px]">Upcoming Events</h3>
                  <span className="material-symbols-outlined text-secondary">event</span>
                </div>
                
                <div className="space-y-6">
                  {/* Event 1 */}
                  <div onClick={() => alert("RSVPing for FinTech Webinar...")} className="group cursor-pointer">
                    <div className="flex gap-4 items-start">
                      <div className="bg-secondary-fixed text-on-secondary-fixed w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold">
                        <span className="text-[14px]">14</span>
                        <span className="text-[10px] uppercase">OCT</span>
                      </div>
                      <div>
                        <h4 className="font-label-md group-hover:text-secondary transition-colors leading-tight">
                          Future of Generative AI in FinTech
                        </h4>
                        <p className="text-label-sm text-on-surface-variant mt-1">4:00 PM • Live Webinar</p>
                      </div>
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-3/4 rounded-full"></div>
                    </div>
                    <p className="mt-1 text-[10px] text-right text-on-surface-variant font-semibold">75% Seats Filled</p>
                  </div>
 
                  {/* Event 2 */}
                  <div className="group cursor-pointer">
                    <div className="flex gap-4 items-start">
                      <div className="bg-primary-fixed text-on-primary-fixed w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold">
                        <span className="text-[14px]">18</span>
                        <span className="text-[10px] uppercase">OCT</span>
                      </div>
                      <div>
                        <h4 className="font-label-md group-hover:text-primary transition-colors leading-tight">
                          Navigating Graduate School Admissions
                        </h4>
                        <p className="text-label-sm text-on-surface-variant mt-1">10:00 AM • Career Talk</p>
                      </div>
                    </div>
                    <button onClick={() => alert("Reminder set successfully!")} className="mt-4 w-full py-2 bg-surface-container-high hover:bg-surface-variant text-on-surface rounded-lg text-label-sm font-bold transition-all">
                      Remind Me
                    </button>
                  </div>
 
                  {/* Event 3 */}
                  <div onClick={() => alert("RSVPing for Personal Branding Workshop...")} className="group cursor-pointer">
                    <div className="flex gap-4 items-start">
                      <div className="bg-tertiary-fixed text-on-tertiary-fixed w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold">
                        <span className="text-[14px]">22</span>
                        <span className="text-[10px] uppercase">OCT</span>
                      </div>
                      <div>
                        <h4 className="font-label-md group-hover:text-tertiary transition-colors leading-tight">
                          Personal Branding for Designers
                        </h4>
                        <p className="text-label-sm text-on-surface-variant mt-1">2:30 PM • Workshop</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
 
              {/* AI Suggestion Widget */}
              <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-secondary to-primary-container text-white shadow-xl">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    <span className="font-label-sm uppercase tracking-wider font-bold">AI Suggestion</span>
                  </div>
                  <p className="font-body-md mb-6 italic leading-relaxed text-[15px]">
                    "Based on your interest in Data Science, I recommend reaching out to Elena Rodriguez. She's mentoring 3 students currently and has high response rates."
                  </p>
                  <button onClick={() => handleConnect("Elena Rodriguez")} className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-label-md transition-all border border-white/30 text-white font-bold">
                    Connect Now
                  </button>
                </div>
              </div>
 
            </aside>
          </div>
 
        </div>
      </main>
 
      <FloatingAiAssistant />
    </div>
  );
}
