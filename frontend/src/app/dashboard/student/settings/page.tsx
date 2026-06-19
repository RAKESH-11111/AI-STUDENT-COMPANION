'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';
import FloatingAiAssistant from '../../../../components/FloatingAiAssistant';

export default function Settings() {
  const router = useRouter();
  const { user, token, initializeAuth, fetchStudentData } = useStore();

  // Profile fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [academicLevel, setAcademicLevel] = useState('Undergraduate - Year 3');
  const [institution, setInstitution] = useState('');
  const [major, setMajor] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Selected avatar class for shader animations
  const [selectedShader, setSelectedShader] = useState('');

  // AI preferences
  const [aiPersona, setAiPersona] = useState('Empathetic');
  const [dataSharing, setDataSharing] = useState(true);
  const [sessionSummaries, setSessionSummaries] = useState(true);

  // Preference Center & Accessibility
  const [themeMode, setThemeMode] = useState<'Light' | 'Dark'>('Light');
  const [textSize, setTextSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState('English (US)');

  // Security
  const [tfaEnabled, setTfaEnabled] = useState(false);

  // Alerts
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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

  // Load user data into form state once loaded
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setMajor(user.major || 'Cognitive Neuroscience and Artificial Intelligence');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span className="animate-spin material-symbols-outlined text-[48px] text-primary">progress_activity</span>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans">
      {/* Styles local to settings page for animated shaders */}
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(117, 118, 132, 0.1);
        }
        .ai-glow-border {
          position: relative;
        }
        .ai-glow-border::after {
          content: '';
          position: absolute;
          top: -1px; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #24389c, #632ce5);
          border-radius: 3px 3px 0 0;
        }
        .avatar-shader {
          background: linear-gradient(135deg, #3f51b5, #7c4dff, #004e11);
          background-size: 400% 400%;
          animation: settings-gradient-anim 8s ease infinite;
        }
        .avatar-shader-2 {
          background: linear-gradient(45deg, #f8f9fa, #24389c, #bac3ff);
          background-size: 400% 400%;
          animation: settings-gradient-anim 6s ease-in-out infinite;
        }
        .avatar-shader-3 {
          background: linear-gradient(to right, #78dc77, #24389c, #632ce5);
          background-size: 400% 400%;
          animation: settings-gradient-anim 10s linear infinite;
        }
        @keyframes settings-gradient-anim {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <SideNavBar currentTab="Settings" />

      <main className="flex-1 lg:ml-sidebar-width min-h-screen pb-24 flex flex-col">
        <TopNavBar placeholder="Search settings..." />

        {/* Page Content */}
        <div className="p-container-desktop max-w-6xl mx-auto w-full flex-grow">
          
          {/* Header */}
          <div className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Settings</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Manage your account preferences, AI personality, and academic configuration.
              </p>
            </div>
            {showSuccessToast && (
              <div className="bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2.5 rounded-xl font-bold text-[13px] flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top duration-300">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Settings Saved Successfully!
              </div>
            )}
          </div>

          {/* Bento Grid Layout */}
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            
            {/* Profile Settings Card */}
            <section className="md:col-span-8 glass-card rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-headline-md text-headline-md flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">person</span>
                  Profile Settings
                </h2>
                <button type="submit" className="px-6 py-2 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:bg-primary/90 transition-all active:scale-95">
                  Save Changes
                </button>
              </div>

              {/* Change Profile Photo Section */}
              <div className="mb-8 p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <label className="font-label-md text-label-md text-on-surface block mb-4">Change Profile Photo</label>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full border-4 border-secondary overflow-hidden bg-white shadow-md flex items-center justify-center relative">
                      {selectedShader && (
                        <div className={`absolute inset-0 ${selectedShader} opacity-70 mix-blend-overlay`} />
                      )}
                      <img
                        className="w-full h-full object-cover"
                        alt="User Profile"
                        src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full p-1 shadow-sm flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  </div>
                  <div className="h-12 w-[1px] bg-outline-variant/20 mx-2" />
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Animated Avatars</span>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedShader('avatar-shader')}
                        className={`w-14 h-14 rounded-full avatar-shader border-2 transition-all cursor-pointer ring-offset-2 hover:ring-2 ${
                          selectedShader === 'avatar-shader' ? 'border-secondary ring-2 ring-secondary/20' : 'border-transparent'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedShader('avatar-shader-2')}
                        className={`w-14 h-14 rounded-full avatar-shader-2 border-2 transition-all cursor-pointer ring-offset-2 hover:ring-2 ${
                          selectedShader === 'avatar-shader-2' ? 'border-secondary ring-2 ring-secondary/20' : 'border-transparent'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedShader('avatar-shader-3')}
                        className={`w-14 h-14 rounded-full avatar-shader-3 border-2 transition-all cursor-pointer ring-offset-2 hover:ring-2 ${
                          selectedShader === 'avatar-shader-3' ? 'border-secondary ring-2 ring-secondary/20' : 'border-transparent'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedShader('')}
                        className={`w-14 h-14 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-all ${
                          selectedShader === '' ? 'border-primary ring-2 ring-primary/20 bg-surface-container-low' : ''
                        }`}
                        title="Use original image"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant px-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl border border-outline-variant bg-surface/50 px-4 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-on-surface"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant px-1">Academic Level</label>
                  <select
                    value={academicLevel}
                    onChange={(e) => setAcademicLevel(e.target.value)}
                    className="h-12 rounded-xl border border-outline-variant bg-surface/50 px-4 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-on-surface"
                  >
                    <option>Undergraduate - Year 3</option>
                    <option>Postgraduate</option>
                    <option>Doctoral</option>
                    <option>High School</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant px-1">Institution Name</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="h-12 rounded-xl border border-outline-variant bg-surface/50 px-4 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant px-1">Major / Area of Study</label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="h-12 rounded-xl border border-outline-variant bg-surface/50 px-4 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-on-surface"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant px-1">Portfolio &amp; Social Links</label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant">link</span>
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://rakesh.design"
                        className="flex-1 h-12 rounded-xl border border-outline-variant bg-surface/50 px-4 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-on-surface"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant">share</span>
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="LinkedIn URL"
                        className="flex-1 h-12 rounded-xl border border-outline-variant bg-surface/50 px-4 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-on-surface"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Subscription Card */}
            <section className="md:col-span-4 glass-card rounded-3xl p-8 shadow-sm flex flex-col justify-between ai-glow-border overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Current Plan</h2>
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold">ACTIVE</span>
                </div>
                <div className="mb-6">
                  <h3 className="font-headline-lg text-headline-lg text-secondary">Pro Plan</h3>
                  <p className="text-body-md text-on-surface-variant mt-1">Unlimited AI sessions, advanced analytics, and priority support.</p>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-on-surface">
                    <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-label-md font-medium">Advanced Reasoning Model</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface">
                    <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-label-md font-medium">Custom Knowledge Base</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => alert("Billing portal redirecting...")}
                  className="w-full py-3 bg-secondary text-on-secondary rounded-xl font-label-md hover:bg-secondary/90 transition-all active:scale-95 shadow-sm"
                >
                  Manage Billing
                </button>
                <button
                  type="button"
                  onClick={() => alert("Loading payment invoices...")}
                  className="w-full py-3 border border-outline-variant text-on-surface-variant rounded-xl font-label-md hover:bg-surface-container transition-all"
                >
                  View History
                </button>
              </div>
            </section>

            {/* AI Personalization Card */}
            <section className="md:col-span-6 glass-card rounded-3xl p-8 shadow-sm">
              <h2 className="font-headline-md text-headline-md mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">auto_awesome</span>
                AI Personalization
              </h2>
              <div className="space-y-8">
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-4">AI Mentor's Tone</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Empathetic', icon: 'favorite' },
                      { name: 'Direct', icon: 'bolt' },
                      { name: 'Socratic', icon: 'menu_book' }
                    ].map((tone) => (
                      <button
                        key={tone.name}
                        type="button"
                        onClick={() => setAiPersona(tone.name)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          aiPersona === tone.name
                            ? 'border-secondary bg-secondary-container/10 text-on-secondary-container font-bold'
                            : 'border-outline-variant/30 hover:border-secondary/50 text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined">{tone.icon}</span>
                        <span className="text-[12px] font-bold">{tone.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-3 rounded-xl transition-all" style={{ backgroundColor: dataSharing ? 'rgba(124, 77, 255, 0.05)' : 'transparent' }}>
                    <div className="flex flex-col">
                      <span className="text-label-md text-on-surface">Data Sharing Preferences</span>
                      <span className="text-[12px] text-on-surface-variant">Allow AI to learn from your study habits.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={dataSharing}
                        onChange={(e) => setDataSharing(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl transition-all" style={{ backgroundColor: sessionSummaries ? 'rgba(124, 77, 255, 0.05)' : 'transparent' }}>
                    <div className="flex flex-col">
                      <span className="text-label-md text-on-surface">Study Session Summaries</span>
                      <span className="text-[12px] text-on-surface-variant">Receive weekly AI-generated progress reports.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={sessionSummaries}
                        onChange={(e) => setSessionSummaries(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Preference Center & Accessibility */}
            <section className="md:col-span-6 glass-card rounded-3xl p-8 shadow-sm">
              <h2 className="font-headline-md text-headline-md mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">display_settings</span>
                Preference Center
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">dark_mode</span>
                    <span className="text-label-md">Theme Selection</span>
                  </div>
                  <div className="flex bg-surface-container-high rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setThemeMode('Light')}
                      className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-all ${
                        themeMode === 'Light' ? 'bg-white shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeMode('Dark')}
                      className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-all ${
                        themeMode === 'Dark' ? 'bg-white shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-4">Accessibility</label>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-[11px] text-on-surface-variant font-bold uppercase tracking-widest">
                        <span>Text Size</span>
                        <span>Normal ({textSize}%)</span>
                      </div>
                      <input
                        type="range"
                        min="80"
                        max="150"
                        value={textSize}
                        onChange={(e) => setTextSize(Number(e.target.value))}
                        className="w-full h-1.5 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-secondary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-label-md">High Contrast Mode</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={highContrast}
                          onChange={(e) => setHighContrast(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <label className="font-label-md text-label-md text-on-surface block mb-2">Display Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-12 rounded-xl border border-outline-variant bg-surface/50 px-4 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-on-surface"
                  >
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>Hindi</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Account & Security Card */}
            <section className="md:col-span-12 glass-card rounded-3xl p-8 shadow-sm">
              <h2 className="font-headline-md text-headline-md mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-error">security</span>
                Account &amp; Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Authentication</h3>
                  <button
                    type="button"
                    onClick={() => alert("Password reset link sent to your email.")}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:bg-surface-container transition-all text-left"
                  >
                    <div className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined">lock</span>
                      <span className="text-label-md">Change Password</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTfaEnabled(!tfaEnabled)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:bg-surface-container transition-all text-left"
                  >
                    <div className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined">authenticator</span>
                      <span className="text-label-md">Two-Factor Authentication</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${tfaEnabled ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error-container text-on-error-container'}`}>
                      {tfaEnabled ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
                <div className="space-y-6">
                  <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Linked Accounts</h3>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-outline-variant/10">
                        <img className="w-6 h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrQLVE0Wo88k9d71rMfqGzpBHwz8QQAwNOTOdyBF2Xd-LbjMZifTLgjHsEnATf3nAJ6JEvTUGxsB7tp0BDzDhWFRW7zMlAHY4IU0p3_xPY8sEXYjkjzZ1Vc-JofJG-d3y73goQC9ng-16esEG93o2YOVmw-bV4rpQjvtkifi8YE-x-hH-dsmsZyLJglPuUmwc4F5skDiNp3s0GJaPe3EoxV-tvHn3iuRbm_DNQn274xlpQV6j30iFLh_DYqibFj3QOGoS_bHFqyaeV" alt="Google" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-label-md">Google</span>
                        <span className="text-[12px] text-on-surface-variant">{email || 'rakesh.k@gmail.com'}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => alert("Disconnected Google account")} className="text-label-md text-primary font-bold hover:underline">
                      Disconnect
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0077b5] shadow-sm">
                        <img className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNTaq_OJc7pKvBpQiEfJBkE-6TNUtZk40o0ZqqjX9tqk3UxjxvuIsg13USLV_5s_Y6krmLzT4e4FYeGx9L54GQnJhCj8vM8KBImsEfeHjfXQMVDJJkB75HGdxrn2azAq9ZeXpMK1eKDno4i-TuZ6fD43MshYScycQ3Uv3bc-JYQ6d3MZ0k8gzSrOPD0nOth-bDEY8wLmOzBCqrS6a6Hn98K1X1Rs5msZG_71Gaw_HEMV6p6lPb2ocpvzDXXJSMMBruXFsmPKKGPVDQ" alt="LinkedIn" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-label-md">LinkedIn</span>
                        <span className="text-[12px] text-on-surface-variant">Not connected</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => alert("LinkedIn connection initiated")} className="text-label-md text-secondary font-bold hover:underline">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="md:col-span-12 p-8 rounded-3xl border border-error/20 bg-error-container/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-label-md text-label-md text-error">Danger Zone</h3>
                  <p className="text-[12px] text-on-surface-variant">
                    Deleting your account is permanent. All your learning data and AI personalization will be lost.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you absolutely sure you want to permanently delete your account? This action cannot be undone.")) {
                      alert("Account deletion initiated.");
                    }
                  }}
                  className="px-6 py-3 border border-error text-error rounded-xl font-label-md hover:bg-error hover:text-on-error transition-all active:scale-95"
                >
                  Delete Account
                </button>
              </div>
            </section>

          </form>

          {/* Footer */}
          <footer className="mt-12 py-8 px-container-desktop border-t border-outline-variant/10 text-center">
            <p className="text-[12px] text-on-surface-variant">© 2024 AI COMPANION. Built with empathy for modern learners.</p>
          </footer>

        </div>
      </main>
      <FloatingAiAssistant />
    </div>
  );
}
