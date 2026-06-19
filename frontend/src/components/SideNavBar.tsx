'use client';

import React from 'react';
import { useStore } from '../store/useStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FloatingAiAssistant from './FloatingAiAssistant';

interface SideNavBarProps {
  currentTab?: string;
}

interface NavLinkItem {
  name: string;
  icon: string;
  path: string;
  active?: boolean;
}

export default function SideNavBar({ currentTab }: SideNavBarProps) {
  const { user, logout } = useStore();
  const pathname = usePathname();

  if (!user) return null;

  const role = user.role;

  // Define navigation links based on user role
  const getNavLinks = (): NavLinkItem[] => {
    switch (role) {
      case 'STUDENT':
        return [
          { name: 'Dashboard', icon: 'dashboard', path: '/dashboard/student' },
          { name: 'My Learning', icon: 'school', path: '/dashboard/student/learning' },
          { name: 'Timetable', icon: 'calendar_month', path: '/dashboard/student/timetable' },
          { name: 'AI Tutor', icon: 'psychology', path: '/dashboard/student/tutor' },
          { name: 'Career Path', icon: 'alt_route', path: '/dashboard/student/career' },
          { name: 'Opportunities', icon: 'work', path: '/dashboard/student/opportunities' },
          { name: 'Resources', icon: 'folder', path: '/dashboard/student/resources' },
          { name: 'Study Groups', icon: 'group_work', path: '/dashboard/student/groups' },
          { name: 'Community', icon: 'groups', path: '/dashboard/student/community' },
          { name: 'Settings', icon: 'settings', path: '/dashboard/student/settings' },
        ];
      case 'FACULTY':
        return [
          { name: 'Dashboard', icon: 'dashboard', path: '/dashboard/faculty' },
          { name: 'Community', icon: 'groups', path: '/dashboard/student/community' },
          { name: 'My Learning', icon: 'school', path: '/dashboard/student/learning' },
          { name: 'Career Path', icon: 'alt_route', path: '/dashboard/student/career' },
          { name: 'AI Tutor', icon: 'psychology', path: '/dashboard/student/tutor' },
        ];
      case 'MENTOR':
        return [
          { name: 'Home', icon: 'home', path: '/project-overview' },
          { name: 'Mentors', icon: 'groups', path: '/dashboard/mentor' },
          { name: 'Opportunities', icon: 'explore', path: '/dashboard/student/opportunities' },
          { name: 'Admin Panel', icon: 'dashboard_customize', path: '/dashboard/admin' },
          { name: 'Resources', icon: 'menu_book', path: '/dashboard/student/resources' },
          { name: 'Settings', icon: 'settings', path: '/dashboard/student/settings' },
        ];
      case 'ADMIN':
        return [
          { name: 'Home', icon: 'home', path: '/project-overview' },
          { name: 'Opportunities', icon: 'explore', path: '/dashboard/student/opportunities' },
          { name: 'Mentors', icon: 'groups', path: '/dashboard/mentor' },
          { name: 'Admin Panel', icon: 'dashboard_customize', path: '/dashboard/admin' },
          { name: 'Resources', icon: 'menu_book', path: '/dashboard/student/resources' },
          { name: 'Settings', icon: 'settings', path: '/dashboard/student/settings' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const handleActionClick = () => {
    alert("AI Mentor interface initialized. Ask your query in the Chat sidebar!");
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-sidebar-width hidden lg:flex flex-col bg-surface-container-low border-r border-outline-variant/10 p-4 gap-base z-50 overflow-y-auto custom-scrollbar">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-4 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
            psychology
          </span>
        </div>
        <div>
          <h1 className="font-extrabold text-[18px] text-primary tracking-tight leading-none mb-1">AI COMPANION</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold leading-none">
            Empathetic Expert
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 mt-4 flex flex-col gap-1">
        {navLinks.map((link, idx) => {
          const isActive = currentTab
            ? currentTab.toLowerCase() === link.name.toLowerCase()
            : (pathname === link.path || link.active);
          return (
            <Link
              key={idx}
              href={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-secondary-container/20 text-secondary font-semibold border-r-4 border-secondary'
                  : 'text-on-surface-variant hover:bg-surface-variant/50'
              }`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="text-[14px]">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Actions */}
      <div className="mt-auto pt-4 border-t border-outline-variant/10 flex flex-col gap-2">
        {role !== 'ADMIN' ? (
          <button
            onClick={handleActionClick}
            className="w-full py-3 px-4 bg-gradient-to-r from-secondary to-secondary-container text-white rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-secondary/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">chat_bubble</span>
            Ask AI Mentor
          </button>
        ) : (
          <button
            onClick={() => alert("Navigate to Admin Dashboard to upload content.")}
            className="w-full py-3 px-4 bg-primary text-white rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Insight
          </button>
        )}

        <Link
          href="#help"
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-primary transition-all text-[12px] font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          Help Center
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20 rounded-xl transition-all text-[12px] font-medium w-full text-left"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Logout
        </button>
      </div>
    </aside>
    <FloatingAiAssistant />
  </>
);
}
