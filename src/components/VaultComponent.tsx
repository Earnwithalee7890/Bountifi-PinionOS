"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Cpu, CreditCard, ArrowUpRight } from 'lucide-react';

interface VaultProps {
    treasury: {
        gasVault: number;
        operatingCapital: number;
        pinionCredits: number;
        totalFeesPaid: number;
    };
}

export const VaultComponent: React.FC<VaultProps> = ({ treasury }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                        <Shield size={20} className="text-orange-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white italic">Protocol_Treasury</h3>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Autonomous_Capital_Management</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                        v2.0_SOVEREIGN
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <Cpu size={16} className="text-orange-500 opacity-60" />
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">L2_Gas_Vault</span>
                    </div>
                    <p className="text-3xl font-black text-white italic tracking-tighter">{treasury.gasVault} <span className="text-sm font-bold opacity-40">ETH</span></p>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '45%' }}
                            className="h-full bg-orange-500"
                        />
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl group hover:border-emerald-500/30 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full -mr-10 -mt-10" />
                    <div className="flex items-center justify-between mb-4">
                        <CreditCard size={16} className="text-emerald-500 opacity-60" />
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Operating_Capital</span>
                    </div>
                    <p className="text-3xl font-black text-white italic tracking-tighter">${treasury.operatingCapital.toLocaleString()} <span className="text-sm font-bold opacity-40">USDC</span></p>
                    <div className="flex items-center gap-2 mt-4 text-emerald-500">
                        <TrendingUp size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">+12.4% vs Epoch_07</span>
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl group hover:border-purple-500/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp size={16} className="text-purple-500 opacity-60" />
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Pinion_Credits</span>
                    </div>
                    <p className="text-3xl font-black text-white italic tracking-tighter">{treasury.pinionCredits} <span className="text-sm font-bold opacity-40">pCR</span></p>
                    <div className="mt-4 flex gap-1">
                        {Array(10).fill(0).map((_, i) => (
                            <div key={i} className={`flex-1 h-1 rounded-full ${i < 6 ? 'bg-purple-500' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 bg-orange-600/10 border border-orange-500/20 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-orange-600/20 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center">
                        <ArrowUpRight size={20} className="text-orange-400 group-hover:rotate-45 transition-transform" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">Autonomous_Replenish_Active</p>
                        <p className="text-xs font-bold text-zinc-400">AI automatically acquires Gas from rewards when balance &lt; 0.1 ETH</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[11px] font-black text-orange-400 uppercase tracking-widest">Synced</span>
                </div>
            </div>
        </div>
    );
};
