'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';
import FloatingAiAssistant from '../../../../components/FloatingAiAssistant';

interface CareerData {
  category: string;
  pros: string[];
  demand: number;
  salary: number;
  difficulty: number;
  difficultyDesc: string;
  challenges: string[];
  recommendation: string;
  matchScore: number;
  icon: string;
}

const careerMockData: Record<string, CareerData> = {
  'Data Science': {
    category: 'Mathematics & Analytics',
    pros: ['High strategic impact', 'Diverse industry use', 'Research focus'],
    demand: 85,
    salary: 125,
    difficulty: 3,
    difficultyDesc: 'DS requires heavy math foundation.',
    challenges: ['Tool saturation & fatigue', 'Barrier to entry (Education)', 'Constant AI disruption'],
    recommendation: 'Based on your high aptitude in Statistics (Module 4) and your recent interest in Python for Automation, Data Science offers the best synergy between your natural strengths and current market value. While Web Development is a viable secondary skill, prioritizing a Data-focused path will likely yield a 15% higher starting salary in your target region.',
    matchScore: 92,
    icon: 'data_thresholding'
  },
  'Machine Learning': {
    category: 'Artificial Intelligence',
    pros: ['Cutting-edge tech', 'High specialized salary', 'Automation focus'],
    demand: 95,
    salary: 140,
    difficulty: 4,
    difficultyDesc: 'ML requires deep learning and calculus background.',
    challenges: ['Rapidly moving state-of-the-art', 'High compute costs', 'Data quality issues'],
    recommendation: 'Your performance in linear algebra and neural network basics is exceptional. Machine Learning would allow you to build custom models. However, it requires intense commitment to research papers and mathematics.',
    matchScore: 89,
    icon: 'psychology'
  },
  'Cybersecurity': {
    category: 'Information Security',
    pros: ['Critical infrastructure', 'Always high demand', 'Defensive & Offensive paths'],
    demand: 80,
    salary: 115,
    difficulty: 3,
    difficultyDesc: 'Requires networking knowledge and system level understanding.',
    challenges: ['High stress environment', 'Continuous vulnerability hunting', 'Compliance bureaucracy'],
    recommendation: 'Cybersecurity is a highly secure job market. Since you have solid networking projects, this could be a great choice if you prefer risk management and system defense over building models.',
    matchScore: 78,
    icon: 'shield'
  },
  'Web Development': {
    category: 'Software Engineering',
    pros: ['Visual creative output', 'Fast feedback loops', 'High remote work %'],
    demand: 65,
    salary: 105,
    difficulty: 2,
    difficultyDesc: 'WD requires ecosystem mastery.',
    challenges: ['Framework churn', 'Browser compatibility', 'Lower initial barrier to entry'],
    recommendation: 'Your front-end skills are strong. Web Development offers the fastest path to market. If you are looking to launch startups quickly, Web Development is ideal.',
    matchScore: 82,
    icon: 'code'
  },
  'Cloud Architect': {
    category: 'Infrastructure & DevOps',
    pros: ['High systems impact', 'Excellent senior salary', 'Scalability focus'],
    demand: 88,
    salary: 135,
    difficulty: 3,
    difficultyDesc: 'Requires knowledge of cloud providers (AWS/GCP) and networking.',
    challenges: ['Complex system outages', 'High cost optimization pressure', 'Constant certification updates'],
    recommendation: 'Cloud Architecture is perfect if you enjoy infrastructure and designing scalable systems. It pairs well with your backend development experiments.',
    matchScore: 85,
    icon: 'cloud'
  },
  'Product Design': {
    category: 'User Experience & Strategy',
    pros: ['Human-centered creative design', 'Direct customer impact', 'Cross-functional role'],
    demand: 70,
    salary: 110,
    difficulty: 2,
    difficultyDesc: 'Requires empathy, visual design, and user testing knowledge.',
    challenges: ['Subjective feedback loops', 'Balancing business and user needs', 'Tool transitions (Figma, etc.)'],
    recommendation: 'Product Design would leverage your background in Psychology and visual art. If you prefer user-facing features over technical programming, this is your optimal path.',
    matchScore: 80,
    icon: 'palette'
  }
};

