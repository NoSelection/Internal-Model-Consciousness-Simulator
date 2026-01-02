/**
 * The Experimental Scalpel (Expanded).
 * Allows specific layers of the consciousness architecture to be "lesioned" (disabled)
 * to test theoretical predictions about blindsight, fragmentation, and integration.
 */
class AblationFramework {
    constructor() {
        this.backups = new Map();
    }

    /**
     * Applies a lesion to an agent instance.
     * @returns {Object} A state object used to restore the agent later.
     */
    applyLesion(agent, lesionType) {
        const state = { agent, lesionType, backups: [] };
        
        const backup = (obj, method) => {
            state.backups.push({ obj, method, original: obj[method] });
        };

        switch (lesionType) {
            case 'NO_METACOGNITION':
                // HOT Test: Synthetic Blindsight
                backup(agent.metaCognition, 'update');
                agent.metaCognition.update = () => {
                    agent.metaCognition.metacognitiveState.currentFocus = 'none (lesioned)';
                };
                backup(agent.metaCognition, 'recordOutcome');
                agent.metaCognition.recordOutcome = () => {};
                break;

            case 'NO_BROADCAST':
                // GWT Test: Fragmented Processing
                backup(agent.globalWorkspace, 'broadcast');
                agent.globalWorkspace.broadcast = () => {
                    agent.globalWorkspace.currentBroadcast = null;
                    agent.globalWorkspace.stats.totalBroadcasts++;
                };
                break;

            case 'NO_COMPETITION':
                // GWT Partial: Attention Deficit
                backup(agent.globalWorkspace, 'processCycle');
                agent.globalWorkspace.processCycle = function() {
                    if (this.coalitions.length === 0) return null;
                    // Instead of competition, just pick the LAST (newest) item regardless of salience
                    const winner = this.coalitions[this.coalitions.length - 1];
                    this.broadcast(winner);
                    return winner.packet;
                };
                break;

            case 'NO_INTEGRATION':
                // IIT Test: Integration Blindness
                backup(agent.integrationMeasure, 'recordModuleState');
                agent.integrationMeasure.recordModuleState = () => {};
                backup(agent.integrationMeasure, 'computeMetrics');
                agent.integrationMeasure.computeMetrics = () => {
                    agent.integrationMeasure.metrics.phi_approx = 0;
                    agent.integrationMeasure.metrics.integration_index = 0;
                };
                break;

            case 'ISOLATED_MODULES':
                // Extreme: Consciousness Dissolution
                this.applyLesion(agent, 'NO_BROADCAST');
                this.applyLesion(agent, 'NO_INTEGRATION');
                break;

            case 'FULL_CONSCIOUSNESS':
            default:
                // Baseline: Do nothing
                break;
        }

        return state;
    }

    restoreLesion(state) {
        state.backups.forEach(({ obj, method, original }) => {
            obj[method] = original;
        });
    }

    async runExperiment(agent, lesionType, steps, stepFn) {
        const state = this.applyLesion(agent, lesionType);
        const metricsHistory = [];

        for (let i = 0; i < steps; i++) {
            await stepFn();
            metricsHistory.push(agent.getStatus().consciousness);
        }

        this.restoreLesion(state);
        return this.summarizeResults(lesionType, metricsHistory);
    }

    summarizeResults(type, history) {
        const avg = (fn) => history.reduce((s, m) => s + parseFloat(fn(m)), 0) / history.length;
        
        return {
            condition: type,
            avgUCI: avg(m => m.UCI),
            avgPhi: avg(m => m.layers.L1_Integration.phi),
            broadcasts: history[history.length - 1].layers.L2_GlobalWorkspace.broadcasts,
            metaAccuracy: avg(m => m.layers.L3_MetaCognition.accuracy)
        };
    }
}

module.exports = AblationFramework;