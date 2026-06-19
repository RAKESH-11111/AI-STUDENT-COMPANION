'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  useEffect(() => {
    // Smooth parallax / hover animation for hero image area
    const handleMouseMove = (e: MouseEvent) => {
      const moveX = (e.clientX - window.innerWidth / 2) / 50;
      const moveY = (e.clientY - window.innerHeight / 2) / 50;
      const heroImg = document.getElementById('hero-interactive-card');
      if (heroImg) {
        heroImg.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Styles local to landing page */}
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .ai-gradient-text {
          background: linear-gradient(135deg, #24389c 0%, #632ce5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ai-border-glow {
          position: relative;
        }
        .ai-border-glow::after {
          content: '';
          position: absolute;
          top: -1px; left: -1px; right: -1px; bottom: -1px;
          background: linear-gradient(45deg, #7c4dff, transparent, #24389c);
          z-index: -1;
          border-radius: inherit;
          opacity: 0.3;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* TopNavBar */}
      <header className="bg-surface/80 dark:bg-surface-container-lowest/80 backdrop-blur-md shadow-sm border-b border-outline-variant/10 sticky top-0 z-50">
        <nav className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-black text-[22px] md:text-[26px] text-primary dark:text-primary-fixed-dim tracking-tight">
              Rakesh
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/login" className="text-secondary font-bold border-b-2 border-secondary pb-1 text-[14px]">
                Explore
              </Link>
              <Link href="/login" className="text-on-surface-variant hover:text-primary transition-colors text-[14px] font-semibold">
                Courses
              </Link>
              <Link href="/login" className="text-on-surface-variant hover:text-primary transition-colors text-[14px] font-semibold">
                Mentors
              </Link>
              <Link href="/login" className="text-on-surface-variant hover:text-primary transition-colors text-[14px] font-semibold">
                Career
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="p-2 text-on-surface-variant hover:bg-surface-container-high/50 rounded-full transition-all duration-300 flex"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link
              href="/login"
              className="p-2 text-on-surface-variant hover:bg-surface-container-high/50 rounded-full transition-all duration-300 flex"
            >
              <span className="material-symbols-outlined">settings</span>
            </Link>
            <Link href="/login" className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant/30 ml-2 block">
              <img
                className="w-full h-full object-cover"
                alt="User Profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVq0SBP0AIQnbpnNNL-aiipmWTx2GDHi6EJhL0kNTEAJwLCKMMhkbdJmVIsIJTUNYdnrDt5NiZtc9nlVZI3CNYv_DS8JsCm2cmrU5i4c_v3-a9mi3XQe1jMgPNZy6wzWIi3gkKLzreKLy5liD2nT-QBaLB5FyxLnm7GL0Xj8EW35PeLchfpiNuXJT-nbUy-yZ3QYsDZ5GXJsPCRQVak5gqnvEJESCxBdeHPGJTqkPfvt9xuM9kcds7spzBaUL6K7gztlcQhi4imwB5"
              />
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-container-padding-mobile md:px-container-padding-desktop overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-3/5 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container/10 border border-primary-container/20 rounded-full text-primary text-[14px] font-semibold">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span>Empowering 50,000+ Students Worldwide</span>
              </div>
              <h1 className="font-headline-xl text-[44px] md:text-[56px] text-on-surface font-extrabold leading-tight tracking-tight">
                Your Personalized <span className="ai-gradient-text">AI Career Compass</span>
              </h1>
              <p className="text-[18px] text-on-surface-variant max-w-2xl leading-relaxed">
                Navigating the transition from freshman to professional shouldn't be guesswork. AI Companion maps your unique 4-year journey, aligning your skills with the future of work.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/login"
                  className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform duration-150 flex items-center gap-2"
                >
                  Start Your Journey
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-surface border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-container-high transition-colors"
                >
                  Watch Demo
                </Link>
              </div>
              <div className="pt-12 grid grid-cols-3 gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-bold text-on-surface-variant text-[14px]">
                  <span className="material-symbols-outlined">account_balance</span>
                  <span>MIT Partnered</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-on-surface-variant text-[14px]">
                  <span className="material-symbols-outlined">verified</span>
                  <span>Ivy League Certified</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-on-surface-variant text-[14px]">
                  <span className="material-symbols-outlined">workspace_premium</span>
                  <span>Global Impact Award</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visuals */}
            <div className="w-full lg:w-2/5 relative flex justify-center">
              <div id="hero-interactive-card" className="relative z-10 animate-float transition-transform duration-200">
                <div className="glass-card p-6 rounded-3xl shadow-2xl ai-border-glow max-w-sm md:max-w-md">
                  <img
                    className="w-full rounded-2xl"
                    alt="Futuristic dashboard preview"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGNZ1uapmVrulQCxLnOM3boUromtaZV0pTHe5m2chIL7P6pYonzIvQ5ynGz-7A14X4TS3M26FWP56rbpefT7nOep6bMDjuAmvyNk6SGvk-6w9Cl1zxEB7rupv1RXlOAcbgSrKQx0Mo-SPzh86MnNDdYs0izXtpyer46stebqf87H5VVf6JwSpG3EYa0yeazMohoigP_ZMxq-qMuO4lBmgbZli6qABAcZyXEvYRvx4PJIw2cp3ydLbeid5CitMxJvCggVO3r4aZc5uG"
                  />
                </div>
                {/* Floating Insight Card */}
                <div className="absolute -bottom-6 -left-6 md:-left-12 glass-card p-4 rounded-2xl shadow-xl border-l-4 border-secondary max-w-[200px]">
                  <p className="text-[12px] font-bold text-secondary mb-1">AI Recommendation</p>
                  <p className="text-[13px] text-on-surface font-bold leading-tight">
                    "Enroll in Cloud Architecture to boost employability by 24%"
                  </p>
                </div>
              </div>
              {/* Decorative Blur Orbs */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary/10 blur-3xl rounded-full" />
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold">
                Built for Your Academic Evolution
              </h2>
              <p className="text-body-md text-on-surface-variant max-w-xl mx-auto">
                From course selection to first paycheck, our AI ecosystem handles the heavy lifting.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {/* Feature 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px]">explore</span>
                </div>
                <h3 className="font-bold text-[20px] text-on-surface mb-3">AI Career Navigator</h3>
                <p className="text-on-surface-variant text-[14px] leading-relaxed">
                  Real-time market trend analysis to guide your major and minor choices.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px]">support_agent</span>
                </div>
                <h3 className="font-bold text-[20px] text-on-surface mb-3">24/7 AI Mentor</h3>
                <p className="text-on-surface-variant text-[14px] leading-relaxed">
                  Empathetic, intelligent support for both academic queries and emotional well-being.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-tertiary-fixed-dim/20 rounded-2xl flex items-center justify-center text-tertiary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px]">event_note</span>
                </div>
                <h3 className="font-bold text-[20px] text-on-surface mb-3">Learning Planner</h3>
                <p className="text-on-surface-variant text-[14px] leading-relaxed">
                  Personalized study schedules that adapt to your pace and life commitments.
                </p>
              </div>
              {/* Feature 4 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary-container/10 rounded-2xl flex items-center justify-center text-primary-container mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px]">groups</span>
                </div>
                <h3 className="font-bold text-[20px] text-on-surface mb-3">Expert Connect</h3>
                <p className="text-on-surface-variant text-[14px] leading-relaxed">
                  Direct pipeline to alumni and industry professionals in your dream fields.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof & Testimonials Section */}
        <section className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2 space-y-6">
                <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold">
                  Trusted by Global Institutions
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-surface-container-high rounded-2xl flex items-center justify-center border border-outline-variant/5">
                    <span className="font-extrabold text-on-surface-variant uppercase tracking-widest text-[13px]">Stanford Univ.</span>
                  </div>
                  <div className="p-6 bg-surface-container-high rounded-2xl flex items-center justify-center border border-outline-variant/5">
                    <span className="font-extrabold text-on-surface-variant uppercase tracking-widest text-[13px]">IIT Madras</span>
                  </div>
                  <div className="p-6 bg-surface-container-high rounded-2xl flex items-center justify-center border border-outline-variant/5">
                    <span className="font-extrabold text-on-surface-variant uppercase tracking-widest text-[13px]">Oxford Uni</span>
                  </div>
                  <div className="p-6 bg-surface-container-high rounded-2xl flex items-center justify-center border border-outline-variant/5">
                    <span className="font-extrabold text-on-surface-variant uppercase tracking-widest text-[13px]">MIT</span>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-8">
                <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold">
                  Student Success Stories
                </h2>
                <div className="glass-card p-8 rounded-3xl shadow-sm relative border-t-4 border-primary">
                  <span className="material-symbols-outlined text-[48px] text-primary/20 absolute top-4 right-4">format_quote</span>
                  <p className="text-[16px] text-on-surface italic mb-6 leading-relaxed">
                    "AI Companion didn't just tell me what to study; it understood my passion for sustainable tech and connected me with an internship at Tesla that I never would have found on my own."
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      className="w-12 h-12 rounded-full object-cover"
                      alt="Student Aarav"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7TgBT-EDHlGzYdE7iQmUpfzHMzmpT7BjcnN4_-sJHCJ_EDjSJauyiScCGfxNhZYqfhpKUUPpjLNn8DjURieM1ibzQXObydwu03WOLGbQVRLJ8wspxVsLgkbg7ZuNdR5MYIaI8k771Pn2HZtS-kE79bFZ2UWCSvtmN2xS83hFEP2bjI3j01W26J_ASIyCUV3fFIG3JtrfBWzMMvooJugyzSfdlgt5dsw87JiRi2p8DnSfPpg4oqRBgOC4B8yXhX4Z5E6805AygJo20"
                    />
                    <div>
                      <h4 className="font-bold text-on-surface text-[14px]">Aarav Sharma</h4>
                      <p className="text-[12px] text-on-surface-variant">Systems Engineer @ Tesla</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-container-padding-mobile">
          <div className="max-w-5xl mx-auto rounded-[40px] overflow-hidden relative p-12 md:p-20 text-center bg-primary text-on-primary shadow-xl">
            <div className="relative z-10 space-y-8">
              <h2 className="font-headline-xl text-[36px] md:text-[48px] text-white font-extrabold leading-tight">
                Ready to claim your future?
              </h2>
              <p className="text-[18px] text-on-primary-container max-w-2xl mx-auto leading-relaxed">
                Join the next generation of students using AI to build meaningful, high-impact careers.
              </p>
              <Link
                href="/login"
                className="px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:bg-primary-container hover:text-white transition-all hover:scale-105 inline-flex items-center gap-3 shadow-md"
              >
                Get Started for Free
                <span className="material-symbols-outlined">rocket_launch</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant/20 w-full py-12 px-container-padding-desktop mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="space-y-4">
            <h3 className="font-headline-md text-headline-md font-extrabold text-primary dark:text-primary-fixed-dim">
              Rakesh
            </h3>
            <p className="text-[14px] text-on-surface-variant max-w-xs leading-relaxed">
              Empowering the world's students through empathetic, expert AI guidance.
            </p>
            <div className="flex gap-4">
              <a className="p-2 bg-on-surface/5 rounded-full hover:bg-primary/10 transition-colors flex" href="#">
                <span className="material-symbols-outlined text-[20px]">public</span>
              </a>
              <a className="p-2 bg-on-surface/5 rounded-full hover:bg-primary/10 transition-colors flex" href="#">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="text-[13px] font-bold text-on-surface uppercase tracking-wider">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a className="text-on-surface-variant hover:text-primary transition-all text-[14px]" href="#">
                    University Partners
                  </a>
                </li>
                <li>
                  <a className="text-on-surface-variant hover:text-primary transition-all text-[14px]" href="#">
                    Faculty Portal
                  </a>
                </li>
                <li>
                  <a className="text-on-surface-variant hover:text-primary transition-all text-[14px]" href="#">
                    AI Insights
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[13px] font-bold text-on-surface uppercase tracking-wider">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a className="text-on-surface-variant hover:text-primary transition-all text-[14px]" href="#">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="text-on-surface-variant hover:text-primary transition-all text-[14px]" href="#">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a className="text-on-surface-variant hover:text-primary transition-all text-[14px]" href="#">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[13px] font-bold text-on-surface uppercase tracking-wider">Stay Updated</h4>
            <div className="flex gap-2">
              <input
                className="flex-grow bg-surface border border-outline-variant rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-[14px]"
                placeholder="Enter your email"
                type="email"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors text-[14px] font-semibold">
                Join
              </button>
            </div>
            <p className="text-[12px] text-on-surface-variant mt-8">© 2024 Rakesh AI. Empowering Student Journeys.</p>
          </div>
        </div>
      </footer>

      {/* Floating AI Mentor bubble at bottom-right of landing viewport */}
      <button
        aria-label="AI Mentor"
        onClick={() => alert("Welcome to R-AI Companion! Sign in to chat with your AI Mentor.")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center z-50 hover:scale-110 transition-transform duration-300 ai-border-glow"
      >
        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
      </button>
    </div>
  );
}
