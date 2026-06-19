'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';
import FloatingAiAssistant from '../../../../components/FloatingAiAssistant';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedInfo: string;
  badge: string;
  badgeColor: string;
  icon: string;
  iconBg: string;
  category: string;
  hasPreview?: boolean;
  isStarred?: boolean;
  isLocked?: boolean;
  avatars?: string[];
  actionIcon?: string;
}

export default function Resources() {
  const router = useRouter();
  const { user, token, initializeAuth, fetchStudentData } = useStore();

  const [activeCategory, setActiveCategory] = useState('Semester 1');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 'file-1',
      name: 'Lecture Notes - Neural Networks',
      type: 'PDF',
      size: '1.2 MB',
      updatedInfo: 'Updated 2d ago',
      badge: 'AI Highlighted',
      badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
      icon: 'description',
      iconBg: 'bg-primary/5 text-primary',
      category: 'Semester 1',
      hasPreview: true,
      avatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDnI2cdO--FrAb8gJ4HCd9BXGlHc7-S0XfTYhF01QuG6l58QxSkribsVcPAipyu6Zou2JTYl9YBmZOQajZkdhBTDVVC9-JaTvqH5kAG1C9bGW5f6cmFctpM1v75TFJ5bqfYecvviKbHgIG8DMKHTRV1-_ziAMY7_kIZiXzIX_oGxABWKzqzYMFe9UGdWGWTHPQ3KmTgsWknaWPbH2OhiIQecGlxHCB39uStyiKI3EXLXE_vXdY9ii2VqF6bl3FdJf0O95DYKc_TFV9Y",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBaofMPhDttYo9cUxuGhHWPkthSUmE9aGfOPHd163bzk4T5UVecwz8wq4frHQWA_FL8o3Ru1N7sPq6ieVplIfAPUHGTeakYCnNKq0nQ_ZrRNJvTI1Xf8fZ7TfsCQuplUAoIIodEasEJE8UuQk0jf3v6WTmpGaWG5gJeY5uxX2G-EIs2NRM1nVYjS1SGQjv78IFV-l0OG3Y8U9WmuLKIGNEKjz1y_ezBcSCi9y6go-jLtGKX1I1GpyS1rQC7lswRqutCjCcEoVE6W0mC"
      ]
    },
    {
      id: 'file-2',
      name: 'Mid-Term Paper 2023 - CS101',
      type: 'DOCX',
      size: '450 KB',
      updatedInfo: 'Updated 5d ago',
      badge: 'Semester 1',
      badgeColor: 'bg-surface-container-highest text-on-surface-variant',
      icon: 'article',
      iconBg: 'bg-secondary/5 text-secondary',
      category: 'Semester 1',
      hasPreview: true,
      actionIcon: 'visibility'
    },
    {
      id: 'file-3',
      name: 'Project Assets - Web Dev',
      type: 'DIR',
      size: '45 Files',
      updatedInfo: 'Updated 1w ago',
      badge: 'Collaborative',
      badgeColor: 'bg-surface-container-highest text-on-surface-variant',
      icon: 'folder',
      iconBg: 'bg-tertiary-container/5 text-tertiary-container',
      category: 'Semester 1',
      hasPreview: false,
      actionIcon: 'share'
    },
    {
      id: 'file-4',
      name: 'Advanced Calculus Lecture 12',
      type: 'PPTX',
      size: '4.2 MB',
      updatedInfo: 'Updated 1d ago',
      badge: 'AI Highlighted',
      badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
      icon: 'slideshow',
      iconBg: 'bg-primary/5 text-primary',
      category: 'Semester 1',
      isStarred: true
    },
    {
      id: 'file-5',
      name: 'Ethics in AI - Reference Doc',
      type: 'PDF',
      size: '890 KB',
      updatedInfo: 'Updated 2w ago',
      badge: 'Elective',
      badgeColor: 'bg-surface-container-highest text-on-surface-variant',
      icon: 'picture_as_pdf',
      iconBg: 'bg-error/5 text-error',
      category: 'Semester 1',
      isLocked: true
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

  const handleDownload = (fileName: string) => {
    alert(`Downloading resource: "${fileName}"...`);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    setFiles([
      ...files,
      {
        id: Date.now().toString(),
        name: newFileName,
        type: 'PDF',
        size: '1.5 MB',
        updatedInfo: 'Just added',
        badge: 'Semester 1',
        badgeColor: 'bg-surface-container-highest text-on-surface-variant',
        icon: 'description',
        iconBg: 'bg-primary/5 text-primary',
        category: 'Semester 1'
      }
    ]);
    setNewFileName('');
    setShowUploadModal(false);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans">
      <SideNavBar currentTab="Resources" />

      <main className="flex-1 lg:ml-sidebar-width min-h-screen pb-24 flex flex-col overflow-x-hidden">
        <TopNavBar placeholder="Search resources..." />

        {/* Page Content Container */}
        <div className="p-gutter max-w-7xl mx-auto w-full space-y-gutter flex-grow">
          
          {/* Hero Section / Action Bar */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-headline-lg text-headline-lg text-on-background">Your Learning Vault</h3>
              <p className="text-on-surface-variant">Browse, organize, and contribute academic materials.</p>
            </div>
            {user.role === 'ADMIN' && (
              <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-secondary-container text-on-secondary-container px-6 py-3 rounded-xl font-label-md flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95 transition-all w-fit font-bold"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>upload</span>
                Upload Resource
              </button>
            )}
          </section>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            
            {/* Left Sidebar Filters */}
            <aside className="lg:col-span-3 space-y-gutter flex flex-col gap-6">
              
              {/* Categories */}
              <div className="glass-card rounded-2xl p-6 shadow-sm border border-outline-variant/20">
                <h4 className="font-label-md text-primary mb-4 flex items-center gap-2 text-[15px] font-bold">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  Categories
                </h4>
                <div className="space-y-1">
                  {[
                    { name: 'Semester 1', count: 12 },
                    { name: 'Semester 2', count: 45 },
                    { name: 'Research Papers', count: 8 },
                    { name: 'Past Exams', count: 21 }
                  ].map(cat => (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg font-label-md flex justify-between items-center transition-colors ${
                        activeCategory === cat.name
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        activeCategory === cat.name ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest'
                      }`}>{cat.count < 10 ? `0${cat.count}` : cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="glass-card rounded-2xl p-6 shadow-sm border border-outline-variant/20">
                <h4 className="font-label-md text-primary mb-4 flex items-center gap-2 text-[15px] font-bold">
                  <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                  Top Contributors
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img className="w-8 h-8 rounded-full object-cover border border-outline-variant/30" alt="Anjali Singh" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDopc6aK_p9mSAMgLUkxiGwwPhMSb2HJq0w0L-59RtqTuwhc9KHXpTOQz6ak8g9Upk6Al_vr8L9YkBDb3DlBORH_4tOVMaym047aG5wHMeLcLyG3mDmzbhMyVQn7VBrLvQ04KkKI8tVaUoXA2IqhjqOkzR_4eE_YLKve-LIoHMpoVHRviCUjN4Xx4E6L_ZsE9PXIc1gD75dyqP3gDTqNkFxoWbD6anfxZel7h_xisef9Q6rrQkxFJBOLD5j9-TL2cM4kA6N-DqlIntD" />
                      <span className="absolute -top-1 -right-1 bg-tertiary-fixed text-on-tertiary-fixed text-[8px] font-bold px-1 rounded-full">1st</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-label-md leading-tight text-[13px] font-bold">Anjali Singh</p>
                      <p className="text-[10px] text-on-surface-variant">142 Uploads</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <img className="w-8 h-8 rounded-full object-cover border border-outline-variant/30" alt="Marcus Wu" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgykn3B3tfBt_f7XdUVxmdReQyVgrfPZoNNkyubmfAQIFcIsLEQd3-zmQZkqEvN4v7hB5Ja7SZazEPikii3wwHrNOI1rzfOEAP0LDyWvhLtaD_75ex5CHmRdvqTtt5nYf5dM1RKAaIobtwL543cUft--NrOWC4eBoXZb3VP7UwXzAZw1qt1eDFRzP6TtLt73eWTI-HMSHMTu3ZXpoTCtL4Qpv6MY_2U1tbBH7NOX1jmPll7dbqnqlo6RaEHP5dOj_rA3orW8BAhH5Q" />
                    <div className="flex-grow">
                      <p className="font-label-md leading-tight text-[13px] font-bold">Marcus Wu</p>
                      <p className="text-[10px] text-on-surface-variant">98 Uploads</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 opacity-80">
                    <img className="w-8 h-8 rounded-full object-cover border border-outline-variant/30" alt="Zara Khalil" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9sZACoXlq4ir6wxpKSJhaMeSM0lM5wl9rVuptuv6kwwbZM3derZGinUi2Mu2u9Ttguqm9IbzuwUzo94A65S_2iUXOMXYZ7j3ohx-VNV3_zEyDwmB0vA4Reb-LuRJEU8_282jmReDQVJNlBdjI-fUyL96i-r-Ns2luH2UQMDEcES2XIhCRk6-_4MMN4B_sRfvBXLBkTZElVxplTgnBdDBVd65UsKENiWrzYT_9gajQCqj1kCeImgzFYsoidrx3ZHq81cb2cLikDuE0" />
                    <div className="flex-grow">
                      <p className="font-label-md leading-tight text-[13px] font-bold">Zara Khalil</p>
                      <p className="text-[10px] text-on-surface-variant">76 Uploads</p>
                    </div>
                  </div>
                </div>
              </div>

            </aside>

            {/* Right File Explorer Content */}
            <div className="lg:col-span-9 space-y-gutter flex flex-col gap-6">
              
              {/* AI Document Assistant Insight */}
              <div className="glass-card rounded-2xl p-6 shadow-sm border border-outline-variant/20 overflow-hidden relative group border-t-3 border-t-secondary">
                {/* Glow line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-secondary to-primary" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="bg-secondary/10 p-3 rounded-full flex-shrink-0">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-on-background text-[18px] font-bold">AI Document Assistant</h4>
                    <p className="text-on-surface-variant text-[14px] mt-1 leading-relaxed">
                      I've analyzed your upcoming Data Structures exam. Based on past papers, focus on <strong>AVL Trees</strong> and <strong>Graph Traversal</strong>. I've highlighted 4 relevant documents for you below.
                    </p>
                  </div>
                </div>
                <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-[120px]">psychology</span>
                </div>
              </div>

              {/* Repository Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {files
                  .filter(f => f.category === activeCategory)
                  .map((file) => (
                    <div 
                      key={file.id} 
                      onClick={() => !file.isLocked && handleDownload(file.name)}
                      className={`glass-card p-4 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between min-h-[180px] ${
                        file.isLocked ? 'opacity-80 cursor-not-allowed' : ''
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl ${file.iconBg}`}>
                            <span className="material-symbols-outlined text-[32px]">{file.icon}</span>
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); alert(`Options menu for "${file.name}"`); }}
                            className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant flex items-center"
                          >
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </div>
                        <h5 className="font-label-md text-on-surface group-hover:text-primary transition-colors mb-1 truncate text-[14px] font-bold">
                          {file.name}
                        </h5>
                        <p className="text-label-sm text-on-surface-variant text-[11px] font-semibold">
                          {file.type} • {file.size} • {file.updatedInfo}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/10">
                        {file.badge && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${file.badgeColor}`}>
                            {file.badge}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 ml-auto">
                          {file.avatars && file.avatars.length > 0 && (
                            <div className="flex -space-x-2">
                              {file.avatars.map((av, avIdx) => (
                                <img key={avIdx} className="w-5 h-5 rounded-full border border-surface" src={av} alt="avatar" />
                              ))}
                            </div>
                          )}
                          {file.isStarred && (
                            <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          )}
                          {file.isLocked && (
                            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">lock</span>
                          )}
                          {file.actionIcon && (
                            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">{file.actionIcon}</span>
                          )}
                          {!file.isLocked && !file.isStarred && !file.avatars && !file.actionIcon && (
                            <span className="material-symbols-outlined text-on-surface-variant text-[16px] hover:text-primary">download</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Drop Files / Upload Placeholder */}
                <div 
                  onClick={() => setShowUploadModal(true)}
                  className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-all cursor-pointer group min-h-[180px]"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">add</span>
                  </div>
                  <p className="font-label-md text-on-surface-variant text-[14px]">Drop files here</p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-outline-variant/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-[18px] text-on-surface mb-2">Upload Academic Resource</h3>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="e.g. Chapter_5_Quantum_Computing.pdf"
                className="w-full h-12 border border-outline-variant/30 rounded-xl px-4 text-[14px] focus:ring-2 focus:ring-primary/20 outline-none text-on-surface"
                required
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 border border-outline-variant/30 rounded-xl text-[12px] font-bold text-on-surface-variant hover:bg-surface-container">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-primary text-white rounded-xl text-[12px] font-bold shadow-md hover:opacity-90">
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FloatingAiAssistant />
    </div>
  );
}
