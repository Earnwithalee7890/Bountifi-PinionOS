"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Zap,
  CheckCircle2,
  CreditCard,
  AlertCircle,
  Settings,
  ArrowUpRight,
  TrendingUp,
  History,
  ShieldCheck,
  Globe,
  Database,
  Layers,
  ExternalLink,
  Code2,
  Box,
  Cpu,
  Terminal,
  Wallet,
  Search,
  Github,
  ChevronRight,
  HelpCircle,
  Lock,
  FileText,
  MousePointer2,
  Network,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { bountifi, BountyTask } from '@/lib/agent';
import { isPinionConfigured } from '@/lib/pinion';
import { SettingsModal } from '@/components/SettingsModal';

// --- CUSTOM PREMIUM LOGO ---
const NeuralLogo = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <filter id="glowLogo">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" stroke="url(#neuralGrad)" strokeWidth="2" fill="rgba(16,185,129,0.05)" />
    <circle cx="50" cy="50" r="10" fill="url(#neuralGrad)" filter="url(#glowLogo)" />
    <path d="M50 10 V40 M85 30 L60 45 M85 70 L60 55 M50 90 V60 M15 70 L40 55 M15 30 L40 45" stroke="url(#neuralGrad)" strokeWidth="1" strokeDasharray="2 2" />
    <motion.circle
      cx="50" cy="10" r="3" fill="#f59e0b"
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);

// --- DOCUMENTATION HUB DATA ---
const DOCS_CONTENT = {
  Architecture: {
    title: "PinionOS Grid Architecture",
    icon: Network,
    content: "BountiFi operates as a decentralized kernel optimization layer on PinionOS. By utilizing x402 settlement protocols, we achieve sub-millisecond task execution validation across a global mesh of AI nodes. Our stack leverages WASM-sandboxed environments for non-destructive code synthesis."
  },
  Simulation_Engine: {
    title: "Neural Simulation Engine v4.1",
    icon: Cpu,
    content: "Every pull request is passed through a multi-stage Dockerized sandbox. We analyze 142 distinct security and logic vectors, generating a high-fidelity confidence score. Any submission below our 85% safety threshold is automatically discarded to maintain repository integrity."
  },
  Reputation_Oracle: {
    title: "Autonomous Reputation Oracle (ARO)",
    icon: ShieldCheck,
    content: "The ARO tracks historic merge success, code quality metrics, and settlement reliability. Your Trust Score represents your standing in the Pinion labor market. High-reputation agents receive priority access to private, high-value bounties and liquidity pools."
  },
  Privacy_Policy: {
    title: "Zero-Knowledge Privacy Protocol",
    icon: Lock,
    content: "We utilize ZK-proofs for transaction settlement, ensuring your agent's internal logic and proprietary weights are never exposed. Your identity is proxied through a decentralized DID, compliant with global autonomous labor standards."
  },
  Autonomous_Terms: {
    title: "Autonomous Terms of Service",
    icon: FileText,
    content: "By initializing the AI core, you agree to the Fair Labor standards of the Pinion network. This includes automated settlement, non-attribution clauses for code generation, and the right to autonomous resource management within specified budget constraints."
  }
};

const DocModal = ({ isOpen, type, onClose }: { isOpen: boolean, type: string | null, onClose: () => void }) => {
  if (!isOpen || !type || !DOCS_CONTENT[type as keyof typeof DOCS_CONTENT]) return null;
  const doc = DOCS_CONTENT[type as keyof typeof DOCS_CONTENT];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[var(--background)]/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="glass-card max-w-2xl w-full p-10 bg-[var(--panel-bg)] border-[var(--primary)]/20 shadow-[0_0_100px_var(--primary-glow)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-[var(--primary)]/10 rounded-2xl">
            <doc.icon size={32} className="text-[var(--primary)]" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">{doc.title}</h2>
        </div>
        <p className="text-zinc-400 text-lg leading-relaxed mb-10 font-medium">
          {doc.content}
        </p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 transition-all"
        >
          [ Acknowledge_Signal ]
        </button>
      </motion.div>
    </motion.div>
  );
};

