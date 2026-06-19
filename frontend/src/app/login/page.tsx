'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '../../store/useStore';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegisterParam = searchParams.get('register') === 'true';

  const { login, register, isAuthenticated, user, error, isLoading } = useStore();

  const [isRegister, setIsRegister] = useState(isRegisterParam);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'FACULTY' | 'MENTOR' | 'ADMIN'>('STUDENT');
  const [major, setMajor] = useState('Computer Science');
  const [showPassword, setShowPassword] = useState(false);

  const particleContainerRef = useRef<HTMLDivElement>(null);

  // Sync state with url query parameters
  useEffect(() => {
    setIsRegister(isRegisterParam);
  }, [isRegisterParam]);

  // Auth check and redirection
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectToDashboard(user.role);
    }
  }, [isAuthenticated, user]);

  // Floating particles background effect
  useEffect(() => {
    if (!particleContainerRef.current) return;
    const container = particleContainerRef.current;
    container.innerHTML = ''; // Clean up

    for (let i = 0; i < 20; i++) {
      const dot = document.createElement('div');
      dot.className = 'absolute rounded-full bg-primary/10 transition-all duration-[10000ms] ease-in-out pointer-events-none';
      const size = Math.random() * 8 + 4;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      container.appendChild(dot);

      const interval = setInterval(() => {
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
      }, 10000 + Math.random() * 5000);

      dot.setAttribute('data-interval-id', String(interval));
    }

    return () => {
      const elements = container.children;
      for (let i = 0; i < elements.length; i++) {
        const intervalId = elements[i].getAttribute('data-interval-id');
        if (intervalId) clearInterval(Number(intervalId));
      }
    };
  }, []);

  const redirectToDashboard = (userRole: string) => {
    switch (userRole) {
      case 'STUDENT':
        router.push('/dashboard/student');
        break;
      case 'FACULTY':
        router.push('/dashboard/faculty');
        break;
      case 'MENTOR':
        router.push('/dashboard/mentor');
        break;
      case 'ADMIN':
        router.push('/dashboard/admin');
        break;
      default:
        router.push('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      const success = await register({ email, password, name, role, major });
      if (success && user) {
        redirectToDashboard(role);
      }
    } else {
      const success = await login({ email, password });
      if (success && user) {
        redirectToDashboard(user.role);
      }
    }
  };

  // Mock accounts quick log in helpers
  const handleQuickLogin = async (roleType: 'STUDENT' | 'FACULTY' | 'MENTOR' | 'ADMIN') => {
    let mockEmail = 'rakesh@university.edu';
    if (roleType === 'FACULTY') mockEmail = 'sarah.chen@university.edu';
    if (roleType === 'MENTOR') mockEmail = 'helena.vance@university.edu';
    if (roleType === 'ADMIN') mockEmail = 'admin@university.edu';

    setEmail(mockEmail);
    setPassword('password123');
    
    // Slight timeout to show values typed
    setTimeout(async () => {
      const success = await login({ email: mockEmail, password: 'password123' });
      if (success && user) {
        redirectToDashboard(roleType);
      }
    }, 300);
  };

  return (
    <div className="bg-mesh min-h-screen flex flex-col font-sans text-on-surface relative">
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
        }
        .ai-gradient-text {
          background: linear-gradient(135deg, #24389c 0%, #632ce5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ai-glow-button {
          background: linear-gradient(135deg, #632ce5 0%, #4355b9 100%);
          box-shadow: 0 4px 14px 0 rgba(99, 44, 229, 0.39);
          transition: all 0.3s ease;
        }
        .ai-glow-button:hover {
          box-shadow: 0 6px 20px rgba(99, 44, 229, 0.5);
          transform: translateY(-1px);
        }
        .bg-mesh {
          background-color: #f8f9fa;
          background-image: 
            radial-gradient(at 0% 0%, rgba(99, 44, 229, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(67, 85, 185, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(120, 220, 119, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(99, 44, 229, 0.1) 0px, transparent 50%);
        }
      `}</style>

      {/* Back to Home Header */}
      <header className="px-container-padding-mobile md:px-container-padding-desktop py-4 flex justify-between items-center w-full max-w-7xl mx-auto absolute top-0 left-0 right-0 z-20">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold hover:underline text-[14px]">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Home
        </Link>
      </header>

      {/* Main Login Form */}
      <main className="flex-grow flex items-center justify-center p-container-padding-mobile z-10 mt-12 pb-16">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
            </div>
            <h1 className="font-extrabold text-[32px] ai-gradient-text">AI Companion</h1>
            <p className="text-on-surface-variant text-[14px] mt-2">Empowering your academic journey with intelligence.</p>
          </div>

          {/* Login Card */}
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <h2 className="font-headline-md text-headline-md mb-8 text-on-surface font-bold">
              {isRegister ? 'Create an account' : 'Welcome back'}
            </h2>

            {error && (
              <div className="mb-4 p-3.5 bg-error-container text-on-error-container text-[13px] font-semibold rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {isRegister && (
                <>
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-on-surface-variant px-1" htmlFor="name">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-[20px]">
                          person
                        </span>
                      </div>
                      <input
                        className="w-full h-12 pl-12 pr-4 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl text-[14px] focus:border-secondary focus:ring-0 transition-all outline-none text-on-surface"
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-on-surface-variant px-1" htmlFor="role">
                        Platform Role
                      </label>
                      <select
                        id="role"
                        className="w-full h-12 px-3 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl text-[14px] focus:border-secondary focus:ring-0 outline-none text-on-surface"
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                      >
                        <option value="STUDENT">Student</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="MENTOR">Mentor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>

                    {role === 'STUDENT' && (
                      <div className="space-y-1">
                        <label className="text-[12px] font-bold text-on-surface-variant px-1" htmlFor="major">
                          Academic Major
                        </label>
                        <select
                          id="major"
                          className="w-full h-12 px-3 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl text-[14px] focus:border-secondary focus:ring-0 outline-none text-on-surface"
                          value={major}
                          onChange={(e) => setMajor(e.target.value)}
                        >
                          <option value="Computer Science">Computer Science</option>
                          <option value="Data Engineering">Data Engineering</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                        </select>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-on-surface-variant px-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-[20px]">
                      mail
                    </span>
                  </div>
                  <input
                    className="w-full h-12 pl-12 pr-4 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl text-[14px] focus:border-secondary focus:ring-0 transition-all outline-none text-on-surface"
                    id="email"
                    type="email"
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[12px] font-bold text-on-surface-variant" htmlFor="password">
                    Password
                  </label>
                  {!isRegister && (
                    <Link href="#" className="text-[11px] font-medium text-primary hover:text-secondary transition-colors">
                      Forgot Password?
                    </Link>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-[20px]">
                      lock
                    </span>
                  </div>
                  <input
                    className="w-full h-12 pl-12 pr-11 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl text-[14px] focus:border-secondary focus:ring-0 transition-all outline-none text-on-surface"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="w-full h-14 mt-4 ai-glow-button text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
                ) : (
                  <>
                    <span>{isRegister ? 'Sign Up' : 'Sign In'}</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/40"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#fafbff] dark:bg-[#0c0f1d] px-2 text-on-surface-variant font-bold text-[10px] tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Button */}
            <button
              onClick={() => alert("Google authentication is not yet configured. Please sign in using your email and password.")}
              className="flex items-center justify-center gap-3 w-full h-12 border-2 border-outline-variant/30 rounded-xl font-bold text-[14px] text-on-surface hover:bg-surface-container-low transition-colors active:scale-95 mb-6"
            >
              <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEwcL9h6UdyrQt4oxvPzxl0VbFivg6pywrHbL4hv2P-F1dyn4inKwMMcjuD5djDIe-5TlXyNuXP2i-hn5TzmdRrfg8tz0Npf_rXFtoCt-3xrKtpZXb3Crv-p-O_iU9tLgyKyHnxwu-zZN1xrJLpbpXviv6dUioxg8s3NkUa-DhfYxu8CDHtkMI_uZbzefSg9PbCgr1a0Y59TGF_NLdkNlMVutHUT7wu4isw0Su_zH6bgPTP5d7Q4StWy-Ar8s2zqyJ_dhnEeSM6DYr" />
              <span>Google</span>
            </button>

            {/* Sign Up Switch */}
            <p className="text-center mt-6 text-[14px] text-on-surface-variant font-medium">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-primary font-bold hover:underline transition-all"
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex justify-center items-center gap-8 opacity-40 grayscale contrast-125">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="text-[12px] font-medium">AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">security</span>
              <span className="text-[12px] font-medium">HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Particles Area */}
      <div ref={particleContainerRef} className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-mesh">
        <div className="flex flex-col items-center gap-2">
          <span className="animate-spin material-symbols-outlined text-[36px] text-primary">progress_activity</span>
          <p className="text-[14px] font-medium text-on-surface-variant">Loading login panel...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
