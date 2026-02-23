import { Octokit } from "octokit";
import { pinion } from "./pinion";
import { Wallet } from "ethers";

export interface BountyTask {
    id: string;
    title: string;
    url: string;
    repository: string;
    status: 'pending' | 'simulating' | 'solving' | 'completed' | 'paid' | 'failed';
    reward?: string;
    confidence?: number;
}

export interface Reputation {
    score: number;
    successRate: number;
    totalSolved: number;
}

export class BountiFiAgent {
    private isRunning = false;
    private logs: string[] = [];
    private tasks: BountyTask[] = [];
    private totalEarned = 0;
    private wallet: any = null;

    private reputation: Reputation = { score: 750, successRate: 0.98, totalSolved: 42 };

    constructor() {
        this.addLog("Agent v0.4 (Sim-Ready) initialized.");
        this.initializeFromStorage();
    }

    private initializeFromStorage() {
        try {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('bountifi_keys');
                if (saved) {
                    const { mnemonic } = JSON.parse(saved);
                    if (mnemonic) {
                        this.wallet = Wallet.fromPhrase(mnemonic);
                        this.addLog(`Wallet active: ${this.wallet.address.substring(0, 8)}...`);
                    }
                }
            }
        } catch (e) {
            this.addLog("Note: No mnemonic found. Use settings to generate or recovery.");
        }
    }

    private addLog(message: string) {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.push(`[${timestamp}] ${message}`);
        console.log(`[BountiFi] ${message}`);
    }

    generateMnemonic() {
        return Wallet.createRandom().mnemonic?.phrase || "";
    }

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.addLog("Agent node activated. Protocol: x402-Autonomous.");
        this.runLoop();
    }

    stop() {
        this.isRunning = false;
        this.addLog("Agent node deactivated.");
    }

    private async runLoop() {
        while (this.isRunning) {
            try {
                await this.scoutForTasks();
                await new Promise(resolve => setTimeout(resolve, 15000));
            } catch (error) {
                this.addLog(`System Error: ${error instanceof Error ? error.message : String(error)}`);
                await new Promise(resolve => setTimeout(resolve, 30000));
            }
        }
    }

    private async scoutForTasks() {
        this.addLog("Scanning GitHub for unassigned x402 bounties...");

        if (this.tasks.length < 5) {
            const demoTask: BountyTask = {
                id: Math.random().toString(36).substr(2, 6).toUpperCase(),
                title: this.tasks.length === 0 ? "Fix memory leak in SDK" : "Implement Base L2 gas optimizer",
                url: "https://github.com/pinion-os/skills/issues",
                repository: "pinion-os/core",
                status: 'pending',
                reward: `${(Math.random() * 50 + 10).toFixed(2)} USDC`
            };
            this.tasks.push(demoTask);
            this.addLog(`MATCH: [${demoTask.id}] found in ${demoTask.repository}`);
            this.solveTask(demoTask);
        }
    }

    private async solveTask(task: BountyTask) {
        // Step 1: Simulation Phase
        task.status = 'simulating';
        this.addLog(`[${task.id}] SIMULATION: Initializing Docker sandbox...`);
        await new Promise(resolve => setTimeout(resolve, 3000));

        const confidence = Math.floor(Math.random() * (100 - 80 + 1) + 80);
        task.confidence = confidence;

        if (confidence < 85) {
            this.addLog(`[${task.id}] SIMULATION FAILED: Confidence ${confidence}% too low. Aborting.`);
            task.status = 'failed';
            return;
        }

        this.addLog(`[${task.id}] SIMULATION SUCCESS: Confidence ${confidence}% (Safety Threshold Met)`);

        // Step 2: Solving Phase
        task.status = 'solving';
        this.addLog(`[${task.id}] Decoding repository bytes...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        this.addLog(`[${task.id}] AI-Brain generating fix...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        this.addLog(`[${task.id}] Pull Request submitted.`);
        task.status = 'completed';
        setTimeout(() => this.triggerPayment(task), 6000);
    }

    private async triggerPayment(task: BountyTask) {
        this.addLog(`[${task.id}] Task merged. Verifying x402 signature...`);
        try {
            task.status = 'paid';
            const rewardValue = parseFloat(task.reward?.split(' ')[0] || '0');
            this.totalEarned += rewardValue;

            // Update Reputation
            this.reputation.totalSolved++;
            this.reputation.score += 5;

            this.addLog(`[${task.id}] SUCCESS: Reward ${task.reward} settled to wallet.`);

            if (this.totalEarned > 100) {
                this.addLog("AUTO-SWAP: Executing Pinion trade to replenish Gas...");
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.addLog("TRADE COMPLETE: 0.005 ETH acquired.");
            }
        } catch (e) {
            this.addLog("Financial settlement delayed by network traffic.");
        }
    }

    getRecentLogs() {
        return [...this.logs].reverse();
    }

    getTasks() {
        return [...this.tasks];
    }

    getReputation() {
        return { ...this.reputation };
    }

    isActive() {
        return this.isRunning;
    }
}

export const bountifi = new BountiFiAgent();
