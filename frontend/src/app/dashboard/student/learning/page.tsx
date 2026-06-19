'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import SideNavBar from '../../../../components/SideNavBar';
import TopNavBar from '../../../../components/TopNavBar';

// Mock Study Tools Data
const flashcardsData: Record<string, { term: string; definition: string }[]> = {
  'CS 301': [
    { term: 'Red-Black Tree', definition: 'A self-balancing binary search tree where each node has a color attribute (red or black) ensuring O(log n) search, insertion, and deletion.' },
    { term: 'Min-Heap', definition: 'A complete binary tree where the value of each node is greater than or equal to the value of its parent, meaning the root is always the minimum element.' },
    { term: 'Dijkstra\'s Algorithm', definition: 'An algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks.' },
    { term: 'Hash Collision', definition: 'Occurs when two different keys input into a hash function produce the same hash output index. Handled by chaining or open addressing.' },
    { term: 'Amortized Complexity', definition: 'The average time taken per operation over a worst-case sequence of operations, e.g. vector dynamic array resizing takes O(1) amortized time.' }
  ],
  'UI 420': [
    { term: 'Fitts\'s Law', definition: 'A predictive model of human movement primarily used in HCI, stating that the time to acquire a target is a function of the distance to and size of the target.' },
    { term: 'Gestalt Principles', definition: 'Laws of human perception that describe how humans group similar elements, recognize patterns and simplify complex images when we perceive objects.' },
    { term: 'Heuristic Evaluation', definition: 'A usability engineering method for finding usability problems in a user interface design by having evaluators inspect it against defined heuristics.' },
    { term: 'Mental Model', definition: 'A user\'s belief or cognitive understanding of how a system works based on their previous experiences and interactions.' },
    { term: 'Usability Testing', definition: 'Evaluating a product or service by testing it with representative users, measuring task success rate, time, and satisfaction.' }
  ],
  'FT 110': [
    { term: 'DeFi (Decentralized Finance)', definition: 'An emerging financial technology based on secure distributed ledgers similar to those used by cryptocurrencies, bypassing central financial intermediaries.' },
    { term: 'Smart Contract', definition: 'A self-executing contract with the terms of the agreement between buyer and seller directly written into lines of code, residing on a blockchain.' },
    { term: 'Algorithmic Trading', definition: 'A method of executing orders using automated pre-programmed trading instructions accounting for variables such as time, price, and volume.' },
    { term: 'CBDC', definition: 'Central Bank Digital Currency, which is a digital token representing the virtual form of a fiat currency issued and regulated by a nation\'s central monetary authority.' },
    { term: 'Consensus Mechanism', definition: 'A fault-tolerant mechanism used in blockchain systems to achieve the necessary agreement on a single data value or a single state of the network (e.g. Proof of Work/Stake).' }
  ]
};

