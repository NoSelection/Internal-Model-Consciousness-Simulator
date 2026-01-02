/**
 * Layer 1: Integration Measure (IIT-inspired)
 * Tracks information flow between modules to compute approximate Φ (Phi).
 */
class IntegrationMeasure {
    constructor() {
        // State history for each module (for entropy calculations)
        this.moduleStates = new Map();
        
        // Pairwise metrics
        this.informationFlows = new Map(); // Key: "ModuleA->ModuleB"
        
        // System-wide metrics
        this.metrics = {
            phi_approx: 0,
            integration_index: 0,
            total_system_entropy: 0
        };
        
        // Configuration
        this.historyLength = 50; // How many states to keep for entropy calc
        this.updateInterval = 10; // Update metrics every N records
        this.recordCount = 0;
    }

    /**
     * Record a state snapshot for a module
     * @param {string} moduleId - Name of the module
     * @param {Object} state - The state data (must be serializable)
     */
    recordModuleState(moduleId, state) {
        if (!this.moduleStates.has(moduleId)) {
            this.moduleStates.set(moduleId, []);
        }
        
        const history = this.moduleStates.get(moduleId);
        
        // Simplify state for entropy calculation (we can't use raw objects directly)
        // We hash or simplify the state to a categorical value or a vector
        const simplifiedState = this.simplifyState(state);
        
        history.push({
            timestamp: Date.now(),
            state: simplifiedState,
            rawState: state // Keep raw state if needed for debugging
        });
        
        if (history.length > this.historyLength) {
            history.shift();
        }
        
        this.recordCount++;
        if (this.recordCount % this.updateInterval === 0) {
            this.computeMetrics();
        }
    }

    /**
     * Convert complex state objects into a string or vector for entropy calculation
     */
    simplifyState(state) {
        // Simple hashing strategy: JSON stringify and take length + simple checksum
        // In a real implementation, this would be a feature vector
        try {
            const str = JSON.stringify(state);
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        } catch (e) {
            return 0;
        }
    }

    computeMetrics() {
        const modules = Array.from(this.moduleStates.keys());
        if (modules.length < 2) return;

        // 1. Compute Entropy H(X) for each module
        const entropies = new Map();
        for (const module of modules) {
            entropies.set(module, this.computeEntropy(this.moduleStates.get(module)));
        }

        // 2. Compute Joint Entropy H(X,Y) and Mutual Information I(X;Y) for pairs
        let sumPairwiseMI = 0;
        let pairCount = 0;

        for (let i = 0; i < modules.length; i++) {
            for (let j = i + 1; j < modules.length; j++) {
                const modA = modules[i];
                const modB = modules[j];
                
                const jointEntropy = this.computeJointEntropy(
                    this.moduleStates.get(modA),
                    this.moduleStates.get(modB)
                );
                
                const mi = entropies.get(modA) + entropies.get(modB) - jointEntropy;
                
                this.informationFlows.set(`${modA}->${modB}`, {
                    mutualInformation: Math.max(0, mi),
                    jointEntropy: jointEntropy
                });
                
                sumPairwiseMI += Math.max(0, mi);
                pairCount++;
            }
        }

        // 3. Compute System Integration (Approximate Φ)
        // Φ_approx = Integrated Information - Sum of Independent Information
        // A simple proxy: Average Pairwise Mutual Information
        // A better proxy: Total Correlation (Multi-information) = Sum(H(Xi)) - H(X1...Xn)
        
        // For now, we use the average pairwise MI as a robust proxy for integration
        // in this specific architecture where we care about module coupling.
        this.metrics.phi_approx = pairCount > 0 ? sumPairwiseMI / pairCount : 0;
        this.metrics.integration_index = this.metrics.phi_approx * Math.log(modules.length);
    }

    computeEntropy(history) {
        if (!history || history.length === 0) return 0;
        
        const counts = new Map();
        for (const item of history) {
            const key = item.state;
            counts.set(key, (counts.get(key) || 0) + 1);
        }
        
        let entropy = 0;
        const total = history.length;
        
        for (const count of counts.values()) {
            const p = count / total;
            entropy -= p * Math.log2(p);
        }
        
        return entropy;
    }

    computeJointEntropy(historyA, historyB) {
        if (!historyA || !historyB) return 0;
        
        const length = Math.min(historyA.length, historyB.length);
        if (length === 0) return 0;
        
        // Align histories (assuming they are roughly synced by push order)
        // ideally we'd sync by timestamp, but index is faster for this simulation
        const counts = new Map();
        
        for (let i = 0; i < length; i++) {
            // Combine states into a single key
            const key = `${historyA[i].state}|${historyB[i].state}`;
            counts.set(key, (counts.get(key) || 0) + 1);
        }
        
        let entropy = 0;
        
        for (const count of counts.values()) {
            const p = count / length;
            entropy -= p * Math.log2(p);
        }
        
        return entropy;
    }
    
    getMetrics() {
        return { ...this.metrics };
    }
}

module.exports = IntegrationMeasure;