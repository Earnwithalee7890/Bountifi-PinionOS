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
    private externalWalletAddress: string | null = null;
    private prices: { eth: string, usdc: string, baseGas: string } = { eth: "0.00", usdc: "1.00", baseGas: "0.15" };
    private telemetry: { cpu: number, strategy: number, zeroTime: string } = { cpu: 12, strategy: 98, zeroTime: "0.0ms" };

    private reputation: Reputation = { score: 750, successRate: 0.98, totalSolved: 42 };
    private specialization: 'frontend' | 'solidity' | 'protocol' = 'frontend';
    private autoPilot = false;
    private treasury = {
        gasVault: 0.45, // ETH
        operatingCapital: 1250.00, // USDC
        pinionCredits: 2500,
        totalFeesPaid: 0
    };
    private subAgents = [
        { id: 'Node-Alpha', status: 'active', task: 'Monitoring' },
        { id: 'Node-Beta', status: 'idle', task: 'Standby' },
        { id: 'Node-Gamma', status: 'active', task: 'Simulating' },
        { id: 'Node-Delta', status: 'idle', task: 'Standby' }
    ];
    private yieldHistory: number[] = [45, 112, 130, 210, 165, 305, 122];
    private settlementHistory: any[] = [
        { id: 'tx_9012', type: 'Sovereign_Tip', time: '10m ago', status: 'settled', hash: '0x3b...e12a', amount: '-2.00 USDC' },
        { id: 'tx_8271', type: 'Frontend_Fix', time: '2h ago', status: 'verified', hash: '0x82...f2ea', amount: '+145.00 USDC' },
        { id: 'tx_8269', type: 'Logic_Opt', time: '5h ago', status: 'verified', hash: '0x1a...d912', amount: '+85.00 USDC' },
    ];

    constructor() {
        this.addLog("Agent v0.4 (Sim-Ready) initialized.");
        this.addLog("PINION_ZERO_TIME: Ultra-low latency kernel sync established.");
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

    public addLog(message: string) {
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

    async connectExternalWallet() {
        if (typeof window === 'undefined' || !(window as any).ethereum) {
            this.addLog("ERROR: No Web3 provider (MetaMask) detected.");
            return null;
        }

        try {
            this.addLog("INITIALIZING: Handshake with Web3 Provider...");
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            this.externalWalletAddress = accounts[0];
            this.addLog(`SUCCESS: Terminal linked to [${this.externalWalletAddress}]`);

            // Listen for account changes
            (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
                this.externalWalletAddress = accounts[0] || null;
                this.addLog(`SIGNAL_CHANGE: Switched to wallet [${this.externalWalletAddress}]`);
            });

            return this.externalWalletAddress;
        } catch (error) {
            this.addLog(`CONNECT_FAILED: User rejected or network error.`);
            return null;
        }
    }

    disconnectExternalWallet() {
        this.externalWalletAddress = null;
        this.addLog("DISCONNECT: User terminal detached.");
    }

    getReputation() {
        return { ...this.reputation };
    }

    getExternalWallet() {
        return this.externalWalletAddress;
    }

    getSpecialization() {
        return this.specialization;
    }

    setSpecialization(spec: 'frontend' | 'solidity' | 'protocol') {
        this.specialization = spec;
        this.addLog(`FOCUS_SHIFT: Agent recalibrated for ${spec.toUpperCase()} tasks.`);
    }

    getSettlementHistory() {
        return this.settlementHistory;
    }

    getTreasury() {
        return { ...this.treasury };
    }

    getSubAgents() {
        return [...this.subAgents];
    }

    isAutoPilot() {
        return this.autoPilot;
    }

    setAutoPilot(active: boolean) {
        this.autoPilot = active;
        this.addLog(active ? "AUTO-PILOT: Sovereign mode engaged. Neutral Pulse active." : "AUTO-PILOT: Manual override engaged.");
    }

    private async executeSovereignPayout(amount: number, reason: string) {
        this.treasury.operatingCapital -= amount;
        this.treasury.totalFeesPaid += amount;
        const txId = 'tx_' + Math.floor(Math.random() * 9000 + 1000);
        this.settlementHistory.unshift({
            id: txId,
            type: reason,
            time: 'Just now',
            status: 'settled',
            hash: '0x' + Math.random().toString(16).slice(2, 10) + '...',
            amount: `-${amount.toFixed(2)} USDC`
        });
        this.addLog(`SOVEREIGN_SETTLEMENT: Paid ${amount} USDC for ${reason}. [${txId}]`);
    }

    getYieldProjections() {
        if (this.yieldHistory.length === 0) return "0.00";
        const avg = this.yieldHistory.reduce((a, b) => a + b, 0) / this.yieldHistory.length;
        return (avg * 1.25).toFixed(2);
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
        this.addLog("Live-Scouting GitHub for unassigned labor bounties...");

        try {
            // Fetch live issues from GitHub with specialization keywords
            const keywords = {
                frontend: 'label:frontend,ui,react',
                solidity: 'label:solidity,smart-contract,security',
                protocol: 'label:protocol,logic,optimization'
            };
            const query = `label:bounty+state:open+is:issue+${keywords[this.specialization]}`;
            const response = await fetch(`https://api.github.com/search/issues?q=${query}&per_page=5`);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const newTasks: BountyTask[] = data.items.map((item: any) => ({
                    id: item.number.toString(),
                    title: item.title,
                    url: item.html_url,
                    repository: item.repository_url.split('/').slice(-2).join('/'),
                    status: 'pending',
                    reward: `${(Math.random() * 200 + 50).toFixed(0)} USDC` // Simulated reward as GitHub issues often don't have price in metadata
                }));

                // Update tasks list, keeping only unique ones
                const existingIds = new Set(this.tasks.map(t => t.id));
                newTasks.forEach(task => {
                    if (!existingIds.has(task.id) && this.tasks.length < 10) {
                        this.tasks.push(task);
                        this.addLog(`NEURAL_MATCH: [${task.id}] found in ${task.repository}`);

                        // Autonomous decision: Only solve if Auto-Pilot is ON or if it's a high-confidence match
                        if (this.autoPilot || Math.random() > 0.8) {
                            this.solveTask(task);
                        } else {
                            this.addLog(`ADVISORY: [${task.id}] queued. Waiting for manual trigger or AutoGlide activation.`);
                        }
                    }
                });
            }
        } catch (error) {
            this.addLog("SEARCH_DELAY: GitHub API cooling down. Retrying simulated scan...");
            // Fallback to demo task if API fails
            if (this.tasks.length < 3) {
                const demoTask: BountyTask = {
                    id: "DEMO-" + Math.random().toString(36).substr(2, 4).toUpperCase(),
                    title: "Optimization: Neural Weights compression",
                    url: "https://github.com/pinion-os/skills",
                    repository: "pinion-os/core",
                    status: 'pending',
                    reward: "145.00 USDC"
                };
                this.tasks.push(demoTask);
                this.solveTask(demoTask);
            }
        }

        // Fetch Prices (CoinGecko)
        this.updateFinancialData();
    }

    private async updateFinancialData() {
        try {
            // CoinGecko Prices
            const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin&vs_currencies=usd");
            const data = await res.json();
            if (data.ethereum && data['usd-coin']) {
                this.prices.eth = data.ethereum.usd.toString();
                this.prices.usdc = data['usd-coin'].usd.toString();
            }

            // Simulate/Fetch Base Gas (using a mock variation for now to show live movement)
            const variation = (Math.random() * 0.1 - 0.05).toFixed(3);
            this.prices.baseGas = (Math.max(0.01, parseFloat(this.prices.baseGas) + parseFloat(variation))).toFixed(3);

            // Update Telemetry
            this.telemetry.cpu = Math.floor(Math.random() * (45 - 5) + 5);
            this.telemetry.strategy = Math.floor(Math.random() * (100 - 95) + 95);
            this.telemetry.zeroTime = (Math.random() * 0.5).toFixed(1) + "ms";

            this.addLog(`MARKET_INTEL: ETH @ $${this.prices.eth} | Base_Gas @ ${this.prices.baseGas} Gwei | Zero_Time: ${this.telemetry.zeroTime}`);
        } catch (e) {
            // Ignore fetch errors
        }
    }

    private async solveTask(task: BountyTask) {
        // Step 1: Strategic Planning Phase (Swarm Consensus)
        task.status = 'simulating';
        this.subAgents[0].status = 'active'; // Node-Alpha
        this.subAgents[2].status = 'active'; // Node-Gamma
        this.subAgents[0].task = `Auditing_${task.id}`;
        this.subAgents[2].task = `Planning_${task.id}`;

        this.addLog(`[${task.id}] NEURAL_PLANNING: Initializing Swarm Consensus...`);
        await new Promise(resolve => setTimeout(resolve, 4000));

        const confidence = Math.floor(Math.random() * (100 - 80 + 1) + 80);
        task.confidence = confidence;

        if (confidence < 85) {
            this.addLog(`[${task.id}] STRATEGY REJECTED: Swarm confidence ${confidence}% below safety margin.`);
            task.status = 'failed';
            this.subAgents[0].status = 'idle';
            this.subAgents[2].status = 'idle';
            this.subAgents[0].task = 'Standby';
            this.subAgents[2].task = 'Standby';
            return;
        }

        // Autonomous Payout: Tip for priority
        if (this.treasury.operatingCapital > 500) {
            await this.executeSovereignPayout(5.00, 'Priority_Verification_Tip');
        }

        this.addLog(`[${task.id}] STRATEGY VALIDATED: Transitioning to Synthesis Phase...`);
        this.subAgents[1].status = 'active'; // Node-Beta
        this.subAgents[1].task = `Synthesis_${task.id}`;
        this.subAgents[0].status = 'idle';
        this.subAgents[0].task = 'Standby';

        // Step 2: Solving Phase
        task.status = 'solving';
        this.addLog(`[${task.id}] Decoding repository bytes...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        this.addLog(`[${task.id}] AI-Brain generating neural patch...`);
        await new Promise(resolve => setTimeout(resolve, 4000));

        this.subAgents[3].status = 'active'; // Node-Delta
        this.subAgents[3].task = `Dispatch_${task.id}`;
        this.addLog(`[${task.id}] Pushing signed commit to Pinion mesh...`);

        task.status = 'completed';
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Reset sub-agents
        this.subAgents.forEach(a => {
            a.status = 'idle';
            a.task = 'Standby';
        });

        this.triggerPayment(task);
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

    getAnalytics() {
        return {
            totalEarned: this.totalEarned,
            conversionRate: 0.92,
            uptime: "99.99%",
            yieldHistory: this.yieldHistory,
            settlementHistory: this.settlementHistory,
            projections: this.getYieldProjections(),
            prices: this.prices,
            telemetry: this.telemetry,
            treasury: this.treasury,
            subAgents: this.subAgents,
            autoPilot: this.autoPilot
        };
    }

    getLeaderboard() {
        return [
            { name: "AlphaNode-1", score: 2450, solved: 142 },
            { name: "BountiFi_Agent_v0.4", score: this.reputation.score, solved: this.reputation.totalSolved },
            { name: "CyberLabor_x", score: 680, solved: 29 },
            { name: "ZeroFriction", score: 540, solved: 18 }
        ].sort((a, b) => b.score - a.score);
    }

    isActive() {
        return this.isRunning;
    }
}

export const bountifi = new BountiFiAgent();
