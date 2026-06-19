'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';
import FloatingAiAssistant from '../../../../components/FloatingAiAssistant';

export default function ResumeBuilder() {
  const router = useRouter();
  const { user, token, initializeAuth, fetchStudentData } = useStore();

  // Multi-step progress
  const [currentStep, setCurrentStep] = useState(3);

  // Form Fields State
  const [roleTitle, setRoleTitle] = useState('Frontend Developer Intern');
  const [companyName, setCompanyName] = useState('TechNova Solutions');
  const [bulletPoint1, setBulletPoint1] = useState(
    'Developed responsive web components using React and Tailwind CSS for the main customer dashboard.'
  );
  const [bulletPoint2, setBulletPoint2] = useState(
    'Helped the team with debugging and fixing various UI bugs reported by users.'
  );
  const [skills, setSkills] = useState(['React.js', 'Tailwind CSS', 'TypeScript', 'Node.js']);

  // AI Suggestions
  const [showSuggestion, setShowSuggestion] = useState(true);
  const aiSuggestionText =
    'Spearheaded the development of 15+ reusable React components, improving dashboard load speed by 20% and ensuring 100% responsiveness across devices.';

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

  const handleApplyAiSuggestion = () => {
    setBulletPoint1(aiSuggestionText);
    setShowSuggestion(false);
  };

  const handleAddSkill = () => {
    const newSkill = prompt('Enter a new skill:');
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setSkills(skills.filter((s) => s !== skillToDelete));
  };

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex font-sans overflow-hidden h-screen">
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(197, 197, 212, 0.2);
        }
        .ai-gradient-border {
          position: relative;
          border-radius: 1rem;
        }
        .ai-gradient-border::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(to right, #632ce5, #24389c);
          border-radius: inherit;
          z-index: -1;
          opacity: 0.3;
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
      `}</style>

      <SideNavBar currentTab="Career Path" />

      <main className="flex-grow lg:ml-sidebar-width min-h-screen flex flex-col h-full bg-surface-container-lowest">
        <TopNavBar placeholder="Search tasks..." />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-gutter flex gap-gutter">
          {/* Left Side: Multi-step Form & Editor */}
          <section className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Resume &amp; Portfolio Builder</h2>
                <p className="text-on-surface-variant font-medium text-sm">Craft a professional career narrative with AI guidance.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => alert("Draft saved successfully!")}
                  className="bg-surface border border-outline text-on-surface px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-surface-container-high transition-all text-label-md"
                >
                  <span className="material-symbols-outlined text-base">save</span> Save Draft
                </button>
                <button 
                  onClick={() => alert("Exporting resume to PDF...")}
                  className="bg-primary text-on-primary px-6 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all text-label-md shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-base">picture_as_pdf</span> Export to PDF
                </button>
              </div>
            </div>

            {/* Steps Progress */}
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col gap-2">
                <div className={`h-1.5 w-full rounded-full ${currentStep >= 1 ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
                <span className={`text-[12px] font-bold ${currentStep >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>1. Personal Info</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className={`h-1.5 w-full rounded-full ${currentStep >= 2 ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
                <span className={`text-[12px] font-bold ${currentStep >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>2. Experience</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: currentStep > 3 ? '100%' : currentStep === 3 ? '50%' : '0%' }}></div>
                </div>
                <span className={`text-[12px] font-bold ${currentStep >= 3 ? 'text-on-surface' : 'text-on-surface-variant'}`}>3. Projects</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className={`h-1.5 w-full rounded-full ${currentStep >= 4 ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
                <span className={`text-[12px] font-bold ${currentStep >= 4 ? 'text-primary' : 'text-on-surface-variant'}`}>4. AI Review</span>
              </div>
            </div>

            {/* Form Section */}
            <div className="glass-card p-6 rounded-2xl flex flex-col gap-8 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Experience &amp; Projects</h3>
                  <button 
                    onClick={() => alert("Add Entry modal or form template loaded.")}
                    className="text-primary font-label-md flex items-center gap-1 hover:underline text-[14px]"
                  >
                    <span className="material-symbols-outlined text-base">add_circle</span> Add New Entry
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Project Entry 1 */}
                  <div className="p-5 border border-outline-variant/30 rounded-xl hover:border-primary/30 transition-all bg-white/50">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-label-sm font-bold text-on-surface-variant">Title / Role</label>
                        <input 
                          className="w-full bg-surface-container-low border-none rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 text-body-md" 
                          type="text" 
                          value={roleTitle}
                          onChange={(e) => setRoleTitle(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-label-sm font-bold text-on-surface-variant">Company / Organization</label>
                        <input 
                          className="w-full bg-surface-container-low border-none rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 text-body-md" 
                          type="text" 
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-label-sm font-bold text-on-surface-variant">Bullet Points</label>
                      <div className="space-y-3">
                        <div className="group relative">
                          <textarea 
                            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 text-body-md resize-none" 
                            rows={2}
                            value={bulletPoint1}
                            onChange={(e) => setBulletPoint1(e.target.value)}
                          />

                          {/* AI Suggestion Bubble */}
                          {showSuggestion && (
                            <div className="mt-2 p-3 bg-secondary-fixed/30 rounded-xl border border-secondary-container/20 flex items-start gap-3 animate-in fade-in duration-500">
                              <span className="material-symbols-outlined text-secondary text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                                auto_awesome
                              </span>
                              <div className="flex-1">
                                <p className="text-label-sm text-secondary-fixed-dim font-bold mb-1">AI Suggestion</p>
                                <p className="text-label-md text-on-secondary-fixed-variant leading-relaxed italic">
                                  "{aiSuggestionText}"
                                </p>
                                <div className="mt-2 flex gap-3">
                                  <button onClick={handleApplyAiSuggestion} className="text-primary font-bold text-label-sm hover:underline text-[12px]">
                                    Apply Change
                                  </button>
                                  <button onClick={() => setShowSuggestion(false)} className="text-on-surface-variant font-bold text-label-sm hover:underline text-[12px]">
                                    Ignore
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <textarea 
                            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 text-body-md resize-none" 
                            rows={2}
                            value={bulletPoint2}
                            onChange={(e) => setBulletPoint2(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Skills Chips */}
              <div>
                <h3 className="font-label-md font-bold text-on-surface mb-3">Key Skills &amp; Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-label-md border border-primary/20 flex items-center gap-2 font-medium text-[13px]">
                      {skill} 
                      <span 
                        onClick={() => handleDeleteSkill(skill)}
                        className="material-symbols-outlined text-sm cursor-pointer hover:text-error"
                      >
                        close
                      </span>
                    </span>
                  ))}
                  <button 
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-surface-container-high text-on-surface-variant rounded-full text-label-md border border-outline-variant/30 hover:bg-surface-variant transition-colors flex items-center gap-1 font-medium text-[13px]"
                  >
                    <span className="material-symbols-outlined text-sm">add</span> Add Skill
                  </button>
                </div>
              </div>

            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={handlePrevStep}
                className="text-on-surface font-label-md flex items-center gap-2 px-6 py-3 hover:bg-surface-container rounded-xl transition-all font-medium text-[14px]"
              >
                <span className="material-symbols-outlined">arrow_back</span> Back to Experience
              </button>
              <button 
                onClick={handleNextStep}
                className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-secondary/20 text-[14px]"
              >
                Continue to Projects <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Right Side: Live Preview */}
          <aside className="w-[450px] flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider text-[12px]">Live Preview</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert("Zooming preview...")}
                  className="material-symbols-outlined p-1.5 bg-surface rounded-md border border-outline-variant/30 text-on-surface-variant hover:text-primary" 
                  title="Zoom In"
                >
                  zoom_in
                </button>
                <button 
                  onClick={() => alert("Downloading source files...")}
                  className="material-symbols-outlined p-1.5 bg-surface rounded-md border border-outline-variant/30 text-on-surface-variant hover:text-primary" 
                  title="Download Source"
                >
                  file_download
                </button>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col scale-[0.98] origin-top transition-transform hover:scale-100">
              {/* Resume Template */}
              <div className="bg-[#24389c] p-8 text-white">
                <h2 className="text-2xl font-bold tracking-tight mb-1 uppercase">{user.name || 'RAKESH KUMAR'}</h2>
                <p className="text-primary-fixed text-sm font-medium mb-4">{roleTitle} &amp; {user.major || 'Computer Science Student'}</p>
                <div className="flex flex-wrap gap-4 text-[10px] opacity-90">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">mail</span> {user.email || 'rakesh.dev@example.com'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">call</span> +1 (555) 012-3456
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">location_on</span> San Francisco, CA
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col gap-6 text-[12px] text-on-surface overflow-y-auto custom-scrollbar">
                <section>
                  <h4 className="font-bold text-[#24389c] border-b border-outline-variant/30 pb-1 mb-3 uppercase tracking-widest text-[10px]">Education</h4>
                  <div className="mb-2">
                    <div className="flex justify-between font-bold">
                      <span className="">B.S. in Computer Science</span>
                      <span className="">2021 - Present</span>
                    </div>
                    <div className="text-on-surface-variant italic">State University of Technology</div>
                    <p className="mt-1">GPA: 3.9/4.0 | Dean's List (4 Semesters)</p>
                  </div>
                </section>

                <section>
                  <h4 className="font-bold text-[#24389c] border-b border-outline-variant/30 pb-1 mb-3 uppercase tracking-widest text-[10px]">Experience</h4>
                  <div className="mb-4">
                    <div className="flex justify-between font-bold">
                      <span className="">{roleTitle}</span>
                      <span className="">June 2023 - Aug 2023</span>
                    </div>
                    <div className="text-on-surface-variant italic">{companyName}</div>
                    <ul className="list-disc ml-4 mt-2 space-y-1">
                      <li className="font-medium text-secondary">{bulletPoint1}</li>
                      <li>{bulletPoint2}</li>
                      <li>Collaborated with design team to implement responsive UI/UX using Tailwind CSS.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h4 className="font-bold text-[#24389c] border-b border-outline-variant/30 pb-1 mb-3 uppercase tracking-widest text-[10px]">Projects</h4>
                  <div className="mb-4">
                    <div className="flex justify-between font-bold">
                      <span className="">AI Study Companion App</span>
                      <span className="">Personal Project</span>
                    </div>
                    <p className="mt-1">Built a full-stack learning platform using Next.js, OpenAI API, and PostgreSQL. Features real-time AI tutoring and smart schedule optimization.</p>
                  </div>
                </section>

                <section>
                  <h4 className="font-bold text-[#24389c] border-b border-outline-variant/30 pb-1 mb-3 uppercase tracking-widest text-[10px]">Skills</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="">
                      <strong className="text-on-surface">Languages:</strong> JavaScript (ES6+), TypeScript, Python, HTML5, CSS3
                    </span>
                    <span className="">
                      <strong className="text-on-surface">Frameworks: </strong> 
                      {skills.join(', ')}
                    </span>
                  </div>
                </section>
              </div>

              <div className="p-4 bg-surface-container-low border-t border-outline-variant/10 text-center">
                <p className="text-[10px] text-on-surface-variant font-medium">Template: Modern Executive • Theme: EduAI Indigo</p>
              </div>
            </div>

            {/* Template Selector */}
            <div className="glass-card p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-container/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">palette</span>
                </div>
                <div>
                  <p className="text-label-md font-bold text-on-surface text-[14px]">Modern Minimalist</p>
                  <p className="text-[10px] text-on-surface-variant">Click to change theme</p>
                </div>
              </div>
              <button 
                onClick={() => alert("Theme switching is a Pro feature!")}
                className="material-symbols-outlined text-on-surface-variant hover:text-primary"
              >
                chevron_right
              </button>
            </div>
          </aside>
        </div>
      </main>

      <FloatingAiAssistant />
    </div>
  );
}
