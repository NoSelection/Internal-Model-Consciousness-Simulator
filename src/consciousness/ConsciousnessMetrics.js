const GlobalWorkspace = require('./GlobalWorkspace');
const IntegrationMeasure = require('./IntegrationMeasure');
const MetaCognition = require('./MetaCognition');

class ConsciousnessMetrics {
    constructor(agent) {
        this.agent = agent;
        this.gw = agent.globalWorkspace;
        this.integration = agent.integrationMeasure;
        this.meta = agent.metaCognition;
    }

    getMetrics() {
        const gwStats = this.gw.getStats();
        const phiStats = this.integration.getMetrics();
        const metaStats = this.meta.getMetrics();

        // Calculate Unified Consciousness Index (UCI)
        // Normalized Phi (approx 0-2 range usually)
        const normPhi = Math.min(1, phiStats.phi_approx); 
        
        // GW Activity (normalized)
        const normGW = Math.min(1, gwStats.totalBroadcasts / 100); // Activity level
        
        // Metacognitive Alignment
        const normMeta = metaStats.calibration;

        const uci = (0.4 * normPhi) + (0.3 * normGW) + (0.3 * normMeta);

        return {
            UCI: uci.toFixed(3),
            layers: {
                L1_Integration: {
                    phi: phiStats.phi_approx.toFixed(3),
                    index: phiStats.integration_index.toFixed(3)
                },
                L2_GlobalWorkspace: {
                    broadcasts: gwStats.totalBroadcasts,
                    active_coalitions: gwStats.currentCoalitions,
                    threshold: metaStats.alertness.toFixed(2)
                },
                L3_MetaCognition: {
                    focus: metaStats.focus,
                    accuracy: metaStats.calibration.toFixed(2)
                }
            }
        };
    }
}

module.exports = ConsciousnessMetrics;