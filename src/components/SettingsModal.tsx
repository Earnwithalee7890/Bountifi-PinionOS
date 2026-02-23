"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Github, Cpu, Save, ShieldCheck, Copy, RefreshCw, AlertTriangle } from 'lucide-react';
import { bountifi } from '@/lib/agent';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [keys, setKeys] = useState({
        mnemonic: '',
        githubToken: '',
        anthropicKey: ''
    });
    const [showSeed, setShowSeed] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('bountifi_keys');
        if (saved) {
            setKeys(JSON.parse(saved));
        }
    }, []);

    const generateNew = () => {
        const phrase = bountifi.generateMnemonic();
        setKeys({ ...keys, mnemonic: phrase });
        setShowSeed(true);
    };

    const handleSave = () => {
        localStorage.setItem('bountifi_keys', JSON.stringify(keys));
        alert("Configurations saved. Agent restarting...");
        window.location.reload();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[var(--background)]/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-xl glass-card p-6 md:p-10 border-[var(--glass-border)] shadow-2xl bg-[var(--panel-bg)]/80"
                    >
                        <div className="flex justify-between items-center mb-6 md:mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <ShieldCheck className="text-blue-400" size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black italic tracking-tight uppercase text-[var(--foreground)]">Agent Security</h2>
                                    <p className="text-[var(--foreground)] opacity-40 text-[10px] uppercase font-bold tracking-widest">v0.3 Secure Configuration</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-[var(--foreground)]/5 rounded-full transition-colors text-[var(--foreground)] opacity-40">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Mnemonic Section */}
                            <div className="p-6 rounded-2xl bg-[var(--background)]/20 border border-[var(--glass-border)]">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-[var(--foreground)] opacity-40 uppercase tracking-[0.2em]">
                                        <Key size={14} className="text-blue-400" /> 12-Word Seed Phrase
                                    </label>
                                    <button
                                        onClick={generateNew}
                                        className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                                    >
                                        <RefreshCw size={12} /> Generate New
                                    </button>
                                </div>

                                {keys.mnemonic ? (
                                    <div className="relative group">
                                        <div className="bg-[var(--background)]/60 border border-[var(--glass-border)] rounded-xl p-4 font-mono text-sm leading-relaxed text-[var(--foreground)] opacity-80 min-h-[80px] break-words">
                                            {keys.mnemonic}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(keys.mnemonic)}
                                            className="absolute top-2 right-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-all"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-black/40 border border-dashed border-white/10 rounded-xl p-6 text-center">
                                        <p className="text-sm text-zinc-600 italic">No wallet configured. Generate a new one or paste your existing seed phrase here.</p>
                                    </div>
                                )}

                                <div className="mt-4 flex items-start gap-2 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                                    <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                    <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">NEVER share these words. Anyone with this phrase can access your agent's funds and solve bounties as you.</p>
                                </div>
                            </div>

                            {/* API Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-black text-[var(--foreground)] opacity-40 uppercase mb-2 tracking-widest">
                                        <Github size={14} /> GitHub Token
                                    </label>
                                    <input
                                        type="password"
                                        value={keys.githubToken}
                                        onChange={(e) => setKeys({ ...keys, githubToken: e.target.value })}
                                        placeholder="ghp_..."
                                        className="w-full bg-[var(--background)]/20 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all font-mono text-[var(--foreground)]"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-black text-[var(--foreground)] opacity-40 uppercase mb-2 tracking-widest">
                                        <Cpu size={14} /> Anthropic Key
                                    </label>
                                    <input
                                        type="password"
                                        value={keys.anthropicKey}
                                        onChange={(e) => setKeys({ ...keys, anthropicKey: e.target.value })}
                                        placeholder="sk-ant-..."
                                        className="w-full bg-[var(--background)]/20 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all font-mono text-[var(--foreground)]"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full mt-6 md:mt-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98]"
                        >
                            <Save size={20} /> Deploy Mnemonic Node
                        </button>

                        <p className="text-center text-[10px] text-zinc-600 font-bold mt-6 uppercase tracking-widest">
                            Secured by PinionOS Facilitator Protocol
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