export default function BountiFiDashboard() {
  const [activeTab, setActiveTab] = useState<'missions' | 'analytics' | 'leaderboard'>('missions');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [tasks, setTasks] = useState<BountyTask[]>([]);
  const [balance, setBalance] = useState({ eth: "0.0042", usdc: "165.25" });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [reputation, setReputation] = useState({ score: 0, successRate: 0, totalSolved: 0 });
  const [externalWallet, setExternalWallet] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [docModal, setDocModal] = useState<string | null>(null);
  const [simDepth, setSimDepth] = useState<'quick' | 'standard' | 'deep'>('standard');
  const [theme, setTheme] = useState<'emerald' | 'amethyst' | 'solar'>('emerald');
  const [mode, setMode] = useState<'dark' | 'light' | 'slate'>('dark');

  const handleLogoClick = () => {
    setActiveTab('missions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    bountifi.addLog("SYSTEM_RESET: Synchronizing local terminal nodes...");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRunning(bountifi.isActive());
      setLogs(bountifi.getRecentLogs());
      setTasks(bountifi.getTasks());
      setReputation(bountifi.getReputation());
      setExternalWallet(bountifi.getExternalWallet());
      setAnalytics(bountifi.getAnalytics());
      setLeaderboard(bountifi.getLeaderboard());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleAgent = () => {
    if (isRunning) {
      bountifi.stop();
    } else {
      bountifi.start();
    }
    setIsRunning(!isRunning);
  };

  const handleConnectWallet = async () => {
    if (externalWallet) {
      bountifi.disconnectExternalWallet();
    } else {
      const addr = await bountifi.connectExternalWallet();
      if (!addr && typeof window !== 'undefined' && !(window as any).ethereum) {
        alert("BountiFi Node Error: No Web3 Terminal (MetaMask) detected. Please install a compatible browser extension.");
      }
    }
  };

  return (
    <div
      id="bountifi-root"
      data-theme={theme}
      data-mode={mode}
      className="min-h-screen p-6 lg:p-10 relative overflow-hidden bg-[var(--background)] text-[var(--foreground)] selection:bg-primary/30 transition-colors duration-500 font-outfit"
    >
      <div className="mesh-bg" />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <DocModal isOpen={!!docModal} type={docModal} onClose={() => setDocModal(null)} />

      {/* Header */}
      <nav className="flex flex-col xl:flex-row justify-between items-center mb-12 gap-8 relative z-20 glass-card p-6 border-[var(--glass-border)] bg-[var(--panel-bg)] backdrop-blur-2xl">
        <div className="flex items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            onClick={handleLogoClick}
            className="cursor-pointer"
          >
            <NeuralLogo />
          </motion.div>
          <div onClick={handleLogoClick} className="cursor-pointer">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-emerald-400 to-amber-500 bg-clip-text text-transparent">BountiFi</h1>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-black tracking-[0.2em] leading-none uppercase">ULTRA v0.8</span>
            </div>
            <p className="text-zinc-500 text-[10px] font-black tracking-[0.3em] uppercase mt-1 opacity-60 flex items-center gap-2">
              <Activity size={10} className="text-emerald-500" /> Neural Labor Network
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[var(--panel-bg)] rounded-2xl p-1 border border-[var(--glass-border)] hidden md:flex">
          {[
            { id: 'missions', label: 'Mission Control', icon: Zap },
            { id: 'analytics', label: 'Earning Analytics', icon: TrendingUp },
            { id: 'leaderboard', label: 'Global Rank', icon: Globe }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id
                ? 'bg-[var(--primary)] text-white shadow-lg'
                : 'text-zinc-500 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5'
                }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleConnectWallet}
            className={`px-6 py-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${externalWallet
              ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-white text-black hover:bg-zinc-200'
              }`}
          >
            <Wallet size={18} />
            {externalWallet ? `${externalWallet}` : 'Connect Wallet'}
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 glass-card hover:bg-[var(--primary)]/10 transition-all text-zinc-400 hover:text-[var(--primary)]"
          >
            <Settings size={20} />
          </button>

          {/* THEME SWITCHER */}
          <div className="flex bg-[var(--panel-bg)] rounded-xl p-1 border border-[var(--glass-border)] gap-1">
            {['emerald', 'amethyst', 'solar'].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t as any)}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${theme === t ? 'border-[var(--primary)] scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
              >
                <div className={`w-3 h-3 rounded-full ${t === 'emerald' ? 'bg-[#10b981]' : t === 'amethyst' ? 'bg-[#a855f7]' : 'bg-[#f59e0b]'
                  }`} />
              </button>
            ))}
          </div>
          {/* MODE SWITCHER */}
          <div className="flex bg-[var(--panel-bg)] rounded-xl p-1 border border-[var(--glass-border)] gap-1">
            {[
              { id: 'dark', icon: Moon },
              { id: 'light', icon: Sun },
              { id: 'slate', icon: Monitor }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${mode === m.id ? 'border-[var(--primary)] scale-110 shadow-lg bg-[var(--primary)]/10' : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
              >
                <m.icon size={14} className={mode === m.id ? 'text-[var(--primary)]' : 'text-zinc-500'} />
              </button>
            ))}
          </div>

          <button
            onClick={handleToggleAgent}
            className={`px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${isRunning
              ? 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]'
              : 'bg-gradient-to-r from-emerald-600 to-amber-600 text-white hover:opacity-90 shadow-lg'
              }`}
          >
            {isRunning ? 'DEACTIVATE_NODE' : 'INITIALIZE_NEURAL_CORE'}
          </button>
        </div>
      </nav>

      <main className="max-w-[1800px] mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'missions' && (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-4 gap-8"
            >
              {/* Left Column: Wallet & Reputation */}
              <div className="space-y-8">
                <section className="glass-card p-8 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent border-emerald-500/20 overflow-hidden relative group">
                  <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                    <History size={180} />
                  </div>
                  <div className="flex items-center gap-3 mb-8">
                    <Terminal size={18} className="text-blue-400" />
                    <h2 className="text-[10px] font-black text-[var(--foreground)] opacity-60 uppercase tracking-[0.3em] leading-none">Internal_Ledger</h2>
                  </div>
                  <div className="space-y-8 relative z-10">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-black mb-2 tracking-[0.2em] uppercase">Accumulated_Earn</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-black tracking-tighter text-white tabular-nums">{(parseFloat(balance.usdc) * (analytics?.prices?.usdc || 1)).toFixed(2)}</span>
                        <span className="text-xs font-bold text-emerald-400 uppercase italic">USDC</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 bg-[var(--background)]/40 rounded-2xl p-4 border border-[var(--glass-border)]">
                      <div>
                        <p className="text-[9px] text-zinc-600 font-bold mb-1 uppercase tracking-widest leading-none">Gas_Reserve</p>
                        <p className="text-lg font-black text-[var(--foreground)] tabular-nums">{(parseFloat(balance.eth) * (analytics?.prices?.eth || 1) / (analytics?.prices?.eth || 1)).toFixed(4)} <span className="text-[10px] opacity-50">ETH</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-[var(--foreground)] opacity-40 font-bold mb-1 uppercase tracking-widest leading-none">Market_Val</p>
                        <p className="text-lg font-black text-emerald-500 tabular-nums">${(parseFloat(balance.eth) * (analytics?.prices?.eth || 2800)).toFixed(0)}</p>
                      </div>
                    </div>
                    <button className="premium-btn w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center justify-center gap-2">
                      <ArrowUpRight size={14} /> Settlement_Hub
                    </button>
                  </div>
                </section>

                <section className="glass-card p-8 bg-gradient-to-br from-purple-600/10 via-transparent to-transparent border-purple-500/20 overflow-hidden relative group">
                  <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity -rotate-12">
                    <ShieldCheck size={180} />
                  </div>
                  <div className="flex items-center gap-3 mb-8">
                    <History size={18} className="text-purple-400" />
                    <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] leading-none">Agent_Rep_Score</h2>
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl font-black tracking-tighter text-white tabular-nums">{reputation.score}</span>
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">TRUSTED</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className="text-zinc-500 font-black uppercase tracking-widest leading-none">Reliability_Index</span>
                        <span className="text-white font-black">{(reputation.successRate * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-600 to-amber-600 rounded-full shadow-[0_0_100px_var(--primary)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${reputation.successRate * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="glass-card p-8 border-white/5 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-8">
                    <Activity size={18} className="text-blue-500" />
                    <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] leading-none">Neural_Resource_Load</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-2">Compute_Load</p>
                        <p className="text-xl font-black text-white">{analytics?.telemetry?.cpu || 12}%</p>
                      </div>
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-2">Strategy_Conf</p>
                        <p className="text-xl font-black text-white">{analytics?.telemetry?.strategy || 98}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Autonomous_Optimization_Active</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Center: Mission Control */}
              <div className="xl:col-span-2 space-y-8">
                <section className="glass-card p-8 relative overflow-hidden flex flex-col min-h-[720px] bg-[var(--panel-bg)] border-[var(--glass-border)]">
                  <div className="scan-line" />
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[var(--primary)]/10 rounded-xl">
                        <Search size={24} className="text-[var(--primary)]" />
                      </div>
                      <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[var(--foreground)]">Neural Mission Hub</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-500/5 border border-green-500/20 px-5 py-2 rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {tasks.length} SYNCED_CHANNELS
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6 overflow-y-auto pr-3 scrollbar-hide">
                    <AnimatePresence>
                      {tasks.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-full flex flex-col items-center justify-center text-center py-40"
                        >
                          <Globe size={64} className="text-zinc-800 mb-8 animate-spin-slow opacity-20" />
                          <p className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.4em] max-w-xs leading-loose">
                            Awaiting Decentralized Labor Protocol Signal Handshake...
                          </p>
                        </motion.div>
                      ) : (
                        tasks.map((task) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-8 glass-card border-[var(--glass-border)] hover:border-[var(--primary)]/20 transition-all group relative overflow-hidden bg-[var(--background)]/20 hover:bg-[var(--primary)]/5"
                          >
                            <div className="flex justify-between items-start relative z-10">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-600/10 transition-colors">
                                    <Github size={18} className="text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                  </div>
                                  <span className="text-[10px] text-zinc-500 font-black font-mono uppercase tracking-[0.3em]">{task.repository}</span>
                                </div>
                                <h3 className="text-3xl font-black group-hover:text-white transition-colors tracking-tighter text-zinc-200 leading-tight pr-10">
                                  {task.title}
                                </h3>
                              </div>
                              <div className="text-right ml-6">
                                <p className="text-4xl font-black text-white italic tracking-tighter bg-gradient-to-br from-white to-zinc-600 bg-clip-text text-transparent">{task.reward}</p>
                                <span className={`mt-3 inline-block text-[9px] font-black px-5 py-1.5 rounded-full border uppercase tracking-[0.2em] backdrop-blur-md ${task.status === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                  task.status === 'solving' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                                    task.status === 'simulating' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse' :
                                      task.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                  }`}>
                                  {task.status}
                                </span>
                              </div>
                            </div>

                            {task.status !== 'pending' && task.status !== 'failed' && (
                              <div className="mt-8 mb-4 relative z-10 px-1">
                                <div className="flex justify-between items-center mb-3">
                                  <div className="flex items-center gap-2">
                                    <Zap size={12} className="text-zinc-500" />
                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Confidence_Neural_Check</span>
                                  </div>
                                  <span className="text-[11px] font-black text-blue-400 font-mono italic">{task.confidence || 0}.0%</span>
                                </div>
                                <div className="w-full h-3 bg-black/50 rounded-full p-1 border border-white/5 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${task.confidence || 0}%` }}
                                    className={`h-full rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(59,130,246,0.2)] ${(task.confidence || 0) > 90 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                                      (task.confidence || 0) > 85 ? 'bg-gradient-to-r from-blue-600 to-indigo-500' :
                                        'bg-gradient-to-r from-amber-600 to-orange-500'
                                      }`}
                                  />
                                </div>
                              </div>
                            )}

                            <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-8">
                              <div className="flex gap-10">
                                <div className="flex items-center gap-3">
                                  <Database size={16} className="text-blue-500 opacity-60" />
                                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Neural_V4</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Layers size={16} className="text-purple-500 opacity-60" />
                                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Settlement: L2</span>
                                </div>
                              </div>
                              <a href={task.url} target="_blank" className="premium-btn px-6 py-3 rounded-xl transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-white group-hover:border-blue-500/40">
                                Decode Stack <ExternalLink size={14} className="opacity-40" />
                              </a>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </section>
              </div>

              {/* Right Column: Console & Controls */}
              <div className="space-y-8">
                {/* ADVANCED CONTROLS */}
                <section className="glass-card p-8 bg-black/40 border-white/5">
                  <div className="flex items-center gap-3 mb-8">
                    <Activity size={18} className="text-zinc-500" />
                    <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] leading-none">Simulation_Params</h2>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Analysis_Depth</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['quick', 'standard', 'deep'].map(depth => (
                        <button
                          key={depth}
                          onClick={() => setSimDepth(depth as any)}
                          className={`py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${simDepth === depth
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'bg-white/5 border-white/5 text-zinc-600 hover:text-zinc-400'
                            }`}
                        >
                          {depth}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="glass-card p-8 h-[400px] flex flex-col bg-[var(--panel-bg)] border-[var(--glass-border)] overflow-hidden relative">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 font-mono">
                    <div className="flex items-center gap-3">
                      <Terminal size={22} className="text-green-500" />
                      <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Neural_Console</h2>
                    </div>
                    <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Protocol::x402</div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 text-[11px] pr-3 scrollbar-hide font-mono">
                    <AnimatePresence initial={false}>
                      {logs.map((log, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`leading-relaxed relative pl-5 py-1 border-l-2 ${log.includes('SUCCESS') || log.includes('COMPLETE') ? 'text-green-400 border-green-500/30 font-bold' :
                            log.includes('Error') || log.includes('FAILED') ? 'text-red-400 border-red-500/30' :
                              log.includes('ALERT') || log.includes('MATCH') || log.includes('SIMULATION') ? 'text-blue-400 border-blue-500/40' :
                                'text-zinc-600 border-white/5'
                            }`}
                        >
                          <span className="opacity-20 absolute -left-[3px] top-1 font-bold">{'>'}</span>
                          {log}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Neural_Sync</span>
                      <span className="text-[12px] font-black text-zinc-300 uppercase italic">Stable_V5</span>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-900 border border-white/5 px-4 py-2 rounded-xl">
                      <span className="text-[10px] font-black text-green-500 tracking-[0.2em]">_ALIVE</span>
                      <div className="w-1.5 h-4 bg-green-500/80 animate-pulse rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <section className="glass-card p-10 bg-black/40 xl:col-span-2">
                <div className="flex items-center gap-4 mb-12">
                  <div className="p-3 bg-purple-600/10 rounded-xl">
                    <TrendingUp size={28} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">Yield Analytics</h2>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Performance overview across protocol epochs</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-[var(--background)]/20 p-6 rounded-2xl border border-[var(--glass-border)]">
                    <p className="text-[10px] font-black text-[var(--foreground)] opacity-50 uppercase tracking-widest mb-1">Total_Yield</p>
                    <p className="text-4xl font-black text-[var(--foreground)] italic tracking-tighter">${analytics?.totalEarned || 0}</p>
                  </div>
                  <div className="bg-[var(--background)]/20 p-6 rounded-2xl border border-[var(--glass-border)]">
                    <p className="text-[10px] font-black text-[var(--foreground)] opacity-50 uppercase tracking-widest mb-1">Success_Rate</p>
                    <p className="text-4xl font-black text-emerald-500 italic tracking-tighter">{(analytics?.conversionRate * 100).toFixed(0)}%</p>
                  </div>
                  <div className="bg-[var(--background)]/20 p-6 rounded-2xl border border-[var(--glass-border)]">
                    <p className="text-[10px] font-black text-[var(--foreground)] opacity-50 uppercase tracking-widest mb-1">Uptime</p>
                    <p className="text-4xl font-black text-purple-400 italic tracking-tighter">{analytics?.uptime || '---'}</p>
                  </div>
                </div>

                <div className="h-64 flex items-end gap-3 px-4">
                  {analytics?.yieldHistory?.map((val: number, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${val / 1.5}%` }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className="flex-1 bg-gradient-to-t from-blue-600/40 to-purple-600/60 rounded-t-xl relative group cursor-pointer"
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                        ${val}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between mt-6 px-2 text-[10px] font-black text-[var(--foreground)] opacity-40 uppercase tracking-widest">
                  <span>Epoch_01</span>
                  <span>Epoch_03</span>
                  <span>Epoch_05</span>
                  <span>Epoch_07</span>
                </div>
              </section>

              <section className="glass-card p-10 bg-gradient-to-br from-indigo-900/10 to-transparent">
                <div className="flex items-center gap-3 mb-8">
                  <Activity size={20} className="text-blue-400" />
                  <h3 className="text-xl font-black tracking-tighter uppercase italic">Network Health</h3>
                </div>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase text-[var(--foreground)] opacity-60">
                      <span>Node Latency</span>
                      <span className="text-green-400">12ms</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--background)]/20 rounded-full overflow-hidden">
                      <div className="w-[15%] h-full bg-green-500" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase text-[var(--foreground)] opacity-60">
                      <span>PR Merge Speed</span>
                      <span className="text-blue-400">1.4h avg</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--background)]/20 rounded-full overflow-hidden">
                      <div className="w-[45%] h-full bg-blue-500" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase text-[var(--foreground)] opacity-60">
                      <span>Pinion Data Sync</span>
                      <span className="text-purple-400">98% Synced</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--background)]/20 rounded-full overflow-hidden">
                      <div className="w-[98%] h-full bg-purple-500" />
                    </div>
                  </div>
                </div>
                <div className="mt-12 p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--panel-bg)]/40">
                  <p className="text-xs text-[var(--foreground)] opacity-50 font-medium leading-[1.8]">
                    BountiFi protocol monitoring provides real-time verification of autonomous labor outputs and settlement integrity using the x402 Layer-2 network.
                  </p>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto py-10"
            >
              <div className="text-center mb-16">
                <Globe size={64} className="text-[var(--primary)] opacity-40 mx-auto mb-8 animate-pulse" />
                <h2 className="text-6xl font-black tracking-tighter uppercase italic bg-gradient-to-b from-[var(--foreground)] to-zinc-600 bg-clip-text text-transparent">Global Rankings</h2>
                <p className="text-xs font-black text-[var(--foreground)] opacity-40 tracking-[0.4em] uppercase mt-4">Autonomous Labor Authority (ALA) Verification</p>
              </div>

              <div className="glass-card overflow-hidden bg-[var(--panel-bg)]">
                <div className="grid grid-cols-4 p-8 border-b border-[var(--glass-border)] text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] opacity-50">
                  <span className="col-span-2">Agent ID / Designation</span>
                  <span className="text-center">Missions Solved</span>
                  <span className="text-right">Reputation Score</span>
                </div>
                <div className="divide-y divide-white/5">
                  {(leaderboard || []).map((entry, idx) => (
                    <motion.div
                      key={entry.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`grid grid-cols-4 p-8 items-center group hover:bg-white/[0.02] transition-colors ${entry.name.includes('v0.5') ? 'bg-blue-600/5' : ''}`}
                    >
                      <div className="flex items-center gap-6 col-span-2">
                        <span className="text-2xl font-black italic text-zinc-800 tabular-nums w-8">0{idx + 1}</span>
                        <div>
                          <p className={`text-xl font-black tracking-tighter ${entry.name.includes('v0.5') ? 'text-blue-400' : 'text-zinc-200'}`}>{entry.name}</p>
                          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Status: {idx === 0 ? 'Supreme_Elite' : 'Verified_Node'}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-xl font-black text-[var(--foreground)] tabular-nums tracking-tighter">{entry.solved}</span>
                        <span className="block text-[8px] font-black text-[var(--foreground)] opacity-40 uppercase tracking-widest mt-1">Confirmed</span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className={`text-2xl font-black italic tracking-tighter ${idx === 0 ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>{entry.score}</span>
                        <div className="flex gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className={`w-3 h-0.5 rounded-full ${s <= (5 - idx) ? 'bg-[var(--primary)]' : 'bg-[var(--foreground)]/5'}`} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <p className="text-center mt-10 text-zinc-700 text-[10px] font-black uppercase tracking-[0.2em]">
                Leaderboard syncs every 24 hours across the Pinion Decentralized Grid
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MISSION STRIP TICKER */}
      <div className="fixed bottom-0 left-0 w-full bg-[var(--ticker-bg)] backdrop-blur-xl border-t border-[var(--glass-border)] z-[50] py-4 overflow-hidden mask-fade-edges">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 items-center px-10"
        >
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-6">
              <span className="text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.3em]">Neural_Mesh_Live</span>
              <span className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                BASE_L2_GAS: {analytics?.prices?.baseGas || '0.15'} Gwei
              </span>
              <span className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                ETH/USD: ${analytics?.prices?.eth || '2842.12'}
              </span>
              <span className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-orange-500" />
                BTC/USD: $94,102.45
              </span>
              <span className="text-[10px] font-black text-[var(--foreground)] opacity-40 uppercase tracking-widest italic animate-pulse">
                [ SIGNAL_INTACT: x402 SECURE ]
              </span>
              <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">
                Latest_Block: #1948271
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="mt-40 border-t border-[var(--glass-border)] pt-32 pb-32 relative z-10 px-8">
        <div className="max-w-[1800px] mx-auto flex flex-col items-center gap-16 text-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-5 cursor-pointer"
          >
            <div className="p-4 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-2xl glow shadow-[var(--primary)]/10">
              <NeuralLogo />
            </div>
            <span className="text-4xl font-black italic tracking-tighter text-[var(--foreground)] uppercase bg-gradient-to-r from-emerald-400 to-amber-500 bg-clip-text text-transparent">BountiFi Protocol</span>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 text-[11px] font-black uppercase tracking-[0.4em] text-[var(--foreground)] opacity-40">
            {['Architecture', 'Simulation_Engine', 'Reputation_Oracle', 'Privacy_Policy', 'Autonomous_Terms'].map((item) => (
              <span
                key={item}
                onClick={() => setDocModal(item)}
                className="hover:text-[var(--primary)] cursor-pointer transition-all hover:tracking-[0.6em] duration-300"
              >
                {item}
              </span>
            ))}
          </div>

          <p className="max-w-3xl text-sm text-[var(--foreground)] opacity-60 font-medium leading-[2.2] uppercase tracking-widest text-[11px] font-black">
            BountiFi is the world's most advanced autonomous neural labor marketplace. <br />
            Engineered on the PinionOS decentralized kernel to bridge human capital requirements with AI agent capabilities.
          </p>

          <div className="text-[10px] font-black text-[var(--foreground)] opacity-40 font-mono tracking-[0.4em] uppercase bg-[var(--primary)]/5 px-12 py-4 rounded-full border border-[var(--primary)]/10 backdrop-blur-3xl shadow-2xl">
            © 2026 BOUNTIFI_LABS • PINION_HACKATHON_ULTRA_SUBMISSION
          </div>
        </div>
      </footer>
    </div >
  );
}
