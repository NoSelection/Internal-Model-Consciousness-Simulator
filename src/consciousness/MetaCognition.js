const InformationPacket = require('./InformationPacket');

/**
 * Layer 3: Meta-Cognition (HOT - Higher Order Thought)
 * Monitors the Global Workspace and generates "thoughts about thoughts".
 * Regulates the attention mechanisms of the system.
 */
class MetaCognition {
    constructor(globalWorkspace) {
        this.gw = globalWorkspace;
        
        // Internal state
        this.confidenceHistory = [];
        this.metacognitiveState = {
            currentFocus: null, // What we are "aware" of attending to
            confidence: 0,      // Confidence in current processing
            alertness: 0.5      // Regulates GW threshold
        };
        
        this.performanceCalibration = {
            predictedSuccess: 0,
            actualSuccess: 0
        };
    }

    /**
     * Called every simulation step
     */
    update() {
        // 1. Observe the Global Workspace (HOT: "I am aware that I am processing X")
        const currentBroadcast = this.gw.currentBroadcast;
        
        if (currentBroadcast) {
            this.metacognitiveState.currentFocus = currentBroadcast.metadata.type;
            
            // Generate a meta-representation
            const metaThought = new InformationPacket(
                'MetaCognition',
                {
                    about: currentBroadcast.id,
                    type: currentBroadcast.metadata.type,
                    assessment: 'processing'
                },
                0.3, // Low salience usually, unless something is wrong
                0.9,
                { type: 'meta-thought' }
            );
            
            // Occasionally submit meta-thoughts to GW (recursive consciousness)
            // "I am thinking about the fact that I see a danger"
            if (Math.random() < 0.05) { // Rare self-reflection
                this.gw.submit(metaThought);
            }
        }
        
        // 2. Regulate Attention (Top-down control)
        // If many coalitions are weak, lower threshold?
        // If too chaotic, raise threshold?
        const stats = this.gw.getStats();
        
        if (stats.currentCoalitions > 4) {
            // Too much noise, raise threshold to focus
            this.gw.ignitionThreshold = Math.min(0.9, this.gw.ignitionThreshold + 0.01);
        } else if (stats.currentCoalitions < 2 && stats.totalBroadcasts === 0) {
            // Too quiet, lower threshold to notice subtle things
            this.gw.ignitionThreshold = Math.max(0.3, this.gw.ignitionThreshold - 0.01);
        }
    }
    
    /**
     * Called when an action result is known
     * Used to calibrate confidence (Metacognitive Sensitivity)
     */
    recordOutcome(predictionConfidence, success) {
        this.confidenceHistory.push({
            confidence: predictionConfidence,
            success: success ? 1 : 0
        });
        
        if (this.confidenceHistory.length > 50) this.confidenceHistory.shift();
        
        this.calibrate();
    }
    
    calibrate() {
        if (this.confidenceHistory.length === 0) return;
        
        // Simple calibration: Do high confidence items actually succeed?
        const highConf = this.confidenceHistory.filter(i => i.confidence > 0.8);
        const highConfSuccess = highConf.reduce((sum, i) => sum + i.success, 0);
        
        const accuracyAtHighConf = highConf.length > 0 ? highConfSuccess / highConf.length : 0;
        
        // Metacognitive Accuracy: How well does confidence map to reality?
        // We update our internal confidence in our own judgment
        this.performanceCalibration.actualSuccess = accuracyAtHighConf;
    }

    getMetrics() {
        return {
            focus: this.metacognitiveState.currentFocus,
            alertness: this.gw.ignitionThreshold,
            calibration: this.performanceCalibration.actualSuccess
        };
    }
}

module.exports = MetaCognition;