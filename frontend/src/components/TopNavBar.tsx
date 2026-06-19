'use client';

import React from 'react';
import { useStore } from '../store/useStore';

interface TopNavBarProps {
  placeholder?: string;
}

export default function TopNavBar({ placeholder = "Search courses, mentors..." }: TopNavBarProps) {
  const { user } = useStore();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/10 px-container-padding-mobile md:px-container-padding-desktop py-4 flex justify-between items-center w-full">
      <div className="flex items-center gap-4 flex-1">
        <div className="lg:hidden w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer hover:bg-primary-container transition-all">
          <span className="material-symbols-outlined">menu</span>
        </div>
        <div className="hidden md:flex items-center bg-surface-container-high/50 rounded-full px-4 py-2 w-full max-w-md border border-outline-variant/20">
          <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
          <input
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-[16px] w-full text-on-surface placeholder:text-on-surface-variant/60"
            placeholder={placeholder}
            type="text"
          />
        </div>
        <div className="md:hidden font-black text-primary tracking-tight text-[22px]">
          {user.name}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high/50 rounded-full transition-all relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high/50 rounded-full transition-all">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-[14px] text-on-surface leading-tight">{user.name}</p>
            <p className="text-[12px] text-on-surface-variant leading-none mt-0.5">
              {user.title || user.major || 'University Student'}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary-container shadow-sm">
            <img
              className="w-full h-full object-cover"
              alt="User Avatar"
              src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