const quizzesData: Record<string, { question: string; options: string[]; answer: string }[]> = {
  'CS 301': [
    { question: 'What is the worst-case time complexity of looking up a key in a standard Binary Search Tree?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 'O(n)' },
    { question: 'Which data structure is typically used to implement Breadth-First Search (BFS)?', options: ['Stack', 'Queue', 'Priority Queue', 'Linked List'], answer: 'Queue' },
    { question: 'What property is guaranteed in a Max-Heap?', options: ['The root is always the smallest element', 'Every node is larger than its children', 'The tree is a full binary tree', 'Keys are sorted in left-to-right order'], answer: 'Every node is larger than its children' },
    { question: 'Which hash collision resolution method stores elements directly in the hash table array?', options: ['Chaining', 'Open Addressing', 'Adelson-Velsky Landis', 'Double Hashing'], answer: 'Open Addressing' },
    { question: 'What is the height of a balanced binary search tree with n nodes?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], answer: 'O(log n)' }
  ],
  'UI 420': [
    { question: 'According to Fitts\'s Law, how can you make a button easier to click?', options: ['Change its color to red', 'Increase its size and place it closer to the user\'s cursor', 'Decrease its padding', 'Add a hover animation'], answer: 'Increase its size and place it closer to the user\'s cursor' },
    { question: 'Which Gestalt principle explains why we see rows of dots rather than a grid if alternating colors are used?', options: ['Proximity', 'Similarity', 'Continuity', 'Closure'], answer: 'Similarity' },
    { question: 'How many heuristics are defined in Jakob Nielsen\'s guidelines for user interface design?', options: ['5', '8', '10', '12'], answer: '10' },
    { question: 'What is a "Mental Model"?', options: ['A blueprint of the database layout', 'The user\'s internal understanding of how a system works', 'The AI model parameters', 'A psychological evaluation of the designer'], answer: 'The user\'s internal understanding of how a system works' },
    { question: 'What is measured in usability testing to determine effectiveness?', options: ['Server response time', 'Task success rate', 'Lines of code written', 'Database query speed'], answer: 'Task success rate' }
  ],
  'FT 110': [
    { question: 'What does "DeFi" stand for?', options: ['Deferred Finance', 'Decentralized Finance', 'Deficit Filtering', 'Derived Financials'], answer: 'Decentralized Finance' },
    { question: 'Where are Smart Contracts executed?', options: ['On a local client computer', 'On a centralized server', 'On a blockchain', 'In an offline ledger'], answer: 'On a blockchain' },
    { question: 'What is a CBDC?', options: ['Central Bank Digital Currency', 'Crypto Blockchain Digital Contract', 'Corporate Banking Debt Certificate', 'Centralized Bitcoin Deposit Clearing'], answer: 'Central Bank Digital Currency' },
    { question: 'Which consensus mechanism relies on participants locking up tokens to secure the network?', options: ['Proof of Work (PoW)', 'Proof of Stake (PoS)', 'Proof of Authority (PoA)', 'Delegated BFT'], answer: 'Proof of Stake (PoS)' },
    { question: 'What is algorithmic trading?', options: ['Trading physical commodities', 'Using pre-programmed code instructions to trade assets automatically', 'Filing taxes using software', 'Manual stock purchases'], answer: 'Using pre-programmed code instructions to trade assets automatically' }
  ]
};

export default function MyLearning() {
  const router = useRouter();
  const { user, token, initializeAuth, fetchStudentData, awardXp } = useStore();

  // Page layout state
  const [activeSubTab, setActiveSubTab] = useState<'roadmap' | 'tools'>('roadmap');

  // Study Tools State
  const [selectedCourseCode, setSelectedCourseCode] = useState('CS 301');
  const [toolMode, setToolMode] = useState<'flashcards' | 'quiz'>('flashcards');

  // Flashcards state
  const [cardIdx, setCardIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Quiz state
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

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

  // Flashcards for current course
  const currentFlashcards = flashcardsData[selectedCourseCode] || [];
  
  // Quiz for current course
  const currentQuiz = quizzesData[selectedCourseCode] || [];

  const handleNextCard = () => {
    setCardFlipped(false);
    setCardIdx((prev) => (prev + 1) % currentFlashcards.length);
  };

  const handlePrevCard = () => {
    setCardFlipped(false);
    setCardIdx((prev) => (prev - 1 + currentFlashcards.length) % currentFlashcards.length);
  };

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    if (option === currentQuiz[quizQuestionIdx].answer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setQuizQuestionIdx((prev) => prev + 1);
  };

  const handleCompleteQuiz = async () => {
    const xpReward = quizScore * 20;
    setEarnedXp(xpReward);
    if (xpReward > 0) {
      await awardXp(xpReward);
      setShowXpPopup(true);
      setTimeout(() => setShowXpPopup(false), 4000);
    }
    setQuizComplete(true);
  };

  const handleRestartQuiz = () => {
    setQuizQuestionIdx(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizComplete(false);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-body-md">
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .ai-insight-border {
          position: relative;
        }
        .ai-insight-border::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3.5px;
          background: linear-gradient(90deg, #632ce5, #7c4dff);
          border-radius: 3px 3px 0 0;
        }
        .progress-gradient {
          background: linear-gradient(90deg, #24389c, #632ce5);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c5c5d4; border-radius: 10px; }
      `}</style>

      <SideNavBar currentTab="My Learning" />

      <main className="flex-grow lg:ml-sidebar-width min-h-screen flex flex-col">
        <TopNavBar placeholder="Search courses, skills, or mentors..." />

        {/* Page Content: AI Learning Planner */}
        <div className="p-container-padding-mobile md:p-container-padding-desktop flex flex-col gap-gutter flex-grow">
          
          {/* Hero Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-headline-xl text-headline-xl text-primary tracking-tight">AI Learning Planner</h2>
              <p className="text-on-surface-variant text-body-lg max-w-2xl mt-2">
                Personalized roadmap to master <span className="text-secondary font-bold">Full-Stack Development</span> &amp; <span className="text-secondary font-bold">Cloud Architecture</span>.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => alert("Exporting learning plan...")} className="px-5 py-2.5 bg-surface-container-high rounded-xl font-label-md flex items-center gap-2 hover:bg-surface-container-highest transition-all">
                <span className="material-symbols-outlined text-lg">download</span>
                Export Plan
              </button>
              <button onClick={() => alert("Recalculating learning pathway...")} className="px-5 py-2.5 bg-primary text-white rounded-xl font-label-md flex items-center gap-2 shadow-md active:scale-95 transition-all">
                <span className="material-symbols-outlined text-lg">refresh</span>
                Recalculate Path
              </button>
            </div>
          </section>

          {/* View Tab Selector */}
          <div className="flex gap-2 p-1 bg-surface-container-high/50 rounded-xl border border-outline-variant/15 w-fit">
            <button
              onClick={() => setActiveSubTab('roadmap')}
              className={`px-4 py-2 rounded-lg text-label-sm font-bold transition-all ${
                activeSubTab === 'roadmap' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Roadmap &amp; Analytics
            </button>
            <button
              onClick={() => setActiveSubTab('tools')}
              className={`px-4 py-2 rounded-lg text-label-sm font-bold transition-all ${
                activeSubTab === 'tools' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Interactive Study Tools
            </button>
          </div>

          {/* TAB 1: ROADMAP & ANALYTICS (STITCH SPECIFIC) */}
          {activeSubTab === 'roadmap' && (
            <div className="space-y-gutter">
              {/* Analytics row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                
                {/* Skill Gap Analysis Card */}
                <div className="lg:col-span-8 glass-card rounded-3xl p-6 ai-insight-border shadow-sm flex flex-col gap-6 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">Skill Gap Analysis</h3>
                      <p className="text-label-sm text-on-surface-variant">Benchmark against industry standards for Senior Dev roles</p>
                    </div>
                    <span className="px-3 py-1 bg-tertiary-container/10 text-tertiary-container rounded-full font-label-sm">
                      Updated 2h ago
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-label-md">Frontend Frameworks (React/Next)</span>
                          <span className="text-secondary font-bold">85%</span>
                        </div>
                        <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full progress-gradient rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-label-md">Cloud Infrastructure (AWS/GCP)</span>
                          <span className="text-secondary font-bold">42%</span>
                        </div>
                        <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full progress-gradient rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-label-md">System Design &amp; Patterns</span>
                          <span className="text-secondary font-bold">58%</span>
                        </div>
                        <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full progress-gradient rounded-full" style={{ width: '58%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-primary font-bold mb-3">
                          <span className="material-symbols-outlined text-lg">lightbulb</span>
                          AI Recommendation
                        </div>
                        <p className="text-body-md text-on-surface-variant leading-relaxed">
                          You've shown 22% faster progress in Frontend than peers. Rakesh suggests shifting focus to <b>AWS Lambda</b> and <b>DynamoDB</b> to bridge your cloud infra gap by next month.
                        </p>
                        <button className="mt-4 text-primary font-bold flex items-center gap-1 group">
                          Adjust Plan Strategy
                          <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weekly Target Completion Circle */}
                <div className="lg:col-span-4 glass-card rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Weekly Target</h3>
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-surface-container-high" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                      <circle className="transition-all duration-1000" cx="80" cy="80" fill="transparent" r="70" stroke="url(#planner-grad)" strokeDasharray="440" strokeDashoffset="110" strokeLinecap="round" strokeWidth="12"></circle>
                      <defs>
                        <linearGradient id="planner-grad" x1="0%" x2="100%" y1="0%" y2="0%">
                          <stop offset="0%" stopColor="#24389c" />
                          <stop offset="100%" stopColor="#632ce5" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-primary">75%</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Complete</span>
                    </div>
                  </div>
                  <div className="w-full text-left bg-surface-container-low p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-label-md">
                      <span>Hours Spent</span>
                      <span className="font-bold">12 / 16 hrs</span>
                    </div>
                    <div className="flex justify-between text-label-md">
                      <span>Quizzes Done</span>
                      <span className="font-bold">3 / 4</span>
                    </div>
                  </div>
                  <p className="text-label-sm text-on-surface-variant italic">"Success is the sum of small efforts repeated day in and day out."</p>
                </div>
              </div>

              {/* Table section: Structured learning roadmap */}
              <section className="glass-card rounded-3xl p-8 shadow-sm overflow-x-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Structured Learning Roadmap</h3>
                    <p className="text-on-surface-variant">Your chronological path to certification</p>
                  </div>
                  <div className="flex p-1 bg-surface-container-high rounded-full">
                    <button className="px-4 py-1.5 bg-white shadow-sm rounded-full font-label-sm">Active</button>
                    <button className="px-4 py-1.5 text-on-surface-variant font-label-sm">Completed</button>
                  </div>
                </div>
                <div className="min-w-[800px]">
                  <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead className="text-on-surface-variant">
                      <tr>
                        <th className="px-4 font-label-md pb-2">Skills to Learn</th>
                        <th className="px-4 font-label-md pb-2">Priority</th>
                        <th className="px-4 font-label-md pb-2">Progress</th>
                        <th className="px-4 font-label-md pb-2">Resource</th>
                        <th className="px-4 font-label-md pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Row 1 */}
                      <tr className="bg-surface-container-lowest hover:shadow-md transition-shadow duration-300">
                        <td className="px-4 py-5 rounded-l-2xl border-y border-l border-outline-variant/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                              <span className="material-symbols-outlined">api</span>
                            </div>
                            <div>
                              <p className="font-label-md">Next.js 14 Server Actions</p>
                              <span className="text-[11px] text-on-surface-variant">Frontend Architecture</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5 border-y border-outline-variant/10">
                          <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-[11px] font-bold uppercase tracking-wider">Critical</span>
                        </td>
                        <td className="px-4 py-5 border-y border-outline-variant/10 w-48">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-[11px] font-bold">
                              <span>80%</span>
                              <span className="text-on-surface-variant">2 modules left</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                              <div className="h-full bg-secondary rounded-full" style={{ width: '80%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5 border-y border-outline-variant/10">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-black/5 flex items-center justify-center overflow-hidden">
                              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABNsLFS2IIWCAiG2sVuEgOAms9PxvplNBeBWqZrbae5LSHfraey83F6esktc8pfzA-Cut7jOo2S1Dyp0FyWkvmHlgX4ui6gg-_0hK4i5oWafmJTz2-HIW35DgXyEJmHYZiH8GqlaSOoa5tmQ-kc1mS9RKIFmr_aZmhAc9T8Tuh90pTGenWe7PQOB4YtX1MSyoUrwbtMHFLbicF4RC8nmSWVgqU6AsB0nwNowIXxwbTioCjnf4sUguEX-wxQArKe0D6qZ-_tHAlMAnV" alt="Udemy" />
                            </div>
                            <span className="text-body-md">Udemy</span>
                          </div>
                        </td>
                        <td className="px-4 py-5 rounded-r-2xl border-y border-r border-outline-variant/10 text-right">
                          <button onClick={() => alert("Launching Udemy Course...")} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high text-primary transition-all active:scale-90">
                            <span className="material-symbols-outlined">play_circle</span>
                          </button>
                        </td>
                      </tr>
                      {/* Row 2 */}
                      <tr className="bg-surface-container-lowest hover:shadow-md transition-shadow duration-300">
                        <td className="px-4 py-5 rounded-l-2xl border-y border-l border-outline-variant/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                              <span className="material-symbols-outlined">cloud</span>
                            </div>
                            <div>
                              <p className="font-label-md">AWS Solutions Architect</p>
                              <span className="text-[11px] text-on-surface-variant">Cloud Ops</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5 border-y border-outline-variant/10">
                          <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[11px] font-bold uppercase tracking-wider">High</span>
                        </td>
                        <td className="px-4 py-5 border-y border-outline-variant/10 w-48">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-[11px] font-bold">
                              <span>35%</span>
                              <span className="text-on-surface-variant">12 modules left</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                              <div className="h-full bg-secondary rounded-full" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5 border-y border-outline-variant/10">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-black/5 flex items-center justify-center overflow-hidden">
                              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhWxKD3BT3lu6RmTsZkPVVouAnt_u3boPrIeuhHPu0qEv-ZmiEJGoPJ-rtF311z8n9mkgQLbL5GDqoNAOvfPnCN4YYfgaMtVK1gey-ce8UC_4zaPmNWCASqtus01EqEGPSz3W2mlhXp_RPnaS4OrVKdf1nbD1JSnj4dvW6A5n4CAxc2S9fco_2yeXO0Wf_QFh5qGxjLFhoKbqOEz_tihKCEtMZMX_TlFBO5aeDu1ceYeUhKzVmb2hPem_4X6_0zbOugmN2Gb-FSa3-" alt="Coursera" />
                            </div>
                            <span className="text-body-md">Coursera</span>
                          </div>
                        </td>
                        <td className="px-4 py-5 rounded-r-2xl border-y border-r border-outline-variant/10 text-right">
                          <button onClick={() => alert("Launching Coursera Course...")} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high text-primary transition-all active:scale-90">
                            <span className="material-symbols-outlined">play_circle</span>
                          </button>
                        </td>
                      </tr>
                      {/* Row 3 */}
                      <tr className="bg-surface-container-lowest hover:shadow-md transition-shadow duration-300">
                        <td className="px-4 py-5 rounded-l-2xl border-y border-l border-outline-variant/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined">database</span>
                            </div>
                            <div>
                              <p className="font-label-md">Advanced PostgreSQL</p>
                              <span className="text-[11px] text-on-surface-variant">Database Design</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5 border-y border-outline-variant/10">
                          <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-[11px] font-bold uppercase tracking-wider">Medium</span>
                        </td>
                        <td className="px-4 py-5 border-y border-outline-variant/10 w-48">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-[11px] font-bold">
                              <span>10%</span>
                              <span className="text-on-surface-variant">5 modules left</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                              <div className="h-full bg-secondary rounded-full" style={{ width: '10%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5 border-y border-outline-variant/10">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-black/5 flex items-center justify-center overflow-hidden">
                              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPQtupMjJ5bn7mQRaBJewXHH61hXVTybD2om3vDmQsOOO9fatyuvLw5meOC7c4s_Ajb3z4MsaJhfPvJqmcihcxU-OVXRT58yg0sqXaUT58fojJrLd8TsOcS6k9HPI3Ed2gPzWQm_jBh1zaFy8B-3tz6Lldl44yu6qvLQYlkgym1ryuryW_cHsucUXBB-tZzptBkEQLSO8PUt_mE6jVgNGgjvuE5ROqjbMWCsTVkgxJi2-pVO3Gqa3w8Q3AlYoBWclRVVgT9gIUmD8n" alt="NPTEL" />
                            </div>
                            <span className="text-body-md">NPTEL</span>
                          </div>
                        </td>
                        <td className="px-4 py-5 rounded-r-2xl border-y border-r border-outline-variant/10 text-right">
                          <button onClick={() => alert("Launching NPTEL Course...")} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high text-primary transition-all active:scale-90">
                            <span className="material-symbols-outlined">play_circle</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
 
              {/* Recommended Resources & AI Insight Cards */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div className="bg-white rounded-3xl overflow-hidden border border-outline-variant/10 shadow-sm flex flex-col group cursor-pointer hover:shadow-lg transition-all">
                  <div className="h-40 relative">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-Bh3WZoHSUhPR4LW0lTg_GIY4sHcJcXRIeAymkNoWQiuq0S02uq7IyO8a-Y7hfnBIBTJ8ohUyf1xbt8ufXj6wHNKegHCZaVmTmQI0wJ4QnO4domHg8FDFXMkholGsaFsfQMDx1CeJ17mZvLpEmsLDiOrHVq8Hyb70Nn_3sMx8lTO3XLRV7lrx6kKUf3ubg8rTUfP1HDMZYaCcDqEQ2847dLDxypYCJRrCGuWgiJgH-IpdEh-m5GM--_CXuauNCkTLsK_eEnTultNE" alt="Microservices course cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <span className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase">Recommended</span>
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    <h4 className="font-label-md text-on-surface group-hover:text-primary transition-colors">Microservices Architecture with Node.js</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-300"></div>
                      </div>
                      <span className="text-[11px] text-on-surface-variant">1.2k students recently started</span>
                    </div>
                    <div className="pt-3 border-t border-outline-variant/10 flex justify-between items-center text-label-sm">
                      <span className="font-bold text-primary">Udemy</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 24h 15m</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 glass-card rounded-3xl p-6 border-2 border-dashed border-secondary/20 flex gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary">
                    <span className="material-symbols-outlined text-3xl">smart_toy</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="font-headline-md text-headline-md text-secondary">Career Velocity Insight</h4>
                      <p className="text-body-md text-on-surface-variant leading-relaxed">
                        Based on your current progress and the market trends in <b>California, USA</b>, completing the "AWS Solutions Architect" path by end of Q2 will increase your visibility to top-tier recruiters by <b>45%</b>.
                      </p>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">Potential Salary Lift</span>
                        <span className="text-headline-md font-black text-tertiary">+$12,000/yr</span>
                      </div>
                      <div className="w-[1px] bg-outline-variant/30"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">Time to Certification</span>
                        <span className="text-headline-md font-black text-primary">5 Weeks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: INTERACTIVE STUDY TOOLS (FLASHCARDS & QUIZ) */}
          {activeSubTab === 'tools' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
              
              {/* Left Column: Flashcards/Quiz Console */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Course selector header */}
                <div className="glass-card rounded-[24px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-outline-variant/10">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">menu_book</span>
                    <select
                      value={selectedCourseCode}
                      onChange={(e) => {
                        setSelectedCourseCode(e.target.value);
                        setCardIdx(0);
                        handleRestartQuiz();
                      }}
                      className="bg-transparent font-bold text-[15px] text-on-surface outline-none border-b border-outline-variant/30 cursor-pointer"
                    >
                      <option value="CS 301">CS 301 - Advanced Data Structures</option>
                      <option value="UI 420">UI 420 - HCI Design Principles</option>
                      <option value="FT 110">FT 110 - Introduction to Fintech</option>
                    </select>
                  </div>

                  <div className="flex gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
                    <button
                      onClick={() => setToolMode('flashcards')}
                      className={`px-4 py-2 rounded-lg text-[12px] font-bold transition-all ${
                        toolMode === 'flashcards' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Flashcards
                    </button>
                    <button
                      onClick={() => setToolMode('quiz')}
                      className={`px-4 py-2 rounded-lg text-[12px] font-bold transition-all ${
                        toolMode === 'quiz' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Course Quiz
                    </button>
                  </div>
                </div>

                {/* MODE A: FLASHCARDS */}
                {toolMode === 'flashcards' && (
                  <div className="space-y-6">
                    {currentFlashcards.length > 0 ? (
                      <div className="flex flex-col items-center gap-6">
                        <div
                          onClick={() => setCardFlipped(!cardFlipped)}
                          className="w-full min-h-[260px] bg-white rounded-3xl shadow-md border border-outline-variant/10 flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden"
                        >
                          <span className="absolute top-4 right-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container px-2 py-1 rounded">
                            {cardFlipped ? 'Answer' : 'Term'}
                          </span>
                          {cardFlipped ? (
                            <div className="space-y-4 animate-in fade-in duration-200">
                              <p className="text-[18px] leading-relaxed text-on-surface font-medium">
                                {currentFlashcards[cardIdx].definition}
                              </p>
                              <span className="text-[11px] text-secondary font-bold">Click to show term</span>
                            </div>
                          ) : (
                            <div className="space-y-4 animate-in fade-in duration-200">
                              <h3 className="font-extrabold text-[28px] md:text-[32px] text-primary">
                                {currentFlashcards[cardIdx].term}
                              </h3>
                              <span className="text-[11px] text-primary font-bold">Click to flip and reveal definition</span>
                            </div>
                          )}
                        </div>

                        {/* Navigation controls */}
                        <div className="flex items-center gap-8 bg-surface-container-low px-6 py-3 rounded-full border border-outline-variant/10">
                          <button onClick={handlePrevCard} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all">
                            arrow_back
                          </button>
                          <span className="text-[13px] font-bold text-on-surface-variant">
                            {cardIdx + 1} / {currentFlashcards.length}
                          </span>
                          <button onClick={handleNextCard} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all">
                            arrow_forward
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[14px] text-on-surface-variant text-center py-12">No flashcards loaded.</p>
                    )}
                  </div>
                )}

                {/* MODE B: COURSE QUIZ */}
                {toolMode === 'quiz' && (
                  <div className="space-y-6">
                    {showXpPopup && (
                      <div className="p-4 bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg mb-4">
                        <span className="material-symbols-outlined">auto_awesome</span>
                        Congratulations! You earned +{earnedXp} XP for completing the quiz!
                      </div>
                    )}

                    {!quizComplete ? (
                      <div className="glass-card rounded-[24px] p-6 shadow-sm space-y-6">
                        <div className="flex justify-between items-center text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
                          <span>Question {quizQuestionIdx + 1} of {currentQuiz.length}</span>
                          <span>Score: {quizScore}</span>
                        </div>
                        <h3 className="font-bold text-[18px] text-on-surface leading-snug">
                          {currentQuiz[quizQuestionIdx]?.question}
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {currentQuiz[quizQuestionIdx]?.options.map((opt) => {
                            const isSelected = selectedAnswer === opt;
                            const isCorrect = opt === currentQuiz[quizQuestionIdx].answer;
                            let btnStyle = 'border-outline-variant/30 hover:border-primary bg-white/50 text-on-surface';
                            
                            if (selectedAnswer !== null) {
                              if (isSelected) {
                                btnStyle = isCorrect ? 'bg-tertiary/20 border-tertiary text-on-surface' : 'bg-error-container text-on-error-container border-error';
                              } else if (isCorrect) {
                                btnStyle = 'bg-tertiary/10 border-tertiary text-on-surface';
                              }
                            }

                            return (
                              <button
                                key={opt}
                                onClick={() => handleSelectAnswer(opt)}
                                className={`w-full py-4 px-6 rounded-xl border text-left font-semibold text-[14px] transition-all flex items-center justify-between ${btnStyle}`}
                                disabled={selectedAnswer !== null}
                              >
                                <span>{opt}</span>
                                {selectedAnswer !== null && isSelected && (
                                  <span className="material-symbols-outlined text-lg">
                                    {isCorrect ? 'check_circle' : 'cancel'}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Question navigation footer */}
                        <div className="flex justify-between pt-4 border-t border-outline-variant/10">
                          <button onClick={handleRestartQuiz} className="text-on-surface-variant hover:text-primary text-[12px] font-bold">
                            Reset Quiz
                          </button>
                          {selectedAnswer !== null && (
                            quizQuestionIdx < currentQuiz.length - 1 ? (
                              <button onClick={handleNextQuestion} className="px-5 py-2.5 bg-primary text-white rounded-xl text-[12px] font-bold">
                                Next Question
                              </button>
                            ) : (
                              <button onClick={handleCompleteQuiz} className="px-6 py-2.5 bg-secondary text-white rounded-xl text-[12px] font-bold">
                                Complete Quiz
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="glass-card rounded-[24px] p-8 text-center space-y-6">
                        <span className="material-symbols-outlined text-[48px] text-secondary">stars</span>
                        <h3 className="font-extrabold text-[24px]">Quiz Complete!</h3>
                        <p className="text-[16px] text-on-surface-variant">
                          You scored <b>{quizScore} out of {currentQuiz.length}</b> correct answers!
                        </p>
                        <p className="text-[13px] text-tertiary font-bold">
                          +{quizScore * 20} XP Awarded to your profile!
                        </p>
                        <div className="flex gap-3 justify-center pt-4">
                          <button onClick={handleRestartQuiz} className="px-6 py-3 bg-primary text-white rounded-xl text-[13px] font-bold shadow-md">
                            Try Again
                          </button>
                          <button onClick={() => { setSelectedCourseCode('CS 301'); handleRestartQuiz(); }} className="px-6 py-3 border border-outline-variant/30 text-on-surface rounded-xl text-[13px] font-bold">
                            Other Courses
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Weekly study statistics */}
              <div className="space-y-6">
                <div className="glass-card rounded-[24px] p-6 shadow-sm border border-outline-variant/10 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-secondary/5 rounded-full blur-2xl"></div>
                  <h3 className="font-bold text-[16px] text-on-surface-variant uppercase tracking-wider mb-6">Study Streaks</h3>
                  <div className="flex justify-between items-center text-center">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                      const active = idx < 4;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] ${
                            active ? 'bg-secondary text-white' : 'bg-surface-container-high text-on-surface-variant'
                          }`}>
                            {day}
                          </div>
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 p-4 bg-secondary-container/20 text-secondary text-[12px] font-bold rounded-xl flex items-center gap-2 justify-center">
                    <span className="material-symbols-outlined">local_fire_department</span>
                    <span>4 Day Active Streak! Keep it going!</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
