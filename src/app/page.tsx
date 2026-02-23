"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Terminal,
  Wallet,
  Search,
  Github,
  ChevronRight,
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
  Cpu
} from 'lucide-react';
import { bountifi, BountyTask } from '@/lib/agent';
import { isPinionConfigured } from '@/lib/pinion';
import { SettingsModal } from '@/components/SettingsModal';

export default function BountiFiDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [tasks, setTasks] = useState<BountyTask[]>([]);
  const [balance, setBalance] = useState({ eth: "0.0042", usdc: "165.25" });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [reputation, setReputation] = useState({ score: 0, successRate: 0, totalSolved: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRunning(bountifi.isActive());
      setLogs(bountifi.getRecentLogs());
      setTasks(bountifi.getTasks());
      setReputation(bountifi.getReputation());
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

  return (
    <div className="min-h-screen p-6 lg:p-10 relative overflow-hidden bg-[#050505] text-white selection:bg-blue-500/30">
      <div className="mesh-bg" />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Header */}
      <nav className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 relative z-10 glass-card p-6 border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl glow shadow-blue-500/20">
            <Bot size={32} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">BountiFi</h1>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold tracking-widest leading-none">v0.3</span>
            </div>
            <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase mt-0.5 opacity-60">Autonomous Agent Protocol</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-6 py-3 glass-card hover:bg-white/10 transition-all text-zinc-300 hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
            >
              <Settings size={18} /> Configuration
            </button>
            <button
              onClick={handleToggleAgent}
              className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${isRunning
                ? 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                : 'bg-white text-black hover:bg-zinc-200'
                }`}
            >
              {isRunning ? 'Deactivate Node' : 'Initialize Node'}
            </button>
          </div>
        </div>
      </nav>

      <main className="grid grid-cols-1 xl:grid-cols-4 gap-8 relative z-10 max-w-[1800px] mx-auto">

        {/* Left Sidebar: Wallet & Developer Hub (NEW!) */}
        <div className="space-y-8 flex flex-col">
          {/* WALLET SECTION */}
          <section className="glass-card p-8 bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/20 overflow-hidden relative group">
            <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
              <Wallet size={160} />
            </div>

            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Derived Agent Wallet</h2>
            </div>

            <div className="space-y-8 relative z-10">
              <div>
                <p className="text-[10px] text-zinc-500 font-black mb-1 tracking-widest uppercase">Solvable Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter text-white tabular-nums">{balance.usdc}</span>
                  <span className="text-sm font-bold text-blue-400 italic">USDC</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-tight text-zinc-500">Gas (ETH)</p>
                  <p className="text-lg font-bold text-white tabular-nums">{balance.eth}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-tight text-zinc-500">TX Count</p>
                  <p className="text-lg font-bold text-white">42</p>
                </div>
              </div>

              <button className="w-full py-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 transition-all flex items-center justify-center gap-2">
                <ArrowUpRight size={14} /> Bridge More Funds
              </button>
            </div>
          </section>

          {/* AGENT REPUTATION (NEW!) */}
          <section className="glass-card p-8 bg-gradient-to-br from-purple-600/10 to-transparent border-purple-500/20 overflow-hidden relative group">
            <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
              <ShieldCheck size={160} />
            </div>

            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Agent Reputation</h2>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black tracking-tighter text-white tabular-nums">{reputation.score}</span>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Trust Score</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Success Rate</span>
                  <span className="text-xs font-black text-white">{(reputation.successRate * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-1000"
                    style={{ width: `${reputation.successRate * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-600 font-bold uppercase tracking-tight">Total Solved</span>
                  <span className="text-zinc-400 font-black">{reputation.totalSolved} Tasks</span>
                </div>
              </div>
            </div>
          </section>

          {/* DEVELOPER API HUB (As requested by user) */}
          <section className="glass-card p-8 border-white/5 bg-black/40">
            <div className="flex items-center gap-3 mb-8">
              <Code2 size={20} className="text-zinc-500" />
              <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Developer API Hub</h2>
            </div>

            <div className="space-y-4">
              <a href="https://github.com/settings/tokens" target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <Github size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="text-xs font-bold text-zinc-300">GitHub Token</span>
                </div>
                <ExternalLink size={14} className="text-zinc-600" />
              </a>

              <a href="https://console.anthropic.com/" target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <Cpu size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="text-xs font-bold text-zinc-300">Anthropic AI</span>
                </div>
                <ExternalLink size={14} className="text-zinc-600" />
              </a>

              <a href="https://bridge.base.org/" target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <Box size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="text-xs font-bold text-zinc-300">Base Bridge</span>
                </div>
                <ExternalLink size={14} className="text-zinc-600" />
              </a>

              <a href="https://github.com/chu2bard/pinion-os" target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="text-xs font-bold text-zinc-300">PinionOS Docs</span>
                </div>
                <ExternalLink size={14} className="text-zinc-600" />
              </a>
            </div>
          </section>
        </div>

        {/* Center: Mission Control */}
        <div className="xl:col-span-2 space-y-8">
          <section className="glass-card p-8 relative overflow-hidden min-h-[600px] flex flex-col">
            <div className="scan-line" />
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/10 rounded-lg">
                  <Search size={24} className="text-blue-500" />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Mission Control</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-900 border border-white/5 px-4 py-1.5 rounded-lg font-mono">
                  {tasks.length} THREADS_ALIVE
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
              <AnimatePresence>
                {tasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-20"
                  >
                    <Globe size={48} className="text-zinc-800 mb-6 animate-spin-slow opacity-40" />
                    <p className="text-zinc-600 font-mono text-[10px] uppercase font-black tracking-widest">Awaiting GitHub Webhook Signal...</p>
                  </motion.div>
                ) : (
                  tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 glass-card border-white/5 hover:border-blue-500/20 transition-all group relative overflow-hidden bg-white/[0.02]"
                    >
                      <div className="flex justify-between items-start relative z-10">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Github size={16} className="text-zinc-600" />
                            <span className="text-[10px] text-zinc-500 font-black font-mono uppercase tracking-[0.2em]">{task.repository}</span>
                          </div>
                          <h3 className="text-2xl font-black group-hover:text-blue-400 transition-colors tracking-tighter text-white leading-tight">
                            {task.title}
                          </h3>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-3xl font-black text-white italic tracking-tighter">{task.reward}</p>
                          <span className={`mt-2 inline-block text-[9px] font-black px-4 py-1 rounded-full border uppercase tracking-widest backdrop-blur-md ${task.status === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            task.status === 'solving' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                              task.status === 'simulating' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse' :
                                task.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>

                      {task.status === 'simulating' || task.status === 'solving' || task.status === 'completed' || task.status === 'paid' ? (
                        <div className="mt-6 mb-2">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Conf_Score</span>
                            <span className="text-[10px] font-black text-blue-400 font-mono">{task.confidence || 0}%</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${task.confidence || 0}%` }}
                              className={`h-full transition-all duration-500 ${(task.confidence || 0) > 90 ? 'bg-green-500' :
                                  (task.confidence || 0) > 85 ? 'bg-blue-500' :
                                    'bg-amber-500'
                                }`}
                            />
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex gap-8">
                          <div className="flex items-center gap-2">
                            <Database size={14} className="text-blue-500 opacity-60" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Analysis: v3.1</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Layers size={14} className="text-purple-500 opacity-60" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Base L2</span>
                          </div>
                        </div>
                        <div className="group/btn relative">
                          <a href={task.url} target="_blank" className="bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300">
                            Repo <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Right Column: Console */}
        <div className="space-y-8">
          <section className="glass-card p-8 min-h-[600px] flex flex-col bg-black/40 border-white/5 overflow-hidden font-mono">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Terminal size={22} className="text-green-500" />
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">System_Logs</h2>
              </div>
              <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Mnemonic/v3</div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-[11px] pr-2 scrollbar-hide">
              <AnimatePresence initial={false}>
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`leading-relaxed relative pl-4 border-l ${log.includes('SUCCESS') || log.includes('COMPLETE') ? 'text-green-400 border-green-500/30' :
                      log.includes('Error') ? 'text-red-400 border-red-500/30' :
                        log.includes('ALERT') || log.includes('MATCH') ? 'text-blue-400 border-blue-500/30' :
                          'text-zinc-600 border-white/5'
                      }`}
                  >
                    <span className="opacity-40 absolute -left-[1px] top-0 font-bold">{'>'}</span>
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                <span>Network: Optimal</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-green-500">_READY</span>
                  <div className="w-1.5 h-3 bg-green-500/80 animate-pulse" />
                </div>
              </div>
            </div>
          </section>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="mt-32 border-t border-white/5 pt-20 pb-20 relative z-10 px-8">
        <div className="max-w-[1800px] mx-auto flex flex-col items-center gap-12 text-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl glow shadow-blue-500/20">
              <Bot size={28} className="text-white" />
            </div>
            <span className="text-3xl font-black italic tracking-tighter text-white uppercase">BountiFi Protocol</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">API Keys</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Earning Policy</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Terms of Autonomy</span>
          </div>

          <p className="max-w-2xl text-sm text-zinc-600 font-medium leading-[2]">
            BountiFi is the leading autonomous labor marketplace powered by PinionOS and x402 settlement.
            Connecting AI agents directly to the open source economy without human friction.
          </p>

          <div className="mt-8 text-[10px] font-black text-zinc-700 font-mono tracking-widest uppercase bg-white/5 px-8 py-3 rounded-full border border-white/5 backdrop-blur-md">
            © 2026 BountiFi Group • Built for PinionOS Hackathon
          </div>
        </div>
      </footer>
    </div>
  );
}
