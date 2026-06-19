'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';

export default function FloatingAiAssistant() {
  const { token, chatMessages, sendChatMessage, fetchChatHistory } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token && isOpen) {
      fetchChatHistory();
    }
  }, [token, isOpen]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  if (!token) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    await sendChatMessage(msg);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Floating Chat Popover Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 h-[450px] max-h-[70vh] flex flex-col rounded-[24px] shadow-2xl glass-card border border-secondary/20 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
              </div>
              <div>
                <h4 className="text-white font-bold text-[14px] leading-tight">AI Companion</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                  <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3 bg-surface/50">
            {chatMessages && chatMessages.length > 0 ? (
              chatMessages.map((msg) => {
                const isAi = msg.isAiSender;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isAi ? '' : 'self-end flex-row-reverse'}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold ${
                      isAi ? 'bg-secondary-container/85 text-secondary' : 'bg-primary'
                    }`}>
                      {isAi ? <span className="material-symbols-outlined text-xs">smart_toy</span> : 'ME'}
                    </div>
                    <div className={`rounded-2xl p-3 text-[12.5px] max-w-[80%] shadow-sm leading-relaxed ${
                      isAi ? 'bg-white text-on-surface border border-outline-variant/10 rounded-tl-none' : 'bg-primary text-white rounded-tr-none'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-on-surface-variant/40 gap-2">
                <span className="material-symbols-outlined text-[32px] text-secondary/50">forum</span>
                <p className="text-[11px] font-bold">Ask me anything about your roadmap!</p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-surface-container-low border-t border-outline-variant/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask AI Companion..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-white border border-outline-variant/20 rounded-xl px-4 py-2.5 pr-10 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-[13px] text-on-surface shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-primary hover:scale-110 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </form>

        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-[0_4px_24px_0_rgba(99,44,229,0.35)] hover:scale-105 transition-transform duration-300 relative group"
        title="Open AI Companion Chat"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute inset-0 rounded-full border border-secondary animate-ping opacity-40"></span>
        
        <span className="material-symbols-outlined text-[28px] group-hover:rotate-12 transition-transform">
          {isOpen ? 'chat_bubble' : 'psychology'}
        </span>
      </button>
    </div>
  );
}