export default function DecisionAssistant() {
  const router = useRouter();
  const { user, token, initializeAuth, fetchStudentData } = useStore();

  const [optionA, setOptionA] = useState('Data Science');
  const [optionB, setOptionB] = useState('Web Development');

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

  const dataA = careerMockData[optionA] || careerMockData['Data Science'];
  const dataB = careerMockData[optionB] || careerMockData['Web Development'];

  const handleSwap = () => {
    const temp = optionA;
    setOptionA(optionB);
    setOptionB(temp);
  };

  // Determine recommendation comparison winner
  const winner = dataA.matchScore >= dataB.matchScore ? optionA : optionB;
  const winnerData = careerMockData[winner];

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans">
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .ai-gradient-border {
          border-top: 3px solid transparent;
          border-image: linear-gradient(to right, #632ce5, #7c4dff) 1;
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
        .selection-glow {
          box-shadow: 0 0 20px rgba(124, 77, 255, 0.15);
        }
      `}</style>

      <SideNavBar currentTab="Career Path" />

      <main className="flex-1 lg:ml-sidebar-width min-h-screen flex flex-col relative">
        <TopNavBar placeholder="Search insights..." />

        {/* Content Area */}
        <div className="flex-grow p-container-padding-mobile md:p-container-padding-desktop max-w-6xl mx-auto w-full">
          {/* Page Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2 text-secondary font-label-md">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span className="text-[14px] font-semibold">AI-Powered Career Intelligence</span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight">Career Decision Assistant</h2>
            <p className="text-on-surface-variant text-body-lg max-w-2xl mt-2">Compare career options and courses with data-driven support and in-depth pros and cons analysis to find the path that resonates with your goals.</p>
          </div>

          {/* Comparison Tool: Selection Slots */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-12">
            <div className="glass-card p-6 rounded-2xl selection-glow border-2 border-primary/10">
              <label className="block text-label-sm text-on-surface-variant mb-3">Path Option A</label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {dataA.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <select
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    className="w-full bg-transparent border-none p-0 font-headline-md text-headline-md text-on-surface focus:ring-0 cursor-pointer"
                  >
                    {Object.keys(careerMockData).map((key) => (
                      <option key={key} className="bg-surface text-on-surface">{key}</option>
                    ))}
                  </select>
                  <p className="text-label-sm text-on-surface-variant">{dataA.category}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-4 md:my-0 z-10">
              <button
                type="button"
                onClick={handleSwap}
                className="w-12 h-12 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-lg transform hover:rotate-180 transition-transform duration-500 cursor-pointer outline-none"
              >
                <span className="material-symbols-outlined">compare_arrows</span>
              </button>
            </div>

            <div className="glass-card p-6 rounded-2xl selection-glow border-2 border-secondary/10">
              <label className="block text-label-sm text-on-surface-variant mb-3">Path Option B</label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {dataB.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <select
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    className="w-full bg-transparent border-none p-0 font-headline-md text-headline-md text-on-surface focus:ring-0 cursor-pointer"
                  >
                    {Object.keys(careerMockData).map((key) => (
                      <option key={key} className="bg-surface text-on-surface">{key}</option>
                    ))}
                  </select>
                  <p className="text-label-sm text-on-surface-variant">{dataB.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table: Bento Grid Style */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-12">
            {/* Pros */}
            <div className="md:col-span-2 glass-card rounded-2xl p-6 border-l-4 border-emerald-500">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                <h3 className="font-label-md text-label-md uppercase tracking-wider">Pros &amp; Advantages</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-bold text-on-surface">{optionA}</h4>
                  <ul className="text-label-sm space-y-2 text-on-surface-variant">
                    {dataA.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-500">•</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3 border-l border-outline-variant/20 pl-4">
                  <h4 className="font-bold text-on-surface">{optionB}</h4>
                  <ul className="text-label-sm space-y-2 text-on-surface-variant">
                    {dataB.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-500">•</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Industry Demand */}
            <div className="md:col-span-2 glass-card rounded-2xl p-6 border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">trending_up</span>
                <h3 className="font-label-md text-label-md uppercase tracking-wider">Industry Demand</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-label-md">{optionA} (2024-2030)</span>
                    <span className="text-primary font-bold">+{dataA.demand}%</span>
                  </div>
                  <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${dataA.demand}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-label-md">{optionB}</span>
                    <span className="text-primary font-bold">+{dataB.demand}%</span>
                  </div>
                  <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${dataB.demand}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary Potential */}
            <div className="md:col-span-2 glass-card rounded-2xl p-6 border-l-4 border-secondary">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary">payments</span>
                <h3 className="font-label-md text-label-md uppercase tracking-wider">Salary Potential</h3>
              </div>
              <div className="flex items-end gap-4 h-32 pt-4">
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div 
                    className="w-full bg-primary-container/20 rounded-t-lg relative group transition-all hover:bg-primary-container/40 flex flex-col justify-end"
                    style={{ height: `${(dataA.salary / 150) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-primary font-bold">${dataA.salary}k</div>
                  </div>
                  <span className="text-label-sm text-on-surface-variant truncate w-full text-center">{optionA}</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div 
                    className="w-full bg-secondary-container/20 rounded-t-lg relative group transition-all hover:bg-secondary-container/40 flex flex-col justify-end"
                    style={{ height: `${(dataB.salary / 150) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-secondary font-bold">${dataB.salary}k</div>
                  </div>
                  <span className="text-label-sm text-on-surface-variant truncate w-full text-center">{optionB}</span>
                </div>
              </div>
            </div>

            {/* Difficulty & Learning Curve */}
            <div className="md:col-span-1 glass-card rounded-2xl p-6 border-l-4 border-amber-500">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-amber-600">fitness_center</span>
                <h3 className="font-label-md text-label-md uppercase tracking-wider">Difficulty</h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm truncate max-w-[80px]">{optionA}</span>
                  <div className="flex gap-1 flex-shrink-0">
                    {[1, 2, 3, 4].map((star) => (
                      <span
                        key={star}
                        className={`w-2 h-2 rounded-full ${star <= dataA.difficulty ? 'bg-amber-500' : 'bg-amber-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-label-sm truncate max-w-[80px]">{optionB}</span>
                  <div className="flex gap-1 flex-shrink-0">
                    {[1, 2, 3, 4].map((star) => (
                      <span
                        key={star}
                        className={`w-2 h-2 rounded-full ${star <= dataB.difficulty ? 'bg-amber-500' : 'bg-amber-200'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-4 leading-relaxed italic opacity-60">
                {dataA.difficultyDesc} {dataB.difficultyDesc}
              </p>
            </div>

            {/* Cons / Challenges */}
            <div className="md:col-span-1 glass-card rounded-2xl p-6 border-l-4 border-error">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-error">cancel</span>
                <h3 className="font-label-md text-label-md uppercase tracking-wider">Challenges</h3>
              </div>
              <ul className="text-[11px] space-y-2 text-on-surface-variant">
                {dataA.challenges.concat(dataB.challenges).slice(0, 3).map((challenge, index) => (
                  <li key={index}>• {challenge}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Personalized AI Recommendation Card */}
          <div className="relative overflow-hidden glass-card rounded-3xl ai-gradient-border p-8 mb-12 shadow-2xl">
            {/* Abstract AI Background Effect */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-on-primary shadow-xl rotate-3">
                <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-semibold">Match Score: {winnerData.matchScore}%</span>
                  <span className="text-on-surface-variant text-label-sm">Updated 2m ago</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-3">AI Companion's Verdict: <span className="text-primary">{winner}</span></h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {winnerData.recommendation}
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <button 
                    onClick={() => router.push('/dashboard/student/learning')} 
                    className="bg-secondary text-on-secondary px-6 py-2 rounded-xl font-label-md hover:scale-105 transition-transform"
                  >
                    Start Learning Path
                  </button>
                  <button 
                    onClick={() => alert("Connecting to an academic advisor...")} 
                    className="bg-surface-container-high text-on-surface-variant px-6 py-2 rounded-xl font-label-md hover:bg-surface-variant transition-colors"
                  >
                    Talk to Mentor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-12 px-container-padding-desktop mt-auto bg-surface-container-highest border-t border-outline-variant/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-7xl mx-auto">
            <div className="flex flex-col gap-4">
              <h3 className="font-headline-md text-headline-md font-bold text-primary">AI COMPANION</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Your empathetic AI expert for navigating the complex landscape of modern education and careers.</p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-widest mb-2">Quick Links</h4>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">University Partners</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">Faculty Portal</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">Student Support</a>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-widest mb-2">Legal</h4>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">Privacy Policy</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">Terms of Service</a>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-4">© 2024 AI Companion. Empowering Student Journeys.</p>
            </div>
          </div>
        </footer>
      </main>

      <FloatingAiAssistant />
    </div>
  );
}
